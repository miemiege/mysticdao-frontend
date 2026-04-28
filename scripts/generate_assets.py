#!/usr/bin/env python3
"""
程序化生成素材库 v1
优势: 无网络依赖, 无API限制, 1000张/10分钟
生成: 书法纹理, 宣纸, 印章, 云纹, 符咒图案
"""

import os
import math
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
from concurrent.futures import ProcessPoolExecutor, as_completed
import multiprocessing

BASE_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-assets"
PROC_DIR = f"{BASE_DIR}/processed"
for d in ["calligraphy", "seal", "texture", "charm", "pattern", "processed"]:
    os.makedirs(f"{BASE_DIR}/{d}", exist_ok=True)

random.seed(42)
np.random.seed(42)

# ============================================================
# UTILS
# ============================================================
def rand_color(base, variance=20):
    return tuple(max(0, min(255, int(base[i] + random.randint(-variance, variance)))) for i in range(3))

def add_noise(img, intensity=8):
    arr = np.array(img)
    noise = np.random.normal(0, intensity, arr.shape).astype(np.int16)
    arr = np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)

def warp_texture(img, scale=15):
    """给图片添加轻微的扭曲变形,模拟宣纸不规整感"""
    w, h = img.size
    # 创建位移图
    dx = np.random.normal(0, scale, (h, w)).astype(np.float32)
    dy = np.random.normal(0, scale, (h, w)).astype(np.float32)
    
    arr = np.array(img)
    result = np.zeros_like(arr)
    
    for y in range(h):
        for x in range(w):
            nx = int(x + dx[y, x])
            ny = int(y + dy[y, x])
            nx = max(0, min(w-1, nx))
            ny = max(0, min(h-1, ny))
            result[y, x] = arr[ny, nx]
    
    return Image.fromarray(result)

