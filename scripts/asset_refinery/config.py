"""
素材精炼工厂 — 全局配置与质量标准

用户把原始素材放到指定目录后，流水线自动：
1. 质量评分  2. 自动分类  3. 提纯处理  4. 输出可用库 + 索引JSON
"""

import os

# =============================================================================
# 输入/输出路径（用户放素材的目录，启动时通过命令行参数覆盖）
# =============================================================================
DEFAULT_INPUT_DIR = "raw_assets"          # 用户放原始素材的地方
DEFAULT_OUTPUT_DIR = "public/talisman-assets/refined-library"
INDEX_JSON = "refined_index.json"

# =============================================================================
# 质量标准阈值（0.0 ~ 1.0）
# =============================================================================
QUALITY_THRESHOLDS = {
    # 全局
    "min_resolution": (400, 640),         # 最小宽高（像素）
    "min_sharpness": 80.0,                # 拉普拉斯方差（清晰度）
    "min_contrast": 0.25,                 #  Michelson contrast
    "max_color_deviation": 35.0,          # 与目标暖黄宣纸色的LAB色差

    # 分类专用
    "calligraphy": {
        "min_text_contrast": 0.35,        # 墨字 vs 底纸对比度
        "min_centeredness": 0.7,          # 文字居中程度
        "max_edge_bleed": 0.2,            # 边缘晕染占比
    },
    "seal": {
        "target_red_lab": (45, 55, 35),   # 朱砂红目标LAB值
        "max_red_deviation": 25.0,        # 红色偏差
        "min_opacity_uniformity": 0.6,    # 透明度均匀性
    },
    "texture": {
        "max_sharpness": 300.0,           # 纹理不能太锐（避免带文字）
        "seamless_tile_size": 256,        # 无缝平铺块大小
    },
    "reference": {
        "min_resolution": (800, 600),     # 参考图需要更高分辨率
        "min_sharpness": 50.0,
    },
}

# =============================================================================
# 输出尺寸规范（符咒海报直接引用）
# =============================================================================
OUTPUT_SPECS = {
    "calligraphy": {"width": 400, "height": 640, "format": "jpg", "quality": 95},
    "seal": {"width": 256, "height": 256, "format": "png", "transparent": True},
    "texture": {"width": 512, "height": 512, "format": "jpg", "quality": 95, "seamless": True},
    "pattern": {"width": 400, "height": 400, "format": "png", "transparent": True},
    "reference": {"width": 800, "height": 1200, "format": "jpg", "quality": 95},
}

# =============================================================================
# 颜色标准（符咒视觉系统）
# =============================================================================
COLOR_STANDARDS = {
    "xuan_paper_rgb": (249, 244, 237),    # 暖黄宣纸底色
    "cinnabar_rgb": (196, 30, 30),        # 朱砂红 #c41e1e
    "ink_rgb": (30, 30, 30),              # 浓墨色
    "dry_ink_rgb": (60, 60, 60),          # 飞白色
}

# =============================================================================
# 自动标签词库
# =============================================================================
TAG_VOCABULARY = {
    "style": ["楷书", "行书", "草书", "隶书", "篆书", "瘦金体", "魏碑"],
    "dynasty": ["先秦", "汉", "魏晋", "唐", "宋", "元", "明", "清", "近现代"],
    "mood": ["雄浑", "飘逸", "端庄", "狂放", "清雅", "古朴", "刚劲", "柔和"],
    "ink_state": ["浓墨", "淡墨", "飞白", "枯笔", "湿笔", "晕染"],
    "seal_type": ["方形", "圆形", "椭圆形", "异形", "压角", "引首", "腰章"],
    "pattern_type": ["云纹", "雷纹", "回纹", "万字纹", "火纹", "水纹", "龙纹"],
}

# =============================================================================
# 流水线开关
# =============================================================================
PIPELINE_STAGES = {
    "quality_score": True,
    "deduplicate": True,
    "bg_remove_seal": True,       # 印章AI抠图
    "color_correct": True,        # 颜色校正
    "sharpen_calligraphy": True,  # 书法锐化笔锋
    "generate_seamless": True,    # 纹理生成无缝版
    "auto_tag": True,             # 自动打标签
    "build_index": True,          # 输出索引JSON
}

# =============================================================================
# 分类目录映射（输入子目录 → 处理类型）
# =============================================================================
CATEGORY_MAP = {
    "calligraphy": "calligraphy",      # 书法字
    "seals": "seal",                   # 印章
    "textures": "texture",             # 纹理底纹
    "patterns": "pattern",             # 装饰纹样
    "references": "reference",         # 古代真迹参考
    "fonts": "font",                   # 字体文件（仅复制）
}

def resolve_paths(input_dir: str = None, output_dir: str = None):
    """解析输入输出路径，支持相对/绝对路径"""
    # config.py is at scripts/asset_refinery/config.py, go up 3 levels to project root
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    inp = input_dir or os.path.join(root, DEFAULT_INPUT_DIR)
    out = output_dir or os.path.join(root, DEFAULT_OUTPUT_DIR)
    return os.path.abspath(inp), os.path.abspath(out)
