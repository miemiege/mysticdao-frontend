/**
 * TalismanPoster — 海外审美符咒海报（v6.0 Modern Oriental Poster）
 *
 * 设计原则（基于海外用户审美重新论证）：
 * 1. 英文为主，中文为辅（装饰性）— 海外用户3秒读懂
 * 2. 极简东方神秘主义美学 — 高对比黑底+金色+单印章
 * 3. 8种模板差异化（按八卦上卦）— 边框/装饰/色调微变
 * 4. 纯SVG代码生成 — 零Bundle增长，html2canvas兼容
 * 5. Instagram Stories 9:16 完美适配
 */

import React from 'react';
import { GUA64_LIST } from '../../data/gua64';
import { getTheme } from '../../lib/theme';

interface TalismanPosterProps {
  hexagramName: string;
  score?: number;
  width?: number;
  height?: number;
  showSeal?: boolean;
}

/** 八卦 → 三爻结构 */
const TRIGRAM_LINES: Record<string, ('yang' | 'yin')[]> = {
  '乾': ['yang', 'yang', 'yang'],
  '坤': ['yin', 'yin', 'yin'],
  '震': ['yang', 'yin', 'yin'],
  '巽': ['yin', 'yang', 'yang'],
  '坎': ['yin', 'yang', 'yin'],
  '离': ['yang', 'yin', 'yang'],
  '艮': ['yin', 'yin', 'yang'],
  '兑': ['yang', 'yang', 'yin'],
};

/** 八卦模板风格配置 */
interface TrigramStyle {
  /** 边框圆角 */
  borderRadius: number;
  /** 边框样式: solid | dashed | dotted */
  borderDash?: string;
  /** 装饰元素类型 */
  decoType: 'dragon' | 'mountain' | 'thunder' | 'wind' | 'water' | 'fire' | 'stone' | 'lake';
  /** 外边框额外装饰角 */
  cornerAccent: boolean;
}

const TRIGRAM_STYLES: Record<string, TrigramStyle> = {
  '乾': { borderRadius: 2, decoType: 'dragon', cornerAccent: true },
  '坤': { borderRadius: 16, decoType: 'mountain', cornerAccent: false },
  '震': { borderRadius: 4, borderDash: '8,4', decoType: 'thunder', cornerAccent: true },
  '巽': { borderRadius: 24, decoType: 'wind', cornerAccent: false },
  '坎': { borderRadius: 32, decoType: 'water', cornerAccent: false },
  '离': { borderRadius: 2, decoType: 'fire', cornerAccent: true },
  '艮': { borderRadius: 8, decoType: 'stone', cornerAccent: true },
  '兑': { borderRadius: 20, decoType: 'lake', cornerAccent: false },
};

/** 印章信息（英文版） */
interface SealInfo {
  text: string;
  color: string;
  shape: 'circle' | 'square' | 'oval';
  size: number;
}

const getSealInfoEn = (score: number): SealInfo => {
  if (score >= 90) return { text: 'GREAT\nFORTUNE', color: '#9B2C2C', shape: 'circle', size: 56 };
  if (score >= 80) return { text: 'FORTUNE', color: '#C53030', shape: 'circle', size: 50 };
  if (score >= 70) return { text: 'GOOD', color: '#C53030', shape: 'square', size: 46 };
  if (score >= 60) return { text: 'FAIR', color: '#A0522D', shape: 'square', size: 42 };
  if (score >= 50) return { text: 'NEUTRAL', color: '#8B6914', shape: 'oval', size: 48 };
  return { text: 'CAUTION', color: '#6B4423', shape: 'oval', size: 50 };
};

