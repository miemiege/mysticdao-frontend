import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { getBaziState, saveBaziState, addHistory, addFavorite, isFavorite, generateShareId } from '../lib/storage';
import { fetchAIInterpretation } from '../services/api';
import BirthForm from '../components/bazi/BirthForm';
import FourPillars from '../components/bazi/FourPillars';
import ReadingResult from '../components/bazi/ReadingResult';
import {
  calculateFourPillars,
  formatBirthDate,
  getGenderText,
} from '../components/bazi/calendar';
import type { FourPillarsData } from '../components/bazi/calendar';
import {
  DAY_MASTER_TITLES,
  DAY_MASTER_TRAITS,
  ELEMENT_DESCRIPTIONS,
  ELEMENT_COLORS,
  MOCK_FORTUNE_PERIODS,
} from '../components/bazi/data';
import type { Element } from '../components/bazi/data';
import { getCityLongitude, DEFAULT_CITY } from '@/data/cities';

interface FormData {
  name: string;
  gender: 'male' | 'female' | null;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthCity: string;
}

// Steps: 1 = form, 2 = pillars, 3 = reading
export default function Bazi() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: null,
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: -1,
    birthCity: DEFAULT_CITY,
  });
  const [pillars, setPillars] = useState<FourPillarsData | null>(null);
  const [aiReading, setAiReading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Restore state from storage on mount
  useEffect(() => {
    const stored = getBaziState();
    if (stored && stored.formData) {
      try {
        const storedForm = stored.formData as Record<string, string>;
        setFormData({
          name: storedForm.name || '',
          gender: (storedForm.gender as 'male' | 'female') || null,
          birthYear: Number(storedForm.birthYear) || 1990,
          birthMonth: Number(storedForm.birthMonth) || 1,
          birthDay: Number(storedForm.birthDay) || 1,
          birthHour: storedForm.birthHour !== undefined ? Number(storedForm.birthHour) : -1,
          birthCity: (storedForm.birthCity as string) || DEFAULT_CITY,
        });

        if (stored.pillars && stored.pillars.length === 4) {
          const storedPillars = stored.pillars as Array<{ stem: string; branch: string; element: string; hiddenStems?: string[] }>;
          setPillars({
            year: {
              stem: storedPillars[0].stem,
              branch: storedPillars[0].branch,
              element: (storedPillars[0].element as 'wood' | 'fire' | 'earth' | 'metal' | 'water') || 'wood',
              hiddenStems: storedPillars[0].hiddenStems || [],
            },
            month: {
              stem: storedPillars[1].stem,
              branch: storedPillars[1].branch,
              element: (storedPillars[1].element as 'wood' | 'fire' | 'earth' | 'metal' | 'water') || 'wood',
              hiddenStems: storedPillars[1].hiddenStems || [],
            },
            day: {
              stem: storedPillars[2].stem,
              branch: storedPillars[2].branch,
              element: (storedPillars[2].element as 'wood' | 'fire' | 'earth' | 'metal' | 'water') || 'wood',
              hiddenStems: storedPillars[2].hiddenStems || [],
            },
            hour: {
              stem: storedPillars[3].stem,
              branch: storedPillars[3].branch,
              element: (storedPillars[3].element as 'wood' | 'fire' | 'earth' | 'metal' | 'water') || 'wood',
              hiddenStems: storedPillars[3].hiddenStems || [],
            },
          });
          setStep(2);
        }
      } catch {
        // Invalid stored state, ignore
      }
    }
  }, []);

  // Persist state on changes
  useEffect(() => {
    if (pillars) {
      saveBaziState({
        formData: {
          name: formData.name,
          gender: formData.gender || '',
          birthYear: String(formData.birthYear),
          birthMonth: String(formData.birthMonth),
          birthDay: String(formData.birthDay),
          birthHour: String(formData.birthHour),
          birthCity: formData.birthCity,
        },
        pillars: [
          pillars.year,
          pillars.month,
          pillars.day,
          pillars.hour,
        ],
      });
    }
  }, [formData, pillars]);

  const handleFormSubmit = useCallback(
    (data: FormData) => {
      setFormData(data);
      setError(null);

      // Calculate four pillars
      const hourForCalc = data.birthHour === -1 ? 12 : data.birthHour;
      const calculated = calculateFourPillars(
        data.birthYear,
        data.birthMonth,
        data.birthDay,
        hourForCalc
      );
      setPillars(calculated);
      setStep(2);
    },
    []
  );

  const handleRequestReading = useCallback(async () => {
    if (!pillars || !formData.gender) return;

    setIsLoading(true);
    setError(null);
    setStep(3);

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const longitude = getCityLongitude(formData.birthCity);
      const response = await fetchAIInterpretation(
        {
          type: 'bazi',
          data: {
            name: formData.name || '命主',
            gender: formData.gender,
            birthYear: formData.birthYear,
            birthMonth: formData.birthMonth,
            birthDay: formData.birthDay,
            birthHour: formData.birthHour,
            longitude,
            pillars,
          },
        },
        controller.signal
      );

      setAiReading(response.text);

      // Save to history
      const historyId = `bazi_${Date.now()}`;
      const titleStr = `${formData.name || '命主'} · ${formatBirthDate(formData.birthYear, formData.birthMonth, formData.birthDay, formData.birthHour)}`;
      addHistory({
        id: historyId,
        type: 'bazi',
        title: titleStr,
        date: new Date().toISOString(),
        data: {
          name: formData.name,
          gender: formData.gender,
          birthYear: formData.birthYear,
          birthMonth: formData.birthMonth,
          birthDay: formData.birthDay,
          birthHour: formData.birthHour,
          birthCity: formData.birthCity,
          pillars,
          reading: response.text,
        },
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      setError('解读请求失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [pillars, formData]);

  const handleRetry = useCallback(() => {
    setError(null);
    handleRequestReading();
  }, [handleRequestReading]);

  const handleReset = useCallback(() => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStep(1);
    setPillars(null);
    setAiReading(null);
    setError(null);
    setIsLoading(false);
    saveBaziState({
      formData: {
        name: '',
        gender: '',
        birthYear: '',
        birthMonth: '',
        birthDay: '',
        birthHour: '',
      },
      pillars: [],
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const birthDateStr = formatBirthDate(
    formData.birthYear,
    formData.birthMonth,
    formData.birthDay,
    formData.birthHour
  );

  return (
    <div className="min-h-[calc(100dvh-64px)] bg-bg-primary">
      {/* Step 1: Birth Info Form */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <section className="pt-20 pb-16 px-6">
              <div className="max-w-[600px] mx-auto">
                {/* Section Header */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
                  className="text-center mb-12"
                >
                  <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 tracking-tight">
                    八字排盘
                  </h1>
                  <p className="text-text-secondary text-base sm:text-lg">
                    输入你的生辰信息，AI 将为你生成四柱命盘并深度解读
                  </p>
                </motion.div>

                {/* Birth Form */}
                <BirthForm
                  initialData={formData}
                  onSubmit={handleFormSubmit}
                />
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Four Pillars Display */}
      <AnimatePresence mode="wait">
        {step === 2 && pillars && (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <section className="pt-20 pb-16 px-6">
              <div className="max-w-[900px] mx-auto">
                {/* Section Header */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
                  className="text-center mb-12"
                >
                  <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 tracking-tight">
                    你的四柱命盘
                  </h1>
                  <p className="text-text-secondary text-base">
                    {formData.name && `${formData.name} · `}
                    {formData.gender && `${getGenderText(formData.gender)} · `}
                    {birthDateStr}
                  </p>
                </motion.div>

                {/* Four Pillars Chart */}
                <FourPillars
                  pillars={pillars}
                  onRequestReading={handleRequestReading}
                />

                {/* ═══════════════════════════════════════════════════ */}
                {/*  Rich content from v1.0 — Day Master, Elements, Fortune */}
                {/* ═══════════════════════════════════════════════════ */}
                {(() => {
                  const dayMasterElement = pillars.day.element as Element;
                  const dmInfo = DAY_MASTER_TITLES[dayMasterElement];
                  const dmTraits = DAY_MASTER_TRAITS[dayMasterElement];
                  const elemDesc = ELEMENT_DESCRIPTIONS[dayMasterElement];
                  return (
                    <>
                      {/* Day Master Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                        className="mt-10 bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ELEMENT_COLORS[dayMasterElement] }} />
                          <h2 className="text-lg font-semibold text-text-primary">日主性格 · {dmInfo?.title || '未知'}</h2>
                        </div>
                        <p className="text-text-secondary text-sm mb-4 italic">{dmInfo?.tagline}</p>
                        <p className="text-text-secondary text-sm leading-relaxed mb-5">{elemDesc}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {dmTraits?.map((trait, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.6 + i * 0.08 }}
                              className="flex items-start gap-2 text-sm text-text-secondary"
                            >
                              <span className="text-text-muted mt-0.5">◆</span>
                              <span>{trait}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Five Elements Detail */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8, duration: 0.5 }}
                        className="mt-6 bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8"
                      >
                        <h2 className="text-lg font-semibold text-text-primary mb-4">五行解析</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(['wood', 'fire', 'earth', 'metal', 'water'] as Element[]).map((el) => (
                            <div key={el} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: `${ELEMENT_COLORS[el]}08` }}>
                              <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: ELEMENT_COLORS[el] }} />
                              <div>
                                <div className="text-sm font-medium text-text-primary">{el === 'wood' ? '木' : el === 'fire' ? '火' : el === 'earth' ? '土' : el === 'metal' ? '金' : '水'}</div>
                                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{ELEMENT_DESCRIPTIONS[el]}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Fortune Timeline */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.0, duration: 0.5 }}
                        className="mt-6 bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8"
                      >
                        <h2 className="text-lg font-semibold text-text-primary mb-6">大运流年</h2>
                        <div className="relative">
                          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border-subtle" />
                          <div className="space-y-5">
                            {MOCK_FORTUNE_PERIODS.map((period, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 2.2 + i * 0.1 }}
                                className="flex items-start gap-4 relative"
                              >
                                <div className="w-6 h-6 rounded-full shrink-0 border-2 flex items-center justify-center" style={{ borderColor: ELEMENT_COLORS[period.element], backgroundColor: `${ELEMENT_COLORS[period.element]}15` }}>
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ELEMENT_COLORS[period.element] }} />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-text-primary">{period.age} 岁 · {period.element === 'wood' ? '木' : period.element === 'fire' ? '火' : period.element === 'earth' ? '土' : period.element === 'metal' ? '金' : '水'}运</div>
                                  <p className="text-xs text-text-secondary mt-0.5">{period.description}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </>
                  );
                })()}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 3: AI Reading */}
      <AnimatePresence mode="wait">
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <section className="pt-20 pb-16 px-6">
              <div className="max-w-[800px] mx-auto">
                {/* Section Header */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
                  className="text-center mb-12"
                >
                  <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 tracking-tight">
                    AI 命理解读
                  </h1>
                  <p className="text-text-secondary text-base">
                    {formData.name && `${formData.name} · `}
                    {formData.gender && `${getGenderText(formData.gender)} · `}
                    {birthDateStr}
                  </p>
                </motion.div>

                {/* Action Buttons */}
                {aiReading && !isLoading && !error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex items-center justify-center gap-3 mb-8"
                  >
                    <button
                      onClick={() => {
                        const id = `bazi_${formData.name || '命主'}_${formData.birthYear}${formData.birthMonth}${formData.birthDay}`;
                        if (isFavorite(id)) {
                          toast.info('已在收藏中');
                          return;
                        }
                        addFavorite({
                          id,
                          type: 'bazi',
                          title: `${formData.name || '命主'} · ${formatBirthDate(formData.birthYear, formData.birthMonth, formData.birthDay, formData.birthHour)}`,
                          date: new Date().toISOString(),
                          data: {
                            name: formData.name,
                            gender: formData.gender,
                            birthYear: formData.birthYear,
                            birthMonth: formData.birthMonth,
                            birthDay: formData.birthDay,
                            birthHour: formData.birthHour,
                            pillars,
                            reading: aiReading,
                          },
                        });
                        toast.success('已收藏到用户中心');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-subtle text-sm text-text-secondary hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all duration-200"
                    >
                      <Heart className="w-4 h-4" />
                      收藏
                    </button>
                    <button
                      onClick={() => {
                        const shareId = generateShareId('bazi', {
                          name: formData.name,
                          gender: formData.gender,
                          birthYear: formData.birthYear,
                          birthMonth: formData.birthMonth,
                          birthDay: formData.birthDay,
                          birthHour: formData.birthHour,
                          pillars,
                          reading: aiReading,
                        });
                        const url = `${window.location.origin}/#/?share=${shareId}`;
                        navigator.clipboard.writeText(url).then(() => {
                          toast.success('分享链接已复制');
                        }).catch(() => {
                          toast.error('复制失败');
                        });
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-subtle text-sm text-text-secondary hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                      分享
                    </button>
                  </motion.div>
                )}

                {/* Reading Result */}
                <ReadingResult
                  reading={aiReading}
                  isLoading={isLoading}
                  error={error}
                  onRetry={handleRetry}
                  onReset={handleReset}
                />
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
