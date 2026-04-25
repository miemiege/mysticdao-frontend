# MysticDAO Daily（每日一卦）页面 — 全面重设计任务

## 🎯 任务概述

当前 Daily 页面存在严重的性能和体验问题，需要彻底重设计。

**项目路径**: `/mnt/c/Users/咩咩哥/mysticdao-frontend`  
**分支**: `v3.1-agent-rewrite`  
**部署目标**: Cloudflare Pages  
**Token**: 见对话上下文（GitHub Push Protection 限制）

---

## ❌ 当前问题清单（已验证）

### P0 — 致命：页面卡顿/加载不出来

**1. 运行时性能极差**
- Daily.tsx 970 行，结果区域 440 行 JSX 同时渲染
- 17 个 useState，每次状态更新触发大面积重渲染
- framer-motion 74 处动画调用 + RitualDrawing 46 处动画 + 8 个 setTimeout
- 低端手机（<4GB RAM）直接卡死或白屏

**2. 首屏 Bundle 仍然过大**
```
Daily 首屏加载（gzip）：
  index.js        56KB  ← 共享代码
  vendor.js       16KB  ← React
  motion.js       43KB  ← framer-motion
  Daily.js        44KB  ← 页面核心
  icons.js         2KB  ← Lucide
  CSS             16KB  ← Tailwind
  ─────────────────────
  总计           ~177KB
```
在 3G 网络下仍需 3-5 秒，低端设备解析 JS 需额外 2-3 秒。

**3. framer-motion 弹簧动画吃满 CPU**
- 大量 `type: 'spring', stiffness: 100/150` 动画
- 结果区域同时播放 10+ 个 spring 动画
- 印章落下、分数弹出、六爻绘制并行执行
- 移动端掉帧严重（实测 <30fps）

### P1 — 严重：图片/元素显示异常

**4. SVG 滤镜跨设备渲染不一致**
- TalismanPosterV2 使用 `feTurbulence` + `feGaussianBlur` + `feColorMatrix`
- iOS Safari 上噪点滤镜不显示 → 海报变成纯色块
- Android WebView 上光晕效果消失
- foreignObject 中文字体渲染异常

**5. 仪式感步骤缺失**
- 当前流程：点击按钮 → loading 文字 → 直接显示完整结果
- 用户反馈"没有仪式感，像抽盲盒"
- 缺乏：入场动画 → 摇卦 ritual → 爻逐一揭示 → 卦象形成 → 判词显现的分步骤体验

**6. Flash/白屏问题**
- AnimatePresence exit 动画导致页面闪烁
- 路由切换时有白屏间隙
- loading 状态只有文字，没有视觉反馈

### P2 — 体验：交互问题

**7. 结果区域信息过载**
- 同时展示：海报 + 卦名 + 情绪文案 + 分数 + 印章 + 六爻 + 四维分数 + 幸运信息 + AI Reading + 跟进问题 + 分享按钮 + Community Insights
- 用户不知道先看什么
- 信息层级混乱

**8. 风格切换器位置尴尬**
- 8 个圆点在海报上方，占据宝贵空间
- 切换时整个海报重新渲染（闪烁）
- 应该放在导出/分享之后，作为"换皮肤"选项

---

## ✅ 重设计方案（请按此执行）

### 一、架构重构：拆分为独立步骤组件

将 Daily.tsx 拆分为 4 个独立步骤组件，每个步骤单独文件：

```
src/pages/daily/
├── Daily.tsx              # 主控制器（<200行），只管理 step 切换
├── StepIdle.tsx           # 待抽状态：黑金背景 + 竹筒 + "开始摇卦"按钮
├── StepRitual.tsx         # 摇卦仪式：竹筒摇晃 + 硬币落下 + 爻逐一揭示
├── StepLoading.tsx        # 加载中：金色粒子汇聚 + "正在解卦..."
└── StepResult.tsx         # 结果展示：渐进式揭示（见下方详细设计）
```