/** 装饰元素生成器 */
const DecoElement: React.FC<{ type: TrigramStyle['decoType']; cx: number; y: number; color: string; opacity?: number }> =
  ({ type, cx, y, color, opacity = 0.25 }) => {
    const paths: Record<TrigramStyle['decoType'], string> = {
      // 龙纹 — 蜿蜒曲线
      dragon: `M ${cx - 60} ${y} Q ${cx - 30} ${y - 12} ${cx} ${y} Q ${cx + 30} ${y + 12} ${cx + 60} ${y}`,
      // 山形 — 三角波浪
      mountain: `M ${cx - 50} ${y + 8} L ${cx - 25} ${y - 8} L ${cx} ${y + 4} L ${cx + 25} ${y - 8} L ${cx + 50} ${y + 8}`,
      // 雷电 — 锯齿
      thunder: `M ${cx - 45} ${y - 6} L ${cx - 20} ${y + 4} L ${cx} ${y - 8} L ${cx + 20} ${y + 4} L ${cx + 45} ${y - 6}`,
      // 风 — 飘逸曲线
      wind: `M ${cx - 55} ${y - 4} Q ${cx - 20} ${y + 10} ${cx + 10} ${y - 2} Q ${cx + 35} ${y - 12} ${cx + 55} ${y + 4}`,
      // 水波 — 正弦
      water: `M ${cx - 60} ${y} Q ${cx - 30} ${y - 10} ${cx} ${y} Q ${cx + 30} ${y + 10} ${cx + 60} ${y}`,
      // 火焰 — 尖锐
      fire: `M ${cx - 40} ${y + 6} L ${cx - 15} ${y - 10} L ${cx} ${y + 4} L ${cx + 15} ${y - 10} L ${cx + 40} ${y + 6}`,
      // 山石 — 块状
      stone: `M ${cx - 35} ${y + 6} L ${cx - 20} ${y - 4} L ${cx} ${y + 2} L ${cx + 20} ${y - 4} L ${cx + 35} ${y + 6}`,
      // 湖泊 — 圆润椭圆
      lake: `M ${cx - 50} ${y} Q ${cx - 25} ${y - 8} ${cx} ${y} Q ${cx + 25} ${y + 8} ${cx + 50} ${y}`,
    };
    return (
      <path d={paths[type]} fill="none" stroke={color} strokeWidth="1.2" strokeOpacity={opacity} strokeLinecap="round" />
    );
  };

/** 角装饰 — 回纹简化 */
const CornerAccent: React.FC<{ x: number; y: number; rotate: number; color: string }> =
  ({ x, y, rotate, color }) => (
    <g transform={`rotate(${rotate}, ${x}, ${y})`}>
      <path
        d={`M ${x} ${y} L ${x + 14} ${y} L ${x + 14} ${y + 4} L ${x + 4} ${y + 4} L ${x + 4} ${y + 14} L ${x} ${y + 14} Z`}
        fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.35"
      />
    </g>
  );

