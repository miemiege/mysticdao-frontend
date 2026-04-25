import React, { useEffect, useRef, useState } from 'react';

interface ScoreRingProps {
  label: string;
  score: number;
  color: string;
  delay?: number;
}

const ScoreRing: React.FC<ScoreRingProps> = ({ label, score, color, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const circumference = 2 * Math.PI * 40;
  const targetOffset = circumference * (1 - score / 100);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(score);
      hasAnimated.current = true;
      return;
    }

    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const duration = 1000; // 1 second

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOut: 1 - (1 - progress)^2
        const eased = 1 - (1 - progress) * (1 - progress);
        setDisplayValue(Math.round(eased * score));

        if (progress >= 1) {
          hasAnimated.current = true;
          clearInterval(interval);
        }
      }, 16); // ~60fps

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [score, delay]);

  const delaySec = delay / 1000;

  return (
    <>
      <style>{`
        @keyframes scoreRingFadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes scoreRingStroke {
          from { stroke-dashoffset: ${circumference}; }
          to { stroke-dashoffset: ${targetOffset}; }
        }
      `}</style>
      <div
        className="flex flex-col items-center"
        style={{
          animation: `scoreRingFadeIn 0.4s ease-out ${delaySec}s both`,
        }}
      >
        <div className="relative" style={{ width: 100, height: 100 }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="6"
            />
            {/* Animated progress ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              transform="rotate(-90 50 50)"
              style={{
                filter: `drop-shadow(0 0 8px ${color}50) drop-shadow(0 0 16px ${color}20)`,
                animation: `scoreRingStroke 1s ease-out ${delaySec}s both`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold tabular-nums" style={{ color }}>
              {displayValue}
            </span>
          </div>
        </div>
        <span className="text-xs text-text-secondary mt-2">{label}</span>
      </div>
    </>
  );
};

export default ScoreRing;
