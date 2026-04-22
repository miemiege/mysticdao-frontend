import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TAU = Math.PI * 2;

/**
 * Normalize an angle difference to the range [-π, π].
 * This ensures the compass takes the shortest path when crossing 0°/360°.
 */
function normalizeAngleDiff(diff: number): number {
  diff = diff % TAU;
  if (diff > Math.PI) diff -= TAU;
  if (diff < -Math.PI) diff += TAU;
  return diff;
}

/**
 * Smoothly rotates the compass on the Y-axis based on heading changes.
 *
 * Features:
 * - Shortest-path rotation (handles 0°/360° wrap-around gracefully)
 * - Adaptive damping: large heading changes respond quickly, fine adjustments stay smooth
 * - Mutates a ref directly inside useFrame (no setState)
 *
 * @param targetHeading - Compass heading in degrees (0–360)
 * @returns rotationRef - Current smoothed rotation in radians (negated for CCW)
 */
export function useCompassRotation(
  targetHeading: number
): { rotationRef: React.RefObject<number> } {
  const rotationRef = useRef<number>(0);

  useFrame((_, delta) => {
    const current = rotationRef.current;
    const targetRad = THREE.MathUtils.degToRad(-targetHeading);

    // Compute shortest-path difference to avoid 360° spins
    const diff = normalizeAngleDiff(targetRad - current);
    const actualTarget = current + diff;

    // Adaptive lambda: bigger diffs → faster convergence
    const adaptiveLambda = 2 + Math.abs(diff) * 5;

    rotationRef.current = THREE.MathUtils.damp(
      current,
      actualTarget,
      adaptiveLambda,
      delta
    );
  });

  return { rotationRef };
}
