# 话术 — KIMI Agent 集群项目交接文档

> **唤醒词: 话术** — 阅读本文档后，你已获得 MysticDao Frontend 完整上下文。
> **当前版本**: v5.0 | **分支**: v3.1-agent-rewrite | **状态**: 核心功能开发完成

---

## 一、项目概述

**MysticDao** 是一个融合易经智慧、风水能量和正念冥想的东方神秘学 Web 应用。

- **前端仓库**: `https://github.com/miemiege/mysticdao-frontend`
- **部署地址**: `https://miemiege.github.io/mysticdao-frontend/`
- **后端**: Render部署 `localhost:3001`（开发模式）
- **技术栈**: React 19 + Vite 7 + Tailwind CSS 4 + TypeScript + HashRouter
- **包大小**: 310KB gzip（限额500KB）
- **当前分支**: `v3.1-agent-rewrite`

---

## 二、技术栈与依赖

```
React 19
TypeScript 5.x
Vite 7.x
Tailwind CSS 4.x
shadcn/ui (50+ 组件)
Framer Motion (动画)
Three.js / React Three Fiber (3D罗盘)
html2canvas (分享图导出)
Lucide React (图标)
Sonner (Toast通知)
```

**路由**: HashRouter（GitHub Pages兼容，不能用BrowserRouter）

**构建命令**:
```bash
npm install
npx tsc --noEmit    # TypeScript检查
npx vite build      # 生产构建
git push origin v3.1-agent-rewrite
npx gh-pages -d dist # 部署
```

---

## 三、代码结构

```
src/
├── pages/                    # 6个主页面
│   ├── Home.tsx             # 首页 — TaijiParticles + Hero + 功能入口
│   ├── Daily.tsx            # 每日运势 — 核心页面，状态机: idle→drawing→loading→result
│   ├── Bazi.tsx             # 八字命理 — 四柱排盘 + 命名
│   ├── FengShui.tsx         # 风水罗盘 — 指南针 + 3D罗盘 + 相机叠加
│   ├── CompassPage.tsx      # 罗盘页面
│   ├── UserProfile.tsx      # 用户页 — 卡册/签到/个人信息
│   └── Pricing.tsx          # 定价页 — 基础版/专业版/大师版
│
├── components/
│   ├── daily/               # Daily页面组件
│   │   ├── RitualDrawing.tsx      # 起卦仪式动画（铜钱→六爻绘制）
│   │   ├── HexagramDraw.tsx       # 六爻SVG逐线绘制动画
│   │   ├── FortuneCard.tsx        # 运势卡片
│   │   ├── ScoreRing.tsx          # 分数环SVG动画
│   │   ├── LuckyInfo.tsx          # 幸运信息（颜色/数字/方向）
│   │   ├── RollingNumber.tsx      # 数字滚动动画
│   │   ├── SharePoster.tsx        # 分享海报
│   │   ├── GlobalCounter.tsx      # 全局计数器（TODO: 接真实API）
│   │   ├── CardAlbum.tsx          # 卡册
│   │   ├── CardFlip.tsx           # 卡片翻转
│   │   ├── CardShare.tsx          # 卡片分享
│   │   ├── FortunePK.tsx          # 运势PK
│   │   ├── AnonymousBoard.tsx     # 匿名留言板
│   │   ├── CoinFlip.tsx           # 抛铜钱动画
│   │   ├── AnimatedSeal.tsx       # 动态印章
│   │   └── JadeCard.tsx           # 墨玉卡片（当前未使用）
│   │
│   ├── talisman/            # 符咒系统
│   │   ├── TalismanSVG.tsx        # SVG符咒生成器（符头+符胆+印章+卦爻）
│   │   └── TalismanRenderer.tsx   # AI图层+SVG fallback渲染器
│   │
│   ├── share/               # 分享系统
│   │   └── ShareCard.tsx          # 6平台分享卡 + html2canvas
│   │
│   ├── home/
│   │   └── TaijiParticles.tsx     # 太极粒子背景（Canvas 2D）
│   │
│   ├── bazi/                # 八字系统
│   │   ├── BirthForm.tsx
│   │   ├── FourPillars.tsx
│   │   ├── ReadingResult.tsx
│   │   ├── ChineseNaming.tsx
│   │   ├── ForeignerNaming.tsx
│   │   └── calendar.ts            # 节气引擎（VSOP87简化）
│   │
│   ├── fengshui/            # 风水系统
│   │   ├── BaguaMap.tsx
│   │   ├── Compass.tsx
│   │   ├── Compass3D.tsx
│   │   └── DirectionPanel.tsx
│   │
│   ├── fengshui-camera/     # 风水相机
│   │   ├── BaguaScene3D.tsx
│   │   ├── FengshuiCameraTeaser.tsx
│   │   └── models/                # 3D模型组件
│   │
│   ├── compass/
│   │   └── WebCompass.tsx         # Web指南针
│   │
│   └── ui/                  # shadcn/ui 组件库（50+组件）
│
├── data/                    # 数据层
│   ├── gua64.ts             # 64卦数据库
│   ├── hexagram-talismans.ts # 卦象→符咒映射
│   ├── bagua.ts             # 八卦数据
│   ├── yijing.ts            # 易经卦辞
│   ├── bazi/                # 八字数据（天干地支/纳音/十神/神煞）
│   ├── fengshui/            # 风水数据
│   └── namingChars.ts       # 命名用字库
│
├── hooks/
│   ├── useRitualSound.ts    # 仪式音效
│   ├── useStreak.ts         # 连续签到
│   ├── usePreload.ts        # 预加载
│   ├── useCompass.ts        # 指南针传感器
│   ├── useCamera.ts         # 相机权限
│   └── useGeolocation.ts    # 地理位置
│
├── lib/
│   ├── theme.ts             # 五行主题配色系统
│   ├── storage.ts           # localStorage封装（卡册/签到/AI缓存）
│   ├── ai-prompts.ts        # Pollinations.AI提示词
│   ├── share-platforms.ts   # 分享平台配置
│   ├── cardRarity.ts        # 卡牌稀有度系统
│   └── utils.ts             # 工具函数
│
├── services/
│   └── api.ts               # API封装（AI解读/八字/命名）
│
└── App.tsx                  # 路由入口
```

