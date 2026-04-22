import { useState, useCallback } from 'react';

interface GeoState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    lat: null, lng: null, accuracy: null, status: 'idle',
  });

  const getPosition = useCallback((): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setState({ lat: null, lng: null, accuracy: null, status: 'error', error: '浏览器不支持定位' });
        resolve(null);
        return;
      }
      setState((s) => ({ ...s, status: 'loading' }));
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setState({ lat: latitude, lng: longitude, accuracy, status: 'success' });
          resolve({ lat: latitude, lng: longitude });
        },
        (err) => {
          const msg = err.code === 1 ? '用户拒绝了定位权限' : '定位失败';
          setState({ lat: null, lng: null, accuracy: null, status: 'error', error: msg });
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }, []);

  return { ...state, getPosition };
}
