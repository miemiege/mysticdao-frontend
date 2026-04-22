# MysticDao 3.0 — AGENT BETA 完整需求文档

> 日期: 2026-04-21
> 发送方: Kimi (主 Agent)
> 当前状态: 塔罗/姻缘已删除，保留八字/风水/每日一卦/定价
> 目标: AGENT BETA 在现有代码基础上重新设计 UI 和内容展示

---

## 一、项目信息

| 项目 | 内容 |
|------|------|
| 前端地址 | http://localhost:3003 |
| 前端技术 | React 19 + Vite + Tailwind CSS v3.4 + TypeScript + HashRouter |
| UI 库 | shadcn/ui (40+ 组件在 src/components/ui/) |
| 动画 | framer-motion |
| 图标 | lucide-react |
| 后端 | Express + TypeScript + OpenAI SDK v4 |
| 后端端口 | 3001 |
| AI 模型 | kimi-for-coding (本地模式返回 mock 中文解读) |

---

## 二、现有功能（已删除塔罗/姻缘）

| 页面 | 路径 | 状态 | 说明 |
|------|------|------|------|
| 首页 | / | ✅ 运行中 | 品牌展示 + 功能入口 |
| 八字 | /#/bazi | ✅ 运行中 | 表单→四柱→五行→日主性格→大运→AI解读 |
| 风水 | /#/fengshui | ✅ 运行中 | 罗盘→方向面板→八卦图→房间建议 |
| 每日一卦 | /#/daily | ✅ 运行中 | 抽取运势→分数→幸运信息→AI解读 |
| 定价 | /#/pricing | ✅ 运行中 | 月付/年付切换 |

---

## 三、技术栈约束（不可破坏）

1. **HashRouter**: 所有路由为 `/#/path`，不要用 `<a href="/xxx">`
2. **暗黑主题**: 纯黑 `#000000` 背景 + 白色/金色文字
3. **本地模式**: 无 API Key 时，后端 `/api/interpret` 返回 mock 中文解读
4. **不要改动后端 7 个稳定 API**: `/api/health`, `/api/iching`, `/api/bazi`, `/api/tarot`, `/api/tarot/daily`, `/api/daily-energy`, `/api/love`, `/api/fengshui`
5. **保留现有状态持久化**: localStorage 缓存已保存在 `src/lib/storage.ts`

---

## 四、后端 API 规范

### 4.1 健康检查
```
GET /api/health
Response: { status: "ok", service: "MysticDao v2", model: "kimi-k2.5", mode: "local-only" }
```

### 4.2 AI 解读（核心）
```
POST /api/interpret
Body: { type: "bazi"|"love"|"daily"|"fengshui", data: {...} }
Response: { text: "中文解读内容", status: "success" }
```
本地模式下返回丰富 mock 解读（见 backend/src/api/server.ts 中 generateMockInterpretation 函数）。

### 4.3 其他稳定 API（不要修改）
- POST /api/iching — 易经占卜
- POST /api/bazi — 八字排盘
- POST /api/tarot — 塔罗抽牌
- GET /api/tarot/daily — 每日塔罗
- GET /api/daily-energy — 每日能量
- POST /api/love — 姻缘合婚
- POST /api/fengshui — 风水分析

---

## 五、前端核心代码

### 5.1 API 封装 (src/services/api.ts)

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface AIInterpretRequest {
  type: 'bazi' | 'love' | 'daily' | 'fengshui';
  data: Record<string, unknown>;
}

interface AIInterpretResponse {
  text: string;
  status: 'success' | 'error';
  error?: string;
}

export async function fetchAIInterpretation(
  request: AIInterpretRequest,
  signal?: AbortSignal
): Promise<AIInterpretResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/interpret`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal,
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { text: data.text || '', status: 'success' };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    // Fallback mock for demo
    return { text: generateMockResponse(request), status: 'success' };
  }
}

function generateMockResponse(request: AIInterpretRequest): string {
  switch (request.type) {
    case 'bazi': return '【八字命盘深度解读】...';
    case 'daily': return '【每日运势解读】...';
    default: return 'AI解读服务模拟运行中。';
  }
}
```

### 5.2 状态持久化 (src/lib/storage.ts)

```typescript
const STORAGE_KEY = 'mysticdao_state';
const EXPIRY_HOURS = 24;

interface StorageState {
  bazi?: { formData: Record<string, unknown>; pillars: unknown[] };
  daily?: { lastDrawDate: string; cardId: string; fortune?: unknown; reading?: string };
  timestamp: number;
}

export function getStoredState(): StorageState | null { ... }
export function saveState(partial: Partial<StorageState>): void { ... }
export function getBaziState(): StorageState['bazi'] | null { ... }
export function saveBaziState(bazi: StorageState['bazi']): void { ... }
export function getDailyState(): StorageState['daily'] | null { ... }
export function saveDailyState(daily: StorageState['daily']): void { ... }
```

