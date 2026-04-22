import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';
import FortuneCard from '@/components/daily/FortuneCard';
import ScoreRing from '@/components/daily/ScoreRing';
import LuckyInfo from '@/components/daily/LuckyInfo';
import TaijiLoader from '@/components/TaijiLoader';
import TypewriterText from '@/components/TypewriterText';
import { fetchAIInterpretation } from '@/services/api';
import { getDailyState, saveDailyState } from '@/lib/storage';

type Step = 'idle' | 'drawing' | 'loading' | 'result';

const loadingMessages = [
  '正在连接灵枢AI...',
  '正在测算今日运势...',
  '正在生成专属解读...',
];

const hexagrams = [
  { name: '乾为天', keyword: '刚健', aspect: '事业', color: '#FBBF24' },
  { name: '坤为地', keyword: '柔顺', aspect: '感情', color: '#8B5CF6' },
  { name: '水雷屯', keyword: '起始', aspect: '财运', color: '#60A5FA' },
  { name: '山水蒙', keyword: '启蒙', aspect: '健康', color: '#4ADE80' },
  { name: '水天需', keyword: '等待', aspect: '人际', color: '#F87171' },
  { name: '天水讼', keyword: '慎言', aspect: '事业', color: '#A78BFA' },
  { name: '地水师', keyword: '出师', aspect: '财运', color: '#34D399' },
  { name: '水地比', keyword: '亲比', aspect: '感情', color: '#FB923C' },
];

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
      { label: '事业', score: Math.min(99, Math.round(overallScore + Math.sin(seed) * 15)), color: '#F87171' },
      { label: '感情', score: Math.min(99, Math.round(overallScore + Math.cos(seed) * 12)), color: '#FBBF24' },
      { label: '财运', score: Math.min(99, Math.round(overallScore + Math.sin(seed * 2) * 10)), color: '#4ADE80' },
      { label: '健康', score: Math.min(99, Math.round(overallScore + Math.cos(seed * 3) * 14)), color: '#60A5FA' },
    ],
    luckyColor: ['红色', '蓝色', '金色', '绿色', '紫色'][seed % 5],
    luckyNumber: String((seed % 9) + 1),
    luckyDirection: ['东南', '西北', '正南', '东北', '西南'][seed % 5],
    reading: '',
  };
}

const Daily: React.FC = () => {
  const [step, setStep] = useState<Step>('idle');
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [reading, setReading] = useState('');
  const [error, setError] = useState('');
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [alreadyDrawn, setAlreadyDrawn] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Restore state
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

  // Loading message cycle
  useEffect(() => {
    if (step !== 'loading') return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [step]);

  const handleDraw = useCallback(async () => {
    setError('');
    setStep('drawing');

    const seed = Date.now();
    const result = generateFortune(seed);

    // Drawing animation delay
    setTimeout(() => {
      setFortune(result);
      setStep('loading');
      setLoadingMsgIndex(0);

      abortRef.current = new AbortController();

      fetchAIInterpretation(
        { type: 'daily', data: { score: result.overallScore, card: result.card.name } },
        abortRef.current.signal
      )
        .then((response) => {
          setReading(response.text);
          setStep('result');
          const today = new Date().toISOString().split('T')[0];
          saveDailyState({
            lastDrawDate: today,
            cardId: result.card.name,
            fortune: result,
            reading: response.text,
          });
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setError('AI解读暂时不可用');
            setStep('result');
          }
        });
    }, 1500);
  }, []);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setStep('idle');
    setFortune(null);
    setReading('');
    setError('');
    setAlreadyDrawn(false);
  }, []);

  return (
    <div className="min-h-[100dvh]">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle text-sm text-text-secondary mb-6">
              <Sparkles size={14} />
              <span>每日一卦</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
              今日运势
            </h1>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              每日抽取一次专属运势，AI 为你解读今日的机遇与挑战
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32 px-6">
        <div className="max-w-[700px] mx-auto">
          <AnimatePresence mode="wait">
            {/* Idle */}
            {step === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-16"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDraw}
                  className="relative px-12 py-5 bg-white text-black font-semibold text-lg rounded-pill transition-all duration-200 hover:bg-[#E5E5E5] flex items-center gap-3"
                  style={{
                    boxShadow: '0 0 40px rgba(251, 191, 36, 0.15)',
                  }}
                >
                  <Sparkles size={20} className="text-amber-500" />
                  抽取今日运势
                </motion.button>
                <p className="mt-4 text-sm text-text-muted">每日仅可抽取一次</p>

                {error && (
                  <p className="mt-4 text-sm text-red-400">{error}</p>
                )}
              </motion.div>
            )}

            {/* Drawing */}
            {step === 'drawing' && (
              <motion.div
                key="drawing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-16"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-24 h-24 rounded-full border-2 border-dashed border-amber-400/30 flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-amber-400/10 flex items-center justify-center">
                    <Sparkles size={24} className="text-amber-400" />
                  </div>
                </motion.div>
                <p className="mt-6 text-text-secondary text-sm">正在抽取...</p>
              </motion.div>
            )}

            {/* Loading */}
            {step === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-16"
              >
                <TaijiLoader size={80} />
                <motion.p
                  key={loadingMsgIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 text-text-secondary text-sm"
                >
                  {loadingMessages[loadingMsgIndex]}
                </motion.p>
              </motion.div>
            )}

            {/* Result */}
            {step === 'result' && fortune && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Already drawn badge */}
                {alreadyDrawn && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                  >
                    <span
                      className="inline-block px-4 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: 'rgba(251, 191, 36, 0.1)',
                        color: '#FBBF24',
                        border: '1px solid rgba(251, 191, 36, 0.2)',
                      }}
                    >
                      今日已抽
                    </span>
                  </motion.div>
                )}

                {/* Fortune Card */}
                <div className="mb-8">
                  <FortuneCard
                    name={fortune.card.name}
                    keyword={fortune.card.keyword}
                    aspect={fortune.card.aspect}
                    color={fortune.card.color}
                  />
                </div>

                {/* Overall Score */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <div className="text-sm text-text-secondary mb-1">综合运势</div>
                  <motion.div
                    className="text-6xl font-bold tracking-tight"
                    style={{ color: fortune.card.color }}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  >
                    {fortune.overallScore}
                  </motion.div>
                  <div className="text-xs text-text-muted mt-1">满分 100</div>
                </motion.div>

                {/* Score Rings */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-4 gap-4 mb-8"
                >
                  {fortune.scores.map((s, i) => (
                    <ScoreRing
                      key={s.label}
                      label={s.label}
                      score={s.score}
                      color={s.color}
                      delay={i * 100}
                    />
                  ))}
                </motion.div>

                {/* Lucky Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8"
                >
                  <LuckyInfo
                    color={fortune.luckyColor}
                    number={fortune.luckyNumber}
                    direction={fortune.luckyDirection}
                  />
                </motion.div>

                {/* AI Reading */}
                {reading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-bg-card border border-border-subtle rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      灵枢AI · 今日解读
                    </h3>
                    <div className="text-text-secondary leading-relaxed">
                      <TypewriterText text={reading} speed={25} />
                    </div>
                  </motion.div>
                )}

                {/* Reset */}
                {!alreadyDrawn && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 text-center"
                  >
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 px-6 py-3 border border-border-subtle rounded-pill text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200 hover:scale-[1.03]"
                    >
                      <RotateCcw size={16} />
                      重新抽取
                    </button>
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
