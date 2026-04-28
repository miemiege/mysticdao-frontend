#!/usr/bin/env python3
"""
素材库扩充流水线 v3 - 保守速率版
串行API调用(1.5s间隔) + 并行下载(3线程)
目标: 1000+张, 运行10小时
"""

import os
import sys
import json
import time
import urllib.request
import urllib.parse
import urllib.error
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta

from PIL import Image, ImageEnhance, ImageFilter
import numpy as np

# ============================================================
# CONFIG
# ============================================================
BASE_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-assets"
LOG_FILE = f"{BASE_DIR}/expansion_log.txt"
STATE_FILE = f"{BASE_DIR}/expansion_state.json"
MAX_RUNTIME_HOURS = 10
DOWNLOAD_WORKERS = 3
API_DELAY = 1.5          # API请求间隔(秒)
API_DELAY_AFTER_429 = 60 # 429后等待时间
REQUEST_TIMEOUT = 45

CATEGORIES = {
    "calligraphy": f"{BASE_DIR}/calligraphy",
    "seal":        f"{BASE_DIR}/seal",
    "texture":     f"{BASE_DIR}/texture",
    "charm":       f"{BASE_DIR}/charm",
    "pattern":     f"{BASE_DIR}/pattern",
    "processed":   f"{BASE_DIR}/processed",
}

TARGETS = {
    "calligraphy": 600,
    "seal":        200,
    "texture":     150,
    "charm":       150,
    "pattern":     200,
}

# 搜索池：(关键词, 每页数量, 翻页次数)
SEARCH_POOL = {
    "calligraphy": [
        ("Wang Xizhi calligraphy", 30, 2),
        ("Yan Zhenqing calligraphy", 30, 2),
        ("Su Shi calligraphy", 30, 2),
        ("Mi Fu calligraphy", 30, 2),
        ("Liu Gongquan calligraphy", 30, 2),
        ("Zhao Mengfu calligraphy", 30, 2),
        ("Dong Qichang calligraphy", 30, 2),
        ("Huang Tingjian calligraphy", 30, 2),
        ("Ouyang Xun calligraphy", 30, 2),
        ("Chu Suiliang calligraphy", 30, 2),
        ("Zhang Xu calligraphy", 30, 2),
        ("Huaisu calligraphy", 30, 2),
        ("Sun Guoting calligraphy", 30, 2),
        ("Wen Zhengming calligraphy", 30, 2),
        ("Fu Shan calligraphy", 30, 2),
        ("cursive script Chinese", 40, 2),
        ("seal script Chinese", 40, 2),
        ("regular script Chinese", 40, 2),
        ("running script Chinese", 40, 2),
        ("clerical script Chinese", 30, 2),
        ("Chinese rubbing stele", 40, 2),
        ("Dunhuang manuscript", 30, 2),
        ("Tang dynasty calligraphy", 40, 2),
        ("Song dynasty calligraphy", 30, 2),
        ("Ming dynasty calligraphy", 30, 2),
        ("Qing dynasty calligraphy", 30, 2),
        ("oracle bone Chinese", 20, 2),
        ("bronze inscription Chinese", 20, 2),
        ("bamboo slip calligraphy", 20, 2),
        ("sutra manuscript China", 25, 2),
        ("stele rubbing Chinese", 30, 2),
        ("Chinese ink calligraphy detail", 30, 2),
        ("ancient Chinese manuscript", 30, 2),
        ("epitaph calligraphy China", 20, 2),
    ],
    "seal": [
        ("Chinese seal stamp red", 30, 2),
        ("zhuanke seal carving", 25, 2),
        ("Chinese chop seal", 25, 2),
        ("red seal impression", 25, 2),
        ("Chinese yin seal", 20, 2),
        ("Chinese yang seal", 20, 2),
        ("seal engraving China", 25, 2),
        ("imperial seal China", 20, 2),
        ("private seal Chinese", 20, 2),
        ("collection seal Chinese", 20, 2),
    ],
    "texture": [
        ("xuan paper texture", 25, 2),
        ("rice paper texture", 25, 2),
        ("old paper texture vintage", 30, 2),
        ("silk fabric texture", 25, 2),
        ("parchment texture aged", 25, 2),
        ("antique paper texture", 25, 2),
        ("handmade paper texture", 25, 2),
        ("linen texture fabric", 20, 2),
        ("cotton paper texture", 20, 2),
        ("aged parchment closeup", 20, 2),
        ("weathered paper texture", 20, 2),
    ],
    "charm": [
        ("Taoist talisman", 25, 2),
        ("Daoist charm paper", 25, 2),
        ("Chinese talisman fu", 25, 2),
        ("Chinese religious print", 25, 2),
        ("Chinese woodblock print deity", 25, 2),
        ("Chinese New Year painting", 25, 2),
        ("Door god painting China", 20, 2),
        ("Chinese paper deity", 20, 2),
        ("Chinese ancestor portrait", 20, 2),
        ("Chinese religious scroll", 20, 2),
        ("Chinese exorcism talisman", 20, 2),
        ("Chinese prayer paper", 20, 2),
        ("Chinese ritual painting", 20, 2),
        ("Chinese Buddhist scroll", 20, 2),
        ("Chinese Daoist painting", 20, 2),
        ("Chinese protective amulet", 20, 2),
    ],
    "pattern": [
        ("Chinese cloud pattern", 25, 2),
        ("Chinese dragon pattern art", 25, 2),
        ("Chinese decorative border", 25, 2),
        ("Chinese flame motif", 20, 2),
        ("Chinese auspicious pattern", 25, 2),
        ("cloud thunder pattern leiwen", 20, 2),
        ("Chinese phoenix pattern", 20, 2),
        ("Chinese lotus pattern", 20, 2),
        ("Chinese wave pattern", 20, 2),
        ("Chinese geometric pattern", 20, 2),
        ("Chinese scroll pattern", 20, 2),
        ("Chinese border ornament", 20, 2),
        ("Chinese medallion pattern", 20, 2),
        ("Chinese lattice pattern", 20, 2),
        ("Chinese brocade pattern", 20, 2),
        ("Chinese embroidery pattern", 20, 2),
        ("Chinese knot pattern", 15, 2),
        ("Chinese bat pattern fu", 15, 2),
        ("Chinese shou character pattern", 15, 2),
        ("Chinese longevity symbol pattern", 15, 2),
    ],
}

