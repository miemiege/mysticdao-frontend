#!/usr/bin/env python3
"""
印章变体生成器 Batch 2
基于程序化文字渲染 + 多种形状/风格，生成 25 张不同印章
"""

import os
import random
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

random.seed(2025)
np.random.seed(2025)

BASE_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend"
FONT_DIR = os.path.join(BASE_DIR, "public/talisman-assets/source-library/06_fonts/chinese_calligraphy")
OUTPUT_DIR = os.path.join(BASE_DIR, "raw_assets/seals/generated_batch2")
PREVIEW_PATH = os.path.join(OUTPUT_DIR, "preview_grid.png")

BASE_RED = (0xC4, 0x1E, 0x1E)
BG_WHITE = (255, 255, 255)

FONTS = {
    "MaShanZheng": os.path.join(FONT_DIR, "MaShanZheng.ttf"),
    "LiuJianMaoCao": os.path.join(FONT_DIR, "LiuJianMaoCao.ttf"),
    "LongCang": os.path.join(FONT_DIR, "LongCang.ttf"),
    "ZhiMangXing": os.path.join(FONT_DIR, "ZhiMangXing.ttf"),
    "ZCOOLKuaiLe": os.path.join(FONT_DIR, "ZCOOLKuaiLe.ttf"),
    "ZCOOLQingKeHuangYou": os.path.join(FONT_DIR, "ZCOOLQingKeHuangYou.ttf"),
    "ZCOOLXiaoWei": os.path.join(FONT_DIR, "ZCOOLXiaoWei.ttf"),
}


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def get_font(name, size):
    return ImageFont.truetype(FONTS[name], size)


