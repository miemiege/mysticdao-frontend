#!/usr/bin/env python3
"""发送64卦海报预览到飞书群"""

import json
import requests

FEISHU_APP_ID = "cli_a9414ff633b45ceb"
FEISHU_APP_SECRET = "dZHxwQ8skSWvdoasrUao5eOkXyH6wdp6"
CHAT_ID = "oc_3e9bbc96ce6683fe69328c379849922f"

POSTERS = [
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters/乾为天.png", "乾为天 ☰ The Creative"),
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters/坤为地.png", "坤为地 ☷ The Receptive"),
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters/坎为水.png", "坎为水 ☵ The Abysmal"),
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters/离为火.png", "离为火 ☲ The Clinging"),
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters/震为雷.png", "震为雷 ☳ The Arousing"),
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters/艮为山.png", "艮为山 ☶ Keeping Still"),
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters/巽为风.png", "巽为风 ☴ The Gentle"),
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters/兑为泽.png", "兑为泽 ☱ The Joyous"),
]

def get_token():
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    resp = requests.post(url, json={"app_id": FEISHU_APP_ID, "app_secret": FEISHU_APP_SECRET}, timeout=10)
    data = resp.json()
    if data.get("code") != 0:
        raise Exception(f"获取token失败: {data}")
    return data["tenant_access_token"]

def upload_image(token, image_path):
    url = "https://open.feishu.cn/open-apis/im/v1/images"
    with open(image_path, "rb") as f:
        resp = requests.post(
            url,
            headers={"Authorization": f"Bearer {token}"},
            files={"image": f},
            data={"image_type": "message"},
            timeout=30,
        )
    data = resp.json()
    if data.get("code") != 0:
        raise Exception(f"上传图片失败: {data}")
    return data["data"]["image_key"]

def send_image_message(token, chat_id, image_key, text=""):
    url = "https://open.feishu.cn/open-apis/im/v1/messages"
    if text:
        content = json.dumps({
            "image_key": image_key,
            "alt": {"tag": "plain_text", "content": text}
        }, ensure_ascii=False)
    else:
        content = json.dumps({"image_key": image_key}, ensure_ascii=False)
    
    payload = {
        "receive_id": chat_id,
        "msg_type": "image",
        "content": content,
    }
    resp = requests.post(
        url,
        params={"receive_id_type": "chat_id"},
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=10,
    )
    data = resp.json()
    if data.get("code") != 0:
        raise Exception(f"发送消息失败: {data}")
    return data

def send_text_message(token, chat_id, text):
    url = "https://open.feishu.cn/open-apis/im/v1/messages"
    payload = {
        "receive_id": chat_id,
        "msg_type": "text",
        "content": json.dumps({"text": text}, ensure_ascii=False),
    }
    resp = requests.post(
        url,
        params={"receive_id_type": "chat_id"},
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=10,
    )
    data = resp.json()
    if data.get("code") != 0:
        raise Exception(f"发送文本失败: {data}")
    return data

if __name__ == "__main__":
    print("🎯 MysticDAO 64卦海报预览 → 飞书")
    print("=" * 50)
    
    token = get_token()
    print("✅ Token获取成功")
    
    # 先发一条汇总文本
    send_text_message(token, CHAT_ID, 
        "🎴 MysticDAO v9.1 符咒海报批量渲染完成\n"
        "• 64卦全部成功（800×1280px @2x）\n"
        "• 素材库: 书法182 + 纹样173 + 印章132 + 纹理136 = 711张\n"
        "• 耗时: 45.4秒 · 平均1MB/张\n"
        "以下是八卦代表卦预览 👇"
    )
    print("✅ 汇总文本已发送")
    
    # 逐张发送
    for i, (path, label) in enumerate(POSTERS, 1):
        try:
            image_key = upload_image(token, path)
            send_image_message(token, CHAT_ID, image_key, label)
            print(f"✅ [{i}/8] {label}")
        except Exception as e:
            print(f"❌ [{i}/8] {label} — {e}")
    
    print("=" * 50)
    print("🎉 全部发送完成！")
