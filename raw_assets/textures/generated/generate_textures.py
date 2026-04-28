#!/usr/bin/env python3
"""
程序化宣纸/手工纸纹理生成器
 mysticdao-frontend 项目专用
"""

import os
import random
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from PIL.ImageFilter import GaussianBlur

# ─── 全局设定 ───
SEED = 42
random.seed(SEED)
np.random.seed(SEED)

OUT_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/raw_assets/textures/generated"
W, H = 1024, 1024
QUALITY = 90

# 宣纸底色范围（暖黄系）
BASE_COLORS = ["#f5f0e8", "#f7f2e8", "#faf5ed", "#f3ede2", "#f6f1e6", "#f8f3ea"]


def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip("#")
    return tuple(int(hex_str[i : i + 2], 16) for i in (0, 2, 4))


def base_color(variation=0):
    """返回暖黄底色 RGB 元组"""
    colors = BASE_COLORS[variation % len(BASE_COLORS)]
    return hex_to_rgb(colors)


def make_base(color, w=W, h=H):
    """创建纯色底色，并添加极轻微的随机噪点模拟纸张颗粒"""
    arr = np.full((h, w, 3), color, dtype=np.uint8)
    noise = np.random.randint(-6, 7, size=(h, w, 3), dtype=np.int16)
    arr = np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)


# ═══════════════════════════════════════════════════════════════
#  1. 洒金宣纸（暖黄底色 + 金色闪光点）
# ═══════════════════════════════════════════════════════════════
def gen_sajin(idx, variation=0):
    """洒金宣纸"""
    img = make_base(base_color(variation))
    arr = np.array(img).astype(np.uint16)

    # 金色参数
    gold = np.array([200, 170, 80], dtype=np.uint16)
    density = 0.002 + variation * 0.0005  # 闪光点密度
    count = int(W * H * density)

    for _ in range(count):
        x = random.randint(0, W - 1)
        y = random.randint(0, H - 1)
        size = random.choice([1, 1, 2, 2, 3])  # 大多数很小，偶尔大一点
        brightness = random.uniform(0.4, 1.0)
        g = (gold * brightness).astype(np.uint16)

        # 绘制闪光点（圆形/十字形）
        for dx in range(-size, size + 1):
            for dy in range(-size, size + 1):
                if dx * dx + dy * dy <= size * size:
                    px, py = x + dx, y + dy
                    if 0 <= px < W and 0 <= py < H:
                        # 混合模式
                        arr[py, px] = np.clip(
                            arr[py, px].astype(np.float32) * 0.6 + g.astype(np.float32) * 0.4,
                            0, 255
                        ).astype(np.uint16)

    return Image.fromarray(arr.astype(np.uint8))


