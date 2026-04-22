import { useRef, useMemo, useState } from 'react';
import type { JSX } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════
//  BaguaScene3D — 3D 八卦罗盘场景
// ═══════════════════════════════════════════════════════════════════════
//  其他 Agent 模块接入点（当 models/ 和 animation/ 文件就绪后启用）：
//    import { BaguaCompass } from './models/BaguaCompass';
//    import { ParticleRing } from './models/ParticleRing';
//    import { useCompassRotation } from './animation/useCompassRotation';
//    import { useFloatAnimation } from './animation/useFloatAnimation';
// ═══════════════════════════════════════════════════════════════════════

// ─── Types ─────────────────────────────────────────────────────────────

interface BaguaScene3DProps {
  /** Compass heading in degrees (0–360) */
  heading: number;
  /** True while the user is taking a photo */
  isCapturing: boolean;
}

// ─── Trigram data ──────────────────────────────────────────────────────

interface TrigramData {
  readonly name: string;
  readonly angle: number;
  readonly char: string;
  readonly element: string;
  readonly color: string;
}

const TRIGRAMS: readonly TrigramData[] = [
  { name: '北',  angle: 0,   char: '坎', element: '水', color: '#3b82f6' },
  { name: '东北', angle: 45,  char: '艮', element: '土', color: '#a16207' },
  { name: '东',  angle: 90,  char: '震', element: '木', color: '#22c55e' },
  { name: '东南', angle: 135, char: '巽', element: '木', color: '#16a34a' },
  { name: '南',  angle: 180, char: '离', element: '火', color: '#ef4444' },
  { name: '西南', angle: 225, char: '坤', element: '土', color: '#ca8a04' },
  { name: '西',  angle: 270, char: '兑', element: '金', color: '#eab308' },
  { name: '西北', angle: 315, char: '乾', element: '金', color: '#f59e0b' },
];

// ─── 3D Sub-components ─────────────────────────────────────────────────

/**
 * CompassRing — the main rotating 3D bagua ring.
 * Rotates smoothly towards the target heading each frame.
 */
function CompassRing({ heading }: { readonly heading: number }): JSX.Element {
  const groupRef = useRef<THREE.Group>(null);

  // Target rotation in radians (negative for clockwise compass behaviour)
  const targetRotationZ = useMemo(
    () => -(heading * Math.PI) / 180,
    [heading]
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const current = groupRef.current.rotation.z;
    let diff = targetRotationZ - current;

    // Normalise angle difference to [-PI, PI] for shortest-path interpolation
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    // Smooth lerp with a max step per frame (prevents snapping)
    const maxStep = delta * 8;
    groupRef.current.rotation.z += diff * Math.min(maxStep, 1);
  });

  return (
    <group ref={groupRef}>
      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.012, 8, 128]} />
        <meshBasicMaterial color="#c8a45c" transparent opacity={0.6} />
      </mesh>

      {/* Inner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.008, 8, 128]} />
        <meshBasicMaterial color="#c8a45c" transparent opacity={0.3} />
      </mesh>

      {/* Centre dot */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#c8a45c" />
      </mesh>

      {/* 8 trigram tick marks + connecting spokes */}
      {TRIGRAMS.map((t) => {
        const rad = ((t.angle - 90) * Math.PI) / 180;
        const x = Math.cos(rad) * 1.2;
        const z = Math.sin(rad) * 1.2;

        return (
          <group key={t.name}>
            {/* Tick marker */}
            <mesh position={[x, 0, z]} rotation={[0, -rad, 0]}>
              <boxGeometry args={[0.02, 0.02, 0.08]} />
              <meshBasicMaterial
                color={t.color}
                transparent
                opacity={0.8}
              />
            </mesh>
            {/* Spoke line toward centre */}
            <mesh
              position={[x * 0.75, 0, z * 0.75]}
              rotation={[0, -rad + Math.PI / 2, 0]}
              scale={[0.003, 1, 0.6]}
            >
              <boxGeometry />
              <meshBasicMaterial color="#c8a45c" transparent opacity={0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * CaptureIndicator — pulsing red ring shown while taking a photo.
 */
function CaptureIndicator({
  isCapturing,
}: {
  readonly isCapturing: boolean;
}): JSX.Element | null {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !isCapturing) return;
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 10) * 0.08;
    meshRef.current.scale.setScalar(pulse);
  });

  if (!isCapturing) return null;

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.5, 0.025, 8, 128]} />
      <meshBasicMaterial color="#ff4444" transparent opacity={0.5} />
    </mesh>
  );
}

/**
 * FloatingParticles — ambient golden particles floating around the compass.
 */
function FloatingParticles(): JSX.Element {
  const pointsRef = useRef<THREE.Points>(null);

  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 64;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 0.8 + Math.random() * 1.2;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 2] = Math.sin(theta) * r;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={pointsRef} geometry={particleGeometry}>
      <pointsMaterial
        size={0.025}
        color="#c8a45c"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * DirectionLabels — 3D direction markers for each trigram position.
 */
function DirectionLabels({ heading }: { readonly heading: number }): JSX.Element {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotationZ = useMemo(
    () => -(heading * Math.PI) / 180,
    [heading]
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const current = groupRef.current.rotation.z;
    let diff = targetRotationZ - current;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    groupRef.current.rotation.z += diff * Math.min(delta * 8, 1);
  });

  return (
    <group ref={groupRef}>
      {TRIGRAMS.map((t) => {
        const rad = ((t.angle - 90) * Math.PI) / 180;
        const x = Math.cos(rad) * 0.9;
        const z = Math.sin(rad) * 0.9;

        return (
          <mesh key={`label-${t.name}`} position={[x, 0, z]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial
              color={t.color}
              transparent
              opacity={0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Scene Composition ─────────────────────────────────────────────────

function Scene({ heading, isCapturing }: BaguaScene3DProps): JSX.Element {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -3, 3]} color="#c8a45c" intensity={0.3} />

      {/* 3D Elements */}
      <CompassRing heading={heading} />
      <DirectionLabels heading={heading} />
      <FloatingParticles />
      <CaptureIndicator isCapturing={isCapturing} />
    </>
  );
}

// ─── Exported Component ────────────────────────────────────────────────

export default function BaguaScene3D({
  heading,
  isCapturing,
}: BaguaScene3DProps): JSX.Element {
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={dpr}
        camera={{ position: [0, 2, 4], fov: 45, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr([1, 1])}
          onIncline={() => setDpr([1, 1.5])}
          flipflops={3}
          onFallback={() => setDpr([1, 1])}
        />
        <Scene heading={heading} isCapturing={isCapturing} />
      </Canvas>
    </div>
  );
}