API_ENDPOINT = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "MysticDAO-AssetBot/3.0 (educational-research; rate-limited)"

# ============================================================
# LOGGING & STATE
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
    return {"downloaded": [], "processed": [], "searches_done": [],
            "counts": {"calligraphy":0, "seal":0, "texture":0, "charm":0, "pattern":0},
            "proc_counts": {"calligraphy":0, "seal":0, "texture":0, "charm":0, "pattern":0}}

def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

def fmt_stats(state):
    c = state["counts"]
    p = state["proc_counts"]
    t = TARGETS
    return f"书{c['calligraphy']}/{t['calligraphy']} 印{c['seal']}/{t['seal']} 纹{c['texture']}/{t['texture']} 符{c['charm']}/{t['charm']} 图{c['pattern']}/{t['pattern']}"

# ============================================================
# HTTP (串行, 带严格限流)
# ============================================================
last_api_call = [0]
api_lock = threading.Lock()

def api_fetch(url, retries=3):
    """串行API调用,严格限流"""
    with api_lock:
        elapsed = time.time() - last_api_call[0]
        if elapsed < API_DELAY:
            time.sleep(API_DELAY - elapsed)
        last_api_call[0] = time.time()
    
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": USER_AGENT,
                "Accept": "application/json"
            })
            with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = API_DELAY_AFTER_429 * (attempt + 1)
                log(f"  ⏳ API限流(429), 等待{wait}s...")
                time.sleep(wait)
            else:
                time.sleep(3)
        except Exception as e:
            time.sleep(3)
    return None