**关键规则**：
- 每一步卸载时彻底清理（取消动画、释放内存）
- 不用 AnimatePresence，用简单的 CSS opacity transition 做步骤切换
- StepResult 内部再用 lazy 加载海报和 AI Reading

### 二、StepRitual — 摇卦仪式感（核心体验）

**设计目标**：让用户感受到"真实的摇卦过程"

**步骤时序**：
1. **入场**（0-0.5s）：黑屏 → 中央金色光点放大 → 显示竹筒
2. **摇卦**（0.5-2.5s）：竹筒左右摇晃动画（CSS keyframes，不用 framer-motion）
3. **落爻**（2.5-5s）：6 枚铜钱逐一从竹筒落下，每枚 0.4s
   - 正面（阳）：金色发光
   - 反面（阴）：暗色
   - 铜钱落下位置形成六爻排列（从下到上）
4. **定卦**（5-6s）：六爻全部落定后，卦名从中心放大显现
5. **转场**（6-6.5s）：画面渐隐 → 进入 Loading

**技术要求**：
- 全部使用 CSS animation（@keyframes），零 framer-motion
- 铜钱用简单 SVG（圆形 + 文字），不用复杂滤镜
- 竹筒用 CSS 渐变 + 圆角矩形，不用图片
- 添加 `prefers-reduced-motion` 检测，禁用动画时直接显示结果

### 三、StepResult — 渐进式结果展示

**设计目标**：信息分层展示，不一次性 overwhelm 用户

**揭示顺序**（每步间隔 0.6s，用户可点击跳过）：
```
第1秒：  卦象符号（䷀）+ 卦名（乾为天）淡入
第2秒：  运势分数大字弹出（CSS transform scale）
第3秒：  六爻可视化（阳爻/阴爻/动爻）从下往上依次点亮
第4秒：  海报展示（只显示默认推荐风格）
第5秒：  判词/AI Reading 区域展开
第6秒：  分享按钮 + "换风格"选项出现
```

**海报区域简化**：
- 默认只展示 1 种风格（AI 推荐）
- "换风格"按钮放在海报下方，点击后展开 8 宫格选择器
- 风格切换时用 CSS transition 淡入淡出，不用重新 mount 组件

**六爻可视化简化**：
- 阳爻：金色粗横线（CSS border）
- 阴爻：两条金色短横线（gap）
- 动爻：阳爻/阴爻 + 红色小圆点标记
- 不用复杂 SVG，纯 CSS

### 四、性能优化清单

