#!/usr/bin/env python3
"""
印章变体生成器
基于2张基础印章，参数化生成15-20张不同风格的印章变体
"""

import os
import random
import math
from PIL import Image, ImageFilter, ImageDraw, ImageOps
import numpy as np

# 固定随机种子以保证可复现（可注释掉以获取真正随机结果）
random.seed(42)
np.random.seed(42)

# 路径配置
BASE_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend"
SOURCE_DIR = os.path.join(BASE_DIR, "public/talisman-assets/自己整理z素材库/seal")
OUTPUT_DIR = os.path.join(BASE_DIR, "raw_assets/seals/generated")
PREVIEW_PATH = os.path.join(OUTPUT_DIR, "preview_grid.png")

# 朱砂红基准色
BASE_RED = (0xC4, 0x1E, 0x1E)

# 颜色调色板：朱砂红及其变体 + 暗红/砖红
COLOR_PALETTE = [
    {"name": "朱砂红", "rgb": (0xC4, 0x1E, 0x1E)},
    {"name": "深朱砂", "rgb": (0xA0, 0x18, 0x18)},
    {"name": "浅朱砂", "rgb": (0xD8, 0x4A, 0x4A)},
    {"name": "暗红",   "rgb": (0x8B, 0x0A, 0x0A)},
    {"name": "砖红",   "rgb": (0xB2, 0x22, 0x22)},
    {"name": "赤褐",   "rgb": (0x99, 0x33, 0x33)},
    {"name": "绯红",   "rgb": (0xDC, 0x14, 0x3C)},
    {"name": "殷红",   "rgb": (0xBE, 0x0F, 0x0F)},
]


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def load_sources():
    """加载两张基础印章"""
    s0 = Image.open(os.path.join(SOURCE_DIR, "seal_0050.png")).convert("RGBA")
    s1 = Image.open(os.path.join(SOURCE_DIR, "seal_0051.png")).convert("RGBA")
    return [s0, s1]


def change_color(img: Image.Image, target_rgb: tuple) -> Image.Image:
    """
    将印章的红色调替换为目标RGB，保持明度/饱和度关系
    策略：提取非透明区域，基于原图亮度映射到新颜色
    """
    arr = np.array(img)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

    # 只处理非透明且偏红的像素
    mask = a > 20
    if not np.any(mask):
        return img.copy()

    # 计算原图亮度 (0-255)
    brightness = 0.299 * r + 0.587 * g + 0.114 * b

    # 目标颜色的亮度
    target_brightness = 0.299 * target_rgb[0] + 0.587 * target_rgb[1] + 0.114 * target_rgb[2]

    # 根据原图亮度比例映射到新颜色（保持阴影层次）
    ratio = brightness / (target_brightness + 1e-6)
    ratio = np.clip(ratio, 0.2, 2.0)

    new_r = np.clip(target_rgb[0] * ratio, 0, 255).astype(np.uint8)
    new_g = np.clip(target_rgb[1] * ratio, 0, 255).astype(np.uint8)
    new_b = np.clip(target_rgb[2] * ratio, 0, 255).astype(np.uint8)

    out = arr.copy()
    out[mask, 0] = new_r[mask]
    out[mask, 1] = new_g[mask]
    out[mask, 2] = new_b[mask]
    return Image.fromarray(out, "RGBA")


