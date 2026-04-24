import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Heart, Share2, Star, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
// import FortuneCard from '@/components/daily/FortuneCard';
import ScoreRing from '@/components/daily/ScoreRing';
import LuckyInfo from '@/components/daily/LuckyInfo';
import RitualDrawing from '@/components/daily/RitualDrawing';
import SharePoster from '@/components/daily/SharePoster';
import TalismanRenderer from '@/components/talisman/TalismanRenderer';
import ShareCard from '@/components/share/ShareCard';
import { TalismanPosterV2 } from '@/components/TalismanPosterV2';
import { useStyleRecommendation } from '@/hooks/useStyleRecommendation';
import GlobalCounter from '@/components/daily/GlobalCounter';
import BreathingTypewriter from '@/components/BreathingTypewriter';
import RollingNumber from '@/components/daily/RollingNumber';
import HexagramDraw, { type Yao } from '@/components/daily/HexagramDraw';
import { GUA64_LIST } from '@/data/gua64';
import { getHexagramTalisman } from '@/data/hexagram-talismans';
import { useRitualSound } from '@/hooks/useRitualSound';
import { fetchAIInterpretation } from '@/services/api';
import { getDailyState, saveDailyState, addHistory, addFavorite, isFavorite } from '@/lib/storage';
import { toast } from 'sonner';

type Step = 'idle' | 'drawing' | 'loading' | 'result';

const loadingMessages = [
  'Connecting to the sacred realm...',
  'Calculating your cosmic alignment...',
  'Channeling ancient wisdom...',
];

const hexagrams = [
  { name: '乾为天', keyword: 'Force', aspect: 'Career', color: '#FBBF24' },
  { name: '坤为地', keyword: 'Yield', aspect: 'Love', color: '#8B5CF6' },
  { name: '水雷屯', keyword: 'Sprout', aspect: 'Wealth', color: '#60A5FA' },
  { name: '山水蒙', keyword: 'Ignite', aspect: 'Health', color: '#4ADE80' },
  { name: '水天需', keyword: 'Hold', aspect: 'Relations', color: '#F87171' },
  { name: '天水讼', keyword: 'Confront', aspect: 'Career', color: '#A78BFA' },
  { name: '地水师', keyword: 'Guide', aspect: 'Wealth', color: '#34D399' },
  { name: '水地比', keyword: 'Unite', aspect: 'Love', color: '#FB923C' },
];

const goldenQuotes: Record<string, string> = {
  '乾为天': '天行健，君子以自强不息',
  '坤为地': '地势坤，君子以厚德载物',
  '水雷屯': '云雷屯，君子以经纶',
  '山水蒙': '山下出泉，蒙，君子以果行育德',
  '水天需': '云上于天，需，君子以饮食宴乐',
  '天水讼': '天与水违行，讼，君子以作事谋始',
  '地水师': '地中有水，师，君子以容民畜众',
  '水地比': '地上有水，比，先王以建万国，亲诸侯',
};

const getGoldenQuote = (hexagramName: string): string => {
  return goldenQuotes[hexagramName] || '宇宙之大，人心之微，皆有定数';
};

const TRIGRAM_LINES: Record<string, [number, number, number]> = {
  '乾': [1, 1, 1],
  '兑': [1, 1, 0],
  '离': [1, 0, 1],
  '震': [1, 0, 0],
  '巽': [0, 1, 1],
  '坎': [0, 1, 0],
  '艮': [0, 0, 1],
  '坤': [0, 0, 0],
};

function generateLinesFromHexagram(name: string): Yao[] {
  const gua = GUA64_LIST.find((g) => g.name === name);
  if (!gua) {
    return Array.from({ length: 6 }, () => ({
      value: Math.random() > 0.5 ? 1 : 0,
      changing: false,
    })) as Yao[];
  }
  const lower = TRIGRAM_LINES[gua.lower];
  const upper = TRIGRAM_LINES[gua.upper];
  const values = [...lower, ...upper] as (0 | 1)[];
  const changingCount = Math.random() > 0.7 ? 2 : Math.random() > 0.3 ? 1 : 0;
  const changingSet = new Set<number>();
  while (changingSet.size < changingCount) {
    changingSet.add(Math.floor(Math.random() * 6));
  }
  return values.map((v, i) => ({ value: v, changing: changingSet.has(i) }));
}

