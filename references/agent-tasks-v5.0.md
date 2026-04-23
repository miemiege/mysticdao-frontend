

## 五、5个Agent开发任务

---

### 任务1：首页沉浸式设计 — 水墨背景 + 服务卡片图片 + 墨玉太极质感

**Agent编号：** 5A  
**工作分支：** `agent-5a-home-visual`  
**参考图：** E（墨玉质感太极）、G（水墨笔触）、F（禅意石子太极）  
**public素材：** hero-ink-wash-bg.jpg、hero-ink-wash.jpg、service-*.jpg（4张）  

#### 参考图使用说明

| 参考图 | 具体融入点 | 代码实现 |
|:---|:---|:---|
| E（墨玉质感太极） | Hero背景配色方案：黑底→深墨绿渐变→金色点缀 | 添加 `radial-gradient(ellipse at center, rgba(20,40,20,0.3) 0%, transparent 60%)` 叠加在黑色背景之上 |
| G（水墨笔触） | 页面区块分隔线：水墨笔触SVG路径 | 在 FeatureSection 和 BrandStorySection 之间添加水墨笔触分隔装饰 |
| F（禅意石子太极） | Footer区域装饰质感 | CTASection底部添加石子排列感的装饰元素（用CSS圆形模拟） |

#### 基线代码现状

`src/pages/Home.tsx` 当前：
- `hero-mandala-bg.png` ✅ 已用（RotatingMandala, opacity 0.15）
- `hero-fog-layer.png` ✅ 已用（Hero Layer 4, opacity 0.08）
- `hero-ink-wash-bg.jpg` ❌ 未用
- `hero-ink-wash.jpg` ❌ 未用
- 服务卡片：纯CSS背景 `bg-white/[0.04]`，无图片

#### 具体开发要求

**P0 — 必须完成**

1. **Hero区域添加水墨背景底图**
   - 文件：`src/pages/Home.tsx`（修改 HeroSection）
   - 在Layer 1（`bg-black`）和Layer 2（TaijiParticles）之间插入新层：
   ```tsx
   {/* Layer 1.5: Ink Wash Background */}
   <div className="absolute inset-0 z-[0.5]">
     <img
       src="/hero-ink-wash-bg.jpg"
       alt=""
       className="w-full h-full object-cover opacity-[0.12]"
       aria-hidden="true"
     />
   </div>
   ```
   - opacity 0.12，确保不干扰文字可读性
   - 使用 `object-cover` 填充整个视口

2. **全局body添加水墨底纹**
   - 文件：`src/index.css`（修改）
   - 在 `body` 样式中添加：
   ```css
   body {
     background-color: #000000;
     background-image: url('/hero-ink-wash.jpg');
     background-attachment: fixed;
     background-size: cover;
     background-position: center;
     background-repeat: no-repeat;
   }
   ```
   - 但body背景不能覆盖页面内容，需要确保内容层有 `bg-black` 或半透明遮罩
   - 实际上更好的方式：给 `body` 添加 `::before` 伪元素承载背景图
   ```css
   body::before {
     content: '';
     position: fixed;
     inset: 0;
     background-image: url('/hero-ink-wash.jpg');
     background-size: cover;
     background-position: center;
     opacity: 0.06;
     z-index: -1;
     pointer-events: none;
   }
   ```

3. **服务卡片升级 — 使用真实图片背景**
   - 文件：`src/pages/Home.tsx`（修改 FeatureSection）
   - 修改 `features` 数组，为每个卡片添加图片路径：
   ```tsx
   const features = [
     {
       title: 'Bazi Destiny',
       chinese: '八字命理',
       description: '...',
       href: '/#/bazi',
       icon: ScrollText,
       image: '/service-bazi.jpg',  // 新增
     },
     {
       title: 'Feng Shui',
       chinese: '风水罗盘',
       description: '...',
       href: '/#/fengshui',
       icon: Compass,
       image: '/service-fengshui.jpg',  // 新增
     },
     {
       title: 'Daily I Ching',
       chinese: '每日一卦',
       description: '...',
       href: '/#/daily',
       icon: Sparkles,
       image: '/service-love.jpg',  // 新增（用姻缘图代表每日运势）
     },
     {
       title: 'Premium Access',
       chinese: '',
       description: '...',
       href: '/#/pricing',
       icon: Crown,
       image: '/service-tarot.jpg',  // 新增
     },
   ];
   ```
   - 卡片结构修改（保留原有hover效果）：
   ```tsx
   <div className="h-full relative rounded-2xl overflow-hidden group">
     {/* 图片背景层 */}
     <div className="absolute inset-0">
       <img src={f.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
       {/* 黑色渐变遮罩 */}
       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
     </div>
     {/* 内容层（在遮罩上方） */}
     <div className="relative h-full p-8 flex flex-col">
       <div className="w-12 h-12 rounded-xl bg-gold/[0.15] backdrop-blur-sm flex items-center justify-center mb-5">
         <f.icon className="w-6 h-6 text-gold" />
       </div>
       <h3 className="font-heading text-xl font-semibold text-white mb-1">{f.title}</h3>
       {f.chinese && <span className="text-xs text-gold/60 block mb-3">{f.chinese}</span>}
       <p className="text-sm text-white/70 leading-relaxed mb-6 flex-1">{f.description}</p>
       <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.1em] text-gold group-hover:underline">
         Explore <ArrowRight className="w-3.5 h-3.5" />
       </span>
     </div>
   </div>
   ```
   - **卡片hover效果保留**：`group-hover:scale-105` 图片放大，`group-hover:border-gold/50` 金色边框
   - **确保文字可读性**：必须有 `bg-gradient-to-t from-black via-black/60 to-transparent` 黑色渐变遮罩

4. **水墨笔触分隔装饰**
   - 文件：`src/pages/Home.tsx`（修改）
   - 在 FeatureSection 和 BrandStorySection 之间添加水墨笔触SVG分隔线：
   ```tsx
   {/* Ink Brush Divider */}
   <div className="py-8 flex justify-center">
     <svg width="200" height="20" viewBox="0 0 200 20" className="opacity-20">
       <path d="M0,10 Q50,5 100,10 T200,10" stroke="#C8A45C" strokeWidth="1" fill="none" opacity="0.6" />
       <path d="M0,12 Q50,7 100,12 T200,12" stroke="#C8A45C" strokeWidth="0.5" fill="none" opacity="0.3" />
     </svg>
   </div>
   ```
   - 参考图G（水墨笔触）的抽象表现：用SVG路径模拟水墨笔触感

5. **CTA区域石子太极装饰**
   - 文件：`src/pages/Home.tsx`（修改 CTASection）
   - 在CTA内容下方添加石子排列感的装饰元素：
   ```tsx
   {/* Zen Stone Decoration */}
   <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-2 opacity-10 pointer-events-none">
     {[...Array(12)].map((_, i) => (
       <div key={i} className="rounded-full bg-gold"
         style={{
           width: `${6 + Math.sin(i * 0.8) * 4}px`,
           height: `${4 + Math.cos(i * 0.6) * 3}px`,
           opacity: 0.3 + Math.sin(i) * 0.2,
         }}
       />
     ))}
   </div>
   ```
   - 参考图F（禅意石子太极）：用CSS圆形模拟石子排列的韵律感

**P1 — 加分项**

6. **墨玉太极质感色彩方案**
   - 文件：`src/pages/Home.tsx`（修改 HeroSection Layer 5）
   - 在vignette层之上添加墨玉光晕：
   ```tsx
   {/* Layer 5.5: Jade Glow */}
   <div className="absolute inset-0 z-[4.5] pointer-events-none"
     style={{
       background: 'radial-gradient(ellipse at 50% 50%, rgba(20,50,30,0.15) 0%, rgba(10,30,15,0.08) 40%, transparent 70%)'
     }}
   />
   ```