### 5.3 路由 (src/App.tsx)

```tsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Bazi from './pages/Bazi'
import Pricing from './pages/Pricing'
import Daily from './pages/Daily'
import FengShui from './pages/FengShui'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/bazi" element={<Bazi />} />
        <Route path="/fengshui" element={<FengShui />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/daily" element={<Daily />} />
      </Route>
    </Routes>
  )
}
```

### 5.4 导航栏 (src/components/Navbar.tsx)

```tsx
const navLinks = [
  { label: '八字', to: '/bazi' },
  { label: '风水', to: '/fengshui' },
  { label: '每日一卦', to: '/daily' },
  { label: '定价', to: '/pricing' },
];
```

---

## 六、现有丰富数据

### 6.1 八字数据 (src/components/bazi/data.ts)

已包含：
- `ELEMENT_COLORS` — 五行颜色映射
- `STEM_ELEMENTS` / `BRANCH_ELEMENTS` — 天干地支五行映射
- `HIDDEN_STEMS` — 藏干表
- `NAYIN_LOOKUP` — 纳音五行（60甲子）
- `STEM_MEANINGS` — 天干英文诗意释义（10条）
- `BRANCH_MEANINGS` — 地支英文诗意释义（12条）
- `DAY_MASTER_TRAITS` — 日主性格特征（5元素×6条）
- `DAY_MASTER_TITLES` — 日主标题+标语
- `ELEMENT_DESCRIPTIONS` — 五行通用描述
- `MOCK_FORTUNE_PERIODS` — 大运流年 mock 数据
- `TIME_PERIODS` — 12时辰区间

### 6.2 八字计算 (src/components/bazi/calendar.ts)

```typescript
export interface PillarData { stem: string; branch: string; element: Element; hiddenStems: string[]; }
export interface FourPillarsData { year: PillarData; month: PillarData; day: PillarData; hour: PillarData; }
export function calculateFourPillars(year, month, day, hour): FourPillarsData
export function countElementDistribution(pillars): Record<Element, number>
```

### 6.3 风水数据 (src/components/fengshui/fengshuiData.ts)

已包含：
- `directionData` — 8 方位详细信息（卦名、五行、幸运色、幸运数字、建议）
- `directions` — 8 方向角度映射
- `roomTypes` — 5 种房间类型
- `roomAdvice` — 5×8 = 40 条房间×方位交叉建议
- `elementIcons` — 元素 emoji

### 6.4 每日一卦数据 (src/pages/Daily.tsx)

内置 8 个卦象：乾为天、坤为地、水雷屯、山水蒙、水天需、天水讼、地水师、水地比
每个卦象包含：名称、关键词、方位、颜色

---

## 七、现有组件清单

### 7.1 通用组件
- `TypewriterText.tsx` — 打字机效果逐字显示
- `TaijiLoader.tsx` — 太极旋转 SVG 加载动画
- `BaguaLoader.tsx` — 八卦旋转 SVG 加载动画
- `Layout.tsx` — 页面布局（Navbar + Footer + 内容区）
- `Navbar.tsx` — 顶部导航
- `Footer.tsx` — 底部页脚

### 7.2 八字组件
- `BirthForm.tsx` — 出生信息表单（姓名、性别、年月日时）
- `FourPillars.tsx` — 四柱展示（年柱/月柱/日柱/时柱）
- `PillarColumn.tsx` — 单个柱子（天干+地支+藏干+hover tooltip）
- `ReadingResult.tsx` — AI 解读结果展示（加载动画+打字机+复制）

### 7.3 风水组件
- `Compass.tsx` — 罗盘（8 方位可点击）
- `DirectionPanel.tsx` — 方向详情面板（五行/幸运色/数字/建议）
- `BaguaMap.tsx` — 八卦图（8 个生活领域网格）
- `SacredIcons.tsx` — 八卦/罗盘 SVG 图标

### 7.4 每日一卦组件
- `FortuneCard.tsx` — 运势卡片
- `ScoreRing.tsx` — 分数环形图
- `LuckyInfo.tsx` — 幸运信息（颜色/数字/方向）

### 7.5 shadcn/ui 组件（40+）
accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb,
button-group, button, calendar, card, carousel, chart, checkbox, collapsible,
command, context-menu, dialog, drawer, dropdown-menu, empty, field, form,
hover-card, input-group, input-otp, input, item, kbd, label, menubar,
navigation-menu, pagination, popover, progress, radio-group, resizable,
scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner,
spinner, switch, table, tabs, textarea, toggle-group, toggle, tooltip

---

## 八、现有页面结构

### 8.1 八字页面 (pages/Bazi.tsx)

3 步流程：
1. **Step 1 表单** — BirthForm 收集姓名/性别/年月日时
2. **Step 2 展示** — FourPillars 展示四柱 + 五行条形图 + **日主性格卡片** + **五行解析** + **大运流年时间线**
3. **Step 3 解读** — ReadingResult 显示 AI 解读（打字机效果）