function splitIntoSegments(text: string): string[] {
  if (!text) return [];
  const paras = text.split(/\n\n+/).filter(Boolean);
  if (paras.length > 1) return paras;
  const sentences = text.match(/[^。！？.!?]+[。！？.!?]+/g) || [text];
  if (sentences.length <= 2) return [text];
  const segs: string[] = [];
  segs.push(sentences[0]);
  for (let i = 1; i < sentences.length; i += 2) {
    segs.push(sentences.slice(i, i + 2).join(''));
  }
  return segs;
}

const FOLLOW_UP_TEMPLATES: Record<string, string> = {
  career:
    '💼 事业方面，此卦象提示你宜脚踏实地，把握眼前机会。近期工作上可能遇到新的合作契机，建议多与同事沟通，避免独断专行。注意细节处理，稳步推进项目，将有意想不到的收获。',
  love:
    '💕 感情方面，此卦暗示缘分微妙。有伴者宜多倾听对方心声，避免因小事争执；单身者桃花运平稳，不必强求，静心修炼自身魅力，良缘自来。今日适合表达真挚情感。',
  caution:
    '⚠️ 健康与安全方面需多加留意。近期易有疲劳之感，注意劳逸结合，避免熬夜。财务上不宜冒险投资，出行注意交通安全。保持平常心，远离口舌是非，可化解小人是非。',
};

function getFollowUpText(type: string): string {
  return FOLLOW_UP_TEMPLATES[type] || '今日宜保持平常心，顺势而为，自有吉祥。';
}

interface FortuneResult {
  card: (typeof hexagrams)[number];
  overallScore: number;
  scores: { label: string; score: number; color: string }[];
  luckyColor: string;
  luckyNumber: string;
  luckyDirection: string;
  reading: string;
}

function generateFortune(seed: number): FortuneResult {
  const card = hexagrams[seed % hexagrams.length];
  const overallScore = 40 + (((seed * 9301 + 49297) % 233280) / 233280) * 55;
  return {
    card,
    overallScore: Math.round(overallScore),
    scores: [
      { label: 'Career', score: Math.min(99, Math.round(overallScore + Math.sin(seed) * 15)), color: '#F87171' },
      { label: 'Love', score: Math.min(99, Math.round(overallScore + Math.cos(seed) * 12)), color: '#FBBF24' },
      { label: 'Wealth', score: Math.min(99, Math.round(overallScore + Math.sin(seed * 2) * 10)), color: '#4ADE80' },
      { label: 'Health', score: Math.min(99, Math.round(overallScore + Math.cos(seed * 3) * 14)), color: '#60A5FA' },
    ],
    luckyColor: ['Red', 'Blue', 'Gold', 'Green', 'Purple'][seed % 5],
    luckyNumber: String((seed % 9) + 1),
    luckyDirection: ['Southeast', 'Northwest', 'South', 'Northeast', 'Southwest'][seed % 5],
    reading: '',
  };
}

const ParticleBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-0.5 h-0.5 rounded-full bg-gold"
        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        animate={{ opacity: [0, 0.4, 0], y: [0, -30, -60], scale: [0, 1, 0.5] }}
        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3, ease: 'easeOut' }}
      />
    ))}
  </div>
);