#### 素材调用清单

| 素材路径 | 使用位置 | 使用方式 | CSS属性 |
|:---|:---|:---|:---|
| `/hero-ink-wash-bg.jpg` | Home.tsx HeroSection | 首屏背景图 | `object-cover`, `opacity: 0.12` |
| `/hero-ink-wash.jpg` | index.css body::before | 全局固定背景 | `fixed`, `opacity: 0.06` |
| `/service-bazi.jpg` | FeatureSection Bazi卡片 | background-image | `object-cover` + 黑色渐变遮罩 |
| `/service-fengshui.jpg` | FeatureSection FengShui卡片 | background-image | 同上 |
| `/service-love.jpg` | FeatureSection Daily卡片 | background-image | 同上 |
| `/service-tarot.jpg` | FeatureSection Premium卡片 | background-image | 同上 |

#### 验收标准

- [ ] `npm run build` 通过，0 TypeScript 错误
- [ ] 首页Hero有水墨背景底图（opacity 0.12）
- [ ] 全局body有水墨底纹（opacity 0.06, fixed）
- [ ] 4张服务卡片有图片背景 + 黑色渐变遮罩
- [ ] 卡片hover时图片放大（scale 1.05）
- [ ] 文字在遮罩上方清晰可读
- [ ] 水墨笔触分隔线存在
- [ ] CTA区域有石子装饰
- [ ] 移动端适配正常

#### Git操作

```bash
git checkout -b agent-5a-home-visual
git add -A
git commit -m "feat(home): ink-wash background + service card images + ink brush divider + zen stones"
git remote set-url origin https://miemiege:【TOKEN】@github.com/miemiege/mysticdao-frontend.git
git push -u origin agent-5a-home-visual
```

---

### 任务2：符咒引擎重构 — 真实印章 + 天师符构图 + 分享海报升级

**Agent编号：** 5B  
**工作分支：** `agent-5b-talisman-share`  
**参考图：** A（上上签符咒壁纸）、B（秦鬼谷先师教符咒）、D（黄色天师符）  
**public素材：** cinnabar-seal.png、cloud-pattern-border.png、seal-stamp.png  

#### 参考图使用说明

| 参考图 | 具体融入点 | 代码实现 |
|:---|:---|:---|
| D（黄色天师符） | 符咒整体构图框架 | TalismanSVG内部元素重新布局：符头占顶部15%、卦名占顶部10%、六爻占中间40%、符胆占底部20%、印章在右下角 |
| B（秦鬼谷先师教符咒） | 装饰元素库 | 新增 DecorativeElements 组件：云纹、雷纹、八卦小符号，散布在符咒两侧 |
| A（上上签符咒壁纸） | 分享海报布局 | ShareCard预览卡片改为竖版海报：顶部卦名+分数大数字、中间卦象图、底部印章+二维码区域 |

#### 基线代码现状

`src/components/talisman/TalismanSVG.tsx`（156行）：
- SealStamp：CSS rect + text（第49-55行）
- BackgroundPattern：feTurbulence噪点 + 双线边框（第76-87行）
- 无真实印章图片引用

`src/components/share/ShareCard.tsx`（161行）：
- 预览卡片背景：CSS渐变
- 无印章元素
- 无云纹边框

#### 具体开发要求

**P0 — 必须完成**

1. **SealStamp 替换为真实朱砂印章图片**
   - 文件：`src/components/talisman/TalismanSVG.tsx`（修改第49-55行）
   - 将 CSS 绘制的 SealStamp 替换为 `cinnabar-seal.png`：
   ```tsx
   const SealStamp: React.FC<{ grade: string; color: string; size: number }> = ({ grade, color, size }) => {
     const gradeOpacity = grade === '上上签' ? 1.0 : grade === '上吉' ? 0.9 : grade === '中吉' ? 0.8 : grade === '小吉' ? 0.7 : grade === '平' ? 0.6 : 0.5;
     return (
       <g transform={`translate(0, ${size / 2 + 10})`}>
         <image
           href="/cinnabar-seal.png"
           x={-size / 2}
           y={-size / 2}
           width={size}
           height={size}
           opacity={gradeOpacity}
           style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
         />
         {/* 等级文字叠加在印章上方 */}
         <text x="0" y="4" textAnchor="middle" fill={color} fontSize={size * 0.3} fontWeight="bold" opacity="0.95" fontFamily="serif" style={{ textShadow: `0 1px 2px rgba(0,0,0,0.8)` }}>
           {grade}
         </text>
       </g>
     );
   };
   ```
   - **等级对应opacity**：上上签=1.0, 上吉=0.9, 中吉=0.8, 小吉=0.7, 平=0.6, 需谨慎=0.5
   - **文字叠加**：印章图片上叠加等级文字，添加黑色textShadow确保可读性
   - **drop-shadow滤镜**：给印章添加与主题色匹配的光晕

2. **BackgroundPattern 替换为云纹边框**
   - 文件：`src/components/talisman/TalismanSVG.tsx`（修改第76-87行）
   - 将 feTurbulence 噪点替换为 `cloud-pattern-border.png` 作为边框装饰：
   ```tsx
   const BackgroundPattern: React.FC<{ color: string }> = ({ color }) => (
     <>
       {/* 云纹边框装饰 */}
       <image
         href="/cloud-pattern-border.png"
         x="-145"
         y="-245"
         width="290"
         height="490"
         opacity="0.08"
         preserveAspectRatio="none"
       />
       {/* 保留原有双线边框 */}
       <rect x="-140" y="-210" width="280" height="420" fill="none" stroke={color} strokeWidth="1" opacity="0.15" rx="8" />
       <rect x="-135" y="-205" width="270" height="410" fill="none" stroke={color} strokeWidth="0.5" opacity="0.08" rx="6" />
     </>
   );
   ```
   - `cloud-pattern-border.png` 使用 `preserveAspectRatio="none"` 拉伸填充
   - opacity 0.08，作为 subtle 纹理

3. **符咒装饰元素库（参考图B：秦鬼谷先师教符咒）**
   - 文件：`src/components/talisman/TalismanSVG.tsx`（新增）
   - 新增 `DecorativeElements` 组件，在符咒两侧添加云纹、雷纹等装饰：
   ```tsx
   const DecorativeElements: React.FC<{ color: string; seed: number }> = ({ color, seed }) => {
     const side = seed % 2 === 0 ? 1 : -1;
     return (
       <g opacity="0.25">
         {/* 左侧/右侧云纹装饰 */}
         <circle cx={side * 120} cy="-100" r="3" fill="none" stroke={color} strokeWidth="0.8" />
         <circle cx={side * 120} cy="-80" r="2" fill="none" stroke={color} strokeWidth="0.6" />
         <path d={`M${side * 115},-60 Q${side * 125},-50 ${side * 115},-40`} fill="none" stroke={color} strokeWidth="0.6" />
         {/* 八卦小符号 */}
         <text x={side * 120} y="0" textAnchor="middle" fill={color} fontSize="8" opacity="0.4">☯</text>
         <text x={side * 120} y="60" textAnchor="middle" fill={color} fontSize="6" opacity="0.3">八卦</text>
         <path d={`M${side * 115},80 Q${side * 125},90 ${side * 115},100`} fill="none" stroke={color} strokeWidth="0.6" />
       </g>
     );
   };
   ```
   - 在 `TalismanSVG` 主组件中，在 `BackgroundPattern` 之后添加 `<DecorativeElements color={theme.primary} seed={seed} />`
   - 根据 seed 决定装饰在左侧还是右侧，确保每次生成的符咒有变化

