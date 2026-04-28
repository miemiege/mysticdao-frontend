#!/usr/bin/env python3
"""
全自动素材库扩充流水线 v2 - 目标1000+张
多线程下载 Wikimedia Commons → 智能分类 → 批量处理
"""

import os
import sys
import json
import time
import hashlib
import urllib.request
import urllib.parse
import urllib.error
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from queue import Queue
from datetime import datetime, timedelta
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter
import numpy as np

# ============================================================
# CONFIG
# ============================================================
BASE_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-assets"
LOG_FILE = f"{BASE_DIR}/expansion_log.txt"
STATE_FILE = f"{BASE_DIR}/expansion_state.json"
MAX_RUNTIME_HOURS = 10
MAX_WORKERS = 8
DOWNLOAD_DELAY = 0.25
REQUEST_TIMEOUT = 45

CATEGORIES = {
    "calligraphy": f"{BASE_DIR}/calligraphy",
    "seal":        f"{BASE_DIR}/seal",
    "texture":     f"{BASE_DIR}/texture",
    "charm":       f"{BASE_DIR}/charm",
    "pattern":     f"{BASE_DIR}/pattern",
    "processed":   f"{BASE_DIR}/processed",
}

# 每个类别目标张数（原始下载量，处理后可能略少）
TARGETS = {
    "calligraphy": 600,
    "seal":        200,
    "texture":     150,
    "charm":       150,
    "pattern":     200,
}

# 超大搜索池：每个分类多个关键词，每个关键词拉大量结果
SEARCH_POOL = {
    "calligraphy": [
        ("Wang Xizhi calligraphy", 30),
        ("Yan Zhenqing calligraphy", 25),
        ("Su Shi calligraphy", 25),
        ("Mi Fu calligraphy", 25),
        ("Liu Gongquan calligraphy", 25),
        ("Zhao Mengfu calligraphy", 25),
        ("Dong Qichang calligraphy", 25),
        ("Huang Tingjian calligraphy", 25),
        ("Ouyang Xun calligraphy", 20),
        ("Chu Suiliang calligraphy", 20),
        ("Zhang Xu calligraphy", 20),
        ("Huaisu calligraphy", 20),
        ("Sun Guoting calligraphy", 20),
        ("Wen Zhengming calligraphy", 20),
        ("Fu Shan calligraphy", 20),
        ("cursive script Chinese", 30),
        ("seal script Chinese", 30),
        ("regular script Chinese", 30),
        ("running script Chinese", 30),
        ("clerical script Chinese", 25),
        ("Chinese rubbing stele", 30),
        ("Dunhuang manuscript", 25),
        ("Tang dynasty calligraphy", 30),
        ("Song dynasty calligraphy", 25),
        ("Ming dynasty calligraphy", 25),
        ("Qing dynasty calligraphy", 25),
        (" oracle bone Chinese", 15),
        ("bronze inscription Chinese", 15),
        ("bamboo slip calligraphy", 15),
        ("Chinese imperial edict calligraphy", 15),
        ("sutra manuscript China", 20),
        ("Chinese handwriting model", 20),
        ("epitaph calligraphy China", 20),
        ("stele rubbing Chinese", 25),
        ("Chinese ink calligraphy detail", 25),
        ("ancient Chinese manuscript", 25),
    ],
    "seal": [
        ("Chinese seal stamp red", 30),
        ("zhuanke seal carving", 25),
        ("Chinese chop seal", 25),
        ("red seal impression", 25),
        ("Chinese yin seal", 20),
        ("Chinese yang seal", 20),
        ("seal engraving China", 25),
        ("imperial seal China", 20),
        ("private seal Chinese", 20),
        ("collection seal Chinese", 20),
    ],
    "texture": [
        ("xuan paper texture", 25),
        ("rice paper texture", 25),
        ("old paper texture vintage", 30),
        ("silk fabric texture", 25),
        ("parchment texture aged", 25),
        ("antique paper texture", 25),
        ("handmade paper texture", 25),
        ("linen texture fabric", 20),
        ("cotton paper texture", 20),
        ("damask fabric texture", 15),
        ("aged parchment closeup", 20),
        ("weathered paper texture", 20),
    ],
    "charm": [
        ("Taoist talisman", 25),
        ("Daoist charm paper", 25),
        ("Chinese talisman fu", 25),
        ("Chinese religious print", 25),
        ("Chinese woodblock print deity", 25),
        ("Chinese New Year painting", 25),
        ("Door god painting China", 20),
        ("Chinese paper deity", 20),
        ("Chinese ancestor portrait", 20),
        ("Chinese religious scroll", 20),
        ("Chinese exorcism talisman", 20),
        ("Chinese prayer paper", 20),
        ("Chinese ghost money", 15),
        ("Chinese ritual painting", 20),
        ("Chinese Buddhist scroll", 20),
        ("Chinese Daoist painting", 20),
        ("Chinese spirit tablet", 15),
        ("Chinese protective amulet", 20),
    ],
    "pattern": [
        ("Chinese cloud pattern", 25),
        ("Chinese dragon pattern art", 25),
        ("Chinese decorative border", 25),
        ("Chinese flame motif", 20),
        ("Chinese auspicious pattern", 25),
        ("cloud thunder pattern leiwen", 20),
        ("Chinese phoenix pattern", 20),
        ("Chinese lotus pattern", 20),
        ("Chinese wave pattern", 20),
        ("Chinese geometric pattern", 20),
        ("Chinese scroll pattern", 20),
        ("Chinese border ornament", 20),
        ("Chinese medallion pattern", 20),
        ("Chinese lattice pattern", 20),
        ("Chinese brocade pattern", 20),
        ("Chinese embroidery pattern", 20),
        ("Chinese knot pattern", 15),
        ("Chinese bat pattern fu", 15),
        ("Chinese shou character pattern", 15),
        ("Chinese longevity symbol pattern", 15),
    ],
}

