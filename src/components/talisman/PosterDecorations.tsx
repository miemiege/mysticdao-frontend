/**
 * Poster Decorations — 风格化装饰元素库
 * 
 * 包含：角装饰、边框装饰、风格特定装饰（太极/莲花/龙纹/云纹）、分隔线、六爻、印章
 */

import React from 'react';
import type { StyleKey } from '@/lib/posterStyles';

// ============ 角装饰 ============

/** 回纹角装饰 */
export const CornerMeander: React.FC<{
  x: number; y: number; rotate: number; color: string; size?: number; strokeWidth?: number;
}> = ({ x, y, rotate, color, size = 18, strokeWidth = 1.2 }) => (
  <g transform={`rotate(${rotate}, ${x}, ${y})`}>
    <path
      d={`M${x} ${y} h${size} v${size * 0.35} h-${size * 0.65} v${size * 0.65} h-${size * 0.35} Z`}
      fill="none" stroke={color} strokeWidth={strokeWidth} strokeOpacity="0.5"
    />
    <path
      d={`M${x + 3} ${y + 3} h${size - 6} v${size * 0.25} h-${size * 0.55} v${size * 0.55} h-${size * 0.25} Z`}
      fill="none" stroke={color} strokeWidth={strokeWidth * 0.7} strokeOpacity="0.3"
    />
  </g>
);

/** 几何角装饰 */
export const CornerGeometric: React.FC<{
  x: number; y: number; rotate: number; color: string;
}> = ({ x, y, rotate, color }) => (
  <g transform={`rotate(${rotate}, ${x}, ${y})`}>
    <circle cx={x + 8} cy={y + 8} r="4" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
    <line x1={x + 16} y1={y} x2={x + 16} y2={y + 16} stroke={color} strokeWidth="1" strokeOpacity="0.4" />
    <line x1={x} y1={y + 16} x2={x + 16} y2={y + 16} stroke={color} strokeWidth="1" strokeOpacity="0.4" />
    <circle cx={x + 16} cy={y + 16} r="2" fill={color} fillOpacity="0.3" />
  </g>
);

/** 暗黑风格角装饰 */
export const CornerMystic: React.FC<{
  x: number; y: number; rotate: number; color: string;
}> = ({ x, y, rotate, color }) => (
  <g transform={`rotate(${rotate}, ${x}, ${y})`}>
    <circle cx={x + 10} cy={y + 10} r="8" fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.35" />
    <circle cx={x + 10} cy={y + 10} r="4" fill="none" stroke={color} strokeWidth="0.6" strokeOpacity="0.25" />
    <line x1={x + 10} y1={y + 2} x2={x + 10} y2={y + 18} stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
    <line x1={x + 2} y1={y + 10} x2={x + 18} y2={y + 10} stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
  </g>
);

// ============ 边框装饰 ============

export const OrnateBorder: React.FC<{
  x: number; y: number; w: number; h: number; color: string; strokeWidth?: number;
}> = ({ x, y, w, h, color, strokeWidth = 1.5 }) => {
  const m = 4;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth={strokeWidth} strokeOpacity="0.5" rx="4" />
      <rect x={x + m} y={y + m} width={w - m * 2} height={h - m * 2} fill="none" stroke={color} strokeWidth={strokeWidth * 0.6} strokeOpacity="0.25" rx="2" />
      <circle cx={x + 8} cy={y + 8} r="2" fill={color} fillOpacity="0.3" />
      <circle cx={x + w - 8} cy={y + 8} r="2" fill={color} fillOpacity="0.3" />
      <circle cx={x + 8} cy={y + h - 8} r="2" fill={color} fillOpacity="0.3" />
      <circle cx={x + w - 8} cy={y + h - 8} r="2" fill={color} fillOpacity="0.3" />
    </g>
  );
};

export const GeometricBorder: React.FC<{
  x: number; y: number; w: number; h: number; color: string;
}> = ({ x, y, w, h, color }) => {
  const seg = 30;
  return (
    <g>
      <line x1={x} y1={y + seg} x2={x} y2={y} stroke={color} strokeWidth="2" />
      <line x1={x} y1={y} x2={x + seg} y2={y} stroke={color} strokeWidth="2" />
      <line x1={x + w - seg} y1={y} x2={x + w} y2={y} stroke={color} strokeWidth="2" />
      <line x1={x + w} y1={y} x2={x + w} y2={y + seg} stroke={color} strokeWidth="2" />
      <line x1={x} y1={y + h - seg} x2={x} y2={y + h} stroke={color} strokeWidth="2" />
      <line x1={x} y1={y + h} x2={x + seg} y2={y + h} stroke={color} strokeWidth="2" />
      <line x1={x + w - seg} y1={y + h} x2={x + w} y2={y + h} stroke={color} strokeWidth="2" />
      <line x1={x + w} y1={y + h} x2={x + w} y2={y + h - seg} stroke={color} strokeWidth="2" />
      <line x1={x} y1={y + seg} x2={x} y2={y + h - seg} stroke={color} strokeWidth="1" strokeDasharray="4,4" />
      <line x1={x + w} y1={y + seg} x2={x + w} y2={y + h - seg} stroke={color} strokeWidth="1" strokeDasharray="4,4" />
      <line x1={x + seg} y1={y} x2={x + w - seg} y2={y} stroke={color} strokeWidth="0.8" strokeDasharray="2,3" />
      <line x1={x + seg} y1={y + h} x2={x + w - seg} y2={y + h} stroke={color} strokeWidth="0.8" strokeDasharray="2,3" />
    </g>
  );
};