def download_file(url, dest):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
            data = resp.read()
            if len(data) < 3 * 1024:
                return False
            with open(dest, "wb") as f:
                f.write(data)
        return True
    except Exception as e:
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
        "action": "query", "list": "search", "srsearch": query,
        "srnamespace": 6, "srlimit": limit, "sroffset": offset,
        "format": "json", "origin": "*"
    }
    url = f"{API_ENDPOINT}?{urllib.parse.urlencode(params)}"
    data = api_fetch(url)
    if not data or "query" not in data:
        return [], None
    results = data["query"].get("search", [])
    cont = data.get("continue", {}).get("sroffset")
    return [r["title"] for r in results], cont

def get_image_info(title):
    params = {
        "action": "query", "titles": title, "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata", "format": "json", "origin": "*"
    }
    url = f"{API_ENDPOINT}?{urllib.parse.urlencode(params)}"
    data = api_fetch(url)
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
            }
    return None

# ============================================================
# IMAGE PROCESSING
# ============================================================
def remove_seals_and_warm(img):
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

def process_calligraphy(src, dest):
    try:
        img = Image.open(src)
        if img.mode != "RGB": img = img.convert("RGB")
        img = remove_seals_and_warm(img)
        img = img.resize((400, 640), Image.Resampling.LANCZOS)
        img.save(dest, quality=95)
        return True
    except: return False

def process_seal(src, dest):
    try:
        img = Image.open(src)
        if img.mode != "RGB": img = img.convert("RGB")
        hsv = img.convert("HSV")
        h_arr = np.array(hsv.split()[0])
        s_arr = np.array(hsv.split()[1])
        v_arr = np.array(hsv.split()[2])
        red_mask = ((h_arr < 25) | (h_arr > 230)) & (s_arr > 90) & (v_arr > 60)
        if red_mask.sum() < 300: return False
        arr = np.array(img)
        rgba = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
        rgba[:,:,:3] = arr
        rgba[:,:,3] = np.where(red_mask, 255, 0).astype(np.uint8)
        seal = Image.fromarray(rgba, "RGBA")
        bbox = seal.getbbox()
        if not bbox: return False
        seal = seal.crop(bbox)
        if seal.width < 30 or seal.height < 30: return False
        seal = seal.filter(ImageFilter.GaussianBlur(radius=0.5))
        seal.save(dest)
        return True
    except: return False

def process_texture(src, dest):
    try:
        img = Image.open(src)
        if img.mode != "RGB": img = img.convert("RGB")
        r, g, b = img.split()
        r = r.point(lambda i: min(255, int(i * 1.08)))
        g = g.point(lambda i: min(255, int(i * 1.03)))
        b = b.point(lambda i: int(i * 0.75))
        img = Image.merge("RGB", (r, g, b))
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(0.8)
        img = img.resize((400, 640), Image.Resampling.LANCZOS)
        img.save(dest, quality=95)
        return True
    except: return False

def process_charm(src, dest):
    try:
        img = Image.open(src)
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
        canvas.save(dest, quality=95)
        return True
    except: return False

def process_pattern(src, dest):
    try:
        img = Image.open(src)
        if img.mode != "RGBA": img = img.convert("RGBA")
        arr = np.array(img)
        gray = np.dot(arr[:,:,:3], [0.299, 0.587, 0.114])
        white_mask = gray > 245
        arr[white_mask, 3] = 0
        result = Image.fromarray(arr, "RGBA")
        result.thumbnail((400, 400), Image.Resampling.LANCZOS)
        result.save(dest)
        return True
    except: return False

PROCESSORS = {
    "calligraphy": process_calligraphy, "seal": process_seal,
    "texture": process_texture, "charm": process_charm, "pattern": process_pattern,
}

# ============================================================
# MAIN
# ============================================================
state_lock = threading.Lock()