4. **符咒构图调整（参考图D：黄色天师符）**
   - 文件：`src/components/talisman/TalismanSVG.tsx`（修改布局）
   - 当前布局：
     - 符头 y=10（太靠上）
     - 卦名 y=-185（太靠上）
     - 六爻 y=60~144（中间偏下）
     - 符胆 y=0（居中）
     - 印章 y=size/2+10（太靠下）
   - 调整为天师符式构图：
   ```
   顶部留白 (y=-220)
   符头 (y=-200, 占15%)
   卦名 (y=-170)
   category (y=-155)
   六爻 (y=-100 to y=-20, 占40%)
   符胆 (y=40, 占20%)
   blessingTheme (y=100)
   印章 (y=160, 占15%)
   分数 (y=210)
   ```
   - 具体坐标调整：
     - `FuTou`: `translate(0, -200)` → 更靠近顶部
     - `hexagramName`: `y=-170` → 符头下方
     - `HexagramLines`: `y = -100 + i * 14` → 上移
     - `FuGall`: 保持居中但微调 `y=40`
     - `SealStamp`: `translate(0, 160)` → 更靠近底部
     - `blessingTheme`: `y=100` → 符胆下方
     - `score`: `y=210` → 最底部

5. **分享海报升级（参考图A：上上签符咒壁纸）**
   - 文件：`src/components/share/ShareCard.tsx`（修改预览卡片）
   - 当前预览卡片：CSS渐变背景 + 简单文字布局
   - 升级为上上签符咒壁纸风格：
   ```tsx
   <div
     ref={cardRef}
     className="relative rounded-xl overflow-hidden border-2"
     style={{
       width: '100%',
       aspectRatio: `${activeConfig.width} / ${activeConfig.height}`,
       background: 'linear-gradient(180deg, #0a0800 0%, #1a1200 30%, #0a0800 100%)',
       borderColor: 'rgba(200,164,92,0.3)',
     }}
   >
     {/* 云纹边框装饰 */}
     <div className="absolute inset-2 border border-gold/10 rounded-lg pointer-events-none" />
     
     {/* 顶部：卦名大标题 */}
     <div className="absolute top-6 left-0 right-0 text-center">
       <div className="text-[10px] uppercase tracking-[0.3em] text-gold/40 mb-1">Daily I Ching</div>
       <h2 className="text-3xl font-bold text-gold" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", textShadow: '0 0 20px rgba(200,164,92,0.3)' }}>
         {hexagramName}
       </h2>
       <div className="text-xs text-gold/50 mt-1">{blessingTheme} · {category}</div>
     </div>
     
     {/* 中间：分数大数字 + 印章 */}
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
       <div className="text-5xl font-bold text-gold" style={{ textShadow: '0 0 30px rgba(200,164,92,0.4)' }}>
         {score}
       </div>
       <div className="text-[10px] text-gold/40 tracking-wider mt-1">FORTUNE SCORE</div>
       {/* 小印章 */}
       <img src="/seal-stamp.png" alt="" className="w-10 h-10 mx-auto mt-2 opacity-60" />
     </div>
     
     {/* 底部：金色语录 + 日期 */}
     <div className="absolute bottom-6 left-0 right-0 text-center px-6">
       <div className="text-sm text-white/70 leading-relaxed italic" style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}>
         {goldenQuote}
       </div>
       <div className="text-[10px] text-gold/30 tracking-wider mt-3">MysticDao · {new Date().toLocaleDateString()}</div>
     </div>
   </div>
   ```
   - 金色边框：`border-2 border-gold/30`
   - 云纹内边框：`absolute inset-2 border border-gold/10 rounded-lg`
   - 分数大数字：`text-5xl` 居中突出
   - 小印章：`seal-stamp.png` 40x40px, opacity 0.6
   - 底部语录：中文衬线字体，italic

**P1 — 加分项**

6. **分享海报添加二维码区域占位**
   - 在分享海报底部添加二维码占位符（暂不生成真实二维码）
   ```tsx
   <div className="absolute bottom-2 right-3 w-8 h-8 border border-gold/20 rounded flex items-center justify-center">
     <span className="text-[6px] text-gold/30">QR</span>
   </div>
   ```

#### 素材调用清单

| 素材路径 | 使用位置 | 使用方式 | 尺寸/透明度 |
|:---|:---|:---|:---|
| `/cinnabar-seal.png` | TalismanSVG SealStamp | `<image>` in SVG | 60-100px, opacity按等级 |
| `/cloud-pattern-border.png` | TalismanSVG BackgroundPattern | `<image>` in SVG | 290x490, opacity 0.08, preserveAspectRatio=none |
| `/seal-stamp.png` | ShareCard预览卡片 | `<img>` | 40x40px, opacity 0.6 |

#### 验收标准

- [ ] `npm run build` 通过
- [ ] SealStamp使用真实cinnabar-seal.png图片
- [ ] 印章等级对应不同opacity（上上签最清晰）
- [ ] 印章上叠加等级文字，可读
- [ ] BackgroundPattern使用cloud-pattern-border.png作为纹理
- [ ] 符咒两侧有装饰元素（云纹/八卦符号）
- [ ] 符咒内部元素布局符合天师符构图
- [ ] 分享海报有金色边框、云纹内边框、大分数、小印章
- [ ] Props接口不变

#### Git操作

```bash
git checkout -b agent-5b-talisman-share
git add -A
git commit -m "feat(talisman): real cinnabar seal + cloud border + decorative elements + share poster upgrade"
git remote set-url origin https://miemiege:【TOKEN】@github.com/miemiege/mysticdao-frontend.git
git push -u origin agent-5b-talisman-share
```

---

### 任务3：Daily结果页 — 卷轴纹理 + 印章动画 + 祈福卡排版

**Agent编号：** 5C  
**工作分支：** `agent-5c-daily-scroll`  
**参考图：** C（财源滚滚祈福卡）  
**public素材：** mountain-scroll-bg.jpg、scroll-unroll.png、daily-hero-bg.png、red-thread-visual.png、seal-stamp.png  

#### 参考图使用说明

| 参考图 | 具体融入点 | 代码实现 |
|:---|:---|:---|
| C（财源滚滚祈福卡） | Daily结果页排版：大标题居中、分数大数字突出、祝福语区域 | 调整结果页内部元素间距、字体大小层级，参考祈福卡的"标题→分数→内容→footer"信息层级 |

#### 基线代码现状

`src/pages/Daily.tsx` 当前：
- 卷轴纸张：CSS渐变 `linear-gradient(180deg, rgba(200,164,92,0.02) ...)`
- 分数印章：CSS圆角矩形
- 无 mountain-scroll-bg.jpg
- 无 scroll-unroll.png
- 无 daily-hero-bg.png
- 无 red-thread-visual.png
- 无 seal-stamp.png

#### 具体开发要求

**P0 — 必须完成**

1. **Daily页面添加背景图**
   - 文件：`src/pages/Daily.tsx`（修改最外层div）
   - 当前：`<div className="min-h-[100dvh] bg-black relative">`
   - 修改为背景图+黑色遮罩：
   ```tsx
   <div className="min-h-[100dvh] relative">
     {/* 背景图层 */}
     <div className="absolute inset-0">
       <img src="/daily-hero-bg.png" alt="" className="w-full h-full object-cover opacity-[0.08]" aria-hidden="true" />
       <div className="absolute inset-0 bg-black/70" /> {/* 黑色遮罩确保可读性 */}
     </div>
     <ParticleBackground />
     {/* ... 其余内容 ... */}
   </div>
   ```

