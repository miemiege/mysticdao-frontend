#!/usr/bin/env python3
"""朱砂印章素材生成器 - MysticDAO项目"""

import os
import random
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

OUTPUT_DIR = "/mnt/c/Users/咩咩哥/mysticdao-frontend/raw_assets/seals/agent_batch_1/"
SEAL_RED = (180, 40, 30)
SEAL_SIZE = 512
BG_COLOR = (0, 0, 0, 0)

# 文字分配
SEAL_TEXTS = {
    "circle": ["玄道", "灵符", "天机", "阴阳", "五行"],
    "square": ["乾坤", "太极", "修真", "悟道", "长生"],
    "ellipse": ["道法", "自然", "无为", "清净", "逍遥"],
    "irregular": ["仙缘", "真道", "玄门", "金丹", "紫气"],
}

def get_font(size):
    """获取可用的中文字体"""
    font_paths = [
        "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
        "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf",
        "/usr/share/fonts/truetype/arphic/uming.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except:
                continue
    return ImageFont.load_default()

def add_cinnabar_texture(img, intensity=0.3):
    """添加朱砂印泥质感 - 噪声和网点"""
    arr = np.array(img)
    h, w, _ = arr.shape
    
    # 生成噪声
    noise = np.random.normal(0, 30, (h, w, 4))
    
    # 创建网点纹理
    dot_scale = random.choice([4, 6, 8])
    dots = np.zeros((h, w))
    for y in range(0, h, dot_scale):
        for x in range(0, w, dot_scale):
            if random.random() < 0.7:
                val = random.uniform(0.5, 1.0)
                dots[y:y+dot_scale, x:x+dot_scale] = val
    
    # 将网点应用到alpha通道
    for y in range(h):
        for x in range(w):
            if arr[y, x, 3] > 0:
                # 基础噪声
                for c in range(3):
                    arr[y, x, c] = np.clip(arr[y, x, c] + noise[y, x, c] * intensity, 0, 255)
                # 网点影响alpha
                dot_factor = dots[y, x]
                if dot_factor < 0.8:
                    arr[y, x, 3] = int(arr[y, x, 3] * (0.7 + 0.3 * dot_factor))
    
    return Image.fromarray(arr.astype(np.uint8))

def add_edge_bleed(img, shape_type):
    """添加边缘晕染效果"""
    arr = np.array(img)
    h, w, _ = arr.shape
    
    # 根据距离中心的远近，随机降低alpha
    cx, cy = w // 2, h // 2
    max_dist = math.sqrt(cx**2 + cy**2)
    
    for y in range(h):
        for x in range(w):
            if arr[y, x, 3] > 0:
                dist = math.sqrt((x - cx)**2 + (y - cy)**2)
                dist_ratio = dist / max_dist
                
                # 边缘晕染：越远越容易变淡
                if dist_ratio > 0.5:
                    edge_prob = (dist_ratio - 0.5) * 2  # 0 to 1
                    if random.random() < edge_prob * 0.4:
                        fade = random.uniform(0.3, 0.9)
                        arr[y, x, 3] = int(arr[y, x, 3] * fade)
                        # 稍微变暗
                        for c in range(3):
                            arr[y, x, c] = int(arr[y, x, c] * (0.8 + 0.2 * fade))
    
    return Image.fromarray(arr.astype(np.uint8))

def create_circle_seal(text, idx):
    """生成圆形印章"""
    img = Image.new("RGBA", (SEAL_SIZE, SEAL_SIZE), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    cx, cy = SEAL_SIZE // 2, SEAL_SIZE // 2
    radius = random.randint(180, 220)
    
    # 外圆
    edge_width = random.randint(6, 12)
    for r_offset in range(edge_width):
        r = radius - r_offset
        alpha = int(255 * (1 - r_offset / edge_width * 0.3))
        color = (*SEAL_RED, alpha)
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=color, width=2)
    
    # 内圆
    inner_r = radius - random.randint(25, 40)
    draw.ellipse([cx-inner_r, cy-inner_r, cx+inner_r, cy+inner_r], 
                 outline=(*SEAL_RED, 220), width=random.randint(2, 4))
    
    # 文字
    font_size = random.randint(60, 90)
    font = get_font(font_size)
    
    # 圆形排列文字
    chars = list(text)
    angle_step = 360 / len(chars) if len(chars) > 1 else 360
    text_radius = radius - random.randint(50, 80)
    
    for i, ch in enumerate(chars):
        angle = math.radians(-90 + i * angle_step)
        tx = cx + text_radius * math.cos(angle)
        ty = cy + text_radius * math.sin(angle)
        
        # 计算文字尺寸
        bbox = draw.textbbox((0, 0), ch, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        
        # 创建文字图层
        txt_img = Image.new("RGBA", (tw + 20, th + 20), (0, 0, 0, 0))
        txt_draw = ImageDraw.Draw(txt_img)
        txt_draw.text((10, 10), ch, font=font, fill=(*SEAL_RED, 240))
        
        # 旋转
        rotation = math.degrees(angle) + 90
        txt_img = txt_img.rotate(rotation, expand=True, resample=Image.BICUBIC)
        
        # 粘贴
        tw2, th2 = txt_img.size
        px = int(tx - tw2 / 2)
        py = int(ty - th2 / 2)
        img.paste(txt_img, (px, py), txt_img)
    
    # 中心装饰
    center_deco = random.choice(["dot", "star", "none"])
    if center_deco == "dot":
        dot_r = random.randint(8, 15)
        draw.ellipse([cx-dot_r, cy-dot_r, cx+dot_r, cy+dot_r], fill=(*SEAL_RED, 200))
    elif center_deco == "star":
        # 画星形
        for i in range(8):
            a = math.radians(i * 45)
            r1 = random.randint(15, 25)
            r2 = random.randint(5, 10)
            x1 = cx + r1 * math.cos(a)
            y1 = cy + r1 * math.sin(a)
            x2 = cx + r2 * math.cos(a + math.radians(22.5))
            y2 = cy + r2 * math.sin(a + math.radians(22.5))
            draw.line([(x1, y1), (x2, y2)], fill=(*SEAL_RED, 180), width=2)
    
    # 填充圆内区域以增加红色占比
    fill_r = inner_r - random.randint(10, 20)
    for _ in range(random.randint(50, 150)):
        a = random.uniform(0, 2 * math.pi)
        r = random.uniform(0, fill_r)
        fx = cx + r * math.cos(a)
        fy = cy + r * math.sin(a)
        size = random.randint(2, 8)
        alpha = random.randint(30, 100)
        draw.ellipse([fx-size, fy-size, fx+size, fy+size], fill=(*SEAL_RED, alpha))
    
    img = add_cinnabar_texture(img)
    img = add_edge_bleed(img, "circle")
    return img

def create_square_seal(text, idx):
    """生成方形印章"""
    img = Image.new("RGBA", (SEAL_SIZE, SEAL_SIZE), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    margin = random.randint(60, 100)
    x1, y1 = margin, margin
    x2, y2 = SEAL_SIZE - margin, SEAL_SIZE - margin
    
    # 边框
    edge_width = random.randint(8, 15)
    for i in range(edge_width):
        alpha = int(255 * (1 - i / edge_width * 0.3))
        color = (*SEAL_RED, alpha)
        draw.rectangle([x1+i, y1+i, x2-i, y2-i], outline=color, width=1)
    
    # 内部横线或竖线分隔
    if random.random() < 0.5:
        # 横向分隔
        sep_y = (y1 + y2) // 2
        draw.line([(x1+20, sep_y), (x2-20, sep_y)], fill=(*SEAL_RED, 200), width=3)
    else:
        # 竖向分隔
        sep_x = (x1 + x2) // 2
        draw.line([(sep_x, y1+20), (sep_x, y2-20)], fill=(*SEAL_RED, 200), width=3)
    
    # 文字
    font_size = random.randint(70, 110)
    font = get_font(font_size)
    chars = list(text)
    
    cx = (x1 + x2) // 2
    if len(chars) == 2:
        # 上下排列
        bbox = draw.textbbox((0, 0), chars[0], font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        
        for i, ch in enumerate(chars):
            txt_img = Image.new("RGBA", (SEAL_SIZE, SEAL_SIZE), (0, 0, 0, 0))
            txt_draw = ImageDraw.Draw(txt_img)
            ty = y1 + 30 + i * ((y2 - y1 - 60) // 2)
            txt_draw.text((cx - tw//2, ty), ch, font=font, fill=(*SEAL_RED, 240))
            img = Image.alpha_composite(img, txt_img)
    elif len(chars) == 4:
        # 四字印章，田字格排列
        positions = [
            ((x1+x2)//2 - 40, (y1+y2)//2 - 60),
            ((x1+x2)//2 + 40, (y1+y2)//2 - 60),
            ((x1+x2)//2 - 40, (y1+y2)//2 + 60),
            ((x1+x2)//2 + 40, (y1+y2)//2 + 60),
        ]
        for i, ch in enumerate(chars):
            txt_img = Image.new("RGBA", (SEAL_SIZE, SEAL_SIZE), (0, 0, 0, 0))
            txt_draw = ImageDraw.Draw(txt_img)
            px, py = positions[i]
            txt_draw.text((px, py), ch, font=font, fill=(*SEAL_RED, 240))
            img = Image.alpha_composite(img, txt_img)
    else:
        # 居中排列
        full_text = "".join(chars)
        bbox = draw.textbbox((0, 0), full_text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        cy = (y1 + y2) // 2
        draw.text((cx - tw//2, cy - th//2), full_text, font=font, fill=(*SEAL_RED, 240))
    
    # 重新创建draw，因为img可能已被alpha_composite替换
    draw = ImageDraw.Draw(img)
    
    # 填充以增加红色占比
    for _ in range(random.randint(80, 200)):
        fx = random.randint(x1+20, x2-20)
        fy = random.randint(y1+20, y2-20)
        size = random.randint(2, 10)
        alpha = random.randint(20, 80)
        draw.ellipse([fx-size, fy-size, fx+size, fy+size], fill=(*SEAL_RED, alpha))
    
    # 角落装饰
    corner_size = random.randint(10, 20)
    for corner in [(x1, y1), (x2, y1), (x1, y2), (x2, y2)]:
        ccx, ccy = corner
        draw.rectangle([ccx-corner_size, ccy-2, ccx+corner_size, ccy+2], fill=(*SEAL_RED, 150))
        draw.rectangle([ccx-2, ccy-corner_size, ccx+2, ccy+corner_size], fill=(*SEAL_RED, 150))
    
    img = add_cinnabar_texture(img)
    img = add_edge_bleed(img, "square")
    return img

def create_ellipse_seal(text, idx):
    """生成椭圆形印章"""
    img = Image.new("RGBA", (SEAL_SIZE, SEAL_SIZE), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    cx, cy = SEAL_SIZE // 2, SEAL_SIZE // 2
    rx = random.randint(180, 230)
    ry = random.randint(120, 160)
    
    # 外椭圆
    edge_width = random.randint(6, 12)
    for i in range(edge_width):
        alpha = int(255 * (1 - i / edge_width * 0.3))
        color = (*SEAL_RED, alpha)
        draw.ellipse([cx-rx+i, cy-ry+i, cx+rx-i, cy+ry-i], outline=color, width=2)
    
    # 内椭圆
    inner_rx = rx - random.randint(20, 35)
    inner_ry = ry - random.randint(15, 25)
    draw.ellipse([cx-inner_rx, cy-inner_ry, cx+inner_rx, cy+inner_ry], 
                 outline=(*SEAL_RED, 220), width=random.randint(2, 4))
    
    # 文字
    font_size = random.randint(50, 80)
    font = get_font(font_size)
    chars = list(text)
    
    # 横向排列
    full_text = "".join(chars)
    bbox = draw.textbbox((0, 0), full_text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    # 在椭圆内居中
    text_y = cy - th // 2 + random.randint(-10, 10)
    
    # 每个字单独画，加入轻微旋转
    x_offset = cx - tw // 2
    for i, ch in enumerate(chars):
        txt_img = Image.new("RGBA", (SEAL_SIZE, SEAL_SIZE), (0, 0, 0, 0))
        txt_draw = ImageDraw.Draw(txt_img)
        cbbox = txt_draw.textbbox((0, 0), ch, font=font)
        cw = cbbox[2] - cbbox[0]
        chh = cbbox[3] - cbbox[1]
        
        angle = random.uniform(-8, 8)
        ch_img = Image.new("RGBA", (cw+20, chh+20), (0, 0, 0, 0))
        ch_draw = ImageDraw.Draw(ch_img)
        ch_draw.text((10, 10), ch, font=font, fill=(*SEAL_RED, 240))
        ch_img = ch_img.rotate(angle, expand=True, resample=Image.BICUBIC)
        
        px = x_offset + sum(draw.textbbox((0,0), c, font=font)[2]-draw.textbbox((0,0), c, font=font)[0] for c in chars[:i])
        img.paste(ch_img, (px, text_y - 10), ch_img)
    
    # 顶部和底部装饰线
    line_width = random.randint(2, 4)
    for y_off in [-inner_ry + 20, inner_ry - 20]:
        y = cy + y_off
        draw.line([(cx - inner_rx + 30, y), (cx + inner_rx - 30, y)], 
                  fill=(*SEAL_RED, 180), width=line_width)
    
    # 填充
    for _ in range(random.randint(60, 180)):
        a = random.uniform(0, 2 * math.pi)
        r = random.uniform(0, min(inner_rx, inner_ry) - 20)
        fx = cx + r * math.cos(a) * (inner_rx / inner_ry)
        fy = cy + r * math.sin(a)
        size = random.randint(2, 8)
        alpha = random.randint(20, 80)
        draw.ellipse([fx-size, fy-size, fx+size, fy+size], fill=(*SEAL_RED, alpha))
    
    img = add_cinnabar_texture(img)
    img = add_edge_bleed(img, "ellipse")
    return img

def create_irregular_seal(text, idx):
    """生成闲章（不规则形状印章）"""
    img = Image.new("RGBA", (SEAL_SIZE, SEAL_SIZE), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    cx, cy = SEAL_SIZE // 2, SEAL_SIZE // 2
    
    # 生成不规则轮廓
    num_points = random.randint(6, 12)
    base_radius = random.randint(150, 200)
    angles = sorted([random.uniform(0, 2 * math.pi) for _ in range(num_points)])
    
    points = []
    for a in angles:
        r = base_radius + random.uniform(-40, 40)
        x = cx + r * math.cos(a)
        y = cy + r * math.sin(a)
        points.append((x, y))
    
    # 闭合轮廓
    points.append(points[0])
    
    # 画粗轮廓
    edge_width = random.randint(8, 18)
    for i in range(edge_width):
        offset = i * 0.8
        offset_points = []
        for j, (x, y) in enumerate(points[:-1]):
            # 向内偏移
            dx = x - cx
            dy = y - cy
            dist = math.sqrt(dx**2 + dy**2)
            if dist > 0:
                nx = x - (dx / dist) * offset
                ny = y - (dy / dist) * offset
                offset_points.append((nx, ny))
        if len(offset_points) > 2:
            offset_points.append(offset_points[0])
            alpha = int(255 * (1 - i / edge_width * 0.4))
            draw.line(offset_points, fill=(*SEAL_RED, alpha), width=random.randint(3, 6), joint="curve")
    
    # 内部填充不规则斑块
    for _ in range(random.randint(5, 12)):
        patch_cx = cx + random.uniform(-80, 80)
        patch_cy = cy + random.uniform(-80, 80)
        patch_r = random.uniform(20, 60)
        patch_points = []
        for j in range(random.randint(5, 8)):
            a = j * 2 * math.pi / 5 + random.uniform(-0.3, 0.3)
            r = patch_r + random.uniform(-10, 10)
            px = patch_cx + r * math.cos(a)
            py = patch_cy + r * math.sin(a)
            patch_points.append((px, py))
        patch_points.append(patch_points[0])
        alpha = random.randint(60, 150)
        draw.polygon(patch_points, fill=(*SEAL_RED, alpha))
    
    # 文字
    font_size = random.randint(60, 100)
    font = get_font(font_size)
    chars = list(text)
    
    if len(chars) == 2:
        # 上下排列
        for i, ch in enumerate(chars):
            txt_img = Image.new("RGBA", (SEAL_SIZE, SEAL_SIZE), (0, 0, 0, 0))
            txt_draw = ImageDraw.Draw(txt_img)
            bbox = txt_draw.textbbox((0, 0), ch, font=font)
            tw = bbox[2] - bbox[0]
            th = bbox[3] - bbox[1]
            ty = cy - th + i * (th + 10) + random.randint(-10, 10)
            angle = random.uniform(-15, 15)
            ch_img = Image.new("RGBA", (tw+20, th+20), (0, 0, 0, 0))
            ch_draw = ImageDraw.Draw(ch_img)
            ch_draw.text((10, 10), ch, font=font, fill=(*SEAL_RED, 240))
            ch_img = ch_img.rotate(angle, expand=True, resample=Image.BICUBIC)
            img.paste(ch_img, (cx - tw//2, int(ty)), ch_img)
    else:
        # 居中
        full_text = "".join(chars)
        txt_img = Image.new("RGBA", (SEAL_SIZE, SEAL_SIZE), (0, 0, 0, 0))
        txt_draw = ImageDraw.Draw(txt_img)
        bbox = txt_draw.textbbox((0, 0), full_text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        angle = random.uniform(-10, 10)
        ch_img = Image.new("RGBA", (tw+20, th+20), (0, 0, 0, 0))
        ch_draw = ImageDraw.Draw(ch_img)
        ch_draw.text((10, 10), full_text, font=font, fill=(*SEAL_RED, 240))
        ch_img = ch_img.rotate(angle, expand=True, resample=Image.BICUBIC)
        img.paste(ch_img, (cx - tw//2, cy - th//2), ch_img)
    
    # 散点填充
    for _ in range(random.randint(100, 300)):
        fx = cx + random.uniform(-120, 120)
        fy = cy + random.uniform(-120, 120)
        size = random.randint(2, 12)
        alpha = random.randint(15, 70)
        draw.ellipse([fx-size, fy-size, fx+size, fy+size], fill=(*SEAL_RED, alpha))
    
    img = add_cinnabar_texture(img)
    img = add_edge_bleed(img, "irregular")
    return img

def generate_all():
    """生成所有印章"""
    generators = {
        "circle": create_circle_seal,
        "square": create_square_seal,
        "ellipse": create_ellipse_seal,
        "irregular": create_irregular_seal,
    }
    
    all_results = []
    seal_idx = 0
    
    for shape, texts in SEAL_TEXTS.items():
        gen_func = generators[shape]
        for i, text in enumerate(texts):
            seal_idx += 1
            filename = f"seal_{shape}_{i+1:02d}_{text}.png"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            # 生成
            img = gen_func(text, i)
            img.save(filepath, "PNG")
            
            all_results.append({
                "filename": filename,
                "filepath": filepath,
                "shape": shape,
                "text": text,
                "index": seal_idx,
            })
            print(f"✓ Generated: {filename}")
    
    return all_results

def quality_check(results):
    """质量检查"""
    passed = 0
    failed = 0
    red_ratios = []
    
    print("\n" + "="*60)
    print("质检报告")
    print("="*60)
    
    for r in results:
        img = Image.open(r["filepath"])
        arr = np.array(img)
        h, w, c = arr.shape
        
        # 检查1: Alpha通道
        has_alpha = c == 4
        alpha = arr[:, :, 3]
        non_transparent = alpha > 0
        non_transparent_count = np.sum(non_transparent)
        
        # 检查2: 红色占比
        if non_transparent_count > 0:
            red_pixels = arr[non_transparent]
            # R > 100, G < 120, B < 120 的像素
            is_red = (red_pixels[:, 0] > 100) & (red_pixels[:, 1] < 120) & (red_pixels[:, 2] < 120)
            red_count = np.sum(is_red)
            red_ratio = red_count / non_transparent_count
            red_ratios.append(red_ratio)
        else:
            red_ratio = 0
            red_ratios.append(red_ratio)
        
        # 判定
        checks = []
        if has_alpha:
            checks.append("✓ Alpha通道")
        else:
            checks.append("✗ Alpha通道缺失")
        
        if red_ratio > 0.3:
            checks.append(f"✓ 红色占比 {red_ratio:.1%}")
        else:
            checks.append(f"✗ 红色占比 {red_ratio:.1%} (需>30%)")
        
        if w >= 512 and h >= 512:
            checks.append(f"✓ 尺寸 {w}x{h}")
        else:
            checks.append(f"✗ 尺寸 {w}x{h}")
        
        is_pass = has_alpha and red_ratio > 0.3 and w >= 512 and h >= 512
        
        status = "PASS" if is_pass else "FAIL"
        print(f"\n{r['filename']} [{status}]")
        for check in checks:
            print(f"  {check}")
        
        if is_pass:
            passed += 1
        else:
            failed += 1
    
    avg_red = sum(red_ratios) / len(red_ratios) if red_ratios else 0
    
    print("\n" + "="*60)
    print(f"总计: {len(results)}张 | 通过: {passed} | 失败: {failed}")
    print(f"平均红色占比: {avg_red:.1%}")
    print("="*60)
    
    return passed, failed, avg_red

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("开始生成朱砂印章素材...")
    print(f"输出目录: {OUTPUT_DIR}")
    print()
    
    results = generate_all()
    passed, failed, avg_red = quality_check(results)
    
    print(f"\n生成完成！通过 {passed}/20 张")
