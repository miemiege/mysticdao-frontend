/**
 * Poster Animations — 动画变体配置系统
 *
 * 提供可复用、可组合的 Framer Motion Variants，用于海报入场、
 * 元素 stagger、印章盖印、装饰淡入和风格切换等场景。
 *
 * 所有变体均包含 reduced-motion 友好版本。
 */

import type { Variants, Transition } from 'framer-motion';

// ---------------------------------------------------------------------------
// Easing 常量（tuple 断言，适配 verbatimModuleSyntax）
// ---------------------------------------------------------------------------

/** 主缓动曲线：ease-out-expo 感，用于整体入场 */
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** 次缓动曲线：稍柔和，用于文字元素 */
export const EASE_OUT_SOFT = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** 弹性缓动：用于印章弹入 */
export const EASE_SPRING_GENTLE = { type: 'spring' as const, stiffness: 200, damping: 15 };

/** 弹性缓动：用于装饰元素 */
export const EASE_SPRING_SOFT = { type: 'spring' as const, stiffness: 120, damping: 20 };

// ---------------------------------------------------------------------------
// 时长常量
// ---------------------------------------------------------------------------

export const DURATION_POSTER_ENTRANCE = 0.6;
export const DURATION_ELEMENT_FADE = 0.5;
export const DURATION_TEXT_REVEAL = 0.45;
export const DURATION_LINE_DRAW = 0.4;
export const DURATION_DECORATION_FADE = 0.8;
export const DURATION_STYLE_TRANSITION = 0.5;
export const STAGGER_CHILDREN = 0.1;
export const STAGGER_DECORATIONS = 0.12;
export const DELAY_CHILDREN = 0.2;
export const DELAY_SEAL = 0.5;

// ---------------------------------------------------------------------------
// 1. 海报整体入场（淡入 + 轻微放大）
// ---------------------------------------------------------------------------

export const posterEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: DURATION_POSTER_ENTRANCE,
      ease: EASE_OUT_EXPO,
    },
  },
  reduced: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.01 },
  },
};

// ---------------------------------------------------------------------------
// 2. 子元素依次入场（stagger 容器）
// ---------------------------------------------------------------------------

export const elementStaggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_CHILDREN,
      delayChildren: DELAY_CHILDREN,
    },
  },
  reduced: {
    transition: {
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
};

/** 装饰元素专用的 stagger（更慢，更低 opacity） */
export const decorationStaggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_DECORATIONS,
      delayChildren: DELAY_CHILDREN + 0.3,
    },
  },
  reduced: {
    transition: {
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
};

// ---------------------------------------------------------------------------
// 3. 各子元素变体
// ---------------------------------------------------------------------------

/** 卦象符号 — 从下方淡入上浮 */
export const symbolRevealVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 0.9,
    y: 0,
    transition: { duration: DURATION_TEXT_REVEAL, ease: EASE_OUT_SOFT },
  },
  reduced: { opacity: 0.9, y: 0, transition: { duration: 0.01 } },
};

/** 英文卦名 — 从下方淡入 */
export const titleRevealVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_TEXT_REVEAL, ease: EASE_OUT_SOFT },
  },
  reduced: { opacity: 1, y: 0, transition: { duration: 0.01 } },
};

/** 中文卦名 — 淡入 */
export const subtitleRevealVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.7,
    transition: { duration: DURATION_TEXT_REVEAL, ease: EASE_OUT_SOFT },
  },
  reduced: { opacity: 0.7, transition: { duration: 0.01 } },
};

/** 分隔线 — 从中心向两侧展开 */
export const lineRevealVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 0.5,
    scaleX: 1,
    transition: { duration: DURATION_LINE_DRAW, ease: EASE_OUT_EXPO },
  },
  reduced: { opacity: 0.5, scaleX: 1, transition: { duration: 0.01 } },
};

/** 祈福主题 — 淡入 */
export const blessingRevealVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 0.8,
    y: 0,
    transition: { duration: DURATION_ELEMENT_FADE, ease: EASE_OUT_SOFT },
  },
  reduced: { opacity: 0.8, y: 0, transition: { duration: 0.01 } },
};

