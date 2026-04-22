const STORAGE_KEY = 'mysticdao_state';
const USER_PROFILE_KEY = 'mysticdao_user_profile';
const HISTORY_KEY = 'mysticdao_history';
const FAVORITES_KEY = 'mysticdao_favorites';
const SHARE_KEY = 'mysticdao_share';
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

export interface UserProfile {
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  type: 'bazi' | 'daily' | 'fengshui';
  title: string;
  date: string;
  data: unknown;
}

export interface FavoriteItem {
  id: string;
  type: 'bazi' | 'daily' | 'fengshui';
  title: string;
  date: string;
  data: unknown;
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

// ─── User Profile ───

export function getUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Silently fail
  }
}

// ─── History ───

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
}

export function addHistory(item: HistoryItem): void {
  try {
    const existing = getHistory();
    // Prevent duplicates at the top
    if (existing.length > 0 && existing[0].id === item.id) {
      return;
    }
    const merged = [item, ...existing];
    // Keep max 100 items
    if (merged.length > 100) {
      merged.length = 100;
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(merged));
  } catch {
    // Silently fail
  }
}

export function removeHistory(id: string): void {
  try {
    const existing = getHistory();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch {
    // Silently fail
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Silently fail
  }
}

// ─── Favorites ───

export function getFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FavoriteItem[];
  } catch {
    return [];
  }
}

export function addFavorite(item: FavoriteItem): void {
  try {
    const existing = getFavorites();
    if (existing.some((f) => f.id === item.id)) {
      return;
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([item, ...existing]));
  } catch {
    // Silently fail
  }
}

export function removeFavorite(id: string): void {
  try {
    const existing = getFavorites();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch {
    // Silently fail
  }
}

export function isFavorite(id: string): boolean {
  try {
    const existing = getFavorites();
    return existing.some((item) => item.id === id);
  } catch {
    return false;
  }
}

// ─── Share ───

function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateShareId(type: string, data: unknown): string {
  const id = `${type.slice(0, 3)}_${generateId(6)}`;
  saveShareData(id, data);
  return id;
}

export function saveShareData(id: string, data: unknown): void {
  try {
    const raw = localStorage.getItem(SHARE_KEY);
    const existing = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    existing[id] = data;
    localStorage.setItem(SHARE_KEY, JSON.stringify(existing));
  } catch {
    // Silently fail
  }
}

export function getShareData(id: string): unknown | null {
  try {
    const raw = localStorage.getItem(SHARE_KEY);
    if (!raw) return null;
    const existing = JSON.parse(raw) as Record<string, unknown>;
    return existing[id] ?? null;
  } catch {
    return null;
  }
}

export function getAllShareIds(): string[] {
  try {
    const raw = localStorage.getItem(SHARE_KEY);
    if (!raw) return [];
    const existing = JSON.parse(raw) as Record<string, unknown>;
    return Object.keys(existing);
  } catch {
    return [];
  }
}
