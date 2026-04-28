"""
图像质量评估引擎
对每张素材打分，输出 KEEP / REVIEW / DROP  verdict
"""

import cv2
import numpy as np
from skimage import measure, color as skcolor
from typing import Dict, Tuple


def sharpness_score(img: np.ndarray) -> float:
    """拉普拉斯方差 — 清晰度，越高越锐"""
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY) if len(img.shape) == 3 else img
    return cv2.Laplacian(gray, cv2.CV_64F).var()


def contrast_score(img: np.ndarray) -> float:
    """Michelson contrast"""
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY) if len(img.shape) == 3 else img
    lmin, lmax = int(gray.min()), int(gray.max())
    denom = lmax + lmin
    if denom == 0:
        return 0.0
    return float(lmax - lmin) / denom


def color_deviation(img: np.ndarray, target_rgb: Tuple[int, int, int]) -> float:
    """与目标颜色的平均LAB色差（CIEDE2000近似）"""
    target_lab = skcolor.rgb2lab(np.array([[target_rgb]], dtype=np.float32) / 255.0)[0, 0]
    img_float = img.astype(np.float32) / 255.0
    lab = skcolor.rgb2lab(img_float)
    diff = np.linalg.norm(lab - target_lab, axis=2)
    return float(np.mean(diff))


def text_contrast(img: np.ndarray) -> float:
    """检测墨字与底纸的对比度（假设文字是暗色）"""
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    # 二值化分离文字
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    fg = gray[binary > 0]   # 前景（文字）
    bg = gray[binary == 0]  # 背景（纸张）
    if len(fg) == 0 or len(bg) == 0:
        return 0.0
    return float(bg.mean() - fg.mean()) / 255.0


def centeredness(img: np.ndarray) -> float:
    """文字/主体居中程度：计算前景质心与图像中心的距离归一化"""
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    ys, xs = np.where(binary > 0)
    if len(xs) == 0:
        return 0.0
    cx, cy = np.mean(xs), np.mean(ys)
    h, w = img.shape[:2]
    dist = np.sqrt((cx - w / 2) ** 2 + (cy - h / 2) ** 2)
    max_dist = np.sqrt((w / 2) ** 2 + (h / 2) ** 2)
    return max(0.0, 1.0 - dist / max_dist)


def edge_bleed_ratio(img: np.ndarray) -> float:
    """边缘晕染占比：边缘暗像素占比"""
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    h, w = gray.shape
    edge_width = max(1, min(h, w) // 20)
    edges = np.concatenate([
        gray[:edge_width, :].ravel(),
        gray[-edge_width:, :].ravel(),
        gray[:, :edge_width].ravel(),
        gray[:, -edge_width:].ravel(),
    ])
    dark_pixels = np.sum(edges < 80)
    return float(dark_pixels) / len(edges)


def red_uniformity(img: np.ndarray, target_rgb: Tuple[int, int, int]) -> float:
    """印章红色均匀度：检测红色像素的集中度"""
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
    # HSV中红色范围
    lower1 = np.array([0, 80, 50])
    upper1 = np.array([10, 255, 255])
    lower2 = np.array([160, 80, 50])
    upper2 = np.array([180, 255, 255])
    mask1 = cv2.inRange(hsv, lower1, upper1)
    mask2 = cv2.inRange(hsv, lower2, upper2)
    red_mask = cv2.bitwise_or(mask1, mask2)
    red_ratio = np.sum(red_mask > 0) / red_mask.size
    # 希望红色占比在 10%~60% 之间
    if red_ratio < 0.05 or red_ratio > 0.7:
        return 0.0
    return 1.0 - abs(red_ratio - 0.35) / 0.35


def is_photo_not_artwork(img: np.ndarray) -> bool:
    """
    粗略判断是否为照片（器物/织物）而非书法绘画
    返回 True 表示可能是器物照片（应筛除）
    """
    # 检测高饱和度区域占比（书法通常是低饱和）
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
    saturation = hsv[:, :, 1]
    high_sat = np.sum(saturation > 150) / saturation.size
    # 检测边缘复杂度（器物通常边缘复杂）
    edges = cv2.Canny(cv2.cvtColor(img, cv2.COLOR_RGB2GRAY), 50, 150)
    edge_ratio = np.sum(edges > 0) / edges.size
    # 综合判断：高饱和+高边缘复杂度 → 可能是器物
    return high_sat > 0.3 and edge_ratio > 0.05


def assess_image(img: np.ndarray, category: str, thresholds: dict) -> Dict:
    """
    综合质量评估，返回评分字典
    """
    h, w = img.shape[:2]
    scores = {
        "resolution_ok": w >= thresholds["min_resolution"][0] and h >= thresholds["min_resolution"][1],
        "sharpness": sharpness_score(img),
        "contrast": contrast_score(img),
    }

    # 全局判断
    scores["sharpness_ok"] = scores["sharpness"] >= thresholds["min_sharpness"]
    scores["contrast_ok"] = scores["contrast"] >= thresholds["min_contrast"]

    # 分类专用
    if category == "calligraphy":
        scores["text_contrast"] = text_contrast(img)
        scores["centeredness"] = centeredness(img)
        scores["edge_bleed"] = edge_bleed_ratio(img)
        ct = thresholds.get("calligraphy", {})
        scores["text_contrast_ok"] = scores["text_contrast"] >= ct.get("min_text_contrast", 0.3)
        scores["centered_ok"] = scores["centeredness"] >= ct.get("min_centeredness", 0.6)
        scores["edge_bleed_ok"] = scores["edge_bleed"] <= ct.get("max_edge_bleed", 0.25)

    elif category == "seal":
        scores["red_uniformity"] = red_uniformity(img, (196, 30, 30))
        scores["red_ok"] = scores["red_uniformity"] >= thresholds.get("seal", {}).get("min_opacity_uniformity", 0.5)

    elif category == "texture":
        scores["not_too_sharp"] = scores["sharpness"] <= thresholds.get("texture", {}).get("max_sharpness", 300)

    elif category == "reference":
        scores["not_photo"] = not is_photo_not_artwork(img)

    # 计算综合分（强制转换为 Python 原生类型，确保 JSON 序列化）
    overall = 0.0
    checks = []
    clean_scores = {}
    for k, v in scores.items():
        if isinstance(v, (np.bool_,)):
            v = bool(v)
        elif isinstance(v, (np.integer,)):
            v = int(v)
        elif isinstance(v, (np.floating,)):
            v = float(v)
        clean_scores[k] = v
        if k.endswith("_ok"):
            checks.append(float(v))
    scores = clean_scores

    if checks:
        overall = sum(checks) / len(checks)
    scores["overall"] = round(overall, 3)

    # Verdict
    if overall >= 0.8:
        scores["verdict"] = "KEEP"
    elif overall >= 0.5:
        scores["verdict"] = "REVIEW"
    else:
        scores["verdict"] = "DROP"

    return scores