/** 判词容器 — 淡入 */
export const judgmentRevealVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION_ELEMENT_FADE, ease: EASE_OUT_SOFT },
  },
  reduced: { opacity: 1, transition: { duration: 0.01 } },
};

/** 关键词 — 从两侧向中心汇聚 */
export const keywordsRevealVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.7,
    transition: {
      duration: DURATION_ELEMENT_FADE,
      ease: EASE_OUT_SOFT,
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  reduced: { opacity: 0.7, transition: { duration: 0.01 } },
};

export const keywordItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 0.7,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT_SOFT },
  },
  reduced: { opacity: 0.7, y: 0, transition: { duration: 0.01 } },
};

/** 五行指示圈 — 缩放淡入 */
export const elementCircleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 0.6,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
  reduced: { opacity: 0.6, scale: 1, transition: { duration: 0.01 } },
};

/** 五行文字 — 淡入 */
export const elementTextVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.8,
    transition: { duration: 0.35, ease: EASE_OUT_SOFT },
  },
  reduced: { opacity: 0.8, transition: { duration: 0.01 } },
};

/** 运势等级 — 淡入 */
export const fortuneRevealVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.6,
    transition: { duration: 0.4, ease: EASE_OUT_SOFT },
  },
  reduced: { opacity: 0.6, transition: { duration: 0.01 } },
};

/** 底部品牌 — 淡入 */
export const brandRevealVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.4,
    transition: { duration: 0.4, ease: EASE_OUT_SOFT, delay: 0.3 },
  },
  reduced: { opacity: 0.4, transition: { duration: 0.01 } },
};

// ---------------------------------------------------------------------------
// 4. 印章盖印动画（缩放弹入 + 旋转归位）
// ---------------------------------------------------------------------------

export const sealStampVariants: Variants = {
  hidden: {
    scale: 2,
    opacity: 0,
    rotate: -15,
    y: -40,
  },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      delay: DELAY_SEAL,
    },
  },
  reduced: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    y: 0,
    transition: { duration: 0.01 },
  },
};

/** 印章文字单独变体（略微延迟） */
export const sealTextVariants: Variants = {
  hidden: { opacity: 0, scale: 1.2 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 18,
      delay: DELAY_SEAL + 0.15,
    },
  },
  reduced: { opacity: 1, scale: 1, transition: { duration: 0.01 } },
};

// ---------------------------------------------------------------------------
// 5. 装饰元素淡入（低 opacity、慢速）
// ---------------------------------------------------------------------------

export const decorationFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION_DECORATION_FADE,
      ease: EASE_OUT_SOFT,
    },
  },
  reduced: { opacity: 1, transition: { duration: 0.01 } },
};

/** 角饰专用 — 带轻微缩放 */
export const cornerOrnamentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 0.8,
    scale: 1,
    transition: {
      duration: DURATION_DECORATION_FADE,
      ease: EASE_OUT_SOFT,
    },
  },
  reduced: { opacity: 0.8, scale: 1, transition: { duration: 0.01 } },
};

/** 边框专用 — 线条展开感 */
export const borderFrameVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 0.8,
    scale: 1,
    transition: {
      duration: DURATION_DECORATION_FADE * 1.2,
      ease: EASE_OUT_EXPO,
    },
  },
  reduced: { opacity: 0.8, scale: 1, transition: { duration: 0.01 } },
};

/** 太极/莲花/云纹 — 旋转淡入 */
export const patternRevealVariants: Variants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: {
    opacity: 0.3,
    rotate: 0,
    transition: {
      duration: DURATION_DECORATION_FADE,
      ease: EASE_OUT_SOFT,
    },
  },
  reduced: { opacity: 0.3, rotate: 0, transition: { duration: 0.01 } },
};

/** 龙纹专用 — 更 subtle */
export const dragonRevealVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 0.2,
    x: 0,
    transition: {
      duration: DURATION_DECORATION_FADE * 1.5,
      ease: EASE_OUT_SOFT,
    },
  },
  reduced: { opacity: 0.2, x: 0, transition: { duration: 0.01 } },
};

// ---------------------------------------------------------------------------
// 6. 风格切换过渡（交叉淡化 + 缩放）
// ---------------------------------------------------------------------------

