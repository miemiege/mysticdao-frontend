#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MysticDAO 东方纹样素材生成脚本
生成20张高质量东方纹样素材
"""

import os
import math
from PIL import Image, ImageDraw

OUTPUT_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/raw_assets/patterns/agent_batch_1"
SIZE = 512
CENTER = SIZE // 2

# 颜色定义
INK_BLACK = "#1a1a1a"
INK_DARK = "#0f0f0f"
INK_GRAY = "#2d2d2d"
RED_DARK = "#4a0000"
RED_CRIMSON = "#6b0f1a"
RED_SCARLET = "#8b0000"
BLUE_INDIGO = "#1a1a4a"
BLUE_NAVY = "#2e2e5a"
BLUE_DEEP = "#191970"

# ============ 辅助函数 ============

def create_canvas(size=SIZE):
    """创建透明画布"""
    return Image.new("RGBA", (size, size), (0, 0, 0, 0))

def rotate_point(x, y, cx, cy, angle):
    """绕中心点旋转坐标"""
    rad = math.radians(angle)
    nx = cx + (x - cx) * math.cos(rad) - (y - cy) * math.sin(rad)
    ny = cy + (x - cx) * math.sin(rad) + (y - cy) * math.cos(rad)
    return nx, ny

def draw_rotated_symmetry(draw, func, cx, cy, n, *args, **kwargs):
    """旋转对称绘制"""
    for i in range(n):
        angle = 360 / n * i
        func(draw, cx, cy, angle, *args, **kwargs)

def polygon_rotated(draw, cx, cy, radius, sides, angle_offset, fill=None, outline=None, width=2):
    """绘制旋转的正多边形"""
    points = []
    for i in range(sides):
        angle = math.radians(angle_offset + 360 / sides * i)
        x = cx + radius * math.cos(angle)
        y = cy + radius * math.sin(angle)
        points.append((x, y))
    if fill:
        draw.polygon(points, fill=fill, outline=outline)
    else:
        draw.polygon(points, outline=outline)
    if outline and width > 0:
        for i in range(len(points)):
            draw.line([points[i], points[(i + 1) % len(points)]], fill=outline, width=width)

def draw_arc_ring(draw, cx, cy, radius, start, end, color, width=3):
    """绘制弧线环"""
    bbox = [cx - radius, cy - radius, cx + radius, cy + radius]
    draw.arc(bbox, start=start, end=end, fill=color, width=width)

# ============ 纹样1: 八卦符号阵 (墨色) ============
def pattern_bagua_array():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = INK_BLACK
    
    # 外圈
    draw.ellipse([CENTER-200, CENTER-200, CENTER+200, CENTER+200], outline=color, width=3)
    draw.ellipse([CENTER-190, CENTER-190, CENTER+190, CENTER+190], outline=color, width=1)
    
    # 8个卦象位置
    r = 160
    for i in range(8):
        angle = math.radians(45 * i - 90)
        x = CENTER + r * math.cos(angle)
        y = CENTER + r * math.sin(angle)
        # 卦象简化为三横组合
        bar_len = 24
        gap = 8
        for j in range(3):
            by = y - bar_len + j * gap
            # 断连交替表示阴阳
            if (i + j) % 2 == 0:
                draw.line([(x - bar_len, by), (x + bar_len, by)], fill=color, width=3)
            else:
                draw.line([(x - bar_len, by), (x - 6, by)], fill=color, width=3)
                draw.line([(x + 6, by), (x + bar_len, by)], fill=color, width=3)
    
    # 中心太极简图
    draw.ellipse([CENTER-30, CENTER-30, CENTER+30, CENTER+30], outline=color, width=3)
    draw.arc([CENTER-30, CENTER-30, CENTER+30, CENTER+30], start=90, end=270, fill=color, width=3)
    draw.ellipse([CENTER-10, CENTER-20, CENTER+10, CENTER], outline=color, width=2)
    draw.ellipse([CENTER-10, CENTER, CENTER+10, CENTER+20], outline=color, width=2)
    
    return img

# ============ 纹样2: 龟背几何 (墨色) ============
def pattern_tortoise_shell():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = INK_GRAY
    
    hex_r = 35
    spacing = hex_r * 1.8
    
    for row in range(-5, 6):
        for col in range(-5, 6):
            cx = CENTER + col * spacing
            cy = CENTER + row * spacing * 0.866
            if row % 2 != 0:
                cx += spacing * 0.5
            # 六边形
            points = []
            for i in range(6):
                angle = math.radians(60 * i)
                px = cx + hex_r * math.cos(angle)
                py = cy + hex_r * math.sin(angle)
                points.append((px, py))
            draw.polygon(points, outline=color, width=2)
            # 内部小六边形
            points2 = []
            for i in range(6):
                angle = math.radians(60 * i)
                px = cx + hex_r * 0.5 * math.cos(angle)
                py = cy + hex_r * 0.5 * math.sin(angle)
                points2.append((px, py))
            draw.polygon(points2, outline=color, width=1)
            # 中心点
            draw.ellipse([cx-2, cy-2, cx+2, cy+2], fill=color)
    return img

# ============ 纹样3: 云雷螺旋 (墨色) ============
def pattern_cloud_spiral():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = INK_DARK
    
    def draw_spiral(draw, cx, cy, color, turns=3, max_r=60):
        points = []
        steps = 200
        for i in range(steps):
            t = i / steps
            angle = turns * 2 * math.pi * t
            r = max_r * t
            x = cx + r * math.cos(angle)
            y = cy + r * math.sin(angle)
            points.append((x, y))
        for i in range(len(points) - 1):
            w = max(1, int(3 * (1 - i / len(points))))
            draw.line([points[i], points[i+1]], fill=color, width=w)
    
    # 中心大螺旋
    draw_spiral(draw, CENTER, CENTER, color, turns=4, max_r=90)
    
    # 周围小螺旋，旋转对称
    for i in range(6):
        angle = math.radians(60 * i)
        r = 130
        x = CENTER + r * math.cos(angle)
        y = CENTER + r * math.sin(angle)
        draw_spiral(draw, x, y, color, turns=2.5, max_r=40)
        # 螺旋间连线
        if i > 0:
            prev_angle = math.radians(60 * (i - 1))
            px = CENTER + r * math.cos(prev_angle)
            py = CENTER + r * math.sin(prev_angle)
            draw.line([(px, py), (x, y)], fill=color, width=1)
    
    return img

# ============ 纹样4: 万字连绵 (墨色) ============
def pattern_wanzi():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = INK_BLACK
    
    def draw_swastika(draw, cx, cy, size, color, angle=0):
        """绘制卍字"""
        # 简化为4条L形臂
        arm = size
        thickness = 4
        rad = math.radians(angle)
        
        def rot(x, y):
            rx = cx + (x - cx) * math.cos(rad) - (y - cy) * math.sin(rad)
            ry = cy + (x - cx) * math.sin(rad) + (y - cy) * math.cos(rad)
            return rx, ry
        
        # 上臂
        p1 = rot(cx - thickness, cy - arm)
        p2 = rot(cx + thickness, cy - arm)
        p3 = rot(cx + thickness, cy - thickness)
        p4 = rot(cx + arm, cy - thickness)
        p5 = rot(cx + arm, cy + thickness)
        p6 = rot(cx - thickness, cy + thickness)
        p7 = rot(cx - thickness, cy + arm)
        p8 = rot(cx + thickness, cy + arm)
        p9 = rot(cx + thickness, cy + thickness)
        p10 = rot(cx - arm, cy + thickness)
        p11 = rot(cx - arm, cy - thickness)
        p12 = rot(cx - thickness, cy - thickness)
        
        points = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12]
        draw.polygon(points, outline=color, fill=None)
        # 描边加粗
        draw.line([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p1], fill=color, width=2)
    
    step = 70
    for row in range(-4, 5):
        for col in range(-4, 5):
            cx = CENTER + col * step
            cy = CENTER + row * step
            ang = 45 if (row + col) % 2 == 0 else -45
            draw_swastika(draw, cx, cy, 20, color, angle=ang)
    
    return img

# ============ 纹样5: 回纹边框 (墨色) ============
def pattern_huiwen_border():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = INK_GRAY
    
    def draw_meander(draw, x, y, size, color, depth=3):
        """绘制回字纹"""
        for d in range(depth):
            offset = d * size
            rect = [x + offset, y + offset, x + size * (depth * 2 - d), y + size * (depth * 2 - d)]
            if d % 2 == 0:
                # 绘制回字的一段
                draw.line([(rect[0], rect[1]), (rect[2], rect[1])], fill=color, width=2)
                draw.line([(rect[2], rect[1]), (rect[2], rect[3])], fill=color, width=2)
    
    # 多层同心回纹
    layers = 6
    for layer in range(layers):
        margin = 20 + layer * 35
        rect = [margin, margin, SIZE - margin, SIZE - margin]
        # 单层回纹：沿四边绘制
        seg = 15
        # 上边
        x = rect[0]
        while x < rect[2]:
            draw.line([(x, rect[1]), (x + seg, rect[1])], fill=color, width=2)
            draw.line([(x + seg, rect[1]), (x + seg, rect[1] + seg)], fill=color, width=2)
            draw.line([(x + seg, rect[1] + seg), (x + seg * 2, rect[1] + seg)], fill=color, width=2)
            x += seg * 2
        # 右边
        y = rect[1]
        while y < rect[3]:
            draw.line([(rect[2], y), (rect[2], y + seg)], fill=color, width=2)
            draw.line([(rect[2], y + seg), (rect[2] - seg, y + seg)], fill=color, width=2)
            draw.line([(rect[2] - seg, y + seg), (rect[2] - seg, y + seg * 2)], fill=color, width=2)
            y += seg * 2
        # 下边
        x = rect[2]
        while x > rect[0]:
            draw.line([(x, rect[3]), (x - seg, rect[3])], fill=color, width=2)
            draw.line([(x - seg, rect[3]), (x - seg, rect[3] - seg)], fill=color, width=2)
            draw.line([(x - seg, rect[3] - seg), (x - seg * 2, rect[3] - seg)], fill=color, width=2)
            x -= seg * 2
        # 左边
        y = rect[3]
        while y > rect[1]:
            draw.line([(rect[0], y), (rect[0], y - seg)], fill=color, width=2)
            draw.line([(rect[0], y - seg), (rect[0] + seg, y - seg)], fill=color, width=2)
            draw.line([(rect[0] + seg, y - seg), (rect[0] + seg, y - seg * 2)], fill=color, width=2)
            y -= seg * 2
    
    return img

# ============ 纹样6: 龙鳞矩阵 (墨色) ============
def pattern_dragon_scale():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = INK_BLACK
    
    scale_w = 40
    scale_h = 30
    rows = 14
    cols = 14
    
    for row in range(rows):
        for col in range(cols):
            cx = 30 + col * scale_w + (row % 2) * (scale_w / 2)
            cy = 30 + row * scale_h * 0.8
            # 半圆形鳞片
            draw.arc([cx - scale_w / 2 + 2, cy - scale_h / 2, cx + scale_w / 2 - 2, cy + scale_h / 2],
                     start=0, end=180, fill=color, width=2)
            # 内部纹理
            draw.arc([cx - scale_w / 4, cy - scale_h / 4, cx + scale_w / 4, cy + scale_h / 4],
                     start=0, end=180, fill=color, width=1)
            # 底部小点
            draw.ellipse([cx - 2, cy + 2, cx + 2, cy + 6], fill=color)
    return img

# ============ 纹样7: 缠枝莲花 (暗红) ============
def pattern_lotus_scroll():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = RED_CRIMSON
    
    def draw_lotus(draw, cx, cy, r, color):
        """简化莲花"""
        for i in range(8):
            angle = math.radians(45 * i)
            px = cx + r * 0.5 * math.cos(angle)
            py = cy + r * 0.5 * math.sin(angle)
            draw.ellipse([px - r * 0.3, py - r * 0.15, px + r * 0.3, py + r * 0.15],
                         outline=color, width=2)
        draw.ellipse([cx - r * 0.2, cy - r * 0.2, cx + r * 0.2, cy + r * 0.2], fill=color)
    
    # 主藤蔓 - 曲线
    for start_angle in [0, 90, 180, 270]:
        points = []
        rad = math.radians(start_angle)
        for t in range(100):
            tt = t / 100
            r = 50 + tt * 150
            wobble = math.sin(tt * 4 * math.pi) * 20
            x = CENTER + (r * math.cos(rad + tt * math.pi * 0.5)) + wobble * math.sin(rad)
            y = CENTER + (r * math.sin(rad + tt * math.pi * 0.5)) - wobble * math.cos(rad)
            points.append((x, y))
        for i in range(len(points) - 1):
            draw.line([points[i], points[i + 1]], fill=color, width=2)
        # 在末端画莲花
        if points:
            draw_lotus(draw, points[-1][0], points[-1][1], 20, color)
        # 中段也画小莲花
        for idx in [30, 60]:
            draw_lotus(draw, points[idx][0], points[idx][1], 12, color)
    
    # 中心大莲花
    draw_lotus(draw, CENTER, CENTER, 35, color)
    
    return img

# ============ 纹样8: 火焰放射 (暗红) ============
def pattern_flame_radiate():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = RED_SCARLET
    color2 = RED_CRIMSON
    
    n_flames = 16
    for i in range(n_flames):
        angle = math.radians(360 / n_flames * i)
        # 火焰由多条线组成
        for j in range(3):
            r_inner = 30 + j * 5
            r_outer = 120 + j * 20 + (i % 3) * 10
            wobble = (j - 1) * 8
            x1 = CENTER + r_inner * math.cos(angle + math.radians(wobble))
            y1 = CENTER + r_inner * math.sin(angle + math.radians(wobble))
            x2 = CENTER + r_outer * math.cos(angle + math.radians(wobble))
            y2 = CENTER + r_outer * math.sin(angle + math.radians(wobble))
            draw.line([(x1, y1), (x2, y2)], fill=color if j % 2 == 0 else color2, width=3 - j)
        # 火焰尖端
        tip_r = 160 + (i % 3) * 15
        tx = CENTER + tip_r * math.cos(angle)
        ty = CENTER + tip_r * math.sin(angle)
        draw.polygon([(x2, y2), (tx, ty),
                      (CENTER + (tip_r - 20) * math.cos(angle + 0.1),
                       CENTER + (tip_r - 20) * math.sin(angle + 0.1))],
                     fill=color)
    
    # 中心火球
    draw.ellipse([CENTER-25, CENTER-25, CENTER+25, CENTER+25], outline=color, width=3)
    draw.ellipse([CENTER-15, CENTER-15, CENTER+15, CENTER+15], fill=color2)
    
    return img

# ============ 纹样9: 如意云头 (暗红) ============
def pattern_ruyi_cloud():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = RED_DARK
    
    def draw_ruyi(draw, cx, cy, size, color, flip=False):
        """绘制如意云头"""
        pts = []
        steps = 30
        for i in range(steps):
            t = i / steps
            angle = math.pi * t
            r = size * (0.5 + 0.5 * math.sin(angle))
            x = cx + r * math.cos(angle) * (1 if not flip else -1)
            y = cy + r * math.sin(angle) * (-1 if flip else 1)
            pts.append((x, y))
        # 云头底部
        pts.append((cx + size * (1 if not flip else -1), cy))
        pts.append((cx, cy + size * 0.3))
        
        if len(pts) >= 2:
            draw.line(pts, fill=color, width=3)
            # 内部填充轮廓
            for i in range(len(pts) - 1):
                draw.line([pts[i], pts[i+1]], fill=color, width=2)
    
    # 4个方向如意
    offsets = [(0, -80), (80, 0), (0, 80), (-80, 0)]
    flips = [False, False, True, True]
    for (ox, oy), flip in zip(offsets, flips):
        draw_ruyi(draw, CENTER + ox, CENTER + oy, 50, color, flip=flip)
    
    # 中心连接
    draw.ellipse([CENTER-40, CENTER-40, CENTER+40, CENTER+40], outline=color, width=2)
    draw.ellipse([CENTER-20, CENTER-20, CENTER+20, CENTER+20], outline=color, width=2)
    
    # 四角小云头
    for ox, oy in [(-120, -120), (120, -120), (120, 120), (-120, 120)]:
        draw.ellipse([CENTER+ox-15, CENTER+oy-10, CENTER+ox+15, CENTER+oy+10], outline=color, width=2)
        draw.ellipse([CENTER+ox-8, CENTER+oy-15, CENTER+ox+8, CENTER+oy-5], outline=color, width=2)
    
    return img

# ============ 纹样10: 盘长结 (暗红) ============
def pattern_panchang_knot():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = RED_CRIMSON
    
    # 盘长结主体 - 菱形交织
    size = 150
    # 外框菱形
    diamond = [(CENTER, CENTER - size), (CENTER + size, CENTER),
               (CENTER, CENTER + size), (CENTER - size, CENTER)]
    draw.polygon(diamond, outline=color, width=3)
    
    # 内菱形
    size2 = 100
    diamond2 = [(CENTER, CENTER - size2), (CENTER + size2, CENTER),
                (CENTER, CENTER + size2), (CENTER - size2, CENTER)]
    draw.polygon(diamond2, outline=color, width=2)
    
    # 交叉线
    draw.line([(CENTER - size, CENTER), (CENTER + size, CENTER)], fill=color, width=2)
    draw.line([(CENTER, CENTER - size), (CENTER, CENTER + size)], fill=color, width=2)
    
    # 四角环
    for dx, dy in [(-1, -1), (1, -1), (1, 1), (-1, 1)]:
        cx = CENTER + dx * size * 0.7
        cy = CENTER + dy * size * 0.7
        draw.ellipse([cx - 25, cy - 25, cx + 25, cy + 25], outline=color, width=3)
        draw.ellipse([cx - 15, cy - 15, cx + 15, cy + 15], outline=color, width=2)
    
    # 中心结
    draw.ellipse([CENTER - 35, CENTER - 35, CENTER + 35, CENTER + 35], outline=color, width=3)
    draw.ellipse([CENTER - 20, CENTER - 20, CENTER + 20, CENTER + 20], outline=color, width=2)
    draw.ellipse([CENTER - 8, CENTER - 8, CENTER + 8, CENTER + 8], fill=color)
    
    return img



# ============ 纹样11: 菱格连环 (暗红) ============
def pattern_diamond_chain():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = RED_SCARLET
    
    step = 55
    for row in range(-5, 6):
        for col in range(-5, 6):
            cx = CENTER + col * step
            cy = CENTER + row * step
            # 菱形
            d = 25
            diamond = [(cx, cy - d), (cx + d, cy), (cx, cy + d), (cx - d, cy)]
            draw.polygon(diamond, outline=color, width=2)
            # 内菱形
            d2 = 15
            diamond2 = [(cx, cy - d2), (cx + d2, cy), (cx, cy + d2), (cx - d2, cy)]
            draw.polygon(diamond2, outline=color, width=1)
            # 中心圆
            draw.ellipse([cx - 5, cy - 5, cx + 5, cy + 5], fill=color)
            # 连接圆
            if col < 5:
                draw.ellipse([cx + d - 5, cy - 5, cx + d + 5, cy + 5], outline=color, width=1)
            if row < 5:
                draw.ellipse([cx - 5, cy + d - 5, cx + 5, cy + d + 5], outline=color, width=1)
    return img

# ============ 纹样12: 星宿连线 (暗红) ============
def pattern_star_constellation():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = RED_DARK
    
    # 定义星宿点（东方四象之一 - 朱雀简化）
    stars = [
        # 主体星点
        (CENTER, CENTER - 120),
        (CENTER - 40, CENTER - 90),
        (CENTER + 40, CENTER - 90),
        (CENTER - 80, CENTER - 50),
        (CENTER + 80, CENTER - 50),
        (CENTER - 50, CENTER),
        (CENTER + 50, CENTER),
        (CENTER, CENTER + 30),
        (CENTER - 30, CENTER + 80),
        (CENTER + 30, CENTER + 80),
        (CENTER - 60, CENTER + 130),
        (CENTER + 60, CENTER + 130),
        (CENTER, CENTER + 160),
        # 散落的星
        (CENTER - 120, CENTER - 80),
        (CENTER + 120, CENTER - 80),
        (CENTER - 100, CENTER + 40),
        (CENTER + 100, CENTER + 40),
        (CENTER - 140, CENTER + 100),
        (CENTER + 140, CENTER + 100),
    ]
    
    # 连线
    connections = [
        (0, 1), (0, 2), (1, 3), (2, 4), (3, 5), (4, 6),
        (5, 7), (6, 7), (7, 8), (7, 9), (8, 10), (9, 11),
        (10, 12), (11, 12), (0, 13), (0, 14), (5, 15), (6, 16),
        (10, 17), (11, 18)
    ]
    
    for a, b in connections:
        draw.line([stars[a], stars[b]], fill=color, width=1)
    
    # 绘制星点
    for x, y in stars:
        r = 4 if abs(x - CENTER) < 60 else 3
        draw.ellipse([x - r, y - r, x + r, y + r], fill=color)
        # 光晕
        draw.ellipse([x - r - 3, y - r - 3, x + r + 3, y + r + 3], outline=color, width=1)
    
    return img

# ============ 纹样13: 卷草波浪 (暗红) ============
def pattern_scroll_wave():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = RED_CRIMSON
    
    def draw_wave_line(draw, y_base, amplitude, wavelength, color, width=2):
        points = []
        for x in range(0, SIZE + 10, 5):
            y = y_base + amplitude * math.sin(x / wavelength * 2 * math.pi)
            points.append((x, y))
        for i in range(len(points) - 1):
            draw.line([points[i], points[i + 1]], fill=color, width=width)
        # 卷草端点
        for x in range(0, SIZE + 10, int(wavelength)):
            y = y_base + amplitude * math.sin(x / wavelength * 2 * math.pi)
            # 小卷曲
            curl_dir = 1 if math.cos(x / wavelength * 2 * math.pi) > 0 else -1
            draw.arc([x - 8, y - 12, x + 8, y + 12], start=0, end=180 * curl_dir, fill=color, width=2)
    
    for i in range(5):
        y = 80 + i * 90
        amp = 25 + i * 5
        wl = 80 + i * 10
        draw_wave_line(draw, y, amp, wl, color, width=2)
    
    # 垂直卷草连接
    for x_pos in [100, 250, 400]:
        for i in range(3):
            cy = 120 + i * 130
            draw.arc([x_pos - 15, cy - 20, x_pos + 15, cy + 20], start=90, end=270, fill=color, width=2)
    
    return img

# ============ 纹样14: 水波涟漪 (靛蓝) ============
def pattern_water_ripple():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = BLUE_DEEP
    color2 = BLUE_INDIGO
    
    # 同心圆水波纹
    for i in range(12):
        r = 20 + i * 18
        w = 3 if i % 3 == 0 else 1
        c = color if i % 2 == 0 else color2
        draw.ellipse([CENTER - r, CENTER - r, CENTER + r, CENTER + r], outline=c, width=w)
    
    # 波浪线装饰
    for row in range(4):
        y = 60 + row * 130
        points = []
        for x in range(0, SIZE, 10):
            yy = y + 15 * math.sin(x / 50 * 2 * math.pi + row)
            points.append((x, yy))
        for i in range(len(points) - 1):
            draw.line([points[i], points[i + 1]], fill=color, width=2)
    
    # 水花点
    for i in range(20):
        angle = math.radians(i * 18)
        r = 100 + (i % 5) * 30
        x = CENTER + r * math.cos(angle)
        y = CENTER + r * math.sin(angle)
        draw.ellipse([x - 3, y - 3, x + 3, y + 3], fill=color2)
    
    return img

# ============ 纹样15: 山峦叠嶂 (靛蓝) ============
def pattern_mountain():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = BLUE_NAVY
    color2 = BLUE_INDIGO
    
    # 多层山峰
    layers = [
        (180, 50, 3),   # 高
        (140, 120, 2),
        (100, 190, 2),
        (70, 260, 1),
    ]
    
    for height, base_y, width_mult in layers:
        # 主山峰
        peak = [(CENTER, CENTER - height + base_y - 100),
                (CENTER - height * width_mult, CENTER + base_y - 50),
                (CENTER + height * width_mult, CENTER + base_y - 50)]
        draw.polygon(peak, outline=color, width=2)
        # 内部山脊线
        draw.line([(CENTER, CENTER - height + base_y - 100),
                   (CENTER, CENTER + base_y - 50)], fill=color2, width=1)
        
        # 侧峰
        for side in [-1, 1]:
            px = CENTER + side * height * width_mult * 0.7
            py = CENTER + base_y - 50
            peak2 = [(px, py - height * 0.5),
                     (px - height * 0.4, py),
                     (px + height * 0.4, py)]
            draw.polygon(peak2, outline=color, width=1)
    
    # 底部横线（地平线）
    draw.line([(0, CENTER + 200), (SIZE, CENTER + 200)], fill=color, width=2)
    
    # 山顶点缀
    for mx, my in [(CENTER, CENTER - 130), (CENTER - 100, CENTER - 30), (CENTER + 100, CENTER - 30)]:
        draw.ellipse([mx - 4, my - 4, mx + 4, my + 4], fill=color)
    
    return img

# ============ 纹样16: 联珠璎珞 (靛蓝) ============
def pattern_bead_chain():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = BLUE_INDIGO
    color2 = BLUE_DEEP
    
    # 交织的珠链
    def draw_bead_line(draw, points, color, bead_r=5):
        for i in range(len(points) - 1):
            draw.line([points[i], points[i + 1]], fill=color, width=1)
        # 珠点
        for p in points:
            draw.ellipse([p[0] - bead_r, p[1] - bead_r, p[0] + bead_r, p[1] + bead_r],
                         fill=color, outline=color2)
    
    # 水平珠链
    for row in range(6):
        y = 50 + row * 80
        points = []
        for x in range(30, SIZE - 30, 25):
            yy = y + 10 * math.sin(x / 60 * 2 * math.pi)
            points.append((x, yy))
        draw_bead_line(draw, points, color, bead_r=4)
    
    # 垂直珠链
    for col in range(6):
        x = 50 + col * 80
        points = []
        for y in range(30, SIZE - 30, 25):
            xx = x + 10 * math.sin(y / 60 * 2 * math.pi)
            points.append((xx, y))
        draw_bead_line(draw, points, color2, bead_r=3)
    
    # 中心大珠
    draw.ellipse([CENTER - 30, CENTER - 30, CENTER + 30, CENTER + 30], outline=color, width=3)
    draw.ellipse([CENTER - 20, CENTER - 20, CENTER + 20, CENTER + 20], fill=color)
    draw.ellipse([CENTER - 8, CENTER - 8, CENTER + 8, CENTER + 8], fill=color2)
    
    return img

# ============ 纹样17: 铜钱连环 (靛蓝) ============
def pattern_cash_coin():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = BLUE_DEEP
    color2 = BLUE_NAVY
    
    def draw_coin(draw, cx, cy, r, color):
        # 外圆
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=2)
        # 内方
        sr = r * 0.35
        draw.rectangle([cx - sr, cy - sr, cx + sr, cy + sr], outline=color, width=2)
        # 四角装饰
        for dx, dy in [(-1, -1), (1, -1), (1, 1), (-1, 1)]:
            draw.line([(cx + dx * sr, cy + dy * sr * 0.3),
                       (cx + dx * sr * 0.3, cy + dy * sr)], fill=color, width=1)
    
    # 网格排列铜钱
    spacing = 70
    for row in range(-4, 5):
        for col in range(-4, 5):
            cx = CENTER + col * spacing
            cy = CENTER + row * spacing
            r = 25
            draw_coin(draw, cx, cy, r, color if (row + col) % 2 == 0 else color2)
            # 连接小圆
            if col < 4:
                draw.ellipse([cx + r - 4, cy - 4, cx + r + 4, cy + 4], fill=color2)
            if row < 4:
                draw.ellipse([cx - 4, cy + r - 4, cx + 4, cy + r + 4], fill=color2)
    
    return img

# ============ 纹样18: 祥云如意 (靛蓝) ============
def pattern_auspicious_cloud():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = BLUE_NAVY
    
    def draw_cloud(draw, cx, cy, size, color):
        """绘制祥云"""
        # 由多个圆弧组成云
        r1, r2, r3 = size * 0.5, size * 0.35, size * 0.25
        # 主体弧
        draw.arc([cx - size, cy - size * 0.4, cx, cy + size * 0.6], start=0, end=180, fill=color, width=3)
        draw.arc([cx, cy - size * 0.4, cx + size * 0.8, cy + size * 0.6], start=0, end=180, fill=color, width=3)
        # 顶部小弧
        draw.arc([cx - size * 0.3, cy - size * 0.9, cx + size * 0.5, cy + size * 0.1],
                 start=0, end=180, fill=color, width=2)
        # 底部云尾
        draw.line([(cx - size * 0.8, cy + size * 0.1), (cx - size, cy + size * 0.3)], fill=color, width=2)
        draw.line([(cx + size * 0.6, cy + size * 0.1), (cx + size * 0.9, cy + size * 0.3)], fill=color, width=2)
    
    # 中心大祥云
    draw_cloud(draw, CENTER, CENTER, 80, color)
    
    # 环绕小祥云
    positions = [
        (CENTER - 130, CENTER - 60), (CENTER + 130, CENTER - 60),
        (CENTER - 130, CENTER + 60), (CENTER + 130, CENTER + 60),
        (CENTER - 70, CENTER - 130), (CENTER + 70, CENTER - 130),
        (CENTER - 70, CENTER + 130), (CENTER + 70, CENTER + 130),
    ]
    for px, py in positions:
        draw_cloud(draw, px, py, 35, color)
    
    # 连接线
    for px, py in positions:
        draw.line([(CENTER, CENTER), (px, py)], fill=color, width=1)
    
    return img

# ============ 纹样19: 太极八卦 (靛蓝) ============
def pattern_taiji_bagua():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = BLUE_INDIGO
    color2 = BLUE_DEEP
    
    r = 70
    # 太极外圆
    draw.ellipse([CENTER - r, CENTER - r, CENTER + r, CENTER + r], outline=color, width=3)
    
    # S曲线分阴阳
    # 上半白鱼（暗色轮廓）
    draw.arc([CENTER - r, CENTER - r, CENTER + r, CENTER + r], start=90, end=270, fill=color, width=3)
    # 头部小圆
    draw.ellipse([CENTER - r // 2 - 15, CENTER - 15, CENTER - r // 2 + 15, CENTER + 15], outline=color, width=2)
    draw.ellipse([CENTER + r // 2 - 15, CENTER - 15, CENTER + r // 2 + 15, CENTER + 15], outline=color, width=2)
    draw.ellipse([CENTER - r // 2 - 5, CENTER - 5, CENTER - r // 2 + 5, CENTER + 5], fill=color2)
    draw.ellipse([CENTER + r // 2 - 5, CENTER - 5, CENTER + r // 2 + 5, CENTER + 5], fill=color)
    
    # 八卦外圈
    r2 = 130
    draw.ellipse([CENTER - r2, CENTER - r2, CENTER + r2, CENTER + r2], outline=color, width=2)
    draw.ellipse([CENTER - r2 - 10, CENTER - r2 - 10, CENTER + r2 + 10, CENTER + r2 + 10], outline=color, width=1)
    
    # 八卦符号
    for i in range(8):
        angle = math.radians(45 * i - 90)
        bx = CENTER + (r2 - 25) * math.cos(angle)
        by = CENTER + (r2 - 25) * math.sin(angle)
        # 三爻
        bar_w = 12
        bar_h = 3
        for j in range(3):
            yoff = (j - 1) * 7
            if (i + j) % 2 == 0:
                draw.line([(bx - bar_w, by + yoff), (bx + bar_w, by + yoff)], fill=color, width=2)
            else:
                draw.line([(bx - bar_w, by + yoff), (bx - 3, by + yoff)], fill=color, width=2)
                draw.line([(bx + 3, by + yoff), (bx + bar_w, by + yoff)], fill=color, width=2)
    
    return img

# ============ 纹样20: 雷纹方胜 (靛蓝) ============
def pattern_thunder_fangsheng():
    img = create_canvas()
    draw = ImageDraw.Draw(img)
    color = BLUE_DEEP
    color2 = BLUE_INDIGO
    
    # 方胜纹 - 两个菱形交叠
    size = 120
    diamond1 = [(CENTER, CENTER - size), (CENTER + size * 0.8, CENTER),
                (CENTER, CENTER + size), (CENTER - size * 0.8, CENTER)]
    diamond2 = [(CENTER - size * 0.4, CENTER - size * 0.6), (CENTER + size * 0.4, CENTER - size * 0.6),
                (CENTER + size * 0.4, CENTER + size * 0.6), (CENTER - size * 0.4, CENTER + size * 0.6)]
    
    draw.polygon(diamond1, outline=color, width=3)
    draw.polygon(diamond2, outline=color, width=3)
    
    # 内部雷纹（之字形）
    def draw_thunder(draw, x, y, size, color):
        pts = [(x - size, y - size), (x, y - size), (x, y), (x + size, y), (x + size, y + size)]
        for i in range(len(pts) - 1):
            draw.line([pts[i], pts[i + 1]], fill=color, width=2)
    
    # 四角雷纹
    for dx, dy in [(-1, -1), (1, -1), (1, 1), (-1, 1)]:
        cx = CENTER + dx * size * 0.5
        cy = CENTER + dy * size * 0.5
        draw_thunder(draw, cx, cy, 20, color2)
    
    # 中心雷纹
    draw_thunder(draw, CENTER, CENTER, 30, color)
    
    # 外围装饰圈
    draw.ellipse([CENTER - 180, CENTER - 180, CENTER + 180, CENTER + 180], outline=color, width=1)
    draw.ellipse([CENTER - 170, CENTER - 170, CENTER + 170, CENTER + 170], outline=color2, width=1)
    
    # 四角星芒
    for angle in [45, 135, 225, 315]:
        rad = math.radians(angle)
        for r in [150, 165]:
            x = CENTER + r * math.cos(rad)
            y = CENTER + r * math.sin(rad)
            draw.ellipse([x - 4, y - 4, x + 4, y + 4], fill=color)
    
    return img

# ============ 主执行 ============

PATTERNS = [
    ("01_bagua_array", pattern_bagua_array, "墨色-八卦符号阵"),
    ("02_tortoise_shell", pattern_tortoise_shell, "墨色-龟背几何"),
    ("03_cloud_spiral", pattern_cloud_spiral, "墨色-云雷螺旋"),
    ("04_wanzi", pattern_wanzi, "墨色-万字连绵"),
    ("05_huiwen_border", pattern_huiwen_border, "墨色-回纹边框"),
    ("06_dragon_scale", pattern_dragon_scale, "墨色-龙鳞矩阵"),
    ("07_lotus_scroll", pattern_lotus_scroll, "暗红-缠枝莲花"),
    ("08_flame_radiate", pattern_flame_radiate, "暗红-火焰放射"),
    ("09_ruyi_cloud", pattern_ruyi_cloud, "暗红-如意云头"),
    ("10_panchang_knot", pattern_panchang_knot, "暗红-盘长结"),
    ("11_diamond_chain", pattern_diamond_chain, "暗红-菱格连环"),
    ("12_star_constellation", pattern_star_constellation, "暗红-星宿连线"),
    ("13_scroll_wave", pattern_scroll_wave, "暗红-卷草波浪"),
    ("14_water_ripple", pattern_water_ripple, "靛蓝-水波涟漪"),
    ("15_mountain", pattern_mountain, "靛蓝-山峦叠嶂"),
    ("16_bead_chain", pattern_bead_chain, "靛蓝-联珠璎珞"),
    ("17_cash_coin", pattern_cash_coin, "靛蓝-铜钱连环"),
    ("18_auspicious_cloud", pattern_auspicious_cloud, "靛蓝-祥云如意"),
    ("19_taiji_bagua", pattern_taiji_bagua, "靛蓝-太极八卦"),
    ("20_thunder_fangsheng", pattern_thunder_fangsheng, "靛蓝-雷纹方胜"),
]

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("=" * 50)
    print("MysticDAO 东方纹样素材生成")
    print("=" * 50)
    
    generated = []
    failed = []
    
    for filename, func, desc in PATTERNS:
        try:
            img = func()
            filepath = os.path.join(OUTPUT_DIR, f"{filename}.png")
            img.save(filepath, "PNG")
            size_kb = os.path.getsize(filepath) / 1024
            generated.append((filename, desc, size_kb))
            print(f"✓ {filename}.png | {desc} | {size_kb:.1f}KB")
        except Exception as e:
            failed.append((filename, str(e)))
            print(f"✗ {filename}.png | 错误: {e}")
    
    print("=" * 50)
    print(f"生成完成: {len(generated)}/{len(PATTERNS)} 张")
    if failed:
        print(f"失败: {len(failed)} 张")
        for f, e in failed:
            print(f"  - {f}: {e}")
    
    # 验证文件
    print("\n文件验证:")
    for filename, _, _ in PATTERNS:
        filepath = os.path.join(OUTPUT_DIR, f"{filename}.png")
        if os.path.exists(filepath):
            sz = os.path.getsize(filepath)
            print(f"  ✓ {filename}.png ({sz} bytes)")
        else:
            print(f"  ✗ {filename}.png 不存在")
    
    return len(generated), len(failed)

if __name__ == "__main__":
    main()
