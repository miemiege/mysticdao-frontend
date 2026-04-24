/**
 * SVG Filter Definitions — 质感层系统
 * 为不同风格提供纹理、噪点、光晕等视觉效果
 */

import React from 'react';
import type { StyleKey } from '@/lib/posterStyles';

interface PosterFiltersProps {
  uid: string;
  style: StyleKey;
}

const PosterFilters: React.FC<PosterFiltersProps> = ({ uid, style }) => {
  const isLight = style === 'ink' || style === 'vintagePrint';

  return (
    <defs>
      {/* 金色/主色光晕 */}
      <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={style === 'taoistYellow' ? 2 : 3} result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* 噪点纹理（纸张/质感） */}
      <filter id={`noise-${uid}`} x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={style === 'vintagePrint' ? 0.7 : style === 'darkMystic' ? 0.6 : 0.9}
          numOctaves={3}
          result="noise"
        />
        <feColorMatrix
          type="matrix"
          values={isLight
            ? '0 0 0 0 0.85  0 0 0 0 0.80  0 0 0 0 0.75  0 0 0 0.06 0'
            : '0 0 0 0 0.10  0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0.05 0'
          }
          in="noise"
          result="coloredNoise"
        />
        <feBlend mode={isLight ? 'multiply' : 'overlay'} in="coloredNoise" in2="SourceGraphic" />
      </filter>

      {/* 水墨晕染效果 */}
      {style === 'ink' && (
        <filter id={`ink-bleed-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="8" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      )}

      {/* 金箔闪光效果 */}
      {(style === 'imperialGold' || style === 'obsidianLux') && (
        <filter id={`gold-sparkle-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="2" result="noise" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.9  0 0 0 0 0.75  0 0 0 0 0.2  0 0 0 0.3 0"
            in="noise"
            result="goldNoise"
          />
          <feBlend mode="screen" in="goldNoise" in2="SourceGraphic" />
        </filter>
      )}

      {/* 暗红光晕（暗黑风格） */}
      {style === 'darkMystic' && (
        <filter id={`red-mist-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.5  0 0 0 0 0.0  0 0 0 0 0.0  0 0 0 0.4 0"
            in="blur"
            result="redBlur"
          />
          <feMerge>
            <feMergeNode in="redBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      )}

      {/* 阴影效果 */}
      <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" />
      </filter>

      {/* 线性渐变（通用） */}
      <linearGradient id={`grad-main-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
      </linearGradient>
    </defs>
  );
};

export default PosterFilters;
