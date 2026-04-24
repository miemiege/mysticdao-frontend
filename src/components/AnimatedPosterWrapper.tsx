/**
 * AnimatedPosterWrapper — 动画包装组件
 *
 * 用 Framer Motion 包装 TalismanPosterV2 的功能：
 * - 海报整体入场动画（淡入 + 轻微放大）
 * - 内部各 SVG 元素（卦符、标题、判词、印章等）依次 stagger 入场
 * - 支持 trigger prop 控制重播动画
 * - 支持 onAnimationComplete 回调
 * - 不修改 TalismanPosterV2，通过重新渲染带 motion 的 SVG 结构实现
 */

import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

import { PosterStyleName, getStyleConfig } from '@/lib/posterStyles';
import { getTheme } from '@/lib/theme';
import type { Gua64 } from '@/data/gua64';
import type { HexagramTalisman } from '@/data/hexagram-talismans';
import { PosterFilters } from './PosterFilters';
import { PosterDecorations } from './PosterDecorations';
import {
  posterEntranceVariants,
  elementStaggerVariants,
  decorationStaggerVariants,
  symbolRevealVariants,
  titleRevealVariants,
  subtitleRevealVariants,
  lineRevealVariants,
  blessingRevealVariants,
  judgmentRevealVariants,
  keywordsRevealVariants,
  keywordItemVariants,
  elementCircleVariants,
  elementTextVariants,
  fortuneRevealVariants,
  brandRevealVariants,
  sealStampVariants,
  sealTextVariants,
  getAnimationState,
} from '@/lib/posterAnimations';

export interface AnimatedPosterWrapperProps {
  gua: Gua64;
  talisman: HexagramTalisman;
  style: PosterStyleName;
  width?: number;
  height?: number;
  showDecorations?: boolean;
  showFilters?: boolean;
  className?: string;
  /** 触发重播动画的 key */
  trigger?: number | string;
  /** 是否禁用动画 */
  reducedMotion?: boolean;
  /** 动画完成回调 */
  onAnimationComplete?: () => void;
  /** 是否使用水墨揭示效果（ink/vintage 风格） */
  useInkReveal?: boolean;
}

/** 为 motion.svg 子元素选择正确的 variant key */
function pickVariant(
  base: Variants,
  isVisible: boolean,
  reducedMotion: boolean
): string {
  if (reducedMotion) return 'reduced';
  return isVisible ? 'visible' : 'hidden';
}

