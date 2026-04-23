import { useRef, useState } from 'react';
import type { JSX } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { BaguaCompass } from './models/BaguaCompass';
import { useCompassRotation } from './animation/useCompassRotation';
import { useFloatAnimation } from './animation/useFloatAnimation';
import { useCaptureFreeze } from './animation/useCaptureFreeze';

/* ═══════════════════════════════════════════════════════════════════════
   BaguaScene3D — 3D 八卦罗盘场景（手持罗盘视角）
   ═══════════════════════════════════════════════════════════════════════ */

interface BaguaScene3DProps {
  /** Compass heading in degrees (0–360) */
  heading: number;
  /** True while the user is taking a photo */
  isCapturing: boolean;
}

/* ─── CaptureIndicator ───────────────────────────────────────────────── */

function CaptureIndicator({
  isCapturing,
}: {
  readonly isCapturing: boolean;
}): JSX.Element | null {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !isCapturing) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.08;
    meshRef.current.scale.setScalar(pulse);
  });

  if (!isCapturing) return null;

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[3.2, 0.025, 8, 128]} />
      <meshBasicMaterial color="#ff4444" transparent opacity={0.5} />
    </mesh>
  );
}

/* ─── Scene ──────────────────────────────────────────────────────────── */

interface SceneProps {
  readonly heading: number;
  readonly isCapturing: boolean;
  readonly quality: 'high' | 'medium' | 'low';
}

function Scene({ heading, isCapturing, quality }: SceneProps): JSX.Element {
  const compassGroupRef = useRef<THREE.Group>(null);

  /* Agent C hooks: smooth rotation, float animation, capture freeze */
  const { rotationRef } = useCompassRotation(heading);
  const { yOffsetRef } = useFloatAnimation();
  const { isFrozenRef } = useCaptureFreeze(isCapturing);

  useFrame(() => {
    if (!compassGroupRef.current || isFrozenRef.current) return;
    /* 罗盘绕 Y 轴旋转（跟随 heading）—— 倾斜由初始 rotation 固定 */
    compassGroupRef.current.rotation.y = rotationRef.current;
    /* 浮动 */
    compassGroupRef.current.position.y = yOffsetRef.current;
  });

  return (
    <>
      {/* Lighting: 主光源 + 补光 + 轮廓光 */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[3, 6, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#c8a45c" />
      <pointLight position={[0, -2, 3]} intensity={0.5} color="#ffaa44" />

      {/* Compass group: 倾斜 35° 面向用户，像手持罗盘 */}
      <group
        ref={compassGroupRef}
        rotation={[-Math.PI / 5, 0, 0]} /* ≈ -36° 绕 X 轴倾斜 */
        scale={0.75} /* 缩小 25% 避免占满画面 */
      >
        <BaguaCompass rotationY={0} quality={quality} />
      </group>

      {/* 地面接触阴影 —— 增强立体感 */}
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.35}
        scale={12}
        blur={2.5}
        far={4}
        color="#000000"
      />

      {/* Photo capture indicator */}
      <CaptureIndicator isCapturing={isCapturing} />
    </>
  );
}

/* ─── Exported Component ─────────────────────────────────────────────── */

export default function BaguaScene3D({
  heading,
  isCapturing,
}: BaguaScene3DProps): JSX.Element {
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={dpr}
        /* 相机更正面，略低，像看着手中的罗盘 */
        camera={{ position: [0, 1.2, 4.5], fov: 42, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
        shadows
      >
        <PerformanceMonitor
          onDecline={() => {
            setDpr([1, 1]);
            setQuality('medium');
          }}
          onIncline={() => {
            setDpr([1, 1.5]);
            setQuality('high');
          }}
          flipflops={3}
          onFallback={() => {
            setDpr([1, 1]);
            setQuality('low');
          }}
        />
        <Scene
          heading={heading}
          isCapturing={isCapturing}
          quality={quality}
        />
      </Canvas>

      {/* North Pointer — fixed at top, does not rotate with compass */}
      <div
        className="absolute top-[12%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
        style={{ pointerEvents: 'none' }}
      >
        <svg width="28" height="38" viewBox="0 0 28 38">
          <polygon
            points="14,0 28,28 14,24 0,28"
            fill="#c8a45c"
            opacity={0.9}
          />
          <text
            x="14" y="36"
            textAnchor="middle"
            fill="#c8a45c"
            fontSize="11"
            fontWeight="bold"
          >
            N
          </text>
        </svg>
      </div>
    </div>
  );
}
