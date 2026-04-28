#!/usr/bin/env python3
"""
三路并行真实素材批量获取
1. Met Museum API — 大量关键词批量下载
2. 真实字体渲染 — 用7款Google Fonts生成高清书法字卡
3. Wikimedia Commons — 单线程慢速下载
"""

import os
import sys
import json
import time
import random
import math
import urllib.request
import urllib.parse
import urllib.error
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import numpy as np

# ============================================================
# CONFIG
# ============================================================
BASE_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-assets/source-library"
MET_API = "https://collectionapi.metmuseum.org/public/collection/v1"
WIKI_API = "https://commons.wikimedia.org/w/api.php"
HEADERS = {"User-Agent": "MysticDAO-AssetBot/1.0 (educational-research)"}

os.makedirs(f"{BASE_DIR}/01_calligraphy/single_char", exist_ok=True)
os.makedirs(f"{BASE_DIR}/01_calligraphy/two_chars", exist_ok=True)
os.makedirs(f"{BASE_DIR}/01_calligraphy/four_chars", exist_ok=True)
os.makedirs(f"{BASE_DIR}/02_seals_stamps/square_seals", exist_ok=True)
os.makedirs(f"{BASE_DIR}/02_seals_stamps/corner_seals", exist_ok=True)
os.makedirs(f"{BASE_DIR}/03_textures_backgrounds/xuan_paper", exist_ok=True)
os.makedirs(f"{BASE_DIR}/03_textures_backgrounds/ink_bleeding", exist_ok=True)
os.makedirs(f"{BASE_DIR}/04_patterns_decorations/cloud_patterns", exist_ok=True)
os.makedirs(f"{BASE_DIR}/05_full_talismans/traditional_style", exist_ok=True)
os.makedirs(f"{BASE_DIR}/06_fonts/chinese_calligraphy", exist_ok=True)

# 加载字体
FONT_DIR = f"{BASE_DIR}/06_fonts/chinese_calligraphy"
FONTS = []
for f in os.listdir(FONT_DIR):
    if f.endswith('.ttf'):
        FONTS.append(os.path.join(FONT_DIR, f))

print(f"🚀 三路并行素材获取启动")
print(f"   字体: {len(FONTS)} 款")

# ============================================================
# WAVE 1: Met Museum 批量下载
# ============================================================
MET_QUERIES = [
    ("bird flower China", 100),
    ("figure painting China", 100),
    ("China", 50),
    ("Chinese", 50),
    ("Chinese painting", 40),
    ("Chinese scroll", 40),
    ("Buddha", 40),
    ("Bodhisattva", 40),
    ("Mandala", 40),
    ("Sutra", 40),
    ("Japan", 40),
    ("Japanese painting", 30),
    ("Korea", 30),
    ("silk", 40),
    ("landscape China", 30),
    ("Chinese calligraphy", 20),
    ("Chinese Buddhist", 20),
    ("Tang dynasty", 10),
    ("Song dynasty", 15),
    ("Ming dynasty", 10),
    ("Qing dynasty", 10),
]

def met_search(q):
    try:
        url = f"{MET_API}/search?q={urllib.parse.quote(q)}&hasImages=true&isPublicDomain=true"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except:
        return None

