import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface ScoreRingProps {
  label: string;
  score: number;
  color: string;
  delay?: number;
}

const ScoreRing: React.FC<ScoreRingProps> = ({ label, score, color, delay = 0 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference * (1 - score / 100);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    const timeout = setTimeout(() => {
      const controls = animate(count, score, {
        duration: 1,
        ease: 'easeOut',
        onComplete: () => {
          hasAnimated.current = true;
        },
      });
      return () => controls.stop();
    }, delay);
    return () => clearTimeout(timeout);
  }, [score, delay, count]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay / 1000, duration: 0.4 }}
      className="flex flex-col items-center"
    >
      <div className="relative" style={{ width: 100, height: 100 }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut', delay: delay / 1000 }}
            transform="rotate(-90 50 50)"
            style={{ filter: `drop-shadow(0 0 8px ${color}50) drop-shadow(0 0 16px ${color}20)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className="text-xl font-bold tabular-nums" style={{ color }}>
            {rounded}
          </motion.span>
        </div>
      </div>
      <span className="text-xs text-text-secondary mt-2">{label}</span>
    </motion.div>
  );
};

export default ScoreRing;
