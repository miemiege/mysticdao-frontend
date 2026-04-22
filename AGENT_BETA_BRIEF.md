# MysticDao 前端问题清单 — AGENT BETA 集群

## 项目信息

| 项目 | 内容 |
|------|------|
| **前端地址** | http://localhost:3003 |
| **前端目录** | `/mnt/c/Users/咩咩哥/cycle_trading_system_v2/mysticdao-frontend/` |
| **后端地址** | http://localhost:3001 |
| **后端目录** | `/home/miemiege/mysticdao/` |
| **后端API** | 8个非流式接口 + 1个SSE流式接口 `/api/stream/:type` |
| **AI模型** | kimi-for-coding (推理30-90秒) |

## 现有功能

- **首页**: 品牌展示、服务介绍、定价预览
- **八字**: 表单提交 → 本地展示四柱/五行/日主/大运 → AI深度解读
- **塔罗**: 选牌阵 → 本地抽牌翻牌 → AI牌阵解读
- **风水**: 罗盘方向选择 → 每日能量指引
- **姻缘**: 双方表单 → 本地合婚计算 → AI红线解读
- **定价**: 月付/年付切换
- **关于**: 品牌故事

---

## 🔴 P0 — AI解读不显示（最严重）

**现象**: 塔罗/八字/姻缘页面提交后，等30-90秒，"灵枢AI·深度解读"区域**仍然显示默认文案**，AI解读内容没有出现。

**用户看到的实际效果**:
```
灵枢AI · 深度解读
提交表单后，灵枢AI将为您生成深度命盘解读。
若AI服务繁忙，将展示本地演示命盘。
```

**相关代码位置**:

1. **前端 SSE 接收函数**: `src/services/api.ts` 第 62-108 行 `streamAI()`
2. **塔罗调用处**: `src/pages/Tarot.tsx` 第 493-520 行 `handleBeginReading`
3. **八字调用处**: `src/pages/Bazi.tsx` 第 195-220 行 `onSubmit`
4. **姻缘调用处**: `src/pages/Love.tsx` 第 47-115 行 `handleSubmit`
5. **后端 SSE 路由**: `src/api/server.ts` 第 674-760 行 `/api/stream/:type`
6. **后端流式函数**: `src/api/server.ts` 第 70-95 行 `callAIStream()`

**当前实现方式**:
- 前端用 `fetch + res.body.getReader()` 读取 ReadableStream
- 后端用 Express `res.write('data: ...\n\n')` 推送 SSE
- OpenAI SDK `stream: true` 返回 AsyncIterable

**可能原因**:
1. Express `res.write` 默认缓冲，不立即 flush 到客户端
2. kimi-for-coding 模型 stream 模式可能不是逐段输出，而是一次性返回
3. 前端 ReadableStream 解析逻辑可能有 bug

**建议修复方向**:
- **方案A**: 放弃SSE，改用标准POST。前端显示"AI思考中..."动画，等完整结果回来后用打字机效果逐字显示
- **方案B**: 修复SSE。后端加 `res.flush()`，前端改用标准 `EventSource` API
- **方案C**: 后端改用 WebSocket

---

## 🔴 P0 — 八字柱子水和火经常没颜色

**现象**: `FourPillars` 组件中，水和火对应的柱子颜色不显示（显示为灰色/无色）。

**相关代码**:
- `src/components/bazi/FourPillars.tsx` 第 70-89 行（天干地支渲染）
- `src/components/bazi/data.ts` 第 35-41 行 `ELEMENT_COLORS`

**当前代码**:
```tsx
<motion.div
  style={{ color: stemColor }}
  initial={{ filter: 'grayscale(100%)' }}
  animate={{ filter: 'grayscale(0%)' }}
>
  {pillar.stem}
</motion.div>
```

**建议修复**: 移除 `grayscale` 动画，改用 `opacity` 淡入。或检查 `whileInView` 导致动画不触发的问题。

---

## 🟡 P1 — 等待期间枯燥（体验优化）

**现状**: AI推理30-90秒期间，用户只能看到静态文字"正在连接灵枢AI..."

**期望**: 
- 塔罗：选牌阵即开始AI计算，用户翻牌过程中后台在跑
- 所有页面：AI计算期间显示有趣的加载动画（八卦旋转、能量粒子等）

---

## 🟡 P1 — 刷新后状态丢失

**现状**: localStorage 只缓存了 AI 解读文本，没有缓存页面交互状态（已翻的牌、已提交的表单）

**期望**: 刷新页面后恢复到之前的状态

---

## 🟡 P1 — Pricing 页面排版

**现状**: 用户反馈 Pricing 页面内容需要优化排版

---

## 技术栈

- React 19 + Vite + Tailwind CSS + TypeScript
- HashRouter (`/#/path` 格式)
- framer-motion（动画）
- lucide-react（图标）
- Express + TypeScript + OpenAI SDK v4（后端）

## 重要约束

1. **所有路由为 `/#/path`**，`<a href="#/xxx">` 可以，但不要 `<a href="/xxx">` 避免整页刷新
2. **不要改动后端7个非流式API接口**，它们已经稳定运行
3. **AI推理30-90秒是kimi-for-coding固有特性**，不是代码bug
4. **429限流**: 高峰期Kimi可能返回429，前端需要优雅处理
