#!/usr/bin/env python3
"""
用真正的书法字体渲染高质量书法字素材
这是比程序化生成笔画质量高得多的方案——使用的是真实的书法字形
"""

import os
import random
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from concurrent.futures import ProcessPoolExecutor, as_completed
import multiprocessing

random.seed(42)
np.random.seed(42)

BASE_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-assets/source-library"
FONT_DIR = f"{BASE_DIR}/06_fonts/chinese_calligraphy"

# 加载所有字体
FONTS = []
for f in os.listdir(FONT_DIR):
    if f.endswith(('.ttf', '.otf', '.ttc')):
        FONTS.append(os.path.join(FONT_DIR, f))

print(f"加载了 {len(FONTS)} 款字体:")
for f in FONTS:
    print(f"  {os.path.basename(f)}")

# ============================================================
# 书法字内容
# ============================================================
SINGLE_CHARS = [
    "福", "財", "安", "明", "光", "運", "吉", "祥", "喜", "壽", "祿",
    "德", "慧", "靈", "龍", "鳳", "虎", "鶴", "松", "竹", "梅", "蘭",
    "道", "法", "易", "經", "卦", "爻", "陰", "陽", "乾", "坤", "離",
    "天", "地", "人", "日", "月", "星", "山", "水", "火", "風", "雷",
    "金", "木", "土", "玉", "寶", "瑞", "康", "寧", "泰", "和", "順",
]

TWO_CHARS = [
    "招財", "進寶", "平安", "如意", "吉祥", "開運", "納福", "迎祥",
    "長壽", "安康", "福祿", "喜慶", "天官", "地靈", "人和", "風順",
    "日新", "月異", "龍騰", "虎躍", "鳳舞", "鶴鳴", "松青", "竹翠",
    "道法", "自然", "乾坤", "陰陽", "八卦", "六爻", "五行", "太極",
]

THREE_CHARS = [
    "日進斗", "萬事興", "八方來", "吉星照", "五福臨", "百無忌",
    "天官賜", "紫氣東", "金玉堂", "龍鳳呈", "福祿壽", "喜盈門",
]

FOUR_CHARS = [
    "日進斗金", "萬事開泰", "天官賜福", "百無禁忌", "吉星高照",
    "金玉滿堂", "龍鳳呈祥", "紫氣東來", "福祿壽喜", "招財進寶",
    "平安如意", "吉祥如意", "五福臨門", "喜氣盈門", "財源廣進",
    "道法自然", "諸事順遂", "明照四方", "萬象更新", "春風得意",
    "海納百川", "厚德載物", "自強不息", "知行合一", "心誠則靈",
]

LONG_PHRASES = [
    "天官賜福百無禁忌",
    "吉星高照萬事如意",
    "福祿壽喜財德齊備",
    "招財進寶日進斗金",
    "道法自然天人合一",
    "乾坤朗朗陰陽調和",
]

# ============================================================
# 渲染引擎
# ============================================================
def render_text(text, font_path, font_size, output_path, style="ink"):
    """
    用真实书法字体渲染文字，叠加真实纸张纹理和墨韵效果
    style: ink(浓墨) / dry(枯笔) / wet(湿墨)
    """
    # 创建大尺寸画布（高清渲染）
    W, H = 800, 800
    
    # 加载字体
    try:
        font = ImageFont.truetype(font_path, font_size)
    except:
        return False
    
    # 计算文字尺寸
    dummy_img = Image.new("RGB", (1, 1))
    dummy_draw = ImageDraw.Draw(dummy_img)
    bbox = dummy_draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    # 居中
    tx = (W - tw) // 2 - bbox[0]
    ty = (H - th) // 2 - bbox[1]
    
    # 创建透明画布
    img = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # 墨色设置
    if style == "ink":
        # 浓墨
        ink = (random.randint(10, 30), random.randint(10, 30), random.randint(10, 30), random.randint(220, 255))
    elif style == "dry":
        # 枯笔 - 偏褐色
        ink = (random.randint(40, 70), random.randint(30, 50), random.randint(20, 40), random.randint(150, 200))
    else:  # wet
        # 湿墨 - 边缘淡
        ink = (random.randint(20, 40), random.randint(20, 40), random.randint(20, 40), random.randint(180, 230))
    
    # 渲染文字（多层叠加模拟墨色深浅）
    for layer in range(3):
        offset = random.randint(-1, 1)
        alpha_factor = 1 - layer * 0.15
        layer_ink = tuple(int(c * alpha_factor) if i < 3 else c for i, c in enumerate(ink))
        draw.text((tx + offset, ty + offset), text, fill=layer_ink, font=font)
    
    # 添加飞白效果（枯笔特有）
    if style == "dry" or random.random() < 0.3:
        arr = np.array(img)
        # 在笔画上随机添加透明点模拟飞白
        stroke_mask = np.any(arr[:, :, :3] < 200, axis=2)
        flywhite = np.random.random(arr.shape[:2]) < 0.03
        flywhite &= stroke_mask
        arr[flywhite, 3] = np.clip(arr[flywhite, 3] * 0.3, 0, 255).astype(np.uint8)
        img = Image.fromarray(arr)
    
    # 添加墨渍边缘晕染
    if style == "wet" or random.random() < 0.4:
        img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.5, 1.5)))
    
    # 裁剪到文字区域
    bbox = img.getbbox()
    if bbox:
        padding = 20
        bbox = (max(0, bbox[0]-padding), max(0, bbox[1]-padding),
                min(W, bbox[2]+padding), min(H, bbox[3]+padding))
        img = img.crop(bbox)
    
    # 保存
    img.save(output_path)
    return True

