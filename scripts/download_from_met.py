#!/usr/bin/env python3
"""
从 Met Museum API 下载中国书法/艺术公共领域图片
Met Museum API 无速率限制, 返回高清图片URL
"""

import os
import json
import urllib.request
import urllib.error
from datetime import datetime
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np

BASE_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-assets"
MET_DIR = f"{BASE_DIR}/met_museum"
PROC_DIR = f"{BASE_DIR}/processed"
os.makedirs(MET_DIR, exist_ok=True)
os.makedirs(PROC_DIR, exist_ok=True)

MET_API = "https://collectionapi.metmuseum.org/public/collection/v1"
USER_AGENT = "MysticDAO-AssetBot/1.0"

# 搜索关键词
SEARCH_TERMS = [
    "Chinese calligraphy",
    "Chinese painting",
    "Chinese seal",
    "Chinese scroll",
    "Chinese Buddhism",
    "Chinese Daoism",
    "Chinese textile",
    "Chinese porcelain",
    "Chinese jade",
    "Chinese bronze",
]

def met_search(q):
    """搜索Met Museum藏品"""
    try:
        url = f"{MET_API}/search?q={urllib.parse.quote(q)}&hasImages=true&isPublicDomain=true"
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"搜索失败 {q}: {e}")
        return None

def met_object(id):
    """获取藏品详情"""
    try:
        url = f"{MET_API}/objects/{id}"
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return None

def download(url, dest):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
            if len(data) < 5 * 1024: return False
            with open(dest, "wb") as f:
                f.write(data)
        return True
    except Exception as e:
        return False

def process_img(src, dest):
    try:
        img = Image.open(src)
        if img.mode != "RGB": img = img.convert("RGB")
        # 暖黄化
        r, g, b = img.split()
        r = r.point(lambda i: min(255, int(i * 1.05)))
        g = g.point(lambda i: min(255, int(i * 1.02)))
        b = b.point(lambda i: int(i * 0.85))
        img = Image.merge("RGB", (r, g, b))
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.2)
        img = img.filter(ImageFilter.GaussianBlur(radius=0.8))
        # Resize
        img.thumbnail((800, 800), Image.Resampling.LANCZOS)
        img.save(dest, quality=95)
        return True
    except Exception as e:
        return False

def main():
    total = 0
    for term in SEARCH_TERMS:
        print(f"\n🔍 {term}")
        result = met_search(term)
        if not result or "objectIDs" not in result:
            continue
        
        ids = result["objectIDs"]
        if not ids:
            continue
        
        print(f"  找到 {len(ids)} 件藏品")
        
        for obj_id in ids[:100]:  # 每个关键词最多100件
            obj = met_object(obj_id)
            if not obj:
                continue
            
            if not obj.get("primaryImage"):
                continue
            
            primary = obj["primaryImage"]
            title = obj.get("title", f"met_{obj_id}")
            safe = "".join(c for c in title if c.isalnum() or c in "_- ").replace(" ", "_")[:50]
            
            src_path = f"{MET_DIR}/met_{obj_id}_{safe}.jpg"
            proc_path = f"{PROC_DIR}/met_{obj_id:05d}.jpg"
            
            if os.path.exists(proc_path):
                continue
            
            if download(primary, src_path):
                if process_img(src_path, proc_path):
                    total += 1
                    if total % 10 == 0:
                        print(f"  ✅ +{total} 累计")
    
    print(f"\n🏁 Met Museum 完成: {total} 张")

if __name__ == "__main__":
    main()
