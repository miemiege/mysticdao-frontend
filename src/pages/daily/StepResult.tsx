/**
 * StepResult — 渐进式结果展示（核心组件）
 *
 * 6阶段渐进式揭示设计：
 *   reveal-1: 卦象符号 + 卦名
 *   reveal-2: 运势分数 + 印章
 *   reveal-3: 六爻可视化
 *   reveal-4: AI 推荐海报
 *   reveal-5: AI Reading + 运势维度 + 幸运信息 + 情绪价值
 *   reveal-6: 操作按钮 + Community Insights
 *
 * 卷轴容器：金色渐变轴头 + 淡金纸张 + 中央光晕
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Download, Share2, RotateCcw, Sparkles, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { Yao } from '@/components/daily/HexagramDraw';
import ScoreRing from '@/components/daily/ScoreRing';
import LuckyInfo from '@/components/daily/LuckyInfo';
import SharePoster from '@/components/daily/SharePoster';
import TalismanPosterLazy from '@/components/TalismanPosterLazy';
import { useStyleRecommendation } from '@/hooks/useStyleRecommendation';
import { GUA64_LIST } from '@/data/gua64';
import type { Gua64 } from '@/data/gua64';
import { getHexagramTalisman } from '@/data/hexagram-talismans';
import { POSTER_STYLES } from '@/lib/posterStyles';
import type { PosterStyleName } from '@/lib/posterStyles';
import type { FortuneResult } from './types';
import SimpleHexagram from './SimpleHexagram';
import './shared.css';

/* ──────────────────────────────────────────────────────────────── */
/*  Props                                                          */
/* ──────────────────────────────────────────────────────────────── */

