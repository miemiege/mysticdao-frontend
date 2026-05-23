# MysticDao 网站稳定性战备方案

> **版本**：v1.0 | **编制**：架构官·玄极 | **日期**：2026-05-22
> **状态**：草案待审 | **优先级**：P0 → P1 → P2

---

## 零、总体原则

本方案围绕 MysticDao 三大用户画像的核心诉求制定：
- **Curious Mike 的 3 秒规则**：首屏加载 > 3s = 50% 流失
- **Spiritual Sarah 的分享体验**：海报生成必须 < 2s
- **Wealthy Lisa 的隐私底线**：命盘数据本地计算，零上传

**技术底线**：没有自托管服务器，全部依赖 Serverless + CDN + 边缘计算。

---

## 一、托管与 CDN 架构（P0）

### 1.1 现状分析

当前 MysticDao 处于启动期，无国内备案，用户主要分布于北美、东南亚及中国大陆。React + Vite 构建的 SPA 对静态托管性能要求极高，但 AI 图片生成服务涉及中国大陆合规问题。Cloudflare Pages 是目前候选方案，但需与 Vercel/Netlify 做全维度对比。

### 1.2 具体方案

**选择：Cloudflare Pages（主站）+ Vercel Edge（备份/灰度）**

| 维度 | Cloudflare Pages | Vercel | Netlify |
|------|-----------------|--------|---------|
| **全球 CDN 节点** | 300+（含香港、新加坡、东京） | 100+（主要覆盖欧美） | 100+ |
| **中国大陆访问** | 香港/日本节点可达，无备案不保证 | 同左，略逊 | 同左 |
| **HTTP/3 + Brotli** | 原生支持，零配置 | 原生支持 | 原生支持 |
| **边缘函数** | Workers（50ms 冷启动） | Edge Functions | Edge Functions |
| **构建速度** | 中等 | 最快 | 中等 |
| **免费额度** | 500 构建/月，无限带宽 | 100GB 带宽/月 | 100GB 带宽/月 |
| **价格（超量）** | $0.5/百万请求 | $0.4/GB | $25/月起 |
| **中国大陆备案扩展** | 易对接国内 CDN（如又拍云） | 较难 | 较难 |

**结论**：Cloudflare Pages 胜在全球节点密度、免费带宽额度、未来双轨架构的可扩展性。Vercel 仅作为灰度发布和灾难备份，日常流量 100% 走 Cloudflare。

### 1.3 执行步骤

1. **域名与 SSL 配置**
   - 主域名：`mysticdao.app`（已购）
   - Cloudflare DNS：全站 Strict SSL（TLS 1.3），强制 HTTPS，开启 HSTS
   - 证书：Cloudflare 托管证书 + 备用 Let's Encrypt

2. **压缩与传输优化**
   - Brotli 压缩：Cloudflare 控制面板 → Speed → Optimization → Brotli（默认开启）
   - HTTP/3：Network 设置中勾选 HTTP/3 (with QUIC)
   - 0-RTT Connection Resumption：开启以降低握手延迟

3. **中国大陆双轨架构设计（未来备案时）**
   - **海外轨**：`www.mysticdao.app` → Cloudflare Pages（全球，含 AI 图片生成）
   - **国内轨**：`cn.mysticdao.app` → 又拍云/阿里云 OSS + CDN（仅静态页面，无 AI 功能）
   - **路由策略**：GeoDNS 根据用户 IP 自动分流；国内用户访问国内轨，禁用图片生成功能，保留排盘/塔罗等本地计算功能
   - **数据同步**：Git 双推送，两个仓库分别部署到海外/国内两个平台，内容一致但功能裁剪

### 1.4 预期效果

- 北美/欧洲：TTFB < 50ms，首屏 < 1.5s
- 东南亚：TTFB < 100ms，首屏 < 2s
- 中国大陆（无备案）：TTFB < 300ms（走香港/日本节点），首屏 < 2.5s
- 双轨架构就绪后，国内用户首屏 < 1.5s，合规风险降至最低

**预估成本**：$0/月（免费额度内，预计月流量 < 500GB）

---

## 二、性能优化策略（P0）

### 2.1 现状分析

