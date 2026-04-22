# 3D Bagua 罗盘 — Agent 集群方案

## 目标
将 FengshuiCamera 中的 2D SVG Bagua 叠加层升级为精致 3D 八卦罗盘，支持 iOS + Android。

## 技术选型
- **@react-three/fiber** — React Three.js 渲染器
- **@react-three/drei** — 环境光、材质、后期处理
- **three** — 核心 3D 引擎
- **leva**（可选）— 开发调参面板

## Agent 分工

### Agent A — 3D 架构与相机集成（主线）
**任务：**
1. 在 `FengshuiCamera.tsx` 中集成 `<Canvas>` 叠加层
2. Canvas 透明背景，`position: absolute` 覆盖在 video 上方
3. 性能监控：`PerformanceMonitor` + 自适应分辨率
4. 拍照合成：3D 场景渲染到离屏 canvas，与视频帧合成

**输出文件：**
- `src/components/fengshui-camera/BaguaScene3D.tsx` — 3D 场景根组件
- 修改 `FengshuiCamera.tsx` — 集成 Canvas + 拍照合成

**接口契约：**
```tsx
// BaguaScene3D 接收的 props
interface BaguaScene3DProps {
  heading: number;        // 罗盘当前方向（0-360）
  isCapturing: boolean;   // 是否正在拍照（用于暂停动画优化）
}
```

**关键约束：**
- Canvas 必须 `alpha: true`（透明背景）
- 移动端 DPR 限制为 1.5 以下
- 低端机自动降级：关闭阴影、减少粒子

---

### Agent B — 3D 罗盘模型与材质（视觉）
**任务：**
1. 设计 3D Bagua 罗盘几何体
   - 外环：刻度数（0-360°，每 5° 一刻）
   - 中环：八卦符号（☰ ☷ ☳ ☴ ☵ ☶ ☱ ☲）
   - 内环：方向文字（北、东北、东...）
   - 中心：太极阴阳鱼
2. PBR 材质：古铜色金属、做旧纹理
3. 光影：环境光 + 方向光 + 边缘辉光（bloom）
4. 粒子系统：微光星尘环绕罗盘

**输出文件：**
- `src/components/fengshui-camera/models/BaguaCompass.tsx` — 罗盘 3D 模型
- `src/components/fengshui-camera/models/TaijiSymbol.tsx` — 太极符号
- `src/components/fengshui-camera/models/ParticleRing.tsx` — 粒子环

**接口契约：**
```tsx
// BaguaCompass 接收的 props
interface BaguaCompassProps {
  rotationY: number;      // Y轴旋转角度（heading 映射）
  quality: 'high' | 'medium' | 'low';  // 画质等级
}
```

**关键约束：**
- 总顶点数 < 5000（移动端性能）
- 纹理尺寸 < 1024x1024
- 粒子数量根据 quality 动态调整（high:200, medium:100, low:0）

---

### Agent C — 交互与动画（动态）
**任务：**
1. 罗盘旋转动画：heading 变化时平滑过渡（lerp）
2. 校准动画：点击校准时罗盘快速旋转 + 金光闪烁
3. 拍照定格：按下快门时罗盘冻结当前角度
4. 浮动效果：罗盘轻微上下浮动（呼吸感）
5. 方向切换：当前方向高亮（对应 sector 发光）

**输出文件：**
- `src/components/fengshui-camera/animation/useCompassRotation.ts` — 旋转逻辑
- `src/components/fengshui-camera/animation/useFloatAnimation.ts` — 浮动动画
- `src/components/fengshui-camera/animation/useCaptureFreeze.ts` — 拍照定格

**接口契约：**
```tsx
// useCompassRotation hook
function useCompassRotation(targetHeading: number): { currentRotation: number };

// useFloatAnimation hook  
function useFloatAnimation(): { y: number };
```

**关键约束：**
- 旋转使用 `useFrame` + `THREE.MathUtils.lerp`
- 不使用 `setState` 在 `useFrame` 中（性能陷阱）
- 浮动频率 0.5Hz，幅度 5px

---

## 集成流程

```
Step 1: 并行启动 Agent A + B + C
  ├── Agent A 推送：BaguaScene3D.tsx + FengshuiCamera 集成
  ├── Agent B 推送：BaguaCompass.tsx + 模型文件
  └── Agent C 推送：动画 hooks

Step 2: 本地合并 + 联调
  ├── 解决冲突
  ├── 调整接口对齐
  └── 性能测试

Step 3: 构建 + 部署
  ├── npm run build
  ├── 手机测试（iOS + Android）
  └── gh-pages 部署
```

## 性能预算

| 指标 | 目标 | 低端机底线 |
|------|------|-----------|
| Bundle 增量 | < 350KB | — |
| FPS | > 45 | > 30 |
| 首帧渲染 | < 500ms | < 1s |
| 内存占用 | < 150MB | < 200MB |

## 降级策略

```tsx
// 根据设备性能自动降级
<PerformanceMonitor
  onDecline={() => setQuality('medium')}
  onFallback={() => setQuality('low')}
>
  {quality === 'high' && <BaguaCompass quality="high" />}
  {quality === 'medium' && <BaguaCompass quality="medium" />}
  {quality === 'low' && <BaguaCompass quality="low" />}
</PerformanceMonitor>
```

## 风险评估

| 风险 | 概率 | 应对 |
|------|------|------|
| 低端机卡顿 | 中 | PerformanceMonitor 自动降级 |
| 相机 + 3D 同时运行发热 | 中 | 限制 DPR、减少粒子 |
| 拍照合成 3D 画面失败 | 低 | 备选：仅捕获视频帧 |
| iOS Safari WebGL 兼容 | 低 | Three.js 已广泛测试 |
