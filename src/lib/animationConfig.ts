/**
 * ============================================================
 * MysticDAO Animation Configuration
 * ============================================================
 * Centralized animation parameter configuration optimized for
 * mobile 60fps performance. Target audience: Gen-Z overseas
 * users on modern mobile devices.
 *
 * The system uses Framer Motion for animations, including
 * poster generation, style switching, export sequences, etc.
 * This module balances visual aesthetics with mobile fluidity.
 * ============================================================
 */

import type { Transition } from 'framer-motion';

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

/**
 * Framer Motion compatible easing definition — either a cubic-bezier
 * array [x1, y1, x2, y2] or a named easing string.
 */
export type EasingDefinition = [number, number, number, number] | string;

/**
 * Spring configuration compatible with Framer Motion.
 */
export type SpringConfig = {
  type: 'spring';
  stiffness: number;
  damping: number;
  mass?: number;
  velocity?: number;
  restSpeed?: number;
  restDelta?: number;
};

/**
 * Tween fallback config used when reduced-motion is preferred.
 */
export type TweenFallback = {
  type: 'tween';
  duration: number;
  ease?: EasingDefinition;
};

/**
 * Runtime motion configuration returned by the performance detector.
 *
 * @property gpuAccelerated — Force compositor-layer promotion (translateZ / will-change)
 * @property reducedMotion  — Honor `prefers-reduced-motion: reduce`
 * @property isMobile       — Viewport < 768 px (tailwind `md` breakpoint)
 * @property targetFps      — Desired frame-rate budget (default 60)
 */
export interface MotionConfig {
  gpuAccelerated: boolean;
  reducedMotion: boolean;
  isMobile: boolean;
  targetFps: number;
}

/**
 * Return shape of {@link getAdaptiveAnimation}.
 */
export interface AdaptiveAnimation {
  duration: number;
  spring: SpringConfig | TweenFallback;
  enableFilters?: boolean;
}

/**
 * Common set of motion props (initial / animate / exit / transition)
 * used across poster animation presets.
 */
export interface MotionPreset {
  initial?: Record<string, number>;
  animate?: Record<string, number>;
  exit?: Record<string, number>;
  transition?: Transition;
}

// ---------------------------------------------------------------------------
// 1. Easing Definitions
// ---------------------------------------------------------------------------

/**
 * Curated easing presets designed for a premium, natural feel on both
 * desktop and mobile.  All values are Framer-Motion compatible.
 *
 * - `smooth`    — Primary easing, silky and natural
 * - `spring`    — Bouncy spring for poster-generation reveal (desktop)
 * - `springSoft`— Softer spring tuned for mobile (fewer oscillations)
 * - `enter`     — Entrance easing (decelerate)
 * - `exit`      — Exit easing (accelerate)
 */
export const EASINGS = {
  /** Primary easing — natural and fluid for standard transitions */
  smooth: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number],

  /** Spring easing — bouncy reveal for poster generation (desktop) */
  spring: { type: 'spring' as const, stiffness: 300, damping: 25 },

  /** Soft spring — mobile-optimized with reduced computational cost */
  springSoft: { type: 'spring' as const, stiffness: 200, damping: 30 },

  /** Entrance easing — starts instantly, decelerates to rest */
  enter: [0.0, 0.0, 0.2, 1.0] as [number, number, number, number],

  /** Exit easing — starts slowly, accelerates out */
  exit: [0.4, 0.0, 1.0, 1.0] as [number, number, number, number],
} as const;

// ---------------------------------------------------------------------------
// 2. Duration Definitions (Mobile Optimized)
// ---------------------------------------------------------------------------

/**
 * Duration tokens in **seconds**.  Chosen to stay well within the
 * ~16.67 ms frame budget on modern mobile GPUs while remaining
 * perceptually satisfying for Gen-Z users.
 *
 * | Token   | Use-case                              |
 * |---------|---------------------------------------|
 * | `fast`  | Button taps, micro-interactions       |
 * | `normal`| Standard page / component transitions |
 * | `slow`  | Poster card cross-fades               |
 * | `complex`| Full poster generation sequence      |
 * | `min`   | Minimum perceptible duration          |
 */
export const DURATIONS = {
  /** Fast feedback — button clicks, toggles, micro-interactions */
  fast: 0.15,

  /** Standard transition — most UI state changes */
  normal: 0.3,

  /** Slow transition — poster card switches, hero reveals */
  slow: 0.5,

  /** Complex animation — full poster generation choreography */
  complex: 0.8,

  /** Minimum perceptible duration — avoids "flash" feel */
  min: 0.1,
} as const;

// ---------------------------------------------------------------------------
// 3. Performance Optimisation Helpers
// ---------------------------------------------------------------------------

/**
 * Detects runtime device characteristics and user preferences to build
 * an optimal {@link MotionConfig}.
 *
 * Runs safely in SSR environments (Next.js / Astro, etc.) by guarding
 * every `window` access behind `typeof window !== 'undefined'`.
 *
 * @example
 * ```ts
 * const config = getOptimizedConfig();
 * if (config.isMobile) { …use lighter animations… }
 * ```
 */
export const getOptimizedConfig = (): MotionConfig => {
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    gpuAccelerated: true,
    reducedMotion: prefersReduced,
    isMobile,
    targetFps: 60,
  };
};