export const AnimatedPosterWrapper: React.FC<AnimatedPosterWrapperProps> = ({
  gua,
  talisman,
  style,
  width = 400,
  height = 600,
  showDecorations = true,
  showFilters = true,
  className,
  trigger = 0,
  reducedMotion = false,
  onAnimationComplete,
  useInkReveal = false,
}) => {
  const config = getStyleConfig(style);
  const theme = getTheme(gua.element);
  const score = (() => {
    const map: Record<string, number> = {
      '大吉': 95,
      '吉': 80,
      '中吉': 70,
      '中平': 55,
      '小凶': 40,
      '凶': 25,
      '大凶': 10,
    };
    return map[gua.fortune] || 50;
  })();

  const sealText = score >= 80 ? '上吉' : score >= 60 ? '中吉' : '需谨慎';

  // 动画可见状态
  const [isVisible, setIsVisible] = React.useState(false);

  // trigger 变化时重播动画
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, reducedMotion ? 10 : 80);
    return () => clearTimeout(timer);
  }, [trigger, reducedMotion]);

  // 初始播放
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), reducedMotion ? 10 : 100);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  const posterState = getAnimationState(isVisible, reducedMotion);
  const staggerState = pickVariant(elementStaggerVariants, isVisible, reducedMotion);
  const decoStaggerState = pickVariant(decorationStaggerVariants, isVisible, reducedMotion);

  const memoizedDecorations = useMemo(
    () => (showDecorations ? <PosterDecorations style={style} /> : null),
    [showDecorations, style]
  );

  const memoizedFilters = useMemo(
    () => (showFilters ? <PosterFilters /> : null),
    [showFilters]
  );

  // 水墨揭示版本（ink / vintage）
  const shouldUseInkReveal = useInkReveal && (style === 'ink' || style === 'vintage');

  const posterContent = (
    <>
      {memoizedFilters}

      {/* 背景 */}
      <motion.rect
        width={width}
        height={height}
        fill={config.bgColor}
        initial={{ opacity: reducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      />
      {config.bgGradient && (
        <motion.rect
          width={width}
          height={height}
          fill={config.bgGradient}
          opacity={0.9}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.5, ease: 'easeOut' }}
        />
      )}

      {/* 噪点纹理层 */}
      <rect
        width={width}
        height={height}
        fill="transparent"
        filter="url(#poster-noise)"
        opacity={config.noiseOpacity}
        style={{ mixBlendMode: 'overlay' }}
      />

      {/* 装饰层（stagger 容器） */}
      {showDecorations && (
        <motion.g
          variants={decorationStaggerVariants}
          initial="hidden"
          animate={decoStaggerState}
        >
          <motion.g variants={decorationFadeVariants}>
            {memoizedDecorations}
          </motion.g>
        </motion.g>
      )}

      {/* 主要内容 stagger 容器 */}
      <motion.g
        variants={elementStaggerVariants}
        initial="hidden"
        animate={staggerState}
      >
        {/* 卦象符号 */}
        <motion.text
          x={width / 2}
          y={90}
          textAnchor="middle"
          fill={config.textColor}
          fontSize={56}
          fontFamily="'Noto Serif SC', serif"
          variants={symbolRevealVariants}
          initial="hidden"
          animate={pickVariant(symbolRevealVariants, isVisible, reducedMotion)}
        >
          {gua.symbol}
        </motion.text>

        {/* 英文卦名 */}
        <motion.text
          x={width / 2}
          y={135}
          textAnchor="middle"
          fill={config.accentColor}
          fontSize={18}
          fontFamily={config.fontFamilyEn}
          fontWeight="600"
          letterSpacing="2"
          variants={titleRevealVariants}
          initial="hidden"
          animate={pickVariant(titleRevealVariants, isVisible, reducedMotion)}
        >
          {gua.nameEn.toUpperCase()}
        </motion.text>

        {/* 中文卦名 */}
        <motion.text
          x={width / 2}
          y={165}
          textAnchor="middle"
          fill={config.textColor}
          fontSize={14}
          fontFamily="'Noto Serif SC', serif"
          variants={subtitleRevealVariants}
          initial="hidden"
          animate={pickVariant(subtitleRevealVariants, isVisible, reducedMotion)}
        >
          {gua.name}
        </motion.text>

        {/* 分隔线 */}
        <motion.line
          x1={width / 2 - 60}
          y1={185}
          x2={width / 2 + 60}
          y2={185}
          stroke={config.borderColor}
          strokeWidth="1"
          variants={lineRevealVariants}
          initial="hidden"
          animate={pickVariant(lineRevealVariants, isVisible, reducedMotion)}
          style={{ transformOrigin: `${width / 2}px 185px` }}
        />

        {/* 祈福主题 */}
        <motion.text
          x={width / 2}
          y={215}
          textAnchor="middle"
          fill={config.accentColor}
          fontSize={13}
          fontFamily={config.fontFamilyEn}
          letterSpacing="1"
          variants={blessingRevealVariants}
          initial="hidden"
          animate={pickVariant(blessingRevealVariants, isVisible, reducedMotion)}
        >
          {talisman.blessingTheme}
        </motion.text>

        {/* 英文判词 */}
        <motion.foreignObject
          x={40}
          y={240}
          width={width - 80}
          height={120}
          variants={judgmentRevealVariants}
          initial="hidden"
          animate={pickVariant(judgmentRevealVariants, isVisible, reducedMotion)}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              color: config.textColor,
              fontSize: '12px',
              lineHeight: '1.6',
              fontFamily: config.fontFamilyEn,
              textAlign: 'center',
              opacity: 0.85,
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {gua.judgmentEn}
          </div>
        </motion.foreignObject>

        {/* 关键词 */}
        <motion.g
          transform={`translate(${width / 2}, ${height - 180})`}
          variants={keywordsRevealVariants}
          initial="hidden"
          animate={pickVariant(keywordsRevealVariants, isVisible, reducedMotion)}
        >
          {gua.keywordsEn.slice(0, 3).map((kw, i) => (
            <motion.text
              key={kw}
              x={(i - 1) * 70}
              y={0}
              textAnchor="middle"
              fill={config.accentColor}
              fontSize={10}
              fontFamily={config.fontFamilyEn}
              letterSpacing="1"
              variants={keywordItemVariants}
              initial="hidden"
              animate={pickVariant(keywordItemVariants, isVisible, reducedMotion)}
            >
              {kw.toUpperCase()}
            </motion.text>
          ))}
        </motion.g>

        {/* 五行指示 */}
        <motion.g
          transform={`translate(${width / 2}, ${height - 130})`}
          variants={elementCircleVariants}
          initial="hidden"
          animate={pickVariant(elementCircleVariants, isVisible, reducedMotion)}
        >
          <circle
            cx={0}
            cy={0}
            r={22}
            fill="none"
            stroke={theme.primary}
            strokeWidth="1.5"
          />
          <motion.text
            x={0}
            y={5}
            textAnchor="middle"
            fill={theme.primary}
            fontSize={12}
            fontFamily="'Noto Serif SC', serif"
            variants={elementTextVariants}
            initial="hidden"
            animate={pickVariant(elementTextVariants, isVisible, reducedMotion)}
          >
            {gua.element}
          </motion.text>
        </motion.g>

        {/* 运势等级 */}
        <motion.text
          x={width / 2}
          y={height - 85}
          textAnchor="middle"
          fill={config.textColor}
          fontSize={11}
          fontFamily={config.fontFamilyEn}
          letterSpacing="2"
          variants={fortuneRevealVariants}
          initial="hidden"
          animate={pickVariant(fortuneRevealVariants, isVisible, reducedMotion)}
        >
          {gua.fortuneEn.toUpperCase()}
        </motion.text>

        {/* 印章 */}
        <motion.g
          transform={`translate(${width - 70}, ${height - 70})`}
          variants={sealStampVariants}
          initial="hidden"
          animate={pickVariant(sealStampVariants, isVisible, reducedMotion)}
        >
          <motion.rect
            x={-28}
            y={-28}
            width={56}
            height={56}
            fill={config.sealBg}
            stroke={config.sealColor}
            strokeWidth="2"
            rx="3"
            variants={sealTextVariants}
            initial="hidden"
            animate={pickVariant(sealTextVariants, isVisible, reducedMotion)}
          />
          <motion.text
            x="0"
            y="4"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={config.sealColor}
            fontSize={18}
            fontFamily="'Noto Serif SC', serif"
            fontWeight="bold"
            variants={sealTextVariants}
            initial="hidden"
            animate={pickVariant(sealTextVariants, isVisible, reducedMotion)}
          >
            {sealText}
          </motion.text>
        </motion.g>

        {/* 底部品牌 */}
        <motion.text
          x={width / 2}
          y={height - 20}
          textAnchor="middle"
          fill={config.textColor}
          fontSize={8}
          fontFamily={config.fontFamilyEn}
          letterSpacing="3"
          variants={brandRevealVariants}
          initial="hidden"
          animate={pickVariant(brandRevealVariants, isVisible, reducedMotion)}
        >
          MYSTIC DAO
        </motion.text>
      </motion.g>
    </>
  );

  return (
    <AnimatePresence mode="wait" onExitComplete={onAnimationComplete}>
      <motion.svg
        key={`poster-${style}-${trigger}`}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ fontFamily: config.fontFamilyEn }}
        data-poster-style={style}
        data-poster-version="2.0-animated"
        variants={posterEntranceVariants}
        initial="hidden"
        animate={posterState}
        exit="exit"
        onAnimationComplete={onAnimationComplete}
      >
        {posterContent}
      </motion.svg>
    </AnimatePresence>
  );
};

AnimatedPosterWrapper.displayName = 'AnimatedPosterWrapper';

export default AnimatedPosterWrapper;
