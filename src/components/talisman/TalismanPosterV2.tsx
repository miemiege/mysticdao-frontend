/**
 * TalismanPosterV2 — 多风格符咒海报系统 (v6.0)
 *
 * 6种风格：ink / darkMystic / imperialGold / vintagePrint / taoistYellow / obsidianLux
 * 设计原则：英文为主，中文为辅；纯SVG生成；html2canvas兼容；9:16比例
 */

import React from 'react';
import { GUA64_LIST, type Gua64 } from '@/data/gua64';
import { getPosterStyle, getSealInfo, type StyleKey } from '@/lib/posterStyles';
import PosterFilters from './PosterFilters';
import {
  CornerMeander, CornerGeometric, CornerMystic,
  OrnateBorder, GeometricBorder, DoubleBorder,
  FancyDivider, InkTaijiDeco, LotusDeco, DragonDeco,
  CloudDeco, BrandHeader, SixLines, SealStamp,
} from './PosterDecorations';

export interface TalismanPosterV2Props {
  hexagramName: string;
  score?: number;
  style?: StyleKey;
  width?: number;
  height?: number;
  showSeal?: boolean;
}

const DEFAULT_PROPS = {
  score: 75,
  style: 'obsidianLux' as StyleKey,
  width: 400,
  height: 640,
  showSeal: true,
};

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

const getGuaByName = (name: string): Gua64 | undefined => {
  return GUA64_LIST.find(g => g.name === name);
};

const getSixLines = (upper: string, lower: string): ('yang' | 'yin')[] => {
  const upperLines = TRIGRAM_LINES[upper] || TRIGRAM_LINES['乾'];
  const lowerLines = TRIGRAM_LINES[lower] || TRIGRAM_LINES['乾'];
  return [...lowerLines, ...upperLines];
};