def met_download(obj_id):
    try:
        req = urllib.request.Request(f"{MET_API}/objects/{obj_id}", headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as resp:
            obj = json.loads(resp.read().decode())
        img_url = obj.get("primaryImage")
        if not img_url:
            return None, "no_image"
        
        req2 = urllib.request.Request(img_url, headers=HEADERS)
        with urllib.request.urlopen(req2, timeout=60) as resp2:
            data = resp2.read()
        if len(data) < 5000:
            return None, "too_small"
        
        out = f"{BASE_DIR}/05_full_talismans/traditional_style/met_{obj_id:06d}.jpg"
        with open(out, "wb") as f:
            f.write(data)
        return out, "ok"
    except Exception as e:
        return None, str(e)

def wave1_met():
    print("\n📡 Wave 1: Met Museum 批量下载")
    total = 0
    all_ids = set()
    
    for q, limit in MET_QUERIES:
        result = met_search(q)
        if not result:
            continue
        ids = result.get("objectIDs", []) or []
        if not ids:
            continue
        
        new_ids = [i for i in ids[:limit] if i not in all_ids]
        all_ids.update(new_ids)
        print(f"   {q}: 找到 {len(ids)} 个, 新 {len(new_ids)} 个")
    
    print(f"   总计待下载: {len(all_ids)} 个")
    
    downloaded = 0
    for obj_id in all_ids:
        path, status = met_download(obj_id)
        if status == "ok":
            downloaded += 1
            if downloaded % 20 == 0:
                print(f"   ✅ {downloaded}/{len(all_ids)}")
        time.sleep(0.3)
    
    print(f"   🏁 Met Museum 完成: {downloaded} 张")
    return downloaded

# ============================================================
# WAVE 2: 真实字体渲染书法字卡
# ============================================================
SINGLE_CHARS = "福財安明光運吉祥喜壽祿德慧靈龍鳳虎鶴松竹梅蘭道易經卦爻陰陽乾坤天地人日月星山水火風雷金木玉寶瑞康寧泰和順"
TWO_CHARS = ["招財","進寶","平安","如意","吉祥","開運","納福","迎祥","長壽","安康","福祿","喜慶","天官","地靈","人和","風順","日新","月異","龍騰","虎躍","鳳舞","鶴鳴","松青","竹翠","道法","自然","乾坤","陰陽","八卦","六爻","五行","太極"]
FOUR_CHARS = ["日進斗金","萬事開泰","天官賜福","百無禁忌","吉星高照","金玉滿堂","龍鳳呈祥","紫氣東來","福祿壽喜","招財進寶","平安如意","吉祥如意","五福臨門","喜氣盈門","財源廣進","道法自然","諸事順遂","明照四方","萬象更新","春風得意","海納百川","厚德載物","自強不息","知行合一","心誠則靈"]

def render_calligraphy_card(text, font_path, output_path, style="ink"):
    """渲染单张书法字卡"""
    W, H = 600, 600
    
    try:
        font = ImageFont.truetype(font_path, 280)
    except:
        return False
    
    # 暖黄宣纸底色
    base = (random.randint(248, 255), random.randint(240, 250), random.randint(228, 242))
    img = Image.new("RGB", (W, H), base)
    draw = ImageDraw.Draw(img)
    
    # 计算居中
    dummy = Image.new("RGB", (1, 1))
    dd = ImageDraw.Draw(dummy)
    bbox = dd.textbbox((0, 0), text, font=font)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    tx = (W - tw) // 2 - bbox[0]
    ty = (H - th) // 2 - bbox[1]
    
    # 墨色
    if style == "ink":
        ink = (random.randint(10, 30), random.randint(10, 30), random.randint(10, 30))
    elif style == "dry":
        ink = (random.randint(40, 70), random.randint(30, 50), random.randint(20, 40))
    else:
        ink = (random.randint(20, 40), random.randint(20, 40), random.randint(20, 40))
    
    # 多层渲染模拟墨色深浅
    for layer in range(3):
        offset = random.randint(-1, 1)
        alpha = 1 - layer * 0.12
        layer_ink = tuple(int(c * alpha) for c in ink)
        draw.text((tx + offset, ty + offset), text, fill=layer_ink, font=font)
    
    # 纸张纹理
    arr = np.array(img)
    noise = np.random.normal(0, 5, arr.shape).astype(np.int16)
    arr = np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    # 纤维纹理
    for _ in range(random.randint(30, 80)):
        x, y = random.randint(0, W-1), random.randint(0, H-1)
        length = random.randint(5, 20)
        angle = random.uniform(-math.pi/6, math.pi/6)
        for i in range(length):
            px = int(x + i * math.cos(angle))
            py = int(y + i * math.sin(angle))
            if 0 <= px < W and 0 <= py < H:
                arr[py, px] = np.clip(arr[py, px] + random.randint(-10, 10), 0, 255)
    
    img = Image.fromarray(arr)
    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.2, 0.6)))
    
    img.save(output_path, quality=95)
    return True

def wave2_fonts():
    print("\n✍️ Wave 2: 真实字体渲染书法字卡")
    total = 0
    
    # 单字 — 每个字用每款字体渲染
    print("   渲染单字...")
    for i, ch in enumerate(SINGLE_CHARS):
        for font_idx, font_path in enumerate(FONTS):
            style = random.choice(["ink", "dry", "wet"])
            out = f"{BASE_DIR}/01_calligraphy/single_char/char_{ch}_{font_idx}_{style}.jpg"
            if render_calligraphy_card(ch, font_path, out, style):
                total += 1
        if (i + 1) % 10 == 0:
            print(f"   ✅ 单字 {i+1}/{len(SINGLE_CHARS)}")
    
    # 两字
    print("   渲染两字词组...")
    for i, text in enumerate(TWO_CHARS):
        font_path = FONTS[i % len(FONTS)]
        style = random.choice(["ink", "dry", "wet"])
        out = f"{BASE_DIR}/01_calligraphy/two_chars/text_{i:03d}_{style}.jpg"
        if render_calligraphy_card(text, font_path, out, style):
            total += 1
    
    # 四字
    print("   渲染四字成语...")
    for i, text in enumerate(FOUR_CHARS):
        font_path = FONTS[i % len(FONTS)]
        style = random.choice(["ink", "dry", "wet"])
        out = f"{BASE_DIR}/01_calligraphy/four_chars/text_{i:03d}_{style}.jpg"
        if render_calligraphy_card(text, font_path, out, style):
            total += 1
    
    print(f"   🏁 字体渲染完成: {total} 张")
    return total