# ═══════════════════════════════════════════════════════════════
#  2. 粗纤维毛边纸
# ═══════════════════════════════════════════════════════════════
def gen_maobian(idx, variation=0):
    """粗纤维毛边纸 - 贝塞尔曲线模拟纤维 + 毛边"""
    img = make_base(base_color(variation))
    draw = ImageDraw.Draw(img)
    arr = np.array(img)

    # 生成大量纤维线（贝塞尔曲线近似）
    fiber_color = (180, 160, 130) if variation == 0 else (160, 145, 120)
    num_fibers = 800 + variation * 200

    for _ in range(num_fibers):
        x1 = random.randint(0, W)
        y1 = random.randint(0, H)
        # 纤维一般有一定长度和方向
        angle = random.uniform(0, math.pi)
        length = random.randint(20, 120)
        x2 = int(x1 + math.cos(angle) * length)
        y2 = int(y1 + math.sin(angle) * length)

        # 贝塞尔控制点，让纤维微弯曲
        cx = (x1 + x2) // 2 + random.randint(-15, 15)
        cy = (y1 + y2) // 2 + random.randint(-15, 15)

        # 用短线段逼近贝塞尔曲线
        steps = random.randint(3, 8)
        pts = []
        for t in np.linspace(0, 1, steps):
            bx = int((1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t ** 2 * x2)
            by = int((1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t ** 2 * y2)
            pts.append((bx, by))

        width = random.choice([1, 1, 1, 2])
        alpha = random.randint(40, 100)
        c = (*fiber_color, alpha)
        if len(pts) > 1:
            draw.line(pts, fill=fiber_color, width=width)

    # 毛边效果 - 边缘随机凹凸 + 深色纤维聚集
    img = img.filter(GaussianBlur(radius=0.5))

    # 边缘加深（毛边感）
    arr = np.array(img)
    mask = np.zeros((H, W), dtype=np.float32)
    for y in range(H):
        for x in range(W):
            # 计算到边缘的距离
            d = min(x, y, W - 1 - x, H - 1 - y)
            if d < 30:
                mask[y, x] = (30 - d) / 30 * 0.15
    mask = np.clip(mask, 0, 0.15)
    arr = np.clip(arr.astype(np.float32) * (1 - mask[:, :, None]), 0, 255).astype(np.uint8)

    return Image.fromarray(arr)


# ═══════════════════════════════════════════════════════════════
#  3. 云母笺（底色 + 白色闪光鳞片）
# ═══════════════════════════════════════════════════════════════
def gen_yunmu(idx, variation=0):
    """云母笺 - 白色/银白色小椭圆鳞片"""
    img = make_base(base_color(variation + 2))
    draw = ImageDraw.Draw(img)

    # 云母鳞片
    num_scales = 300 + variation * 150
    for _ in range(num_scales):
        x = random.randint(0, W)
        y = random.randint(0, H)
        rx = random.randint(2, 6)
        ry = random.randint(1, 3)
        angle = random.uniform(0, 180)

        # 亮度变化
        brightness = random.randint(180, 255)
        color = (brightness, brightness, int(brightness * 0.95))

        # 绘制椭圆
        bbox = [x - rx, y - ry, x + rx, y + ry]
        draw.ellipse(bbox, fill=color)

        # 部分鳞片加高光点
        if random.random() < 0.3:
            hx = x + random.randint(-1, 1)
            hy = y + random.randint(-1, 1)
            draw.ellipse([hx - 1, hy - 1, hx + 1, hy + 1], fill=(255, 255, 250))

    img = img.filter(GaussianBlur(radius=0.3))
    return img


# ═══════════════════════════════════════════════════════════════
#  4. 做旧古纸（褐斑 + 边缘褪色 + 污渍）
# ═══════════════════════════════════════════════════════════════
def gen_guzhi(idx, variation=0):
    """做旧古纸 - 多层噪声叠加 + 边缘暗角 + 褐斑"""
    # 偏暗的底色
    base = np.array([230, 220, 200]) + variation * np.array([5, 3, -5])
    base = np.clip(base, 0, 255).astype(np.uint8)
    arr = np.full((H, W, 3), base, dtype=np.uint8)

    # 1. 大尺度低频噪声（整体不均匀）
    noise_large = np.random.rand(H // 16, W // 16).astype(np.float32)
    noise_large = np.array(Image.fromarray((noise_large * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR))
    noise_large = noise_large.astype(np.float32) / 255.0

    # 2. 中频噪声
    noise_mid = np.random.rand(H // 4, W // 4).astype(np.float32)
    noise_mid = np.array(Image.fromarray((noise_mid * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR))
    noise_mid = noise_mid.astype(np.float32) / 255.0

    # 3. 高频噪声
    noise_high = np.random.rand(H, W).astype(np.float32)

    # 组合噪声
    combined = noise_large * 0.5 + noise_mid * 0.3 + noise_high * 0.2
    combined = (combined - combined.min()) / (combined.max() - combined.min())

    # 褐斑效果 - 局部变暗并偏褐
    brown = np.array([120, 90, 60], dtype=np.float32)
    for y in range(H):
        for x in range(W):
            n = combined[y, x]
            if n > 0.75:  # 褐斑区域
                factor = (n - 0.75) / 0.25 * 0.6
                arr[y, x] = np.clip(
                    arr[y, x].astype(np.float32) * (1 - factor) + brown * factor,
                    0, 255
                ).astype(np.uint8)
            else:
                # 轻微整体做旧
                factor = n * 0.08
                arr[y, x] = np.clip(arr[y, x].astype(np.float32) * (1 - factor * 0.5), 0, 255).astype(np.uint8)

    # 边缘暗角 - 非常轻微的柔和暗角
    for y in range(H):
        for x in range(W):
            dx = min(x, W - 1 - x) / (W * 0.5)
            dy = min(y, H - 1 - y) / (H * 0.5)
            d = min(dx, dy)
            if d < 1.0:
                vignette = d * 0.96 + 0.04  # 边缘极轻微变暗
                arr[y, x] = (arr[y, x].astype(np.float32) * vignette).astype(np.uint8)

    # 添加纸张纤维纹理
    img = Image.fromarray(arr)
    draw = ImageDraw.Draw(img)
    for _ in range(300):
        x1 = random.randint(0, W)
        y1 = random.randint(0, H)
        length = random.randint(10, 60)
        angle = random.uniform(0, math.pi)
        x2 = int(x1 + math.cos(angle) * length)
        y2 = int(y1 + math.sin(angle) * length)
        draw.line([(x1, y1), (x2, y2)], fill=(170, 155, 130), width=1)

    # 污渍 - 随机椭圆暗区
    for _ in range(15 + variation * 5):
        x = random.randint(0, W)
        y = random.randint(0, H)
        rx = random.randint(20, 80)
        ry = random.randint(15, 60)
        # 半透明暗色椭圆
        stain = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(stain)
        alpha = random.randint(10, 35)
        sdraw.ellipse([x - rx, y - ry, x + rx, y + ry], fill=(60, 45, 30, alpha))
        stain = stain.filter(GaussianBlur(radius=random.randint(8, 20)))
        img = Image.alpha_composite(img.convert("RGBA"), stain).convert("RGB")
        draw = ImageDraw.Draw(img)

    return img


# ═══════════════════════════════════════════════════════════════
#  5. 茶染纸
# ═══════════════════════════════════════════════════════════════
def gen_charan(idx, variation=0):
    """茶染纸 - 不均匀黄褐色"""
    # 茶色底色
    tea_base = np.array([210, 185, 150]) + variation * np.array([5, -3, -8])
    arr = np.full((H, W, 3), tea_base, dtype=np.uint8)

    # 生成Perlin-like噪声用于茶渍分布
    def noise_layer(scale):
        small = np.random.rand(H // scale, W // scale).astype(np.float32)
        return np.array(Image.fromarray((small * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)) / 255.0

    n1 = noise_layer(32)
    n2 = noise_layer(16)
    n3 = noise_layer(8)
    noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2

    # 茶渍颜色（深浅不一的黄褐）
    tea_dark = np.array([160, 120, 70], dtype=np.float32)
    tea_light = np.array([230, 205, 170], dtype=np.float32)

    for y in range(H):
        for x in range(W):
            val = noise[y, x]
            if val > 0.55:
                # 深色茶渍
                factor = (val - 0.55) / 0.45 * 0.5
                arr[y, x] = np.clip(
                    arr[y, x].astype(np.float32) * (1 - factor) + tea_dark * factor,
                    0, 255
                ).astype(np.uint8)
            elif val < 0.35:
                # 浅色区域
                factor = (0.35 - val) / 0.35 * 0.3
                arr[y, x] = np.clip(
                    arr[y, x].astype(np.float32) * (1 - factor) + tea_light * factor,
                    0, 255
                ).astype(np.uint8)

    # 添加水渍边缘效果（随机同心圆环的渐变）
    img = Image.fromarray(arr)
    draw = ImageDraw.Draw(img)
    for _ in range(5 + variation):
        cx = random.randint(100, W - 100)
        cy = random.randint(100, H - 100)
        max_r = random.randint(60, 150)
        for r in range(max_r, 0, -3):
            alpha = int(8 * (1 - r / max_r))
            color = (180 + random.randint(-10, 10), 140 + random.randint(-10, 10), 90 + random.randint(-10, 10))
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(*color,))

    return img


# ═══════════════════════════════════════════════════════════════
#  6. 竹纸
# ═══════════════════════════════════════════════════════════════
def gen_zhuzhi(idx, variation=0):
    """竹纸 - 微青色调 + 竹纤维纹理"""
    # 微青底色
    bamboo_base = np.array([225, 230, 215]) + variation * np.array([3, 5, 3])
    arr = np.full((H, W, 3), bamboo_base, dtype=np.uint8)

    img = Image.fromarray(arr)
    draw = ImageDraw.Draw(img)

    # 竹纤维 - 更细更直的纤维
    fiber_color = (160, 170, 145) if variation == 0 else (150, 160, 135)
    num_fibers = 1200

    for _ in range(num_fibers):
        x1 = random.randint(0, W)
        y1 = random.randint(0, H)
        length = random.randint(30, 200)
        # 竹纤维更直，角度更集中
        angle = random.uniform(-0.3, 0.3) + variation * 0.2
        x2 = int(x1 + math.cos(angle) * length)
        y2 = int(y1 + math.sin(angle) * length)

        # 竹纤维微弯曲
        cx = (x1 + x2) // 2 + random.randint(-5, 5)
        cy = (y1 + y2) // 2 + random.randint(-5, 5)

        steps = random.randint(4, 10)
        pts = []
        for t in np.linspace(0, 1, steps):
            bx = int((1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t ** 2 * x2)
            by = int((1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t ** 2 * y2)
            pts.append((bx, by))

        if len(pts) > 1:
            alpha = random.randint(30, 70)
            draw.line(pts, fill=fiber_color, width=1)

    # 竹节纹理 - 横向的节点
    for _ in range(20 + variation * 10):
        y = random.randint(0, H)
        x1 = random.randint(0, W - 100)
        x2 = x1 + random.randint(50, 150)
        draw.line([(x1, y), (x2, y)], fill=(140, 150, 125), width=random.randint(1, 2))

    img = img.filter(GaussianBlur(radius=0.3))
    return img


# ═══════════════════════════════════════════════════════════════
#  7. 水印纸
# ═══════════════════════════════════════════════════════════════
def gen_shuiyin(idx, variation=0):
    """水印纸 - subtle 圆环/文字水印"""
    img = make_base(base_color(variation + 1))
    draw = ImageDraw.Draw(img)

    # subtle 水印 - 比底色略深或略浅
    if variation == 0:
        # 圆环水印
        mark_color = (225, 215, 195)
        for _ in range(12):
            cx = random.randint(100, W - 100)
            cy = random.randint(100, H - 100)
            r = random.randint(40, 100)
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=mark_color, width=2)
            # 内环
            if random.random() < 0.5:
                draw.ellipse([cx - r // 2, cy - r // 2, cx + r // 2, cy + r // 2], outline=mark_color, width=1)
    else:
        # 条纹/波纹水印
        mark_color = (220, 210, 190)
        for y in range(0, H, 30):
            offset = int(15 * math.sin(y / 40))
            draw.line([(0 + offset, y), (W + offset, y)], fill=mark_color, width=2)

    # 更subtle的整体纹理
    arr = np.array(img).astype(np.float32)
    noise = np.random.rand(H, W).astype(np.float32) * 0.04 - 0.02
    arr = np.clip(arr * (1 + noise[:, :, None]), 0, 255).astype(np.uint8)

    return Image.fromarray(arr)


# ═══════════════════════════════════════════════════════════════
#  8. 褶皱纸
# ═══════════════════════════════════════════════════════════════
def gen_zhezhou(idx, variation=0):
    """褶皱纸 - 轻微褶皱阴影效果"""
    img = make_base(base_color(variation))
    arr = np.array(img).astype(np.float32)

    # 生成褶皱的位移场（使用多层噪声）
    def make_displacement(scale):
        n = np.random.rand(H // scale, W // scale).astype(np.float32)
        n = np.array(Image.fromarray((n * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)) / 255.0
        return n

    dx = make_displacement(16) * 2 - 1
    dy = make_displacement(16) * 2 - 1

    # 褶皱阴影 - 基于位移梯度
    shadow = np.zeros((H, W), dtype=np.float32)
    for y in range(1, H - 1):
        for x in range(1, W - 1):
            gx = abs(dx[y, x + 1] - dx[y, x - 1])
            gy = abs(dy[y + 1, x] - dy[y - 1, x])
            shadow[y, x] = (gx + gy) * 0.5

    # 平滑阴影
    shadow = np.array(Image.fromarray((shadow / shadow.max() * 255).astype(np.uint8)).filter(GaussianBlur(radius=5)))
    shadow = shadow.astype(np.float32) / 255.0

    # 应用阴影到图像
    shadow_strength = 0.12 + variation * 0.04
    for y in range(H):
        for x in range(W):
            s = shadow[y, x] * shadow_strength
            # 褶皱凸起亮，凹陷暗
            if (x + y) % 73 < 37:  # 伪随机决定凹凸
                arr[y, x] *= (1 - s)
            else:
                arr[y, x] *= (1 + s * 0.3)

    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)


# ═══════════════════════════════════════════════════════════════
#  9. 细绢纸
# ═══════════════════════════════════════════════════════════════
def gen_xijuan(idx, variation=0):
    """细绢纸 - 丝网交织纹理"""
    img = make_base(base_color(variation + 2))
    arr = np.array(img)

    # 丝网纹理 - 密集的交叉线
    grid_spacing = 4 + variation
    thread_color_light = (245, 240, 230)
    thread_color_dark = (200, 190, 175)

    # 横向丝
    for y in range(0, H, grid_spacing):
        for x in range(W):
            if x % 2 == 0:
                arr[y, x] = thread_color_light if y % (grid_spacing * 2) == 0 else thread_color_dark

    # 纵向丝
    for x in range(0, W, grid_spacing):
        for y in range(H):
            if y % 2 == 0:
                # 交织处 - 检查是否已经被横向丝染色
                px = arr[y, x]
                is_horizontal = (
                    (px[0] == thread_color_light[0] and px[1] == thread_color_light[1] and px[2] == thread_color_light[2]) or
                    (px[0] == thread_color_dark[0] and px[1] == thread_color_dark[1] and px[2] == thread_color_dark[2])
                )
                if is_horizontal:
                    arr[y, x] = (220, 215, 200)
                else:
                    arr[y, x] = thread_color_dark if x % (grid_spacing * 2) == 0 else thread_color_light

    img = Image.fromarray(arr)

    # 再次混合，让纹理更自然
    base = make_base(base_color(variation + 2))
    img = Image.blend(base, img, alpha=0.55)

    return img


# ═══════════════════════════════════════════════════════════════
#  10. 斑点皮纸
# ═══════════════════════════════════════════════════════════════
def gen_bandian(idx, variation=0):
    """斑点皮纸 - 不规则深色斑点"""
    img = make_base(base_color(variation))
    draw = ImageDraw.Draw(img)

    # 深色斑点
    num_spots = 60 + variation * 30
    for _ in range(num_spots):
        x = random.randint(0, W)
        y = random.randint(0, H)
        rx = random.randint(5, 40)
        ry = random.randint(4, 30)
        angle = random.uniform(0, 180)

        # 斑点颜色 - 深褐/黑褐
        darkness = random.randint(40, 100)
        color = (darkness + 20, darkness, darkness - 10)
        color = tuple(max(0, min(255, c)) for c in color)

        # 创建带模糊的椭圆
        spot = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(spot)
        sdraw.ellipse([x - rx, y - ry, x + rx, y + ry], fill=(*color, random.randint(30, 80)))
        spot = spot.filter(GaussianBlur(radius=random.randint(2, 8)))
        img = Image.alpha_composite(img.convert("RGBA"), spot).convert("RGB")
        draw = ImageDraw.Draw(img)

    # 再添加一些小点
    arr = np.array(img)
    for _ in range(500):
        x = random.randint(0, W - 1)
        y = random.randint(0, H - 1)
        if random.random() < 0.5:
            arr[y, x] = (80, 60, 45)
        else:
            arr[y, x] = (100, 80, 60)

    return Image.fromarray(arr)


# ═══════════════════════════════════════════════════════════════
#  主程序
# ═══════════════════════════════════════════════════════════════
GENERATORS = [
    ("sajin", gen_sajin),
    ("maobian", gen_maobian),
    ("yunmu", gen_yunmu),
    ("guzhi", gen_guzhi),
    ("charan", gen_charan),
    ("zhuzhi", gen_zhuzhi),
    ("shuiyin", gen_shuiyin),
    ("zhezhou", gen_zhezhou),
    ("xijuan", gen_xijuan),
    ("bandian", gen_bandian),
]


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    generated = []

    seq = 1
    for type_name, gen_func in GENERATORS:
        for var in range(2):  # 每种2张变体
            print(f"Generating {type_name} variant {var + 1} ...")
            img = gen_func(seq, variation=var)
            filename = f"texture_proc_{type_name}_{seq:03d}.jpg"
            filepath = os.path.join(OUT_DIR, filename)
            img.save(filepath, "JPEG", quality=QUALITY)
            print(f"  Saved: {filename}")
            generated.append((filepath, img, f"{type_name} {var + 1}"))
            seq += 1

    print(f"\n共生成 {len(generated)} 张纹理")

    # ─── 生成预览拼图（5×4 网格）───
    print("\n生成预览拼图 ...")
    cols, rows = 5, 4
    thumb_w, thumb_h = 256, 256
    preview_w = cols * thumb_w
    preview_h = rows * thumb_h
    preview = Image.new("RGB", (preview_w, preview_h), (255, 255, 255))

    for i, (path, img, label) in enumerate(generated):
        col = i % cols
        row = i // cols
        # 缩略图
        thumb = img.copy()
        thumb.thumbnail((thumb_w, thumb_h))
        # 创建固定大小的缩略图画布
        canvas = Image.new("RGB", (thumb_w, thumb_h), (240, 240, 240))
        # 居中放置
        ox = (thumb_w - thumb.width) // 2
        oy = (thumb_h - thumb.height) // 2
        canvas.paste(thumb, (ox, oy))

        # 添加标签
        draw = ImageDraw.Draw(canvas)
        # 尝试添加文字标签（如果没有字体就用默认）
        label_text = label.replace(" ", "_")
        try:
            draw.text((5, 5), label_text, fill=(80, 60, 40))
        except Exception:
            pass

        preview.paste(canvas, (col * thumb_w, row * thumb_h))

    preview_path = os.path.join(OUT_DIR, "texture_preview_grid.jpg")
    preview.save(preview_path, "JPEG", quality=QUALITY)
    print(f"预览拼图保存: {preview_path}")


if __name__ == "__main__":
    main()
