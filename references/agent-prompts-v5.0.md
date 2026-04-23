# KIMI 5-Agent 并行任务话术

> 使用方法：打开5个KIMI网页版窗口，把下面5段话术分别粘贴发送。5个Agent并行工作。

---

## Agent 1 — 5A 首页视觉升级

```
话术

你是 MysticDao 前端开发工程师。请完成以下任务：

【GitHub仓库】
仓库：https://github.com/miemiege/mysticdao-frontend
基线分支：v5.0-rebuild
工作分支：agent-5a-home-visual（checkout -b 创建）
Token：【TOKEN】

【完整任务文档】
请读取：https://raw.githubusercontent.com/miemiege/mysticdao-frontend/v5.0-rebuild/references/agent-tasks-v5.0.md
搜索"任务1：首页沉浸式设计"部分，按文档要求开发。

【核心要求】
1. Home.tsx Hero区域添加 `/hero-ink-wash-bg.jpg` 背景（opacity 0.12, object-cover）
2. index.css body::before 添加 `/hero-ink-wash.jpg` 全局固定底纹（opacity 0.06）
3. 4张服务卡片改用图片背景：
   - Bazi → `/service-bazi.jpg`
   - FengShui → `/service-fengshui.jpg`
   - Daily → `/service-love.jpg`
   - Premium → `/service-tarot.jpg`
   - 每张卡片必须有黑色渐变遮罩 `bg-gradient-to-t from-black via-black/60 to-transparent`
   - hover时图片 scale(1.05)
4. FeatureSection和BrandStorySection之间添加水墨笔触SVG分隔线
5. CTASection底部添加禅意石子装饰（CSS圆形模拟）
6. 参考图E（墨玉太极）→ Hero添加墨玉光晕层 `radial-gradient(rgba(20,50,30,0.15), transparent)`

【技术栈】React 19 + Vite + Tailwind + TypeScript
【铁律】每次修改后 npm run build，0 TypeScript错误才能提交
【提交信息】feat(home): ink-wash background + service card images + ink brush divider + zen stones
```

---

## Agent 2 — 5B 符咒引擎重构

```
话术

你是 MysticDao 前端开发工程师。请完成以下任务：

【GitHub仓库】
仓库：https://github.com/miemiege/mysticdao-frontend
基线分支：v5.0-rebuild
工作分支：agent-5b-talisman-share（checkout -b 创建）
Token：【TOKEN】

【完整任务文档】
请读取：https://raw.githubusercontent.com/miemiege/mysticdao-frontend/v5.0-rebuild/references/agent-tasks-v5.0.md
搜索"任务2：符咒引擎重构"部分，按文档要求开发。

【核心要求】
1. TalismanSVG.tsx 中 SealStamp 从CSS矩形替换为 `/cinnabar-seal.png`：
   - 使用SVG `<image href="/cinnabar-seal.png">`
   - 按等级调整opacity：上上签=1.0, 上吉=0.9, 中吉=0.8, 小吉=0.7, 平=0.6, 需谨慎=0.5
   - 印章图片上方叠加等级文字（textShadow确保可读）
2. BackgroundPattern 从feTurbulence噪点替换为 `/cloud-pattern-border.png`（opacity 0.08, preserveAspectRatio=none）
3. 新增 DecorativeElements 组件：符咒两侧添加云纹、八卦符号装饰（参考图B：秦鬼谷先师教符咒）
4. 符咒内部布局按天师符构图调整（参考图D：黄色天师符）：
   - 符头 y=-200, 卦名 y=-170, 六爻 y=-100, 符胆 y=40, 印章 y=160, 分数 y=210
5. ShareCard.tsx 分享海报升级（参考图A：上上签符咒壁纸）：
   - 金色边框 `border-2 border-gold/30`
   - 云纹内边框 `absolute inset-2 border border-gold/10`
   - 分数大数字 text-5xl 居中
   - 小印章 `/seal-stamp.png` 40x40px, opacity 0.6
   - 底部金色语录 + 日期

【技术栈】React 19 + Vite + Tailwind + TypeScript
【铁律】每次修改后 npm run build，0 TypeScript错误才能提交。Props接口不变。
【提交信息】feat(talisman): real cinnabar seal + cloud border + decorative elements + share poster upgrade
```

---

## Agent 3 — 5C Daily结果页升级

```
话术

你是 MysticDao 前端开发工程师。请完成以下任务：

【GitHub仓库】
仓库：https://github.com/miemiege/mysticdao-frontend
基线分支：v5.0-rebuild
工作分支：agent-5c-daily-scroll（checkout -b 创建）
Token：【TOKEN】

【完整任务文档】
请读取：https://raw.githubusercontent.com/miemiege/mysticdao-frontend/v5.0-rebuild/references/agent-tasks-v5.0.md
搜索"任务3：Daily结果页"部分，按文档要求开发。

【核心要求】
1. Daily.tsx 最外层div添加 `/daily-hero-bg.png` 页面背景（opacity 0.08 + 黑色遮罩bg-black/70）
2. 卷轴纸张从CSS渐变替换为 `/mountain-scroll-bg.jpg`（opacity 0.15 + 渐变遮罩）
3. 卷轴顶部添加 `/scroll-unroll.png` 装饰滑入动画（initial y:-30, opacity:0 → animate y:0, opacity:1, delay 0.2s）
4. 分数印章从CSS矩形替换为 `/seal-stamp.png` + 盖印spring动画：
   - initial: scale 2.5, opacity 0, rotate -30, y -20
   - animate: scale 1, opacity 1, rotate 8, y 0
   - transition: type spring, stiffness 150, damping 12
   - 印章上叠加等级文字
5. AI解读区上方添加 `/red-thread-visual.png` 红线装饰（opacity 0.3, h-2, w-48）
6. 结果页排版优化（参考图C：财源滚滚祈福卡）：
   - 卦名加大 text-4xl md:text-5xl
   - 分数加大 text-7xl md:text-8xl
   - goldenQuote添加引号装饰「...」

【技术栈】React 19 + Vite + Tailwind + TypeScript
【铁律】每次修改后 npm run build，0 TypeScript错误才能提交
【提交信息】feat(daily): scroll texture + seal stamp animation + red thread decoration + layout upgrade
```

