# 今晚执行方案：辩论结果落地

> 基于 Mira + 玄极 + 用户需求分析师的联合决策
> 总时间：3.5 小时 | 目标：产出可构建、可预览的改造

---

## Step 0：最小 Token 骨架（30min）— 玄极执行

**文件**：`tailwind.config.js`

**目标**：不删除现有颜色，新增规范化的 Token 层级，供 Step 1-2 使用

**新增 Token**：
```js
// 背景层级（4级）
surface: {
  page: '#000000',      // 页面最底层
  card: '#0A0A0F',      // 卡片背景（带微弱蓝紫）
  elevated: '#12121A',  // 悬浮/选中
  overlay: '#000000',   // 遮罩
}

// 金色语义化（4级）
gold: {
  primary: '#C8A45C',   // 主金色（按钮、标题）
  muted: '#8B7340',     // 弱化金（次要文字）
  subtle: 'rgba(200,164,92,0.15)', // 背景、边框
  ghost: 'rgba(200,164,92,0.06)',  // 最弱点缀
}

// 印章红（分享卡专用）
seal: {
  DEFAULT: '#8B0000',   // 暗红印章
  light: '#C41E3A',     // 亮红点缀
}

// 间距 Scale（8px 网格）
space: {
  xs: '4px',   sm: '8px',   md: '16px',
  lg: '24px',  xl: '32px',  '2xl': '48px',
  '3xl': '64px', '4xl': '96px',
}

// 圆角系统（4级）
radius: {
  sm: '6px',   md: '10px',
  lg: '16px',  xl: '24px',
}
```

**向后兼容**：保留现有 `gold.DEFAULT`、`bg-primary` 等，不破坏现有页面

**验证标准**：`npm run build` 通过，0 TypeScript 错误

---

## Step 1：分享卡片升级（60min）— 玄极执行

**文件**：
- 改造 `src/components/daily/SharePoster.tsx`
- 新增 `src/components/ui/TalismanCard.tsx`（符咒风格基础组件）

**目标**：基于现有 SharePoster，增加符咒风格变体

**设计规范（参考 `(5) 上上签`）**：
```
背景：surface.card (#0A0A0F) + 暗纹纹理
主文字：竖排书法大字，黑色，金色底板衬托
印章：seal.DEFAULT (#8B0000)，圆形/方形
装饰：金色细线边框，四角花纹
底部：金色佛手/莲花装饰
```

**三种变体**：
| 变体 | 场景 | 主文字 | 印章文字 |
|------|------|--------|---------|
| `daily` | 每日运势 | "今日运势" | "吉" |
| `bazi` | 八字解读 | "八字命理" | "道" |
| `fengshui` | 风水建议 | "风水罗盘" | "顺" |

**验证标准**：
- `npm run build` 通过
- 在 Daily 页面能触发分享，生成图片正常

---

## Step 2：结果页/每日运势页改造（90min）— 玄极执行

**文件**：
- `src/components/daily/FortuneCard.tsx`（升级）
- `src/components/bazi/ReadingResult.tsx`（升级）
- `src/pages/Daily.tsx`（氛围调整）

**目标**：墨玉质感 + 安静氛围

**FortuneCard 改造**：
```
背景：从渐变改为 surface.card + 微妙内阴影
边框：gold.subtle（15%透明度金色）
文字：保持白色，增加行高至 1.8（阅读舒适）
动效：粒子保留但减少至 5 个（更克制）
```

**ReadingResult 改造**：
```
背景：surface.page + 底部墨玉渐变（参考 Aesthetic yin and yang）
卡片：surface.elevated + 左侧金色竖线（3px）
印章：在结果底部增加 seal 印章装饰
```

**Daily 页面氛围**：
```
背景：纯黑 + 底部微弱金色径向渐变（营造"地面反光"感）
整体：安静、专注、不打扰
```

**验证标准**：
- `npm run build` 通过
- Daily 页面和 Bazi 结果页视觉效果明显提升

---

## Step 3：构建验证（30min）

```bash
cd /tmp/mysticdao-frontend
npm run build
```

**通过标准**：
- 0 TypeScript 错误
- 0 构建失败
- Bundle 大小不显著增加（< 5%）

---

## 时间线

```
22:30  Step 0 开始（Token 骨架）
23:00  Step 0 完成 → 验证构建
23:00  Step 1 开始（分享卡片）
00:00  Step 1 完成 → 验证构建
00:00  Step 2 开始（结果页改造）
01:30  Step 2 完成 → 验证构建
01:30  Step 3 构建验证
02:00  全部完成，给用户截图确认
```

---

## 风险预案

| 风险 | 概率 | 对策 |
|------|------|------|
| Token 改造破坏现有页面 | 低 | 保留所有现有颜色，只新增 Token |
| SharePoster 改造导致 html2canvas 失败 | 中 | 改造前备份原文件，逐步替换 |
| 时间超支 | 中 | 如果 Step 1 超时，Step 2 只改 Daily 页，Bazi 放到明天 |
| 构建失败 | 低 | 每步结束立即构建，发现问题立即回滚 |

---

## 首页（放到明天）

明天基于今晚的 Token 系统，直接复用：
- 粒子太极（参考 `20264.23.1`）
- 书法标题
- 纯黑背景

今晚不做，因为：
- Mira：先验证分享卡和结果页的数据
- 数据：Sarah 不看首页
- 玄极：Token 骨架明天直接复用
