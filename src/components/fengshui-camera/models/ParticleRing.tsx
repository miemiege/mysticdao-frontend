import { useRef, useMemo } from 'react';
import type { JSX } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  ParticleRing – 金色微光粒子环                                      */
/*  Points + BufferGeometry，环绕罗盘缓慢旋转并闪烁                     */
/* ------------------------------------------------------------------ */

interface ParticleRingProps {
  count: number;
  color?: string;
  radius?: number;
  rotationY?: number;
}

export function ParticleRing({
  count,
  color = '#c8a45c',
  radius = 3.2,
  rotationY = 0,
}: ParticleRingProps): JSX.Element | null {
  const pointsRef = useRef<THREE.Points>(null);
  const speedsRef = useRef<Float32Array | null>(null);
  const phasesRef = useRef<Float32Array | null>(null);

  /* ---------- 粒子几何缓存 ---------- */
  const geometry = useMemo(() => {
    if (count <= 0) return null;

    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.5;
      const y = (Math.random() - 0.5) * 0.4;

      positions[i * 3] = r * Math.cos(angle);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = r * Math.sin(angle);

      speeds[i] = 0.0003 + Math.random() * 0.0008;
      phases[i] = Math.random() * Math.PI * 2;
    }

    speedsRef.current = speeds;
    phasesRef.current = phases;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count, radius]);

  /* ---------- 动画 ---------- */
  useFrame(({ clock }) => {
    if (!pointsRef.current || count <= 0 || !geometry) return;

    const time = clock.getElapsedTime();
    const posAttr = geometry.attributes.position;
    const posArr = posAttr.array as Float32Array;
    const speeds = speedsRef.current;
    const phases = phasesRef.current;
    if (!speeds || !phases) return;

    /* 每个粒子以不同速度绕 Y 轴公转，同时上下浮动 */
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = posArr[idx];
      const z = posArr[idx + 2];
      const sp = speeds[i];
      const ph = phases[i];

      const cos = Math.cos(sp);
      const sin = Math.sin(sp);
      const nx = x * cos - z * sin;
      const nz = x * sin + z * cos;

      posArr[idx] = nx;
      posArr[idx + 2] = nz;

      /* 上下浮动：基于 sin 的绝对位置，而非累积 */
      posArr[idx + 1] = Math.sin(time * 0.5 + ph) * 0.15;
    }
    posAttr.needsUpdate = true;

    /* 整体跟随罗盘旋转并叠加缓慢自转 */
    pointsRef.current.rotation.y = rotationY + time * 0.03;
  });

  if (count <= 0 || !geometry) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={0.045}
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