def download_one(title, category, state):
    if title in state["downloaded"]:
        return None, "skip"
    
    info = get_image_info(title)
    if not info: return None, "no_info"
    if info["width"] < 400 or info["height"] < 400: return None, "small"
    if not info["mime"].startswith("image/"): return None, "not_image"
    
    safe = safe_filename(title)
    ext = ".jpg"
    if info["mime"] == "image/png": ext = ".png"
    elif info["mime"] == "image/webp": ext = ".webp"
    
    dest = os.path.join(CATEGORIES[category], f"{safe}{ext}")
    if download_file(info["url"], dest):
        if os.path.getsize(dest) < 5 * 1024:
            os.remove(dest)
            return None, "tiny"
        with state_lock:
            state["downloaded"].append(title)
            state["counts"][category] += 1
        return dest, "ok"
    return None, "dl_fail"

def run():
    start = datetime.now()
    end = start + timedelta(hours=MAX_RUNTIME_HOURS)
    
    for p in CATEGORIES.values(): os.makedirs(p, exist_ok=True)
    
    state = load_state()
    log("=" * 60)
    log("🚀 素材扩充v3启动 | 串行API+1.5s间隔 | 目标10h")
    log(f"⏰ 截止: {end.strftime('%H:%M')} | 当前: {fmt_stats(state)}")
    log("=" * 60)
    
    for category, queries in SEARCH_POOL.items():
        if datetime.now() > end: break
        if state["counts"][category] >= TARGETS[category]:
            log(f"⏭️ [{category}] 已达目标")
            continue
        
        log(f"\n📂 [{category}] 目标{TARGETS[category]} 当前{state['counts'][category]}")
        
        for query, per_page, max_pages in queries:
            if datetime.now() > end: break
            if state["counts"][category] >= TARGETS[category]: break
            
            key = f"{category}:{query}"
            if key in state["searches_done"]:
                continue
            
            log(f"  🔍 {query}")
            
            all_titles = []
            offset = 0
            for page in range(max_pages):
                titles, offset = search_commons(query, limit=per_page, offset=offset)
                if not titles: break
                all_titles.extend(titles)
                if not offset: break
            
            if not all_titles:
                state["searches_done"].append(key)
                save_state(state)
                continue
            
            # 去重+过滤已下载
            todo = [t for t in all_titles if t not in state["downloaded"]]
            log(f"    找到{len(all_titles)}个, 待下载{len(todo)}个")
            
            # 并行下载
            downloaded = 0
            with ThreadPoolExecutor(max_workers=DOWNLOAD_WORKERS) as ex:
                futures = {ex.submit(download_one, t, category, state): t for t in todo}
                for future in as_completed(futures):
                    if datetime.now() > end: break
                    path, status = future.result()
                    if status == "ok" and path:
                        downloaded += 1
                        # 处理
                        pc = state["proc_counts"][category]
                        ext = "png" if category in ("seal", "pattern") else "jpg"
                        proc_name = f"{category}_{pc:04d}.{ext}"
                        proc_path = os.path.join(CATEGORIES["processed"], proc_name)
                        if PROCESSORS[category](path, proc_path):
                            with state_lock:
                                state["processed"].append(proc_name)
                                state["proc_counts"][category] += 1
                            save_state(state)
                        
                        total = sum(state["counts"].values())
                        if total % 20 == 0:
                            elapsed = datetime.now() - start
                            rate = total / max(elapsed.total_seconds()/3600, 0.001)
                            log(f"    📈 #{total} | {fmt_stats(state)} | 速率{rate:.1f}张/h")
            
            state["searches_done"].append(key)
            save_state(state)
            log(f"    ✅ +{downloaded} | {fmt_stats(state)}")
            
            # 每个关键词后短暂休息
            time.sleep(2)
    
    elapsed = datetime.now() - start
    total = sum(state["counts"].values())
    log("\n" + "=" * 60)
    log("🏁 结束")
    log(f"⏱️ {elapsed} | 总计{total}张")
    log(f"📊 {fmt_stats(state)}")
    log("=" * 60)

if __name__ == "__main__":
    run()