/** 主组件 */
const TalismanPoster: React.FC<TalismanPosterProps> = ({
  hexagramName,
  score = 75,
  width = 400,
  height = 640,
  showSeal = true,
}) => {
  const gua = GUA64_LIST.find((g) => g.name === hexagramName);
  const upper = gua?.upper || '乾';
  const symbol = gua?.symbol || '䷀';
  const element = gua?.element || '金';
  const theme = getTheme(element);
  const trigramStyle = TRIGRAM_STYLES[upper] || TRIGRAM_STYLES['乾'];

  // 祝福语选择：优先 imageEn，其次 judgmentEn
  const blessingText = gua?.imageEn || gua?.judgmentEn || 'The Tao that can be told is not the eternal Tao.';
  // 限制长度，保持简洁
  const shortBlessing = blessingText.length > 120 ? blessingText.slice(0, 120) + '...' : blessingText;

  // 关键词（最多3个）
  const keywords = (gua?.keywordsEn || []).slice(0, 3);

  // 印章
  const seal = getSealInfoEn(score);

  // 布局常量
  const W = width;
  const H = height;
  const cx = W / 2;
  const margin = 32;
  const innerMargin = margin + 10;

  // 六爻数据
  const upperLines = TRIGRAM_LINES[upper] || TRIGRAM_LINES['乾'];
  const lowerLines = gua?.lower ? TRIGRAM_LINES[gua.lower] || TRIGRAM_LINES['乾'] : TRIGRAM_LINES['乾'];
  const sixLines = [...lowerLines, ...upperLines];

  const uid = `poster-${hexagramName}-${width}-${height}`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        {/* 金色光晕 */}
        <filter id={`glow-${uid}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* 细颗粒噪点（纸张质感） */}
        <filter id={`noise-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" in="noise" result="coloredNoise" />
          <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
          <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
        </filter>
      </defs>

      {/* ===== 背景 ===== */}
      <rect x="0" y="0" width={W} height={H} fill="#000000" />
      <rect x="0" y="0" width={W} height={H} fill={theme.background} opacity="0.5" />
      {/* 噪点叠加 */}
      <rect x="0" y="0" width={W} height={H} fill="#000000" filter={`url(#noise-${uid})`} opacity="0.6" />

      {/* ===== 外层边框 ===== */}
      <rect
        x={margin} y={margin}
        width={W - margin * 2} height={H - margin * 2}
        fill="none"
        stroke={theme.primary}
        strokeWidth="1.5"
        strokeOpacity="0.6"
        rx={trigramStyle.borderRadius}
        strokeDasharray={trigramStyle.borderDash}
      />
      {/* 内层细边框 */}
      <rect
        x={innerMargin} y={innerMargin}
        width={W - innerMargin * 2} height={H - innerMargin * 2}
        fill="none"
        stroke={theme.gold}
        strokeWidth="0.6"
        strokeOpacity="0.25"
        rx={Math.max(trigramStyle.borderRadius - 4, 0)}
      />

      {/* ===== 四角装饰 ===== */}
      {trigramStyle.cornerAccent && (
        <>
          <CornerAccent x={margin + 4} y={margin + 4} rotate={0} color={theme.gold} />
          <CornerAccent x={W - margin - 4} y={margin + 4} rotate={90} color={theme.gold} />
          <CornerAccent x={margin + 4} y={H - margin - 4} rotate={270} color={theme.gold} />
          <CornerAccent x={W - margin - 4} y={H - margin - 4} rotate={180} color={theme.gold} />
        </>
      )}

      {/* ===== 顶部区域 ===== */}
      {/* 品牌标识 */}
      <text
        x={cx} y={margin + 28}
        textAnchor="middle"
        fill={theme.gold}
        fontSize="8"
        fontFamily="sans-serif"
        letterSpacing="4"
        opacity="0.35"
      >
        MYSTIC DAO
      </text>

      {/* 顶部装饰线 */}
      <line x1={cx - 30} y1={margin + 38} x2={cx + 30} y2={margin + 38} stroke={theme.primary} strokeWidth="0.8" strokeOpacity="0.3" />
      <DecoElement type={trigramStyle.decoType} cx={cx} y={margin + 44} color={theme.primary} opacity={0.2} />

      {/* ===== 英文卦名（主标题） ===== */}
      <text
        x={cx} y={margin + 90}
        textAnchor="middle"
        fill={theme.gold}
        fontSize={gua?.nameEn && gua.nameEn.length > 18 ? 22 : 26}
        fontFamily="Georgia, 'Playfair Display', serif"
        fontWeight="bold"
        letterSpacing="2"
        filter={`url(#glow-${uid})`}
        opacity="0.95"
      >
        {gua?.nameEn?.toUpperCase() || 'THE UNKNOWN'}
      </text>

      {/* 中文卦名 + 符号（装饰副标题） */}
      <text
        x={cx} y={margin + 118}
        textAnchor="middle"
        fill={theme.primary}
        fontSize="13"
        fontFamily="serif"
        letterSpacing="3"
        opacity="0.65"
      >
        {hexagramName} {symbol}
      </text>

      {/* 分隔线 */}
      <line x1={cx - 40} y1={margin + 132} x2={cx + 40} y2={margin + 132} stroke={theme.primary} strokeWidth="0.6" strokeOpacity="0.2" />

      {/* ===== 卦象符号区（大号居中） ===== */}
      <text
        x={cx} y={margin + 195}
        textAnchor="middle"
        fill={theme.primary}
        fontSize="48"
        fontFamily="serif"
        opacity="0.85"
        filter={`url(#glow-${uid})`}
      >
        {symbol}
      </text>

      {/* ===== 六爻可视化（简洁横线） ===== */}
      <g transform={`translate(${cx}, ${margin + 230})`}>
        {sixLines.map((lineType, i) => {
          const y = i * 10;
          const isYang = lineType === 'yang';
          const segLen = 45;
          if (isYang) {
            return (
              <line
                key={i}
                x1={-segLen} y1={y} x2={segLen} y2={y}
                stroke={theme.primary}
                strokeWidth="2.5"
                strokeOpacity="0.75"
                strokeLinecap="round"
              />
            );
          }
          // 阴爻 — 两段
          const gap = 10;
          return (
            <g key={i}>
              <line x1={-segLen} y1={y} x2={-gap} y2={y} stroke={theme.primary} strokeWidth="2.5" strokeOpacity="0.6" strokeLinecap="round" />
              <line x1={gap} y1={y} x2={segLen} y2={y} stroke={theme.primary} strokeWidth="2.5" strokeOpacity="0.6" strokeLinecap="round" />
            </g>
          );
        })}
      </g>

      {/* ===== 英文祝福语 ===== */}
      <g transform={`translate(${cx}, ${margin + 330})`}>
        {/* 引号装饰 */}
        <text x="0" y="-8" textAnchor="middle" fill={theme.gold} fontSize="20" fontFamily="Georgia, serif" opacity="0.2">"</text>
        {/* 祝福语文本 — 自动换行 */}
        {(() => {
          const words = shortBlessing.split(' ');
          const lines: string[] = [];
          let currentLine = '';
          const maxWidth = 28; // 近似字符数
          words.forEach((word) => {
            if ((currentLine + word).length > maxWidth && currentLine) {
              lines.push(currentLine.trim());
              currentLine = word + ' ';
            } else {
              currentLine += word + ' ';
            }
          });
          if (currentLine) lines.push(currentLine.trim());
          return lines.map((line, i) => (
            <text
              key={i}
              x="0" y={i * 16}
              textAnchor="middle"
              fill={theme.secondary}
              fontSize="11"
              fontFamily="Georgia, 'Playfair Display', serif"
              fontStyle="italic"
              opacity="0.7"
              letterSpacing="0.5"
            >
              {line}
            </text>
          ));
        })()}
      </g>

      {/* ===== 印章 ===== */}
      {showSeal && (
        <g transform={`translate(${cx}, ${H - margin - 110})`}>
          {seal.shape === 'circle' && (
            <>
              <circle cx="0" cy="0" r={seal.size / 2} fill="none" stroke={seal.color} strokeWidth="2.5" opacity="0.9" />
              <circle cx="0" cy="0" r={seal.size / 2 - 4} fill="none" stroke={seal.color} strokeWidth="0.8" opacity="0.4" />
            </>
          )}
          {seal.shape === 'square' && (
            <>
              <rect x={-seal.size / 2} y={-seal.size / 2} width={seal.size} height={seal.size} fill="none" stroke={seal.color} strokeWidth="2.5" opacity="0.9" />
              <rect x={-seal.size / 2 + 4} y={-seal.size / 2 + 4} width={seal.size - 8} height={seal.size - 8} fill="none" stroke={seal.color} strokeWidth="0.8" opacity="0.4" />
            </>
          )}
          {seal.shape === 'oval' && (
            <>
              <ellipse cx="0" cy="0" rx={seal.size / 2} ry={seal.size / 2.8} fill="none" stroke={seal.color} strokeWidth="2.5" opacity="0.9" />
              <ellipse cx="0" cy="0" rx={seal.size / 2 - 4} ry={seal.size / 2.8 - 3} fill="none" stroke={seal.color} strokeWidth="0.8" opacity="0.4" />
            </>
          )}
          {/* 印章文字 */}
          {seal.text.includes('\n') ? (
            seal.text.split('\n').map((line, i, arr) => (
              <text
                key={i}
                x="0" y={(i - (arr.length - 1) / 2) * 14 + 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={seal.color}
                fontSize={seal.text.length > 10 ? 9 : 11}
                fontFamily="Georgia, serif"
                fontWeight="bold"
                letterSpacing="1"
                opacity="0.95"
              >
                {line}
              </text>
            ))
          ) : (
            <text
              x="0" y="4"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={seal.color}
              fontSize={seal.text.length > 8 ? 9 : 11}
              fontFamily="Georgia, serif"
              fontWeight="bold"
              letterSpacing="1"
              opacity="0.95"
            >
              {seal.text}
            </text>
          )}
        </g>
      )}

      {/* ===== 关键词 ===== */}
      {keywords.length > 0 && (
        <text
          x={cx}
          y={H - margin - 52}
          textAnchor="middle"
          fill={theme.gold}
          fontSize="9"
          fontFamily="sans-serif"
          letterSpacing="3"
          opacity="0.4"
        >
          {keywords.join(' · ').toUpperCase()}
        </text>
      )}

      {/* ===== 底部区域 ===== */}
      <DecoElement type={trigramStyle.decoType} cx={cx} y={H - margin - 32} color={theme.primary} opacity={0.15} />
      <line x1={cx - 30} y1={H - margin - 26} x2={cx + 30} y2={H - margin - 26} stroke={theme.primary} strokeWidth="0.6" strokeOpacity="0.2" />

      {/* 日期 */}
      <text
        x={cx}
        y={H - margin - 12}
        textAnchor="middle"
        fill={theme.gold}
        fontSize="7"
        fontFamily="sans-serif"
        letterSpacing="2"
        opacity="0.25"
      >
        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
      </text>
    </svg>
  );
};

export default TalismanPoster;