**1. 移除 framer-motion（结果区域）**
```tsx
// ❌ 删除
import { motion, AnimatePresence } from 'framer-motion'

// ✅ 用 CSS 替代
<style>{`
  .fade-in { animation: fadeIn 0.6s ease-out forwards; }
  .slide-up { animation: slideUp 0.5s ease-out 0.2s forwards; opacity: 0; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`}</style>
```

**2. 海报 SVG 降级方案**
- 检测用户设备性能（`navigator.hardwareConcurrency < 4`）
- 低端设备使用简化版海报：无滤镜、无噪点、纯色背景 + 文字
- 高端设备使用完整版海报

**3. 延迟加载非首屏内容**
```tsx
const AIReading = lazy(() => import('./AIReading'))
const LuckyInfo = lazy(() => import('./LuckyInfo'))
const CommunityInsights = lazy(() => import('./CommunityInsights'))
```

**4. 状态合并**
```tsx
// ❌ 当前 17 个 useState
// ✅ 合并为 3-4 个状态对象
const [step, setStep] = useState<'idle'|'ritual'|'loading'|'result'>('idle')
const [fortune, setFortune] = useState<FortuneResult | null>(null)
const [ui, setUi] = useState({ revealedStage: 0, selectedStyle: null })
```

### 五、图片/资源修复

**1. 确保所有 public 图片路径正确**
```html
<!-- 使用绝对路径，确保 Cloudflare Pages 能正确解析 -->
<img src="/hero-mandala-bg.webp" />
<!-- 不用相对路径 ./ -->
```

**2. SVG 内联降级**
- 所有装饰性 SVG（印章、边框）改为内联 SVG 或纯 CSS
- 避免使用 `<use>` 和外部 SVG 引用

### 六、视觉风格统一

**整体色调**：黑金（保持不变）
```
背景：#0A0A0F
主色：#C8A45C（金色）
辅色：#8B7355（暗金）
文字：#E0E0E0（白）/ #8B8B8B（灰）
强调：当前卦象的五行色（金白/木青/水黑/火红/土黄）
```

**字体**：
- 标题：'Cinzel', serif（英文）/ 'Noto Serif SC', serif（中文）
- 正文：system-ui, sans-serif

---

## 📁 需要修改/新建的文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/pages/Daily.tsx` | 重写 | 主控制器，<200行 |
| `src/pages/daily/StepIdle.tsx` | 新建 | 待抽状态 |
| `src/pages/daily/StepRitual.tsx` | 新建 | 摇卦仪式（核心）|
| `src/pages/daily/StepLoading.tsx` | 新建 | 加载中 |
| `src/pages/daily/StepResult.tsx` | 新建 | 结果展示 |
| `src/pages/daily/SimpleHexagram.tsx` | 新建 | 简化六爻可视化（纯CSS）|
| `src/components/TalismanPosterV2.tsx` | 修改 | 添加低端设备降级 |
| `src/components/daily/RitualDrawing.tsx` | 删除 | 用 StepRitual 替代 |
| `src/components/daily/CoinFlip.tsx` | 修改 | 简化动画 |
| `src/components/daily/HexagramDraw.tsx` | 修改 | 简化或替换 |

---

## ⚠️ 技术约束

1. **零第三方依赖新增** — 只用 React + Tailwind + 标准 CSS
2. **不用 framer-motion** — 全部用 CSS animation/transition
3. **支持 prefers-reduced-motion** — 动画敏感用户可禁用
4. **移动端优先** — 所有设计在 375px 宽度下正常显示
5. **构建零错误** — `npm run build` 必须通过
6. **测试通过** — `npx vitest run src/__tests__/` 146个测试全过

---

## 🔗 参考代码位置

- **当前 Daily.tsx**: `src/pages/Daily.tsx`（970行，参考但不要复用）
- **海报系统**: `src/components/TalismanPosterV2.tsx`
- **风格配置**: `src/lib/posterStyles.ts`
- **64卦数据**: `src/data/gua64.ts`
- **推荐算法**: `src/lib/recommendStyle.ts`
- **导出功能**: `src/lib/exportPoster.ts`

---

## 📋 交付检查清单

- [ ] Daily.tsx < 200 行，只管理步骤切换
- [ ] 4 个 Step 组件独立文件
- [ ] 摇卦仪式有完整的 CSS animation（竹筒摇晃 + 铜钱落下 + 六爻排列）
- [ ] 结果区域渐进式揭示（6 个阶段）
- [ ] 海报默认只显示 1 种风格，"换风格"展开 8 宫格
- [ ] 六爻可视化纯 CSS（不用复杂 SVG）
- [ ] 零 framer-motion（结果区域）
- [ ] 低端设备海报降级（无滤镜）
- [ ] 支持 prefers-reduced-motion
- [ ] `npm run build` 零错误
- [ ] 146 个测试通过
- [ ] 部署到 Cloudflare Pages 并提供 URL

---

## 🗝️ 部署命令

```bash
cd /mnt/c/Users/咩咩哥/mysticdao-frontend
npm run build
wrangler pages deploy dist --project-name=mysticdao-frontend --branch=main --commit-dirty=true
```

完成后把新的部署 URL 和 commit hash 回复给我。
