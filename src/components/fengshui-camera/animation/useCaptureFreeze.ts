import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { RefObject } from 'react';

/**
 * Freezes the compass rotation at the moment capture starts.
 *
 * Features:
 * - Detects the transition into `isCapturing` and snapshots the current rotation
 * - Clears the frozen value when capture ends, resuming animation
 * - Returns a stable mutable object so consumers always see the latest value in useFrame
 * - All state mutations happen inside useFrame (no setState)
 *
 * @param isCapturing - Whether the camera shutter is active
 * @param rotationRef - Optional ref to the live rotation value (required to capture actual angle)
 * @returns A stable object with `frozenRotation`: the snapped angle in radians, or null when unfrozen
 */
export function useCaptureFreeze(
  isCapturing: boolean,
  rotationRef?: RefObject<number>
): { frozenRotation: number | null } {
  const stateRef = useRef<{ frozenRotation: number | null }>({
    frozenRotation: null,
  });
  const prevRef = useRef<boolean>(isCapturing);

  useFrame(() => {
    if (isCapturing && !prevRef.current) {
      // Transition: idle → capturing — snapshot the current rotation
      if (rotationRef) {
        stateRef.current.frozenRotation = rotationRef.current;
      }
      prevRef.current = true;
    } else if (!isCapturing && prevRef.current) {
      // Transition: capturing → idle — release the freeze
      stateRef.current.frozenRotation = null;
      prevRef.current = false;
    }
  });

  return stateRef.current;
}
