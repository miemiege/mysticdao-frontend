/**
 * StyleTransition — 风格切换动画组件
 *
 * 接收两个风格的海报配置，切换时使用：
 * - 交叉淡化（crossfade）+ 缩放过渡
 * - 装饰元素先淡出，新装饰淡入
 * - 文字内容滑动替换
 * - AnimatePresence + motion.div 驱动
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { PosterStyleName } from '@/lib/posterStyles';
import type { Gua64 } from '@/data/gua64';
import type { HexagramTalisman } from '@/data/hexagram-talismans';
import {
  styleTransitionVariants,
  decorationExitVariants,
  textSlideVariants,
  EASE_OUT_EXPO,
} from '@/lib/posterAnimations';
import { AnimatedPosterWrapper } from './AnimatedPosterWrapper';

export interface StyleTransitionProps {
  /** 当前卦象数据 */
  gua: Gua64;
  /** 当前符咒数据 */
  talisman: HexagramTalisman;
  /** 当前风格 */
  currentStyle: PosterStyleName;
  /** 可选：下一个风格（用于预加载） */
  nextStyle?: PosterStyleName;
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 是否显示装饰 */
  showDecorations?: boolean;
  /** 是否显示滤镜 */
  showFilters?: boolean;
  /** 是否禁用动画 */
  reducedMotion?: boolean;
  /** 切换完成回调 */
  onTransitionComplete?: () => void;
  /** 类名 */
  className?: string;
  /** 是否使用水墨揭示 */
  useInkReveal?: boolean;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.15, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export const StyleTransition: React.FC<StyleTransitionProps> = ({
  gua,
  talisman,
  currentStyle,
  nextStyle,
  width = 400,
  height = 600,
  showDecorations = true,
  showFilters = true,
  reducedMotion = false,
  onTransitionComplete,
  className,
  useInkReveal = false,
}) => {
  const [displayStyle, setDisplayStyle] = useState(currentStyle);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [posterKey, setPosterKey] = useState(0);

  // 监听风格变化触发过渡
  useEffect(() => {
    if (currentStyle === displayStyle) return;

    if (reducedMotion) {
      setDisplayStyle(currentStyle);
      setPosterKey((k) => k + 1);
      onTransitionComplete?.();
      return;
    }

    setIsTransitioning(true);

    // 阶段 1：旧海报退出
    const exitTimer = setTimeout(() => {
      setDisplayStyle(currentStyle);
      setPosterKey((k) => k + 1);

      // 阶段 2：新海报入场完成后标记过渡结束
      const enterTimer = setTimeout(() => {
        setIsTransitioning(false);
        onTransitionComplete?.();
      }, 650);

      return () => clearTimeout(enterTimer);
    }, 350);

    return () => clearTimeout(exitTimer);
  }, [currentStyle, displayStyle, reducedMotion, onTransitionComplete]);

  const handleAnimationComplete = useCallback(() => {
    if (!isTransitioning) {
      onTransitionComplete?.();
    }
  }, [isTransitioning, onTransitionComplete]);

  if (reducedMotion) {
    return (
      <div className={className} style={{ width, height }}>
        <AnimatedPosterWrapper
          gua={gua}
          talisman={talisman}
          style={displayStyle}
          width={width}
          height={height}
          showDecorations={showDecorations}
          showFilters={showFilters}
          reducedMotion
          trigger={posterKey}
          useInkReveal={useInkReveal}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait" onExitComplete={handleAnimationComplete}>
        <motion.div
          key={`style-${displayStyle}-${posterKey}`}
          style={{ width, height, position: 'absolute', top: 0, left: 0 }}
          variants={styleTransitionVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <AnimatedPosterWrapper
            gua={gua}
            talisman={talisman}
            style={displayStyle}
            width={width}
            height={height}
            showDecorations={showDecorations}
            showFilters={showFilters}
            reducedMotion={false}
            trigger={posterKey}
            useInkReveal={useInkReveal}
          />
        </motion.div>
      </AnimatePresence>

      {/* 过渡遮罩层（增强 crossfade 效果） */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="transition-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'currentColor',
              pointerEvents: 'none',
              zIndex: 10,
            }}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        )}
      </AnimatePresence>

      {/* 风格标签过渡提示 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${displayStyle}`}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: 'uppercase' as const,
            opacity: 0.5,
            pointerEvents: 'none',
            zIndex: 5,
          }}
          variants={textSlideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <span style={{ color: 'inherit' }}>{displayStyle}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

StyleTransition.displayName = 'StyleTransition';

export default StyleTransition;