def render_on_paper(text, font_path, font_size, output_path):
    """在宣纸上渲染书法字"""
    W, H = 800, 800
    
    # 暖黄宣纸底色
    base = (random.randint(248, 255), random.randint(240, 250), random.randint(228, 242))
    img = Image.new("RGB", (W, H), base)
    
    # 加载字体
    try:
        font = ImageFont.truetype(font_path, font_size)
    except:
        return False
    
    # 计算文字尺寸
    dummy = Image.new("RGB", (1, 1))
    dd = ImageDraw.Draw(dummy)
    bbox = dd.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (W - tw) // 2 - bbox[0]
    ty = (H - th) // 2 - bbox[1]
    
    draw = ImageDraw.Draw(img)
    
    # 浓墨
    ink = (random.randint(15, 35), random.randint(15, 35), random.randint(15, 35))
    
    # 渲染
    draw.text((tx, ty), text, fill=ink, font=font)
    
    # 纸张纹理
    arr = np.array(img)
    noise = np.random.normal(0, 4, arr.shape).astype(np.int16)
    arr = np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    img = Image.fromarray(arr)
    
    # 纤维纹理
    arr = arr.astype(np.int16)
    for _ in range(random.randint(50, 150)):
        x = random.randint(0, W-1)
        y = random.randint(0, H-1)
        length = random.randint(5, 20)
        angle = random.uniform(-math.pi/6, math.pi/6)
        for i in range(length):
            px = int(x + i * math.cos(angle))
            py = int(y + i * math.sin(angle))
            if 0 <= px < W and 0 <= py < H:
                arr[py, px] = np.clip(arr[py, px] + random.randint(-8, 8), 0, 255)
    arr = arr.astype(np.uint8)
    img = Image.fromarray(arr)
    
    # 轻微模糊
    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.2, 0.6)))
    
    img.save(output_path, quality=95)
    return True

# ============================================================
# 批量生成
# ============================================================
def batch_render(args):
    text_list, font_idx, category, start_idx, use_paper = args
    font_path = FONTS[font_idx % len(FONTS)]
    results = []
    
    for i, text in enumerate(text_list):
        idx = start_idx + i
        
        # 随机选择风格
        style = random.choice(["ink", "dry", "wet"])
        
        # 透明背景版本
        out_transparent = f"{BASE_DIR}/01_calligraphy/{category}/char_{idx:04d}_{text}_{style}.png"
        if render_text(text, font_path, random.randint(120, 200), out_transparent, style):
            results.append(out_transparent)
        
        # 宣纸背景版本（每隔几张生成一个）
        if use_paper and random.random() < 0.3:
            out_paper = f"{BASE_DIR}/01_calligraphy/{category}/char_paper_{idx:04d}_{text}.jpg"
            if render_on_paper(text, font_path, random.randint(120, 200), out_paper):
                results.append(out_paper)
    
    return results

def main():
    print("🚀 书法字体渲染引擎启动")
    print("使用真实书法字体渲染高质量字形（非程序化笔画）\n")
    
    # 准备批次
    batches = []
    
    # 单字 - 每个字用多种字体渲染
    single_batches = []
    for font_idx in range(len(FONTS)):
        chars = SINGLE_CHARS[:]
        random.shuffle(chars)
        # 每个字体渲染前20个字
        for i in range(0, min(20, len(chars)), 5):
            batch = chars[i:i+5]
            batches.append((batch, font_idx, "single_char", len(batches)*5, True))
    
    # 两字
    for font_idx in range(min(5, len(FONTS))):
        random.shuffle(TWO_CHARS)
        batches.append((TWO_CHARS[:15], font_idx, "two_chars", len(batches)*15, False))
    
    # 四字
    for font_idx in range(min(5, len(FONTS))):
        random.shuffle(FOUR_CHARS)
        batches.append((FOUR_CHARS[:15], font_idx, "four_chars", len(batches)*15, False))
    
    print(f"总批次: {len(batches)}")
    
    # 多进程渲染
    all_results = []
    with ProcessPoolExecutor(max_workers=min(8, multiprocessing.cpu_count())) as executor:
        futures = {executor.submit(batch_render, batch): batch for batch in batches}
        completed = 0
        for future in as_completed(futures):
            results = future.result()
            all_results.extend(results)
            completed += 1
            if completed % 5 == 0:
                print(f"  ✅ {completed}/{len(batches)} 批次 | 累计 {len(all_results)} 张", flush=True)
    
    print(f"\n🏁 完成!")
    print(f"总计生成: {len(all_results)} 张书法字素材")
    
    # 统计
    for cat in ["single_char", "two_chars", "three_chars", "four_chars", "long_phrases"]:
        cnt = len([f for f in all_results if f"/{cat}/" in f])
        print(f"  {cat}: {cnt}张")

if __name__ == "__main__":
    main()
