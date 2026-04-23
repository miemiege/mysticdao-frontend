import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreRingProps {
  label: string;
  score: number;
  color: string;
  delay?: number;
}

const ScoreRing: React.FC<ScoreRingProps> = ({ label, score, color, delay = 0 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference * (1 - animatedScore / 100);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const increment = score / 40;
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, 25);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [score, delay]);

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
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: delay / 1000 }}
            transform="rotate(-90 50 50)"
            style={{ filter: `drop-shadow(0 0 8px ${color}50) drop-shadow(0 0 16px ${color}20)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tabular-nums" style={{ color }}>
            {animatedScore}
          </span>
        </div>
      </div>
      <span className="text-xs text-text-secondary mt-2">{label}</span>
    </motion.div>
  );
};

export default ScoreRing;