2. **卷轴纸张替换为真实纹理**
   - 文件：`src/pages/Daily.tsx`（修改卷轴纸张div，第375行）
   - 当前：
   ```tsx
   <div className="relative border-x border-gold/10 px-6 md:px-10 py-8" style={{ background: 'linear-gradient(180deg, ...)' }}>
   ```
   - 替换为：
   ```tsx
   <div className="relative border-x border-gold/10 px-6 md:px-10 py-8">
     {/* 真实纸张纹理背景 */}
     <div className="absolute inset-0">
       <img src="/mountain-scroll-bg.jpg" alt="" className="w-full h-full object-cover opacity-[0.15]" aria-hidden="true" />
       <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
     </div>
     {/* 原有内容，添加 relative z-10 */}
     <div className="relative z-10">
       {/* 原有内容... */}
     </div>
   </div>
   ```
   - `mountain-scroll-bg.jpg` opacity 0.15，上方叠加黑色渐变遮罩确保文字可读
   - 所有原有内容包裹在 `relative z-10` 的div中

3. **卷轴展开装饰动画（scroll-unroll.png）**
   - 文件：`src/pages/Daily.tsx`（在卷轴顶部轴头上方添加）
   - 在顶部轴头div之前添加卷轴展开装饰：
   ```tsx
   {/* 卷轴展开装饰 */}
   <motion.div
     initial={{ opacity: 0, y: -30 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
     className="relative h-12 mb-0 flex justify-center"
   >
     <img src="/scroll-unroll.png" alt="" className="h-full w-auto object-contain opacity-[0.4]" aria-hidden="true" />
   </motion.div>
   ```
   - 从上方滑入动画，0.8s
   - opacity 0.4，作为装饰元素不抢眼

4. **分数印章替换为真实印章 + 盖印动画**
   - 文件：`src/pages/Daily.tsx`（修改分数印章区域，第415行）
   - 当前：
   ```tsx
   <motion.div className="w-14 h-14 rounded-lg border-2 flex items-center justify-center" style={{ borderColor: ... }}>
     <span className="text-lg font-bold">{等级}</span>
   </motion.div>
   ```
   - 替换为：
   ```tsx
   <motion.div
     initial={{ scale: 2.5, opacity: 0, rotate: -30, y: -20 }}
     animate={{ scale: 1, opacity: 1, rotate: 8, y: 0 }}
     transition={{ delay: 1.1, type: 'spring', stiffness: 150, damping: 12 }}
     className="relative w-16 h-16"
   >
     <img src="/seal-stamp.png" alt="" className="w-full h-full object-contain" style={{ filter: `drop-shadow(0 0 8px ${fortune.card.color}40)` }} />
     <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: fortune.card.color, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
       {fortune.overallScore >= 85 ? '上' : fortune.overallScore >= 70 ? '吉' : fortune.overallScore >= 55 ? '中' : '平'}
     </span>
   </motion.div>
   ```
   - **盖印动画**：从 scale 2.5 + opacity 0 + rotate -30 + y -20 到 scale 1 + opacity 1 + rotate 8
   - **spring动画**：stiffness 150, damping 12
   - **文字叠加**：在印章图片上叠加等级文字
   - **drop-shadow滤镜**：与卦象颜色匹配的光晕

5. **红线装饰（red-thread-visual.png）**
   - 文件：`src/pages/Daily.tsx`（在卷轴纸张区域内添加）
   - 在AI解读区域上方添加红线装饰：
   ```tsx
   {/* 红线装饰 */}
   <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ delay: 1.3 }}
     className="flex justify-center mb-4"
   >
     <img src="/red-thread-visual.png" alt="" className="h-2 w-48 object-cover opacity-[0.3]" aria-hidden="true" />
   </motion.div>
   ```
   - 作为AI解读和上方内容的分隔装饰

6. **结果页排版优化（参考图C：财源滚滚祈福卡）**
   - 文件：`src/pages/Daily.tsx`
   - 调整信息层级，参考祈福卡的排版：
     - **标题层**：卦名加大到 `text-4xl md:text-5xl`，加粗
     - **副标题层**：keyword + category 合并为一行，`text-xs tracking-[0.2em]`
     - **分数层**：分数数字加大到 `text-7xl md:text-8xl`，font-heading
     - **维度层**：4个ScoreRing之间的间距加大
     - **语录层**：goldenQuote 添加引号装饰，字体加大
   - 具体修改（卦名区域，第397行）：
   ```tsx
   <h2 className="text-4xl md:text-5xl font-bold tracking-[0.1em] mb-2" style={{ ... }}>
     {fortune.card.name}
   </h2>
   ```
   - 分数区域（第410行）：
   ```tsx
   <div className="text-7xl md:text-8xl font-bold font-heading" style={{ ... }}>
     <RollingNumber value={fortune.overallScore} delay={700} />
   </div>
   ```
   - goldenQuote 展示（在卦名下方新增）：
   ```tsx
   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center mb-6">
     <span className="text-gold/40 text-lg">「</span>
     <span className="text-sm text-gold/60 italic" style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}>
       {getGoldenQuote(fortune.card.name)}
     </span>
     <span className="text-gold/40 text-lg">」</span>
   </motion.div>
   ```

**P1 — 加分项**

7. **分享海报组件添加红线装饰**
   - 文件：`src/components/daily/SharePoster.tsx`
   - 添加 `red-thread-visual.png` 作为海报顶部/底部装饰

#### 素材调用清单

| 素材路径 | 使用位置 | 使用方式 | 尺寸/透明度 |
|:---|:---|:---|:---|
| `/daily-hero-bg.png` | Daily.tsx 页面背景 | `<img>` 全屏背景 | `object-cover`, opacity 0.08 + 黑色遮罩 |
| `/mountain-scroll-bg.jpg` | Daily.tsx 卷轴纸张 | `<img>` 绝对定位背景 | `object-cover`, opacity 0.15 + 渐变遮罩 |
| `/scroll-unroll.png` | Daily.tsx 卷轴顶部 | `<img>` 装饰滑入 | height 48px, opacity 0.4, 滑入动画 |
| `/seal-stamp.png` | Daily.tsx 分数印章 | `<img>` + 文字叠加 | 64x64px, spring盖印动画 |
| `/red-thread-visual.png` | Daily.tsx 解读区上方 | `<img>` 分隔装饰 | height 8px, width 192px, opacity 0.3 |

#### 验收标准

- [ ] `npm run build` 通过
- [ ] Daily页面有daily-hero-bg.png背景（opacity 0.08）
- [ ] 卷轴纸张使用mountain-scroll-bg.jpg纹理（opacity 0.15）
- [ ] 卷轴顶部有scroll-unroll.png装饰滑入动画
- [ ] 分数印章使用seal-stamp.png + 盖印spring动画
- [ ] 印章上叠加等级文字，可读
- [ ] 红线装饰在AI解读区上方
- [ ] 卦名、分数字体加大，层级清晰
- [ ] goldenQuote添加引号装饰

#### Git操作

```bash
git checkout -b agent-5c-daily-scroll
git add -A
git commit -m "feat(daily): scroll texture + seal stamp animation + red thread decoration + layout upgrade"
git remote set-url origin https://miemiege:【TOKEN】@github.com/miemiege/mysticdao-frontend.git
git push -u origin agent-5c-daily-scroll
```

---

### 任务4：社交系统 — 卡册3D翻转 + 运势PK + 匿名留言板

**Agent编号：** 5D  
**工作分支：** `agent-5d-social`  
**参考图：** H~J（MysticDao Tarot截图，设计基线）  
**public素材：** tarot-card-back.png、bazi-hero-bg.png、fengshui-hero-bg.png、bagua-3d.png、bagua-geometry.png  

#### 参考图使用说明

| 参考图 | 具体融入点 | 代码实现 |
|:---|:---|:---|
| H~J（Tarot截图） | 设计基线：黑金配色、圆角卡片、金色边框光晕 | 所有新组件严格遵循现有设计规范（black bg + gold #C8A45C + border-gold/10 + rounded-2xl） |

#### 基线代码现状

