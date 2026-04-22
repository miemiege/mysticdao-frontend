import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TIME_PERIODS } from './data';
import { ALL_CITIES, DEFAULT_CITY } from '@/data/cities';

interface BirthFormData {
  name: string;
  gender: 'male' | 'female' | null;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthCity: string;
}

interface BirthFormProps {
  initialData?: Partial<BirthFormData>;
  onSubmit: (data: BirthFormData) => void;
  isLoading?: boolean;
}

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

// Generate year options (1900-2024)
const YEAR_OPTIONS = Array.from({ length: 125 }, (_, i) => 1900 + i);

// Month options
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

// Get max day for a given year/month
function getMaxDay(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export default function BirthForm({ initialData, onSubmit, isLoading = false }: BirthFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [gender, setGender] = useState<'male' | 'female' | null>(initialData?.gender || null);
  const [birthYear, setBirthYear] = useState(initialData?.birthYear || 1990);
  const [birthMonth, setBirthMonth] = useState(initialData?.birthMonth || 1);
  const [birthDay, setBirthDay] = useState(initialData?.birthDay || 1);
  const [birthHour, setBirthHour] = useState(initialData?.birthHour ?? -1);
  const [birthCity, setBirthCity] = useState(initialData?.birthCity || DEFAULT_CITY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeField, setShakeField] = useState<string | null>(null);

  // Reset day if month/year changes and day is out of range
  useEffect(() => {
    const maxDay = getMaxDay(birthYear, birthMonth);
    if (birthDay > maxDay) {
      setBirthDay(maxDay);
    }
  }, [birthYear, birthMonth, birthDay]);

  const triggerShake = useCallback((field: string) => {
    setShakeField(field);
    setTimeout(() => setShakeField(null), 400);
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!gender) {
      newErrors.gender = '请选择性别';
    }

    if (!birthYear || birthYear < 1900 || birthYear > 2024) {
      newErrors.birthYear = '请选择有效的年份';
    }

    if (!birthMonth || birthMonth < 1 || birthMonth > 12) {
      newErrors.birthMonth = '请选择有效的月份';
    }

    if (!birthDay || birthDay < 1 || birthDay > getMaxDay(birthYear, birthMonth)) {
      newErrors.birthDay = '请选择有效的日期';
    }

    setErrors(newErrors);

    // Trigger shake animation for first error
    const firstError = Object.keys(newErrors)[0];
    if (firstError) {
      triggerShake(firstError);
    }

    return Object.keys(newErrors).length === 0;
  }, [gender, birthYear, birthMonth, birthDay, triggerShake]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading) return;

      if (validate()) {
        onSubmit({
          name,
          gender,
          birthYear,
          birthMonth,
          birthDay,
          birthHour,
          birthCity,
        } as BirthFormData);
      }
    },
    [isLoading, validate, onSubmit, name, gender, birthYear, birthMonth, birthDay, birthHour, birthCity]
  );

  const maxDay = getMaxDay(birthYear, birthMonth);
  const DAY_OPTIONS = Array.from({ length: maxDay }, (_, i) => i + 1);

  const isFormValid = gender !== null;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[600px] mx-auto">
      <div className="flex flex-col gap-6">
        {/* Field 1: Name */}
        <motion.div
          custom={0}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <label className="block text-sm text-text-secondary mb-2">
            姓名（可选）
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="你的名字"
            className="w-full bg-bg-card border border-[rgba(255,255,255,0.12)] rounded-lg px-4 py-3.5 text-text-primary text-base placeholder-text-muted focus:outline-none focus:border-border-glow focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] transition-all duration-200"
          />
        </motion.div>

        {/* Field 2: Gender */}
        <motion.div
          custom={1}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className={shakeField === 'gender' ? 'animate-shake' : ''}
        >
          <label className="block text-sm text-text-secondary mb-2">
            性别 <span className="text-element-fire">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setGender('male');
                setErrors((prev) => ({ ...prev, gender: '' }));
              }}
              className={`flex-1 py-3.5 rounded-pill text-base font-medium transition-all duration-200 ${
                gender === 'male'
                  ? 'bg-white text-black scale-[1.02]'
                  : 'bg-transparent text-white border border-[rgba(255,255,255,0.2)] hover:bg-white hover:text-black'
              }`}
            >
              男
            </button>
            <button
              type="button"
              onClick={() => {
                setGender('female');
                setErrors((prev) => ({ ...prev, gender: '' }));
              }}
              className={`flex-1 py-3.5 rounded-pill text-base font-medium transition-all duration-200 ${
                gender === 'female'
                  ? 'bg-white text-black scale-[1.02]'
                  : 'bg-transparent text-white border border-[rgba(255,255,255,0.2)] hover:bg-white hover:text-black'
              }`}
            >
              女
            </button>
          </div>
          {errors.gender && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-element-fire text-sm mt-1.5"
            >
              {errors.gender}
            </motion.p>
          )}
        </motion.div>

        {/* Field 3: Birth Date */}
        <motion.div
          custom={2}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <label className="block text-sm text-text-secondary mb-2">
            出生日期 <span className="text-element-fire">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div className={shakeField === 'birthYear' ? 'animate-shake' : ''}>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                aria-label="年"
                className="w-full bg-bg-card border border-[rgba(255,255,255,0.12)] rounded-lg px-3 py-3.5 text-text-primary text-base appearance-none focus:outline-none focus:border-border-glow focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] transition-all duration-200 cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>{y}年</option>
                ))}
              </select>
            </div>
            <div className={shakeField === 'birthMonth' ? 'animate-shake' : ''}>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(Number(e.target.value))}
                aria-label="月"
                className="w-full bg-bg-card border border-[rgba(255,255,255,0.12)] rounded-lg px-3 py-3.5 text-text-primary text-base appearance-none focus:outline-none focus:border-border-glow focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] transition-all duration-200 cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
            </div>
            <div className={shakeField === 'birthDay' ? 'animate-shake' : ''}>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(Number(e.target.value))}
                aria-label="日"
                className="w-full bg-bg-card border border-[rgba(255,255,255,0.12)] rounded-lg px-3 py-3.5 text-text-primary text-base appearance-none focus:outline-none focus:border-border-glow focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] transition-all duration-200 cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                {DAY_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}日</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Field 4: Birth Hour */}
        <motion.div
          custom={3}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <label className="block text-sm text-text-secondary mb-2">
            出生时辰（可选）
          </label>
          <select
            value={birthHour}
            onChange={(e) => setBirthHour(Number(e.target.value))}
            aria-label="出生时辰"
            className="w-full bg-bg-card border border-[rgba(255,255,255,0.12)] rounded-lg px-3 py-3.5 text-text-primary text-base appearance-none focus:outline-none focus:border-border-glow focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] transition-all duration-200 cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
          >
            {TIME_PERIODS.map((tp) => (
              <option key={tp.hour} value={tp.hour}>{tp.label}</option>
            ))}
          </select>
        </motion.div>

        {/* Field 5: Birth City */}
        <motion.div
          custom={4}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <label className="block text-sm text-text-secondary mb-2">
            出生地（用于真太阳时校正）
          </label>
          <select
            value={birthCity}
            onChange={(e) => setBirthCity(e.target.value)}
            aria-label="出生地"
            className="w-full bg-bg-card border border-[rgba(255,255,255,0.12)] rounded-lg px-3 py-3.5 text-text-primary text-base appearance-none focus:outline-none focus:border-border-glow focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] transition-all duration-200 cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
          >
            {ALL_CITIES.map((city) => (
              <option key={city.name} value={city.name}>{city.name}（东经{city.longitude}°）</option>
            ))}
          </select>
          <p className="text-xs text-text-muted mt-1.5">
            选择出生城市可校正真太阳时，提高排盘精度
          </p>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          custom={4}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="pt-2"
        >
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full py-3.5 bg-white text-black text-base font-semibold rounded-pill transition-all duration-200 hover:bg-[#E5E5E5] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                生成中...
              </span>
            ) : (
              '生成命盘'
            )}
          </button>
        </motion.div>
      </div>
    </form>
  );
}
