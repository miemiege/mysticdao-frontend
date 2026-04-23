import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface Yao {
  value: 0 | 1;
  changing: boolean;
}

interface HexagramDrawProps {
  lines: Yao[];
  strokeColor?: string;
  onComplete?: () => void;
}

const HexagramDraw: React.FC<HexagramDrawProps> = ({ lines, strokeColor = '#c8a45c', onComplete }) => {
  const [drawnCount, setDrawnCount] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!lines || lines.length === 0) return;
    let current = 0;
    const drawNext = () => {
      if (current < lines.length) {
        setDrawnCount(current + 1);
        current++;
        timeoutRef.current = setTimeout(drawNext, 400);
      } else {
        onComplete?.();
      }
    };
    timeoutRef.current = setTimeout(drawNext, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [lines, onComplete]);

  if (!lines || lines.length === 0) return null;

  const lineHeight = 6;
  const lineGap = 16;
  const totalHeight = lines.length * lineGap;
  const startY = -totalHeight / 2 + lineGap / 2;

  return (
    <svg width="120" height={totalHeight + 20} viewBox={`-60 ${-totalHeight / 2 - 10} 120 ${totalHeight + 20}`}>
      {lines.map((yao, i) => {
        const y = startY + i * lineGap;
        const isDrawn = i < drawnCount;
        const isYang = yao.value === 1;
        const lineWidth = 48;

        return (
          <g key={i}>
            {isYang ? (
              <motion.line
                x1={-lineWidth / 2}
                y1={y}
                x2={lineWidth / 2}
                y2={y}
                stroke={yao.changing ? '#EF4444' : strokeColor}
                strokeWidth={lineHeight}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isDrawn ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            ) : (
              <g>
                <motion.line
                  x1={-lineWidth / 2}
                  y1={y}
                  x2={-8}
                  y2={y}
                  stroke={yao.changing ? '#EF4444' : strokeColor}
                  strokeWidth={lineHeight}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isDrawn ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                />
                <motion.line
                  x1={8}
                  y1={y}
                  x2={lineWidth / 2}
                  y2={y}
                  stroke={yao.changing ? '#EF4444' : strokeColor}
                  strokeWidth={lineHeight}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isDrawn ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.25, delay: 0.15, ease: 'easeInOut' }}
                />
              </g>
            )}
            {yao.changing && isDrawn && (
              <motion.circle
                cx={lineWidth / 2 + 10}
                cy={y}
                r="4"
                fill={strokeColor}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default HexagramDraw;