def get_text_size(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


# ========================
# 形状 Mask 生成器
# ========================

def shape_square_rounded(size=256, radius=20):
    """方形圆角"""
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return mask


def shape_circle(size=256):
    """圆形"""
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse([0, 0, size - 1, size - 1], fill=255)
    return mask


def shape_ellipse(size=256):
    """椭圆形"""
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    margin = 10
    draw.ellipse([margin, margin + 20, size - margin, size - margin - 20], fill=255)
    return mask


def shape_gourd(size=256):
    """葫芦形（道教常用）：上下两个圆 + 中间连接"""
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    cx, cy = size // 2, size // 2
    r_big = size // 2 - 10
    r_small = size // 2 - 18
    # 上半圆（小）
    draw.ellipse([cx - r_small, 5, cx + r_small, 5 + r_small * 2], fill=255)
    # 下半圆（大）
    draw.ellipse([cx - r_big, size - r_big * 2 - 5, cx + r_big, size - 5], fill=255)
    # 中间连接矩形
    conn_w = min(r_small, r_big)
    draw.rectangle([cx - conn_w, cy - 15, cx + conn_w, cy + 15], fill=255)
    # 再次画两个圆覆盖边缘，确保平滑
    draw.ellipse([cx - r_small, 5, cx + r_small, 5 + r_small * 2], fill=255)
    draw.ellipse([cx - r_big, size - r_big * 2 - 5, cx + r_big, size - 5], fill=255)
    return mask


def shape_bagua(size=256):
    """八卦形：圆形外框 + S形分割线（简化版）"""
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    cx, cy = size // 2, size // 2
    r = size // 2 - 6
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
    # S曲线分割（用两个半圆反向切除）
    # 实际上八卦形整体还是圆形，只是内部有阴阳分割线
    # 这里我们保持圆形外框，但在视觉上用颜色区分
    return mask


def shape_irregular(size=256, seed=0):
    """不规则自然边缘：用随机扰动的多边形"""
    random.seed(seed)
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    cx, cy = size // 2, size // 2
    r_base = size // 2 - 15
    points = []
    n = 24
    for i in range(n):
        angle = 2 * math.pi * i / n
        r = r_base + random.randint(-12, 12)
        x = cx + int(r * math.cos(angle))
        y = cy + int(r * math.sin(angle))
        points.append((x, y))
    draw.polygon(points, fill=255)
    random.seed(2025)  # 恢复
    np.random.seed(2025)
    return mask


# ========================
# 风格渲染
# ========================

def render_zhuwen(text, font_name, font_size, shape_func, border_width=0, seed=0):
    """
    朱文（阳刻）：字红底透明，边框可选
    返回 RGBA Image
    """
    size = 256
    # 创建文字层（红色）
    text_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(text_img)
    font = get_font(font_name, font_size)
    tw, th = get_text_size(draw, text, font)
    x = (size - tw) // 2
    y = (size - th) // 2 - font_size // 8
    draw.text((x, y), text, font=font, fill=(*BASE_RED, 255))

    # 创建形状 mask
    shape_mask = shape_func(size, seed) if shape_func.__name__ == "shape_irregular" else shape_func(size)

    # 边框
    if border_width > 0:
        border_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        bdraw = ImageDraw.Draw(border_img)
        if shape_func.__name__ == "shape_square_rounded":
            bdraw.rounded_rectangle([0, 0, size - 1, size - 1], radius=20, outline=(*BASE_RED, 255), width=border_width)
        elif shape_func.__name__ in ("shape_circle", "shape_bagua"):
            bdraw.ellipse([0, 0, size - 1, size - 1], outline=(*BASE_RED, 255), width=border_width)
        elif shape_func.__name__ == "shape_ellipse":
            margin = 10
            bdraw.ellipse([margin, margin + 20, size - margin, size - margin - 20], outline=(*BASE_RED, 255), width=border_width)
        elif shape_func.__name__ == "shape_gourd":
            # 葫芦形边框简化：用红色轮廓线
            pass  # 葫芦形暂不画复杂边框
        elif shape_func.__name__ == "shape_irregular":
            pass  # 不规则形状不画边框
        text_img = Image.alpha_composite(text_img, border_img)

    # 用 shape_mask 裁剪
    arr = np.array(text_img)
    mask_arr = np.array(shape_mask)
    arr[:, :, 3] = (arr[:, :, 3].astype(np.float32) * mask_arr / 255).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


def render_baiwen(text, font_name, font_size, shape_func, border_width=0, seed=0):
    """
    白文（阴刻）：背景红字透明/白，边框可选
    返回 RGBA Image
    """
    size = 256
    # 创建完整红色背景层
    base = Image.new("RGBA", (size, size), (*BASE_RED, 255))

    # 创建文字 mask（字区域为透明）
    text_mask = Image.new("L", (size, size), 255)
    draw = ImageDraw.Draw(text_mask)
    font = get_font(font_name, font_size)
    tw, th = get_text_size(draw, text, font)
    x = (size - tw) // 2
    y = (size - th) // 2 - font_size // 8
    draw.text((x, y), text, font=font, fill=0)  # 字区域变黑（透明）

    # 形状 mask
    shape_mask = shape_func(size, seed) if shape_func.__name__ == "shape_irregular" else shape_func(size)

    # 合并：shape_mask 外透明，text_mask 内字透明
    final_mask = Image.new("L", (size, size), 0)
    final_mask.paste(shape_mask, (0, 0), shape_mask)
    final_mask = ImageChops.multiply(final_mask, text_mask)

    base.putalpha(final_mask)

    # 边框：在 base 上画红色边框（阴刻边框是背景色的一部分，所以是白色/透明的边缘？）
    # 白文边框：外框是红色，字是透明
    if border_width > 0:
        border_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        bdraw = ImageDraw.Draw(border_img)
        if shape_func.__name__ == "shape_square_rounded":
            bdraw.rounded_rectangle([0, 0, size - 1, size - 1], radius=20, outline=(*BASE_RED, 255), width=border_width)
        elif shape_func.__name__ in ("shape_circle", "shape_bagua"):
            bdraw.ellipse([0, 0, size - 1, size - 1], outline=(*BASE_RED, 255), width=border_width)
        elif shape_func.__name__ == "shape_ellipse":
            margin = 10
            bdraw.ellipse([margin, margin + 20, size - margin, size - margin - 20], outline=(*BASE_RED, 255), width=border_width)
        # 合并边框（边框在 shape 内）
        border_arr = np.array(border_img)
        mask_arr = np.array(shape_mask)
        border_arr[:, :, 3] = (border_arr[:, :, 3].astype(np.float32) * mask_arr / 255).astype(np.uint8)
        border_img = Image.fromarray(border_arr, "RGBA")
        base = Image.alpha_composite(base, border_img)

    return base


# 需要 ImageChops
from PIL import ImageChops


def render_borderless(text, font_name, font_size):
    """无边框纯字"""
    size = 256
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font = get_font(font_name, font_size)
    tw, th = get_text_size(draw, text, font)
    x = (size - tw) // 2
    y = (size - th) // 2 - font_size // 8
    draw.text((x, y), text, font=font, fill=(*BASE_RED, 255))
    return img


# ========================
# 效果处理
# ========================

def apply_erosion(img, severity=0.3):
    """边缘斑驳侵蚀"""
    arr = np.array(img)
    alpha = arr[:, :, 3].astype(np.float32)
    h, w = alpha.shape
    noise = np.random.rand(h, w)
    threshold = 1.0 - severity * 0.6
    erosion_mask = noise < threshold
    alpha = alpha * (0.75 + 0.25 * noise)
    if severity > 0.2:
        edge_noise = np.random.rand(h, w)
        edge_mask = (alpha < 180) & (alpha > 20)
        alpha[edge_mask & (edge_noise < severity * 0.4)] *= 0.3
    arr[:, :, 3] = alpha.clip(0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


def apply_displacement(img, strength=0.3):
    """位移纹理"""
    arr = np.array(img)
    alpha = arr[:, :, 3].astype(np.float32)
    h, w = alpha.shape
    y, x = np.mgrid[0:h, 0:w]
    noise = (
        np.sin(x / 12.0) * np.cos(y / 12.0) * 0.5
        + np.sin(x / 6.0 + y / 8.0) * 0.3
        + np.random.rand(h, w) * 0.2
    )
    noise = (noise - noise.min()) / (noise.max() - noise.min() + 1e-6)
    edge_region = (alpha > 30) & (alpha < 200)
    factor = 1.0 + (noise - 0.5) * strength * 1.5
    alpha[edge_region] = (alpha[edge_region] * factor[edge_region]).clip(0, 255)
    arr[:, :, 3] = alpha.astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


def apply_noise_speckles(img, density=0.15, color_rgb=BASE_RED):
    """随机噪点墨点"""
    arr = np.array(img)
    h, w = arr.shape[:2]
    num = int(density * 300)
    for _ in range(num):
        sx = random.randint(0, w - 1)
        sy = random.randint(0, h - 1)
        if arr[sy, sx, 3] > 10:
            size = random.choice([1, 1, 2, 2, 3])
            a = random.randint(30, 140)
            for dx in range(-size, size + 1):
                for dy in range(-size, size + 1):
                    nx, ny = sx + dx, sy + dy
                    if 0 <= nx < w and 0 <= ny < h and random.random() < 0.5:
                        arr[ny, nx, :3] = color_rgb
                        arr[ny, nx, 3] = max(arr[ny, nx, 3], a)
    return Image.fromarray(arr, "RGBA")


def apply_bagua_lines(img):
    """八卦形内部阴阳分割线"""
    arr = np.array(img)
    alpha = arr[:, :, 3]
    size = img.width
    overlay = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    cx, cy = size // 2, size // 2
    r = size // 2 - 6
    # S曲线：两个半圆弧
    # 上半黑鱼眼
    draw.arc([cx - r, cy - r, cx + r, cy + r], start=270, end=90, fill=(*BASE_RED, 180), width=2)
    # 中间横线简化
    draw.line([(cx, cy - r), (cx, cy + r)], fill=(*BASE_RED, 160), width=2)
    # 两个鱼眼小圆
    draw.ellipse([cx - 8, cy - r // 2 - 8, cx + 8, cy - r // 2 + 8], outline=(*BASE_RED, 160), width=2)
    draw.ellipse([cx - 8, cy + r // 2 - 8, cx + 8, cy + r // 2 + 8], outline=(*BASE_RED, 160), width=2)
    # 只在 shape 内显示
    oarr = np.array(overlay)
    mask = alpha > 30
    arr[mask] = np.maximum(arr[mask], oarr[mask])
    return Image.fromarray(arr, "RGBA")


# ========================
# 变体定义
# ========================

VARIANTS = [
    # (文字, 字体, 字号, 形状函数, 风格, 边框宽, 额外效果)
    {"text": "福", "font": "MaShanZheng", "size": 140, "shape": shape_circle, "style": "zhuwen", "border": 0, "erosion": 0.1, "displace": 0.2, "noise": 0.05},
    {"text": "禄", "font": "LiuJianMaoCao", "size": 140, "shape": shape_square_rounded, "style": "baiwen", "border": 0, "erosion": 0.2, "displace": 0.1, "noise": 0.1},
    {"text": "寿", "font": "LongCang", "size": 130, "shape": shape_gourd, "style": "zhuwen", "border": 0, "erosion": 0.15, "displace": 0.3, "noise": 0.0},
    {"text": "喜", "font": "ZhiMangXing", "size": 150, "shape": shape_ellipse, "style": "baiwen", "border": 0, "erosion": 0.25, "displace": 0.15, "noise": 0.15},
    {"text": "财", "font": "ZCOOLKuaiLe", "size": 140, "shape": shape_bagua, "style": "zhuwen", "border": 0, "erosion": 0.1, "displace": 0.2, "noise": 0.05, "bagua": True},
    {"text": "吉", "font": "ZCOOLQingKeHuangYou", "size": 140, "shape": shape_square_rounded, "style": "zhuwen", "border": 3, "erosion": 0.0, "displace": 0.1, "noise": 0.0},
    {"text": "祥", "font": "ZCOOLXiaoWei", "size": 140, "shape": shape_circle, "style": "baiwen", "border": 6, "erosion": 0.2, "displace": 0.25, "noise": 0.1},
    {"text": "安", "font": "MaShanZheng", "size": 150, "shape": shape_gourd, "style": "borderless", "border": 0, "erosion": 0.1, "displace": 0.2, "noise": 0.05},
    {"text": "康", "font": "LiuJianMaoCao", "size": 140, "shape": shape_irregular, "style": "zhuwen", "border": 0, "erosion": 0.3, "displace": 0.3, "noise": 0.2, "seed": 1},
    {"text": "宁", "font": "LongCang", "size": 150, "shape": shape_ellipse, "style": "baiwen", "border": 0, "erosion": 0.15, "displace": 0.1, "noise": 0.1},
    {"text": "天官", "font": "ZhiMangXing", "size": 100, "shape": shape_circle, "style": "zhuwen", "border": 0, "erosion": 0.2, "displace": 0.2, "noise": 0.1},
    {"text": "赐福", "font": "ZCOOLKuaiLe", "size": 100, "shape": shape_square_rounded, "style": "baiwen", "border": 0, "erosion": 0.25, "displace": 0.15, "noise": 0.15},
    {"text": "开运", "font": "ZCOOLQingKeHuangYou", "size": 100, "shape": shape_gourd, "style": "zhuwen", "border": 4, "erosion": 0.1, "displace": 0.2, "noise": 0.05},
    {"text": "招财", "font": "ZCOOLXiaoWei", "size": 100, "shape": shape_bagua, "style": "baiwen", "border": 5, "erosion": 0.3, "displace": 0.2, "noise": 0.1, "bagua": True},
    {"text": "平安", "font": "MaShanZheng", "size": 100, "shape": shape_ellipse, "style": "zhuwen", "border": 0, "erosion": 0.15, "displace": 0.25, "noise": 0.0},
    {"text": "吉祥", "font": "LiuJianMaoCao", "size": 100, "shape": shape_irregular, "style": "baiwen", "border": 0, "erosion": 0.2, "displace": 0.3, "noise": 0.15, "seed": 2},
    {"text": "如意", "font": "LongCang", "size": 100, "shape": shape_square_rounded, "style": "borderless", "border": 0, "erosion": 0.1, "displace": 0.15, "noise": 0.05},
    {"text": "天官赐福", "font": "ZhiMangXing", "size": 60, "shape": shape_circle, "style": "baiwen", "border": 0, "erosion": 0.2, "displace": 0.2, "noise": 0.1},
    {"text": "招财进宝", "font": "ZCOOLKuaiLe", "size": 58, "shape": shape_square_rounded, "style": "zhuwen", "border": 4, "erosion": 0.1, "displace": 0.1, "noise": 0.0},
    {"text": "万事如意", "font": "ZCOOLQingKeHuangYou", "size": 58, "shape": shape_gourd, "style": "zhuwen", "border": 3, "erosion": 0.15, "displace": 0.25, "noise": 0.1},
    {"text": "福", "font": "ZCOOLXiaoWei", "size": 140, "shape": shape_bagua, "style": "baiwen", "border": 6, "erosion": 0.25, "displace": 0.2, "noise": 0.15, "bagua": True},
    {"text": "寿", "font": "MaShanZheng", "size": 150, "shape": shape_ellipse, "style": "zhuwen", "border": 0, "erosion": 0.1, "displace": 0.2, "noise": 0.05},
    {"text": "喜", "font": "LiuJianMaoCao", "size": 140, "shape": shape_square_rounded, "style": "baiwen", "border": 0, "erosion": 0.2, "displace": 0.15, "noise": 0.1},
    {"text": "财", "font": "LongCang", "size": 150, "shape": shape_gourd, "style": "borderless", "border": 0, "erosion": 0.15, "displace": 0.3, "noise": 0.1},
    {"text": "吉", "font": "ZhiMangXing", "size": 140, "shape": shape_circle, "style": "zhuwen", "border": 3, "erosion": 0.0, "displace": 0.1, "noise": 0.0},
]


def generate_one(variant, idx):
    text = variant["text"]
    font = variant["font"]
    size = variant["size"]
    shape = variant["shape"]
    style = variant["style"]
    border = variant.get("border", 0)
    seed = variant.get("seed", idx)

    if style == "zhuwen":
        img = render_zhuwen(text, font, size, shape, border, seed)
    elif style == "baiwen":
        img = render_baiwen(text, font, size, shape, border, seed)
    elif style == "borderless":
        img = render_borderless(text, font, size)
    else:
        img = render_zhuwen(text, font, size, shape, border, seed)

    # 八卦形加内部线条
    if variant.get("bagua"):
        img = apply_bagua_lines(img)

    # 效果
    if variant.get("erosion", 0) > 0:
        img = apply_erosion(img, variant["erosion"])
    if variant.get("displace", 0) > 0:
        img = apply_displacement(img, variant["displace"])
    if variant.get("noise", 0) > 0:
        img = apply_noise_speckles(img, variant["noise"], BASE_RED)

    # 统一缩放到256x256（可能已经在此范围内，但保证居中）
    canvas = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    canvas.paste(img, (0, 0), img)
    return canvas


def create_preview_grid(images, cols=5, cell_size=256):
    n = len(images)
    rows = math.ceil(n / cols)
    grid_w = cols * cell_size
    grid_h = rows * cell_size
    grid = Image.new("RGBA", (grid_w, grid_h), (0xF5, 0xF0, 0xE6, 255))
    for i, img in enumerate(images):
        row = i // cols
        col = i % cols
        x = col * cell_size
        y = row * cell_size
        cx = x + (cell_size - img.width) // 2
        cy = y + (cell_size - img.height) // 2
        grid.paste(img, (cx, cy), img)
    return grid


def main():
    ensure_dir(OUTPUT_DIR)
    images = []
    print(f"开始生成 {len(VARIANTS)} 张印章变体...")
    print("=" * 60)

    for idx, variant in enumerate(VARIANTS):
        img = generate_one(variant, idx)
        filename = f"seal_batch2_{idx:03d}.png"
        filepath = os.path.join(OUTPUT_DIR, filename)
        img.save(filepath, "PNG")
        images.append(img)
        desc = f"{variant['text']} | {variant['font']} | {variant['style']} | {variant['shape'].__name__}"
        print(f"[{idx+1:02d}/{len(VARIANTS)}] {filename} → {desc}")

    preview = create_preview_grid(images, cols=5, cell_size=256)
    preview.save(PREVIEW_PATH, "PNG")
    print("=" * 60)
    print(f"预览拼图已保存: {PREVIEW_PATH} ({preview.width}×{preview.height})")
    print(f"共生成 {len(VARIANTS)} 张印章变体")


if __name__ == "__main__":
    main()