/**
 * GPU-acceleration CSS string.  Apply to elements that animate
 * `transform` or `opacity` to promote them to their own compositor
 * layer, avoiding main-thread paint work.
 *
 * @example
 * ```tsx
 * <motion.div style={{ ...GPU_ACCELERATED }} />
 * ```
 */
export const GPU_ACCELERATED: React.CSSProperties = {
  willChange: 'transform, opacity',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
} as const;

// ---------------------------------------------------------------------------
// 4. Poster Animation Presets
// ---------------------------------------------------------------------------

/**
 * Ready-to-spread motion presets for every poster-related interaction.
 * Import individual presets or destructure the whole object.
 *
 * Usage with Framer Motion:
 * ```tsx
 * <motion.div {...posterAnimations.enter} />
 * <motion.div
 *   {...posterAnimations.generate(isMobile)}
 *   whileHover={posterAnimations.exportButton.whileHover}
 * />
 * ```
 */
export const posterAnimations = {
  /**
   * Poster entrance — fade-in combined with a subtle upward drift.
   * Ideal for the first appearance of a poster card in the viewport.
   */
  enter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.enter,
    },
  } as MotionPreset,

  /**
   * Poster generation — elastic scale-in reveal.
   *
   * Uses the strong spring on desktop and the softer, mobile-optimised
   * spring on narrow viewports to stay inside the 16 ms frame budget.
   *
   * @param isMobile — viewport width < 768 px
   */
  generate: (isMobile: boolean): MotionPreset => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: isMobile ? EASINGS.springSoft : EASINGS.spring,
  }),

  /**
   * Style switch — simple opacity cross-fade.
   * Used when the user swaps between aesthetic styles (e.g. cyberpunk → mystic).
   */
  styleSwitch: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATIONS.normal },
  } as MotionPreset,

  /**
   * Stamp-down — dramatic scale+rotate entrance mimicking a wax seal
   * being pressed onto the poster.
   */
  stamp: {
    initial: { opacity: 0, scale: 2, rotate: -15 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 15,
    },
  } as MotionPreset,

  /**
   * Export button feedback — subtle scale response on hover / tap.
   * Keeps the button feeling tactile without overwhelming the user.
   */
  exportButton: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: DURATIONS.fast },
  } as const,
} as const;

// ---------------------------------------------------------------------------
// 5. Adaptive Animation Helper
// ---------------------------------------------------------------------------

/**
 * Returns animation parameters automatically adjusted for the current
 * device's capabilities and the user's motion preferences.
 *
 * | Scenario             | Result                                          |
 * |----------------------|-------------------------------------------------|
 * | `prefers-reduced-motion: reduce` | Zero-duration tween (instant)      |
 * | Mobile viewport      | Shortened durations, soft spring, filters off   |
 * | Desktop              | Full durations, strong spring, filters enabled  |
 *
 * @example
 * ```tsx
 * const adaptive = getAdaptiveAnimation();
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={adaptive.spring}
 * />
 * ```
 */
export const getAdaptiveAnimation = (): AdaptiveAnimation => {
  const config = getOptimizedConfig();

  // Accessibility-first: honour reduced-motion preferences
  if (config.reducedMotion) {
    return {
      duration: 0,
      spring: { type: 'tween', duration: 0.1 },
    };
  }

  // Mobile path: shorter durations + soft spring + disable filter effects
  if (config.isMobile) {
    return {
      duration: DURATIONS.normal * 0.8, // 20 % faster on mobile
      spring: EASINGS.springSoft,
      enableFilters: false, // blur / backdrop-filter are expensive on Mali GPUs
    };
  }

  // Desktop path: full fidelity
  return {
    duration: DURATIONS.normal,
    spring: EASINGS.spring,
    enableFilters: true,
  };
};

// ---------------------------------------------------------------------------
// 6. Utility Helpers
// ---------------------------------------------------------------------------

/**
 * Debounce helper for resize/orientation events used to re-evaluate
 * {@link getOptimizedConfig} without flooding the main thread.
 *
 * @param fn    — callback to debounce
 * @param delay — milliseconds to wait (default 150)
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 150
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Intersection-based trigger: returns `true` once `element` enters
 * the viewport.  Useful for gating heavy poster animations so they
 * only run when the user can actually see them.
 *
 * @param element — DOM element to observe
 * @param callback — invoked with `isIntersecting` boolean
 */
export const observeVisibility = (
  element: Element,
  callback: (isVisible: boolean) => void,
  options?: IntersectionObserverInit
): (() => void) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    callback(true); // SSR / legacy fallback: assume visible
    return () => {};
  }

  const observer = new IntersectionObserver(
    ([entry]) => callback(entry.isIntersecting),
    { threshold: 0.1, ...options }
  );

  observer.observe(element);
  return () => observer.disconnect();
};

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

/**
 * Full animation configuration object.  Re-exports everything above
 * as a single import for convenience:
 *
 * ```ts
 * import animationConfig from '@/lib/animationConfig';
 * const adaptive = animationConfig.getAdaptiveAnimation();
 * ```
 */
const animationConfig = {
  EASINGS,
  DURATIONS,
  posterAnimations,
  getOptimizedConfig,
  getAdaptiveAnimation,
  GPU_ACCELERATED,
  debounce,
  observeVisibility,
} as const;

export default animationConfig;