API_ENDPOINT = "https://commons.wikimedia.org/w/api.php"

# ============================================================
# LOGGING
# ============================================================
log_lock = threading.Lock()

def log(msg):
    ts = datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] {msg}"
    with log_lock:
        print(line, flush=True)
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"downloaded": [], "failed": [], "processed": [], "searches_done": [],
            "counts": {"calligraphy":0, "seal":0, "texture":0, "charm":0, "pattern":0},
            "proc_counts": {"calligraphy":0, "seal":0, "texture":0, "charm":0, "pattern":0}}

def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

def fmt_stats(state):
    c = state["counts"]
    p = state["proc_counts"]
    t = TARGETS
    return f"书法:{c['calligraphy']}/{t['calligraphy']} 印章:{c['seal']}/{t['seal']} 纹理:{c['texture']}/{t['texture']} 符咒:{c['charm']}/{t['charm']} 图案:{c['pattern']}/{t['pattern']}"

# ============================================================
# HTTP TOOLS
# ============================================================
last_request_time = [0]
req_lock = threading.Lock()

def rate_limited_fetch(url, retries=3):
    with req_lock:
        elapsed = time.time() - last_request_time[0]
        if elapsed < DOWNLOAD_DELAY:
            time.sleep(DOWNLOAD_DELAY - elapsed)
        last_request_time[0] = time.time()
    
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": "MysticDAO-AssetBot/2.0 (educational research project)",
                "Accept": "application/json"
            })
            with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 5 * (attempt + 1)
                log(f"  ⏳ 限流，等待{wait}s...")
                time.sleep(wait)
            else:
                time.sleep(2 ** attempt)
        except Exception as e:
            time.sleep(2 ** attempt)
    return None

def download_file(url, dest, retries=2):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": "MysticDAO-AssetBot/2.0"
            })
            with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
                data = resp.read()
                if len(data) < 5 * 1024:
                    return False
                with open(dest, "wb") as f:
                    f.write(data)
            return True
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(1)
    return False

def safe_filename(name):
    name = name.replace("File:", "").replace(" ", "_")
    for c in '<>:"/\\|?*':
        name = name.replace(c, "_")
    return name[:80]

# ============================================================
# WIKIMEDIA API
# ============================================================
def search_commons(query, limit=30, offset=0):
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "srnamespace": 6,
        "srlimit": limit,
        "sroffset": offset,
        "format": "json",
        "origin": "*"
    }
    url = f"{API_ENDPOINT}?{urllib.parse.urlencode(params)}"
    data = rate_limited_fetch(url)
    if not data or "query" not in data:
        return [], None
    results = data["query"].get("search", [])
    cont = data.get("query-continue", {}).get("search", {}).get("sroffset")
    titles = [r["title"] for r in results]
    return titles, cont

def get_image_info(title):
    params = {
        "action": "query",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "format": "json",
        "origin": "*"
    }
    url = f"{API_ENDPOINT}?{urllib.parse.urlencode(params)}"
    data = rate_limited_fetch(url)
    if not data or "query" not in data:
        return None
    pages = data["query"].get("pages", {})
    for page_id, page in pages.items():
        if "imageinfo" in page:
            info = page["imageinfo"][0]
            return {
                "url": info.get("url", ""),
                "width": info.get("width", 0),
                "height": info.get("height", 0),
                "mime": info.get("mime", ""),
                "extmetadata": info.get("extmetadata", {})
            }
    return None