export const DoubleBorder: React.FC<{
  x: number; y: number; w: number; h: number; color: string;
}> = ({ x, y, w, h, color }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.5" rx="2" />
    <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.3" rx="1" />
    <line x1={x + 2} y1={y + 12} x2={x + 2} y2={y + 24} stroke={color} strokeWidth="1" strokeOpacity="0.3" />
    <line x1={x + w - 2} y1={y + 12} x2={x + w - 2} y2={y + 24} stroke={color} strokeWidth="1" strokeOpacity="0.3" />
    <line x1={x + 2} y1={y + h - 24} x2={x + 2} y2={y + h - 12} stroke={color} strokeWidth="1" strokeOpacity="0.3" />
    <line x1={x + w - 2} y1={y + h - 24} x2={x + w - 2} y2={y + h - 12} stroke={color} strokeWidth="1" strokeOpacity="0.3" />
  </g>
);

// ============ 分隔线装饰 ============

export const FancyDivider: React.FC<{
  x: number; y: number; width: number; color: string; style?: StyleKey;
}> = ({ x, y, width: w, color, style }) => {
  const cx = x + w / 2;
  if (style === 'taoistYellow') {
    return (
      <g>
        <line x1={x} y1={y} x2={cx - 15} y2={y} stroke={color} strokeWidth="1.5" />
        <line x1={cx + 15} y1={y} x2={x + w} y2={y} stroke={color} strokeWidth="1.5" />
        <circle cx={cx} cy={y} r="4" fill="none" stroke={color} strokeWidth="1.2" />
        <circle cx={cx} cy={y} r="2" fill={color} fillOpacity="0.4" />
      </g>
    );
  }
  return (
    <g>
      <line x1={x} y1={y} x2={cx - 20} y2={y} stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1={cx + 20} y1={y} x2={x + w} y2={y} stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <circle cx={cx} cy={y} r="2" fill={color} fillOpacity="0.3" />
    </g>
  );
};

// ============ 风格特定装饰 ============

export const InkTaijiDeco: React.FC<{ cx: number; y: number; size?: number; color?: string }> =
  ({ cx, y, size = 60, color = '#B8A898' }) => (
    <g opacity="0.15">
      <circle cx={cx} cy={y} r={size / 2} fill="none" stroke={color} strokeWidth="1" />
      <path d={`M${cx - size / 2} ${y} A${size / 4} ${size / 4} 0 0 1 ${cx} ${y} A${size / 4} ${size / 4} 0 0 0 ${cx + size / 2} ${y} A${size / 2} ${size / 2} 0 0 1 ${cx - size / 2} ${y}`}
        fill={color} fillOpacity="0.3" />
      <circle cx={cx - size / 4} cy={y} r="3" fill={color} fillOpacity="0.4" />
      <circle cx={cx + size / 4} cy={y} r="3" fill={color} fillOpacity="0.2" />
    </g>
  );

export const LotusDeco: React.FC<{ cx: number; y: number; size?: number; color?: string }> =
  ({ cx, y, size = 40, color = '#D4AF37' }) => (
    <g opacity="0.25">
      <path d={`M${cx} ${y - size * 0.6} Q${cx + size * 0.2} ${y - size * 0.2} ${cx} ${y} Q${cx - size * 0.2} ${y - size * 0.2} ${cx} ${y - size * 0.6}`}
        fill="none" stroke={color} strokeWidth="0.8" />
      <path d={`M${cx - size * 0.3} ${y - size * 0.5} Q${cx - size * 0.1} ${y - size * 0.1} ${cx} ${y} Q${cx - size * 0.2} ${y - size * 0.1} ${cx - size * 0.3} ${y - size * 0.5}`}
        fill="none" stroke={color} strokeWidth="0.8" />
      <path d={`M${cx + size * 0.3} ${y - size * 0.5} Q${cx + size * 0.1} ${y - size * 0.1} ${cx} ${y} Q${cx + size * 0.2} ${y - size * 0.1} ${cx + size * 0.3} ${y - size * 0.5}`}
        fill="none" stroke={color} strokeWidth="0.8" />
      <path d={`M${cx} ${y + size * 0.3} Q${cx + size * 0.15} ${y} ${cx} ${y - size * 0.2} Q${cx - size * 0.15} ${y} ${cx} ${y + size * 0.3}`}
        fill="none" stroke={color} strokeWidth="0.8" />
      <line x1={cx} y1={y} x2={cx} y2={y + size * 0.5} stroke={color} strokeWidth="0.6" />
    </g>
  );

