/**
 * TalismanPosterV2 — 符咒分享海报主组件（纯SVG、8种风格模板）
 *
 * 特性：
 * - 8种模板：水墨(ink)/暗黑(dark)/皇家金(royal)/复古(vintage)/天师黄(tianshi)/黑金(blackgold)/赛博道(cybertao)/禅意园(zengarden)
 * - 纯SVG零外部图片
 * - 英文为主中文为辅
 * - html2canvas兼容（所有样式通过属性内联，避免CSS类名丢失）
 * - 条件滤镜：CyberTao霓虹发光 + CRT扫描线 | ZenGarden苔藓光晕 + 沙质纹理
 */
import React from 'react';
import type { PosterStyleName } from '@/lib/posterStyles';
import { getStyleConfig } from '@/lib/posterStyles';
import { PosterFilters } from './PosterFilters';
import { PosterDecorations } from './PosterDecorations';
import type { Gua64 } from '@/data/gua64';
import type { HexagramTalisman } from '@/data/hexagram-talismans';
import { getTheme } from '@/lib/theme';

export interface TalismanPosterV2Props {
  gua: Gua64;
  talisman: HexagramTalisman;
  style: PosterStyleName;
  width?: number;
  height?: number;
  showDecorations?: boolean;
  showFilters?: boolean;
  className?: string;
}

/** 获取风格特定的滤镜属性 */
function getTextFilter(style: PosterStyleName): string | undefined {
  if (style === 'cybertao') return 'url(#poster-neon)';
  return undefined;
}

function getDecorFilter(style: PosterStyleName): string | undefined {
  if (style === 'zengarden') return 'url(#poster-moss)';
  if (style === 'cybertao') return 'url(#poster-crt)';
  return undefined;
}

function getBgFilter(style: PosterStyleName): string | undefined {
  if (style === 'zengarden') return 'url(#poster-sand)';
  return undefined;
}

