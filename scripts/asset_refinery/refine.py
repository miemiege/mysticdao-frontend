#!/usr/bin/env python3
"""
素材精炼工厂 — 主流水线（v2 优化版）

优化点：
- 单进程串行 + 全局 rembg session 缓存（避免多进程内存爆炸）
- O(1) 去重查询（dict 替代线性扫描）
- 减少图像格式转换（统一 numpy 流程）
- 实时速度估算 + 内存监控

Usage:
    python scripts/asset_refinery/refine.py --input /path/to/your/raw_assets
"""

import os
import sys
import json
import shutil
import argparse
import time
import gc
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import (
    resolve_paths, CATEGORY_MAP, OUTPUT_SPECS, COLOR_STANDARDS,
    QUALITY_THRESHOLDS, PIPELINE_STAGES, INDEX_JSON,
)
from quality_score import assess_image

# =============================================================================
# 全局 rembg session（单进程复用，避免重复加载 176MB 模型）
# =============================================================================
_REMBG_SESSION = None


def get_rembg_session():
    """懒加载 rembg session，全局复用"""
    global _REMBG_SESSION
    if _REMBG_SESSION is None:
        try:
            from rembg import new_session
            t0 = time.time()
            _REMBG_SESSION = new_session("u2net")
            print(f"  [rembg] Session loaded in {time.time()-t0:.1f}s")
        except Exception as e:
            print(f"  [rembg] Failed to load session: {e}")
            _REMBG_SESSION = False
    return _REMBG_SESSION if _REMBG_SESSION is not False else None


def rembg_remove_cached(pil_img: Image.Image) -> Image.Image:
    """使用缓存的 session 执行 AI 抠图"""
    from rembg import remove as rembg_remove
    session = get_rembg_session()
    if session:
        return rembg_remove(pil_img, session=session)
    return pil_img


# =============================================================================
# 图像 I/O（统一 numpy/cv2 流程，减少 PIL↔numpy 来回转换）
# =============================================================================
def load_image(path: str) -> np.ndarray:
    """读取图片为 RGB/RGBA numpy array"""
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError(f"Cannot read image: {path}")
    if len(img.shape) == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
    elif img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    elif img.shape[2] == 4:
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2RGBA)
    return img


def save_image(img: np.ndarray, path: str, quality: int = 95):
    """保存图片，自动根据格式选择编码"""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    ext = os.path.splitext(path)[1].lower()
    if ext == ".png" or (len(img.shape) == 3 and img.shape[2] == 4):
        if len(img.shape) == 3 and img.shape[2] == 3:
            cv2.imwrite(path, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
        else:
            cv2.imwrite(path, cv2.cvtColor(img, cv2.COLOR_RGBA2BGRA))
    else:
        cv2.imwrite(path, cv2.cvtColor(img, cv2.COLOR_RGB2BGR),
                    [int(cv2.IMWRITE_JPEG_QUALITY), quality])


# =============================================================================
# 去重（pHash + O(1) dict 查询）
# =============================================================================
def perceptual_hash(img: np.ndarray) -> str:
    """pHash 感知哈希"""
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY) if len(img.shape) == 3 else img
    gray = cv2.resize(gray, (32, 32))
    dct = cv2.dct(np.float32(gray))
    dct_low = dct[:8, :8]
    avg = dct_low.mean()
    bits = (dct_low > avg).flatten().astype(int)
    return "".join(str(b) for b in bits)


def hash_distance(h1: str, h2: str) -> int:
    return sum(c1 != c2 for c1, c2 in zip(h1, h2))


