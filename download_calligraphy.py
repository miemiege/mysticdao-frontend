#!/usr/bin/env python3
"""
从 Wikimedia Commons 批量下载公共领域书法素材
"""

import os
import requests
import json
from urllib.parse import quote

# 创建素材目录
BASE_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-assets"
os.makedirs(f"{BASE_DIR}/calligraphy", exist_ok=True)
os.makedirs(f"{BASE_DIR}/seals", exist_ok=True)
os.makedirs(f"{BASE_DIR}/borders", exist_ok=True)

# Wikimedia Commons API 搜索关键词
SEARCH_TERMS = [
    "Chinese calligraphy",
    "Wang Xizhi calligraphy",
    "Yan Zhenqing calligraphy",
    "Chinese seal script",
    "Tang dynasty calligraphy",
    "Rubbing stele Chinese",
    "Sutra calligraphy Dunhuang",
]

HEADERS = {
    "User-Agent": "ManifestDAO-TalismanBot/1.0 (educational project)"
}

def search_commons(query, limit=10):
    """搜索 Wikimedia Commons"""
    url = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "format": "json",
        "srlimit": limit,
        "srnamespace": 6,  # File namespace
    }
    resp = requests.get(url, params=params, headers=HEADERS, timeout=30)
    data = resp.json()
    return data.get("query", {}).get("search", [])

def get_image_url(filename):
    """获取图片的直接下载 URL"""
    url = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "titles": f"File:{filename}",
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
        "format": "json",
    }
    resp = requests.get(url, params=params, headers=HEADERS, timeout=30)
    data = resp.json()
    pages = data.get("query", {}).get("pages", {})
    for page_id, page in pages.items():
        if "imageinfo" in page:
            info = page["imageinfo"][0]
            return info.get("url"), info.get("width"), info.get("height"), info.get("mime")
    return None, None, None, None

def download_image(url, filepath):
    """下载图片"""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=60)
        if resp.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(resp.content)
            return len(resp.content)
        return 0
    except Exception as e:
        print(f"下载失败 {url}: {e}")
        return 0

def main():
    all_files = []
    seen = set()
    
    for term in SEARCH_TERMS:
        print(f"\n搜索: {term}")
        results = search_commons(term, limit=15)
        print(f"  找到 {len(results)} 个结果")
        
        for item in results:
            title = item["title"].replace("File:", "")
            if title in seen:
                continue
            seen.add(title)
            
            # 跳过 SVG 和音频文件
            if title.lower().endswith((".svg", ".ogg", ".oga", ".ogv", ".wav")):
                continue
            
            img_url, width, height, mime = get_image_url(title)
            if not img_url:
                continue
            
            # 只下载足够大的图片
            if width and width < 800:
                continue
            
            ext = os.path.splitext(title)[1].lower()
            if not ext:
                ext = ".jpg"
            
            safe_name = quote(title.replace(" ", "_").replace("/", "_"))[:100]
            filepath = f"{BASE_DIR}/calligraphy/{safe_name}{ext}"
            
            print(f"  下载: {title} ({width}x{height})")
            size = download_image(img_url, filepath)
            if size > 0:
                all_files.append({
                    "title": title,
                    "url": img_url,
                    "filepath": filepath,
                    "width": width,
                    "height": height,
                    "size": size,
                })
                print(f"    ✓ {size/1024:.0f} KB")
    
    # 保存索引
    with open(f"{BASE_DIR}/index.json", "w", encoding="utf-8") as f:
        json.dump(all_files, f, ensure_ascii=False, indent=2)
    
    print(f"\n总计下载: {len(all_files)} 张图片")
    print(f"保存位置: {BASE_DIR}")

if __name__ == "__main__":
    main()
