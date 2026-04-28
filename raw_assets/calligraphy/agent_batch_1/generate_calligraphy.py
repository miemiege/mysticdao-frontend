#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MysticDAO 书法素材生成脚本
生成20张高质量毛笔书法字素材
"""

import os
import random
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import numpy as np

# ========== 配置 ==========
OUTPUT_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/raw_assets/calligraphy/agent_batch_1/"
FONT_PATH_BRUSH = "/tmp/MaShanZheng-Regular.ttf"
FONT_PATH_SERIF = "/tmp/NotoSerifCJKsc-Regular.otf"
IMAGE_WIDTH = 512
IMAGE_HEIGHT = 768
BG_COLOR = (249, 244, 237)  # 暖黄宣纸 #f9f4ed
TEXT_COLOR = (15, 15, 15)   # 浓黑，略偏暖

# 20幅作品的内容与布局
ARTWORKS = [
    # (文件名, 文字列表, 布局方向, 单字/多字标识)
    ("01_qian", ["乾"], "vertical", "single"),
    ("02_kun", ["坤"], "vertical", "single"),
    ("03_zhen", ["震"], "vertical", "single"),
    ("04_xun", ["巽"], "vertical", "single"),
    ("05_kan", ["坎"], "vertical", "single"),
    ("06_li", ["离"], "vertical", "single"),
    ("07_gen", ["艮"], "vertical", "single"),
    ("08_dui", ["兑"], "vertical", "single"),
    ("09_taiji", ["太", "极"], "vertical", "multi"),
    ("10_wuji", ["无", "极"], "vertical", "multi"),
    ("11_yinyang", ["阴", "阳"], "horizontal", "multi"),
    ("12_bagua", ["八", "卦"], "horizontal", "multi"),
    ("13_daofaziran", ["道", "法", "自", "然"], "vertical", "multi"),
    ("14_tianguancifu", ["天", "官", "赐", "福"], "vertical", "multi"),
    ("15_yi", ["易"], "vertical", "single"),
    ("16_dao", ["道"], "vertical", "single"),
    ("17_de", ["德"], "vertical", "single"),
    ("18_fu", ["福"], "vertical", "single"),
    ("19_wuxing", ["五", "行"], "horizontal", "multi"),
    ("20_qiankun", ["乾", "坤"], "vertical", "multi"),
]


def create_paper_texture(width, height, seed=None):
    """生成宣纸纹理"""
    if seed is not None:
        np.random.seed(seed)
    
    # 基础底色
    base = np.ones((height, width, 3), dtype=np.uint8) * np.array(BG_COLOR, dtype=np.uint8)
    
    # 添加细微噪声
    noise = np.random.normal(0, 3, (height, width, 3)).astype(np.int16)
    base = np.clip(base.astype(np.int16) + noise, 230, 255).astype(np.uint8)
    
    # 添加纤维纹理（横向细线）
    fiber = np.zeros((height, width), dtype=np.uint8)
    for _ in range(height // 4):
        y = random.randint(0, height - 1)
        intensity = random.randint(200, 245)
        fiber[y, :] = intensity
    fiber_img = Image.fromarray(fiber, mode='L').filter(ImageFilter.GaussianBlur(radius=0.5))
    
    img = Image.fromarray(base, mode='RGB')
    # 轻微泛黄不均匀
    yellow_tint = Image.new('RGB', (width, height), (255, 250, 240))
    img = Image.blend(img, yellow_tint, random.uniform(0.05, 0.15))
    
    return img


def add_edge_aging(img, intensity=0.3):
    """添加边缘泛黄做旧效果"""
    width, height = img.size
    aging = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(aging)
    
    # 边缘渐变
    for i in range(60):
        alpha = int(255 * intensity * (1 - i / 60) * random.uniform(0.3, 0.8))
        color = (180, 160, 120, alpha)
        draw.rectangle([i, i, width - 1 - i, height - 1 - i], outline=color, width=1)
    
    # 随机角落加深
    corners = [
        (0, 0, 80, 80),
        (width - 80, 0, width, 80),
        (0, height - 80, 80, height),
        (width - 80, height - 80, width, height),
    ]
    for cx1, cy1, cx2, cy2 in corners:
        if random.random() > 0.3:
            overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
            odraw = ImageDraw.Draw(overlay)
            odraw.ellipse([cx1, cy1, cx2, cy2], fill=(160, 140, 100, int(80 * intensity)))
            aging = Image.alpha_composite(aging, overlay)
    
    img_rgba = img.convert('RGBA')
    result = Image.alpha_composite(img_rgba, aging)
    return result.convert('RGB')


def add_tea_stains(img, count=3):
    """添加茶渍效果"""
    width, height = img.size
    rgba = img.convert('RGBA')
    
    for _ in range(count):
        stain = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(stain)
        
        cx = random.randint(50, width - 50)
        cy = random.randint(50, height - 50)
        rx = random.randint(20, 60)
        ry = random.randint(20, 60)
        alpha = random.randint(10, 30)
        color = (160, 130, 90, alpha)
        
        draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=color)
        stain = stain.filter(ImageFilter.GaussianBlur(radius=random.uniform(10, 25)))
        rgba = Image.alpha_composite(rgba, stain)
    
    return rgba.convert('RGB')


def create_feibai_mask(width, height, density=0.08):
    """生成飞白遮罩（毛笔干墨效果）"""
    mask = np.ones((height, width), dtype=np.float32)
    
    # 随机横向飞白条（更细更稀疏）
    num_strips = max(3, int(height * density / 10))
    for _ in range(num_strips):
        y = random.randint(0, height - 1)
        thickness = random.randint(1, 2)
        strength = random.uniform(0.2, 0.6)
        mask[max(0, y - thickness):min(height, y + thickness), :] *= (1 - strength)
    
    # 随机斜向飞白
    for _ in range(num_strips // 2):
        x1, y1 = random.randint(0, width), random.randint(0, height)
        length = random.randint(15, 50)
        angle = random.uniform(-0.5, 0.5)
        strength = random.uniform(0.15, 0.5)
        for step in range(length):
            x = int(x1 + step * math.cos(angle))
            y = int(y1 + step * math.sin(angle))
            if 0 <= x < width and 0 <= y < height:
                mask[y, x] *= (1 - strength)
                for dy in range(-1, 2):
                    for dx in range(-1, 2):
                        if 0 <= x + dx < width and 0 <= y + dy < height:
                            mask[y + dy, x + dx] *= (1 - strength * 0.4)
    
    return Image.fromarray((mask * 255).astype(np.uint8), mode='L')


def add_seal(img, x, y, size=40):
    """添加红色印章效果"""
    rgba = img.convert('RGBA')
    seal = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(seal)
    
    # 印章底色（朱红）
    red = (180, 40, 30, 200)
    draw.rectangle([x, y, x + size, y + size], fill=red, outline=(140, 30, 25, 220), width=2)
    
    # 印章内文字（简化版，画个小点模拟）
    draw.ellipse([x + size // 3, y + size // 3, x + size * 2 // 3, y + size * 2 // 3], fill=(220, 220, 200, 180))
    
    # 模糊一点点
    seal = seal.filter(ImageFilter.GaussianBlur(radius=0.3))
    result = Image.alpha_composite(rgba, seal)
    return result.convert('RGB')


def render_calligraphy(text_list, layout, style_type, seed=None):
    """渲染一幅书法作品"""
    if seed is not None:
        random.seed(seed)
        np.random.seed(seed)
    
    width, height = IMAGE_WIDTH, IMAGE_HEIGHT
    
    # 创建宣纸背景
    img = create_paper_texture(width, height, seed=seed)
    
    # 确定字号
    if style_type == "single":
        font_size = random.randint(280, 380)
    else:
        if layout == "vertical":
            font_size = random.randint(140, 200)
        else:
            font_size = random.randint(120, 160)
    
    try:
        font = ImageFont.truetype(FONT_PATH_BRUSH, font_size)
    except:
        font = ImageFont.truetype(FONT_PATH_SERIF, font_size)
    
    # ========== 文字渲染（修复：统一在临时层绘制，避免ImageDraw引用旧对象）==========
    tmp_draw_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    tmp_draw = ImageDraw.Draw(tmp_draw_layer)
    
    # 计算布局
    char_positions = []  # 存储每个字的位置
    
    if layout == "vertical":
        total_height = 0
        max_width = 0
        for t in text_list:
            bbox = tmp_draw.textbbox((0, 0), t, font=font)
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            total_height += th
            max_width = max(max_width, tw)
        
        spacing = font_size // 8
        total_height += spacing * (len(text_list) - 1)
        
        start_x = (width - max_width) // 2
        start_y = (height - total_height) // 2
        
        current_y = start_y
        for t in text_list:
            bbox = tmp_draw.textbbox((0, 0), t, font=font)
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            x = start_x + (max_width - tw) // 2
            y = current_y
            char_positions.append((t, x, y))
            current_y += th + spacing
    else:
        total_width = 0
        max_height = 0
        for t in text_list:
            bbox = tmp_draw.textbbox((0, 0), t, font=font)
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            total_width += tw
            max_height = max(max_height, th)
        
        spacing = font_size // 6
        total_width += spacing * (len(text_list) - 1)
        
        start_x = (width - total_width) // 2
        start_y = (height - max_height) // 2
        
        current_x = start_x
        for t in text_list:
            bbox = tmp_draw.textbbox((0, 0), t, font=font)
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            x = current_x
            y = start_y + (max_height - th) // 2
            char_positions.append((t, x, y))
            current_x += tw + spacing
    
    # 创建最终文字层
    text_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    text_draw = ImageDraw.Draw(text_layer)
    
    # 独立阴影层，避免循环中重新赋值text_layer导致ImageDraw引用失效
    shadow_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_layer)
    
    for t, x, y in char_positions:
        # 主字
        text_draw.text((x, y), t, font=font, fill=(*TEXT_COLOR, 255))
        
        # 笔锋偏移阴影（累积到独立层）
        shadow_draw.text(
            (x + random.randint(-2, 2), y + random.randint(-1, 1)),
            t, font=font, fill=(30, 30, 30, 60)
        )
    
    # 统一合并阴影层
    text_layer = Image.alpha_composite(text_layer, shadow_layer)
    
    # ========== 飞白效果 ==========
    text_rgba = text_layer.split()
    text_alpha = text_rgba[3] if len(text_rgba) == 4 else text_rgba[0]
    
    feibai = create_feibai_mask(width, height, density=random.uniform(0.1, 0.25))
    feibai = feibai.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.5, 1.5)))
    
    feibai_array = np.array(feibai).astype(np.float32) / 255.0
    text_alpha_array = np.array(text_alpha).astype(np.float32) / 255.0
    
    feibai_strength = random.uniform(0.15, 0.35)
    combined_alpha = text_alpha_array * (1 - feibai_strength * (1 - feibai_array))
    
    new_alpha = Image.fromarray((combined_alpha * 255).astype(np.uint8), mode='L')
    
    text_color_layer = Image.new('RGBA', (width, height), (*TEXT_COLOR, 255))
    text_layer = Image.merge('RGBA', [
        text_color_layer.split()[0],
        text_color_layer.split()[1],
        text_color_layer.split()[2],
        new_alpha
    ])
    
    # 添加墨韵（轻微模糊+叠加）
    ink_blur = text_layer.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.8, 2.0)))
    ink_blur = ImageEnhance.Brightness(ink_blur).enhance(0.5)
    text_layer = Image.alpha_composite(ink_blur, text_layer)
    
    # 叠加文字到背景
    img_rgba = img.convert('RGBA')
    img_rgba = Image.alpha_composite(img_rgba, text_layer)
    img = img_rgba.convert('RGB')
    
    # ========== 后处理效果 ==========
    # 边缘做旧
    img = add_edge_aging(img, intensity=random.uniform(0.2, 0.5))
    
    # 茶渍
    if random.random() > 0.3:
        img = add_tea_stains(img, count=random.randint(1, 4))
    
    # 印章（部分作品添加）
    if random.random() > 0.4:
        seal_x = random.randint(width - 100, width - 60)
        seal_y = random.randint(height - 120, height - 60)
        img = add_seal(img, seal_x, seal_y, size=random.randint(30, 50))
    
    # 轻微整体调色（更古朴）
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(random.uniform(0.7, 0.95))
    
    # 轻微对比度
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(random.uniform(0.9, 1.1))
    
    return img


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    success = 0
    failed = 0
    results = []
    
    for i, (filename, text_list, layout, style_type) in enumerate(ARTWORKS):
        try:
            seed = 42 + i * 7  # 确定性但多样的种子
            img = render_calligraphy(text_list, layout, style_type, seed=seed)
            
            # 确保最小尺寸 400x640
            if img.width < 400 or img.height < 640:
                img = img.resize((max(400, img.width), max(640, img.height)), Image.LANCZOS)
            
            output_path = os.path.join(OUTPUT_DIR, f"{filename}.jpg")
            img.save(output_path, "JPEG", quality=95, optimize=True)
            
            success += 1
            text_display = "".join(text_list)
            results.append(f"✓ {filename}.jpg - {text_display} ({img.width}x{img.height})")
        except Exception as e:
            failed += 1
            results.append(f"✗ {filename}.jpg - ERROR: {e}")
    
    # 报告
    print(f"\n{'='*50}")
    print(f"生成完成: 成功 {success} / 失败 {failed}")
    print(f"{'='*50}")
    for r in results:
        print(r)
    
    # 验证文件
    print(f"\n{'='*50}")
    print("文件验证:")
    for f in sorted(os.listdir(OUTPUT_DIR)):
        if f.endswith('.jpg'):
            fpath = os.path.join(OUTPUT_DIR, f)
            size = os.path.getsize(fpath)
            with Image.open(fpath) as im:
                print(f"  {f}: {im.width}x{im.height}, {size/1024:.1f}KB")


if __name__ == "__main__":
    main()