React SPA 天然存在首屏加载体积大的问题。MysticDao 包含：
- 3D 罗盘/太极动画（Three.js / React Three Fiber，约 200KB gzip）
- 塔罗牌翻转动画（Framer Motion，约 60KB gzip）
- 八字排盘引擎（本地 WASM/JS，约 150KB gzip）
- AI 生成图片（1024×1024 PNG，单张约 2-5MB）
- html2canvas 海报生成（约 80KB gzip）

不加优化，首屏 JS 体积可能超过 1MB，3G 网络下加载时间 > 5s，直接触发 Mike 的流失。

### 2.2 具体方案

#### A. 代码分割与懒加载

```typescript
// 路由级懒加载
const BaziPage = lazy(() => import('./pages/BaziPage'));
const TarotPage = lazy(() => import('./pages/TarotPage'));
const TalismanPage = lazy(() => import('./pages/TalismanPage')); // 最重，单独 chunk

// 组件级懒加载（3D 罗盘）
const Compass3D = lazy(() => import('./components/Compass3D'));
```

**策略**：
- 首屏仅加载 `HomePage` + `Layout`（目标 < 200KB gzip）
- 路由预加载：鼠标 hover 导航链接时 `preload` 对应 chunk
- 使用 Vite `manualChunks` 将 `three`、`framer-motion`、`html2canvas` 拆为独立 vendor chunk

#### B. 图片资源优化（AI 生成符咒/塔罗）

| 策略 | 实施方式 |
|------|---------|
| **格式转换** | PNG → WebP（体积降 30%）→ AVIF（体积降 50%，渐进降级） |
| **多分辨率** | 缩略图 256×256（显示用），原图 1024×1024（下载/分享用） |
| **CDN 图片处理** | Cloudflare Images（$1/1000 张）或免费方案：构建时批量转换 |
| **懒加载** | `loading="lazy"` + 低清占位图（LQIP，base64 blur hash） |

**执行命令（构建流水线）**：
```bash
# 批量转换为 WebP + AVIF
npx sharp input/*.png --webp quality=80 --avif quality=60 --output dist/images/
```

#### C. html2canvas 海报生成优化

**瓶颈分析**：html2canvas 通过 DOM 读取 → Canvas 绘制 → 转 PNG，过程串行且阻塞主线程。

| 优化点 | 方案 |
|--------|------|
| **预渲染** | 用户点击"生成海报"前，在 Web Worker 中预渲染 Canvas |
| **降分辨率** | 生成时 scale = 1.5（而非 2），节省 50% 计算量 |
| **缓存结果** | 同一命盘/塔罗结果，海报只生成一次，IndexedDB 缓存 |
| **异步非阻塞** | 使用 `html2canvas-pro` 或 `modern-screenshot`，支持 offscreen canvas |
| **兜底降级** | 生成 > 2s 时，自动切换为预制的精美静态模板（文字填入） |

#### D. 3D 罗盘降级策略

```typescript
const supportsWebGL = !!document.createElement('canvas').getContext('webgl2');
const isLowEnd = navigator.hardwareConcurrency <= 4;

if (!supportsWebGL || isLowEnd) {
  return <Compass2DFallback />; // CSS 动画太极图，< 5KB
}
return <Compass3D />;
```

- **高端设备**：WebGL 2.0 + 实时光照 + 粒子特效
- **中端设备**：WebGL 1.0 + 简化材质
- **低端设备**：CSS 动画太极 SVG（60fps 无压力）
- **Reduced Motion 偏好**：完全禁用动画，静态展示

### 2.3 执行步骤

1. **Week 1**：配置 Vite `manualChunks`，路由懒加载上线
2. **Week 2**：接入 `sharp` 图片流水线，全站图片转 WebP/AVIF
3. **Week 3**：html2canvas 接入 Web Worker + IndexedDB 缓存
4. **Week 4**：3D 罗盘降级策略上线，Core Web Vitals 基线测试

### 2.4 预期效果

