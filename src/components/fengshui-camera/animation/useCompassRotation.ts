import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function useCompassRotation(targetHeading: number) {
  const rotationRef = useRef(0);
  const targetRef = useRef(0);

  targetRef.current = (targetHeading * Math.PI) / 180;

  useFrame(() => {
    // lerp 平滑旋转
    rotationRef.current = THREE.MathUtils.lerp(rotationRef.current, targetRef.current, 0.1);
  });

  return { rotationRef };
}