export const styleTransitionVariants: Variants = {
  enter: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  center: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: DURATION_STYLE_TRANSITION,
      ease: EASE_OUT_EXPO,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    y: -10,
    transition: {
      duration: DURATION_STYLE_TRANSITION * 0.6,
      ease: EASE_OUT_EXPO,
    },
  },
  reduced: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.01 },
  },
};

/** 装饰元素在风格切换时的退出变体 */
export const decorationExitVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT_SOFT } },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: EASE_OUT_EXPO },
  },
  reduced: { opacity: 1, transition: { duration: 0.01 } },
};

/** 文字元素在风格切换时的滑动替换 */
export const textSlideVariants: Variants = {
  enter: { opacity: 0, y: 15 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT_SOFT, delay: 0.1 },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: { duration: 0.25, ease: EASE_OUT_EXPO },
  },
  reduced: { opacity: 1, y: 0, transition: { duration: 0.01 } },
};

// ---------------------------------------------------------------------------
// 7. 水墨晕染揭示专用变体
// ---------------------------------------------------------------------------

export const inkRevealMaskVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: EASE_OUT_EXPO,
    },
  },
  reduced: { scale: 1, opacity: 1, transition: { duration: 0.01 } },
};

export const inkSpotVariants: Variants = {
  hidden: { r: 0, opacity: 0 },
  visible: (i: number) => ({
    r: [0, 30 + i * 15, 60 + i * 20],
    opacity: [0, 0.6, 0.4],
    transition: {
      duration: 1.5 + i * 0.3,
      ease: EASE_OUT_EXPO,
      times: [0, 0.4, 1],
    },
  }),
  reduced: { r: 60, opacity: 0.4, transition: { duration: 0.01 } },
};

// ---------------------------------------------------------------------------
// 8. 工具函数
// ---------------------------------------------------------------------------

/**
 * 根据 reduced-motion 偏好获取实际使用的 variant key
 */
export function getAnimationState(
  isVisible: boolean,
  prefersReducedMotion: boolean
): string {
  if (prefersReducedMotion) return 'reduced';
  return isVisible ? 'visible' : 'hidden';
}

/**
 * 构建 AnimatePresence 模式下的 variant key 映射
 */
export function getPresenceAnimationState(
  _isVisible: boolean,
  prefersReducedMotion: boolean
): { initial: string; animate: string; exit: string } {
  if (prefersReducedMotion) {
    return { initial: 'reduced', animate: 'reduced', exit: 'reduced' };
  }
  return {
    initial: 'enter',
    animate: 'center',
    exit: 'exit',
  };
}

/**
 * 合并自定义 transition 到变体
 */
export function withDelay(
  variants: Variants,
  delay: number,
  prefersReducedMotion: boolean = false
): Variants {
  if (prefersReducedMotion) return variants;

  const merged: Variants = {};
  for (const [key, value] of Object.entries(variants)) {
    if (typeof value === 'object' && value !== null && 'transition' in value) {
      merged[key] = {
        ...value,
        transition: {
          ...(value as Record<string, unknown>).transition as Transition,
          delay,
        },
      };
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

// ---------------------------------------------------------------------------
// 9. 导出清单（用于文档/遍历）
// ---------------------------------------------------------------------------

export const ALL_POSTER_VARIANTS = [
  'posterEntranceVariants',
  'elementStaggerVariants',
  'decorationStaggerVariants',
  'symbolRevealVariants',
  'titleRevealVariants',
  'subtitleRevealVariants',
  'lineRevealVariants',
  'blessingRevealVariants',
  'judgmentRevealVariants',
  'keywordsRevealVariants',
  'keywordItemVariants',
  'elementCircleVariants',
  'elementTextVariants',
  'fortuneRevealVariants',
  'brandRevealVariants',
  'sealStampVariants',
  'sealTextVariants',
  'decorationFadeVariants',
  'cornerOrnamentVariants',
  'borderFrameVariants',
  'patternRevealVariants',
  'dragonRevealVariants',
  'styleTransitionVariants',
  'decorationExitVariants',
  'textSlideVariants',
  'inkRevealMaskVariants',
  'inkSpotVariants',
] as const;

export type PosterVariantName = typeof ALL_POSTER_VARIANTS[number];
