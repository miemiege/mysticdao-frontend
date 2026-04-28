# 素材精炼工厂

你当筛选器，我当精炼工厂。你把素材放本地，我给路径，我跑流水线自动提纯。

---

## 你只需要做一件事

把筛选好的原始素材放到一个本地目录，按以下结构组织：

```
你的素材目录/
├── calligraphy/        ← 书法字（单字/双字/多字都可以）
│   ├── 和.jpg
│   ├── 福.png
│   └── ...
├── seals/              ← 印章（方形/圆形/异形/压角）
│   ├── seal_01.png
│   └── ...
├── textures/           ← 宣纸/木纹/石纹等底纹素材
│   ├── paper_01.jpg
│   └── ...
├── patterns/           ← 云纹/火纹/回纹/边框等装饰纹样
│   ├── cloud.png
│   └── ...
├── references/         ← 古代书法绘画真迹（供参考/背景）
│   ├── 王羲之.jpg
│   └── ...
└── fonts/              ← 字体文件（TTF/OTF，直接复制）
    ├── MaShanZheng.ttf
    └── ...
```

**命名随意**，我按目录分类，不按文件名。

---

## 然后告诉我

把素材目录的**绝对路径**发给我，比如：

```
D:\Projects\mysticdao-frontend\raw_assets
```

或者

```
/mnt/c/Users/咩咩哥/Desktop/我的素材
```

---

## 我会自动执行以下流程

| 步骤 | 我做的 | 产出 |
|------|--------|------|
| **质量评分** | 清晰度/对比度/居中度/边缘晕染/色彩偏差 自动打分 | 每张图一个 `overall` 分数 + `KEEP/REVIEW/DROP` 判定 |
| **去重** | pHash 感知哈希，相似图自动标记为 DUPLICATE | 不重复占用空间 |
| **书法字提纯** | 暖黄宣纸底色统一 → 笔锋锐化 → 去噪 → 标准化 400×640 | 可直接作为字卡背景 |
| **印章提纯** | AI 抠图去白底 → 统一朱砂红 → 标准化 256×256 透明PNG | 可直接贴到 SVG 符咒上 |
| **纹理提纯** | 暖色调校正 → 轻微模糊去文字 → 生成无缝平铺版 512×512 | 符咒底纹直接引用 |
| **纹样提纯** | AI 抠图 → 标准化 400×400 透明PNG | 装饰层直接引用 |
| **真迹提纯** | 暖黄调色 → 降噪 → 居中裁剪 800×1200 → 筛除器物/织物照片 | 参考图/背景素材 |
| **自动标签** | 按视觉特征打标签（楷书/行书/草书/浓墨/飞白等） | 索引 JSON 可检索 |
| **索引输出** | 生成 `refined_index.json`，含路径/分数/标签/尺寸 | TalismanPoster 直接读取 |

---

## 质量标准（你不需要记，供参考）

```
overall >= 0.8   → KEEP（直接入库）
0.5 ~ 0.8        → REVIEW（我标记出来，你决定）
< 0.5            → DROP（自动淘汰）
```

具体维度：
- **书法字**：清晰度 > 80，文字对比度 > 0.35，居中度 > 0.7，边缘晕染 < 20%
- **印章**：红色均匀度 > 0.5，AI 抠图成功率
- **纹理**：不能太锐（避免混入带文字的图片）
- **真迹**：分辨率 > 800×600，筛除高饱和器物照片

---

## 输出目录结构

```
public/talisman-assets/refined-library/
├── calligraphy/
│   ├── calligraphy_0001.jpg
│   └── ...
├── seal/
│   ├── seal_0001.png        ← 透明背景
│   └── ...
├── texture/
│   ├── texture_0001.jpg
│   └── ...
├── pattern/
│   ├── pattern_0001.png     ← 透明背景
│   └── ...
├── reference/
│   ├── reference_0001.jpg
│   └── ...
├── fonts/                    ← 直接复制
└── refined_index.json        ← 完整索引
```

---

## 你可以随时干预

1. **review 列表**：流水线跑完后，我会列出所有 `REVIEW` 状态的图，你逐张决定 KEEP 或 DROP
2. **标签修正**：自动标签可能有误，你可以批量修正
3. **重新处理**：修改配置阈值后，可以只重跑某个分类
4. **补素材**：随时往输入目录加新图，增量处理

---

## 当前已安装的工具

- `rembg` — AI 一键抠图（印章去白底、纹样去背景）
- `OpenCV` — 高级图像处理（锐化、去噪、颜色空间转换）
- `scikit-image` — 质量评估（清晰度、对比度、色差）
- `PIL` — 尺寸调整、格式转换

**还缺的（可选）**：
- Stable Diffusion API — 用于生成缺失的云纹/火纹/边框纹样
- 实拍纹理源 — Unsplash/Pexels 宣纸/水墨实拍（免费商用）

---

## 使用示例

```bash
# 你放好素材后，我执行：
python scripts/asset_refinery/refine.py --input /path/to/your/raw_assets

# 或者只评分不处理（dry run）：
python scripts/asset_refinery/refine.py --input /path/to/your/raw_assets --dry-run

# 调整并行进程数：
python scripts/asset_refinery/refine.py --input /path/to/your/raw_assets --workers 8
```

---

**一句话：你把素材丢进文件夹，把路径给我，剩下的我来。**
