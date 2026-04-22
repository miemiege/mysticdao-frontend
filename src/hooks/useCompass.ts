import { useState, useEffect, useRef, useCallback } from 'react';

interface CompassState {
  heading: number;     // 0-360, 0=北, 90=东, 180=南, 270=西
  accuracy: number;    // 精度（度数）
  isCalibrating: boolean;
  isSupported: boolean;
}

function getDirectionName(heading: number): string {
  const dirs = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const idx = Math.round(heading / 45) % 8;
  return dirs[idx];
}

export function useCompass(enabled: boolean = false) {
  const [state, setState] = useState<CompassState>({
    heading: 0,
    accuracy: 0,
    isCalibrating: false,
    isSupported: typeof window !== 'undefined' && 'DeviceOrientationEvent' in window,
  });
  const lastHeading = useRef(0);

  const calibrate = useCallback(() => {
    setState((s) => ({ ...s, isCalibrating: true }));
    setTimeout(() => setState((s) => ({ ...s, isCalibrating: false })), 3000);
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number;
      // iOS: webkitCompassHeading
      if ((e as any).webkitCompassHeading != null) {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha != null) {
        // Android: 360 - alpha
        heading = 360 - e.alpha;
      } else {
        return;
      }
      heading = ((heading % 360) + 360) % 360;
      lastHeading.current = heading;
      setState((s) => ({
        ...s,
        heading,
        accuracy: (e as any).webkitCompassAccuracy || 10,
        isSupported: true,
      }));
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [enabled]);

  return {
    ...state,
    directionName: getDirectionName(state.heading),
    calibrate,
  };
}

export function useCompassPC() {
  const [heading, setHeading] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startHeading = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    startHeading.current = heading;
  }, [heading]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = (e.clientX - startX.current) * 0.5;
    setHeading(((startHeading.current + delta) % 360 + 360) % 360);
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const directionName = getDirectionName(heading);

  return { heading, directionName, isDragging, onMouseDown, onMouseMove, onMouseUp, setHeading };
}
