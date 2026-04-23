import { useEffect, useRef } from 'react';

type PreloadType = 'bazi' | 'fengshui' | 'daily';

const cache = new Map<PreloadType, unknown>();
const inFlight = new Map<PreloadType, Promise<unknown>>();

function getDataPath(type: PreloadType): string {
  switch (type) {
    case 'bazi':
      return './data/bazi.json';
    case 'fengshui':
      return './data/fengshui.json';
    case 'daily':
      return './data/content.json';
    default:
      return './data/content.json';
  }
}

export function preloadNow<T = unknown>(type: PreloadType): Promise<T | null> {
  if (cache.has(type)) {
    return Promise.resolve(cache.get(type) as T);
  }

  if (inFlight.has(type)) {
    return inFlight.get(type) as Promise<T | null>;
  }

  const promise = fetch(getDataPath(type))
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<T>;
    })
    .then((data) => {
      cache.set(type, data);
      return data;
    })
    .catch((err) => {
      console.warn(`[usePreload] Failed to preload ${type}:`, err);
      return null;
    })
    .finally(() => {
      inFlight.delete(type);
    });

  inFlight.set(type, promise);
  return promise;
}

export function getPreloadedData<T = unknown>(type: PreloadType): T | null {
  return (cache.get(type) as T) ?? null;
}

export function clearPreloadedData(type?: PreloadType): void {
  if (type) {
    cache.delete(type);
  } else {
    cache.clear();
  }
}

export function usePreload(type: PreloadType, deps: unknown[]): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear previous debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Already cached? Skip
    if (cache.has(type)) {
      return;
    }

    // Debounce preload
    timeoutRef.current = setTimeout(() => {
      preloadNow(type);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
