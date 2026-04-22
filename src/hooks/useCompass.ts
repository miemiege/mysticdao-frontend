// src/hooks/useCompass.ts
// Agent A completed — READ-ONLY for Agent B

import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseCompassReturn {
  heading: number;
  isSupported: boolean;
  error: string | null;
  calibrate: () => void;
}

export function useCompass(): UseCompassReturn {
  const [heading, setHeading] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const offsetRef = useRef<number>(0);

  const calibrate = useCallback(() => {
    offsetRef.current = -heading;
  }, [heading]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let deg = 0;
      if (event.webkitCompassHeading !== undefined) {
        deg = event.webkitCompassHeading as number;
      } else if (event.alpha !== null) {
        deg = 360 - event.alpha;
      }
      deg = (deg + offsetRef.current) % 360;
      if (deg < 0) deg += 360;
      setHeading(Math.round(deg));
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      setIsSupported(true);
    } else {
      setIsSupported(false);
      setError('Device orientation not supported');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  return { heading, isSupported, error, calibrate };
}