### 8.2 风水页面 (pages/FengShui.tsx)

4 个 Section：
1. **Hero** — 标题 + 今日能量指引 + CTA
2. **罗盘** — Compass 组件 + DirectionPanel（点击方向后展开）
3. **八卦图** — BaguaMap 网格 + 方向图例
4. **CTA** — 定价/八字入口

### 8.3 每日一卦 (pages/Daily.tsx)

4 个步骤：idle → drawing → loading → result
- 抽取卦象（本地随机）
- 显示卦象/分数/幸运信息
- AI 解读（打字机效果）

---

## 九、AGENT BETA 3.0 设计任务

### 9.1 整体要求

- **保留现有暗黑主题**（纯黑背景 + 白色/金色文字）
- **保留现有架构**（HashRouter、状态持久化、API 封装）
- **保留现有动画系统**（打字机、太极/八卦加载器、framer-motion）
- **重新设计 UI 和内容展示**，让页面更丰富、更有质感

### 9.2 首页 (Home)

当前问题：内容单薄，只有功能卡片列表

要求：
- 大气的 Hero 区域（品牌标语 + 动态背景效果）
- 功能预览区（八字/风水/每日一卦的卡片式介绍）
- 品牌故事/理念介绍
- 用户评价/数据展示（可 mock）
- CTA 引导

### 9.3 八字页面 (Bazi)

当前已有：表单 → 四柱 → 五行条 → 日主性格 → 大运 → AI 解读

要求：
- 表单设计更精美（日期选择器、时辰选择更直观）
- 四柱展示更有仪式感（动画、颜色、布局）
- 五行分析可视化（雷达图/饼图/更丰富的条形图）
- 日主性格展示更生动（卡片、图标、排版）
- 大运流年时间线更有设计感
- AI 解读区域更突出

### 9.4 风水页面 (FengShui)

当前已有：Hero → 罗盘 → 方向面板 → 八卦图 → CTA

要求：
- 罗盘设计更精美（可旋转、更有质感）
- 方向面板信息展示更结构化
- 八卦图网格更有设计感
- 房间×方位建议矩阵展示更清晰
- 整体动画更流畅

### 9.5 每日一卦 (Daily)

当前已有：抽取 → 卦象/分数/幸运信息 → AI 解读

要求：
- 抽取动画更有仪式感（八卦旋转、签筒摇晃等）
- 卦象展示更精美（卦象 SVG/图形、爻辞展示）
- 分数展示更可视化（环形图、进度条）
- 幸运信息展示更有趣

### 9.6 定价页面 (Pricing)

当前已有：月付/年付切换

要求：
- 定价卡片设计更精美
- 功能对比列表更清晰
- CTA 按钮更突出

---

## 十、设计风格参考

参考网站：**Moonshot.cn**

特征：
- 纯黑背景 #000000
- 白色标题 + 灰色正文
- 圆角 pill 形状按钮
- hover 时背景反转（白变黑，黑变白）
- 大量留白，section 间距 120-160px
- 卡片深灰底色 rgba(255,255,255,0.04)
- 无 parallax，纯内容堆叠

---

## 十一、文件获取方式

由于 AGENT BETA 无法直接访问文件系统，如需查看完整代码，请联系 Kimi 获取具体文件内容。

核心文件路径：
- 前端源码：`/mnt/c/Users/咩咩哥/cycle_trading_system_v2/mysticdao-frontend/src/`
- 后端源码：`/home/miemiege/mysticdao/src/`

---

如有问题请联系 Kimi。谢谢！

---

## 十二、Tailwind CSS 配置

```javascript
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#000000',
        'bg-card': '#0A0A0A',
        'bg-elevated': '#111111',
        'text-primary': '#FFFFFF',
        'text-secondary': '#888888',
        'text-muted': '#555555',
        'border-subtle': 'rgba(255,255,255,0.08)',
        'border-hover': 'rgba(255,255,255,0.2)',
        'border-glow': 'rgba(255,255,255,0.35)',
        'element-wood': '#4ADE80',
        'element-fire': '#F87171',
        'element-earth': '#FBBF24',
        'element-metal': '#E5E7EB',
        'element-water': '#60A5FA',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'monospace'],
      },
      borderRadius: {
        pill: '9999px',
      },
      keyframes: {
        "spin-slow": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        "glow-pulse": { "0%, 100%": { opacity: "0.4" }, "50%": { opacity: "0.8" } },
      },
      animation: {
        "spin-slow": "spin-slow 3s linear infinite",
        "spin-slower": "spin-slow 4s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 十三、文件地址

```
/mnt/c/Users/咩咩哥/cycle_trading_system_v2/mysticdao-frontend/AGENT_BETA_BRIEF_3.0.md
```
