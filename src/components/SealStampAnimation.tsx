/**
 * SealStampAnimation — 印章盖印动画组件
 *
 * 模拟真实"盖章"动作：印章从上方落下 → 接触纸面轻微回弹 → 稳定。
 * 使用 Framer Motion spring physics，支持 reduced-motion 偏好。
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

export interface SealStampAnimationProps {
  /** 印章文字 */
  text?: string;
  /** 印章尺寸 */
  size?: number;
  /** 印章颜色 */
  color?: string;
  /** 印章背景色 */
  bgColor?: string;
  /** 是否播放动画 */
  isVisible?: boolean;
  /** 是否禁用动画 */
  reducedMotion?: boolean;
  /** 动画延迟（秒） */
  delay?: number;
  /** 动画完成回调 */
  onAnimationComplete?: () => void;
  /** 容器类名 */
  className?: string;
  /** 自定义位置 */
  x?: number;
  y?: number;
}

const stampContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const stampBodyVariants: Variants = {
  hidden: {
    y: -120,
    scale: 1.3,
    rotate: -20,
    opacity: 0,
  },
  visible: (delay: number) => ({
    y: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 180,
      damping: 12,
      mass: 1.2,
      delay,
    },
  }),
  exit: {
    y: -40,
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const stampBounceVariants: Variants = {
  hidden: { scale: 1 },
  visible: (delay: number) => ({
    scale: [1, 0.92, 1.04, 1],
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 10,
      delay: delay + 0.25,
      times: [0, 0.3, 0.6, 1],
      duration: 0.5,
    },
  }),
};

const stampTextVariants: Variants = {
  hidden: { opacity: 0, scale: 1.3 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 220,
      damping: 18,
      delay: delay + 0.35,
    },
  }),
};

const inkBlotVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (delay: number) => ({
    scale: [0, 1.8, 2.2],
    opacity: [0, 0.15, 0],
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      delay: delay + 0.3,
    },
  }),
};

export const SealStampAnimation: React.FC<SealStampAnimationProps> = ({
  text = '上吉',
  size = 56,
  color = '#8B0000',
  bgColor = 'transparent',
  isVisible = true,
  reducedMotion = false,
  delay = 0,
  onAnimationComplete,
  className,
  x = 0,
  y = 0,
}) => {
  if (reducedMotion) {
    return (
      <g transform={`translate(${x}, ${y})`} className={className}>
        <rect
          x={-size / 2}
          y={-size / 2}
          width={size}
          height={size}
          fill={bgColor}
          stroke={color}
          strokeWidth="2"
          rx="4"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={size * 0.45}
          fontFamily="'Noto Serif SC', serif"
          fontWeight="bold"
        >
          {text}
        </text>
      </g>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.g
          key={`stamp-${text}`}
          transform={`translate(${x}, ${y})`}
          className={className}
          variants={stampContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onAnimationComplete={onAnimationComplete}
        >
          {/* 印泥扩散效果 */}
          <motion.circle
            cx="0"
            cy="0"
            r={size / 2}
            fill={color}
            variants={inkBlotVariants}
            custom={delay}
            initial="hidden"
            animate="visible"
          />

          {/* 印章主体 */}
          <motion.g
            variants={stampBodyVariants}
            custom={delay}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* 轻微回弹效果层 */}
            <motion.g
              variants={stampBounceVariants}
              custom={delay}
              initial="hidden"
              animate="visible"
            >
              <rect
                x={-size / 2}
                y={-size / 2}
                width={size}
                height={size}
                fill={bgColor}
                stroke={color}
                strokeWidth="2"
                rx="4"
              />
            </motion.g>

            {/* 印章文字 */}
            <motion.text
              x="0"
              y="4"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={color}
              fontSize={size * 0.45}
              fontFamily="'Noto Serif SC', serif"
              fontWeight="bold"
              variants={stampTextVariants}
              custom={delay}
              initial="hidden"
              animate="visible"
            >
              {text}
            </motion.text>
          </motion.g>
        </motion.g>
      )}
    </AnimatePresence>
  );
};

SealStampAnimation.displayName = 'SealStampAnimation';

export default SealStampAnimation;