---

## 四、功能演进历史

### v3.0 基线（Agent A/B/C/D 并行开发）
- **Agent A**: 设备传感器hooks + 相机叠加层
- **Agent B**: 风水镜头相机 + 3D模型
- **Agent C**: 数字指南针 + 动画系统
- **Agent D**: CSS3D BaguaOverlay + 24山
- **成果**: 罗盘、相机、指南针、八字基础排盘

### v4.0 AI体验升级（Agent 4）
- 零延迟预加载 (usePreload)
- 呼吸打字机 (BreathingTypewriter)
- 个性化语调
- 中文命名 + 外国人中文名
- 社交分享海报 + 全局计数器
- Home页CTA升级

### v5.0 核心体验升级（当前）
- **符咒引擎**: 3符头(三清/三台/敕令) + 符胆 + 6级印章
- **AI优化**: Pollinations.AI图片生成 + SVG fallback + localStorage缓存
- **多平台分享卡**: 6平台(Web/INS/Twitter/WeChat/Universal) + html2canvas
- **主题系统**: 五行配色(金木水火土)
- **太极粒子**: TaijiParticles替换旧粒子系统
- **结果页重写**: 卷轴天启设计（推倒重来2次）
- **卡册/运势PK/留言板**: 社区功能

---

## 五、关键状态与数据流

### Daily.tsx 状态机
```
Step = 'idle' | 'drawing' | 'loading' | 'result'

idle → drawing: 用户点击"Draw Your Fortune"
drawing → loading: RitualDrawing动画完成 → 调用 handleRitualComplete
loading → result: fetchAIInterpretation返回 → 保存到localStorage
result → idle: 用户点击"Draw Again" → handleReset
```

### 追问系统
- 3个模板: career/love/caution
- 最多3轮追问
- 打字完成后显示追问按钮