# ============================================================
# 1. 宣纸纹理 (TARGET: 300张)
# ============================================================
def gen_paper_texture(idx):
    """生成宣纸纹理"""
    W, H = 400, 640
    
    # 基础暖黄色
    base_r = random.randint(245, 255)
    base_g = random.randint(240, 250)
    base_b = random.randint(230, 242)
    img = Image.new("RGB", (W, H), (base_r, base_g, base_b))
    
    # 添加纤维纹理
    arr = np.array(img)
    
    # 随机纤维线
    for _ in range(random.randint(200, 500)):
        x = random.randint(0, W-1)
        y = random.randint(0, H-1)
        length = random.randint(5, 30)
        angle = random.uniform(-math.pi/6, math.pi/6)
        color_var = random.randint(-15, 15)
        
        for i in range(length):
            px = int(x + i * math.cos(angle))
            py = int(y + i * math.sin(angle))
            if 0 <= px < W and 0 <= py < H:
                old = arr[py, px]
                arr[py, px] = (
                    max(0, min(255, int(old[0]) + color_var)),
                    max(0, min(255, int(old[1]) + color_var)),
                    max(0, min(255, int(old[2]) + color_var))
                )
    
    # 添加色斑
    for _ in range(random.randint(3, 10)):
        cx = random.randint(0, W)
        cy = random.randint(0, H)
        r = random.randint(20, 80)
        for y in range(max(0, cy-r), min(H, cy+r)):
            for x in range(max(0, cx-r), min(W, cx+r)):
                if (x-cx)**2 + (y-cy)**2 < r**2:
                    factor = 1 + random.uniform(-0.05, 0.05)
                    arr[y, x] = tuple(min(255, int(c * factor)) for c in arr[y, x])
    
    img = Image.fromarray(arr)
    
    # 噪点
    img = add_noise(img, random.randint(3, 8))
    
    # 模糊柔化
    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3, 1.0)))
    
    # 暗角
    vignette = Image.new("L", (W, H), 0)
    draw = ImageDraw.Draw(vignette)
    for i in range(min(W, H)//2, 0, -5):
        alpha = int(255 * (1 - (i / (min(W, H)//2)) ** 2) * 0.15)
        draw.ellipse([W//2 - i, H//2 - i, W//2 + i, H//2 + i], fill=alpha)
    img = Image.composite(Image.new("RGB", (W, H), (50, 40, 30)), img, vignette)
    
    img.save(f"{PROC_DIR}/paper_{idx:04d}.jpg", quality=95)
    return f"paper_{idx:04d}.jpg"

# ============================================================
# 2. 书法墨迹纹理 (TARGET: 500张)
# ============================================================
def gen_calligraphy_texture(idx):
    """生成书法墨迹背景纹理"""
    W, H = 400, 640
    
    # 暖黄底色
    base_color = (random.randint(248, 255), random.randint(242, 250), random.randint(232, 244))
    img = Image.new("RGB", (W, H), base_color)
    draw = ImageDraw.Draw(img)
    
    # 墨色参数
    ink_colors = [
        (random.randint(15, 35), random.randint(15, 35), random.randint(15, 35)),
        (random.randint(25, 45), random.randint(20, 40), random.randint(15, 35)),
        (random.randint(30, 50), random.randint(25, 45), random.randint(20, 40)),
    ]
    
    # 生成随机笔画
    num_strokes = random.randint(20, 60)
    for _ in range(num_strokes):
        ink = random.choice(ink_colors)
        # 随机曲线笔画
        points = []
        x = random.randint(20, W-20)
        y = random.randint(20, H-20)
        length = random.randint(30, 150)
        angle = random.uniform(-math.pi, math.pi)
        curve = random.uniform(-0.5, 0.5)
        
        for i in range(length):
            px = int(x + i * math.cos(angle + curve * i / length))
            py = int(y + i * math.sin(angle + curve * i / length))
            if 20 <= px < W-20 and 20 <= py < H-20:
                points.append((px, py))
        
        if len(points) > 1:
            width = random.randint(2, 8)
            # 笔画两端细中间粗
            for i, (px, py) in enumerate(points):
                progress = i / len(points)
                w = int(width * (1 - abs(progress - 0.5) * 2) * 0.5 + width * 0.5)
                w = max(1, w)
                draw.ellipse([px-w, py-w, px+w, py+w], fill=ink)
        
        # 飞白效果
        if random.random() < 0.3 and len(points) > 5:
            for i in range(random.randint(2, 5)):
                idx_f = random.randint(0, len(points)-1)
                px, py = points[idx_f]
                fw = random.randint(1, 3)
                draw.ellipse([px-fw, py-fw, px+fw, py+fw], fill=base_color)
    
    # 添加墨点和飞墨
    for _ in range(random.randint(5, 20)):
        cx = random.randint(30, W-30)
        cy = random.randint(30, H-30)
        r = random.randint(2, 12)
        ink = random.choice(ink_colors)
        # 墨点边缘淡
        for dr in range(r, 0, -1):
            alpha = int(255 * (1 - dr/r) ** 0.5)
            color = tuple(min(255, int(c * alpha / 255 + base_color[i] * (1 - alpha/255))) for i, c in enumerate(ink))
            draw.ellipse([cx-dr, cy-dr, cx+dr, cy+dr], fill=color)
    
    # 纸张纹理叠加
    arr = np.array(img)
    noise = np.random.normal(0, 5, arr.shape).astype(np.int16)
    arr = np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    img = Image.fromarray(arr)
    
    # 暖色调微调
    r, g, b = img.split()
    r = r.point(lambda i: min(255, int(i * 1.03)))
    g = g.point(lambda i: min(255, int(i * 1.01)))
    b = b.point(lambda i: int(i * 0.95))
    img = Image.merge("RGB", (r, g, b))
    
    # 模糊
    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.2, 0.8)))
    
    img.save(f"{PROC_DIR}/calligraphy_{idx:04d}.jpg", quality=95)
    return f"calligraphy_{idx:04d}.jpg"

# ============================================================
# 3. 印章 (TARGET: 200张)
# ============================================================
SEAL_CHARS = "天官賜福開運招財長壽吉祥平安如意福壽康寧百無禁忌吉星高照金玉滿堂龍鳳呈祥紫氣東來"

def gen_seal(idx):
    """生成印章PNG(透明背景)"""
    size = random.randint(80, 150)
    img = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # 印章颜色 (朱砂红)
    red_r = random.randint(180, 220)
    red_g = random.randint(20, 60)
    red_b = random.randint(20, 50)
    seal_color = (red_r, red_g, red_b, random.randint(180, 240))
    
    # 边框
    border_w = random.randint(2, 4)
    shape = random.choice(["square", "round", "oval"])
    
    if shape == "square":
        draw.rectangle([border_w, border_w, size-border_w, size-border_w], 
                       outline=seal_color, width=border_w)
    elif shape == "round":
        draw.ellipse([border_w, border_w, size-border_w, size-border_w],
                     outline=seal_color, width=border_w)
    else:
        draw.ellipse([border_w, size//4, size-border_w, size*3//4],
                     outline=seal_color, width=border_w)
    
    # 印章文字
    num_chars = random.choice([1, 2, 4])
    chars = random.sample(SEAL_CHARS, num_chars)
    
    try:
        font_size = size // (num_chars + 1)
        font = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoSerifCJK-Regular.ttc", font_size)
    except:
        try:
            font = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc", font_size)
        except:
            font = ImageFont.load_default()
    
    if num_chars == 1:
        text = chars[0]
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text(((size-tw)//2, (size-th)//2), text, fill=seal_color, font=font)
    elif num_chars == 2:
        for i, ch in enumerate(chars):
            bbox = draw.textbbox((0, 0), ch, font=font)
            tw = bbox[2] - bbox[0]
            th = bbox[3] - bbox[1]
            y = size//4 + i * (size//2 - th) - th//2
            draw.text(((size-tw)//2, int(y)), ch, fill=seal_color, font=font)
    else:
        # 四字印章
        positions = [(size//4, size//4), (size*3//4, size//4),
                     (size//4, size*3//4), (size*3//4, size*3//4)]
        for (cx, cy), ch in zip(positions, chars):
            bbox = draw.textbbox((0, 0), ch, font=font)
            tw = bbox[2] - bbox[0]
            th = bbox[3] - bbox[1]
            draw.text((cx - tw//2, cy - th//2), ch, fill=seal_color, font=font)
    
    # 添加印章噪点和不规则边缘
    arr = np.array(img)
    noise_mask = np.random.random(arr.shape[:2]) < 0.02
    arr[noise_mask, 3] = np.clip(arr[noise_mask, 3] * np.random.uniform(0.3, 0.8), 0, 255).astype(np.uint8)
    img = Image.fromarray(arr)
    
    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3, 0.8)))
    
    img.save(f"{PROC_DIR}/seal_{idx:04d}.png")
    return f"seal_{idx:04d}.png"

# ============================================================
# 4. 云纹/图案 (TARGET: 200张)
# ============================================================
def gen_pattern(idx):
    """生成云纹/装饰图案PNG(透明背景)"""
    W, H = 400, 400
    img = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    pattern_type = random.choice(["cloud", "flame", "wave", "geometric"])
    
    if pattern_type == "cloud":
        color = (random.randint(180, 220), random.randint(20, 60), random.randint(20, 50), random.randint(150, 220))
        # 多个重叠的云朵
        for _ in range(random.randint(3, 8)):
            cx = random.randint(50, W-50)
            cy = random.randint(50, H-50)
            r = random.randint(20, 60)
            # 云由多个圆组成
            for _ in range(random.randint(3, 6)):
                ox = cx + random.randint(-r//2, r//2)
                oy = cy + random.randint(-r//3, r//3)
                orad = random.randint(r//3, r//2)
                draw.ellipse([ox-orad, oy-orad, ox+orad, oy+orad], fill=color)
    
    elif pattern_type == "flame":
        color = (random.randint(200, 255), random.randint(80, 150), random.randint(10, 40), random.randint(120, 200))
        for _ in range(random.randint(5, 12)):
            x = random.randint(50, W-50)
            y = random.randint(H//2, H-30)
            h = random.randint(30, 100)
            w = random.randint(10, 30)
            points = [(x, y)]
            for i in range(5):
                px = x + random.randint(-w, w) * (1 - i/5)
                py = y - h * (i+1) / 5
                points.append((px, py))
            points.append((x, y - h))
            if len(points) > 2:
                draw.polygon(points, fill=color)
    
    elif pattern_type == "wave":
        color = (random.randint(20, 60), random.randint(60, 120), random.randint(150, 200), random.randint(100, 180))
        for _ in range(random.randint(3, 7)):
            y_base = random.randint(50, H-50)
            amplitude = random.randint(10, 30)
            wavelength = random.randint(40, 80)
            points = []
            for x in range(0, W, 5):
                y = y_base + amplitude * math.sin(x / wavelength * 2 * math.pi)
                points.append((x, y))
            for x in range(W, 0, -5):
                y = y_base + amplitude * math.sin(x / wavelength * 2 * math.pi) + 15
                points.append((x, y))
            if len(points) > 2:
                draw.polygon(points, fill=color)
    
    else:  # geometric
        color = (random.randint(150, 200), random.randint(100, 150), random.randint(20, 60), random.randint(100, 180))
        for _ in range(random.randint(5, 15)):
            cx = random.randint(30, W-30)
            cy = random.randint(30, H-30)
            r = random.randint(10, 40)
            n_sides = random.randint(3, 8)
            points = []
            for i in range(n_sides):
                angle = 2 * math.pi * i / n_sides + random.uniform(0, math.pi/4)
                px = cx + r * math.cos(angle)
                py = cy + r * math.sin(angle)
                points.append((px, py))
            if len(points) > 2:
                draw.polygon(points, fill=color)
    
    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3, 0.8)))
    img.save(f"{PROC_DIR}/pattern_{idx:04d}.png")
    return f"pattern_{idx:04d}.png"

# ============================================================
# 5. 符咒 (TARGET: 200张)
# ============================================================
def gen_charm(idx):
    """生成符咒风格背景图"""
    W, H = 400, 640
    
    # 暖黄底色
    base = (random.randint(248, 255), random.randint(240, 250), random.randint(228, 242))
    img = Image.new("RGB", (W, H), base)
    draw = ImageDraw.Draw(img)
    
    # 边框
    border_colors = [(139, 69, 19), (160, 82, 45), (120, 60, 30), (180, 100, 50)]
    border_color = random.choice(border_colors)
    
    # 双线边框
    margin = 20
    draw.rectangle([margin, margin, W-margin, H-margin], outline=border_color, width=2)
    draw.rectangle([margin+4, margin+4, W-margin-4, H-margin-4], outline=border_color, width=1)
    
    # 中央符文区域
    ink = (random.randint(20, 40), random.randint(20, 40), random.randint(20, 40))
    
    # 中心图案
    cx, cy = W // 2, H // 3
    for _ in range(random.randint(3, 8)):
        r = random.randint(10, 40)
        angle = random.uniform(0, 2*math.pi)
        px = cx + int(r * math.cos(angle))
        py = cy + int(r * math.sin(angle))
        draw.line([cx, cy, px, py], fill=ink, width=random.randint(1, 3))
    
    # 同心圆/八卦样式
    for r in range(20, 80, 15):
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=ink, width=1)
    
    # 底部文字区域
    for i in range(random.randint(3, 8)):
        y = H * 2 // 3 + i * 25
        x_start = margin + 10
        x_end = W - margin - 10
        draw.line([x_start, y, x_end, y], fill=ink, width=random.randint(1, 2))
        # 添加字符标记
        for _ in range(random.randint(1, 4)):
            mx = random.randint(x_start, x_end)
            draw.ellipse([mx-3, y-3, mx+3, y+3], fill=ink)
    
    # 添加符咒特有符号
    symbols = ["☰", "☷", "☳", "☵", "☲", "☶", "☱", "☴", "⚊", "⚋", "☯"]
    for _ in range(random.randint(2, 5)):
        symbol = random.choice(symbols)
        sx = random.randint(margin + 20, W - margin - 20)
        sy = random.randint(margin + 20, H - margin - 20)
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
        except:
            font = ImageFont.load_default()
        draw.text((sx, sy), symbol, fill=ink, font=font)
    
    # 噪点和模糊
    img = add_noise(img, 4)
    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.2, 0.6)))
    
    img.save(f"{PROC_DIR}/charm_{idx:04d}.jpg", quality=95)
    return f"charm_{idx:04d}.jpg"

# ============================================================
# 主函数
# ============================================================
def generate_batch(args):
    gen_type, start_idx, count = args
    results = []
    for i in range(count):
        idx = start_idx + i
        try:
            if gen_type == "paper":
                results.append(gen_paper_texture(idx))
            elif gen_type == "calligraphy":
                results.append(gen_calligraphy_texture(idx))
            elif gen_type == "seal":
                results.append(gen_seal(idx))
            elif gen_type == "pattern":
                results.append(gen_pattern(idx))
            elif gen_type == "charm":
                results.append(gen_charm(idx))
        except Exception as e:
            print(f"Error generating {gen_type}_{idx}: {e}")
    return gen_type, results

def main():
    import time
    start = time.time()
    
    print("🚀 程序化素材生成启动")
    print("目标: 书法500 + 纹理300 + 印章200 + 图案200 + 符咒200 = 1400张")
    
    # 分批生成 (利用多进程)
    batches = []
    batch_size = 50
    
    for gen_type, total in [("paper", 300), ("calligraphy", 500), ("seal", 200), ("pattern", 200), ("charm", 200)]:
        for start_idx in range(0, total, batch_size):
            count = min(batch_size, total - start_idx)
            batches.append((gen_type, start_idx, count))
    
    print(f"总批次: {len(batches)}")
    
    # 使用多进程并行生成
    num_workers = min(8, multiprocessing.cpu_count())
    all_results = {}
    
    with ProcessPoolExecutor(max_workers=num_workers) as executor:
        futures = {executor.submit(generate_batch, batch): batch for batch in batches}
        
        completed = 0
        for future in as_completed(futures):
            gen_type, results = future.result()
            completed += 1
            all_results.setdefault(gen_type, []).extend(results)
            total_done = sum(len(v) for v in all_results.values())
            print(f"  ✅ 批次{completed}/{len(batches)}完成 | 累计{total_done}张", flush=True)
    
    elapsed = time.time() - start
    print(f"\n🏁 完成!")
    for k, v in all_results.items():
        print(f"  {k}: {len(v)}张")
    print(f"  总计: {sum(len(v) for v in all_results.values())}张")
    print(f"  耗时: {elapsed:.1f}秒 ({elapsed/60:.1f}分钟)")
    print(f"  速率: {sum(len(v) for v in all_results.values()) / elapsed * 60:.0f}张/分钟")

if __name__ == "__main__":
    main()
