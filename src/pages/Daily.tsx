/**
 * Daily.tsx — 主控制器（< 200 行）
 * 只管理 step 切换，所有 UI 委托给 Step 组件
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { Yao } from '@/components/daily/HexagramDraw';
import { GUA64_LIST } from '@/data/gua64';
import { fetchAIInterpretation } from '@/services/api';
import { getDailyState, saveDailyState } from '@/lib/storage';
import { trackPageViewDaily, trackHexagramDraw } from '@/lib/analytics';
import { useRitualSound } from '@/hooks/useRitualSound';
import type { FortuneResult, Step } from './daily/types';
import StepIdle from './daily/StepIdle';
import StepRitual from './daily/StepRitual';
import StepLoading from './daily/StepLoading';
import StepResult from './daily/StepResult';
import './daily/shared.css';

/* ── 8 卦池（与原数据一致） ── */
const HEXAGRAMS = [
  { name: '乾为天', keyword: 'Force', aspect: 'Career', color: '#FBBF24' }, { name: '坤为地', keyword: 'Yield', aspect: 'Love', color: '#8B5CF6' },
  { name: '水雷屯', keyword: 'Sprout', aspect: 'Wealth', color: '#60A5FA' }, { name: '山水蒙', keyword: 'Ignite', aspect: 'Health', color: '#4ADE80' },
  { name: '水天需', keyword: 'Hold', aspect: 'Relations', color: '#F87171' }, { name: '天水讼', keyword: 'Confront', aspect: 'Career', color: '#A78BFA' },
  { name: '地水师', keyword: 'Guide', aspect: 'Wealth', color: '#34D399' }, { name: '水地比', keyword: 'Unite', aspect: 'Love', color: '#FB923C' },
];

const TRIGRAM_LINES: Record<string, [number, number, number]> = {
  '乾': [1, 1, 1], '兑': [1, 1, 0], '离': [1, 0, 1], '震': [1, 0, 0],
  '巽': [0, 1, 1], '坎': [0, 1, 0], '艮': [0, 0, 1], '坤': [0, 0, 0],
};

/* ── 工具函数 ── */
function generateLines(name: string): Yao[] {
  const gua = GUA64_LIST.find(g => g.name === name);
  if (!gua) return Array.from({ length: 6 }, () => ({ value: Math.random() > 0.5 ? 1 : 0, changing: false }) as Yao);
  const lower = TRIGRAM_LINES[gua.lower];
  const upper = TRIGRAM_LINES[gua.upper];
  const values = [...lower, ...upper] as (0 | 1)[];
  const changingCount = Math.random() > 0.7 ? 2 : Math.random() > 0.3 ? 1 : 0;
  const changingSet = new Set<number>();
  while (changingSet.size < changingCount) changingSet.add(Math.floor(Math.random() * 6));
  return values.map((v, i) => ({ value: v, changing: changingSet.has(i) }));
}

function generateFortune(seed: number): FortuneResult {
  const card = HEXAGRAMS[seed % HEXAGRAMS.length];
  const score = 40 + (((seed * 9301 + 49297) % 233280) / 233280) * 55;
  const base = Math.round(score);
  return {
    card,
    overallScore: base,
    scores: [
      { label: 'Career', score: Math.min(99, Math.round(base + Math.sin(seed) * 15)), color: '#F87171' },
      { label: 'Love',   score: Math.min(99, Math.round(base + Math.cos(seed) * 12)), color: '#FBBF24' },
      { label: 'Wealth', score: Math.min(99, Math.round(base + Math.sin(seed * 2) * 10)), color: '#4ADE80' },
      { label: 'Health', score: Math.min(99, Math.round(base + Math.cos(seed * 3) * 14)), color: '#60A5FA' },
    ],
    luckyColor: ['Red', 'Blue', 'Gold', 'Green', 'Purple'][seed % 5],
    luckyNumber: String((seed % 9) + 1),
    luckyDirection: ['Southeast', 'Northwest', 'South', 'Northeast', 'Southwest'][seed % 5],
    reading: '',
  };
}

