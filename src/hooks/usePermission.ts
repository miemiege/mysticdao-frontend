import { useState, useCallback } from 'react';

export type PermissionType = 'camera' | 'geolocation' | 'orientation';

interface PermissionState {
  status: 'prompt' | 'granted' | 'denied' | 'unsupported';
  error?: string;
}

export function usePermission() {
  const [permissions, setPermissions] = useState<Record<PermissionType, PermissionState>>({
    camera: { status: 'prompt' },
    geolocation: { status: 'prompt' },
    orientation: { status: 'prompt' },
  });

  const requestCamera = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setPermissions((p) => ({ ...p, camera: { status: 'unsupported', error: '浏览器不支持摄像头' } }));
        return false;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      stream.getTracks().forEach((t) => t.stop());
      setPermissions((p) => ({ ...p, camera: { status: 'granted' } }));
      return true;
    } catch (err: any) {
      const msg = err.name === 'NotAllowedError' ? '用户拒绝了摄像头权限' : err.message;
      setPermissions((p) => ({ ...p, camera: { status: 'denied', error: msg } }));
      return false;
    }
  }, []);

  const requestGeolocation = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setPermissions((p) => ({ ...p, geolocation: { status: 'unsupported', error: '浏览器不支持定位' } }));
        resolve(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissions((p) => ({ ...p, geolocation: { status: 'granted' } }));
          resolve(true);
        },
        (err) => {
          const msg = err.code === 1 ? '用户拒绝了定位权限' : '定位失败';
          setPermissions((p) => ({ ...p, geolocation: { status: 'denied', error: msg } }));
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  }, []);

  const requestOrientation = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
      setPermissions((p) => ({ ...p, orientation: { status: 'unsupported', error: '浏览器不支持方向传感器' } }));
      return false;
    }
    // iOS 13+ 需要请求权限
    const request = (window.DeviceOrientationEvent as any).requestPermission;
    if (typeof request === 'function') {
      try {
        const result = await request();
        const ok = result === 'granted';
        setPermissions((p) => ({ ...p, orientation: { status: ok ? 'granted' : 'denied', error: ok ? undefined : '用户拒绝了方向权限' } }));
        return ok;
      } catch (err: any) {
        setPermissions((p) => ({ ...p, orientation: { status: 'denied', error: err.message } }));
        return false;
      }
    }
    // 非 iOS 直接支持
    setPermissions((p) => ({ ...p, orientation: { status: 'granted' } }));
    return true;
  }, []);

  const request = useCallback(async (type: PermissionType): Promise<boolean> => {
    switch (type) {
      case 'camera': return requestCamera();
      case 'geolocation': return requestGeolocation();
      case 'orientation': return requestOrientation();
      default: return false;
    }
  }, [requestCamera, requestGeolocation, requestOrientation]);

  return { permissions, request, requestCamera, requestGeolocation, requestOrientation };
}
