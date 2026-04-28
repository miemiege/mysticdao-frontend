#!/usr/bin/env python3
"""发送图片到飞书群"""

import json
import requests

FEISHU_APP_ID = "cli_a9414ff633b45ceb"
FEISHU_APP_SECRET = "dZHxwQ8skSWvdoasrUao5eOkXyH6wdp6"
CHAT_ID = "oc_3e9bbc96ce6683fe69328c379849922f"
IMAGE_PATH = "/mnt/c/Users/咩咩哥/mysticdao-frontend/public/lantern-core-v9.1-hd.png"

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

def send_image_message(token, chat_id, image_key):
    url = "https://open.feishu.cn/open-apis/im/v1/messages"
    payload = {
        "receive_id": chat_id,
        "msg_type": "image",
        "content": json.dumps({"image_key": image_key}, ensure_ascii=False),
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

if __name__ == "__main__":
    print("获取飞书 token...")
    token = get_token()
    print("上传图片...")
    image_key = upload_image(token, IMAGE_PATH)
    print(f"图片 key: {image_key}")
    print("发送图片消息...")
    result = send_image_message(token, CHAT_ID, image_key)
    print(f"发送成功: {result}")