/* ── 主组件 ── */
const Daily: React.FC = () => {
  const [step, setStep] = useState<Step>('idle');
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [lines, setLines] = useState<Yao[] | null>(null);
  const [reading, setReading] = useState('');
  const [error, setError] = useState('');
  const [alreadyDrawn, setAlreadyDrawn] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const { muted, toggleMute } = useRitualSound();

  /* 恢复今日状态 */
  useEffect(() => {
    const saved = getDailyState();
    if (saved?.lastDrawDate) {
      const today = new Date().toISOString().split('T')[0];
      if (saved.lastDrawDate === today && saved.fortune) {
        const f = saved.fortune as FortuneResult;
        setFortune(f);
        setLines(generateLines(f.card.name));
        setReading(saved.reading || '');
        setAlreadyDrawn(true);
        setStep('result');
        trackPageViewDaily(true);
        return;
      }
    }
    trackPageViewDaily(false);
  }, []);

  /* 开始摇卦 */
  const handleDraw = useCallback(() => {
    setError('');
    const f = generateFortune(Date.now());
    setFortune(f);
    setLines(generateLines(f.card.name));
    setReading('');
    setAlreadyDrawn(false);
    setStep('ritual');
    trackHexagramDraw(f.card.name, f.overallScore, 'daily');
  }, []);

  /* 仪式完成 → 进入 loading 并请求 AI */
  const handleRitualComplete = useCallback(() => {
    setStep('loading');
    if (!fortune) return;
    abortRef.current = new AbortController();
    fetchAIInterpretation(
      { type: 'daily', data: { score: fortune.overallScore, card: fortune.card.name } },
      abortRef.current.signal
    )
      .then(r => {
        setReading(r.text);
        setStep('result');
        const today = new Date().toISOString().split('T')[0];
        saveDailyState({ lastDrawDate: today, cardId: fortune.card.name, fortune, reading: r.text });
      })
      .catch(err => {
        if (err.name !== 'AbortError') { setError('AI interpretation temporarily unavailable'); setStep('result'); }
      });
  }, [fortune]);

  /* 重置 */
  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setStep('idle');
    setFortune(null);
    setLines(null);
    setReading('');
    setError('');
    setAlreadyDrawn(false);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0F] relative">
      {/* 声音开关 */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full border border-[#C8A45C]/20 bg-black/60 backdrop-blur-sm text-[#C8A45C]/70 hover:text-[#C8A45C] hover:border-[#C8A45C]/40 transition-all duration-200"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* 粒子背景 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-[#C8A45C]"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animation: `particleFloat ${3 + (i % 3)}s ease-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* 页面标题 */}
      <section className="relative pt-24 pb-4 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="reveal-1">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#C8A45C]/20 bg-[#C8A45C]/[0.04] mb-4">
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#C8A45C]/80">Daily I Ching</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight" style={{ textShadow: '0 0 50px rgba(200,164,92,0.2)', fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
              <span className="text-[#C8A45C]">Daily</span> Fortune
            </h1>
            <p className="text-[#8B8B8B] text-sm md:text-base max-w-md mx-auto leading-relaxed">
              Draw your daily hexagram and receive AI-powered wisdom from the ancient I Ching
            </p>
          </div>
        </div>
      </section>

      {/* 主内容区 — Step 切换 */}
      <section className="pb-20 px-4 relative">
        <div className="max-w-[700px] mx-auto">
          {step === 'idle' && <StepIdle onDraw={handleDraw} error={error} />}
          {step === 'ritual' && lines && fortune && (
            <StepRitual lines={lines} hexagramName={fortune.card.name} onComplete={handleRitualComplete} />
          )}
          {step === 'loading' && <StepLoading />}
          {step === 'result' && fortune && lines && (
            <StepResult fortune={fortune} lines={lines} reading={reading} alreadyDrawn={alreadyDrawn} onReset={handleReset} />
          )}
        </div>
      </section>
    </div>
  );
};

export default Daily;