| 指标 | 优化前（预估） | 目标值 |
|------|--------------|--------|
| **LCP** | 4.5s | < 2.5s |
| **FID** | 200ms | < 100ms |
| **CLS** | 0.25 | < 0.1 |
| **首屏 JS** | 1.1MB | < 250KB gzip |
| **海报生成** | 3-5s | < 2s（缓存命中 < 500ms） |
| **3D 降级覆盖率** | 0% | 100%（自动检测） |

**预估成本**：$0（图片处理用构建时 `sharp`，无运行时费用）

---

## 三、AI 服务稳定性（P1）

### 3.1 现状分析

AI 图片生成依赖两条链路：
- **本地轨**：RTX 4060 8GB + ComfyUI，单张 1024×1024 约 15-30s，适合开发测试
- **云端轨**：AutoDL A100（按小时租用），单张约 3-8s，适合生产环境

当前无队列系统，用户点击直接请求，高峰期并发 = 直接崩溃。且 ComfyUI 无内置限流，RTX 4060 同时跑 2 张就 OOM。

### 3.2 具体方案

#### A. 部署架构：云端为主，本地为灾备

```
用户请求 → Cloudflare Workers（队列/路由）→ AutoDL A100（主）
                                      ↓
                                 RTX 4060（备，本地tunnel）
```

**AutoDL 接入方式**：
- 租用 A100 实例，ComfyUI 暴露 API（内网 IP + 鉴权 Token）
- 通过 frp/cloudflare tunnel 将内网 API 映射到公网
- Workers 端配置超时：30s，失败自动重试本地实例

#### B. 队列设计：Cloudflare Workers + Durable Objects

由于无自托管服务器，使用 Cloudflare Durable Objects 实现轻量队列：

```
[用户点击生成] → Workers 接收请求 → Durable Object 排队
                                          ↓
                               [当前并发 < 2?] → 转发 AutoDL
                                          ↓ 否
                               [排队位置 N] → Workers 轮询状态
                                          ↓
                               [生成完成] → 图片上传 R2 → 返回 CDN URL
```

**队列规则**：
- 单用户同时只能有 1 个生成任务
- 全局并发限制：A100 最大 3 张并行（避免 OOM）
- 超时：60s 自动取消，返回占位图
- 优先级：付费/会员用户 > 普通用户

#### C. 高峰期降级方案

| 场景 | 降级策略 |
|------|---------|
| AutoDL 实例到期/断连 | 自动切换本地 RTX 4060（通过 Cloudflare Tunnel） |
| 本地也不可用 | 返回 CDN 预生成热门模板（见 3.2D） |
| 队列长度 > 10 | 提示"当前排队人数过多，预计等待 X 分钟" |
| 用户等待 > 45s | 自动推送预生成占位图 + "生成完成后邮件通知" |

**占位图池**：预生成 50 张精美符咒/塔罗底图（无个性化文字），用户生辰八字区域以文字形式叠加，视觉损失最小。

#### D. 边缘缓存：热门模板预生成

- **预生成内容**：12 生肖 × 5 种风格 × 2 种尺寸 = 120 张符咒模板；22 张大阿卡纳塔罗牌面
- **存储**：Cloudflare R2（S3 兼容，10GB 免费/月）
- **缓存策略**：
  - 模板原图：R2 + Cloudflare CDN，`Cache-Control: public, max-age=31536000`
  - 用户生成图：R2 + CDN，`max-age=86400`（命中后长期缓存）
  - 热门运势卡片：构建时预生成，纯静态资源

### 3.3 执行步骤

1. **Week 1**：AutoDL A100 实例部署 ComfyUI，API 鉴权配置
2. **Week 2**：Cloudflare Workers + Durable Objects 队列开发上线
3. **Week 3**：R2 存储桶配置，预生成模板上传
4. **Week 4**：本地 RTX 4060 Tunnel 灾备链路测试

### 3.4 预期效果

- 单张生成耗时：3-8s（A100），降级时 < 100ms（返回预生成图）
- 服务可用性：99.5%（AutoDL 偶尔断连，降级兜底）
- 高峰期用户体验：排队透明化，无白屏/崩溃

**预估成本**：
- AutoDL A100：约 ¥2-3/小时，按日峰值 4h 计算 → ¥300-400/月
- Cloudflare R2：10GB 内免费，预计 5GB → $0
- Workers 请求：50 万次/月内免费 → $0