const Daily: React.FC = () => {
  const [step, setStep] = useState<Step>('idle');
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [lines, setLines] = useState<Yao[] | null>(null);
  const [reading, setReading] = useState('');
  const [error, setError] = useState('');
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [alreadyDrawn, setAlreadyDrawn] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Segment / follow-up state
  const [readingSegments, setReadingSegments] = useState<string[]>([]);
  const [expandedSegments, setExpandedSegments] = useState<Set<number>>(new Set([0]));
  const [typingCompleteMap, setTypingCompleteMap] = useState<Set<string>>(new Set());
  const [followUpStage, setFollowUpStage] = useState(0);
  const [followUpList, setFollowUpList] = useState<{ key: string; text: string }[]>([]);
  const [showFollowUpButtons, setShowFollowUpButtons] = useState(false);
  const [hexagramDrawn, setHexagramDrawn] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  // 当前卦象数据（用于智能风格推荐 & 新海报系统）
  const currentGua = useMemo(() =>
    fortune ? GUA64_LIST.find((g) => g.name === fortune.card.name) || undefined : undefined,
    [fortune]
  );
  const currentTalisman = useMemo(() =>
    fortune ? getHexagramTalisman(fortune.card.name) : undefined,
    [fortune]
  );
  const { recommendation: styleRecommendation } = useStyleRecommendation(
    currentGua ?? GUA64_LIST[0],
    currentTalisman
  );
  const { muted, toggleMute } = useRitualSound();

  useEffect(() => {
    const saved = getDailyState();
    if (saved?.lastDrawDate) {
      const today = new Date().toISOString().split('T')[0];
      if (saved.lastDrawDate === today && saved.fortune) {
        const f = saved.fortune as FortuneResult;
        setFortune(f);
        setLines(generateLinesFromHexagram(f.card.name));
        setReading(saved.reading || '');
        setReadingSegments(splitIntoSegments(saved.reading || ''));
        setAlreadyDrawn(true);
        setStep('result');
      }
    }
  }, []);

  useEffect(() => {
    if (step !== 'loading') return;
    const interval = setInterval(() => setLoadingMsgIndex((p) => (p + 1) % loadingMessages.length), 3000);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step !== 'result') return;
    const activeIds: string[] = [];
    readingSegments.forEach((_, i) => {
      if (expandedSegments.has(i)) activeIds.push(`seg-${i}`);
    });
    followUpList.forEach((_, i) => activeIds.push(`fu-${i}`));
    const allComplete = activeIds.length > 0 && activeIds.every((id) => typingCompleteMap.has(id));
    if (allComplete && followUpStage < 3) {
      const timer = setTimeout(() => setShowFollowUpButtons(true), 500);
      return () => clearTimeout(timer);
    }
  }, [typingCompleteMap, expandedSegments, followUpList, followUpStage, readingSegments, step]);

  const handleDraw = useCallback(() => {
    setError('');
    const f = generateFortune(Date.now());
    setFortune(f);
    setLines(generateLinesFromHexagram(f.card.name));
    setReading('');
    setReadingSegments([]);
    setExpandedSegments(new Set([0]));
    setTypingCompleteMap(new Set());
    setFollowUpStage(0);
    setFollowUpList([]);
    setShowFollowUpButtons(false);
    setHexagramDrawn(false);
    setStep('drawing');
  }, []);

  const handleRitualComplete = useCallback(() => {
    setStep('loading');
    setLoadingMsgIndex(0);
    if (!fortune) return;
    abortRef.current = new AbortController();
    fetchAIInterpretation(
      { type: 'daily', data: { score: fortune.overallScore, card: fortune.card.name } },
      abortRef.current.signal
    )
      .then((r) => {
        setReading(r.text);
        setReadingSegments(splitIntoSegments(r.text));
        setStep('result');
        const today = new Date().toISOString().split('T')[0];
        saveDailyState({
          lastDrawDate: today,
          cardId: fortune.card.name,
          fortune,
          reading: r.text,
        });
        addHistory({
          id: `daily_${today}_${Date.now()}`,
          type: 'daily',
          title: `${today} · ${fortune.card.name} · ${fortune.overallScore}`,
          date: new Date().toISOString(),
          data: { fortune, reading: r.text },
        });
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('AI interpretation temporarily unavailable');
          setStep('result');
        }
      });
  }, [fortune]);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setStep('idle');
    setFortune(null);
    setLines(null);
    setReading('');
    setReadingSegments([]);
    setExpandedSegments(new Set([0]));
    setTypingCompleteMap(new Set());
    setFollowUpStage(0);
    setFollowUpList([]);
    setShowFollowUpButtons(false);
    setHexagramDrawn(false);
    setError('');
    setAlreadyDrawn(false);
  }, []);

  const handleFollowUp = useCallback(
    (key: string) => {
      setShowFollowUpButtons(false);
      setFollowUpStage((prev) => prev + 1);
      const text = getFollowUpText(key);
      setFollowUpList((prev) => [...prev, { key, text }]);
    },
    []
  );

  const handleSegmentComplete = useCallback((id: string) => {
    setTypingCompleteMap((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="min-h-[100dvh] bg-black relative">
      {/* Sound toggle */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full border border-gold/20 bg-black/60 backdrop-blur-sm text-gold/70 hover:text-gold hover:border-gold/40 transition-all duration-200"
        aria-label={muted ? 'Unmute' : 'Mute'}
        title={muted ? 'Unmute ritual sounds' : 'Mute ritual sounds'}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <ParticleBackground />
      <section className="relative pt-32 pb-8 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/20 bg-gold/[0.04] mb-6"
            >
              <Sparkles size={14} className="text-gold" />
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-gold/80">Daily I Ching</span>
            </motion.div>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight font-heading"
              style={{ textShadow: '0 0 50px rgba(200,164,92,0.2)' }}
            >
              <span className="text-gold">Daily</span> Fortune
            </h1>
            <p className="text-text-secondary text-base md:text-lg max-w-lg mx-auto leading-relaxed">
              Draw your daily hexagram and receive AI-powered wisdom from the ancient I Ching
            </p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6">
              <GlobalCounter />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="pb-32 px-6 relative">
        <div className="max-w-[700px] mx-auto">
          <AnimatePresence mode="wait">
            {step === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center py-12"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  animate={{ opacity: 0.08, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 1.5 }}
                  className="mb-8 text-gold text-[120px] font-heading leading-none"
                  style={{ textShadow: '0 0 60px rgba(200,164,92,0.3)' }}
                >
                  ☯
                </motion.div>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDraw}
                  className="relative px-12 py-5 bg-gradient-to-r from-gold via-gold-light to-gold text-black font-semibold text-base rounded-pill transition-all duration-300 flex items-center gap-3 group"
                  style={{ boxShadow: '0 0 40px rgba(200,164,92,0.2), 0 4px 20px rgba(0,0,0,0.3)' }}
                >
                  <Sparkles size={20} className="group-hover:animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="tracking-wider uppercase text-sm">Draw Your Fortune</span>
                </motion.button>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-5 text-sm text-text-muted tracking-wide"
                >
                  One draw per day · Connect with ancient wisdom
                </motion.p>
                {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
              </motion.div>
            )}

            {step === 'drawing' && (
              <motion.div
                key="drawing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 0.8 }}
              >
                <RitualDrawing
                  lines={lines || []}
                  hexagramName={fortune?.card.name}
                  onComplete={handleRitualComplete}
                />
              </motion.div>
            )}

            {step === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center py-24"
              >
                <div className="relative mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20"
                  >
                    <svg viewBox="0 0 80 80" className="w-full h-full">
                      <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(200,164,92,0.2)" strokeWidth="1" />
                      <path d="M40 2C18.5 2 2 18.5 2 40s16.5 38 38 38V2z" fill="rgba(200,164,92,0.15)" />
                      <circle cx="40" cy="22" r="8" fill="rgba(200,164,92,0.4)" />
                      <circle cx="40" cy="58" r="8" fill="none" stroke="rgba(200,164,92,0.4)" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: '0 0 30px rgba(200,164,92,0.15), inset 0 0 20px rgba(200,164,92,0.05)' }}
                  />
                </div>
                <motion.p
                  key={loadingMsgIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-text-secondary text-sm tracking-wide"
                >
                  {loadingMessages[loadingMsgIndex]}
                </motion.p>
                <div className="flex items-center gap-2 mt-4">
                  {loadingMessages.map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      animate={{
                        backgroundColor: i === loadingMsgIndex ? 'rgba(200,164,92,0.8)' : 'rgba(200,164,92,0.2)',
                        scale: i === loadingMsgIndex ? 1.3 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'result' && fortune && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-24">
                {/* Already drawn */}
                {alreadyDrawn && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs border border-gold/20 bg-gold/[0.05] text-gold/60">
                      <Star size={12} /> Already drawn today
                    </span>
                  </motion.div>
                )}

                {/* ═══════ 主卷轴容器 ═══════ */}
                <motion.div
                  initial={{ opacity: 0, scaleY: 0.3 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative max-w-[600px] mx-auto"
                  style={{ transformOrigin: 'top center' }}
                >
                  {/* 卷轴顶部轴头 */}
                  <div className="relative h-6 mb-1">
                    <div className="absolute inset-x-4 top-2 h-3 rounded-full"
                      style={{ background: `linear-gradient(90deg, transparent, ${fortune.card.color}30, transparent)` }} />
                    <div className="absolute left-2 top-0 w-4 h-6 rounded-full border border-gold/20"
                      style={{ background: 'linear-gradient(180deg, #2a2218, #1a1510)' }} />
                    <div className="absolute right-2 top-0 w-4 h-6 rounded-full border border-gold/20"
                      style={{ background: 'linear-gradient(180deg, #2a2218, #1a1510)' }} />
                  </div>

                  {/* 卷轴纸张 */}
                  <div
                    className="relative border-x border-gold/10 px-6 md:px-10 py-8"
                    style={{
                      background: 'linear-gradient(180deg, rgba(200,164,92,0.02) 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.2) 80%, rgba(200,164,92,0.02) 100%)',
                    }}
                  >
                    {/* 中央光晕 */}
                    <div
                      className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-30"
                      style={{ background: `radial-gradient(circle, ${fortune.card.color}40, transparent 70%)` }}
                    />

                    {/* ── 符咒（新版海报 + 智能风格推荐）── */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="flex justify-center mb-8 relative z-10"
                    >
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        {currentGua && currentTalisman ? (
                          <TalismanPosterV2
                            gua={currentGua}
                            talisman={currentTalisman}
                            style={styleRecommendation.primary}
                            width={300}
                            height={450}
                          />
                        ) : (
                          <TalismanRenderer
                            hexagramName={fortune.card.name}
                            blessingTheme={fortune.card.keyword}
                            element={(() => { const gua = GUA64_LIST.find((g) => g.name === fortune.card.name); return gua?.element || '金'; })()}
                            category={(() => { const t = getHexagramTalisman(fortune.card.name); return t.category; })()}
                            seed={(() => { const gua = GUA64_LIST.find((g) => g.name === fortune.card.name); return gua?.number || 1; })()}
                            score={fortune.overallScore}
                            width={300}
                            height={450}
                          />
                        )}
                      </motion.div>
                    </motion.div>

                    {/* ── 卦名 + 祈福主题 ── */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-center mb-8 relative z-10"
                    >
                      <h2 className="text-3xl md:text-4xl font-bold tracking-[0.1em] mb-2"
                        style={{
                          color: fortune.card.color,
                          textShadow: `0 0 40px ${fortune.card.color}50, 0 2px 8px rgba(0,0,0,0.6)`,
                          fontFamily: "'Noto Serif SC', Georgia, serif",
                        }}>
                        {fortune.card.name}
                      </h2>
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-8" style={{ background: `linear-gradient(90deg, transparent, ${fortune.card.color}50)` }} />
                        <span className="text-xs tracking-[0.2em] text-gold/60 uppercase">{fortune.card.keyword}</span>
                        <div className="h-px w-8" style={{ background: `linear-gradient(90deg, ${fortune.card.color}50, transparent)` }} />
                      </div>
                    </motion.div>

                    {/* ── 分数 + 印章 ── */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
                      className="flex items-center justify-center gap-8 mb-8 relative z-10"
                    >
                      <div className="text-center">
                        <div className="text-6xl md:text-7xl font-bold font-heading"
                          style={{
                            color: fortune.card.color,
                            textShadow: `0 0 50px ${fortune.card.color}40`,
                          }}>
                          <RollingNumber value={fortune.overallScore} delay={700} />
                        </div>
                        <div className="text-[10px] text-text-muted tracking-wider mt-1">FORTUNE SCORE</div>
                      </div>
                      <motion.div
                        initial={{ scale: 3, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: 8 }}
                        transition={{ delay: 1.1, type: 'spring', stiffness: 150, damping: 10 }}
                        className="w-14 h-14 rounded-lg border-2 flex items-center justify-center"
                        style={{
                          borderColor: `${fortune.card.color}70`,
                          background: `${fortune.card.color}08`,
                          boxShadow: `0 0 20px ${fortune.card.color}20`,
                        }}
                      >
                        <span className="text-lg font-bold" style={{ color: fortune.card.color }}>
                          {fortune.overallScore >= 85 ? '上' : fortune.overallScore >= 70 ? '吉' : fortune.overallScore >= 55 ? '中' : '平'}
                        </span>
                      </motion.div>
                    </motion.div>

                    {/* ── 六爻 ── */}
                    {lines && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        className="flex flex-col items-center mb-8 relative z-10"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-4 h-px bg-gold/20" />
                          <span className="text-[10px] tracking-[0.2em] text-text-muted/60 uppercase">Hexagram</span>
                          <div className="w-4 h-px bg-gold/20" />
                        </div>
                        <HexagramDraw lines={lines} strokeColor={fortune.card.color} onComplete={() => setHexagramDrawn(true)} />
                        {hexagramDrawn && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex gap-1">
                            {lines.map((yao, i) => (
                              <span key={i} className={`text-[9px] px-1 py-0.5 rounded ${yao.changing ? 'bg-gold/10 text-gold' : 'text-text-muted/40'}`}>
                                {yao.changing ? '动' : yao.value === 1 ? '阳' : '阴'}
                              </span>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* ── 运势维度 ── */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="mb-8 relative z-10"
                    >
                      <div className="flex items-center gap-2 mb-3 px-2">
                        <div className="w-4 h-px bg-gold/20" />
                        <span className="text-[10px] tracking-[0.2em] text-text-muted/60 uppercase">Aspects</span>
                        <div className="w-4 h-px bg-gold/20" />
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {fortune.scores.map((s, i) => (
                          <ScoreRing key={s.label} label={s.label} score={s.score} color={s.color} delay={i * 120 + 1200} />
                        ))}
                      </div>
                    </motion.div>

                    {/* ── 幸运信息 ── */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="mb-8 relative z-10"
                    >
                      <LuckyInfo color={fortune.luckyColor} number={fortune.luckyNumber} direction={fortune.luckyDirection} />
                    </motion.div>

                    {/* ── AI 解读 ── */}
                    {readingSegments.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="relative rounded-xl border border-gold/10 overflow-hidden mb-8"
                        style={{ background: 'linear-gradient(180deg, rgba(200,164,92,0.03), rgba(0,0,0,0.3))' }}
                      >
                        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.2), transparent)' }} />
                        <div className="p-5 md:p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={13} className="text-gold/60" />
                            <h3 className="text-[10px] font-semibold text-gold/60 tracking-[0.2em] uppercase">AI Reading</h3>
                          </div>
                          <div className="space-y-3">
                            {readingSegments.map((seg, i) => (
                              <div key={i}>
                                {i === 0 || expandedSegments.has(i) ? (
                                  <div className={i > 0 ? 'pt-2 border-t border-gold/[0.06]' : ''}>
                                    {i > 0 && (
                                      <button onClick={() => setExpandedSegments((prev) => { const next = new Set(prev); next.delete(i); return next; })}
                                        className="flex items-center gap-1 text-[10px] text-gold/40 hover:text-gold/70 mb-1 transition-colors">
                                        <ChevronUp size={11} /> Collapse
                                      </button>
                                    )}
                                    <BreathingTypewriter text={seg} baseSpeed={22} highlightSpeed={80} onAllComplete={() => handleSegmentComplete(`seg-${i}`)} />
                                  </div>
                                ) : (
                                  <button onClick={() => setExpandedSegments((prev) => { const next = new Set(prev); next.add(i); return next; })}
                                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors py-1.5 w-full">
                                    <ChevronDown size={14} className="text-gold/40" />
                                    <span className="text-xs tracking-wider">{i === 1 ? '展开详细解读' : `展开第 ${i + 1} 段`}</span>
                                  </button>
                                )}
                              </div>
                            ))}
                            {followUpList.map((fu, i) => (
                              <motion.div key={`fu-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                                className="pt-2 border-t border-gold/[0.06]">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/8 text-gold/60">
                                  {fu.key === 'career' ? '💼 事业' : fu.key === 'love' ? '💕 感情' : '⚠️ 注意'}
                                </span>
                                <div className="mt-2">
                                  <BreathingTypewriter text={fu.text} baseSpeed={22} highlightSpeed={80} onAllComplete={() => handleSegmentComplete(`fu-${i}`)} />
                                </div>
                              </motion.div>
                            ))}
                            <AnimatePresence>
                              {showFollowUpButtons && followUpStage < 3 && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.3 }}
                                  className="pt-3 flex flex-wrap gap-2 justify-center">
                                  {[{k:'career',l:'💼 事业运势'},{k:'love',l:'💕 感情姻缘'},{k:'caution',l:'⚠️ 需要注意'}].map((b) => (
                                    <button key={b.k} onClick={() => handleFollowUp(b.k)}
                                      className="px-3 py-1.5 rounded-full border border-gold/12 bg-gold/[0.03] text-xs text-gold/60 hover:text-gold hover:bg-gold/8 hover:border-gold/25 transition-all">
                                      {b.l}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                            {followUpStage >= 3 && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gold/40 text-xs pt-3">今日解读完毕 ☯</motion.div>
                            )}
                          </div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.1), transparent)' }} />
                      </motion.div>
                    )}

                    {/* ── 分享海报 ── */}
                    {fortune && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="mb-6 relative z-10">
                        <SharePoster hexagramName={fortune.card.name} fortuneScore={fortune.overallScore} goldenQuote={getGoldenQuote(fortune.card.name)} />
                      </motion.div>
                    )}

                    {/* ── 操作按钮 ── */}
                    {reading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
                        className="flex items-center justify-center gap-3 mb-4 relative z-10">
                        <button onClick={() => {
                          const today = new Date().toISOString().split('T')[0];
                          const id = `daily_${today}`;
                          if (isFavorite(id)) { toast.info('Already in favorites'); return; }
                          addFavorite({ id, type: 'daily', title: `${today} · ${fortune.card.name} · ${fortune.overallScore}`, date: new Date().toISOString(), data: { fortune, reading } });
                          toast.success('Saved to favorites');
                        }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/12 text-xs text-text-secondary hover:text-gold hover:border-gold/25 hover:bg-gold/5 transition-all">
                          <Heart size={14} /> Save
                        </button>
                        <button onClick={() => setShowShareCard(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/12 text-xs text-text-secondary hover:text-gold hover:border-gold/25 hover:bg-gold/5 transition-all">
                          <Share2 size={14} /> Share
                        </button>
                      </motion.div>
                    )}

                    {!alreadyDrawn && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} className="text-center relative z-10">
                        <button onClick={handleReset} className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold/12 rounded-pill text-xs text-text-secondary hover:text-gold hover:border-gold/25 hover:bg-gold/5 transition-all">
                          <RotateCcw size={14} /> Draw Again
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* 卷轴底部轴头 */}
                  <div className="relative h-6 mt-1">
                    <div className="absolute inset-x-4 bottom-2 h-3 rounded-full"
                      style={{ background: `linear-gradient(90deg, transparent, ${fortune.card.color}30, transparent)` }} />
                    <div className="absolute left-2 bottom-0 w-4 h-6 rounded-full border border-gold/20"
                      style={{ background: 'linear-gradient(180deg, #1a1510, #2a2218)' }} />
                    <div className="absolute right-2 bottom-0 w-4 h-6 rounded-full border border-gold/20"
                      style={{ background: 'linear-gradient(180deg, #1a1510, #2a2218)' }} />
                  </div>
                </motion.div>

                {/* ShareCard Modal */}
                <AnimatePresence>
                  {showShareCard && fortune && (
                    <ShareCard
                      hexagramName={fortune.card.name}
                      blessingTheme={fortune.card.keyword}
                      element={(() => { const gua = GUA64_LIST.find((g) => g.name === fortune.card.name); return gua?.element || '金'; })()}
                      category={(() => { const t = getHexagramTalisman(fortune.card.name); return t.category; })()}
                      seed={(() => { const gua = GUA64_LIST.find((g) => g.name === fortune.card.name); return gua?.number || 1; })()}
                      score={fortune.overallScore}
                      goldenQuote={(() => { const gua = GUA64_LIST.find((g) => g.name === fortune.card.name); return gua?.image || `${fortune.card.name} · ${fortune.card.keyword}`; })()}
                      onClose={() => setShowShareCard(false)}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Daily;
