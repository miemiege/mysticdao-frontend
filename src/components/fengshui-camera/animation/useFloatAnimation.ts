import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const FLOAT_FREQ = 0.5; // Hz
const FLOAT_AMP = 0.005; // ~5px in typical world units (1 unit ≈ 1m)
const SWAY_FREQ = 0.65; // Slightly offset frequency for organic motion
const SWAY_AMP = 0.002; // Secondary harmonic amplitude

/**
 * Creates a gentle floating / breathing animation for the compass.
 *
 * Features:
 * - Primary sine wave at ~0.5Hz with ~5px amplitude
 * - Secondary cosine harmonic for richer, more organic motion
 * - Computed directly in useFrame via sin (no setState)
 *
 * @returns yOffsetRef - Current Y-axis offset in world units
 */
export function useFloatAnimation(): {
  yOffsetRef: React.RefObject<number>;
} {
  const yOffsetRef = useRef<number>(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Primary vertical float
    const primary = Math.sin(t * FLOAT_FREQ * Math.PI * 2) * FLOAT_AMP;

    // Secondary harmonic — adds subtle sway / irregularity
    const secondary = Math.cos(t * SWAY_FREQ * Math.PI * 2) * SWAY_AMP;

    yOffsetRef.current = primary + secondary;
  });

  return { yOffsetRef };
}