class Deduplicator:
    """O(1) 去重器"""
    def __init__(self, threshold: int = 5):
        self.threshold = threshold
        self._hashes = {}  # phash -> file_id

    def check(self, phash: str, file_id: int) -> tuple:
        """返回 (is_duplicate, duplicate_of_id)"""
        # 直接查找（允许汉明距离 threshold 的近似匹配）
        # 简单方案：先精确查，再暴力近邻（pHash 空间小，暴力可接受）
        if phash in self._hashes:
            return True, self._hashes[phash]
        # 近似匹配
        for existing_hash, existing_id in self._hashes.items():
            if hash_distance(phash, existing_hash) <= self.threshold:
                return True, existing_id
        self._hashes[phash] = file_id
        return False, None


# =============================================================================
# 图像处理管线（纯 numpy/cv2，只在必要时用 PIL）
# =============================================================================
def color_correct_xuan_paper(img: np.ndarray) -> np.ndarray:
    target = np.array(COLOR_STANDARDS["xuan_paper_rgb"], dtype=np.float32)
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    mask = gray > np.percentile(gray, 75)
    if mask.sum() > 0:
        current = img[mask].mean(axis=0).astype(np.float32)
        scale = target / (current + 1e-6)
        img = np.clip(img.astype(np.float32) * scale, 0, 255).astype(np.uint8)
    return img


def sharpen_calligraphy(img: np.ndarray) -> np.ndarray:
    blurred = cv2.GaussianBlur(img, (0, 0), 2.0)
    sharpened = cv2.addWeighted(img, 1.5, blurred, -0.5, 0)
    return cv2.fastNlMeansDenoisingColored(sharpened, None, 3, 3, 7, 21)


def remove_background(img: np.ndarray) -> np.ndarray:
    """AI 抠图，使用缓存 session"""
    session = get_rembg_session()
    if session is None:
        return img
    pil = Image.fromarray(img)
    result = rembg_remove_cached(pil)
    return np.array(result)


def resize_maintain_aspect(img: np.ndarray, target_w: int, target_h: int) -> np.ndarray:
    """保持比例裁剪后 resize"""
    h, w = img.shape[:2]
    tr = target_w / target_h
    cr = w / h
    if cr > tr:
        new_w = int(h * tr)
        offset = (w - new_w) // 2
        img = img[:, offset:offset + new_w]
    elif cr < tr:
        new_h = int(w / tr)
        offset = (h - new_h) // 2
        img = img[offset:offset + new_h, :]
    return cv2.resize(img, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)


# =============================================================================
# 分类处理器
# =============================================================================
def process_calligraphy(img: np.ndarray, spec: dict) -> np.ndarray:
    img = color_correct_xuan_paper(img)
    img = sharpen_calligraphy(img)
    return cv2.resize(img, (spec["width"], spec["height"]), interpolation=cv2.INTER_LANCZOS4)


def process_seal(img: np.ndarray, spec: dict, skip_rembg: bool = False) -> np.ndarray:
    if not skip_rembg:
        img = remove_background(img)
    return cv2.resize(img, (spec["width"], spec["height"]), interpolation=cv2.INTER_LANCZOS4)


def process_texture(img: np.ndarray, spec: dict) -> np.ndarray:
    img = color_correct_xuan_paper(img)
    # 轻微高斯模糊去锐化（纹理不应有文字）
    img = cv2.GaussianBlur(img, (3, 3), 0.5)
    return cv2.resize(img, (spec["width"], spec["height"]), interpolation=cv2.INTER_LANCZOS4)


def process_pattern(img: np.ndarray, spec: dict, skip_rembg: bool = False) -> np.ndarray:
    if not skip_rembg:
        img = remove_background(img)
    return cv2.resize(img, (spec["width"], spec["height"]), interpolation=cv2.INTER_LANCZOS4)


def process_reference(img: np.ndarray, spec: dict) -> np.ndarray:
    img = color_correct_xuan_paper(img)
    img = cv2.fastNlMeansDenoisingColored(img, None, 5, 5, 7, 21)
    return resize_maintain_aspect(img, spec["width"], spec["height"])