export const TalismanPosterV2 = React.forwardRef<SVGSVGElement, TalismanPosterV2Props>(({
  gua,
  talisman,
  style,
  width = 400,
  height = 600,
  showDecorations = true,
  showFilters = true,
  className,
}, ref) => {
  const config = getStyleConfig(style);
  const theme = getTheme(gua.element);
  const score = (() => {
    const map: Record<string, number> = { '大吉': 95, '吉': 80, '中吉': 70, '中平': 55, '小凶': 40, '凶': 25, '大凶': 10 };
    return map[gua.fortune] || 50;
  })();

  const sealText = score >= 80 ? '上吉' : score >= 60 ? '中吉' : '需谨慎';
  const textFilter = getTextFilter(style);
  const decorFilter = getDecorFilter(style);
  const bgFilter = getBgFilter(style);

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ fontFamily: config.fontFamilyEn }}
      data-poster-style={style}
      data-poster-version="2.1"
    >
      {showFilters && <PosterFilters />}

      {/* 背景 */}
      <rect width={width} height={height} fill={config.bgColor} />
      {config.bgGradient && (
        <rect width={width} height={height} fill={config.bgGradient} opacity={0.9} />
      )}

      {/* ZenGarden 沙质纹理背景层 */}
      {bgFilter && (
        <rect width={width} height={height} fill={config.bgColor} filter={bgFilter} opacity={0.4} />
      )}

      {/* 噪点纹理层 */}
      <rect width={width} height={height} fill="transparent" filter="url(#poster-noise)" opacity={config.noiseOpacity} style={{ mixBlendMode: 'overlay' }} />

      {/* CyberTao CRT 扫描线叠加层 */}
      {style === 'cybertao' && (
        <rect width={width} height={height} fill="transparent" filter="url(#poster-crt)" opacity={0.12} style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }} />
      )}

      {/* 装饰层（带条件滤镜） */}
      {showDecorations && (
        <g filter={decorFilter}>
          <PosterDecorations style={style} />
        </g>
      )}

      {/* 卦象符号（CyberTao带霓虹发光） */}
      <text
        x={width / 2}
        y={90}
        textAnchor="middle"
        fill={config.textColor}
        fontSize={56}
        fontFamily="'Noto Serif SC', serif"
        opacity={0.9}
        filter={textFilter}
      >
        {gua.symbol}
      </text>

      {/* 英文卦名（CyberTao带霓虹发光） */}
      <text
        x={width / 2}
        y={135}
        textAnchor="middle"
        fill={config.accentColor}
        fontSize={18}
        fontFamily={config.fontFamilyEn}
        fontWeight="600"
        letterSpacing="2"
        filter={textFilter}
      >
        {gua.nameEn.toUpperCase()}
      </text>

      {/* 中文卦名 */}
      <text x={width / 2} y={165} textAnchor="middle" fill={config.textColor} fontSize={14} fontFamily="'Noto Serif SC', serif" opacity={0.7}>
        {gua.name}
      </text>

      {/* 分隔线 */}
      <line x1={width / 2 - 60} y1={185} x2={width / 2 + 60} y2={185} stroke={config.borderColor} strokeWidth="1" opacity={0.5} />

      {/* 祈福主题（CyberTao带霓虹发光） */}
      <text
        x={width / 2}
        y={215}
        textAnchor="middle"
        fill={config.accentColor}
        fontSize={13}
        fontFamily={config.fontFamilyEn}
        letterSpacing="1"
        opacity={0.8}
        filter={textFilter}
      >
        {talisman.blessingTheme}
      </text>

      {/* 英文判词 */}
      <foreignObject x={40} y={240} width={width - 80} height={120}>
        {/* @ts-expect-error xmlns is valid in SVG foreignObject but not in React HTML types */}
        <div xmlns="http://www.w3.org/1999/xhtml" style={{
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
        }}>
          {gua.judgmentEn}
        </div>
      </foreignObject>

      {/* 关键词（CyberTao带霓虹发光） */}
      <g transform={`translate(${width / 2}, ${height - 180})`} filter={textFilter}>
        {gua.keywordsEn.slice(0, 3).map((kw, i) => (
          <text key={kw} x={(i - 1) * 70} y={0} textAnchor="middle" fill={config.accentColor} fontSize={10} fontFamily={config.fontFamilyEn} letterSpacing="1" opacity={0.7}>
            {kw.toUpperCase()}
          </text>
        ))}
      </g>

      {/* 五行指示 */}
      <circle cx={width / 2} cy={height - 130} r={22} fill="none" stroke={theme.primary} strokeWidth="1.5" opacity={0.6} />
      <text x={width / 2} y={height - 125} textAnchor="middle" fill={theme.primary} fontSize={12} fontFamily="'Noto Serif SC', serif" opacity={0.8}>
        {gua.element}
      </text>

      {/* 运势等级 */}
      <text x={width / 2} y={height - 85} textAnchor="middle" fill={config.textColor} fontSize={11} fontFamily={config.fontFamilyEn} letterSpacing="2" opacity={0.6}>
        {gua.fortuneEn.toUpperCase()}
      </text>

      {/* 印章 */}
      <g transform={`translate(${width - 70}, ${height - 70})`}>
        <rect x={-28} y={-28} width={56} height={56} fill={config.sealBg} stroke={config.sealColor} strokeWidth="2" rx="3" />
        <text x="0" y="4" textAnchor="middle" dominantBaseline="middle" fill={config.sealColor} fontSize={18} fontFamily="'Noto Serif SC', serif" fontWeight="bold">
          {sealText}
        </text>
      </g>

      {/* 底部品牌 */}
      <text x={width / 2} y={height - 20} textAnchor="middle" fill={config.textColor} fontSize={8} fontFamily={config.fontFamilyEn} letterSpacing="3" opacity={0.4}>
        MYSTIC DAO
      </text>
    </svg>
  );
});

TalismanPosterV2.displayName = 'TalismanPosterV2';

export default TalismanPosterV2;
