#!/usr/bin/env python3
"""发送素材主导型海报到飞书群"""

import json
import requests

FEISHU_APP_ID = "cli_a9414ff633b45ceb"
FEISHU_APP_SECRET = "dZHxwQ8skSWvdoasrUao5eOkXyH6wdp6"
CHAT_ID = "oc_3e9bbc96ce6683fe69328c379849922f"

POSTERS = [
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters-material/坤为地.png", "坤为地 ☷ — 全幅书法背景模式"),
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters-material/坎为水.png", "坎为水 ☵ — 全幅书法背景模式"),
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters-material/离为火.png", "离为火 ☲ — 偏置文房模式"),
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters-material/乾为天.png", "乾为天 ☰ — 居中装裱模式"),
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters-material/水雷屯.png", "水雷屯 ☵☳ — 居中装裱模式"),
    ("/mnt/c/Users/咩咩哥/mysticdao-frontend/public/talisman-posters-material/地天泰.png", "地天泰 ☷☰ — 偏置模式"),
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
    content = json.dumps({"image_key": image_key, "alt": {"tag": "plain_text", "content": text}}, ensure_ascii=False)
    payload = {"receive_id": chat_id, "msg_type": "image", "content": content}
    resp = requests.post(
        url,
        params={"receive_id_type": "chat_id"},
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=payload,
        timeout=10,
    )
    data = resp.json()
    if data.get("code") != 0:
        raise Exception(f"发送消息失败: {data}")
    return data

def send_text_message(token, chat_id, text):
    url = "https://open.feishu.cn/open-apis/im/v1/messages"
    payload = {"receive_id": chat_id, "msg_type": "text", "content": json.dumps({"text": text}, ensure_ascii=False)}
    resp = requests.post(url, params={"receive_id_type": "chat_id"},
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=payload, timeout=10)
    data = resp.json()
    if data.get("code") != 0:
        raise Exception(f"发送文本失败: {data}")
    return data

if __name__ == "__main__":
    print("🎴 素材主导型海报 → 飞书")
    token = get_token()
    print("✅ Token获取成功")

    send_text_message(token, CHAT_ID,
        "🎴 MysticDAO 素材主导型海报预览\n"
        "• 彻底抛弃白底大框架\n"
        "• 书法/文房素材为视觉主体（opacity 0.9+）\n"
        "• 3种布局模式：居中装裱 / 偏置 / 全幅背景\n"
        "• 64卦全部完成，66.2秒\n"
        "以下6张代表不同模式 👇"
    )
    print("✅ 汇总文本已发送")

    for i, (path, label) in enumerate(POSTERS, 1):
        try:
            image_key = upload_image(token, path)
            send_image_message(token, CHAT_ID, image_key, label)
            print(f"✅ [{i}/6] {label}")
        except Exception as e:
            print(f"❌ [{i}/6] {label} — {e}")

    print("🎉 全部发送完成！")
