# Kimi 网页版 Agent 集群话术 — 3D Bagua 罗盘

> 使用方式：在 Kimi 网页版开启 3 个新对话窗口，分别粘贴下方 3 个话术。Agent 生成代码后，复制粘贴到对应文件中。

---

## Agent A 话术（3D 场景架构 + 相机集成）

```
你是一个 React Three Fiber 专家。请帮我完成一个 3D 八卦罗盘与相机的集成组件。

## 项目背景
- React 19 + Vite + TypeScript + Tailwind CSS
- 已安装依赖：@react-three/fiber @react-three/drei three
- 目标：在手机相机画面上叠加一个 3D 八卦罗盘

## 现有代码上下文

当前 FengshuiCamera.tsx 的关键部分（你需要集成 Canvas 到其中）：

```tsx
// 当前使用的 hooks
const { videoRef, error, start, stop } = useCamera();
const { heading, isSupported, calibrate } = useCompass();

// heading 是 0-360 的数字，表示手机朝向
// directionKey = getDirectionFromAngle(heading)
// dirInfo = directionData[directionKey]

// 当前相机画面结构（简化）：
<div className="relative w-full h-full">
  <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
  {/* 这里原来是 2D SVG BaguaOverlay，现在要换成 3D Canvas */}
  <BaguaOverlay heading={heading} />
  
  {/* 底部控制栏 */}
  <div className="absolute bottom-0 left-0 right-0 z-20">
    {/* 拍照按钮等 */}
  </div>
</div>
```

## 你的任务

### 1. 创建 BaguaScene3D.tsx
创建 `src/components/fengshui-camera/BaguaScene3D.tsx`，要求：

```tsx
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';

interface BaguaScene3DProps {
  heading: number;        // 罗盘当前方向 0-360
  isCapturing: boolean;   // 是否正在拍照
}

export default function BaguaScene3D({ heading, isCapturing }: BaguaScene3DProps) {
  // 1. Canvas 必须透明背景：alpha: true
  // 2. 移动端 DPR 限制：dpr={[1, 1.5]}
  // 3. 使用 PerformanceMonitor 自适应性能
  // 4. 这里引用其他 Agent 的组件：
  //    - BaguaCompass（旋转 Y 轴）
  //    - ParticleRing（粒子环绕）
  //    - useCompassRotation hook（平滑旋转）
  //    - useFloatAnimation hook（浮动效果）
}
```

### 2. 修改 FengshuiCamera.tsx 的集成代码
提供需要插入到 FengshuiCamera.tsx 中的修改代码（用注释标明插入位置）：

```tsx
// 1. 导入 BaguaScene3D
// 2. 在 video 上方添加 Canvas 叠加层
// 3. 拍照时设置 isCapturing=true
// 4. 拍照合成：3D 场景渲染到离屏 canvas，与视频帧合并
```

### 3. 拍照合成逻辑
拍照时（handleCapture），需要：
1. 暂停 3D 动画
2. 将当前 3D 画面渲染到一个离屏 canvas
3. 将这个 3D canvas 叠加到视频帧上
4. 恢复动画

关键代码提示：
```tsx
// 使用 Canvas 的 gl.readPixels 或 drei 的 useFBO
// 或者更简单：用 html2canvas 捕获 Canvas DOM 元素
```

## 接口契约（与其他 Agent 对接）

你的 BaguaScene3D 需要引用以下组件/hooks（其他 Agent 负责实现）：

```tsx
// Agent B 提供
import { BaguaCompass } from './models/BaguaCompass';
import { ParticleRing } from './models/ParticleRing';

// Agent C 提供
import { useCompassRotation } from './animation/useCompassRotation';
import { useFloatAnimation } from './animation/useFloatAnimation';
```

## 输出要求

请输出完整的、可直接复制粘贴的代码：
1. **BaguaScene3D.tsx 完整代码**（用代码块包裹）
2. **FengshuiCamera.tsx 修改部分**（用注释标明插入位置）

要求：
- TypeScript 严格模式，不要 any
- 使用单引号
- Canvas 透明背景必须正确
- 不要引入新的 npm 依赖（已安装 @react-three/fiber @react-three/drei three）
```

---

## Agent B 话术（3D 模型 + 材质 + 粒子）

```
你是一个 Three.js 3D 建模专家。请帮我创建精致的 3D 八卦罗盘模型组件。

## 项目背景
- React 19 + TypeScript + @react-three/fiber + @react-three/drei
- 用途：手机相机画面上方悬浮的 3D 八卦罗盘
- 风格：中国风、玄学、古铜色金属质感

## 你的任务

创建 3 个组件文件：

### 1. BaguaCompass.tsx
`src/components/fengshui-camera/models/BaguaCompass.tsx`

```tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BaguaCompassProps {
  rotationY: number;      // Y轴旋转角度
  quality: 'high' | 'medium' | 'low';
}

