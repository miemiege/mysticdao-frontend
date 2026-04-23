import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface Yao {
  value: 0 | 1;
  changing: boolean;
}

interface HexagramDrawProps {
  lines: Yao[];
  strokeColor?: string;
  onComplete?: () => void;
  className?: string;
}

const YAO_WIDTH = 140;
const YAO_HEIGHT = 6;
const GAP = 14;
const STROKE_DURATION = 0.5;

const YaoLine: React.FC<{
  yao: Yao;
  index: number; // 0-5, from bottom to top
  onDrawn: (index: number) => void;
  strokeColor: string;
}> = ({ yao, index, onDrawn, strokeColor }) => {
  const isYang = yao.value === 1;
  const delay = index * 0.3;

  useEffect(() => {
    const timer = setTimeout(
      () => onDrawn(index),
      delay * 1000 + STROKE_DURATION * 1000 + 50
    );
    return () => clearTimeout(timer);
  }, [index, delay, onDrawn]);

  const yPos = (5 - index) * (YAO_HEIGHT + GAP);

  if (isYang) {
    const lineLen = YAO_WIDTH;
    return (
      <g transform={`translate(0, ${yPos})`}>
        <motion.line
          x1={0}
          y1={YAO_HEIGHT / 2}
          x2={YAO_WIDTH}
          y2={YAO_HEIGHT / 2}
          stroke={strokeColor}
          strokeWidth={YAO_HEIGHT}
          strokeLinecap="round"
          strokeDasharray={lineLen}
          initial={{ strokeDashoffset: lineLen, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: 1 }}
          transition={{ duration: STROKE_DURATION, delay, ease: 'easeInOut' }}
        />
        {yao.changing && (
          <motion.circle
            cx={YAO_WIDTH / 2}
            cy={YAO_HEIGHT / 2}
            r={YAO_HEIGHT * 1.8}
            fill="none"
            stroke={strokeColor}
            strokeWidth={1.5}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.9, 0, 0.9, 0, 0.9, 0],
              scale: [0.5, 1.3, 0.5, 1.3, 0.5, 1.3, 0.5],
            }}
            transition={{ delay: delay + STROKE_DURATION + 0.1, duration: 1.8 }}
          />
        )}
      </g>
    );
  }

  // 阴爻：两条短线
  const segmentWidth = (YAO_WIDTH - 14) / 2;
  return (
    <g transform={`translate(0, ${yPos})`}>
      {[0, 1].map((i) => (
        <motion.line
          key={i}
          x1={i * (segmentWidth + 14)}
          y1={YAO_HEIGHT / 2}
          x2={i * (segmentWidth + 14) + segmentWidth}
          y2={YAO_HEIGHT / 2}
          stroke={strokeColor}
          strokeWidth={YAO_HEIGHT}
          strokeLinecap="round"
          strokeDasharray={segmentWidth}
          initial={{ strokeDashoffset: segmentWidth, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: 1 }}
          transition={{ duration: STROKE_DURATION, delay: delay + i * 0.08, ease: 'easeInOut' }}
        />
      ))}
      {yao.changing && (
        <motion.rect
          x={-2}
          y={-2}
          width={YAO_WIDTH + 4}
          height={YAO_HEIGHT + 4}
          rx={3}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.5}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.9, 0, 0.9, 0, 0.9, 0],
          }}
          transition={{ delay: delay + STROKE_DURATION + 0.1, duration: 1.8 }}
        />
      )}
    </g>
  );
};

const HexagramDraw: React.FC<HexagramDrawProps> = ({
  lines,
  strokeColor = '#c8a45c',
  onComplete,
  className = '',
}) => {
  const drawnSetRef = useRef<Set<number>>(new Set());

  const handleDrawn = useCallback(
    (index: number) => {
      drawnSetRef.current.add(index);
      if (drawnSetRef.current.size >= lines.length && onComplete) {
        // small buffer to let the last animation settle
        setTimeout(() => onComplete(), 200);
      }
    },
    [lines.length, onComplete]
  );

  const height = 6 * (YAO_HEIGHT + GAP) - GAP;

  return (
    <svg
      width={YAO_WIDTH}
      height={height}
      viewBox={`0 0 ${YAO_WIDTH} ${height}`}
      className={className}
      style={{ overflow: 'visible' }}
    >
      {lines.map((yao, i) => (
        <YaoLine key={i} yao={yao} index={i} onDrawn={handleDrawn} strokeColor={strokeColor} />
      ))}
    </svg>
  );
};

export default HexagramDraw;
