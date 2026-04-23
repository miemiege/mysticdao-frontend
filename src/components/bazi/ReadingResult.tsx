import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BreathingTypewriter from '../BreathingTypewriter';
import BaguaLoader from '../BaguaLoader';

const LOADING_MESSAGES = [
  '正在排盘计算...',
  '分析天干地支关系...',
  '解读五行生克...',
  '整合命理智慧...',
  '即将为你揭示命盘...',
];

interface ReadingResultProps {
  reading: string | null;
  isLoading: boolean;
  error?: string | null;
  onRetry: () => void;
  onReset: () => void;
}

export default function ReadingResult({ reading, isLoading, error, onRetry, onReset }: ReadingResultProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Cycle loading messages every 8 seconds
  useEffect(() => {
    if (!isLoading) return;

    setMessageIndex(0);
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleCopy = useCallback(async () => {
    if (!reading) return;
    try {
      await navigator.clipboard.writeText(reading);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = reading;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [reading]);

  return (
    <div className="w-full max-w-[800px] mx-auto">
      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-8 py-16"
          >
            <BaguaLoader size={160} />
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-text-secondary text-base"
                >
                  {LOADING_MESSAGES[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && !isLoading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6 py-16"
          >
            <div className="text-element-fire text-5xl mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-text-secondary text-base">{error}</p>
            <button
              onClick={onRetry}
              className="px-8 py-3.5 bg-white text-black text-base font-semibold rounded-pill transition-all duration-200 hover:bg-[#E5E5E5] hover:scale-[1.03] active:scale-[0.98]"
            >
              重试
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Content */}
      <AnimatePresence>
        {reading && !isLoading && !error && (
          <motion.div
            key="reading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            {/* Reading text card with glow sweep */}
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-10 relative overflow-hidden glow-sweep-container">
              <div className="glow-sweep" />
              <div className="prose-invert max-w-none relative z-10">
                <BreathingTypewriter text={reading} baseSpeed={30} highlightSpeed={100} />
              </div>
            </div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={onReset}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-black text-base font-semibold rounded-pill transition-all duration-200 hover:bg-[#E5E5E5] hover:scale-[1.03] active:scale-[0.98]"
              >
                重新排盘
              </button>
              <button
                onClick={handleCopy}
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white text-base font-medium rounded-pill border border-[rgba(255,255,255,0.2)] transition-all duration-200 hover:bg-white hover:text-black hover:border-white"
              >
                {copied ? '已复制' : '分享结果'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