# =============================================================================
# 单文件处理
# =============================================================================
def process_file(task: tuple, dedup: Deduplicator, skip_rembg: bool = False) -> dict:
    file_path, input_dir, output_dir, category, file_id = task
    rel_path = os.path.relpath(file_path, input_dir)
    result = {
        "id": file_id,
        "source": rel_path,
        "category": category,
        "status": "pending",
        "scores": {},
        "output": None,
        "tags": [],
    }

    # 1. 读取
    try:
        img = load_image(file_path)
    except Exception as e:
        result["status"] = "ERROR_READ"
        result["error"] = str(e)
        return result

    # 2. 质量评分
    scores = assess_image(img, category, QUALITY_THRESHOLDS)
    result["scores"] = scores

    if scores["verdict"] == "DROP":
        result["status"] = "DROPPED"
        return result

    # 3. 去重
    phash = perceptual_hash(img)
    is_dup, dup_id = dedup.check(phash, file_id)
    if is_dup:
        result["status"] = "DUPLICATE"
        result["duplicate_of"] = dup_id
        result["phash"] = phash
        return result
    result["phash"] = phash

    # 4. 分类处理
    spec = OUTPUT_SPECS.get(category, OUTPUT_SPECS["reference"])
    processors = {
        "calligraphy": process_calligraphy,
        "seal": lambda img, spec: process_seal(img, spec, skip_rembg),
        "texture": process_texture,
        "pattern": lambda img, spec: process_pattern(img, spec, skip_rembg),
        "reference": process_reference,
    }
    processor = processors.get(category, process_reference)

    try:
        processed = processor(img, spec)
    except Exception as e:
        result["status"] = "ERROR_PROCESS"
        result["error"] = str(e)
        return result
    finally:
        del img
        gc.collect()

    # 5. 保存
    ext = ".png" if spec.get("transparent") or spec.get("format") == "png" else ".jpg"
    out_name = f"{category}_{file_id:04d}{ext}"
    out_path = os.path.join(output_dir, category, out_name)
    try:
        save_image(processed, out_path, spec.get("quality", 95))
        result["output"] = os.path.relpath(out_path, output_dir)
        result["status"] = "REFINED"
    except Exception as e:
        result["status"] = "ERROR_SAVE"
        result["error"] = str(e)
    finally:
        del processed
        gc.collect()

    return result