# ============================================================
# WAVE 3: Wikimedia Commons 单线程慢速下载
# ============================================================
WIKI_SEARCHES = [
    "Chinese calligraphy", "Wang Xizhi", "Yan Zhenqing", "Su Shi", "Mi Fu",
    "Chinese seal", "Chinese painting Tang", "Chinese scroll",
    "Dunhuang manuscript", "Chinese Buddhist art",
]

def wiki_search(q, limit=30):
    try:
        params = {
            "action": "query", "list": "search", "srsearch": q,
            "srnamespace": 6, "srlimit": limit, "format": "json", "origin": "*"
        }
        url = f"{WIKI_API}?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
        return [r["title"] for r in data["query"].get("search", [])]
    except:
        return []

def wiki_get_image_info(title):
    try:
        params = {
            "action": "query", "titles": title, "prop": "imageinfo",
            "iiprop": "url|size|mime", "format": "json", "origin": "*"
        }
        url = f"{WIKI_API}?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
        pages = data["query"].get("pages", {})
        for page in pages.values():
            if "imageinfo" in page:
                info = page["imageinfo"][0]
                return {
                    "url": info.get("url", ""),
                    "width": info.get("width", 0),
                    "height": info.get("height", 0),
                    "mime": info.get("mime", ""),
                }
        return None
    except:
        return None

def wave3_wiki():
    print("\n🌐 Wave 3: Wikimedia Commons 单线程慢速下载")
    total = 0
    downloaded = set()
    
    for q in WIKI_SEARCHES:
        titles = wiki_search(q, limit=20)
        if not titles:
            continue
        print(f"   {q}: {len(titles)} 个结果")
        
        for title in titles:
            if title in downloaded:
                continue
            
            info = wiki_get_image_info(title)
            time.sleep(3)  # 慢速间隔
            
            if not info or info["width"] < 400 or info["height"] < 400:
                continue
            if not info["mime"].startswith("image/"):
                continue
            
            try:
                req = urllib.request.Request(info["url"], headers=HEADERS)
                with urllib.request.urlopen(req, timeout=60) as resp:
                    data = resp.read()
                if len(data) < 5000:
                    continue
                
                safe = title.replace("File:", "").replace(" ", "_")[:60]
                ext = ".jpg" if info["mime"] == "image/jpeg" else ".png"
                out = f"{BASE_DIR}/05_full_talismans/traditional_style/wiki_{safe}{ext}"
                with open(out, "wb") as f:
                    f.write(data)
                
                downloaded.add(title)
                total += 1
                if total % 10 == 0:
                    print(f"   ✅ {total}")
            except:
                pass
            
            time.sleep(3)
    
    print(f"   🏁 Wikimedia 完成: {total} 张")
    return total

# ============================================================
# MAIN
# ============================================================
if __name__ == "__main__":
    start = datetime.now()
    
    # 三路并行
    from concurrent.futures import ThreadPoolExecutor
    
    results = {}
    with ThreadPoolExecutor(max_workers=3) as executor:
        f1 = executor.submit(wave1_met)
        f2 = executor.submit(wave2_fonts)
        f3 = executor.submit(wave3_wiki)
        
        results["met"] = f1.result()
        results["fonts"] = f2.result()
        results["wiki"] = f3.result()
    
    elapsed = datetime.now() - start
    grand_total = sum(results.values())
    
    print("\n" + "="*60)
    print("🏁 三路并行完成!")
    print(f"   Met Museum: {results['met']} 张")
    print(f"   字体渲染: {results['fonts']} 张")
    print(f"   Wikimedia: {results['wiki']} 张")
    print(f"   总计: {grand_total} 张")
    print(f"   耗时: {elapsed}")
    print("="*60)
