/**
 * usePosterAnimation — 动画控制 Hook
 *
 * 提供动画播放/暂停/重播控制、isAnimating 状态，
 * 以及系统级 prefers-reduced-motion 偏好检测。
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UsePosterAnimationOptions {
  /** 是否自动开始播放 */
  autoPlay?: boolean;
  /** 动画完成后的冷却时间（ms） */
  cooldownMs?: number;
}

export interface UsePosterAnimationReturn {
  /** 是否正在播放动画 */
  isAnimating: boolean;
  /** 是否已播放过至少一次 */
  hasPlayed: boolean;
  /** 是否检测到 reduced-motion 偏好 */
  prefersReducedMotion: boolean;
  /** 播放动画 */
  play: () => void;
  /** 暂停动画（标记状态） */
  pause: () => void;
  /** 重播动画 */
  replay: () => void;
  /** 切换播放/暂停 */
  toggle: () => void;
  /** 触发器值，可用于驱动 AnimatePresence key 变更 */
  trigger: number;
  /** 当前应使用的 variant key */
  animationState: 'hidden' | 'visible' | 'reduced';
}

/**
 * 检测系统 prefers-reduced-motion 偏好
 */
function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') return false;
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mql.matches;
}

export function usePosterAnimation(
  options: UsePosterAnimationOptions = {}
): UsePosterAnimationReturn {
  const { autoPlay = true, cooldownMs = 200 } = options;

  const [isAnimating, setIsAnimating] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    getReducedMotionPreference()
  );
  const [trigger, setTrigger] = useState(0);
  const cooldownRef = useRef(false);

  // 监听系统 reduced-motion 偏好变化
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches);
    };
    handler(mql);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const play = useCallback(() => {
    if (cooldownRef.current) return;
    setIsAnimating(true);
    setHasPlayed(true);
    setTrigger((t) => t + 1);
  }, []);

  const pause = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const replay = useCallback(() => {
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    setIsAnimating(false);
    // 短暂冷却确保状态重置
    setTimeout(() => {
      setTrigger((t) => t + 1);
      setIsAnimating(true);
      setHasPlayed(true);
      cooldownRef.current = false;
    }, cooldownMs);
  }, [cooldownMs]);

  const toggle = useCallback(() => {
    if (isAnimating) {
      pause();
    } else {
      play();
    }
  }, [isAnimating, pause, play]);

  // autoPlay
  useEffect(() => {
    if (autoPlay && !hasPlayed) {
      play();
    }
  }, [autoPlay, hasPlayed, play]);

  // 动画自动完成：1.2s 后标记完成（最长入场时间）
  useEffect(() => {
    if (!isAnimating) return;
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isAnimating, trigger]);

  const animationState = prefersReducedMotion
    ? 'reduced'
    : isAnimating || !hasPlayed
      ? 'visible'
      : 'hidden';

  return {
    isAnimating,
    hasPlayed,
    prefersReducedMotion,
    play,
    pause,
    replay,
    toggle,
    trigger,
    animationState,
  };
}

export default usePosterAnimation;
