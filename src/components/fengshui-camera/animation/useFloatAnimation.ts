import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function useFloatAnimation() {
  const yOffsetRef = useRef(0);

  useFrame((state) => {
    // sin 浮动：频率 0.5Hz，幅度 0.05
    yOffsetRef.current = Math.sin(state.clock.elapsedTime * Math.PI) * 0.05;
  });

  return { yOffsetRef };
}
