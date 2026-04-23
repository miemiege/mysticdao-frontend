import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Heart, Share2, Star } from 'lucide-react';
import FortuneCard from '@/components/daily/FortuneCard';
import ScoreRing from '@/components/daily/ScoreRing';
import LuckyInfo from '@/components/daily/LuckyInfo';
import RitualDrawing from '@/components/daily/RitualDrawing';
import SharePoster from '@/components/daily/SharePoster';
import GlobalCounter from '@/components/daily/GlobalCounter';
import BreathingTypewriter from '@/components/BreathingTypewriter';
import RollingNumber from '@/components/daily/RollingNumber';
import { fetchAIInterpretation } from '@/services/api';
import { getDailyState, saveDailyState, addHistory, addFavorite, isFavorite, generateShareId } from '@/lib/storage';
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

interface FortuneResult {
  card: typeof hexagrams[number];
  overallScore: number;
  scores: { label: string; score: number; color: string }[];
  luckyColor: string;
  luckyNumber: string;
  luckyDirection: string;
  reading: string;
}

function generateFortune(seed: number): FortuneResult {
  const card = hexagrams[seed % hexagrams.length];
  const overallScore = 40 + ((seed * 9301 + 49297) % 233280) / 233280 * 55;
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
  const [reading, setReading] = useState('');
  const [error, setError] = useState('');
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [alreadyDrawn, setAlreadyDrawn] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const saved = getDailyState();
    if (saved?.lastDrawDate) {
      const today = new Date().toISOString().split('T')[0];
      if (saved.lastDrawDate === today && saved.fortune) {
        setFortune(saved.fortune as FortuneResult);
        setReading(saved.reading || '');
        setAlreadyDrawn(true);
        setStep('result');
      }
    }
  }, []);

  useEffect(() => {
    if (step !== 'loading') return;
    const interval = setInterval(() => setLoadingMsgIndex(p => (p + 1) % loadingMessages.length), 3000);
    return () => clearInterval(interval);
  }, [step]);

  const handleDraw = useCallback(() => {
    setError('');
    setStep('drawing');
    setFortune(generateFortune(Date.now()));
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
      .then(r => {
        setReading(r.text);
        setStep('result');
        const today = new Date().toISOString().split('T')[0];
        saveDailyState({ lastDrawDate: today, cardId: fortune.card.name, fortune, reading: r.text });
        addHistory({ id: `daily_${today}_${Date.now()}`, type: 'daily', title: `${today} · ${fortune.card.name} · ${fortune.overallScore}`, date: new Date().toISOString(), data: { fortune, reading: r.text } });
      })
      .catch(err => { if (err.name !== 'AbortError') { setError('AI interpretation temporarily unavailable'); setStep('result'); } });
  }, [fortune]);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setStep('idle');
    setFortune(null);
    setReading('');
    setError('');
    setAlreadyDrawn(false);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-black relative">
      <ParticleBackground />
      <section className="relative pt-32 pb-8 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/20 bg-gold/[0.04] mb-6">
              <Sparkles size={14} className="text-gold" />
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-gold/80">Daily I Ching</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight font-heading" style={{ textShadow: '0 0 50px rgba(200,164,92,0.2)' }}>
              <span className="text-gold">Daily</span> Fortune
            </h1>
            <p className="text-text-secondary text-base md:text-lg max-w-lg mx-auto leading-relaxed">Draw your daily hexagram and receive AI-powered wisdom from the ancient I Ching</p>
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
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} className="flex flex-col items-center py-12">
                <motion.div initial={{ opacity: 0, scale: 0.5, rotate: -90 }} animate={{ opacity: 0.08, scale: 1, rotate: 0 }} transition={{ delay: 0.3, duration: 1.5 }} className="mb-8 text-gold text-[120px] font-heading leading-none" style={{ textShadow: '0 0 60px rgba(200,164,92,0.3)' }}>☯</motion.div>
                <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDraw}
                  className="relative px-12 py-5 bg-gradient-to-r from-gold via-gold-light to-gold text-black font-semibold text-base rounded-pill transition-all duration-300 flex items-center gap-3 group"
                  style={{ boxShadow: '0 0 40px rgba(200,164,92,0.2), 0 4px 20px rgba(0,0,0,0.3)' }}>
                  <Sparkles size={20} className="group-hover:animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="tracking-wider uppercase text-sm">Draw Your Fortune</span>
                </motion.button>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-5 text-sm text-text-muted tracking-wide">One draw per day · Connect with ancient wisdom</motion.p>
                {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
              </motion.div>
            )}

            {step === 'drawing' && (
              <motion.div key="drawing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} transition={{ duration: 0.8 }}>
                <RitualDrawing drawnCard={fortune?.card || null} onComplete={handleRitualComplete} />
              </motion.div>
            )}

            {step === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center py-24">
                <div className="relative mb-8">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="w-20 h-20">
                    <svg viewBox="0 0 80 80" className="w-full h-full">
                      <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(200,164,92,0.2)" strokeWidth="1" />
                      <path d="M40 2C18.5 2 2 18.5 2 40s16.5 38 38 38V2z" fill="rgba(200,164,92,0.15)" />
                      <circle cx="40" cy="22" r="8" fill="rgba(200,164,92,0.4)" />
                      <circle cx="40" cy="58" r="8" fill="none" stroke="rgba(200,164,92,0.4)" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                  <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 30px rgba(200,164,92,0.15), inset 0 0 20px rgba(200,164,92,0.05)' }} />
                </div>
                <motion.p key={loadingMsgIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="text-text-secondary text-sm tracking-wide">{loadingMessages[loadingMsgIndex]}</motion.p>
                <div className="flex items-center gap-2 mt-4">
                  {loadingMessages.map((_, i) => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full" animate={{ backgroundColor: i === loadingMsgIndex ? 'rgba(200,164,92,0.8)' : 'rgba(200,164,92,0.2)', scale: i === loadingMsgIndex ? 1.3 : 1 }} transition={{ duration: 0.3 }} />
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'result' && fortune && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {alreadyDrawn && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border border-gold/20 bg-gold/[0.06] text-gold/80"><Star size={12} />Already drawn today</span>
                  </motion.div>
                )}
                <div className="mb-10"><FortuneCard name={fortune.card.name} keyword={fortune.card.keyword} aspect={fortune.card.aspect} color={fortune.card.color} /></div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-10">
                  <div className="text-xs uppercase tracking-[0.2em] text-text-muted mb-3">Overall Fortune</div>
                  <motion.div className="text-7xl md:text-8xl font-bold tracking-tight font-heading" initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 150, damping: 15 }}>
                    <RollingNumber value={fortune.overallScore} delay={400} style={{ color: fortune.card.color, textShadow: `0 0 40px ${fortune.card.color}30` }} />
                  </motion.div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="h-px w-8" style={{ background: `linear-gradient(90deg, transparent, ${fortune.card.color}40)` }} />
                    <span className="text-xs text-text-muted uppercase tracking-wider">out of 100</span>
                    <div className="h-px w-8" style={{ background: `linear-gradient(90deg, ${fortune.card.color}40, transparent)` }} />
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-4 gap-4 mb-10">
                  {fortune.scores.map((s, i) => <ScoreRing key={s.label} label={s.label} score={s.score} color={s.color} delay={i * 150} />)}
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mb-10">
                  <LuckyInfo color={fortune.luckyColor} number={fortune.luckyNumber} direction={fortune.luckyDirection} />
                </motion.div>
                {reading && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.4 }} className="flex items-center justify-center gap-3 mb-6">
                    <button onClick={() => { const today = new Date().toISOString().split('T')[0]; const id = `daily_${today}`; if (isFavorite(id)) { toast.info('Already in favorites'); return; } addFavorite({ id, type: 'daily', title: `${today} · ${fortune.card.name} · ${fortune.overallScore}`, date: new Date().toISOString(), data: { fortune, reading } }); toast.success('Saved to favorites'); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-subtle text-sm text-text-secondary hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all duration-200"><Heart className="w-4 h-4" />Save</button>
                    <button onClick={() => { const shareId = generateShareId('daily', { fortune, reading }); navigator.clipboard.writeText(`${window.location.origin}/#/?share=${shareId}`).then(() => toast.success('Share link copied')).catch(() => toast.error('Copy failed')); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-subtle text-sm text-text-secondary hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all duration-200"><Share2 className="w-4 h-4" />Share</button>
                  </motion.div>
                )}
                {reading && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="relative rounded-2xl border border-gold/10 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(200,164,92,0.03) 0%, rgba(0,0,0,0.3) 100%)', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.2), transparent)' }} />
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-2 mb-5"><Sparkles size={16} className="text-gold" /><h3 className="text-sm font-semibold text-gold/80 tracking-wider uppercase">MysticDao AI Reading</h3></div>
                      <div className="text-text-secondary leading-relaxed text-[15px]"><BreathingTypewriter text={reading} baseSpeed={20} highlightSpeed={80} /></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.1), transparent)' }} />
                  </motion.div>
                )}
                {fortune && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="mt-10">
                    <SharePoster
                      hexagramName={fortune.card.name}
                      fortuneScore={fortune.overallScore}
                      goldenQuote={getGoldenQuote(fortune.card.name)}
                    />
                  </motion.div>
                )}
                {!alreadyDrawn && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-10 text-center">
                    <button onClick={handleReset} className="inline-flex items-center gap-2 px-6 py-3 border border-border-subtle rounded-pill text-sm text-text-secondary hover:text-text-primary hover:border-gold/30 hover:bg-gold/5 transition-all duration-200"><RotateCcw size={16} />Draw Again</button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Daily;