def is_public_domain(info):
    meta = info.get("extmetadata", {})
    license = meta.get("LicenseShortName", {}).get("value", "").lower()
    if "pd" in license or "public" in license or "cc0" in license:
        return True
    return False

# ============================================================
# IMAGE PROCESSING
# ============================================================
def remove_seals_and_warm(img):
    """去印章 + 暖黄化"""
    hsv = img.convert("HSV")
    h, s, v = hsv.split()
    arr_h = np.array(h)
    arr_s = np.array(s)
    arr_v = np.array(v)
    red_mask = ((arr_h < 20) | (arr_h > 230)) & (arr_s > 80)
    arr_s = np.where(red_mask, arr_s * 0.12, arr_s).astype(np.uint8)
    arr_v = np.where(red_mask, np.clip(arr_v * 1.2, 0, 255), arr_v).astype(np.uint8)
    hsv = Image.merge("HSV", (Image.fromarray(arr_h), Image.fromarray(arr_s), Image.fromarray(arr_v)))
    img = hsv.convert("RGB")
    r, g, b = img.split()
    r = r.point(lambda i: min(255, int(i * 1.05)))
    g = g.point(lambda i: min(255, int(i * 1.02)))
    b = b.point(lambda i: int(i * 0.85))
    img = Image.merge("RGB", (r, g, b))
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.3)
    img = img.filter(ImageFilter.GaussianBlur(radius=1.2))
    return img

def process_calligraphy(src_path, dest_path):
    try:
        img = Image.open(src_path)
        if img.mode != "RGB": img = img.convert("RGB")
        img = remove_seals_and_warm(img)
        img = img.resize((400, 640), Image.Resampling.LANCZOS)
        img.save(dest_path, quality=95)
        return True
    except Exception as e:
        return False

def process_seal(src_path, dest_path):
    try:
        img = Image.open(src_path)
        if img.mode != "RGB": img = img.convert("RGB")
        hsv = img.convert("HSV")
        h_arr = np.array(hsv.split()[0])
        s_arr = np.array(hsv.split()[1])
        v_arr = np.array(hsv.split()[2])
        red_mask = ((h_arr < 25) | (h_arr > 230)) & (s_arr > 90) & (v_arr > 60)
        if red_mask.sum() < 300:
            return False
        arr = np.array(img)
        rgba = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
        rgba[:,:,:3] = arr
        rgba[:,:,3] = np.where(red_mask, 255, 0).astype(np.uint8)
        seal = Image.fromarray(rgba, "RGBA")
        bbox = seal.getbbox()
        if not bbox: return False
        seal = seal.crop(bbox)
        # 过滤太小的
        if seal.width < 30 or seal.height < 30:
            return False
        seal = seal.filter(ImageFilter.GaussianBlur(radius=0.5))
        seal.save(dest_path)
        return True
    except Exception as e:
        return False

def process_texture(src_path, dest_path):
    try:
        img = Image.open(src_path)
        if img.mode != "RGB": img = img.convert("RGB")
        r, g, b = img.split()
        r = r.point(lambda i: min(255, int(i * 1.08)))
        g = g.point(lambda i: min(255, int(i * 1.03)))
        b = b.point(lambda i: int(i * 0.75))
        img = Image.merge("RGB", (r, g, b))
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(0.8)
        img = img.resize((400, 640), Image.Resampling.LANCZOS)
        img.save(dest_path, quality=95)
        return True
    except Exception as e:
        return False

def process_charm(src_path, dest_path):
    try:
        img = Image.open(src_path)
        if img.mode != "RGB": img = img.convert("RGB")
        r, g, b = img.split()
        r = r.point(lambda i: min(255, int(i * 1.03)))
        b = b.point(lambda i: int(i * 0.9))
        img = Image.merge("RGB", (r, g, b))
        img.thumbnail((400, 640), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (400, 640), (249, 244, 237))
        x = (400 - img.width) // 2
        y = (640 - img.height) // 2
        canvas.paste(img, (x, y))
        canvas.save(dest_path, quality=95)
        return True
    except Exception as e:
        return False

def process_pattern(src_path, dest_path):
    try:
        img = Image.open(src_path)
        if img.mode != "RGBA":
            img = img.convert("RGBA")
        arr = np.array(img)
        gray = np.dot(arr[:,:,:3], [0.299, 0.587, 0.114])
        white_mask = gray > 245
        arr[white_mask, 3] = 0
        result = Image.fromarray(arr, "RGBA")
        result.thumbnail((400, 400), Image.Resampling.LANCZOS)
        result.save(dest_path)
        return True
    except Exception as e:
        return False

PROCESSORS = {
    "calligraphy": process_calligraphy,
    "seal": process_seal,
    "texture": process_texture,
    "charm": process_charm,
    "pattern": process_pattern,
}

