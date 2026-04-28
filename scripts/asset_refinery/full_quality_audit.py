#!/usr/bin/env python3
"""
全链路质检脚本 - 按分类严格检查素材库
输出 JSON 报告，不合格自动标记待修复
"""
import os, sys, json, cv2, numpy as np
from pathlib import Path
from collections import defaultdict

ASSETS_DIR = Path("public/talisman-assets/自己整理z素材库")
INDEX_FILE = ASSETS_DIR / "refined_index.json"
COLOR_STD = np.array([249, 244, 237], dtype=np.float32)  # 暖黄宣纸标准

# ΔE76 计算
def delta_e(img_rgb, target_rgb):
    lab = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2Lab).astype(np.float32)
    target_lab = cv2.cvtColor(np.uint8([[target_rgb]]), cv2.COLOR_RGB2Lab).astype(np.float32)[0,0]
    return np.mean(np.linalg.norm(lab - target_lab, axis=2))

def check_texture(entry):
    """纹理：暖黄ΔE<50, 无严重偏色"""
    path = ASSETS_DIR / entry["output"]
    img = cv2.imread(str(path))
    if img is None:
        return False, "读取失败"
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    de = delta_e(img_rgb, COLOR_STD)
    if de > 50:
        return False, f"ΔE={de:.1f}>50 严重偏色"
    if de > 30:
        return False, f"ΔE={de:.1f}>30 轻度偏色(需校正)"
    return True, f"ΔE={de:.1f} 合格"

def check_seal(entry):
    """印章：透明通道+红色占比>30%"""
    path = ASSETS_DIR / entry["output"]
    img = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
    if img is None:
        return False, "读取失败"
    if img.shape[2] < 4:
        return False, f"无Alpha通道(通道数={img.shape[2]})"
    alpha = img[:,:,3]
    rgba = cv2.cvtColor(img, cv2.COLOR_BGRA2RGBA)
    # 计算非透明区域红色占比
    opaque = alpha > 10
    if opaque.sum() == 0:
        return False, "全透明"
    red_pixels = ((rgba[:,:,0] > 100) & (rgba[:,:,1] < 120) & (rgba[:,:,2] < 120) & opaque)
    red_ratio = red_pixels.sum() / opaque.sum()
    if red_ratio < 0.30:
        return False, f"红色占比{red_ratio:.1%}<30%"
    return True, f"Alpha+红色占比{red_ratio:.1%} 合格"

def check_calligraphy(entry):
    """书法：清晰度+对比度+居中度"""
    scores = entry.get("scores", {})
    issues = []
    if not scores.get("sharpness_ok", True):
        issues.append(f"清晰度不足({scores.get('sharpness',0):.0f})")
    if not scores.get("contrast_ok", True):
        issues.append(f"对比度不足({scores.get('contrast',0):.2f})")
    if not scores.get("centered_ok", True):
        issues.append(f"未居中({scores.get('centeredness',0):.2f})")
    if issues:
        return False, "; ".join(issues)
    return True, f"清晰度{scores.get('sharpness',0):.0f} 对比度{scores.get('contrast',0):.2f} 合格"

def check_pattern(entry):
    """纹样：清晰度+对比度"""
    scores = entry.get("scores", {})
    issues = []
    if not scores.get("sharpness_ok", True):
        issues.append(f"清晰度不足({scores.get('sharpness',0):.0f})")
    if not scores.get("contrast_ok", True):
        issues.append(f"对比度不足({scores.get('contrast',0):.2f})")
    if issues:
        return False, "; ".join(issues)
    return True, f"清晰度{scores.get('sharpness',0):.0f} 对比度{scores.get('contrast',0):.2f} 合格"

CHECKERS = {
    "texture": check_texture,
    "seal": check_seal,
    "calligraphy": check_calligraphy,
    "pattern": check_pattern,
    "reference": check_calligraphy,  # 参考图同书法标准
}

def main():
    with open(INDEX_FILE) as f:
        idx = json.load(f)
    assets = idx.get("assets", [])
    
    results = defaultdict(lambda: {"pass": 0, "fail": 0, "items": []})
    fail_list = []
    
    for entry in assets:
        cat = entry.get("category", "unknown")
        checker = CHECKERS.get(cat)
        if not checker:
            continue
        ok, msg = checker(entry)
        results[cat]["items"].append({"id": entry["id"], "file": entry["output"], "ok": ok, "msg": msg})
        if ok:
            results[cat]["pass"] += 1
        else:
            results[cat]["fail"] += 1
            fail_list.append({"id": entry["id"], "category": cat, "file": entry["output"], "reason": msg})
    
    # 打印报告
    print("=" * 60)
    print("全链路质检报告")
    print("=" * 60)
    total_pass = total_fail = 0
    for cat in sorted(results.keys()):
        r = results[cat]
        total = r["pass"] + r["fail"]
        rate = r["pass"]/total*100 if total else 0
        print(f"\n【{cat.upper()}】{total}张  通过:{r['pass']}  失败:{r['fail']}  合格率:{rate:.1f}%")
        for item in r["items"]:
            status = "✓" if item["ok"] else "✗"
            print(f"  {status} {item['file']:<50s} {item['msg']}")
        total_pass += r["pass"]
        total_fail += r["fail"]
    
    print(f"\n{'='*60}")
    print(f"总计: {total_pass+total_fail}张  通过:{total_pass}  失败:{total_fail}  合格率:{total_pass/(total_pass+total_fail)*100:.1f}%")
    
    # 保存失败清单
    if fail_list:
        fail_path = ASSETS_DIR / "audit_failures.json"
        with open(fail_path, "w") as f:
            json.dump(fail_list, f, indent=2, ensure_ascii=False)
        print(f"\n失败清单已保存: {fail_path}")
        print("建议: 自动执行修复流程 → 重新获取/生成不合格素材")
        return 1
    else:
        print("\n🎉 全链路质检通过！所有素材符合标准。")
        return 0

if __name__ == "__main__":
    sys.exit(main())