export function BaguaCompass({ rotationY, quality }: BaguaCompassProps) {
  // 设计一个圆形罗盘：
  // - 外环：360° 刻度线（每 5° 一刻，30° 粗线，金色 #c8a45c）
  // - 中环：8 个八卦符号区域（用简单几何或文字精灵表示）
  // - 内环：方向文字（北、东北、东...）
  // - 中心：太极阴阳鱼（黑白双色）
  // - 整体厚度：扁平圆柱体，有金属边缘
  
  // 材质：PBR 古铜色
  // - roughness: 0.3
  // - metalness: 0.8
  // - color: #c8a45c（金色主调）
  // - 背景色：#0a0a0f（深黑）
}
```

设计要求：
- 用 Three.js 原生几何体（CylinderGeometry、RingGeometry、PlaneGeometry 等）
- 不要使用外部 .gltf/.obj 模型文件
- 八卦符号可以用 8 个扇形平面 + 文字精灵表示
- 方向文字可以用 @react-three/drei 的 Text 组件或 sprite

### 2. TaijiSymbol.tsx
`src/components/fengshui-camera/models/TaijiSymbol.tsx`

中心太极阴阳鱼：
- 圆形黑白双色
- 两个小鱼眼（黑中有白点，白中有黑点）
- 金色边框

### 3. ParticleRing.tsx
`src/components/fengshui-camera/models/ParticleRing.tsx`

```tsx
interface ParticleRingProps {
  count: number;          // 粒子数量（根据 quality 传入）
  color?: string;
}
```

金色微光粒子：
- 环绕罗盘缓慢旋转
- 粒子大小随机
- 透明度渐变
- 根据 quality 调整数量：high=200, medium=100, low=0

## 关键约束
- 总顶点数 < 5000（移动端性能）
- 不使用外部图片/纹理文件
- 所有材质和几何体用代码生成
- 支持 quality 降级（high/medium/low）

## 输出要求

请输出完整的、可直接复制粘贴的代码：
1. **BaguaCompass.tsx 完整代码**
2. **TaijiSymbol.tsx 完整代码**
3. **ParticleRing.tsx 完整代码**

要求：
- TypeScript 严格模式
- 使用单引号
- 不要 any
- 不要引入新的 npm 依赖
```

---

## Agent C 话术（动画 + 交互）

```
你是一个 React Three Fiber 动画专家。请帮我创建 3D 罗盘的动画 hooks。

## 项目背景
- React 19 + TypeScript + @react-three/fiber + three
- 用途：3D 八卦罗盘的旋转、浮动、拍照定格动画

## 你的任务

创建 3 个动画 hook 文件：

### 1. useCompassRotation.ts
`src/components/fengshui-camera/animation/useCompassRotation.ts`

```tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function useCompassRotation(targetHeading: number) {
  const rotationRef = useRef(0);
  
  // heading 是 0-360 的数字
  // 罗盘需要绕 Y 轴旋转 -heading 度（这样罗盘刻度与真实方向对齐）
  // 使用 lerp 或 damp 实现平滑过渡
  // 旋转速度：快速变化时响应快，微调时平滑
  
  useFrame((state, delta) => {
    // 用 THREE.MathUtils.lerp 或 MathUtils.damp
    // 直接 mutation rotationRef.current，不要 setState
  });
  
  return { rotationRef };
}
```

### 2. useFloatAnimation.ts
`src/components/fengshui-camera/animation/useFloatAnimation.ts`

```tsx
export function useFloatAnimation() {
  const yOffsetRef = useRef(0);
  
  // 罗盘轻微上下浮动，模拟悬浮感
  // 频率：~0.5Hz
  // 幅度：~0.05 个单位（Three.js 坐标）
  // 可叠加轻微左右摇摆
  
  useFrame((state, delta) => {
    // 用 Math.sin(state.clock.elapsedTime) 实现
    // 直接 mutation，不要 setState
  });
  
  return { yOffsetRef };
}
```

### 3. useCaptureFreeze.ts
`src/components/fengshui-camera/animation/useCaptureFreeze.ts`

```tsx
export function useCaptureFreeze(isCapturing: boolean) {
  const frozenRotationRef = useRef<number | null>(null);
  
  // 当 isCapturing 变为 true 时：
  //   记录当前 rotation，后续不再更新
  // 当 isCapturing 变为 false 时：
  //   恢复正常动画
  
  return { frozenRotationRef };
}
```

## 关键约束（性能铁律）
- **严禁**在 useFrame 中调用 setState（React Three Fiber 性能陷阱）
- 使用 useRef + 直接 mutation
- 动画必须 60fps 在低端机也能跑
- 不要创建新的对象/数组（避免 GC 抖动）

## 输出要求

请输出完整的、可直接复制粘贴的代码：
1. **useCompassRotation.ts 完整代码**
2. **useFloatAnimation.ts 完整代码**
3. **useCaptureFreeze.ts 完整代码**

要求：
- TypeScript 严格模式
- 使用单引号
- 不要 any
- 不要引入新的 npm 依赖
```

---

## 用户操作手册（复制粘贴后）

1. **在 Kimi 网页版开启 3 个新对话**
2. **分别粘贴上方 3 个话术**
3. **等 3 个 Agent 都生成代码后**：
   - 在本地项目创建对应文件
   - 复制 Agent A 的 BaguaScene3D.tsx
   - 复制 Agent B 的 models/* 文件
   - 复制 Agent C 的 animation/* 文件
   - 按 Agent A 的说明修改 FengshuiCamera.tsx
4. **本地测试**：`npm run build`
5. **解决接口不对齐的问题**（如果有）
6. **部署到 GitHub Pages**
