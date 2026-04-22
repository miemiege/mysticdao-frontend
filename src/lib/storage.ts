const STORAGE_KEY = 'mysticdao_state';
const EXPIRY_HOURS = 24;

interface StorageState {
  bazi?: {
    formData: Record<string, string>;
    pillars: Array<{ stem: string; branch: string; element: string }>;
  };
  daily?: {
    lastDrawDate: string;
    cardId: string;
    fortune?: unknown;
    reading?: string;
  };
  fengshui?: {
    formData: Record<string, string>;
    reading?: string;
  };
  timestamp: number;
}

export function getStoredState(): StorageState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as StorageState;
    const now = Date.now();
    const expiryMs = EXPIRY_HOURS * 60 * 60 * 1000;
    if (now - state.timestamp > expiryMs) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

export function saveState(partial: Partial<StorageState>): void {
  try {
    const existing = getStoredState() || {} as StorageState;
    const merged = { ...existing, ...partial, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Silently fail if storage is full
  }
}

export function clearStoredState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getBaziState(): StorageState['bazi'] | null {
  const state = getStoredState();
  return state?.bazi || null;
}

export function saveBaziState(bazi: StorageState['bazi']): void {
  saveState({ bazi });
}

export function getDailyState(): StorageState['daily'] | null {
  const state = getStoredState();
  return state?.daily || null;
}

export function saveDailyState(daily: StorageState['daily']): void {
  saveState({ daily });
}

export function getFengshuiState(): StorageState['fengshui'] | null {
  const state = getStoredState();
  return state?.fengshui || null;
}

export function saveFengshuiState(fengshui: StorageState['fengshui']): void {
  saveState({ fengshui });
}
