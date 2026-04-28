#!/usr/bin/env python3
"""
Agent质检门控 - 检查raw_assets新增素材，不合格的自动标记返工
输出JSON报告供下一轮Agent读取
"""
import os, sys, json, cv2, numpy as np
from pathlib import Path
from collections import defaultdict

COLOR_STD = np.array([249, 244, 237], dtype=np.float32)

def delta_e(img_rgb, target_rgb):
    lab = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2Lab).astype(np.float32)
    target_lab = cv2.cvtColor(np.uint8([[target_rgb]]), cv2.COLOR_RGB2Lab).astype(np.float32)[0,0]
    return np.mean(np.linalg.norm(lab - target_lab, axis=2))

def check_file(fpath: Path):
    """通用检查，按文件路径推断分类"""
    fname = fpath.name.lower()
    parent = fpath.parent.name.lower()
    
    # 推断分类
    if 'calligraphy' in parent or 'calligraphy' in fname:
        cat = 'calligraphy'
    elif 'seal' in parent or 'seal' in fname:
        cat = 'seal'
    elif 'texture' in parent or 'texture' in fname:
        cat = 'texture'
    elif 'pattern' in parent or 'pattern' in fname:
        cat = 'pattern'
    elif 'reference' in parent or 'reference' in fname:
        cat = 'reference'
    else:
        cat = 'unknown'
    
    img = cv2.imread(str(fpath))
    if img is None:
        return cat, False, "读取失败"
    
    if cat == 'texture':
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        de = delta_e(img_rgb, COLOR_STD)
        mean_rgb = np.mean(img_rgb, axis=(0,1))
        if de > 30:
            return cat, False, f"ΔE={de:.1f}>30 偏色 mean={mean_rgb.astype(int)}"
        return cat, True, f"ΔE={de:.1f} 合格 mean={mean_rgb.astype(int)}"
    
    elif cat == 'seal':
        img_unch = cv2.imread(str(fpath), cv2.IMREAD_UNCHANGED)
        if img_unch is None or img_unch.shape[2] < 4:
            return cat, False, f"无Alpha通道"
        alpha = img_unch[:,:,3]
        rgba = cv2.cvtColor(img_unch, cv2.COLOR_BGRA2RGBA)
        opaque = alpha > 10
        if opaque.sum() == 0:
            return cat, False, "全透明"
        red_pixels = ((rgba[:,:,0] > 100) & (rgba[:,:,1] < 120) & (rgba[:,:,2] < 120) & opaque)
        red_ratio = red_pixels.sum() / opaque.sum()
        if red_ratio < 0.30:
            return cat, False, f"红色占比{red_ratio:.1%}<30%"
        return cat, True, f"红色占比{red_ratio:.1%} 合格"
    
    elif cat in ('calligraphy', 'reference'):
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
        contrast = (gray.max() - gray.min()) / 255.0
        if sharpness < 80:
            return cat, False, f"清晰度{sharpness:.0f}<80"
        if contrast < 0.3:
            return cat, False, f"对比度{contrast:.2f}<0.3"
        return cat, True, f"清晰度{sharpness:.0f} 对比度{contrast:.2f} 合格"
    
    elif cat == 'pattern':
        # PNG透明背景纹样：检测图案密度+清晰度
        if img.shape[2] == 4:
            alpha = img[:,:,3]
            opaque = alpha > 10
            opaque_ratio = opaque.sum() / opaque.size
            if opaque_ratio < 0.02:
                return cat, False, f"图案占比{opaque_ratio:.1%}<2% 太稀疏"
            bgr = img[:,:,:3]
            gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
            sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
            has_alpha = True
        else:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
            opaque_ratio = 1.0
            has_alpha = False
        if sharpness < 20:
            return cat, False, f"清晰度{sharpness:.0f}<20"
        return cat, True, f"清晰度{sharpness:.0f} 图案占比{opaque_ratio:.1%} {'有Alpha' if has_alpha else '无Alpha'} 合格"
    
    return cat, True, "未分类，跳过"

def main(batch_dir: str):
    root = Path(batch_dir)
    if not root.exists():
        print(f"目录不存在: {batch_dir}")
        sys.exit(0)
    
    results = defaultdict(lambda: {"pass": 0, "fail": 0, "items": []})
    fail_list = []
    
    for f in root.rglob('*'):
        if f.suffix.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
            continue
        cat, ok, msg = check_file(f)
        results[cat]["items"].append({"file": str(f.relative_to(root)), "ok": ok, "msg": msg})
        if ok:
            results[cat]["pass"] += 1
        else:
            results[cat]["fail"] += 1
            fail_list.append({"file": str(f), "category": cat, "reason": msg})
    
    total_pass = sum(r["pass"] for r in results.values())
    total_fail = sum(r["fail"] for r in results.values())
    total = total_pass + total_fail
    
    print("=" * 60)
    print(f"Agent质检报告: {batch_dir}")
    print("=" * 60)
    for cat in sorted(results.keys()):
        r = results[cat]
        t = r["pass"] + r["fail"]
        rate = r["pass"]/t*100 if t else 0
        print(f"\n【{cat.upper()}】{t}张  通过:{r['pass']}  失败:{r['fail']}  合格率:{rate:.1f}%")
        for item in r["items"]:
            status = "✓" if item["ok"] else "✗"
            print(f"  {status} {item['file']:<50s} {item['msg']}")
    
    print(f"\n{'='*60}")
    print(f"总计: {total}张  通过:{total_pass}  失败:{total_fail}  合格率:{total/total*100:.1f}%" if total > 0 else "无素材")
    
    # 保存失败清单
    report_path = Path(batch_dir) / "_quality_report.json"
    report = {
        "batch_dir": batch_dir,
        "total": total,
        "pass": total_pass,
        "fail": total_fail,
        "pass_rate": total_pass/total if total > 0 else 0,
        "details": dict(results),
        "failures": fail_list,
    }
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"\n报告已保存: {report_path}")
    
    return 0 if total_fail == 0 else 1

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python agent_quality_gate.py <batch_dir>")
        sys.exit(1)
    sys.exit(main(sys.argv[1]))