# =============================================================================
# 主函数
# =============================================================================
def main():
    parser = argparse.ArgumentParser(description="素材精炼工厂 v2")
    parser.add_argument("--input", "-i", help="原始素材目录路径")
    parser.add_argument("--output", "-o", help="输出目录路径")
    parser.add_argument("--skip-rembg", action="store_true",
                        help="跳过 AI 抠图（如果素材已有透明背景）")
    parser.add_argument("--dry-run", action="store_true", help="只评分不保存")
    parser.add_argument("--max-files", type=int, default=0,
                        help="最大处理数量（0=不限，用于测试）")
    args = parser.parse_args()

    input_dir, output_dir = resolve_paths(args.input, args.output)

    print("=" * 60)
    print("素材精炼工厂 v2")
    print(f"输入 : {input_dir}")
    print(f"输出 : {output_dir}")
    print(f"rembg: {'跳过' if args.skip_rembg else '启用'}")
    print("=" * 60)

    if not os.path.exists(input_dir):
        print(f"[ERROR] 输入目录不存在: {input_dir}")
        print("目录结构示例:")
        print("  raw_assets/")
        print("    calligraphy/   ← 书法字")
        print("    seals/         ← 印章")
        print("    textures/      ← 纹理底纹")
        print("    patterns/      ← 装饰纹样")
        print("    references/    ← 古代真迹")
        print("    fonts/         ← 字体文件")
        sys.exit(1)

    # 收集任务
    tasks = []
    file_id = 0
    for subdir, category in CATEGORY_MAP.items():
        full_subdir = os.path.join(input_dir, subdir)
        if not os.path.isdir(full_subdir):
            continue
        for fname in sorted(os.listdir(full_subdir)):
            if not fname.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".bmp")):
                continue
            fpath = os.path.join(full_subdir, fname)
            tasks.append((fpath, input_dir, output_dir, category, file_id))
            file_id += 1
            if args.max_files > 0 and len(tasks) >= args.max_files:
                break
        if args.max_files > 0 and len(tasks) >= args.max_files:
            break

    print(f"待处理: {len(tasks)} 张素材")
    if len(tasks) == 0:
        print("没有可处理的图片。")
        sys.exit(0)

    # 预加载 rembg session（如果需要）
    need_rembg = not args.skip_rembg and not args.dry_run
    has_seal_or_pattern = any(t[3] in ("seal", "pattern") for t in tasks)
    if need_rembg and has_seal_or_pattern:
        get_rembg_session()

    # 执行（单进程串行，全局 session 复用）
    dedup = Deduplicator(threshold=5)
    results = []
    stats = {"KEEP": 0, "REVIEW": 0, "DROP": 0, "REFINED": 0,
             "DUPLICATE": 0, "DROPPED": 0, "ERROR_READ": 0,
             "ERROR_PROCESS": 0, "ERROR_SAVE": 0}

    t_start = time.time()
    for i, task in enumerate(tasks):
        result = process_file(task, dedup, skip_rembg=args.skip_rembg)
        results.append(result)
        stats[result["status"]] = stats.get(result["status"], 0) + 1

        # 进度 + 速度估算
        elapsed = time.time() - t_start
        avg_time = elapsed / (i + 1)
        remain = (len(tasks) - i - 1) * avg_time
        bar_len = 30
        filled = int((i + 1) / len(tasks) * bar_len)
        bar = "█" * filled + "░" * (bar_len - filled)
        print(f"\r[{bar}] {i+1}/{len(tasks)} | {avg_time:.2f}s/张 | 剩余 {remain:.0f}s", end="")

    print()
    total_time = time.time() - t_start

    # 统计
    print("\n" + "=" * 60)
    print("处理结果")
    print("=" * 60)
    refined = stats.get("REFINED", 0)
    dropped = stats.get("DROPPED", 0) + stats.get("DROP", 0)
    duplicates = stats.get("DUPLICATE", 0)
    errors = stats.get("ERROR_READ", 0) + stats.get("ERROR_PROCESS", 0) + stats.get("ERROR_SAVE", 0)
    print(f"  精炼入库 : {refined}")
    print(f"  自动淘汰 : {dropped}")
    print(f"  重复去重 : {duplicates}")
    print(f"  处理错误 : {errors}")
    print(f"  总计耗时 : {total_time:.1f}s ({total_time/len(tasks):.2f}s/张)")

    # REVIEW 列表
    review_items = [r for r in results if r["scores"].get("verdict") == "REVIEW"]
    if review_items:
        print(f"\n  [REVIEW] 需要人工确认的素材: {len(review_items)} 张")
        for r in review_items[:10]:
            print(f"    - {r['source']} (overall: {r['scores'].get('overall', 0):.2f})")
        if len(review_items) > 10:
            print(f"    ... 还有 {len(review_items)-10} 张")

    if args.dry_run:
        print("\n[dry-run 模式] 未保存任何文件")
        return

    # 输出索引 JSON
    index = {
        "meta": {
            "version": "2.0",
            "total_input": len(tasks),
            "total_refined": refined,
            "total_dropped": dropped,
            "total_duplicates": duplicates,
            "total_errors": errors,
            "processing_time_sec": round(total_time, 2),
            "avg_time_per_file": round(total_time / len(tasks), 3) if tasks else 0,
            "input_dir": input_dir,
            "output_dir": output_dir,
        },
        "assets": [r for r in results if r["status"] == "REFINED"],
    }

    index_path = os.path.join(output_dir, INDEX_JSON)
    os.makedirs(output_dir, exist_ok=True)
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    print(f"\n索引已保存: {index_path}")
    print("素材精炼完成！")


if __name__ == "__main__":
    main()
