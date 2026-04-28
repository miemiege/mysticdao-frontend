#!/usr/bin/env python3
"""
MysticDAO Xuan Paper Texture Generator - Agent Batch 1 (Optimized)
Generates 20 high-quality rice paper textures with quality control.
"""

import os
import random
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
OUTPUT_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/raw_assets/textures/agent_batch_1"
SIZE = 1024
QUALITY = 95
TARGET_COLOR = np.array([249, 244, 237], dtype=np.float64)

MIN_RGB = np.array([230, 225, 215], dtype=np.float64)
MAX_RGB = np.array([245, 240, 232], dtype=np.float64)
MAX_DELTA_E = 30.0

# ---------------------------------------------------------------------------
# Quality
# ---------------------------------------------------------------------------
def delta_e(rgb):
    return float(np.linalg.norm(rgb - TARGET_COLOR))


def check_quality(img):
    arr = np.array(img, dtype=np.float64)
    mean_rgb = arr.mean(axis=(0, 1))
    de = delta_e(mean_rgb)
    passed = (
        np.all(mean_rgb >= MIN_RGB) and
        np.all(mean_rgb <= MAX_RGB) and
        de < MAX_DELTA_E
    )
    return mean_rgb, de, passed


# ---------------------------------------------------------------------------
# Base generation
# ---------------------------------------------------------------------------
def make_base(r, g, b, variation=4):
    base = np.full((SIZE, SIZE, 3), [r, g, b], dtype=np.float32)
    if variation > 0:
        noise = np.random.normal(0, variation, (SIZE, SIZE, 3)).astype(np.float32)
        base = np.clip(base + noise, 0, 255)
    return base.astype(np.uint8)


def add_pil_fibers(img, count, length_range, width_range, color_var, opacity):
    """Fast fiber drawing using PIL ImageDraw (C-level)."""
    overlay = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for _ in range(count):
        x1 = random.randint(-50, SIZE + 50)
        y1 = random.randint(-50, SIZE + 50)
        angle = random.uniform(0, math.pi)
        length = random.randint(*length_range)
        x2 = int(x1 + length * math.cos(angle))
        y2 = int(y1 + length * math.sin(angle))
        gray = random.randint(220 - color_var, 220 + color_var)
        gray = max(180, min(255, gray))
        alpha = int(opacity * 255)
        w = random.randint(*width_range)
        draw.line([(x1, y1), (x2, y2)], fill=(gray, gray, gray, alpha), width=w)
    # Composite overlay onto img
    img_rgba = img.convert('RGBA')
    composite = Image.alpha_composite(img_rgba, overlay)
    return composite.convert('RGB')


def add_numpy_noise(img_arr, sigma=6):
    noise = np.random.normal(0, sigma, img_arr.shape).astype(np.int16)
    return np.clip(img_arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)


def add_vignette(img_arr, strength=0.08):
    h, w = img_arr.shape[:2]
    y, x = np.ogrid[:h, :w]
    cy, cx = h // 2, w // 2
    max_d = math.sqrt(cx**2 + cy**2)
    dist = np.sqrt((x - cx)**2 + (y - cy)**2) / max_d
    mask = 1 - (dist ** 2) * strength
    mask = np.clip(mask, 0.6, 1.0)
    return (img_arr.astype(np.float32) * mask[:, :, None]).astype(np.uint8)


def add_soften_edges(img_arr, margin=20):
    h, w = img_arr.shape[:2]
    mask = np.ones((h, w), dtype=np.float32)
    for i in range(margin):
        a = i / margin
        mask[i, :] = a
        mask[h - 1 - i, :] = a
        mask[:, i] = np.minimum(mask[:, i], a)
        mask[:, w - 1 - i] = np.minimum(mask[:, w - 1 - i], a)
    # blend with base color
    base = np.array([235, 230, 220], dtype=np.float32)
    return (img_arr.astype(np.float32) * mask[:, :, None] + base * (1 - mask[:, :, None])).astype(np.uint8)


def pil_to_arr(img):
    return np.array(img)


def arr_to_pil(arr):
    return Image.fromarray(arr, 'RGB')


# ---------------------------------------------------------------------------
# Texture generators
# ---------------------------------------------------------------------------
def generate_xuan(variant):
    base = make_base(241, 236, 228, variation=4)
    img = arr_to_pil(base)
    count = int(SIZE * SIZE * (0.0015 + variant * 0.0002))
    img = add_pil_fibers(img, count, (15, 80), (1, 2), 12, 0.22 + variant * 0.03)
    arr = pil_to_arr(img)
    arr = add_numpy_noise(arr, sigma=5 + variant)
    arr = add_vignette(arr, strength=0.04 + variant * 0.01)
    return arr_to_pil(arr)


