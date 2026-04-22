import { useRef, useEffect } from 'react';

export function useCaptureFreeze(isCapturing: boolean) {
  const isFrozenRef = useRef(false);

  useEffect(() => {
    isFrozenRef.current = isCapturing;
  }, [isCapturing]);

  return { isFrozenRef };
}
