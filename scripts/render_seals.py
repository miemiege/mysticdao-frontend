#!/usr/bin/env python3
"""
用真实书法字体渲染高质量印章素材
比程序化画圆圈+小字质量高得多——用的是真正的书法字形
"""

import os
import random
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from concurrent.futures import ProcessPoolExecutor
import multiprocessing

random.seed(2024)
np.random.seed(2024)

BASE_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-assets/source-library"
FONT_DIR = f"{BASE_DIR}/06_fonts/chinese_calligraphy"
OUTPUT_DIR = f"{BASE_DIR}/02_seals_stamps"

FONTS = [os.path.join(FONT_DIR, f) for f in os.listdir(FONT_DIR) if f.endswith(('.ttf', '.otf', '.ttc'))]

SEAL_CHARS_POOL = [
    "天", "官", "賜", "福", "開", "運", "招", "財", "長", "壽", "吉", "祥",
    "平", "安", "如", "意", "百", "無", "禁", "忌", "紫", "氣", "東", "來",
    "金", "玉", "滿", "堂", "龍", "鳳", "呈", "道", "法", "自", "然", "德",
    "慧", "靈", "光", "明", "日", "月", "乾", "坤", "陰", "陽", "五", "行",
]

def generate_seal(idx):
    """生成一枚印章"""
    size = random.randint(200, 300)
    img = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # 朱砂红色系
    red_r = random.randint(170, 210)
    red_g = random.randint(15, 50)
    red_b = random.randint(15, 45)
    seal_color = (red_r, red_g, red_b, 255)
    
    # 印章形状
    shape = random.choice(["square", "round", "oval", "rectangle"])
    border_w = random.randint(3, 6)
    margin = 10
    
    if shape == "square":
        draw.rectangle([margin, margin, size-margin, size-margin], outline=seal_color, width=border_w)
        # 内框
        draw.rectangle([margin+8, margin+8, size-margin-8, size-margin-8], outline=seal_color, width=1)
    elif shape == "round":
        draw.ellipse([margin, margin, size-margin, size-margin], outline=seal_color, width=border_w)
        draw.ellipse([margin+8, margin+8, size-margin-8, size-margin-8], outline=seal_color, width=1)
    elif shape == "oval":
        draw.ellipse([margin, size//4, size-margin, size*3//4], outline=seal_color, width=border_w)
    else:  # rectangle
        h = int(size * random.uniform(0.5, 0.7))
        y = (size - h) // 2
        draw.rectangle([margin, y, size-margin, y+h], outline=seal_color, width=border_w)
    
    # 选择文字数量和字体
    num_chars = random.choice([1, 2, 4])
    chars = random.sample(SEAL_CHARS_POOL, num_chars)
    font_path = random.choice(FONTS)
    
    try:
        if num_chars == 1:
            font_size = int(size * 0.5)
            font = ImageFont.truetype(font_path, font_size)
            text = chars[0]
            bbox = draw.textbbox((0, 0), text, font=font)
            tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
            x = (size - tw) // 2 - bbox[0]
            y = (size - th) // 2 - bbox[1]
            # 红色文字
            draw.text((x, y), text, fill=seal_color, font=font)
            
        elif num_chars == 2:
            font_size = int(size * 0.35)
            font = ImageFont.truetype(font_path, font_size)
            for i, ch in enumerate(chars):
                bbox = draw.textbbox((0, 0), ch, font=font)
                tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
                x = (size - tw) // 2 - bbox[0]
                y = size//4 + i * size//2 - th//2
                draw.text((x, y), ch, fill=seal_color, font=font)
                
        else:  # 4字
            font_size = int(size * 0.28)
            font = ImageFont.truetype(font_path, font_size)
            positions = [
                (size//4, size//4),
                (size*3//4, size//4),
                (size//4, size*3//4),
                (size*3//4, size*3//4)
            ]
            for (cx, cy), ch in zip(positions, chars):
                bbox = draw.textbbox((0, 0), ch, font=font)
                tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
                draw.text((cx - tw//2, cy - th//2), ch, fill=seal_color, font=font)
    except Exception as e:
        return None
    
    # 添加斑驳效果（模拟真实印泥不均匀）
    arr = np.array(img)
    # 随机降低一些像素的alpha（模拟印泥浅的地方）
    mask = np.random.random(arr.shape[:2]) < random.uniform(0.02, 0.06)
    arr[mask, 3] = (arr[mask, 3] * np.random.uniform(0.3, 0.7)).astype(np.uint8)
    
    # 边缘模糊（模拟印泥渗开）
    img = Image.fromarray(arr)
    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3, 0.8)))
    
    # 保存
    subdir = random.choice(["square_seals", "corner_seals", "irregular_seals", "wax_seals"])
    out_path = f"{OUTPUT_DIR}/{subdir}/seal_{idx:04d}.png"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path)
    return out_path

def main():
    print("🚀 书法字体印章渲染引擎启动")
    print(f"字体库: {len(FONTS)} 款")
    
    total = 300
    with ProcessPoolExecutor(max_workers=min(8, multiprocessing.cpu_count())) as executor:
        results = list(executor.map(generate_seal, range(total)))
    
    valid = [r for r in results if r]
    print(f"\n🏁 完成! 生成 {len(valid)}/{total} 枚印章")
    
    for subdir in ["square_seals", "corner_seals", "irregular_seals", "wax_seals"]:
        cnt = len([r for r in valid if f"/{subdir}/" in r])
        print(f"  {subdir}: {cnt}枚")

if __name__ == "__main__":
    main()