- `src/lib/storage.ts`：已有 `getFavorites()` / `addFavorite()` / `removeFavorite()` / `isFavorite()`
- `src/lib/cardRarity.ts`：已有 `getRarity(score, hexagramNumber)` 和 `getRarityInfo(rarity)`
- 无 CardAlbum / CardFlip / FortunePK / AnonymousBoard 组件
- `src/pages/UserProfile.tsx`：需要添加Tab导航

#### 具体开发要求

**P0 — 必须完成**

1. **CardFlip 3D翻转组件**
   - 文件：`src/components/daily/CardFlip.tsx`（新建）
   ```tsx
   import React, { useState } from 'react';
   import { motion } from 'framer-motion';
   import type { Rarity, RarityInfo } from '@/lib/cardRarity';
   
   interface CardFlipProps {
     front: React.ReactNode;
     backImage?: string;
     rarity: Rarity;
     rarityInfo: RarityInfo;
     onClick?: () => void;
   }
   
   const CardFlip: React.FC<CardFlipProps> = ({ front, backImage = '/tarot-card-back.png', rarity, rarityInfo, onClick }) => {
     const [isFlipped, setIsFlipped] = useState(false);
     
     return (
       <div className="group cursor-pointer" style={{ perspective: '1000px' }} onClick={() => { setIsFlipped(!isFlipped); onClick?.(); }}>
         <motion.div
           className="relative w-full"
           style={{ transformStyle: 'preserve-3d' }}
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
         >
           {/* 正面 */}
           <div className="relative rounded-2xl overflow-hidden border-2" style={{ borderColor: rarityInfo.color + '40', backfaceVisibility: 'hidden' }}>
             {front}
           </div>
           
           {/* 背面 */}
           <div className="absolute inset-0 rounded-2xl overflow-hidden border-2" style={{ borderColor: rarityInfo.color + '40', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
             <img src={backImage} alt="" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/20" />
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-gold/60 text-sm tracking-wider">Tap to Reveal</span>
             </div>
           </div>
         </motion.div>
       </div>
     );
   };
   
   export default CardFlip;
   ```
   - `perspective: 1000px` 在父容器
   - `transformStyle: 'preserve-3d'` 在motion.div
   - `backfaceVisibility: 'hidden'` 在正反面
   - 背面使用 `tarot-card-back.png` 作为背景

2. **CardAlbum 卡册组件**
   - 文件：`src/components/daily/CardAlbum.tsx`（新建）
   ```tsx
   import React, { useState } from 'react';
   import { motion, AnimatePresence } from 'framer-motion';
   import { X, Trash2 } from 'lucide-react';
   import { getFavorites, removeFavorite } from '@/lib/storage';
   import { getRarity, getRarityInfo } from '@/lib/cardRarity';
   import CardFlip from './CardFlip';
   import TalismanSVG from '@/components/talisman/TalismanSVG';
   import type { FavoriteItem } from '@/lib/storage';
   
   type FilterRarity = 'all' | 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
   
   const CardAlbum: React.FC = () => {
     const [favorites, setFavorites] = useState<FavoriteItem[]>(getFavorites());
     const [filter, setFilter] = useState<FilterRarity>('all');
     
     const filtered = favorites.filter(f => {
       if (filter === 'all') return true;
       const score = f.data?.fortune?.overallScore || 50;
       const hexNum = f.data?.fortune?.card?.number || 1;
       const rarity = getRarity(score, hexNum);
       return rarity === filter;
     });
     
     const handleRemove = (id: string) => {
       removeFavorite(id);
       setFavorites(getFavorites());
     };
     
     return (
       <div>
         {/* 筛选栏 */}
         <div className="flex flex-wrap gap-2 mb-6">
           {(['all','common','rare','epic','legendary','mythic'] as FilterRarity[]).map(r => (
             <button key={r} onClick={() => setFilter(r)}
               className={`px-3 py-1.5 rounded-full text-xs tracking-wider transition-all ${
                 filter === r ? 'bg-gold/15 text-gold border border-gold/30' : 'bg-gold/5 text-text-muted border border-gold/10 hover:text-gold/70'
               }`}>
               {r === 'all' ? '全部' : getRarityInfo(r as Rarity).label}
             </button>
           ))}
         </div>
         
         {/* 卡片网格 */}
         {filtered.length === 0 ? (
           <div className="text-center py-16">
             <div className="text-6xl mb-4 opacity-20">☯</div>
             <p className="text-text-muted text-sm mb-4">还没有收藏的卦象，去抽一张吧</p>
             <a href="/#/daily" className="inline-flex items-center px-5 py-2 rounded-full border border-gold/20 text-gold text-xs hover:bg-gold/10 transition-all">
               去抽卦 →
             </a>
           </div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <AnimatePresence>
               {filtered.map((fav, i) => {
                 const score = fav.data?.fortune?.overallScore || 50;
                 const hexNum = fav.data?.fortune?.card?.number || 1;
                 const rarity = getRarity(score, hexNum);
                 const rarityInfo = getRarityInfo(rarity);
                 const fortune = fav.data?.fortune;
                 
                 return (
                   <motion.div key={fav.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}>
                     <CardFlip
                       rarity={rarity}
                       rarityInfo={rarityInfo}
                       front={(
                         <div className="relative bg-black p-4">
                           {/* 符咒缩略图 */}
                           <div className="flex justify-center mb-3">
                             <TalismanSVG
                               hexagramName={fortune?.card?.name || '未知'}
                               blessingTheme={fortune?.card?.keyword || ''}
                               element="金"
                               category=""
                               seed={hexNum}
                               score={score}
                               width={120}
                               height={180}
                               showSeal={false}
                             />
                           </div>
                           {/* 卦名 */}
                           <div className="text-center">
                             <h3 className="text-gold font-bold text-lg" style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}>
                               {fortune?.card?.name || '未知'}
                             </h3>
                             <div className="flex items-center justify-center gap-2 mt-2">
                               <span className="text-2xl font-bold text-gold">{score}</span>
                               <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: rarityInfo.color + '20', color: rarityInfo.color, border: `1px solid ${rarityInfo.color}40` }}>
                                 {rarityInfo.label}
                               </span>
                             </div>
                             <p className="text-[10px] text-text-muted mt-1">{new Date(fav.date).toLocaleDateString()}</p>
                           </div>
                           {/* 删除按钮 */}
                           <button onClick={(e) => { e.stopPropagation(); handleRemove(fav.id); }}
                             className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-all">
                             <Trash2 size={14} />
                           </button>
                         </div>
                       )}
                     />
                   </motion.div>
                 );
               })}
             </AnimatePresence>
           </div>
         )}
       </div>
     );
   };
   
   export default CardAlbum;
   ```
   - 3列（桌面）/ 2列（平板）/ 1列（手机）
   - 按稀有度筛选
   - 空状态引导去抽卦
   - 卡片正面：符咒缩略图 + 卦名 + 分数 + 稀有度标签 + 日期 + 删除按钮
   - 卡片背面：`tarot-card-back.png`