const TalismanPosterV2: React.FC<TalismanPosterV2Props> = (props) => {
  const {
    hexagramName, score = DEFAULT_PROPS.score,
    style: styleKey = DEFAULT_PROPS.style,
    width: W = DEFAULT_PROPS.width,
    height: H = DEFAULT_PROPS.height,
    showSeal = DEFAULT_PROPS.showSeal,
  } = props;

  const gua = getGuaByName(hexagramName);
  const style = getPosterStyle(styleKey);
  const seal = getSealInfo(score, styleKey);
  const uid = `v2-${styleKey}-${hexagramName}-${W}-${H}`;

  // 共享布局常量
  const cx = W / 2;
  const margin = 30;
  const lines = gua ? getSixLines(gua.upper, gua.lower) : [];
  const blessing = gua
    ? (gua.imageEn.length > 140 ? gua.imageEn.slice(0, 140) + '...' : gua.imageEn)
    : '';
  const keywords = gua ? gua.keywordsEn.slice(0, 3) : [];

  if (!gua) {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <rect width={W} height={H} fill={style.bgPrimary} />
        <text x={W / 2} y={H / 2} textAnchor="middle" fill={style.textPrimary} fontSize="16">
          Hexagram not found
        </text>
      </svg>
    );
  }

  switch (styleKey) {
    case 'ink': return renderInk();
    case 'darkMystic': return renderDarkMystic();
    case 'imperialGold': return renderImperialGold();
    case 'vintagePrint': return renderVintagePrint();
    case 'taoistYellow': return renderTaoistYellow();
    case 'obsidianLux': return renderObsidianLux();
    default: return renderObsidianLux();
  }

  // ======== 1. 水墨极简 ========
  function renderInk() {
    const m = margin;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <PosterFilters uid={uid} style="ink" />
        <rect width={W} height={H} fill={style.bgPrimary} />
        <rect width={W} height={H} fill={style.bgSecondary} opacity="0.3" />
        <rect width={W} height={H} fill="#000" filter={`url(#noise-${uid})`} opacity="0.6" />
        <InkTaijiDeco cx={cx} y={H * 0.45} size={180} color={style.decoColor} />
        <BrandHeader cx={cx} y={m + 18} style="ink" color={style.textSecondary} />
        <FancyDivider x={cx - 60} y={m + 30} width={120} color={style.borderColor} style="ink" />
        <text x={cx} y={m + 70} textAnchor="middle" fill={style.textPrimary}
          fontSize={gua.nameEn.length > 18 ? 22 : 26} fontFamily={style.fontTitle} fontWeight="bold"
          letterSpacing="2" filter={`url(#glow-${uid})`} opacity="0.9">
          {gua.nameEn.toUpperCase()}
        </text>
        <text x={cx} y={m + 96} textAnchor="middle" fill={style.textSecondary}
          fontSize="12" fontFamily={style.fontCJK} letterSpacing="4" opacity="0.6">
          {gua.name} · {gua.symbol}
        </text>
        <FancyDivider x={cx - 50} y={m + 110} width={100} color={style.borderColor} style="ink" />
        <text x={cx} y={H * 0.42} textAnchor="middle" fill={style.textPrimary}
          fontSize="56" fontFamily="serif" opacity="0.15" filter={`url(#ink-bleed-${uid})`}>
          {gua.symbol}
        </text>
        <SixLines cx={cx} y={H * 0.58} lines={lines} color={style.textSecondary} />
        <g>
          {keywords.map((k, i) => (
            <text key={i} x={cx} y={H * 0.58 + 68 + i * 18}
              textAnchor="middle" fill={style.accent}
              fontSize="10" fontFamily={style.fontFamily} letterSpacing="3" opacity="0.6">
              {k.toUpperCase()}
            </text>
          ))}
        </g>
        <foreignObject x={m + 20} y={H * 0.78} width={W - m * 2 - 40} height={H * 0.12}>
          <div style={{
            color: style.textSecondary, fontSize: '11px', fontFamily: style.fontFamily,
            lineHeight: '1.6', textAlign: 'center', fontStyle: 'italic', opacity: 0.7,
          }}>
            &ldquo;{blessing}&rdquo;
          </div>
        </foreignObject>
        {showSeal && (
          <SealStamp x={W - m - 30} y={H - m - 25} text={seal.textCn} color={style.sealColor}
            shape={seal.shape} size={seal.size} fontSize={14} uid={uid} />
        )}
        <FancyDivider x={cx - 40} y={H - m - 8} width={80} color={style.borderColor} style="ink" />
      </svg>
    );
  }

  // ======== 2. 暗黑神秘 ========
  function renderDarkMystic() {
    const m = margin;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <PosterFilters uid={uid} style="darkMystic" />
        <rect width={W} height={H} fill={style.bgPrimary} />
        <rect width={W} height={H} fill={style.bgSecondary} opacity="0.4" />
        <rect width={W} height={H} fill="#000" filter={`url(#noise-${uid})`} opacity="0.8" />
        <circle cx={cx} cy={H * 0.85} r="180" fill="url(#grad-main-${uid})" opacity="0.06" />
        <OrnateBorder x={m - 4} y={m - 4} w={W - m * 2 + 8} h={H - m * 2 + 8} color={style.borderColor} />
        <CornerMystic x={m + 2} y={m + 2} rotate={0} color={style.decoColor} />
        <CornerMystic x={W - m - 2} y={m + 2} rotate={90} color={style.decoColor} />
        <CornerMystic x={m + 2} y={H - m - 2} rotate={270} color={style.decoColor} />
        <CornerMystic x={W - m - 2} y={H - m - 2} rotate={180} color={style.decoColor} />
        <BrandHeader cx={cx} y={m + 20} style="darkMystic" color={style.textSecondary} />
        {/* 竖排英文 */}
        <g transform={`translate(${cx - 40}, ${H * 0.22})`}>
          {gua.nameEn.split('').filter(c => c !== ' ').slice(0, 12).map((char, i) => (
            <text key={i} x={0} y={i * 16}
              fill={style.textPrimary} fontSize="14" fontFamily={style.fontTitle}
              letterSpacing="1" opacity="0.85">
              {char.toUpperCase()}
            </text>
          ))}
        </g>
        {/* 竖排中文 */}
        <g transform={`translate(${cx + 20}, ${H * 0.22})`}>
          {gua.name.split('').map((char, i) => (
            <text key={i} x={0} y={i * 22}
              fill={style.accent} fontSize="16" fontFamily={style.fontCJK}
              letterSpacing="2" opacity="0.7" filter={`url(#glow-${uid})`}>
              {char}
            </text>
          ))}
        </g>
        <text x={cx} y={H * 0.48} textAnchor="middle" fill={style.textPrimary}
          fontSize="72" fontFamily="serif" opacity="0.25" filter={`url(#red-mist-${uid})`}>
          {gua.symbol}
        </text>
        {/* 六爻（右侧竖排） */}
        <g transform={`translate(${W - m - 35}, ${H * 0.35})`}>
          {lines.slice().reverse().map((lineType, i) => {
            const ly = i * 10;
            const sl = 18;
            return lineType === 'yang' ? (
              <line key={i} x1={-sl} y1={ly} x2={sl} y2={ly}
                stroke={style.gold} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
            ) : (
              <g key={i}>
                <line x1={-sl} y1={ly} x2={-3} y2={ly} stroke={style.gold} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
                <line x1={3} y1={ly} x2={sl} y2={ly} stroke={style.gold} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
              </g>
            );
          })}
        </g>
        {/* 竖排祝福语（左侧） */}
        <g transform={`translate(${m + 20}, ${H * 0.55})`}>
          {blessing.split(' ').slice(0, 6).map((word, i) => (
            <text key={i} x={0} y={i * 13}
              fill={style.textSecondary} fontSize="8" fontFamily={style.fontFamily}
              letterSpacing="0.5" opacity="0.5" writingMode="tb">
              {word}
            </text>
          ))}
        </g>
        <text x={cx} y={H - m - 60} textAnchor="middle" fill={style.gold}
          fontSize="9" fontFamily={style.fontFamily} letterSpacing="4" opacity="0.5">
          {keywords.join(' · ').toUpperCase()}
        </text>
        {showSeal && (
          <SealStamp x={cx} y={H - m - 30} text={seal.text} color={style.sealColor}
            shape={seal.shape} size={seal.size} fontSize={seal.fontSize} uid={uid} />
        )}
      </svg>
    );
  }

  // ======== 3. 皇家金 ========
  function renderImperialGold() {
    const m = margin;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <PosterFilters uid={uid} style="imperialGold" />
        <rect width={W} height={H} fill={style.bgPrimary} />
        <rect width={W} height={H} fill={style.bgSecondary} opacity="0.4" />
        <rect width={W} height={H} fill="#000" filter={`url(#gold-sparkle-${uid})`} opacity="0.15" />
        <rect width={W} height={H} fill="#000" filter={`url(#noise-${uid})`} opacity="0.5" />
        <OrnateBorder x={m - 4} y={m - 4} w={W - m * 2 + 8} h={H - m * 2 + 8} color={style.borderColor} strokeWidth={1.2} />
        <CornerMeander x={m} y={m} rotate={0} color={style.gold} size={16} />
        <CornerMeander x={W - m} y={m} rotate={90} color={style.gold} size={16} />
        <CornerMeander x={m} y={H - m} rotate={270} color={style.gold} size={16} />
        <CornerMeander x={W - m} y={H - m} rotate={180} color={style.gold} size={16} />
        <LotusDeco cx={cx} y={m + 50} size={30} color={style.gold} />
        <LotusDeco cx={cx} y={H - m - 50} size={30} color={style.gold} />
        <BrandHeader cx={cx} y={m + 16} style="imperialGold" color={style.textSecondary} />
        <line x1={cx - 50} y1={m + 30} x2={cx + 50} y2={m + 30} stroke={style.borderColor} strokeWidth="0.8" strokeOpacity="0.3" />
        <text x={cx} y={m + 65} textAnchor="middle" fill={style.textPrimary}
          fontSize={gua.nameEn.length > 18 ? 18 : 22} fontFamily={style.fontTitle}
          fontWeight="bold" letterSpacing="2" filter={`url(#glow-${uid})`} opacity="0.95">
          {gua.nameEn.toUpperCase()}
        </text>
        <g transform={`translate(${W - m - 22}, ${m + 85})`}>
          {gua.name.split('').map((char, i) => (
            <text key={i} x={0} y={i * 20}
              fill={style.accent} fontSize="14" fontFamily={style.fontCJK}
              opacity="0.7" writingMode="tb">
              {char}
            </text>
          ))}
        </g>
        <g transform={`translate(${m + 18}, ${m + 85})`}>
          <text x={0} y={0} fill={style.textSecondary} fontSize="7" fontFamily={style.fontCJK}
            opacity="0.35" writingMode="tb" letterSpacing="2">
            MYSTICDAO·{gua.element}·{gua.fortuneEn.toUpperCase()}
          </text>
        </g>
        <text x={cx} y={H * 0.42} textAnchor="middle" fill={style.textPrimary}
          fontSize="64" fontFamily="serif" opacity="0.8" filter={`url(#glow-${uid})`}>
          {gua.symbol}
        </text>
        <SixLines cx={cx} y={H * 0.58} lines={lines} color={style.gold} />
        <foreignObject x={m + 25} y={H * 0.72} width={W - m * 2 - 50} height={H * 0.1}>
          <div style={{
            color: style.textSecondary, fontSize: '10px', fontFamily: style.fontFamily,
            lineHeight: '1.7', textAlign: 'center', fontStyle: 'italic', opacity: 0.75,
          }}>
            &ldquo;{blessing}&rdquo;
          </div>
        </foreignObject>
        <text x={cx} y={H * 0.87} textAnchor="middle" fill={style.accent}
          fontSize="9" fontFamily={style.fontFamily} letterSpacing="3" opacity="0.6">
          {keywords.map(k => k.toUpperCase()).join(' · ')}
        </text>
        {showSeal && (
          <SealStamp x={cx} y={H - m - 28} text={seal.text} color={style.sealColor}
            shape={seal.shape} size={seal.size} fontSize={seal.fontSize} uid={uid} />
        )}
        <line x1={cx - 40} y1={H - m - 8} x2={cx + 40} y2={H - m - 8} stroke={style.borderColor} strokeWidth="0.6" strokeOpacity="0.25" />
      </svg>
    );
  }

  // ======== 4. 复古印刷 ========
  function renderVintagePrint() {
    const m = margin;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <PosterFilters uid={uid} style="vintagePrint" />
        <rect width={W} height={H} fill={style.bgPrimary} />
        <rect width={W} height={H} fill={style.bgSecondary} opacity="0.3" />
        <rect width={W} height={H} fill="#000" filter={`url(#noise-${uid})`} opacity="0.9" />
        <DoubleBorder x={m - 6} y={m - 6} w={W - m * 2 + 12} h={H - m * 2 + 12} color={style.borderColor} />
        <CornerMeander x={m - 2} y={m - 2} rotate={0} color={style.borderColor} size={14} />
        <CornerMeander x={W - m + 2} y={m - 2} rotate={90} color={style.borderColor} size={14} />
        <CornerMeander x={m - 2} y={H - m + 2} rotate={270} color={style.borderColor} size={14} />
        <CornerMeander x={W - m + 2} y={H - m + 2} rotate={180} color={style.borderColor} size={14} />
        <text x={cx} y={m + 16} textAnchor="middle" fill={style.textSecondary}
          fontSize="7" fontFamily="sans-serif" letterSpacing="5" opacity="0.35">
          MYSTIC DAO · I CHING ORACLE
        </text>
        <DragonDeco cx={cx} y={m + 35} size={45} color={style.decoColor} />
        <text x={cx} y={m + 80} textAnchor="middle" fill={style.textPrimary}
          fontSize={gua.nameEn.length > 18 ? 19 : 23} fontFamily={style.fontTitle}
          fontWeight="bold" letterSpacing="1" opacity="0.9">
          {gua.nameEn.toUpperCase()}
        </text>
        <text x={cx} y={m + 102} textAnchor="middle" fill={style.textSecondary}
          fontSize="13" fontFamily={style.fontCJK} letterSpacing="3" opacity="0.6">
          {gua.name} · {gua.symbol}
        </text>
        <FancyDivider x={cx - 60} y={m + 118} width={120} color={style.borderColor} style="vintagePrint" />
        <text x={m + 14} y={H * 0.35} fill={style.textSecondary}
          fontSize="7" fontFamily={style.fontFamily} letterSpacing="1" opacity="0.3"
          writingMode="tb">
          GOOD LUCK · LUCK FAVORS THE BRAVE
        </text>
        <text x={W - m - 10} y={H * 0.35} fill={style.textSecondary}
          fontSize="7" fontFamily={style.fontFamily} letterSpacing="1" opacity="0.3"
          writingMode="tb">
          WISHING YOU HAPPINESS AND LOVE
        </text>
        <text x={cx} y={H * 0.45} textAnchor="middle" fill={style.textPrimary}
          fontSize="56" fontFamily="serif" opacity="0.8">
          {gua.symbol}
        </text>
        <SixLines cx={cx} y={H * 0.56} lines={lines} color={style.textPrimary} />
        <foreignObject x={m + 25} y={H * 0.68} width={W - m * 2 - 50} height={H * 0.1}>
          <div style={{
            color: style.textSecondary, fontSize: '10px', fontFamily: style.fontFamily,
            lineHeight: '1.7', textAlign: 'center', fontStyle: 'italic', opacity: 0.75,
          }}>
            &ldquo;{blessing}&rdquo;
          </div>
        </foreignObject>
        <text x={cx} y={H * 0.83} textAnchor="middle" fill={style.textPrimary}
          fontSize="9" fontFamily={style.fontFamily} letterSpacing="2" opacity="0.6">
          {keywords.map(k => k.toUpperCase()).join('  ·  ')}
        </text>
        <DragonDeco cx={cx} y={H * 0.88} size={35} color={style.decoColor} />
        {showSeal && (
          <SealStamp x={W - m - 30} y={H - m - 22} text={seal.textCn} color={style.sealColor}
            shape={seal.shape} size={seal.size} fontSize={13} uid={uid} />
        )}
        <text x={cx} y={H - m - 6} textAnchor="middle" fill={style.textSecondary}
          fontSize="7" fontFamily="sans-serif" letterSpacing="3" opacity="0.3">
          EVERYTHING GOES WELL · MYSTICDAO.APP
        </text>
      </svg>
    );
  }

  // ======== 5. 天师黄 ========
  function renderTaoistYellow() {
    const m = margin;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <PosterFilters uid={uid} style="taoistYellow" />
        <rect width={W} height={H} fill={style.bgPrimary} />
        <rect width={W} height={H} fill={style.bgSecondary} opacity="0.3" />
        <GeometricBorder x={m} y={m} w={W - m * 2} h={H - m * 2} color={style.borderColor} />
        <CornerGeometric x={m + 4} y={m + 4} rotate={0} color={style.borderColor} />
        <CornerGeometric x={W - m - 4} y={m + 4} rotate={90} color={style.borderColor} />
        <CornerGeometric x={m + 4} y={H - m - 4} rotate={270} color={style.borderColor} />
        <CornerGeometric x={W - m - 4} y={H - m - 4} rotate={180} color={style.borderColor} />
        <text x={cx} y={m + 28} textAnchor="middle" fill={style.textSecondary}
          fontSize="8" fontFamily={style.fontFamily} letterSpacing="3" opacity="0.6">
          THE ORACLE HAS SPOKEN
        </text>
        <text x={cx} y={m + 46} textAnchor="middle" fill={style.textPrimary}
          fontSize="11" fontFamily={style.fontCJK} letterSpacing="6" opacity="0.8">
          天 官 赐 福 · 诸 事 顺 利
        </text>
        <FancyDivider x={cx - 50} y={m + 58} width={100} color={style.borderColor} style="taoistYellow" />
        <text x={cx} y={m + 92} textAnchor="middle" fill={style.textPrimary}
          fontSize={gua.nameEn.length > 18 ? 17 : 20} fontFamily={style.fontTitle}
          fontWeight="bold" letterSpacing="1">
          {gua.nameEn.toUpperCase()}
        </text>
        <text x={cx} y={m + 114} textAnchor="middle" fill={style.textSecondary}
          fontSize="12" fontFamily={style.fontCJK} letterSpacing="2" opacity="0.7">
          {gua.name} · {gua.symbol}
        </text>
        <path d={`M${cx - 70} ${m + 128} Q${cx} ${m + 100} ${cx + 70} ${m + 128}`}
          fill="none" stroke={style.borderColor} strokeWidth="1.5" strokeOpacity="0.4" />
        <text x={cx} y={H * 0.44} textAnchor="middle" fill={style.textPrimary}
          fontSize="72" fontFamily="serif" opacity="0.85" fontWeight="bold">
          {gua.symbol}
        </text>
        {showSeal && (
          <g opacity="0.9">
            <rect x={cx - 35} y={H * 0.48} width={70} height={70} fill="none"
              stroke={style.sealColor} strokeWidth="3" rx="2" />
            <rect x={cx - 30} y={H * 0.48 + 5} width={60} height={60} fill="none"
              stroke={style.sealColor} strokeWidth="1" rx="1" opacity="0.5" />
            <text x={cx} y={H * 0.48 + 42} textAnchor="middle" dominantBaseline="central"
              fill={style.sealColor} fontSize={22} fontFamily={style.fontCJK} fontWeight="bold"
              letterSpacing="3">
              {seal.textCn.slice(0, 3)}
            </text>
          </g>
        )}
        <SixLines cx={cx} y={H * 0.66} lines={lines} color={style.textPrimary} />
        <text x={cx} y={H * 0.82} textAnchor="middle" fill={style.textSecondary}
          fontSize="14" fontFamily={style.fontTitle} letterSpacing="2" opacity="0.8">
          {gua.fortuneEn.toUpperCase()}
        </text>
        <text x={cx} y={H * 0.88} textAnchor="middle" fill={style.textPrimary}
          fontSize="9" fontFamily={style.fontFamily} letterSpacing="2" opacity="0.6">
          {keywords.map(k => k.toUpperCase()).join(' · ')}
        </text>
        <rect x={m + 20} y={H - m - 30} width={W - m * 2 - 40} height={22}
          fill="none" stroke={style.borderColor} strokeWidth="1" strokeOpacity="0.4" />
        <text x={cx} y={H - m - 15} textAnchor="middle" fill={style.textPrimary}
          fontSize="10" fontFamily={style.fontTitle} letterSpacing="2">
          HEALTH & WEALTH
        </text>
      </svg>
    );
  }

  // ======== 6. 黑金高级（默认） ========
  function renderObsidianLux() {
    const m = margin;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <PosterFilters uid={uid} style="obsidianLux" />
        <rect width={W} height={H} fill={style.bgPrimary} />
        <rect width={W} height={H} fill={style.bgSecondary} opacity="0.5" />
        <rect width={W} height={H} fill="#000" filter={`url(#gold-sparkle-${uid})`} opacity="0.2" />
        <rect width={W} height={H} fill="#000" filter={`url(#noise-${uid})`} opacity="0.5" />
        <rect x={m} y={m} width={W - m * 2} height={H - m * 2}
          fill="none" stroke={style.borderColor} strokeWidth="1.5" strokeOpacity="0.4" rx="12" />
        <rect x={m + 6} y={m + 6} width={W - m * 2 - 12} height={H - m * 2 - 12}
          fill="none" stroke={style.gold} strokeWidth="0.6" strokeOpacity="0.15" rx="8" />
        <CloudDeco cx={cx} y={m + 45} size={50} color={style.decoColor} />
        <BrandHeader cx={cx} y={m + 18} style="obsidianLux" color={style.textSecondary} />
        <g transform={`translate(${m + 16}, ${m + 50})`}>
          <text x={0} y={0} fill={style.textSecondary} fontSize="7" fontFamily={style.fontCJK}
            opacity="0.25" writingMode="tb" letterSpacing="2">
            {gua.element}·{gua.upper}上{gua.lower}下
          </text>
        </g>
        <text x={cx} y={m + 72} textAnchor="middle" fill={style.textPrimary}
          fontSize={gua.nameEn.length > 18 ? 20 : 24} fontFamily={style.fontTitle}
          fontWeight="bold" letterSpacing="2" filter={`url(#glow-${uid})`} opacity="0.95">
          {gua.nameEn.toUpperCase()}
        </text>
        <text x={cx} y={m + 96} textAnchor="middle" fill={style.textSecondary}
          fontSize="12" fontFamily={style.fontCJK} letterSpacing="4" opacity="0.55">
          {gua.name} · {gua.symbol}
        </text>
        <line x1={cx - 45} y1={m + 108} x2={cx + 45} y2={m + 108}
          stroke={style.gold} strokeWidth="0.7" strokeOpacity="0.25" />
        <text x={cx} y={H * 0.44} textAnchor="middle" fill={style.textPrimary}
          fontSize="60" fontFamily="serif" opacity="0.85" filter={`url(#glow-${uid})`}>
          {gua.symbol}
        </text>
        <SixLines cx={cx} y={H * 0.58} lines={lines} color={style.gold} />
        <foreignObject x={m + 25} y={H * 0.72} width={W - m * 2 - 50} height={H * 0.1}>
          <div style={{
            color: style.textSecondary, fontSize: '10px', fontFamily: style.fontFamily,
            lineHeight: '1.7', textAlign: 'center', fontStyle: 'italic', opacity: 0.7,
          }}>
            &ldquo;{blessing}&rdquo;
          </div>
        </foreignObject>
        <text x={cx} y={H * 0.86} textAnchor="middle" fill={style.gold}
          fontSize="9" fontFamily={style.fontFamily} letterSpacing="3" opacity="0.45">
          {keywords.map(k => k.toUpperCase()).join(' · ')}
        </text>
        <CloudDeco cx={cx} y={H - m - 55} size={40} color={style.decoColor} />
        {showSeal && (
          <SealStamp x={cx} y={H - m - 26} text={seal.text} color={style.sealColor}
            shape={seal.shape} size={seal.size} fontSize={seal.fontSize} uid={uid} />
        )}
      </svg>
    );
  }
};

export default TalismanPosterV2;