interface StepResultProps {
  fortune: FortuneResult;
  lines: Yao[] | null;
  reading: string;
  alreadyDrawn: boolean;
  onReset: () => void;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Tone 情绪文案映射                                               */
/* ──────────────────────────────────────────────────────────────── */

const TONE_MESSAGES: Record<string, { title: string; subtitle: string; blessing: string }> = {
  zen: {
    title: '静水流深',
    subtitle: '于无声处听惊雷',
    blessing: '心若止水，万物自明。今日之运如静水流深，表面波澜不惊，内里蕴含无限生机。保持内心的宁静，方能听见宇宙最细微的指引。',
  },
  mystic: {
    title: '暗夜启明',
    subtitle: '深渊之下，自有光芒',
    blessing: '神秘之力笼罩此刻，暗夜中自有启明之星。不必畏惧未知，因为最深的智慧往往藏在最暗的角落。相信自己的直觉，它将引领你穿越迷雾。',
  },
  authoritative: {
    title: '天命所归',
    subtitle: '雷霆万钧，势不可挡',
    blessing: '天命之势如虹，今日宜决断、宜领导、宜开创。你的每一个决定都将如金石落地，铿锵有力。把握此刻的权威之气，成就非凡之事。',
  },
  warm: {
    title: '温润如玉',
    subtitle: '春风化雨，润物无声',
    blessing: '温暖之力环绕周身，如春风拂面，如细雨润心。今日宜善待他人，亦宜善待自己。记住，最持久的力量从来不是刚硬，而是温柔中的坚韧。',
  },
  direct: {
    title: '直挂云帆',
    subtitle: '当下即行动的最佳时机',
    blessing: '时不我待，今日之运势如离弦之箭，宜速不宜迟。不要等待完美的时机，因为行动本身就是最完美的时机。迈出第一步，宇宙自会为你铺就道路。',
  },
  elite: {
    title: '卓尔不群',
    subtitle: '黑金之间，自有格调',
    blessing: '精英之气萦绕今日，你的品味与格调将在不经意间彰显。不必刻意追求与众不同，因为你本身就是独特的存在。以优雅的姿态迎接今日的每一份馈赠。',
  },
  futuristic: {
    title: '未来已来',
    subtitle: '赛博之道，连通古今',
    blessing: '过去与未来在此刻交汇，古老智慧与现代能量融合成独特的运势场。今日适合拥抱变化，尝试新事物。记住，未来不是等待的地方，而是正在创造的地方。',
  },
  healing: {
    title: '万物生长',
    subtitle: '在自然中找到答案',
    blessing: '自然疗愈之力注入今日，如枯木逢春，如久旱甘霖。放慢脚步，感受周围的生机与活力。今日宜静修、宜冥想、宜亲近自然。万物皆有灵，倾听它们的声音。',
  },
};

/* ──────────────────────────────────────────────────────────────── */
/*  辅助函数                                                       */
/* ──────────────────────────────────────────────────────────────── */

/** 根据卦名查找卦象数据 */
function findGuaByName(name: string): Gua64 | undefined {
  return GUA64_LIST.find((g) => g.name === name);
}

/** 获取印章文字 */
function getSealText(score: number): string {
  if (score >= 90) return '上上签';
  if (score >= 80) return '上吉';
  if (score >= 70) return '中吉';
  if (score >= 60) return '小吉';
  if (score >= 50) return '平';
  return '需谨慎';
}

/** 获取印章颜色 */
function getSealColor(score: number): string {
  if (score >= 80) return '#8B0000';
  if (score >= 60) return '#A52A2A';
  return '#6B4423';
}

/** 获取默认 tone（当 recommendation 不可用时） */
function getDefaultTone(_score: number): string {
  return 'zen';
}

/* ──────────────────────────────────────────────────────────────── */
/*  装饰线组件                                                     */
/* ──────────────────────────────────────────────────────────────── */

const DecoLine: React.FC<{ color?: string; className?: string }> = ({
  color = '#C8A45C',
  className = '',
}) => (
  <div
    className={`h-px flex-1 max-w-[60px] ${className}`}
    style={{
      background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
    }}
  />
);

/* ──────────────────────────────────────────────────────────────── */
/*  风格选择器圆点                                                 */
/* ──────────────────────────────────────────────────────────────── */

const StyleDot: React.FC<{
  styleName: PosterStyleName;
  isActive: boolean;
  isRecommended: boolean;
  onClick: () => void;
}> = ({ styleName, isActive, isRecommended, onClick }) => {
  const config = POSTER_STYLES[styleName];
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 transition-all duration-300 hover:scale-110"
      title={config.label}
      type="button"
    >
      <div
        className="relative rounded-full transition-all duration-300"
        style={{
          width: isActive ? 28 : 22,
          height: isActive ? 28 : 22,
          backgroundColor: config.accentColor,
          boxShadow: isActive
            ? `0 0 12px ${config.accentColor}80, 0 0 4px ${config.accentColor}40`
            : `0 0 4px ${config.accentColor}30`,
          border: isActive ? '2px solid #E0E0E0' : '2px solid transparent',
        }}
      >
        {isRecommended && (
          <span className="absolute -top-1 -right-1 text-xs">✨</span>
        )}
      </div>
      <span
        className="text-[10px] transition-colors duration-300"
        style={{
          color: isActive ? config.accentColor : '#8B7355',
          fontWeight: isActive ? 600 : 400,
        }}
      >
        {config.label}
      </span>
    </button>
  );
};

/* ──────────────────────────────────────────────────────────────── */
/*  主组件                                                         */
/* ──────────────────────────────────────────────────────────────── */

