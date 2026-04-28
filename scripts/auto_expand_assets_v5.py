#!/usr/bin/env python3
"""
素材库扩充流水线 v5 - 分类API策略
核心: 用Wikimedia Commons分类API(cmcontinue)一次性拉取整个分类的所有文件
优势: 每个分类仅需2-5次API调用, 比搜索策略减少15x API调用量
"""

import os
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
DOWNLOAD_WORKERS = 6
API_DELAY = 2.0
API_DELAY_AFTER_429 = 90
REQUEST_TIMEOUT = 60
BATCH_SIZE = 50  # 图片信息批量查询

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

# 分类策略: (分类名, 目标数量, 分类)
CATEGORY_POOL = {
    "calligraphy": [
        ("Category:Chinese calligraphy", 300),
        ("Category:Wang Xizhi", 50),
        ("Category:Yan Zhenqing", 50),
        ("Category:Mi Fu", 50),
        ("Category:Su Shi", 50),
        ("Category:Zhao Mengfu", 50),
        ("Category:Dong Qichang", 50),
        ("Category:Chinese calligraphers", 100),
        ("Category:Chinese cursive script", 100),
        ("Category:Chinese seal script", 80),
        ("Category:Chinese regular script", 80),
        ("Category:Chinese steles", 80),
        ("Category:Rubbings from China", 80),
        ("Category:Dunhuang manuscripts", 80),
        ("Category:Chinese manuscripts", 100),
        ("Category:Oracle bones", 50),
        ("Category:Chinese bronze inscriptions", 50),
        ("Category:Chinese bamboo and wooden slips", 50),
        ("Category:Sutras in China", 60),
    ],
    "seal": [
        ("Category:Chinese seals", 150),
        ("Category:Seal stamps from China", 80),
        ("Category:Imperial seals of China", 50),
        ("Category:Chinese seal carving", 50),
        ("Category:Red seals", 50),
    ],
    "texture": [
        ("Category:Xuan paper", 50),
        ("Category:Rice paper", 50),
        ("Category:Paper textures", 80),
        ("Category:Silk textiles", 50),
        ("Category:Parchment", 50),
        ("Category:Old paper", 50),
        ("Category:Textured paper", 50),
        ("Category:Handmade paper", 40),
    ],
    "charm": [
        ("Category:Taoist talismans", 100),
        ("Category:Chinese religious art", 100),
        ("Category:Chinese New Year prints", 80),
        ("Category:Chinese woodblock prints", 80),
        ("Category:Door gods", 50),
        ("Category:Chinese deities", 60),
        ("Category:Chinese Buddhist art", 60),
        ("Category:Chinese folk art", 60),
    ],
    "pattern": [
        ("Category:Chinese cloud patterns", 80),
        ("Category:Chinese dragon art", 80),
        ("Category:Chinese decorative patterns", 80),
        ("Category:Chinese auspicious symbols", 60),
        ("Category:Chinese knotwork", 50),
        ("Category:Chinese brocade", 50),
        ("Category:Chinese embroidery", 50),
        ("Category:Chinese border ornaments", 50),
        ("Category:Cloud and thunder pattern", 40),
        ("Category:Chinese phoenix art", 40),
    ],
}

API_ENDPOINT = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "MysticDAO-AssetBot/5.0 (educational-research; category-api; rate-limited)"

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
            state = json.load(f)
        # 兼容旧版本状态
        if "cats_done" not in state:
            state["cats_done"] = state.get("searches_done", [])
        for k in ["downloaded", "processed", "counts", "proc_counts"]:
            if k not in state:
                state[k] = {} if k in ["counts", "proc_counts"] else []
        for cat in TARGETS:
            state["counts"].setdefault(cat, 0)
            state["proc_counts"].setdefault(cat, 0)
        return state
    return {"downloaded": [], "processed": [], "cats_done": [],
            "counts": {"calligraphy":0, "seal":0, "texture":0, "charm":0, "pattern":0},
            "proc_counts": {"calligraphy":0, "seal":0, "texture":0, "charm":0, "pattern":0}}

def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

def fmt_stats(state):
    c = state["counts"]
    t = TARGETS
    return f"书{c['calligraphy']}/{t['calligraphy']} 印{c['seal']}/{t['seal']} 纹{c['texture']}/{t['texture']} 符{c['charm']}/{t['charm']} 图{c['pattern']}/{t['pattern']}"

# ============================================================
# HTTP
# ============================================================
last_api_call = [0]
api_lock = threading.Lock()

def api_fetch(url, retries=3):
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
                log(f"  ⏳ 限流(429), 等待{wait}s...")
                time.sleep(wait)
            else:
                time.sleep(3)
        except:
            time.sleep(3)
    return None

def download_file(url, dest):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
            data = resp.read()
            if len(data) < 3 * 1024: return False
            with open(dest, "wb") as f:
                f.write(data)
        return True
    except:
        return False

def safe_filename(name):
    name = name.replace("File:", "").replace(" ", "_")
    for c in '<>:"/\\|?*':
        name = name.replace(c, "_")
    return name[:80]

