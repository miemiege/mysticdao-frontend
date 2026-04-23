# 话术 — KIMI网页版 Agent 集群任务分配 v5.0

> **项目**: MysticDao Frontend v5.0
> **仓库**: https://github.com/miemiege/mysticdao-frontend
> **分支**: `v3.1-agent-rewrite`
> **技术栈**: React 19 + Vite + Tailwind CSS + TypeScript + HashRouter
> **部署**: GitHub Pages `https://miemiege.github.io/mysticdao-frontend/`
> **融合负责人**: CLI Agent（负责merge代码、解决冲突、build、deploy）

---

## 你的工作方式

1. **拉取代码**:
```bash
git clone https://github.com/miemiege/mysticdao-frontend.git
cd mysticdao-frontend
git checkout v3.1-agent-rewrite
npm install
```

2. **开发完成后**:
- 把你修改/新增的所有文件代码完整输出
- 说明修改了哪些文件、新增了多少行
- CLI Agent会负责融合到你的分支并部署

3. **规范**:
- TypeScript严格模式，0错误
- 使用Tailwind CSS，不用CSS Modules
- 动画用Framer Motion
- 组件命名PascalCase，hooks用useCamelCase
- 路由用HashRouter（gh-pages兼容）

---

## Agent-5A — API层完善

**任务**: 把前端所有mock/static数据替换为真实API调用

**具体工作**:
- `src/components/daily/GlobalCounter.tsx` — 第9行 `// TODO: Replace with real API` — 接入后端计数API
- `src/services/api.ts` — 检查所有API端点是否与后端对齐
- 新增错误重试逻辑（3次重试 + 指数退避）
- 新增加载状态统一管理（避免多个组件重复请求）

**验收标准**:
- GlobalCounter显示真实数据
- 所有API调用有错误处理和重试
- `npx tsc --noEmit` 0错误

**输出**: 修改后的 `GlobalCounter.tsx`, `api.ts`，以及新增的hook（如有）

---

## Agent-5B — Daily结果页视觉终极优化

**任务**: 让Daily结果页真正有"灵性"和"仪式感"

**当前问题**:
- 已推倒重来2次，用户仍不满意
- 需要超越"网页"的感觉，更像"打开一幅灵签"

**具体工作**:
- 完全重写 `src/pages/Daily.tsx` 的result部分（保留所有功能逻辑）
- 参考: 故宫藏品/道教符箓/日本御守/赛博朋克东方的视觉融合
- 必须保留: TalismanRenderer, HexagramDraw, BreathingTypewriter, 追问系统, ShareCard
- 新增: 更震撼的入场动画、粒子效果、光晕、书法字体

**验收标准**:
- 滚动时有视差效果
- 符咒入场有"浮现"感（不是简单的淡入）
- 分数揭示有仪式感（不是简单的数字滚动）
- 移动端适配完美
- `npx tsc --noEmit` 0错误

**输出**: 完整的 `Daily.tsx` result部分代码（可单独替换）

---

## Agent-5C — 性能优化 & 代码分割

**任务**: 降低首屏加载时间和bundle体积

**当前状态**:
- Bundle: 310KB gzip（限额500KB）
- 单个JS chunk: 1080KB minified

**具体工作**:
- 配置Vite `rollupOptions.output.manualChunks` 做代码分割
- 懒加载非首屏页面（Bazi/FengShui/Pricing/UserProfile用 `React.lazy()`）
- Three.js/R3F相关代码单独chunk（风水相机页面）
- 图片资源优化（TalismanSVG已用代码生成，但ShareCard用html2canvas需检查）
- 添加 `vite-plugin-compression` gzip/brotli预压缩

**验收标准**:
- 首屏chunk < 200KB gzip
- 非首屏页面按需加载
- Lighthouse性能评分 > 70
- `npx vite build` 无警告

**输出**: `vite.config.ts` 修改 + 懒加载改造后的 `App.tsx` + 其他改动

---

## Agent-5D — 移动端体验优化

**任务**: 让所有页面在手机上体验完美

**当前问题**:
- Daily结果页在移动端可能文字过小
- 风水罗盘在手机传感器模式下有兼容性问题
- 分享卡片在小屏幕可能截断

**具体工作**:
- 所有页面通过Chrome DevTools移动端测试
- Daily结果页: 字体放大、间距调整、触摸友好的按钮
- FengShui相机: 优化相机权限流程、适配刘海屏
- ShareCard: 小屏幕尺寸自适应
- 新增 `useMediaQuery` hook 处理响应式逻辑
- 底部导航栏在移动端固定显示

**验收标准**:
- iPhone 14 Pro / Samsung S23 / Pixel 7 三种尺寸测试通过
- 所有按钮可触摸（最小44x44pt）
- 无水平滚动条

**输出**: 修改后的各页面组件 + 新增hooks

---

## Agent-5E — 测试 & 质量保障

**任务**: 建立前端测试体系，确保v5.0稳定

**具体工作**:
- 配置Vitest测试框架
- 为核心工具函数写单元测试: `src/lib/theme.ts`, `src/lib/cardRarity.ts`, `src/lib/storage.ts`
- 为数据层写测试: `src/data/gua64.ts`, `src/data/hexagram-talismans.ts`
- 为hooks写测试: `useStreak`, `useRitualSound`
- 配置GitHub Actions CI: build + test + lint
- 添加 `npm run test` 脚本

**验收标准**:
- 测试覆盖率 > 60%（核心模块）
- `npm run test` 全部通过
- CI在PR时自动运行

**输出**: `vitest.config.ts` + 测试文件 + `.github/workflows/ci.yml`

---

## Agent-5F — SEO & 无障碍 & PWA

**任务**: 让产品更专业、更易被发现

**具体工作**:
- SEO: 每个页面有独立title/meta description/Open Graph标签
- 无障碍: 所有按钮有aria-label、颜色对比度符合WCAG AA、键盘导航
- PWA: 添加manifest.json、service worker离线缓存、添加到主屏
- 性能: 添加 `loading="lazy"` 到非首屏图片、预加载关键字体

**验收标准**:
- Lighthouse SEO评分 > 90
- Lighthouse Accessibility评分 > 90
- PWA检测通过

**输出**: `index.html` 修改 + `manifest.json` + `sw.ts` + 各页面SEO组件

---

## 融合规则（给CLI Agent）

1. 每个Agent输出代码后，创建临时分支测试
2. 优先merge无冲突的agent（5C和5E通常无冲突）
3. 5B（Daily重写）最后merge，因为改动最大
4. 每次merge后: `npx tsc --noEmit` → `npx vite build` → 部署
5. 冲突解决原则: 功能逻辑 > 视觉效果 > 代码风格
6. 所有agent代码merge完成后，打tag `v5.0`

---

## 快速参考

```bash
# 检查TypeScript
npx tsc --noEmit

# 构建
npx vite build

# 部署
npx gh-pages -d dist

# 当前bundle
# JS: 1080KB min / 310KB gzip
# CSS: 109KB min / 18KB gzip
```

---

*Agent任务分配 v1.0 — 2026-04-21*
*分支: v3.1-agent-rewrite*