---

## Agent 4 — 5D 社交系统

```
话术

你是 MysticDao 前端开发工程师。请完成以下任务：

【GitHub仓库】
仓库：https://github.com/miemiege/mysticdao-frontend
基线分支：v5.0-rebuild
工作分支：agent-5d-social（checkout -b 创建）
Token：【TOKEN】

【完整任务文档】
请读取：https://raw.githubusercontent.com/miemiege/mysticdao-frontend/v5.0-rebuild/references/agent-tasks-v5.0.md
搜索"任务4：社交系统"部分，按文档要求开发。

【核心要求】
1. 新建 `src/components/daily/CardFlip.tsx`：3D翻转卡片
   - 父容器 perspective: 1000px
   - motion.div transformStyle: preserve-3d, rotateY动画0.6s
   - 正面：符咒信息，背面：`/tarot-card-back.png` 全卡背景
2. 新建 `src/components/daily/CardAlbum.tsx`：卡册系统
   - 3列(桌面)/2列(平板)/1列(手机)
   - 从 getFavorites() 读取数据
   - 按稀有度筛选（全部/普通/稀有/史诗/传说/神话）
   - 空状态引导去抽卦
   - 每张卡片可删除
3. 新建 `src/components/daily/FortunePK.tsx`：运势PK
   - 左侧当前用户卦象，右侧下拉选择对手（GUA64_LIST）
   - 中间VS大字
   - 5维度进度条动画（1s easeOutExpo）
   - 高的一方金色光晕 box-shadow
   - 中央添加 `/bagua-3d.png` 装饰（opacity 0.3, 96x96px）
4. 新建 `src/components/daily/AnonymousBoard.tsx`：匿名留言板
   - localStorage存储（key: mysticdao_board）
   - 140字限制，实时字数
   - 最多保留30条
   - 点赞功能（localStorage记录已点赞id）
5. 修改 `src/pages/UserProfile.tsx`：添加3个Tab（卡册/运势PK/留言板）

【技术栈】React 19 + Vite + Tailwind + TypeScript
【铁律】每次修改后 npm run build，0 TypeScript错误才能提交
【提交信息】feat(social): card album 3D flip + fortune PK + anonymous board + user profile tabs
```

---

## Agent 5 — 5E 性能优化

```
话术

你是 MysticDao 前端开发工程师。请完成以下任务：

【GitHub仓库】
仓库：https://github.com/miemiege/mysticdao-frontend
基线分支：v5.0-rebuild
工作分支：agent-5e-performance（checkout -b 创建）
Token：【TOKEN】

【完整任务文档】
请读取：https://raw.githubusercontent.com/miemiege/mysticdao-frontend/v5.0-rebuild/references/agent-tasks-v5.0.md
搜索"任务5：性能优化"部分，按文档要求开发。

【核心要求】
1. vite.config.ts 添加 manualChunks：
   - vendor: ['react', 'react-dom', 'react-router-dom']
   - motion: ['framer-motion']
   - ui: ['lucide-react', 'sonner']
2. App.tsx 所有页面改为 React.lazy + Suspense：
   - const Home = lazy(() => import('./pages/Home'))
   - 其他页面同理
   - Suspense fallback={<TaijiLoader />}
   - Layout组件不懒加载
3. 所有非首屏图片添加 loading="lazy" + decoding="async"：
   - service-*.jpg, mountain-scroll-bg.jpg, cinnabar-seal.png, cloud-pattern-border.png, scroll-unroll.png, seal-stamp.png, tarot-card-back.png, bagua-3d.png, daily-hero-bg.png, red-thread-visual.png
4. index.html 添加首屏素材 preload：
   - hero-ink-wash-bg.jpg, hero-mandala-bg.png, hero-fog-layer.png

【可选加分项】
5. 安装 vite-plugin-compression（gzip + brotli）
6. 安装 rollup-plugin-visualizer（dist/stats.html）

【技术栈】React 19 + Vite + Tailwind + TypeScript
【铁律】每次修改后 npm run build，0 TypeScript错误才能提交
【目标】首屏chunk < 200KB gzip，总bundle < 400KB gzip
【提交信息】feat(perf): manual chunks + lazy loading + image optimization
```

---

## 发送流程

```
Step 1: 打开浏览器，进入 https://kimi.moonshot.cn
Step 2: 打开5个独立窗口/标签页
Step 3: 在每个窗口发送对应Agent的话术（上面的5段）
Step 4: 等待5个Agent全部完成并推送分支到GitHub
Step 5: 通知CLI Agent（当前窗口）执行合并和部署
```

## Agent完成后检查清单

每个Agent完成后，在GitHub仓库应出现以下分支：
- [ ] `agent-5a-home-visual`
- [ ] `agent-5b-talisman-share`
- [ ] `agent-5c-daily-scroll`
- [ ] `agent-5d-social`
- [ ] `agent-5e-performance`

全部完成后，回复当前CLI Agent执行合并。
