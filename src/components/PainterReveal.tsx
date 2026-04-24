/**
 * PainterReveal — 水墨晕染揭示效果
 *
 * 使用 SVG mask + clipPath 实现水墨扩散揭示。
 * 模拟毛笔笔触的扩散路径，适合 ink 和 vintage 风格。
 *
 * 原理：
 * 1. 生成一组随机分布的墨滴（circles）
 * 2. 通过 motion 动画控制墨滴半径从 0 扩散到覆盖整个海报
 * 3. 被遮罩的内容随墨滴扩散而逐渐显现
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

export interface PainterRevealProps {
  /** 海报宽度 */
  width?: number;
  /** 海报高度 */
  height?: number;
  /** 是否显示揭示 */
  isVisible?: boolean;
  /** 是否禁用动画 */
  reducedMotion?: boolean;
  /** 动画时长（秒） */
  duration?: number;
  /** 墨滴数量 */
  spotCount?: number;
  /** 墨滴颜色 */
  inkColor?: string;
  /** 动画完成回调 */
  onAnimationComplete?: () => void;
  /** 内部包裹的内容（被 mask 揭示的 SVG 元素） */
  children?: React.ReactNode;
  /** 类名 */
  className?: string;
}

/** 生成确定性伪随机序列 */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface InkSpot {
  id: number;
  cx: number;
  cy: number;
  maxR: number;
  delay: number;
  duration: number;
}

const maskSpotVariants: Variants = {
  hidden: { r: 0, opacity: 0 },
  visible: (spot: InkSpot) => ({
    r: spot.maxR,
    opacity: [0, 0.9, 1],
    transition: {
      r: {
        duration: spot.duration,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay: spot.delay,
      },
      opacity: {
        duration: spot.duration * 0.3,
        delay: spot.delay,
      },
    },
  }),
  reduced: (spot: InkSpot) => ({
    r: spot.maxR,
    opacity: 1,
    transition: { duration: 0.01 },
  }),
};

export const PainterReveal: React.FC<PainterRevealProps> = ({
  width = 400,
  height = 600,
  isVisible = true,
  reducedMotion = false,
  duration = 1.2,
  spotCount = 12,
  inkColor = '#1a1a1a',
  onAnimationComplete,
  children,
  className,
}) => {
  const maskId = useMemo(() => `ink-reveal-mask-${Math.random().toString(36).slice(2, 9)}`, []);
  const clipId = useMemo(() => `ink-reveal-clip-${Math.random().toString(36).slice(2, 9)}`, []);

  // 生成墨滴配置（确定性，基于尺寸和数量）
  const spots = useMemo<InkSpot[]>(() => {
    const rand = seededRandom(width * height + spotCount);
    const centerX = width / 2;
    const centerY = height / 2;

    return Array.from({ length: spotCount }, (_, i) => {
      // 从中心向外分布，前面几个靠近中心，后面更分散
      const spreadFactor = Math.pow(i / spotCount, 0.7);
      const angle = rand() * Math.PI * 2;
      const distance = spreadFactor * (Math.min(width, height) * 0.55);

      const cx = centerX + Math.cos(angle) * distance + (rand() - 0.5) * 40;
      const cy = centerY + Math.sin(angle) * distance + (rand() - 0.5) * 40;

      // 计算最大半径以覆盖边缘
      const dx = Math.max(cx, width - cx);
      const dy = Math.max(cy, height - cy);
      const maxR = Math.sqrt(dx * dx + dy * dy) * (0.6 + rand() * 0.4);

      return {
        id: i,
        cx,
        cy,
        maxR,
        delay: Math.sqrt(i / spotCount) * duration * 0.5,
        duration: duration * (0.6 + rand() * 0.4),
      };
    });
  }, [width, height, spotCount, duration]);

  // reduced-motion 时直接显示无遮罩内容
  if (reducedMotion) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {children}
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* 水墨扩散遮罩 */}
        <mask id={maskId}>
          <rect width={width} height={height} fill="black" />
          <g fill="white">
            {spots.map((spot) => (
              <motion.circle
                key={spot.id}
                cx={spot.cx}
                cy={spot.cy}
                fill="white"
                variants={maskSpotVariants}
                custom={spot}
                initial="hidden"
                animate={isVisible ? 'visible' : 'hidden'}
              />
            ))}
          </g>
        </mask>

        {/* 备用 clipPath（用于精细边缘） */}
        <clipPath id={clipId}>
          <rect width={width} height={height} />
        </clipPath>
      </defs>

      {/* 被遮罩的内容组 */}
      <motion.g
        mask={`url(#${maskId})`}
        clipPath={`url(#${clipId})`}
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        onAnimationComplete={onAnimationComplete}
      >
        {children}
      </motion.g>

      {/* 墨滴装饰层（半透明，叠加在上方营造水墨氛围） */}
      {isVisible && (
        <g opacity={0.08} pointerEvents="none">
          {spots.slice(0, 6).map((spot) => (
            <motion.circle
              key={`deco-${spot.id}`}
              cx={spot.cx}
              cy={spot.cy}
              fill={inkColor}
              variants={maskSpotVariants}
              custom={{
                ...spot,
                maxR: spot.maxR * 0.3,
                delay: spot.delay + 0.2,
                duration: spot.duration * 0.8,
              }}
              initial="hidden"
              animate="visible"
            />
          ))}
        </g>
      )}
    </svg>
  );
};

PainterReveal.displayName = 'PainterReveal';

export default PainterReveal;