def generate_sajin(variant):
    base = make_base(242, 237, 229, variation=3)
    img = arr_to_pil(base)
    count = int(SIZE * SIZE * 0.0012)
    img = add_pil_fibers(img, count, (10, 60), (1, 2), 10, 0.18)
    arr = pil_to_arr(img)
    arr = add_numpy_noise(arr, sigma=4)

    # Golden flecks via numpy
    num_flecks = 250 + variant * 120
    xs = np.random.randint(0, SIZE, num_flecks)
    ys = np.random.randint(0, SIZE, num_flecks)
    golds = np.array([
        [218, 165, 32], [255, 215, 0],
        [238, 203, 88], [212, 175, 55],
    ])
    for i in range(num_flecks):
        x, y = xs[i], ys[i]
        gold = golds[i % len(golds)]
        a = random.uniform(0.25, 0.85)
        size = random.randint(0, 1)
        for dx in range(-size, size + 1):
            for dy in range(-size, size + 1):
                px, py = x + dx, y + dy
                if 0 <= px < SIZE and 0 <= py < SIZE:
                    arr[py, px] = (
                        arr[py, px].astype(np.float32) * (1 - a) + gold * a
                    ).astype(np.uint8)
    arr = add_vignette(arr, strength=0.05)
    return arr_to_pil(arr)


def generate_maobian(variant):
    base = make_base(242, 237, 229, variation=5)
    img = arr_to_pil(base)
    count = int(SIZE * SIZE * (0.003 + variant * 0.0005))
    img = add_pil_fibers(img, count, (30, 150), (2, 3), 14, 0.22 + variant * 0.02)
    arr = pil_to_arr(img)
    arr = add_numpy_noise(arr, sigma=5 + variant)

    # Rough patches - lighter, more subtle
    for _ in range(3 + variant):
        cx = random.randint(100, SIZE - 100)
        cy = random.randint(100, SIZE - 100)
        r = random.randint(20, 55)
        y, x = np.ogrid[:SIZE, :SIZE]
        mask = ((x - cx)**2 + (y - cy)**2) < r**2
        patch = random.randint(-6, 4)
        arr[:, :, 0] = np.where(mask, np.clip(arr[:, :, 0].astype(np.int16) + patch, 0, 255), arr[:, :, 0])
        arr[:, :, 1] = np.where(mask, np.clip(arr[:, :, 1].astype(np.int16) + patch, 0, 255), arr[:, :, 1])
        arr[:, :, 2] = np.where(mask, np.clip(arr[:, :, 2].astype(np.int16) + patch, 0, 255), arr[:, :, 2])

    arr = add_vignette(arr, strength=0.05)
    arr = add_soften_edges(arr, margin=12)
    return arr_to_pil(arr)