### 本地存储键
```
CARDS_KEY        # 卡册数据
STREAK_KEY       # 签到数据
AI_CACHE_PREFIX  # AI图片缓存（7天过期，20张上限）
dailyState       # 每日运势状态（日期/卦象/解读）
```

---

## 六、已知问题 & TODO

| 优先级 | 问题 | 状态 |
|:---|:---|:---|
| P1 | Daily结果页视觉效果仍待优化（用户已2次推倒重来） | 🟡 最新版已部署，待验收 |
| P2 | GlobalCounter使用mock数据 | 🟡 TODO: 接真实API |
| P2 | AI图片跨域(crossOrigin)可能不稳定 | 🟡 SVG fallback已覆盖 |
| P3 | Bundle size 310KB gzip，接近500KB限额 | 🟢 可接受 |
| P4 | 商业化功能（支付/订阅/高级AI） | ⏸️ 延期至 v5.2 |
| P4 | 用户系统（登录/注册/云同步） | ⏸️ 延期至 v5.2 |

---

## 七、开发规范

### 代码风格
- TypeScript严格模式
- React函数组件 + Hooks
- Tailwind CSS工具类（不用CSS Modules）
- Framer Motion处理所有动画

### 文件命名
- 组件: PascalCase.tsx
- Hooks: useCamelCase.ts
- 工具: camelCase.ts
- 数据: camelCase.ts

### 新增组件位置
- 页面专属组件 → `src/components/{pageName}/`
- 通用组件 → `src/components/` 根目录
- 新增页面 → `src/pages/{Name}.tsx`
- 新增路由 → `src/App.tsx` 中注册

### API调用
```typescript
// 所有API调用使用 AbortController 支持取消
abortRef.current = new AbortController();
fetchAIInterpretation(data, abortRef.current.signal)
  .then(...)
  .catch(err => {
    if (err.name !== 'AbortError') { /* 处理错误 */ }
  });
```

### 安全边界
- **医疗**: 不替代专业医疗建议
- **金融**: 不提供投资建议
- **反依赖**: 强调用户自主权

---

## 八、部署流程

```bash
# 1. 开发验证
npx tsc --noEmit          # 确保0错误
npx vite build            # 确保构建成功

# 2. 提交
git add -A
git commit -m "feat: xxx"
git push origin v3.1-agent-rewrite

# 3. 部署到GitHub Pages
npx gh-pages -d dist
# 输出: Published

# 4. 验证
# 访问 https://miemiege.github.io/mysticdao-frontend/
```

**注意事项**:
- 使用 **HashRouter**（不是BrowserRouter），gh-pages不支持history API
- 构建输出在 `dist/` 目录
- `dist/404.html` 已配置SPA回退

---

## 九、后端信息

**本地开发模式**:
- 后端运行在 `localhost:3001`
- SQLite数据库
- **LOCAL-ONLY模式**: 无AI API key时返回本地模板解读
- 其他API（八字计算、命名）正常工作

**生产环境**:
- 前端: GitHub Pages
- 后端: Render（当前URL硬编码在api.ts中）

---

## 十、文化合规

- **海外推广**: 定位海外对东方文化/灵性/正念感兴趣的用户
- **符咒设计**: 基于真实道家结构（符头-符胆-符脚），有研究来源
- **免责声明**: 应用内已包含"娱乐目的"和"不替代专业建议"提示

---

## 十一、快速上手检查清单

如果你是接手的Agent，按以下顺序验证：

1. [ ] `npm install` 安装依赖
2. [ ] `npx tsc --noEmit` 0错误
3. [ ] `npx vite build` 构建成功
4. [ ] 访问 `http://localhost:5173` 首页正常
5. [ ] 点击 "Draw Your Fortune" 测试完整流程
6. [ ] 检查所有页面路由正常
7. [ ] `npx gh-pages -d dist` 部署验证

---

*话术文档 v1.0 — 生成时间: 2026-04-21*
*项目分支: v3.1-agent-rewrite*
*部署地址: https://miemiege.github.io/mysticdao-frontend/*