export const DragonDeco: React.FC<{ cx: number; y: number; size?: number; color?: string }> =
  ({ cx, y, size = 50, color = '#7A6A5A' }) => (
    <g opacity="0.2">
      <path
        d={`M${cx - size} ${y} Q${cx - size * 0.5} ${y - size * 0.25} ${cx} ${y} Q${cx + size * 0.5} ${y + size * 0.25} ${cx + size} ${y}`}
        fill="none" stroke={color} strokeWidth="1" strokeLinecap="round"
      />
      <path
        d={`M${cx - size * 0.7} ${y - 3} Q${cx - size * 0.3} ${y - size * 0.15} ${cx + size * 0.1} ${y}`}
        fill="none" stroke={color} strokeWidth="0.7"
      />
      <path
        d={`M${cx + size * 0.3} ${y + 3} Q${cx + size * 0.6} ${y + size * 0.15} ${cx + size * 0.9} ${y + 1}`}
        fill="none" stroke={color} strokeWidth="0.7"
      />
    </g>
  );

export const CloudDeco: React.FC<{ cx: number; y: number; size?: number; color?: string }> =
  ({ cx, y, size = 35, color = '#B8860B' }) => (
    <g opacity="0.2">
      <path
        d={`M${cx - size} ${y} Q${cx - size * 0.7} ${y - size * 0.3} ${cx - size * 0.3} ${y} Q${cx} ${y - size * 0.25} ${cx + size * 0.3} ${y} Q${cx + size * 0.7} ${y - size * 0.3} ${cx + size} ${y}`}
        fill="none" stroke={color} strokeWidth="1" strokeLinecap="round"
      />
      <path
        d={`M${cx - size * 0.5} ${y + 4} Q${cx - size * 0.2} ${y - size * 0.15} ${cx + size * 0.1} ${y + 4} Q${cx + size * 0.4} ${y - size * 0.1} ${cx + size * 0.7} ${y + 3}`}
        fill="none" stroke={color} strokeWidth="0.8"
      />
    </g>
  );

export const BrandHeader: React.FC<{
  cx: number; y: number; style: StyleKey; color: string;
}> = ({ cx, y, style, color }) => {
  const label = style === 'taoistYellow' ? 'MYSTIC DAO' : 'M Y S T I C   D A O';
  return (
    <g>
      <text
        x={cx} y={y}
        textAnchor="middle"
        fill={color}
        fontSize={style === 'taoistYellow' ? 7 : 8}
        fontFamily="sans-serif"
        letterSpacing={style === 'taoistYellow' ? 3 : 4}
        opacity="0.35"
        fontWeight={style === 'taoistYellow' ? 'bold' : 'normal'}
      >
        {label}
      </text>
    </g>
  );
};

export const SixLines: React.FC<{
  cx: number; y: number; lines: ('yang' | 'yin')[]; color: string; glowColor?: string;
}> = ({ cx, y, lines, color }) => (
  <g>
    {lines.map((lineType, i) => {
      const ly = y + i * 9;
      const segLen = 40;
      if (lineType === 'yang') {
        return (
          <line
            key={i}
            x1={cx - segLen} y1={ly} x2={cx + segLen} y2={ly}
            stroke={color} strokeWidth="1.8" strokeOpacity="0.7" strokeLinecap="round"
          />
        );
      }
      return (
        <g key={i}>
          <line x1={cx - segLen} y1={ly} x2={cx - 6} y2={ly} stroke={color} strokeWidth="1.8" strokeOpacity="0.7" strokeLinecap="round" />
          <line x1={cx + 6} y1={ly} x2={cx + segLen} y2={ly} stroke={color} strokeWidth="1.8" strokeOpacity="0.7" strokeLinecap="round" />
        </g>
      );
    })}
  </g>
);

export const SealStamp: React.FC<{
  x: number; y: number; text: string; color: string; shape: string; size: number; fontSize: number; uid: string;
}> = ({ x, y, text, color, shape, size, fontSize }) => {
  const lines = text.split('\n');
  const renderShape = () => {
    switch (shape) {
      case 'circle':
        return <circle cx={x} cy={y} r={size / 2} fill="none" stroke={color} strokeWidth="2.5" strokeOpacity="0.85" />;
      case 'oval':
        return <ellipse cx={x} cy={y} rx={size * 0.55} ry={size * 0.4} fill="none" stroke={color} strokeWidth="2.5" strokeOpacity="0.85" />;
      case 'rect':
        return <rect x={x - size * 0.55} y={y - size * 0.35} width={size * 1.1} height={size * 0.7} fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.85" />;
      default:
        return <rect x={x - size / 2} y={y - size / 2} width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" strokeOpacity="0.85" />;
    }
  };

  return (
    <g>
      {renderShape()}
      {shape === 'square' && (
        <rect x={x - size / 2 + 3} y={y - size / 2 + 3} width={size - 6} height={size - 6} fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />
      )}
      {lines.map((line, i) => (
        <text
          key={i}
          x={x}
          y={y + (i - (lines.length - 1) / 2) * (fontSize + 2)}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          fontSize={fontSize}
          fontFamily="sans-serif"
          fontWeight="bold"
          letterSpacing="1"
          opacity="0.9"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export default {};