3. **FortunePK 运势PK组件**
   - 文件：`src/components/daily/FortunePK.tsx`（新建）
   ```tsx
   import React, { useState } from 'react';
   import { motion } from 'framer-motion';
   import { GUA64_LIST } from '@/data/gua64';
   import { getHexagramTalisman } from '@/data/hexagram-talismans';
   import { getTheme } from '@/lib/theme';
   import HexagramDraw from './HexagramDraw';
   import type { Yao } from './HexagramDraw';
   
   const FortunePK: React.FC = () => {
     const [opponentGua, setOpponentGua] = useState(GUA64_LIST[0]);
     const [showResult, setShowResult] = useState(false);
     
     // Mock user data (in real app, get from storage)
     const userScore = 78;
     const userScores = { career: 82, love: 75, wealth: 70, health: 85 };
     const opponentScore = 65 + Math.floor(Math.random() * 30);
     const opponentScores = { career: 70, love: 60, wealth: 75, health: 65 };
     
     const dimensions = [
       { key: 'total', label: '总分', user: userScore, opp: opponentScore },
       { key: 'career', label: '事业', user: userScores.career, opp: opponentScores.career },
       { key: 'love', label: '感情', user: userScores.love, opp: opponentScores.love },
       { key: 'wealth', label: '财富', user: userScores.wealth, opp: opponentScores.wealth },
       { key: 'health', label: '健康', user: userScores.health, opp: opponentScores.health },
     ];
     
     const userWins = dimensions.filter(d => d.user > d.opp).length;
     const resultText = userWins >= 3 ? '您的运势更胜一筹 ✨' : '对手运势略占上风 ⚡';
     
     return (
       <div>
         {/* 选择对手 */}
         <div className="flex items-center gap-4 mb-8">
           <div className="flex-1 text-center p-4 rounded-2xl border border-gold/10 bg-gold/[0.03]">
             <div className="text-xs text-gold/50 mb-2">您的卦象</div>
             <div className="text-2xl font-bold text-gold">乾为天</div>
             <div className="text-sm text-gold/60">Score: {userScore}</div>
           </div>
           <div className="text-3xl font-bold text-gold/40">VS</div>
           <div className="flex-1">
             <select
               value={opponentGua.name}
               onChange={(e) => { setOpponentGua(GUA64_LIST.find(g => g.name === e.target.value) || GUA64_LIST[0]); setShowResult(false); }}
               className="w-full p-4 rounded-2xl border border-gold/10 bg-gold/[0.03] text-gold text-center appearance-none cursor-pointer"
             >
               {GUA64_LIST.map(g => (
                 <option key={g.name} value={g.name}>{g.name}</option>
               ))}
             </select>
           </div>
         </div>
         
         <button onClick={() => setShowResult(true)}
           className="w-full py-3 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm hover:bg-gold/20 transition-all mb-8">
           开始对比
         </button>
         
         {showResult && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             {/* 3D八卦装饰 */}
             <div className="flex justify-center mb-6">
               <img src="/bagua-3d.png" alt="" className="w-24 h-24 object-contain opacity-30" aria-hidden="true" />
             </div>
             
             {/* 5维度对比 */}
             <div className="space-y-4">
               {dimensions.map((d, i) => {
                 const max = Math.max(d.user, d.opp, 1);
                 const userPct = (d.user / max) * 100;
                 const oppPct = (d.opp / max) * 100;
                 const userColor = '#C8A45C';
                 const oppColor = '#8B7355';
                 
                 return (
                   <motion.div key={d.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                     <div className="flex items-center gap-3">
                       <span className="text-xs text-text-muted w-10 text-right">{d.label}</span>
                       <div className="flex-1 flex items-center gap-2">
                         {/* User bar */}
                         <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                           <motion.div className="h-full rounded-full" style={{ background: userColor, boxShadow: d.user > d.opp ? `0 0 8px ${userColor}50` : 'none' }}
                             initial={{ width: 0 }} animate={{ width: `${userPct}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }} />
                         </div>
                         <span className="text-xs text-gold w-6 text-right">{d.user}</span>
                         <span className="text-xs text-text-muted/50">vs</span>
                         <span className="text-xs text-white/40 w-6">{d.opp}</span>
                         {/* Opponent bar */}
                         <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                           <motion.div className="h-full rounded-full" style={{ background: oppColor }}
                             initial={{ width: 0 }} animate={{ width: `${oppPct}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }} />
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 );
               })}
             </div>
             
             {/* 结果 */}
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center mt-6">
               <span className="text-gold text-lg font-bold">{resultText}</span>
             </motion.div>
           </motion.div>
         )}
       </div>
     );
   };
   
   export default FortunePK;
   ```
   - 左侧：当前用户卦象（固定显示）
   - 右侧：下拉选择对手卦象（从GUA64_LIST）
   - 中间：VS大字
   - 点击"开始对比"后：
     - 3D八卦装饰（bagua-3d.png）
     - 5维度进度条动画（1s easeOutExpo）
     - 高的一方有金色光晕 `box-shadow: 0 0 8px rgba(200,164,92,0.3)`
     - 结果文案

4. **AnonymousBoard 匿名留言板**
   - 文件：`src/components/daily/AnonymousBoard.tsx`（新建）
   ```tsx
   import React, { useState } from 'react';
   import { motion, AnimatePresence } from 'framer-motion';
   import { Heart, Send } from 'lucide-react';
   
   interface BoardMessage {
     id: string;
     text: string;
     timestamp: number;
     likes: number;
   }
   
   const STORAGE_KEY = 'mysticdao_board';
   
   function getBoardMessages(): BoardMessage[] {
     try {
       return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
     } catch { return []; }
   }
   
   function saveBoardMessages(msgs: BoardMessage[]) {
     localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-30)));
   }
   
   const AnonymousBoard: React.FC = () => {
     const [messages, setMessages] = useState<BoardMessage[]>(getBoardMessages());
     const [input, setInput] = useState('');
     const [likedIds, setLikedIds] = useState<Set<string>>(() => {
       try { return new Set(JSON.parse(localStorage.getItem('mysticdao_board_likes') || '[]')); }
       catch { return new Set(); }
     });
     
     const handleSubmit = () => {
       if (!input.trim() || input.length > 140) return;
       const msg: BoardMessage = { id: Date.now().toString(), text: input.trim(), timestamp: Date.now(), likes: 0 };
       const next = [...messages, msg];
       setMessages(next);
       saveBoardMessages(next);
       setInput('');
     };
     
     const handleLike = (id: string) => {
       if (likedIds.has(id)) return;
       const nextLiked = new Set(likedIds);
       nextLiked.add(id);
       setLikedIds(nextLiked);
       localStorage.setItem('mysticdao_board_likes', JSON.stringify([...nextLiked]));
       const next = messages.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m);
       setMessages(next);
       saveBoardMessages(next);
     };
     
     return (
       <div>
         {/* 发布框 */}
         <div className="mb-6 p-4 rounded-2xl border border-gold/10 bg-gold/[0.03]">
           <textarea
             value={input}
             onChange={(e) => setInput(e.target.value.slice(0, 140))}
             placeholder="分享你的感悟...（匿名，140字内）"
             className="w-full bg-transparent text-sm text-white/80 placeholder:text-text-muted resize-none outline-none min-h-[80px]"
           />
           <div className="flex items-center justify-between mt-2">
             <span className="text-[10px] text-text-muted">{input.length}/140</span>
             <button onClick={handleSubmit} disabled={!input.trim()}
               className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs hover:bg-gold/20 transition-all disabled:opacity-30">
               <Send size={12} /> 发布
             </button>
           </div>
         </div>
         
         {/* 留言列表 */}
         <div className="space-y-3">
           <AnimatePresence>
             {[...messages].reverse().map((msg, i) => (
               <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                 <div className="p-4 rounded-xl border border-gold/[0.06] bg-white/[0.02]">
                   <p className="text-sm text-white/70 leading-relaxed">{msg.text}</p>
                   <div className="flex items-center justify-between mt-3">
                     <span className="text-[10px] text-text-muted">{new Date(msg.timestamp).toLocaleString()}</span>
                     <button onClick={() => handleLike(msg.id)}
                       className={`inline-flex items-center gap-1 text-[10px] transition-all ${likedIds.has(msg.id) ? 'text-red-400' : 'text-text-muted hover:text-red-400'}`}>
                       <Heart size={12} className={likedIds.has(msg.id) ? 'fill-red-400' : ''} /> {msg.likes}
                     </button>
                   </div>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>
         </div>
       </div>
     );
   };
   
   export default AnonymousBoard;
   ```
   - localStorage存储，key `mysticdao_board`
   - 140字限制，实时字数显示
   - 最多保留30条
   - 点赞持久化（localStorage记录已点赞id）

5. **UserProfile 集成Tab导航**
   - 文件：`src/pages/UserProfile.tsx`（修改，添加Tab）
   - 在页面中添加3个Tab：卡册 / 运势PK / 留言板
   - 引入 CardAlbum、FortunePK、AnonymousBoard 组件
   - 统计信息：收藏数（来自getFavorites().length）、抽卦次数（来自history长度）

**P1 — 加分项**

6. **卡册背面添加 bagua-geometry.png 纹理**
   - 在 CardFlip 背面，tarot-card-back.png 之上叠加 bagua-geometry.png（opacity 0.1）

#### 素材调用清单

| 素材路径 | 使用位置 | 使用方式 | 尺寸/透明度 |
|:---|:---|:---|:---|
| `/tarot-card-back.png` | CardFlip背面 | `object-cover` 全卡背景 | 100%, backface-hidden |
| `/bagua-3d.png` | FortunePK对比结果 | 居中装饰 | 96x96px, opacity 0.3 |
| `/bagua-geometry.png` | CardFlip背面叠加 | 纹理叠加 | opacity 0.1 |
| `/bazi-hero-bg.png` | FortunePK背景 | 可选 | 未强制使用 |
| `/fengshui-hero-bg.png` | FortunePK背景 | 可选 | 未强制使用 |

#### 验收标准

- [ ] `npm run build` 通过
- [ ] CardFlip 3D翻转正常（perspective + preserve-3d + backface-visibility）
- [ ] CardAlbum显示收藏卦象，3D翻转
- [ ] 按稀有度筛选有效
- [ ] 空状态有引导按钮
- [ ] FortunePK有5维度进度条动画
- [ ] 高的一方有金色光晕
- [ ] AnonymousBoard可发布、点赞
- [ ] UserProfile有3个Tab
- [ ] 设计符合黑金配色基线（H~J截图风格）

#### Git操作

```bash
git checkout -b agent-5d-social
git add -A
git commit -m "feat(social): card album 3D flip + fortune PK + anonymous board + user profile tabs"
git remote set-url origin https://miemiege:【TOKEN】@github.com/miemiege/mysticdao-frontend.git
git push -u origin agent-5d-social
```

---

### 任务5：性能优化 — 代码分割 + 懒加载 + 压缩 + Bundle瘦身

**Agent编号：** 5E  
**工作分支：** `agent-5e-performance`  
**参考图：** 无  
**public素材：** 所有图片素材（优化加载策略）  

#### 基线代码现状

`vite.config.ts`：
- 无 `manualChunks`
- 无 `vite-plugin-compression`
- 无 `rollup-plugin-visualizer`

`src/App.tsx`：
- 所有页面同步导入
- 无 `React.lazy`
- 无 `Suspense`

当前Bundle：549KB gzip / 1959KB minified

#### 具体开发要求

**P0 — 必须完成**

1. **vite.config.ts 代码分割（manualChunks）**
   - 文件：`vite.config.ts`
   ```ts
   import path from "path"
   import react from "@vitejs/plugin-react"
   import { defineConfig } from "vite"
   import { inspectAttr } from 'plugin-inspect-react-code'
   
   export default defineConfig({
     base: './',
     plugins: [inspectAttr(), react()],
     server: {
       port: 3003,
       proxy: {
         '/api': {
           target: 'http://localhost:3001',
           changeOrigin: true,
         },
       },
     },
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom', 'react-router-dom'],
             motion: ['framer-motion'],
             ui: ['lucide-react', 'sonner'],
           },
         },
       },
       chunkSizeWarningLimit: 500,
     },
   });
   ```
   - `vendor`: React核心库
   - `motion`: framer-motion
   - `ui`: lucide-react + sonner
   - 注意：不要拆分太细，避免HTTP请求过多

2. **路由懒加载（React.lazy + Suspense）**
   - 文件：`src/App.tsx`
   ```tsx
   import { Routes, Route } from 'react-router-dom'
   import { Suspense, lazy } from 'react'
   import Layout from './components/Layout'
   import TaijiLoader from './components/TaijiLoader'
   
   const Home = lazy(() => import('./pages/Home'))
   const Bazi = lazy(() => import('./pages/Bazi'))
   const Pricing = lazy(() => import('./pages/Pricing'))
   const Daily = lazy(() => import('./pages/Daily'))
   const FengShui = lazy(() => import('./pages/FengShui'))
   const CompassPage = lazy(() => import('./pages/CompassPage'))
   
   export default function App() {
     return (
       <Suspense fallback={<TaijiLoader />}>
         <Routes>
           <Route element={<Layout />}>
             <Route path="/" element={<Home />} />
             <Route path="/bazi" element={<Bazi />} />
             <Route path="/fengshui" element={<FengShui />} />
             <Route path="/pricing" element={<Pricing />} />
             <Route path="/daily" element={<Daily />} />
             <Route path="/compass" element={<CompassPage />} />
             <Route path="*" element={<Home />} />
           </Route>
         </Routes>
       </Suspense>
     )
   }
   ```
   - 所有页面使用 `React.lazy`
   - `Suspense` fallback 使用 `TaijiLoader`（已有组件）
   - `Layout` 不懒加载（需要立即显示导航）

3. **图片加载优化**
   - **所有非首屏素材**添加 `loading="lazy"` 和 `decoding="async"`：
     - `service-*.jpg`（FeatureSection卡片）
     - `mountain-scroll-bg.jpg`（Daily结果页）
     - `cinnabar-seal.png`（符咒印章）
     - `cloud-pattern-border.png`（符咒边框）
     - `scroll-unroll.png`（卷轴装饰）
     - `seal-stamp.png`（分享卡片）
     - `tarot-card-back.png`（卡册背面）
     - `bagua-3d.png`（PK装饰）
   - **首屏素材**（hero背景）保持 `eager` 或默认
   - 在 `index.html` 中添加首屏素材预加载：
   ```html
   <link rel="preload" as="image" href="/hero-ink-wash-bg.jpg" />
   <link rel="preload" as="image" href="/hero-mandala-bg.png" />
   <link rel="preload" as="image" href="/hero-fog-layer.png" />
   ```

**P1 — 加分项**

4. **压缩插件**
   - 安装：`npm install -D vite-plugin-compression`
   - 添加到 vite.config.ts：
   ```ts
   import compression from 'vite-plugin-compression'
   
   plugins: [
     inspectAttr(),
     react(),
     compression({ algorithm: 'gzip', ext: '.gz' }),
     compression({ algorithm: 'brotliCompress', ext: '.br' }),
   ],
   ```
   - 构建后 dist/ 目录应包含 .gz 和 .br 文件

5. **Bundle分析**
   - 安装：`npm install -D rollup-plugin-visualizer`
   - 添加到 vite.config.ts：
   ```ts
   import { visualizer } from 'rollup-plugin-visualizer'
   
   plugins: [
     // ... other plugins
     visualizer({ open: false, filename: 'dist/stats.html' }),
   ],
   ```

#### 素材加载策略

| 素材 | 加载方式 | 原因 |
|:---|:---|:---|
| hero-ink-wash-bg.jpg | `preload` | 首屏背景，必须立即加载 |
| hero-mandala-bg.png | `preload` | 首屏装饰，已在使用 |
| hero-fog-layer.png | `preload` | 首屏装饰，已在使用 |
| service-*.jpg | `loading="lazy"` | 非首屏，滚动后才可见 |
| mountain-scroll-bg.jpg | `loading="lazy"` | Daily结果页非首屏 |
| cinnabar-seal.png | `loading="lazy"` | 符咒内非首屏 |
| cloud-pattern-border.png | `loading="lazy"` | 符咒内非首屏 |
| scroll-unroll.png | `loading="lazy"` | 卷轴展开动画时加载 |
| seal-stamp.png | `loading="lazy"` | 分享卡片内 |
| tarot-card-back.png | `loading="lazy"` | 卡册内 |
| bagua-3d.png | `loading="lazy"` | PK结果内 |
| daily-hero-bg.png | `loading="lazy"` | Daily页面背景 |
| red-thread-visual.png | `loading="lazy"` | 装饰元素 |

#### 验收标准

- [ ] `npm run build` 通过
- [ ] 首屏chunk（vendor + 首页）< 200KB gzip
- [ ] 总bundle < 400KB gzip
- [ ] dist/ 目录有 .gz 文件（如果安装compression）
- [ ] 路由切换正常，无白屏
- [ ] 非首屏图片有 `loading="lazy"`
- [ ] index.html 有首屏素材 preload
- [ ] React.lazy + Suspense 正常工作

#### Git操作

```bash
git checkout -b agent-5e-performance
git add -A
git commit -m "feat(perf): manual chunks + lazy loading + image optimization + compression"
git remote set-url origin https://miemiege:【TOKEN】@github.com/miemiege/mysticdao-frontend.git
git push -u origin agent-5e-performance
```

---

## 六、素材-任务映射矩阵

| 素材路径 | 任务5A | 任务5B | 任务5C | 任务5D | 任务5E |
|:---|:---:|:---:|:---:|:---:|:---:|
| `/hero-ink-wash-bg.jpg` | ✅ 首屏背景 | | | | ✅ preload |
| `/hero-ink-wash.jpg` | ✅ body底纹 | | | | |
| `/hero-mandala-bg.png` | ✅ 已用 | | | | ✅ preload |
| `/hero-fog-layer.png` | ✅ 已用 | | | | ✅ preload |
| `/service-bazi.jpg` | ✅ Bazi卡片 | | | | ✅ lazy |
| `/service-fengshui.jpg` | ✅ FengShui卡片 | | | | ✅ lazy |
| `/service-love.jpg` | ✅ Daily卡片 | | | | ✅ lazy |
| `/service-tarot.jpg` | ✅ Premium卡片 | | | | ✅ lazy |
| `/cinnabar-seal.png` | | ✅ 符咒印章 | | | ✅ lazy |
| `/cloud-pattern-border.png` | | ✅ 符咒边框 | | | ✅ lazy |
| `/seal-stamp.png` | | ✅ 分享海报 | ✅ Daily印章 | | ✅ lazy |
| `/mountain-scroll-bg.jpg` | | | ✅ 卷轴纸张 | | ✅ lazy |
| `/scroll-unroll.png` | | | ✅ 卷轴装饰 | | ✅ lazy |
| `/daily-hero-bg.png` | | | ✅ Daily背景 | | ✅ lazy |
| `/red-thread-visual.png` | | | ✅ 红线装饰 | | ✅ lazy |
| `/tarot-card-back.png` | | | | ✅ 卡册背面 | ✅ lazy |
| `/bagua-3d.png` | | | | ✅ PK装饰 | ✅ lazy |
| `/bagua-geometry.png` | | | | ✅ 背面纹理(可选) | ✅ lazy |
| `/bazi-hero-bg.png` | | | | (可选) | ✅ lazy |
| `/fengshui-hero-bg.png` | | | | (可选) | ✅ lazy |

---

## 七、合并顺序与部署流程

### 7.1 合并顺序（严格按此顺序）

```
agent-5e-performance（性能基础，先打）
  ↓
agent-5a-home-visual（首页素材）
  ↓
agent-5b-talisman-share（符咒+分享素材）
  ↓
agent-5c-daily-scroll（Daily素材）
  ↓
agent-5d-social（社交系统）
```

**原因：**
1. 5E 先打：代码分割和懒加载是基础，其他任务在此基础上增加代码
2. 5A 其次：首页是最直观的改动，用户最先看到
3. 5B 和 5C 可以并行：符咒和Daily是独立模块
4. 5D 最后：社交系统依赖前面的组件和样式

### 7.2 合并脚本（给CLI Agent使用）

```bash
# 1. 切回基线分支
git checkout v5.0-rebuild

# 2. 合并 5E（性能）
git merge agent-5e-performance --no-edit
npm run build
# 检查 bundle size

# 3. 合并 5A（首页）
git merge agent-5a-home-visual --no-edit
npm run build

# 4. 合并 5B（符咒）
git merge agent-5b-talisman-share --no-edit
npm run build

# 5. 合并 5C（Daily）
git merge agent-5c-daily-scroll --no-edit
npm run build

# 6. 合并 5D（社交）
git merge agent-5d-social --no-edit
npm run build

# 7. 最终验证
npx tsc --noEmit
npm run build

# 8. 打tag
git tag v5.0.0
git push origin v5.0.0

# 9. 部署
npx gh-pages -d dist
```

### 7.3 冲突解决原则

1. **如果5A和5E冲突**（如App.tsx同时被修改）：
   - 保留5E的懒加载代码
   - 保留5A的样式修改
   - 手动合并两者

2. **如果5B和5C冲突**（如Daily.tsx同时被修改）：
   - 5B修改ShareCard组件
   - 5C修改Daily结果页
   - 通常不会冲突，如果冲突保留两者的修改

3. **如果5D和前面冲突**（UserProfile新增Tab）：
   - 5D新增Tab导航
   - 前面任务不修改UserProfile
   - 通常无冲突

---

## 八、附录

### 8.1 环境准备命令（每个Agent都需要）

```bash
# 路径A：复用已有目录
cd /tmp/mysticdao-frontend
git status
git pull origin v5.0-rebuild
git checkout -b agent-5X-xxx

# 路径B：全新clone
cd /tmp
rm -rf mysticdao-frontend
git clone --branch v5.0-rebuild https://github.com/miemiege/mysticdao-frontend.git
cd mysticdao-frontend
git checkout -b agent-5X-xxx

# 依赖安装
ls node_modules/react/package.json 2>/dev/null && echo "OK" || npm install
npm run build
```

### 8.2 类型检查命令

```bash
npx tsc --noEmit
```

### 8.3 构建检查命令

```bash
npm run build
# 检查 dist/assets/ 目录下的 chunk 文件大小
ls -lh dist/assets/*.js
# 检查 gzip 大小
ls -lh dist/assets/*.js.gz 2>/dev/null || echo "No gzip files"
```

### 8.4 关键文件路径速查

| 文件 | 路径 |
|:---|:---|
| 首页 | `src/pages/Home.tsx` |
| Daily | `src/pages/Daily.tsx` |
| 符咒SVG | `src/components/talisman/TalismanSVG.tsx` |
| 符咒渲染器 | `src/components/talisman/TalismanRenderer.tsx` |
| 分享卡片 | `src/components/share/ShareCard.tsx` |
| 分享海报 | `src/components/daily/SharePoster.tsx` |
| 六爻绘制 | `src/components/daily/HexagramDraw.tsx` |
| 主题 | `src/lib/theme.ts` |
| 稀有度 | `src/lib/cardRarity.ts` |
| 存储 | `src/lib/storage.ts` |
| 路由 | `src/App.tsx` |
| 构建配置 | `vite.config.ts` |
| 全局样式 | `src/index.css` |
| 太极粒子 | `src/components/home/TaijiParticles.tsx` |
| 加载动画 | `src/components/TaijiLoader.tsx` |

---

*文档版本：v5.0*  
*生成时间：2026-04-21*  
*基线分支：v5.0-rebuild*
