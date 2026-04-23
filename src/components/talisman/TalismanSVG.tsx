/**
 * TalismanSVG — 符咒 SVG 生成器（v5.0 Enhanced）
 *
 * 基于真实道教符咒结构：符头 → 符腹（六爻+核心符形） → 符胆 → 符脚（云纹+印章）
 * 支持五行主题色、6级印章系统、暗纹背景
 * 纯SVG，html2canvas兼容
 */

import React from 'react';
import { GUA64_LIST } from '../../data/gua64';
import { getTheme, getSealInfo, FU_HEAD_TYPE, FU_GALL_CHARS, type ThemeColors } from '../../lib/theme';

interface TalismanSVGProps {
  hexagramName: string;
  blessingTheme: string;
  element: string;
  category: string;
  seed: number;
  score?: number;
  width?: number;
  height?: number;
  showSeal?: boolean;
}

/** 八卦 → 三爻结构（从下往上） */
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

/** 伪随机生成器（基于 seed） */
const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

/** 生成云纹装饰路径 */
const generateCloudPath = (rng: () => number, x: number, y: number, scale: number): string => {
  const r = rng();
  if (r < 0.33) {
    return `M ${x} ${y} Q ${x + 10 * scale} ${y - 15 * scale} ${x + 20 * scale} ${y} Q ${x + 30 * scale} ${y + 15 * scale} ${x + 40 * scale} ${y}`;
  } else if (r < 0.66) {
    return `M ${x} ${y} C ${x + 5 * scale} ${y - 10 * scale} ${x + 15 * scale} ${y - 10 * scale} ${x + 20 * scale} ${y} C ${x + 25 * scale} ${y + 10 * scale} ${x + 35 * scale} ${y + 10 * scale} ${x + 40 * scale} ${y}`;
  } else {
    return `M ${x} ${y} Q ${x + 8 * scale} ${y - 12 * scale} ${x + 16 * scale} ${y - 4 * scale} Q ${x + 24 * scale} ${y + 8 * scale} ${x + 32 * scale} ${y}`;
  }
};

/** 根据卦的上下卦生成核心符形路径 */
const generateCoreFuShape = (
  upper: string,
  lower: string,
  rng: () => number,
  cx: number,
  cy: number
): string => {
  const patterns: Record<string, string[]> = {
    '乾': ['M', 'L'],
    '坤': ['Q', 'T'],
    '坎': ['S', 'Q'],
    '离': ['L', 'L'],
    '震': ['L', 'L'],
    '巽': ['Q', 'Q'],
    '艮': ['L', 'L'],
    '兑': ['Q', 'T'],
  };

  const upPattern = patterns[upper] || patterns['乾'];
  const lowPattern = patterns[lower] || patterns['乾'];
  const size = 55;
  const points: string[] = [];

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + rng() * 0.3;
    const r = size * (0.5 + rng() * 0.5);
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }

  let path = `M ${points[0]}`;
  for (let i = 1; i < points.length; i++) {
    const cmd = (i % 2 === 0) ? upPattern[0] : lowPattern[0];
    if (cmd === 'Q') {
      const cpx = cx + (rng() - 0.5) * 40;
      const cpy = cy + (rng() - 0.5) * 40;
      path += ` Q ${cpx.toFixed(1)},${cpy.toFixed(1)} ${points[i]}`;
    } else if (cmd === 'S') {
      path += ` S ${points[i]}`;
    } else {
      path += ` L ${points[i]}`;
    }
  }
  path += ' Z';
  return path;
};

/** 符头 — 三清（三勾） */
const SanqingHead: React.FC<{ cx: number; y: number; color: string; seed: number }> = ({ cx, y, color, seed }) => {
  const rng = seededRandom(seed + 100);
  const h = 28;
  const hooks = [-1, 0, 1];
  return (
    <g>
      {hooks.map((offset, i) => {
        const hx = cx + offset * 18;
        const noise = (rng() - 0.5) * 4;
        return (
          <g key={i}>
            <path
              d={`M ${hx - 6} ${y - h + noise} Q ${hx} ${y - h - 10 + noise} ${hx + 6} ${y - h + noise} Q ${hx + 3} ${y - h / 2 + noise} ${hx} ${y + noise}`}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />
            <circle cx={hx} cy={y + noise} r="2.5" fill={color} opacity="0.8" />
          </g>
        );
      })}
      <line x1={cx - 30} y1={y - h - 6} x2={cx + 30} y2={y - h - 6} stroke={color} strokeWidth="1" opacity="0.4" />
    </g>
  );
};