---

## 四、监控与容灾（P1）

### 4.1 现状分析

目前无任何监控体系。故障发现依赖用户反馈 = 灾难。需要从零搭建：
- 宕机监控（外部探测）
- 前端错误追踪（JS 异常、API 失败）
- 静态降级（后端全挂，前端仍能跑）
- 数据持久化选型（命盘历史、用户偏好）

### 4.2 具体方案

#### A. 宕机监控：双层探测

| 工具 | 用途 | 配置 | 成本 |
|------|------|------|------|
| **UptimeRobot** | 外部 HTTP 探测，5 分钟/次 | 监控首页 `/` + API `/api/health` | 免费版 50 个监控 |
| **Cloudflare Health Checks** | 边缘层探测，1 分钟/次 | 从多个区域探测源站健康 | 免费版无限 |
| **Sentry Uptime** | 前端真实用户探测（RUM） | SDK 内置心跳 | 免费版含基础功能 |

**告警链路**：
```
探测失败 → UptimeRobot 邮件/钉钉 → 5 分钟仍失败 → 触发 PagerDuty（免费个人版）
```

#### B. 前端错误追踪：Sentry

**选型结论：Sentry（免费额度充足）**

| 维度 | Sentry | LogRocket |
|------|--------|-----------|
| 免费错误事件 | 5000/月 | 1000/月 |
| 会话回放 | 500/月 | 1000/月 |
| 性能监控 | 含 | 含 |
| React 集成 | 官方 SDK，完美支持 Error Boundary | 较繁琐 |

**Sentry 配置要点**：
- React Error Boundary 包裹所有路由
- 采样率：生产环境 10% 性能采样，100% 错误采样
- 敏感信息过滤：命盘数据、生辰八字不上报（BEFORE_SEND 钩子脱敏）
- 自定义标签：`page`、`feature`、`deviceTier`

#### C. 关键页面静态降级

**核心原则**：即使后端（Workers / AutoDL / R2）全部宕机，用户仍能：
1. 访问首页（纯静态 HTML）
2. 使用八字排盘（纯本地 WASM 计算）
3. 抽塔罗牌（本地伪随机算法，无 AI 解读）
4. 查看静态运势内容（预生成 JSON 嵌入构建产物）

**降级架构**：
```
Cloudflare Pages（静态 HTML/JS）→ 优先调用 Workers API
                                ↓ 失败（超时 3s）
                          本地计算 / 预生成内容 / 缓存数据
```

**实现方式**：所有 API 调用包装为 `fetchWithFallback`，超时自动切换本地模式。

```typescript
async function fetchWithFallback<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    return fallback;
  }
}
```

#### D. 数据库选型

| 需求 | 方案 | 理由 |
|------|------|------|
| **命盘历史** | IndexedDB（本地） | Lisa 的隐私需求，零上传 |
| **用户偏好** | IndexedDB（本地） | 主题、语言、排盘设置 |
| **分享海报** | R2 CDN URL（短期） | 7 天过期，无持久化 |
| **全局统计** | Cloudflare Analytics | 无需数据库，免费 |
| **未来扩展** | Cloudflare D1 | SQLite 边缘数据库，如需服务端持久化时启用 |

**D1 预留**：当需要跨设备同步、用户账户系统时启用。当前阶段纯 IndexedDB 即可。

### 4.3 执行步骤

1. **Week 1**：UptimeRobot + Cloudflare Health Checks 配置上线
2. **Week 2**：Sentry React SDK 接入，Error Boundary 部署
3. **Week 3**：所有 API 调用接入 `fetchWithFallback`，本地降级模式测试
4. **Week 4**：IndexedDB 封装层完成，命盘历史/偏好本地存储上线

### 4.4 预期效果

- 故障发现时间：从"用户反馈"降至 < 5 分钟
- 前端错误定位：从"无法复现"到"精确到代码行 + 用户路径回放"
- 后端全挂时：核心功能（排盘/塔罗/静态内容）100% 可用
- 数据隐私：命盘信息 100% 本地，零服务端传输

**预估成本**：$0（全部在免费额度内）

---

