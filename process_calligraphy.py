#!/usr/bin/env python3
"""
处理公共领域书法素材：
1. 裁剪出适合作为符咒背景的区域
2. 调整颜色匹配 v9.1 暖黄宣纸色
3. 提取印章区域
4. 生成多种尺寸的素材
"""

import os
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import numpy as np

BASE_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-assets"
OUTPUT_DIR = f"{BASE_DIR}/processed"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def process_background_texture(src_path, dest_path, target_size=(400, 640)):
    """处理书法图片作为背景纹理：去印章 + 暖黄化 + 模糊化"""
    img = Image.open(src_path)
    
    # 转换为 RGB
    if img.mode != "RGB":
        img = img.convert("RGB")
    
    # === 去印章：淡化高饱和红色区域 ===
    hsv = img.convert("HSV")
    h, s, v = hsv.split()
    arr_h = np.array(h)
    arr_s = np.array(s)
    arr_v = np.array(v)
    arr_rgb = np.array(img)
    
    # 红色区域：H在 0-20 或 230-255 范围内，且饱和度 > 80
    red_mask = ((arr_h < 20) | (arr_h > 230)) & (arr_s > 80)
    
    # 对红色印章区域：降低饱和度并提高亮度（融入底色）
    arr_s = np.where(red_mask, arr_s * 0.15, arr_s).astype(np.uint8)
    arr_v = np.where(red_mask, np.clip(arr_v * 1.15, 0, 255), arr_v).astype(np.uint8)
    
    hsv_denoised = Image.merge("HSV", (
        Image.fromarray(arr_h),
        Image.fromarray(arr_s),
        Image.fromarray(arr_v)
    ))
    img = hsv_denoised.convert("RGB")
    
    # 调整色调为暖黄宣纸色
    r, g, b = img.split()
    r = r.point(lambda i: min(255, int(i * 1.05)))
    g = g.point(lambda i: min(255, int(i * 1.02)))
    b = b.point(lambda i: int(i * 0.85))
    img = Image.merge("RGB", (r, g, b))
    
    # 增加对比度让墨色更浓
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.3)
    
    # 轻微模糊，营造宣纸晕染感 + 进一步淡化残留印章
    img = img.filter(ImageFilter.GaussianBlur(radius=1.2))
    
    # 调整大小
    img = img.resize(target_size, Image.Resampling.LANCZOS)
    
    img.save(dest_path, quality=95)
    print(f"✓ 背景纹理: {dest_path}")
    return dest_path

def extract_seal_region(src_path, dest_path, box):
    """从图片中提取印章区域"""
    img = Image.open(src_path)
    if img.mode != "RGB":
        img = img.convert("RGB")
    
    # 裁剪印章区域
    seal = img.crop(box)
    
    # 增强红色
    r, g, b = seal.split()
    r = r.point(lambda i: min(255, int(i * 1.2)))
    seal = Image.merge("RGB", (r, g, b))
    
    # 增加饱和度
    enhancer = ImageEnhance.Color(seal)
    seal = enhancer.enhance(1.5)
    
    seal.save(dest_path, quality=95)
    print(f"✓ 印章素材: {dest_path}")
    return dest_path

def create_paper_texture(dest_path, size=(400, 640)):
    """创建宣纸纹理（基于噪点）"""
    # 创建基础暖黄色
    base = Image.new("RGB", size, (249, 244, 237))  # #F9F4ED
    
    # 添加噪点模拟纤维
    arr = np.array(base)
    noise = np.random.normal(0, 3, arr.shape).astype(np.int16)
    arr = np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    texture = Image.fromarray(arr)
    
    # 轻微模糊
    texture = texture.filter(ImageFilter.GaussianBlur(radius=0.3))
    
    texture.save(dest_path, quality=95)
    print(f"✓ 宣纸纹理: {dest_path}")
    return dest_path

def main():
    # 处理背景纹理
    sources = [
        (f"{BASE_DIR}/calligraphy/Wang_Xianzhi_Imitation_by_Tang_Dynasty.jpg.jpg", "bg_wangxianzhi.jpg"),
        (f"{BASE_DIR}/calligraphy/Jizhiwengao_xqf.jpg.jpg", "bg_yanzhenqing.jpg"),
    ]
    
    for src, name in sources:
        if os.path.exists(src):
            process_background_texture(src, f"{OUTPUT_DIR}/{name}")
    
    # 从地黄汤帖提取印章区域 (大致坐标，基于 2264x1894 尺寸)
    # 右上角印章
    wangxianzhi = f"{BASE_DIR}/calligraphy/Wang_Xianzhi_Imitation_by_Tang_Dynasty.jpg.jpg"
    if os.path.exists(wangxianzhi):
        extract_seal_region(wangxianzhi, f"{OUTPUT_DIR}/seal_01.png", (1900, 50, 2200, 350))
        extract_seal_region(wangxianzhi, f"{OUTPUT_DIR}/seal_02.png", (50, 1450, 350, 1850))
    
    # 创建宣纸底纹
    create_paper_texture(f"{OUTPUT_DIR}/paper_texture.jpg")
    
    print(f"\n素材处理完成，保存在: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
