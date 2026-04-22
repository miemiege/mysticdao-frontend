# MysticDao 3.0 — 精简需求

## 项目
React 19 + Vite + Tailwind CSS + TypeScript + HashRouter + shadcn/ui + framer-motion

## 现有页面（4个）
| 页面 | 路径 | 现有内容 |
|------|------|---------|
| 首页 | / | 品牌展示 + 功能入口卡片 |
| 八字 | /#/bazi | 表单→四柱→五行→日主性格→大运→AI解读 |
| 风水 | /#/fengshui | 罗盘→方向面板→八卦图→房间建议 |
| 每日一卦 | /#/daily | 抽取→卦象/分数/幸运信息→AI解读 |
| 定价 | /#/pricing | 月付/年付切换 |

## 约束
1. HashRouter，路由格式 `/#/path`
2. 暗黑主题：bg `#000000`，文字白色/金色 `#c8a45c`
3. 本地模式：无 API Key 时后端返回 mock 中文解读
4. 不要改后端 7 个稳定 API
5. 保留 localStorage 状态持久化

## 后端 API
```
POST /api/interpret
Body: { type: "bazi"|"daily"|"fengshui", data: {...} }
Resp: { text: "中文解读", status: "success" }
```

## Tailwind 设计系统
```
bg-primary: #000000
bg-card: #0A0A0A
bg-elevated: #111111
text-primary: #FFFFFF
text-secondary: #888888
text-muted: #555555
border-subtle: rgba(255,255,255,0.08)
border-hover: rgba(255,255,255,0.2)
element-wood: #4ADE80, fire: #F87171, earth: #FBBF24, metal: #E5E7EB, water: #60A5FA
font: Noto Sans SC / JetBrains Mono
radius: pill (9999px)
动画: spin-slow (3s), glow-pulse (2s), fade-up, shimmer
```

## 现有丰富数据（直接用）
- **八字** (src/components/bazi/data.ts)：10天干释义、12地支释义、5元素性格特征(各6条)、60甲子纳音、藏干表、大运mock数据
- **八字计算** (src/components/bazi/calendar.ts)：calculateFourPillars() 自动排盘
- **风水** (src/components/fengshui/fengshuiData.ts)：8方位详细信息、5房间类型、40条交叉建议
- **每日一卦**：8个卦象（乾为天/坤为地/水雷屯/山水蒙/水天需/天水讼/地水师/水地比）

## 现有组件（直接用）
- TypewriterText — 打字机效果
- TaijiLoader / BaguaLoader — 太极/八卦加载动画
- BirthForm / FourPillars / PillarColumn / ReadingResult — 八字
- Compass / DirectionPanel / BaguaMap — 风水
- FortuneCard / ScoreRing / LuckyInfo — 每日一卦
- shadcn/ui 40+ 组件

## 路由
```tsx
<Route path="/" element={<Home />} />
<Route path="/bazi" element={<Bazi />} />
<Route path="/fengshui" element={<FengShui />} />
<Route path="/pricing" element={<Pricing />} />
<Route path="/daily" element={<Daily />} />
```

## AGENT BETA 任务

### 1. 首页 redesign
- Hero：大气品牌标语 + 动态背景（粒子/光效）
- 功能预览：八字/风水/每日一卦 卡片式介绍（hover 发光边框）
- 品牌故事：1-2 段文字 + 装饰元素
- 数据展示：mock 用户数/好评率等
- CTA：引导到八字/定价

### 2. 八字页面 redesign
- 表单：更精美的日期选择器 + 时辰可视化选择（12时辰圆盘）
- 四柱展示：动画入场 + 金色边框 + 日柱高亮 + 天干地支 tooltip
- 五行：可视化（雷达图或环形图，可用 recharts）
- 日主性格：卡片式展示，配图标，6条特征逐条动画
- 大运：时间线设计，节点带颜色，hover 展开详情
- AI 解读：打字机效果 + 复制按钮 + 分享功能

### 3. 风水页面 redesign
- Hero：罗盘 SVG 背景缓慢旋转 + 标题
- 罗盘：8 方位可点击，hover 高亮，点击后平滑展开面板
- 方向面板：信息卡片化（卦名/五行/幸运色/数字/建议）
- 八卦图：3x3 网格，每个格子有图标+名称+hover效果
- 房间建议：可切换房间类型，显示对应 8 方位建议列表

### 4. 每日一卦 redesign
- 抽取：八卦旋转动画 → 签筒摇晃 → 卦象揭晓
- 卦象展示：大号卦名 + 关键词 + 颜色标识
- 分数：环形进度条（ScoreRing 已有）+ 各维度小条形图
- 幸运信息：卡片式（颜色块/数字/方向）
- AI 解读：打字机效果

### 5. 定价页面 redesign
- 切换：月付/年付 pill 切换按钮
- 卡片：3 列定价卡，中间推荐款高亮
- 功能列表：勾选图标 + 文字
- CTA：醒目按钮

## 设计风格
参考 moonshot.cn：纯黑背景、大量留白、圆角 pill 按钮、hover 背景反转、卡片深灰底色 rgba(255,255,255,0.04)、金色点缀 #c8a45c。

## 代码位置
前端：`/mnt/c/Users/咩咩哥/cycle_trading_system_v2/mysticdao-frontend/src/`
后端：`/home/miemiege/mysticdao/src/`

如有问题请联系 Kimi。