## 五、技术架构拓扑图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              用户访问层                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ 北美/欧洲   │  │ 东南亚      │  │ 中国大陆    │  │ 全球备份    │        │
│  │ (直接访问)  │  │ (直接访问)  │  │ (GeoDNS)    │  │ (Vercel)    │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         └─────────────────┴─────────────────┘                │               │
│                           │                                  │               │
│                    ┌──────▼──────┐                    ┌──────▼──────┐        │
│                    │ Cloudflare  │◄───────────────────│  灰度/灾备  │        │
│                    │   Pages     │                    │   Vercel    │        │
│                    │  (主站点)   │                    │  (备用源)   │        │
│                    └──────┬──────┘                    └─────────────┘        │
│                           │                                                 │
│         ┌─────────────────┼─────────────────┐                               │
│         ▼                 ▼                 ▼                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                         │
│  │ 静态资源    │  │ 边缘函数    │  │ 图片/CDN    │                         │
│  │ (HTML/JS)   │  │ (Workers)   │  │ (R2 + CDN)  │                         │
│  │ Brotli/HTTP3│  │ 队列/路由   │  │ WebP/AVIF   │                         │
│  └─────────────┘  └──────┬──────┘  └─────────────┘                         │
│                          │                                                  │
│  ┌───────────────────────┼───────────────────────┐                          │
│  ▼                       ▼                       ▼                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                         │
│  │ AutoDL A100 │  │ 本地RTX4060 │  │ 预生成模板  │                         │
│  │ (主生成节点)│  │ (灾备节点)  │  │ (R2 缓存)   │                         │
│  │ ComfyUI API │  │ CF Tunnel   │  │ 热门符咒    │                         │
│  │ 队列限制 3  │  │ 限流 1 并发 │  │ 塔罗牌面    │                         │
│  └─────────────┘  └─────────────┘  └─────────────┘                         │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                            监控与数据层                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ UptimeRobot │  │ Sentry      │  │ IndexedDB   │  │ CF Analytics│        │
│  │ (宕机探测)  │  │ (错误追踪)  │  │ (本地数据)  │  │ (访问统计)  │        │
│  │ 5min/次     │  │ 5K事件/月   │  │ 命盘/偏好   │  │ 无侵入      │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                            降级模式（后端全挂时）                            │
│                                                                             │
│   首页 ──► 静态 HTML ✅     八字排盘 ──► WASM 本地计算 ✅                   │
│   塔罗 ──► 本地伪随机 ✅     运势 ──► 预生成 JSON ✅                        │
│   符咒生成 ──► 返回占位图 + 提示排队 ❌（需后端）                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 六、成本总览

| 服务/资源 | 月度预估 | 备注 |
|-----------|---------|------|
| Cloudflare Pages | $0 | 免费额度内 |
| Cloudflare Workers | $0 | 50万次/月免费 |
| Cloudflare R2 | $0 | 10GB/月免费 |
| AutoDL A100 | ¥300-400 | 按日峰值 4h 弹性租用 |
| UptimeRobot | $0 | 免费版 50 监控 |
| Sentry | $0 | 5000 事件/月免费 |
| Vercel（备用） | $0 | 仅灾备，无流量不产生费用 |
| **总计** | **¥300-400** | 仅 AI 生成有成本 |

---

## 七、执行路线图

| 阶段 | 时间 | 交付物 | 负责人 |
|------|------|--------|--------|
| **Phase 1** | Week 1-2 | Cloudflare Pages 部署、域名/SSL/压缩配置、代码分割上线 | 玄极 |
| **Phase 2** | Week 3-4 | 图片 WebP/AVIF 流水线、html2canvas 优化、3D 降级 | 玄极 |
| **Phase 3** | Week 5-6 | AutoDL 接入、Workers 队列、R2 存储、预生成模板 | 玄极 |
| **Phase 4** | Week 7-8 | 监控体系（UptimeRobot + Sentry）、静态降级、IndexedDB | 玄极 |
| **Phase 5** | Week 9+ | Core Web Vitals 基线测试、压测、双轨架构预备 | 玄极 |

---

> *"稳定性不是 feature，是底线。上线第一天就要像服务百万用户一样敬畏。"*
> — 架构官·玄极
