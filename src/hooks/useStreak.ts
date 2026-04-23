import { useState, useEffect, useCallback } from 'react';

const STREAK_KEY = 'mysticdao_streak';

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string | null;
  rewards: string[];
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function loadStreak(): StreakState {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw) as StreakState;
  } catch {
    // ignore
  }
  return { currentStreak: 0, longestStreak: 0, lastCheckIn: null, rewards: [] };
}

function saveStreakState(state: StreakState) {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakState>(loadStreak);

  useEffect(() => {
    setStreak(loadStreak());
  }, []);

  const checkIn = useCallback(() => {
    const today = getToday();
    const state = loadStreak();

    if (state.lastCheckIn === today) {
      return state;
    }

    let newStreak = state.currentStreak;
    if (state.lastCheckIn === getYesterday()) {
      newStreak += 1;
    } else if (state.lastCheckIn && state.lastCheckIn !== today) {
      newStreak = 1;
    } else if (!state.lastCheckIn) {
      newStreak = 1;
    }

    const longest = Math.max(state.longestStreak, newStreak);
    const rewards: string[] = [];
    if (newStreak >= 7 && state.currentStreak < 7) rewards.push('gold-border');
    if (newStreak >= 30 && state.currentStreak < 30) rewards.push('taiji-theme');
    if (newStreak >= 100 && state.currentStreak < 100) rewards.push('dragon-theme');

    const newState: StreakState = {
      currentStreak: newStreak,
      longestStreak: longest,
      lastCheckIn: today,
      rewards: [...state.rewards, ...rewards],
    };

    saveStreakState(newState);
    setStreak(newState);
    return newState;
  }, []);

  const getActiveRewards = useCallback((): string[] => {
    const state = loadStreak();
    const active: string[] = [];
    if (state.currentStreak >= 7) active.push('gold-border');
    if (state.currentStreak >= 30) active.push('taiji-theme');
    if (state.currentStreak >= 100) active.push('dragon-theme');
    return active;
  }, []);

  return { streak, checkIn, getActiveRewards };
}