/** 符头 — 三台星君 */
const SantaiHead: React.FC<{ cx: number; y: number; color: string; seed: number }> = ({ cx, y, color }) => {
  const stars = [
    { x: cx - 20, label: '上台' },
    { x: cx, label: '中台' },
    { x: cx + 20, label: '下台' },
  ];
  return (
    <g>
      {stars.map((s, i) => (
        <g key={i}>
          <path
            d={`M ${s.x} ${y - 12} L ${s.x + 3} ${y - 3} L ${s.x + 12} ${y - 3} L ${s.x + 5} ${y + 2} L ${s.x + 8} ${y + 11} L ${s.x} ${y + 6} L ${s.x - 8} ${y + 11} L ${s.x - 5} ${y + 2} L ${s.x - 12} ${y - 3} L ${s.x - 3} ${y - 3} Z`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.7"
            transform={`scale(0.6) translate(${s.x * 0.67}, ${y * 0.67})`}
          />
          <text x={s.x} y={y + 18} textAnchor="middle" fill={color} fontSize="7" fontFamily="serif" opacity="0.6" letterSpacing="1">
            {s.label}
          </text>
        </g>
      ))}
    </g>
  );
};

/** 符头 — 敕令 */
const ChilingHead: React.FC<{ cx: number; y: number; color: string }> = ({ cx, y, color }) => {
  return (
    <g>
      <text x={cx} y={y + 4} textAnchor="middle" fill={color} fontSize="22" fontFamily="serif" fontWeight="bold" opacity="0.85" letterSpacing="8">
        敕令
      </text>
      <line x1={cx - 28} y1={y + 14} x2={cx + 28} y2={y + 14} stroke={color} strokeWidth="0.8" opacity="0.4" />
    </g>
  );
};

/** 印章组件 */
const SealStamp: React.FC<{ cx: number; y: number; score: number; seed: number }> = ({ cx, y, score, seed }) => {
  const info = getSealInfo(score);
  const rng = seededRandom(seed + 200);
  const rotation = (rng() - 0.5) * 8;

  return (
    <g transform={`rotate(${rotation}, ${cx}, ${y})`}>
      {info.shape === 'circle' && (
        <>
          <circle cx={cx} cy={y} r={info.size / 2} fill="none" stroke={info.color} strokeWidth="3" opacity="0.9" />
          <circle cx={cx} cy={y} r={info.size / 2 - 4} fill="none" stroke={info.color} strokeWidth="1" opacity="0.5" />
        </>
      )}
      {info.shape === 'square' && (
        <>
          <rect x={cx - info.size / 2} y={y - info.size / 2} width={info.size} height={info.size} fill="none" stroke={info.color} strokeWidth="3" opacity="0.9" />
          <rect x={cx - info.size / 2 + 4} y={y - info.size / 2 + 4} width={info.size - 8} height={info.size - 8} fill="none" stroke={info.color} strokeWidth="1" opacity="0.5" />
        </>
      )}
      {info.shape === 'oval' && (
        <>
          <ellipse cx={cx} cy={y} rx={info.size / 2} ry={info.size / 2.6} fill="none" stroke={info.color} strokeWidth="3" opacity="0.9" />
          <ellipse cx={cx} cy={y} rx={info.size / 2 - 4} ry={info.size / 2.6 - 3} fill="none" stroke={info.color} strokeWidth="1" opacity="0.5" />
        </>
      )}
      <text x={cx} y={y + 2} textAnchor="middle" dominantBaseline="middle" fill={info.color} fontSize={info.shape === 'circle' ? 14 : 13} fontFamily="serif" fontWeight="bold" opacity="0.95" letterSpacing={info.text.length > 2 ? 1 : 3}>
        {info.text}
      </text>
    </g>
  );
};

/** 暗纹背景 Pattern */
const BackgroundPattern: React.FC<{ seed: number; theme: ThemeColors }> = ({ seed, theme }) => {
  const rng = seededRandom(seed + 300);
  const clouds = Array.from({ length: 12 }, () => ({
    x: 20 + rng() * 360,
    y: 20 + rng() * 560,
    scale: 0.5 + rng() * 1.5,
    opacity: 0.03 + rng() * 0.05,
  }));

  return (
    <g>
      {clouds.map((c, i) => (
        <path
          key={i}
          d={generateCloudPath(rng, c.x, c.y, c.scale)}
          fill="none"
          stroke={theme.primary}
          strokeWidth="0.8"
          opacity={c.opacity}
        />
      ))}
      {/* 细密的点阵 */}
      {Array.from({ length: 30 }, (_, i) => (
        <circle
          key={`dot-${i}`}
          cx={30 + rng() * 340}
          cy={30 + rng() * 540}
          r={0.5 + rng() * 1}
          fill={theme.primary}
          opacity={0.04 + rng() * 0.06}
        />
      ))}
    </g>
  );
};

/** 主组件 */
const TalismanSVG: React.FC<TalismanSVGProps> = ({
  hexagramName,
  blessingTheme,
  element,
  category,
  seed,
  score = 75,
  width = 400,
  height = 600,
  showSeal = true,
}) => {
  const rng = seededRandom(seed);
  const theme = getTheme(element);
  const gua = GUA64_LIST.find((g) => g.name === hexagramName);
  const upper = gua?.upper || '乾';
  const lower = gua?.lower || '乾';
  const symbol = gua?.symbol || '䷀';

  const lowerLines = TRIGRAM_LINES[lower] || TRIGRAM_LINES['乾'];
  const upperLines = TRIGRAM_LINES[upper] || TRIGRAM_LINES['乾'];
  const sixLines = [...lowerLines, ...upperLines];

  const W = width;
  const H = height;
  const cx = W / 2;
  const margin = 28;

  const fuHeadType = FU_HEAD_TYPE[category] || 'chiling';
  const fuGallChar = FU_GALL_CHARS[element] || '罡';

  // 六爻绘制参数
  const lineWidth = 110;
  const lineHeight = 5;
  const gap = 18;
  const startY = H - margin - 140 - sixLines.length * (lineHeight + gap);

  // 核心符形中心
  const shapeCx = cx;
  const shapeCy = startY - 50;

  // 随机朱砂点
  const dots = Array.from({ length: 8 }, () => ({
    x: margin + 20 + rng() * (W - margin * 2 - 40),
    y: margin + 80 + rng() * (H - margin * 2 - 200),
    r: 1 + rng() * 2,
    opacity: 0.15 + rng() * 0.25,
  }));

  // 角装饰
  const corners = [
    { x: margin + 8, y: margin + 8, rotate: 0 },
    { x: W - margin - 8, y: margin + 8, rotate: 90 },
    { x: margin + 8, y: H - margin - 8, rotate: 270 },
    { x: W - margin - 8, y: H - margin - 8, rotate: 180 },
  ];

  const uniqueId = `talisman-${seed}-${width}-${height}`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        {/* 主题渐变 */}
        <linearGradient id={`grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={theme.primary} stopOpacity="0.9" />
          <stop offset="50%" stopColor={theme.secondary} stopOpacity="0.6" />
          <stop offset="100%" stopColor={theme.primary} stopOpacity="0.9" />
        </linearGradient>
        {/* 金色光晕 */}
        <filter id={`glow-${uniqueId}`}>
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* 毛笔质感 */}
        <filter id={`brush-${uniqueId}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* 背景：墨玉黑 */}
      <rect x="0" y="0" width={W} height={H} fill="#000000" />
      <rect x="0" y="0" width={W} height={H} fill={theme.background} />

      {/* 暗纹背景 */}
      <BackgroundPattern seed={seed} theme={theme} />

      {/* 外层边框：主题色 */}
      <rect
        x={margin}
        y={margin}
        width={W - margin * 2}
        height={H - margin * 2}
        fill="none"
        stroke={theme.primary}
        strokeWidth="2.5"
        strokeOpacity="0.7"
        rx="4"
      />
      {/* 内层边框：金色点缀 */}
      <rect
        x={margin + 5}
        y={margin + 5}
        width={W - margin * 2 - 10}
        height={H - margin * 2 - 10}
        fill="none"
        stroke={theme.gold}
        strokeWidth="1"
        strokeOpacity="0.35"
        rx="2"
      />

      {/* 四角云纹装饰 */}
      {corners.map((corner, i) => (
        <g key={i} transform={`rotate(${corner.rotate}, ${corner.x}, ${corner.y})`}>
          <path
            d={generateCloudPath(rng, corner.x, corner.y, 0.55)}
            fill="none"
            stroke={theme.gold}
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
        </g>
      ))}

      {/* 随机朱砂点 */}
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill={theme.seal} opacity={dot.opacity} />
      ))}

      {/* ====== 符头区（顶部） ====== */}
      <g transform={`translate(0, ${margin + 35})`}>
        {fuHeadType === 'sanqing' && <SanqingHead cx={cx} y={0} color={theme.primary} seed={seed} />}
        {fuHeadType === 'santai' && <SantaiHead cx={cx} y={0} color={theme.primary} seed={seed} />}
        {fuHeadType === 'chiling' && <ChilingHead cx={cx} y={0} color={theme.primary} />}
      </g>

      {/* ====== 卦符号 + 卦名（符头下方） ====== */}
      <text
        x={cx}
        y={margin + 90}
        textAnchor="middle"
        fill={theme.gold}
        fontSize="32"
        fontFamily="serif"
        opacity="0.9"
        filter={`url(#glow-${uniqueId})`}
      >
        {symbol}
      </text>
      <text
        x={cx}
        y={margin + 118}
        textAnchor="middle"
        fill={theme.primary}
        fontSize="15"
        fontFamily="serif"
        fontWeight="bold"
        letterSpacing="5"
        opacity="0.85"
      >
        {hexagramName}
      </text>
      <text
        x={cx}
        y={margin + 140}
        textAnchor="middle"
        fill={theme.secondary}
        fontSize="10"
        fontFamily="serif"
        letterSpacing="4"
        opacity="0.55"
      >
        {blessingTheme}
      </text>

      {/* 分隔线 */}
      <line x1={cx - 50} y1={margin + 152} x2={cx + 50} y2={margin + 152} stroke={theme.primary} strokeWidth="1" strokeOpacity="0.25" />

      {/* ====== 符腹区（中部：核心符形 + 六爻） ====== */}
      {/* 核心符形 */}
      <path
        d={generateCoreFuShape(upper, lower, rng, shapeCx, shapeCy)}
        fill="none"
        stroke={`url(#grad-${uniqueId})`}
        strokeWidth="1.5"
        strokeOpacity="0.5"
        filter={`url(#glow-${uniqueId})`}
      />

      {/* 六爻（从下往上绘制） */}
      {sixLines.map((lineType, i) => {
        const y = startY + i * (lineHeight + gap);
        const isYang = lineType === 'yang';

        if (isYang) {
          return (
            <g key={i}>
              <rect
                x={cx - lineWidth / 2}
                y={y}
                width={lineWidth}
                height={lineHeight}
                fill={theme.primary}
                opacity="0.85"
                rx="2"
                filter={`url(#glow-${uniqueId})`}
              />
              <circle cx={cx - lineWidth / 2 + 3} cy={y + lineHeight / 2} r="2" fill={theme.gold} opacity="0.5" />
              <circle cx={cx + lineWidth / 2 - 3} cy={y + lineHeight / 2} r="2" fill={theme.gold} opacity="0.5" />
            </g>
          );
        } else {
          const segWidth = (lineWidth - 18) / 2;
          return (
            <g key={i}>
              <rect x={cx - lineWidth / 2} y={y} width={segWidth} height={lineHeight} fill={theme.primary} opacity="0.7" rx="2" />
              <rect x={cx + lineWidth / 2 - segWidth} y={y} width={segWidth} height={lineHeight} fill={theme.primary} opacity="0.7" rx="2" />
            </g>
          );
        }
      })}

      {/* ====== 符胆区（六爻下方） ====== */}
      <g transform={`translate(${cx}, ${startY + sixLines.length * (lineHeight + gap) + 20})`}>
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fill={theme.seal}
          fontSize="28"
          fontFamily="serif"
          fontWeight="bold"
          opacity="0.9"
          filter={`url(#brush-${uniqueId})`}
        >
          {fuGallChar}
        </text>
        <text
          x="0"
          y="18"
          textAnchor="middle"
          fill={theme.primary}
          fontSize="8"
          fontFamily="serif"
          opacity="0.4"
          letterSpacing="3"
        >
          符胆
        </text>
      </g>

      {/* ====== 符脚区（底部） ====== */}
      <g transform={`translate(0, ${H - margin - 95})`}>
        {/* 云纹装饰 */}
        <path d={generateCloudPath(rng, cx - 70, 10, 1.3)} fill="none" stroke={theme.primary} strokeWidth="1" strokeOpacity="0.2" />
        <path d={generateCloudPath(rng, cx + 30, 5, 1)} fill="none" stroke={theme.primary} strokeWidth="1" strokeOpacity="0.15" />

        {/* 五行标记 */}
        <g transform={`translate(${cx - 55}, 35)`}>
          <circle cx="0" cy="0" r="13" fill="none" stroke={theme.gold} strokeWidth="1.5" opacity="0.5" />
          <text x="0" y="4" textAnchor="middle" fill={theme.gold} fontSize="11" fontFamily="serif" fontWeight="bold" opacity="0.8">
            {element}
          </text>
        </g>

        {/* 祈福主题（中英双语） */}
        <text x={cx + 10} y="30" textAnchor="middle" fill={theme.primary} fontSize="12" fontFamily="serif" letterSpacing="4" opacity="0.75">
          {blessingTheme}
        </text>
        <text x={cx + 10} y="48" textAnchor="middle" fill={theme.secondary} fontSize="7" fontFamily="sans-serif" letterSpacing="1" opacity="0.35">
          {category}
        </text>

        {/* 印章 */}
        {showSeal && (
          <g transform={`translate(0, 55)`}>
            <SealStamp cx={cx} y={0} score={score} seed={seed} />
          </g>
        )}
      </g>
    </svg>
  );
};

export default TalismanSVG;