const StepResult: React.FC<StepResultProps> = ({
  fortune,
  lines,
  reading,
  alreadyDrawn,
  onReset,
}) => {
  /* ── 状态 ── */
  const [selectedStyle, setSelectedStyle] = useState<PosterStyleName | null>(null);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [showReading, setShowReading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* ── 清理所有 timeout ── */
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  /* ── 查找卦象和符咒 ── */
  const currentGua = useMemo(() => findGuaByName(fortune.card.name), [fortune.card.name]);

  const currentTalisman = useMemo(
    () => (currentGua ? getHexagramTalisman(currentGua.name) : null),
    [currentGua]
  );

  /* ── AI 风格推荐 ── */
  const { recommendation: styleRecommendation } = useStyleRecommendation(
    currentGua ?? GUA64_LIST[0],
    currentTalisman ?? undefined
  );

  const activeStyle = selectedStyle || styleRecommendation.primary;
  const activeTone = styleRecommendation.tone || getDefaultTone(fortune.overallScore);

  /* ── Tone 文案 ── */
  const toneMessage = TONE_MESSAGES[activeTone] || TONE_MESSAGES.zen;

  /* ── 卦象符号 ── */
  const guaSymbol = currentGua?.symbol || '☯';

  /* ── 印章 ── */
  const sealText = getSealText(fortune.overallScore);
  const sealColor = getSealColor(fortune.overallScore);

  /* ── 操作 ── */
  const handleSave = useCallback(() => {
    setSaved(true);
    toast.success('Saved to your collection');
    const t = setTimeout(() => setSaved(false), 2000);
    timeoutsRef.current.push(t);
  }, []);

  const handleShare = useCallback(() => {
    setShared(true);
    toast.success('Share link copied!');
    const t = setTimeout(() => setShared(false), 2000);
    timeoutsRef.current.push(t);
  }, []);

  const toggleReading = useCallback(() => {
    setShowReading((prev) => !prev);
  }, []);

  /* ── 分数标签颜色映射 ── */
  const scoreLabelMap: Record<string, string> = {
    Career: '#C8A45C',
    Love: '#E879A0',
    Wealth: '#4ADE80',
    Health: '#60A5FA',
  };

  /* ── 海报数据 ── */
  const posterGua = currentGua ?? GUA64_LIST[0];
  const posterTalisman = currentTalisman ?? getHexagramTalisman('乾为天');

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-6">
      {/* ═══════════════════════════════════════════
          卷轴容器
         ═══════════════════════════════════════════ */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(200,164,92,0.08) 0%, #0A0A0F 15%, #0A0A0F 85%, rgba(200,164,92,0.08) 100%)',
        }}
      >
        {/* 中央光晕 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${fortune.card.color}12 0%, transparent 60%)`,
          }}
        />

        {/* 顶部轴头 */}
        <div
          className="absolute top-0 left-0 right-0 h-2 z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, #C8A45C60, #C8A45C, #C8A45C60, transparent)',
          }}
        />

        {/* 底部轴头 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2 z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, #C8A45C60, #C8A45C, #C8A45C60, transparent)',
          }}
        />

        {/* ── 内容区域 ── */}
        <div className="relative z-0 py-8 px-4 flex flex-col items-center gap-8">

          {/* ═══════════════════════════════════
              阶段 1: 卦象符号 + 卦名 (reveal-1)
             ═══════════════════════════════════ */}
          <div className="reveal-1 flex flex-col items-center text-center w-full">
            {/* 卦象符号 */}
            <div
              className="text-6xl sm:text-7xl font-serif mb-3"
              style={{
                color: fortune.card.color,
                textShadow: `0 0 30px ${fortune.card.color}40, 0 0 60px ${fortune.card.color}20`,
                fontFamily: '"Playfair Display", "Noto Serif SC", Georgia, serif',
              }}
            >
              {guaSymbol}
            </div>

            {/* 卦名 */}
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-widest mb-2"
              style={{
                color: fortune.card.color,
                fontFamily: '"Noto Serif SC", "STSong", serif',
              }}
            >
              {fortune.card.name}
            </h2>

            {/* Keyword + 装饰线 */}
            <div className="flex items-center gap-3 w-full justify-center">
              <DecoLine color={fortune.card.color} />
              <span
                className="text-xs sm:text-sm uppercase tracking-[0.2em] font-medium"
                style={{ color: '#8B7355' }}
              >
                {fortune.card.keyword}
              </span>
              <DecoLine color={fortune.card.color} />
            </div>

            {/* Aspect */}
            <span
              className="text-[10px] mt-2 tracking-wider uppercase"
              style={{ color: '#8B735560' }}
            >
              {fortune.card.aspect}
            </span>
          </div>

          {/* ═══════════════════════════════════
              阶段 2: 运势分数 (reveal-2)
             ═══════════════════════════════════ */}
          <div className="reveal-2 flex flex-col items-center text-center w-full relative">
            {/* FORTUNE SCORE 标签 */}
            <span
              className="text-[10px] tracking-[0.3em] uppercase mb-2"
              style={{ color: '#8B735580' }}
            >
              Fortune Score
            </span>

            {/* 分数 + 印章 */}
            <div className="relative flex items-center justify-center">
              {/* 大号分数 */}
              <div
                className="text-6xl sm:text-7xl font-bold tabular-nums"
                style={{
                  color: fortune.card.color,
                  textShadow: `0 0 20px ${fortune.card.color}50, 0 0 40px ${fortune.card.color}30`,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  lineHeight: 1,
                }}
              >
                {fortune.overallScore}
              </div>

              {/* 印章 */}
              <div
                className="absolute -right-10 -top-2 sm:-right-12 sm:-top-3"
                style={{
                  animation: 'sealStamp 0.6s ease-out 1.2s both',
                }}
              >
                <div
                  className="flex items-center justify-center border-2 rounded-sm"
                  style={{
                    width: 44,
                    height: 44,
                    borderColor: sealColor,
                    backgroundColor: `${sealColor}15`,
                    transform: 'rotate(8deg)',
                  }}
                >
                  <span
                    className="text-xs font-bold leading-none"
                    style={{
                      color: sealColor,
                      fontFamily: '"Noto Serif SC", serif',
                    }}
                  >
                    {sealText}
                  </span>
                </div>
              </div>
            </div>

            {/* /100 标签 */}
            <span className="text-sm mt-1" style={{ color: '#8B735560' }}>
              / 100
            </span>
          </div>

          {/* ═══════════════════════════════════
              阶段 3: 六爻可视化 (reveal-3)
             ═══════════════════════════════════ */}
          <div className="reveal-3 flex flex-col items-center w-full">
            {/* Hexagram 标题 */}
            <div className="flex items-center gap-3 mb-4 w-full justify-center">
              <DecoLine />
              <span
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{ color: '#8B735580' }}
              >
                Hexagram
              </span>
              <DecoLine />
            </div>

            {/* 六爻 */}
            {lines && lines.length === 6 ? (
              <SimpleHexagram
                lines={lines}
                strokeColor={fortune.card.color}
              />
            ) : (
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 120,
                  height: 120,
                  backgroundColor: 'rgba(200,164,92,0.05)',
                }}
              >
                <span className="text-xs" style={{ color: '#8B735560' }}>
                  六爻数据不可用
                </span>
              </div>
            )}

            {/* 动爻标签 */}
            {lines && lines.some((y) => y.changing) && (
              <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                {lines.map((y, i) =>
                  y.changing ? (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-full border"
                      style={{
                        color: '#DC2626',
                        borderColor: '#DC262640',
                        backgroundColor: '#DC262610',
                      }}
                    >
                      第{i + 1}爻动
                    </span>
                  ) : null
                )}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════
              阶段 4: 海报展示 (reveal-4)
             ═══════════════════════════════════ */}
          <div className="reveal-4 flex flex-col items-center w-full">
            {/* 海报标题 */}
            <div className="flex items-center gap-3 mb-4 w-full justify-center">
              <DecoLine />
              <span
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{ color: '#8B735580' }}
              >
                Talisman Poster
              </span>
              <DecoLine />
            </div>

            {/* AI 推荐标签 */}
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles size={12} style={{ color: fortune.card.color }} />
              <span className="text-[10px]" style={{ color: fortune.card.color }}>
                AI Recommended: {POSTER_STYLES[styleRecommendation.primary]?.label}
              </span>
            </div>

            {/* 海报主体 */}
            <div className="poster-float mb-4">
              <TalismanPosterLazy
                gua={posterGua}
                talisman={posterTalisman}
                style={activeStyle}
                width={320}
                height={480}
                useAssetLibrary
              />
            </div>

            {/* 换风格按钮 */}
            <button
              onClick={() => setShowStyleSelector((s) => !s)}
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 mb-3"
              style={{
                color: '#C8A45C',
                borderColor: 'rgba(200,164,92,0.3)',
                backgroundColor: 'rgba(200,164,92,0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200,164,92,0.12)';
                e.currentTarget.style.borderColor = 'rgba(200,164,92,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200,164,92,0.05)';
                e.currentTarget.style.borderColor = 'rgba(200,164,92,0.3)';
              }}
              type="button"
            >
              {showStyleSelector ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Change Style
            </button>

            {/* 风格选择器（展开/收起） */}
            <div
              className="w-full overflow-hidden transition-all duration-500 ease-out"
              style={{
                maxHeight: showStyleSelector ? 200 : 0,
                opacity: showStyleSelector ? 1 : 0,
              }}
            >
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 pb-3">
                {(Object.keys(POSTER_STYLES) as PosterStyleName[]).map((styleName) => (
                  <StyleDot
                    key={styleName}
                    styleName={styleName}
                    isActive={activeStyle === styleName}
                    isRecommended={styleRecommendation.primary === styleName}
                    onClick={() => setSelectedStyle(styleName)}
                  />
                ))}
              </div>
              {/* 推荐理由 */}
              <div
                className="text-center text-[10px] px-4 py-2 rounded-lg mx-2"
                style={{
                  color: '#8B7355',
                  backgroundColor: 'rgba(200,164,92,0.05)',
                }}
              >
                <Sparkles size={10} className="inline mr-1" style={{ color: fortune.card.color }} />
                {styleRecommendation.reason}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════
              阶段 5: AI Reading + 运势维度 + 幸运信息 + 情绪价值 (reveal-5)
             ═══════════════════════════════════ */}
          <div className="reveal-5 flex flex-col items-center w-full gap-6">
            {/* ── AI Reading ── */}
            <div className="w-full">
              {/* Reading 标题 */}
              <div className="flex items-center gap-3 mb-3 w-full justify-center">
                <DecoLine />
                <span
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: '#8B735580' }}
                >
                  AI Reading
                </span>
                <DecoLine />
              </div>

              {/* Reading 内容 */}
              <button
                onClick={toggleReading}
                className="w-full text-left transition-all duration-300"
                type="button"
              >
                <div
                  className="relative rounded-lg p-4 overflow-hidden transition-all duration-500"
                  style={{
                    backgroundColor: 'rgba(200,164,92,0.05)',
                    border: '1px solid rgba(200,164,92,0.1)',
                    maxHeight: showReading ? 600 : 120,
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: '#E0E0E0',
                      fontFamily: '"Noto Serif SC", serif',
                    }}
                  >
                    {reading || fortune.reading}
                  </p>
                  {!showReading && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                      style={{
                        background: 'linear-gradient(transparent, rgba(10,10,15,0.9))',
                      }}
                    />
                  )}
                </div>

                {/* 展开/收起 提示 */}
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-[10px]" style={{ color: '#8B735560' }}>
                    {showReading ? 'Collapse' : 'Expand'}
                  </span>
                  {showReading ? (
                    <ChevronUp size={10} style={{ color: '#8B735560' }} />
                  ) : (
                    <ChevronDown size={10} style={{ color: '#8B735560' }} />
                  )}
                </div>
              </button>
            </div>

            {/* ── 运势四维分数 ── */}
            {fortune.scores.length > 0 && (
              <div className="w-full">
                <div className="flex items-center gap-3 mb-4 w-full justify-center">
                  <DecoLine />
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: '#8B735580' }}
                  >
                    Aspects
                  </span>
                  <DecoLine />
                </div>

                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {fortune.scores.map((s, i) => (
                    <ScoreRing
                      key={s.label}
                      label={s.label}
                      score={s.score}
                      color={scoreLabelMap[s.label] || s.color || fortune.card.color}
                      delay={2600 + i * 150}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── 幸运信息 ── */}
            <LuckyInfo
              color={fortune.luckyColor}
              number={fortune.luckyNumber}
              direction={fortune.luckyDirection}
            />

            {/* ── 情绪价值文案 ── */}
            <div
              className="w-full rounded-lg p-4 text-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${fortune.card.color}10 0%, rgba(200,164,92,0.05) 100%)`,
                border: `1px solid ${fortune.card.color}20`,
              }}
            >
              {/* 装饰角 */}
              <div
                className="absolute top-2 left-2 w-3 h-3 pointer-events-none"
                style={{
                  borderTop: `1px solid ${fortune.card.color}40`,
                  borderLeft: `1px solid ${fortune.card.color}40`,
                }}
              />
              <div
                className="absolute top-2 right-2 w-3 h-3 pointer-events-none"
                style={{
                  borderTop: `1px solid ${fortune.card.color}40`,
                  borderRight: `1px solid ${fortune.card.color}40`,
                }}
              />
              <div
                className="absolute bottom-2 left-2 w-3 h-3 pointer-events-none"
                style={{
                  borderBottom: `1px solid ${fortune.card.color}40`,
                  borderLeft: `1px solid ${fortune.card.color}40`,
                }}
              />
              <div
                className="absolute bottom-2 right-2 w-3 h-3 pointer-events-none"
                style={{
                  borderBottom: `1px solid ${fortune.card.color}40`,
                  borderRight: `1px solid ${fortune.card.color}40`,
                }}
              />

              <h3
                className="text-lg font-bold mb-1"
                style={{
                  color: fortune.card.color,
                  fontFamily: '"Noto Serif SC", serif',
                }}
              >
                {toneMessage.title}
              </h3>
              <p
                className="text-xs mb-3"
                style={{ color: '#8B7355' }}
              >
                {toneMessage.subtitle}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: '#E0E0E0',
                  fontFamily: '"Noto Serif SC", serif',
                }}
              >
                {toneMessage.blessing}
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════
              阶段 6: 操作按钮 (reveal-6)
             ═══════════════════════════════════ */}
          <div className="reveal-6 flex flex-col items-center w-full gap-4">
            {/* 按钮组 */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Save 按钮 */}
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #1a2744 0%, #0d1b2a 100%)',
                  color: '#C8A45C',
                  border: '1px solid rgba(200,164,92,0.25)',
                  boxShadow: '0 0 20px rgba(200,164,92,0.1), inset 0 1px 0 rgba(200,164,92,0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(200,164,92,0.2), inset 0 1px 0 rgba(200,164,92,0.12)';
                  e.currentTarget.style.borderColor = 'rgba(200,164,92,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(200,164,92,0.1), inset 0 1px 0 rgba(200,164,92,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(200,164,92,0.25)';
                }}
                type="button"
              >
                <Download size={15} />
                {saved ? 'Saved!' : 'Save'}
              </button>

              {/* Share 按钮 */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'transparent',
                  color: '#C8A45C',
                  border: '1px solid rgba(200,164,92,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(200,164,92,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(200,164,92,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(200,164,92,0.3)';
                }}
                type="button"
              >
                <Share2 size={15} />
                {shared ? 'Copied!' : 'Share'}
              </button>

              {/* Draw Again 按钮 */}
              {!alreadyDrawn && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: 'rgba(200,164,92,0.1)',
                    color: '#C8A45C',
                    border: '1px solid rgba(200,164,92,0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(200,164,92,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(200,164,92,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(200,164,92,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(200,164,92,0.2)';
                  }}
                  type="button"
                >
                  <RotateCcw size={15} />
                  Draw Again
                </button>
              )}
            </div>

            {/* ── SharePoster 组件（海报下载 + 文字复制）── */}
            <SharePoster
              hexagramName={fortune.card.name}
              fortuneScore={fortune.overallScore}
              goldenQuote={fortune.card.keyword}
              variant="classic"
            />

            {/* ── Community Insights 占位 ── */}
            <div
              className="w-full rounded-lg p-4 flex flex-col items-center gap-2"
              style={{
                backgroundColor: 'rgba(200,164,92,0.03)',
                border: '1px solid rgba(200,164,92,0.08)',
              }}
            >
              <div className="flex items-center gap-2">
                <Users size={14} style={{ color: '#8B7355' }} />
                <span
                  className="text-xs tracking-wider uppercase"
                  style={{ color: '#8B735580' }}
                >
                  Community Insights
                </span>
              </div>
              <p className="text-[10px] text-center" style={{ color: '#8B735540' }}>
                See how others with the same hexagram navigated their day
              </p>
              <button
                className="text-[10px] px-3 py-1.5 rounded-full border transition-all duration-300 hover:scale-105"
                style={{
                  color: '#8B7355',
                  borderColor: 'rgba(139,115,85,0.2)',
                  backgroundColor: 'rgba(139,115,85,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(139,115,85,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(139,115,85,0.05)';
                }}
                type="button"
              >
                Coming Soon
              </button>
            </div>
          </div>
          {/* ── 内容区域结束 ── */}
        </div>
      </div>
    </div>
  );
};

export default StepResult;