# ============================================================
# DOWNLOAD WORKER
# ============================================================
state_lock = threading.Lock()

def download_worker(title, category, state):
    if title in state["downloaded"]:
        return None, "skip"
    
    info = get_image_info(title)
    if not info:
        return None, "no_info"
    if info["width"] < 400 or info["height"] < 400:
        return None, "small"
    if not info["mime"].startswith("image/"):
        return None, "not_image"
    
    safe = safe_filename(title)
    ext = ".jpg"
    if info["mime"] == "image/png": ext = ".png"
    elif info["mime"] == "image/webp": ext = ".webp"
    
    dest_dir = CATEGORIES[category]
    dest_path = os.path.join(dest_dir, f"{safe}{ext}")
    
    if download_file(info["url"], dest_path):
        if os.path.getsize(dest_path) < 8 * 1024:
            os.remove(dest_path)
            return None, "tiny"
        with state_lock:
            state["downloaded"].append(title)
            state["counts"][category] += 1
        return dest_path, "ok"
    return None, "dl_fail"

# ============================================================
# MAIN
# ============================================================
def run():
    start = datetime.now()
    end = start + timedelta(hours=MAX_RUNTIME_HOURS)
    
    for p in CATEGORIES.values():
        os.makedirs(p, exist_ok=True)
    
    state = load_state()
    
    log("=" * 70)
    log("🚀 素材库扩充流水线 v2 启动")
    log(f"⏰ 目标: {MAX_RUNTIME_HOURS}h | 截止: {end.strftime('%H:%M')}")
    log(f"📊 当前: {fmt_stats(state)}")
    log("=" * 70)
    
    for category, queries in SEARCH_POOL.items():
        if datetime.now() > end:
            break
        if state["counts"][category] >= TARGETS[category]:
            log(f"⏭️ [{category}] 已达目标 {TARGETS[category]}，跳过")
            continue
        
        log(f"\n📂 [{category}] 目标: {TARGETS[category]} 张")
        
        for query, per_query_limit in queries:
            if datetime.now() > end:
                break
            if state["counts"][category] >= TARGETS[category]:
                break
            
            key = f"{category}:{query}"
            if key in state["searches_done"]:
                continue
            
            log(f"  🔍 {query} (limit={per_query_limit})")
            
            titles, cont = search_commons(query, limit=per_query_limit)
            if not titles:
                state["searches_done"].append(key)
                save_state(state)
                continue
            
            # 批量下载（多线程）
            downloaded = 0
            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                futures = {executor.submit(download_worker, t, category, state): t for t in titles}
                for future in as_completed(futures):
                    if datetime.now() > end:
                        break
                    path, status = future.result()
                    if status == "ok" and path:
                        downloaded += 1
                        # 立即处理
                        proc_name = f"{category}_{state['proc_counts'][category]:04d}."
                        if category == "seal" or category == "pattern":
                            proc_name += "png"
                        else:
                            proc_name += "jpg"
                        proc_path = os.path.join(CATEGORIES["processed"], proc_name)
                        if PROCESSORS[category](path, proc_path):
                            with state_lock:
                                state["processed"].append(proc_name)
                                state["proc_counts"][category] += 1
                            save_state(state)
                        
                        total = sum(state["counts"].values())
                        if total % 10 == 0:
                            log(f"    📈 进度: {fmt_stats(state)}")
            
            state["searches_done"].append(key)
            save_state(state)
            log(f"    ✅ 本批+{downloaded} | 累计: {fmt_stats(state)}")
            
            # 翻页获取更多
            offset = cont
            page = 1
            while offset and state["counts"][category] < TARGETS[category] and datetime.now() < end and page < 3:
                page += 1
                titles, offset = search_commons(query, limit=per_query_limit, offset=offset)
                if not titles:
                    break
                with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                    futures = {executor.submit(download_worker, t, category, state): t for t in titles}
                    for future in as_completed(futures):
                        if datetime.now() > end:
                            break
                        path, status = future.result()
                        if status == "ok" and path:
                            downloaded += 1
                            proc_name = f"{category}_{state['proc_counts'][category]:04d}."
                            proc_name += "png" if category in ("seal", "pattern") else "jpg"
                            proc_path = os.path.join(CATEGORIES["processed"], proc_name)
                            if PROCESSORS[category](path, proc_path):
                                with state_lock:
                                    state["processed"].append(proc_name)
                                    state["proc_counts"][category] += 1
                                save_state(state)
                save_state(state)
    
    elapsed = datetime.now() - start
    log("\n" + "=" * 70)
    log("🏁 流水线结束")
    log(f"⏱️ 运行: {elapsed}")
    log(f"📊 最终: {fmt_stats(state)}")
    log("=" * 70)

if __name__ == "__main__":
    run()
