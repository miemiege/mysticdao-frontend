# MysticDAO Daily 页面全面重设计 — 执行计划

## Stage 1: 基础准备
- 创建 `src/pages/daily/` 目录
- 创建共享类型定义 `src/pages/daily/types.ts`
- 创建共享 CSS `src/pages/daily/shared.css`
- 读取 vibecoding-webapp-swarm skill

## Stage 2: 无 framer-motion 依赖的基础组件改造
- ScoreRing.tsx — 用 CSS animation 替换 framer-motion
- LuckyInfo.tsx — 用 CSS transition 替换 framer-motion
- RollingNumber.tsx — 用 CSS @property + animation 替换
- HexagramDraw.tsx — 用 CSS animation 替换 framer-motion
- TalismanPosterV2.tsx — 添加低端设备降级

## Stage 3: Step 组件创建（可并行）
- StepIdle.tsx — 待抽状态：黑金背景 + 竹筒 + "开始摇卦"按钮
- StepRitual.tsx — 摇卦仪式：CSS keyframes 竹筒摇晃 + 铜钱落下 + 六爻排列
- StepLoading.tsx — 加载中：金色粒子汇聚 + "正在解卦..."
- StepResult.tsx — 结果展示：6阶段渐进式揭示
- SimpleHexagram.tsx — 纯CSS六爻可视化

## Stage 4: Daily.tsx 重写 + 整合
- < 200 行，只管理 step 切换
- 整合所有 Step 组件
- 移除 AnimatePresence，用 CSS opacity transition

## Stage 5: 构建与测试
- npm run build 零错误
- 146个测试通过
- 验证移动端 375px

## Stage 6: 部署
- wrangler pages deploy

## 关键设计决策

### CSS Animation 系统（替代 framer-motion）
```css
.fade-in { animation: fadeIn 0.6s ease-out forwards; }
.slide-up { animation: slideUp 0.5s ease-out forwards; opacity: 0; }
.scale-in { animation: scaleIn 0.5s ease-out forwards; }
.shake { animation: shake 2s ease-in-out; }
.coin-drop { animation: coinDrop 0.6s ease-out forwards; }
```

### prefers-reduced-motion 支持
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 低端设备检测
```tsx
const isLowEnd = navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4;
```

### 渐进式揭示时序
- 0ms:   卦象符号 + 卦名
- 600ms: 运势分数
- 1200ms: 六爻可视化
- 1800ms: 海报（默认推荐风格）
- 2400ms: AI Reading
- 3000ms: 分享按钮 + 换风格