def generate_guzhi(variant):
    base = make_base(242, 237, 229, variation=4)
    img = arr_to_pil(base)
    count = int(SIZE * SIZE * 0.0012)
    img = add_pil_fibers(img, count, (20, 80), (1, 2), 10, 0.16)
    arr = pil_to_arr(img)
    arr = add_numpy_noise(arr, sigma=4)

    # Age spots - lighter and fewer
    num_spots = 3 + variant
    for _ in range(num_spots):
        cx = random.randint(80, SIZE - 80)
        cy = random.randint(80, SIZE - 80)
        r = random.randint(15, 45)
        y, x = np.ogrid[:SIZE, :SIZE]
        dist = np.sqrt((x - cx)**2 + (y - cy)**2)
        mask = dist < r
        intensity = random.uniform(0.04, 0.15)
        spots = [
            [195, 175, 145], [205, 185, 155],
            [190, 170, 140], [200, 180, 150],
        ]
        sc = random.choice(spots)
        for c in range(3):
            arr[:, :, c] = np.where(mask,
                (arr[:, :, c].astype(np.float32) * (1 - intensity) + sc[c] * intensity).astype(np.uint8),
                arr[:, :, c])
        # Slight blur for organic edge
        arr = arr_to_pil(arr).filter(ImageFilter.GaussianBlur(radius=max(1, r // 14)))
        arr = pil_to_arr(arr)

    arr = add_vignette(arr, strength=0.05 + variant * 0.008)
    return arr_to_pil(arr)


def generate_charan(variant):
    base = make_base(242, 237, 229, variation=4)
    img = arr_to_pil(base)
    count = int(SIZE * SIZE * 0.0012)
    img = add_pil_fibers(img, count, (15, 80), (1, 2), 10, 0.16)
    arr = pil_to_arr(img)
    arr = add_numpy_noise(arr, sigma=4)

    # Tea stains - lighter, more transparent
    num_stains = 2 + variant
    for _ in range(num_stains):
        cx = random.randint(120, SIZE - 120)
        cy = random.randint(120, SIZE - 120)
        stain = np.zeros((SIZE, SIZE), dtype=np.float32)
        for _ in range(random.randint(3, 6)):
            ox = cx + random.randint(-35, 35)
            oy = cy + random.randint(-35, 35)
            r = random.randint(20, 65)
            y, x = np.ogrid[:SIZE, :SIZE]
            d2 = (x - ox)**2 + (y - oy)**2
            stain = np.maximum(stain, np.exp(-d2.astype(np.float32) / (2 * (r/2)**2)))
        # Blur for diffusion look
        stain_img = Image.fromarray((stain * 255).astype(np.uint8), 'L')
        stain_img = stain_img.filter(ImageFilter.GaussianBlur(radius=random.uniform(12, 22)))
        stain = np.array(stain_img, dtype=np.float32) / 255.0
        stain = np.clip(stain * random.uniform(0.12, 0.35), 0, 1)

        tea_colors = [
            [200, 175, 140], [210, 185, 150],
            [195, 170, 135], [205, 180, 145],
        ]
        tc = random.choice(tea_colors)
        for c in range(3):
            arr[:, :, c] = (
                arr[:, :, c].astype(np.float32) * (1 - stain) + tc[c] * stain
            ).astype(np.uint8)

    arr = add_vignette(arr, strength=0.05)
    return arr_to_pil(arr)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    types = [
        ("xuan", generate_xuan),
        ("sajin", generate_sajin),
        ("maobian", generate_maobian),
        ("guzhi", generate_guzhi),
        ("charan", generate_charan),
    ]

    total_passed = 0
    total_failed = 0
    all_delta_e = []
    results = []

    for tname, gen_fn in types:
        for variant in range(4):
            max_attempts = 15
            best_img = None
            best_de = 999
            best_mean = None
            best_passed = False

            for attempt in range(max_attempts):
                local_seed = hash(f"{tname}_{variant}_{attempt}_{os.urandom(4).hex()}") % (2**31)
                random.seed(local_seed)
                np.random.seed(local_seed)

                img = gen_fn(variant)
                mean_rgb, de, passed = check_quality(img)

                if de < best_de:
                    best_img = img
                    best_de = de
                    best_mean = mean_rgb
                    best_passed = passed

                if passed:
                    break

            filename = f"{tname}_{variant + 1:02d}.jpg"
            filepath = os.path.join(OUTPUT_DIR, filename)
            best_img.save(filepath, quality=QUALITY, optimize=True)

            mean_rgb_str = f"[{best_mean[0]:.1f}, {best_mean[1]:.1f}, {best_mean[2]:.1f}]"
            status = "PASS" if best_passed else "FAIL"
            if best_passed:
                total_passed += 1
            else:
                total_failed += 1
            all_delta_e.append(best_de)

            print(f"{filename:20s}  {mean_rgb_str}  ΔE={best_de:.2f}  [{status}]")
            results.append({
                "file": filename,
                "mean_rgb": best_mean.tolist(),
                "delta_e": best_de,
                "passed": best_passed,
            })

    print("\n" + "=" * 70)
    print(f"Total: {total_passed + total_failed}  |  Passed: {total_passed}  |  Failed: {total_failed}")
    print(f"Average ΔE: {sum(all_delta_e) / len(all_delta_e):.2f}")
    print(f"Max ΔE: {max(all_delta_e):.2f}")
    print(f"Min ΔE: {min(all_delta_e):.2f}")
    print("=" * 70)

    if total_failed > 0:
        print("\nWARNING: Some textures did not pass quality control!")
        for r in results:
            if not r["passed"]:
                print(f"  - {r['file']}: mean_rgb={r['mean_rgb']}, ΔE={r['delta_e']:.2f}")
    else:
        print("\nAll textures passed quality control.")


if __name__ == "__main__":
    main()