def apply_opacity(img: Image.Image, opacity: float) -> Image.Image:
    """调整整体透明度，opacity: 0.0-1.0"""
    arr = np.array(img)
    arr[:, :, 3] = (arr[:, :, 3].astype(np.float32) * opacity).clip(0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


def apply_rotation(img: Image.Image, angle: float) -> Image.Image:
    """旋转±角度，扩展画布保持中心，再裁剪回256x256"""
    # 扩展画布避免裁剪
    expanded = Image.new("RGBA", (400, 400), (0, 0, 0, 0))
    x = (400 - img.width) // 2
    y = (400 - img.height) // 2
    expanded.paste(img, (x, y), img)
    rotated = expanded.rotate(angle, resample=Image.BICUBIC, expand=False)
    # 裁剪回中心256x256
    left = (400 - 256) // 2
    top = (400 - 256) // 2
    return rotated.crop((left, top, left + 256, top + 256))


def apply_scale(img: Image.Image, scale: float) -> Image.Image:
    """缩放后居中放置到256x256画布"""
    new_w = int(img.width * scale)
    new_h = int(img.height * scale)
    scaled = img.resize((new_w, new_h), Image.LANCZOS)
    canvas = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    x = (256 - new_w) // 2
    y = (256 - new_h) // 2
    canvas.paste(scaled, (x, y), scaled)
    return canvas


def apply_erosion(img: Image.Image, severity: float) -> Image.Image:
    """
    斑驳度/边缘粗糙：对Alpha通道进行随机侵蚀
    severity: 0-1.0
    """
    arr = np.array(img)
    alpha = arr[:, :, 3].astype(np.float32)

    # 生成噪声图来模拟侵蚀
    noise_h, noise_w = alpha.shape
    noise = np.random.rand(noise_h, noise_w)

    # 边缘区域更容易被侵蚀：基于到最近非透明像素的距离
    # 简化：根据alpha值本身做随机削减
    threshold = 1.0 - severity * 0.6  # severity越高，削减越狠
    erosion_mask = noise < threshold

    # 对低alpha区域加大侵蚀
    alpha = alpha * (0.7 + 0.3 * noise)  # 随机保留70%-100%

    # 额外：severity高时，边缘随机挖空
    if severity > 0.3:
        edge_noise = np.random.rand(noise_h, noise_w)
        edge_mask = (alpha < 180) & (alpha > 20)  # 边缘区域
        alpha[edge_mask & (edge_noise < severity * 0.4)] *= 0.3

    arr[:, :, 3] = alpha.clip(0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


def apply_displacement_texture(img: Image.Image, strength: float) -> Image.Image:
    """
    位移纹理：模拟印泥边缘的feTurbulence效果
    用随机噪声扭曲Alpha通道的边缘
    """
    arr = np.array(img)
    alpha = arr[:, :, 3].astype(np.float32)

    h, w = alpha.shape
    # 生成低频Perlin-like噪声（简化版：多层正弦+随机）
    y, x = np.mgrid[0:h, 0:w]
    noise = (
        np.sin(x / 15.0) * np.cos(y / 15.0) * 0.5
        + np.sin(x / 7.0 + y / 9.0) * 0.3
        + np.random.rand(h, w) * 0.2
    )
    noise = (noise - noise.min()) / (noise.max() - noise.min() + 1e-6)

    # 对边缘区域应用位移：alpha中等的地方受影响最大
    edge_region = (alpha > 30) & (alpha < 200)
    factor = 1.0 + (noise - 0.5) * strength * 1.5
    alpha[edge_region] = (alpha[edge_region] * factor[edge_region]).clip(0, 255)

    arr[:, :, 3] = alpha.astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


def apply_noise_speckles(img: Image.Image, density: float, color_rgb: tuple) -> Image.Image:
    """
    噪点/随机墨点：模拟古旧感和纤维混入
    density: 0-1.0
    """
    arr = np.array(img)
    h, w = arr.shape[:2]

    num_speckles = int(density * 400)  # 最多400个噪点
    for _ in range(num_speckles):
        sx = random.randint(0, w - 1)
        sy = random.randint(0, h - 1)
        # 只在已有印章附近添加噪点（更自然）
        if arr[sy, sx, 3] > 10:
            size = random.choice([1, 1, 2, 2, 3])
            alpha_val = random.randint(30, 150)
            for dx in range(-size, size + 1):
                for dy in range(-size, size + 1):
                    nx, ny = sx + dx, sy + dy
                    if 0 <= nx < w and 0 <= ny < h:
                        if random.random() < 0.6:
                            arr[ny, nx, :3] = color_rgb
                            arr[ny, nx, 3] = max(arr[ny, nx, 3], alpha_val)

    return Image.fromarray(arr, "RGBA")


def add_fiber_texture(img: Image.Image, color_rgb: tuple) -> Image.Image:
    """
    添加细微纤维纹理，模拟印泥中的纤维感
    """
    arr = np.array(img)
    h, w = arr.shape[:2]
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    num_fibers = random.randint(20, 50)
    for _ in range(num_fibers):
        x1 = random.randint(0, w)
        y1 = random.randint(0, h)
        length = random.randint(5, 20)
        angle = random.uniform(0, math.pi)
        x2 = int(x1 + length * math.cos(angle))
        y2 = int(y1 + length * math.sin(angle))
        alpha = random.randint(20, 80)
        draw.line([(x1, y1), (x2, y2)], fill=(*color_rgb, alpha), width=random.randint(1, 2))

    # 只在原图印章区域叠加纤维
    overlay_arr = np.array(overlay)
    mask = arr[:, :, 3] > 30
    arr[mask] = np.maximum(arr[mask], overlay_arr[mask])
    return Image.fromarray(arr, "RGBA")


def generate_variant(base_img: Image.Image, params: dict, idx: int) -> tuple:
    """
    根据参数生成单张变体
    返回 (处理后的图, 参数描述字符串)
    """
    img = base_img.copy()
    desc_parts = []

    # 1. 颜色变体
    if "color" in params:
        c = params["color"]
        img = change_color(img, c["rgb"])
        desc_parts.append(f"颜色:{c['name']}")

    # 2. 缩放
    if "scale" in params:
        s = params["scale"]
        img = apply_scale(img, s)
        desc_parts.append(f"缩放:{s:.0%}")

    # 3. 旋转
    if "rotate" in params:
        r = params["rotate"]
        img = apply_rotation(img, r)
        desc_parts.append(f"旋转:{r:+.1f}°")

    # 4. 斑驳度（侵蚀）
    if "erosion" in params:
        e = params["erosion"]
        img = apply_erosion(img, e)
        desc_parts.append(f"斑驳:{e:.0%}")

    # 5. 位移纹理
    if "displace" in params:
        d = params["displace"]
        img = apply_displacement_texture(img, d)
        desc_parts.append(f"位移:{d:.0%}")

    # 6. 透明度
    if "opacity" in params:
        o = params["opacity"]
        img = apply_opacity(img, o)
        desc_parts.append(f"透明:{o:.0%}")

    # 7. 噪点墨点
    if "noise" in params:
        n = params["noise"]
        color = params.get("color", {"rgb": BASE_RED})["rgb"]
        img = apply_noise_speckles(img, n, color)
        desc_parts.append(f"噪点:{n:.0%}")

    # 8. 纤维纹理
    if params.get("fiber", False):
        color = params.get("color", {"rgb": BASE_RED})["rgb"]
        img = add_fiber_texture(img, color)
        desc_parts.append("纤维")

    return img, " | ".join(desc_parts)


# ========================
# 预定义20组参数组合
# ========================
VARIANTS = [
    # 基础变体 ——  seal_0050
    {"base": 0, "color": COLOR_PALETTE[0],  "scale": 1.0,   "rotate": 0,    "erosion": 0.0,  "displace": 0.0, "opacity": 1.0,  "noise": 0.0,  "fiber": False},  # 基准
    {"base": 0, "color": COLOR_PALETTE[1],  "scale": 0.95,  "rotate": -2,   "erosion": 0.2,  "displace": 0.1, "opacity": 0.95, "noise": 0.1,  "fiber": False},  # 深朱砂+轻微斑驳
    {"base": 0, "color": COLOR_PALETTE[2],  "scale": 1.05,  "rotate": 3,    "erosion": 0.0,  "displace": 0.3, "opacity": 0.9,  "noise": 0.0,  "fiber": True},   # 浅朱砂+位移+纤维
    {"base": 0, "color": COLOR_PALETTE[3],  "scale": 0.92,  "rotate": -4,   "erosion": 0.4,  "displace": 0.2, "opacity": 0.85, "noise": 0.2,  "fiber": False},  # 暗红+高斑驳
    {"base": 0, "color": COLOR_PALETTE[4],  "scale": 1.0,   "rotate": 1,    "erosion": 0.1,  "displace": 0.0, "opacity": 1.0,  "noise": 0.15, "fiber": True},   # 砖红+噪点+纤维
    {"base": 0, "color": COLOR_PALETTE[5],  "scale": 0.98,  "rotate": -1,   "erosion": 0.3,  "displace": 0.4, "opacity": 0.88, "noise": 0.05, "fiber": False},  # 赤褐+位移
    {"base": 0, "color": COLOR_PALETTE[6],  "scale": 1.08,  "rotate": 4,    "erosion": 0.0,  "displace": 0.1, "opacity": 0.75, "noise": 0.0,  "fiber": False},  # 绯红+大+透明
    {"base": 0, "color": COLOR_PALETTE[7],  "scale": 0.94,  "rotate": -3,   "erosion": 0.5,  "displace": 0.2, "opacity": 0.92, "noise": 0.25, "fiber": True},   # 殷红+重斑驳+噪点
    {"base": 0, "color": COLOR_PALETTE[0],  "scale": 1.02,  "rotate": 2,    "erosion": 0.15, "displace": 0.5, "opacity": 0.8,  "noise": 0.1,  "fiber": False},  # 朱砂+强位移
    {"base": 0, "color": COLOR_PALETTE[1],  "scale": 0.9,   "rotate": -5,   "erosion": 0.6,  "displace": 0.3, "opacity": 0.7,  "noise": 0.3,  "fiber": True},   # 极小+极旧

    # 基础变体 ——  seal_0051
    {"base": 1, "color": COLOR_PALETTE[0],  "scale": 1.0,   "rotate": 0,    "erosion": 0.0,  "displace": 0.0, "opacity": 1.0,  "noise": 0.0,  "fiber": False},  # 基准
    {"base": 1, "color": COLOR_PALETTE[2],  "scale": 0.96,  "rotate": 2,    "erosion": 0.25, "displace": 0.15,"opacity": 0.93, "noise": 0.05, "fiber": False},  # 浅朱砂
    {"base": 1, "color": COLOR_PALETTE[3],  "scale": 1.04,  "rotate": -3,   "erosion": 0.35, "displace": 0.25,"opacity": 0.87, "noise": 0.15, "fiber": True},   # 暗红+纤维
    {"base": 1, "color": COLOR_PALETTE[4],  "scale": 0.93,  "rotate": 4,    "erosion": 0.1,  "displace": 0.0, "opacity": 0.98, "noise": 0.0,  "fiber": False},  # 砖红+轻微
    {"base": 1, "color": COLOR_PALETTE[5],  "scale": 1.06,  "rotate": -2,   "erosion": 0.45, "displace": 0.35,"opacity": 0.82, "noise": 0.2,  "fiber": False},  # 赤褐+位移
    {"base": 1, "color": COLOR_PALETTE[6],  "scale": 0.97,  "rotate": 1,    "erosion": 0.05, "displace": 0.2, "opacity": 0.9,  "noise": 0.1,  "fiber": True},   # 绯红+纤维
    {"base": 1, "color": COLOR_PALETTE[7],  "scale": 1.03,  "rotate": -4,   "erosion": 0.55, "displace": 0.1, "opacity": 0.78, "noise": 0.35, "fiber": False},  # 殷红+重噪
    {"base": 1, "color": COLOR_PALETTE[0],  "scale": 0.91,  "rotate": 5,    "erosion": 0.3,  "displace": 0.45,"opacity": 0.85, "noise": 0.1,  "fiber": True},   # 小+旋+位移
    {"base": 1, "color": COLOR_PALETTE[1],  "scale": 1.07,  "rotate": -1,   "erosion": 0.2,  "displace": 0.0, "opacity": 0.72, "noise": 0.0,  "fiber": False},  # 大+半透明
]


def create_preview_grid(images: list, cols: int = 4, cell_size: int = 256) -> Image.Image:
    """创建4×N预览拼图"""
    n = len(images)
    rows = math.ceil(n / cols)
    grid_w = cols * cell_size
    grid_h = rows * cell_size

    # 背景：米黄色纸张质感
    grid = Image.new("RGBA", (grid_w, grid_h), (0xF5, 0xF0, 0xE6, 255))

    for i, img in enumerate(images):
        row = i // cols
        col = i % cols
        x = col * cell_size
        y = row * cell_size

        # 居中放置
        cx = x + (cell_size - img.width) // 2
        cy = y + (cell_size - img.height) // 2
        grid.paste(img, (cx, cy), img)

    return grid


def main():
    ensure_dir(OUTPUT_DIR)
    sources = load_sources()
    generated_images = []
    generated_meta = []

    print(f"加载基础印章: seal_0050.png, seal_0051.png")
    print(f"目标输出目录: {OUTPUT_DIR}")
    print("=" * 60)

    for idx, params in enumerate(VARIANTS):
        base_idx = params["base"]
        base_img = sources[base_idx]
        img, desc = generate_variant(base_img, params, idx)

        filename = f"seal_gen_{idx:03d}.png"
        filepath = os.path.join(OUTPUT_DIR, filename)
        img.save(filepath, "PNG")

        generated_images.append(img)
        generated_meta.append({
            "idx": idx,
            "filename": filename,
            "base": f"seal_005{base_idx}.png",
            "desc": desc,
        })
        print(f"[{idx+1:02d}/{len(VARIANTS)}] {filename} ← {desc}")

    # 生成预览拼图
    preview = create_preview_grid(generated_images, cols=4, cell_size=256)
    preview.save(PREVIEW_PATH, "PNG")
    print("=" * 60)
    print(f"预览拼图已保存: {PREVIEW_PATH} ({preview.width}×{preview.height})")
    print(f"共生成 {len(VARIANTS)} 张印章变体")

    # 输出参数汇总表
    print("\n参数汇总表:")
    print("-" * 80)
    for m in generated_meta:
        print(f"  {m['filename']} | 源:{m['base']} | {m['desc']}")
    print("-" * 80)


if __name__ == "__main__":
    main()
