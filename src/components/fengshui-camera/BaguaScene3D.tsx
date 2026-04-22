import { useRef, useState } from 'react';
import type { JSX } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { BaguaCompass } from './models/BaguaCompass';
import { useCompassRotation } from './animation/useCompassRotation';
import { useFloatAnimation } from './animation/useFloatAnimation';
import { useCaptureFreeze } from './animation/useCaptureFreeze';

/* ═══════════════════════════════════════════════════════════════════════
   BaguaScene3D — 3D 八卦罗盘场景（集成 Agent B 模型 + Agent C 动画）
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
      <torusGeometry args={[3.5, 0.025, 8, 128]} />
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
    compassGroupRef.current.rotation.y = rotationRef.current;
    compassGroupRef.current.position.y = yOffsetRef.current;
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -3, 3]} color="#c8a45c" intensity={0.3} />

      {/* Compass group: rotation & float driven by Agent C hooks */}
      <group ref={compassGroupRef}>
        <BaguaCompass rotationY={0} quality={quality} />
      </group>

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
        camera={{ position: [0, 3, 7], fov: 45, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
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
    </div>
  );
}