# ============================================================
# WIKIMEDIA CATEGORY API
# ============================================================
def list_category_files(cat_name, max_files=500):
    """用分类API列出所有文件, 返回文件标题列表"""
    all_files = []
    cmcontinue = None
    
    while len(all_files) < max_files:
        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": cat_name,
            "cmtype": "file",
            "cmlimit": min(500, max_files - len(all_files)),
            "format": "json",
            "origin": "*"
        }
        if cmcontinue:
            params["cmcontinue"] = cmcontinue
        
        url = f"{API_ENDPOINT}?{urllib.parse.urlencode(params)}"
        data = api_fetch(url)
        
        if not data or "query" not in data:
            break
        
        members = data["query"].get("categorymembers", [])
        for m in members:
            title = m.get("title", "")
            if title.startswith("File:"):
                all_files.append(title)
        
        cmcontinue = data.get("continue", {}).get("cmcontinue")
        if not cmcontinue:
            break
    
    return all_files

def get_image_infos_batch(titles):
    """批量查询图片信息"""
    if not titles:
        return {}
    
    all_results = {}
    for i in range(0, len(titles), BATCH_SIZE):
        batch = titles[i:i + BATCH_SIZE]
        joined = "|".join(batch)
        params = {
            "action": "query", "titles": joined, "prop": "imageinfo",
            "iiprop": "url|size|mime|extmetadata", "format": "json", "origin": "*"
        }
        url = f"{API_ENDPOINT}?{urllib.parse.urlencode(params)}"
        data = api_fetch(url)
        if not data or "query" not in data:
            continue
        pages = data["query"].get("pages", {})
        for page_id, page in pages.items():
            if "imageinfo" in page:
                info = page["imageinfo"][0]
                all_results[page.get("title", "")] = {
                    "url": info.get("url", ""),
                    "width": info.get("width", 0),
                    "height": info.get("height", 0),
                    "mime": info.get("mime", ""),
                }
    return all_results

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

def download_one(title, info, category, state):
    if title in state["downloaded"]:
        return None, "skip"
    if not info: return None, "no_info"
    if info["width"] < 400 or info["height"] < 400: return None, "small"
    if not info["mime"].startswith("image/"): return None, "not_image"
    if not info["url"]: return None, "no_url"
    
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
    log("🚀 素材扩充v5启动 | 分类API策略 | 目标10h")
    log(f"⏰ 截止: {end.strftime('%H:%M')} | 当前: {fmt_stats(state)}")
    log("=" * 60)
    
    for category, cats in CATEGORY_POOL.items():
        if datetime.now() > end: break
        if state["counts"][category] >= TARGETS[category]:
            log(f"⏭️ [{category}] 已达目标 {TARGETS[category]}")
            continue
        
        log(f"\n📂 [{category}] 目标{TARGETS[category]} 当前{state['counts'][category]}")
        
        for cat_name, max_files in cats:
            if datetime.now() > end: break
            if state["counts"][category] >= TARGETS[category]: break
            
            key = f"{category}:{cat_name}"
            if key in state["cats_done"]:
                continue
            
            log(f"  📁 {cat_name} (max={max_files})")
            
            # === 拉取分类所有文件 ===
            files = list_category_files(cat_name, max_files=max_files)
            if not files:
                log(f"    ❌ 空分类")
                state["cats_done"].append(key)
                save_state(state)
                continue
            
            log(f"    文件数: {len(files)}")
            
            # === 过滤已下载 ===
            todo = [f for f in files if f not in state["downloaded"]]
            log(f"    新文件: {len(todo)}")
            
            if not todo:
                state["cats_done"].append(key)
                save_state(state)
                continue
            
            # === 批量查询信息 ===
            infos = get_image_infos_batch(todo)
            valid = {t: info for t, info in infos.items()
                     if info and info["width"] >= 400 and info["height"] >= 400
                     and info["mime"].startswith("image/") and info["url"]}
            log(f"    有效: {len(valid)}/{len(todo)}")
            
            if not valid:
                state["cats_done"].append(key)
                save_state(state)
                continue
            
            # === 并行下载 ===
            downloaded = 0
            with ThreadPoolExecutor(max_workers=DOWNLOAD_WORKERS) as ex:
                futures = {ex.submit(download_one, t, info, category, state): t
                           for t, info in valid.items()}
                for future in as_completed(futures):
                    if datetime.now() > end: break
                    try:
                        path, status = future.result()
                    except Exception as e:
                        continue
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
                        if total % 50 == 0:
                            elapsed = datetime.now() - start
                            rate = total / max(elapsed.total_seconds()/3600, 0.001)
                            est_hours = (1300 - total) / max(rate, 1)
                            log(f"    📈 #{total} | {fmt_stats(state)} | {rate:.0f}张/h | 预计还需{est_hours:.1f}h")
            
            state["cats_done"].append(key)
            save_state(state)
            log(f"    ✅ +{downloaded} | {fmt_stats(state)}")
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
