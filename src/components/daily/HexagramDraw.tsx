import React, { useRef, useEffect, useCallback } from 'react';

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
        {/* 阳爻：一条完整的金色横线 */}
        <line
          x1={0}
          y1={YAO_HEIGHT / 2}
          x2={YAO_WIDTH}
          y2={YAO_HEIGHT / 2}
          stroke={strokeColor}
          strokeWidth={YAO_HEIGHT}
          strokeLinecap="round"
          strokeDasharray={lineLen}
          className={`yao-${index + 1}`}
          style={
            {
              '--stroke-len': lineLen,
              strokeDashoffset: lineLen,
              opacity: 0,
              animationDelay: `${delay}s`,
              transformOrigin: `${YAO_WIDTH / 2}px ${YAO_HEIGHT / 2}px`,
            } as React.CSSProperties
          }
        />
        {/* 动爻标记：红色圆点 */}
        {yao.changing && (
          <circle
            cx={YAO_WIDTH / 2}
            cy={YAO_HEIGHT / 2}
            r={YAO_HEIGHT * 1.8}
            fill="none"
            stroke="#ef4444"
            strokeWidth={1.5}
            className="yao-changing"
            style={
              {
                opacity: 0,
                animationDelay: `${delay + STROKE_DURATION + 0.1}s`,
                transformOrigin: `${YAO_WIDTH / 2}px ${YAO_HEIGHT / 2}px`,
              } as React.CSSProperties
            }
          />
        )}
      </g>
    );
  }

  // 阴爻：两条金色短横线（中间有 gap）
  const segmentWidth = (YAO_WIDTH - 14) / 2;
  return (
    <g transform={`translate(0, ${yPos})`}>
      {[0, 1].map((i) => (
        <line
          key={i}
          x1={i * (segmentWidth + 14)}
          y1={YAO_HEIGHT / 2}
          x2={i * (segmentWidth + 14) + segmentWidth}
          y2={YAO_HEIGHT / 2}
          stroke={strokeColor}
          strokeWidth={YAO_HEIGHT}
          strokeLinecap="round"
          strokeDasharray={segmentWidth}
          className={`yao-${index + 1}`}
          style={
            {
              '--stroke-len': segmentWidth,
              strokeDashoffset: segmentWidth,
              opacity: 0,
              animationDelay: `${delay + i * 0.08}s`,
              transformOrigin: `${i * (segmentWidth + 14) + segmentWidth / 2}px ${YAO_HEIGHT / 2}px`,
            } as React.CSSProperties
          }
        />
      ))}
      {/* 动爻标记：红色矩形框 */}
      {yao.changing && (
        <rect
          x={-2}
          y={-2}
          width={YAO_WIDTH + 4}
          height={YAO_HEIGHT + 4}
          rx={3}
          fill="none"
          stroke="#ef4444"
          strokeWidth={1.5}
          className="yao-changing"
          style={
            {
              opacity: 0,
              animationDelay: `${delay + STROKE_DURATION + 0.1}s`,
            } as React.CSSProperties
          }
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
    <>
      <style>{`
        @keyframes yaoLightUp {
          from {
            stroke-dashoffset: var(--stroke-len, 140);
            opacity: 0;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        @keyframes yaoBlink {
          0% { opacity: 0; }
          14.3% { opacity: 0.9; }
          28.6% { opacity: 0; }
          42.9% { opacity: 0.9; }
          57.1% { opacity: 0; }
          71.4% { opacity: 0.9; }
          85.7% { opacity: 0; }
          100% { opacity: 0; }
        }
        .yao-1, .yao-2, .yao-3, .yao-4, .yao-5, .yao-6 {
          animation: yaoLightUp ${STROKE_DURATION}s ease-in-out both;
        }
        .yao-changing {
          animation: yaoBlink 1.8s ease-in-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .yao-1, .yao-2, .yao-3, .yao-4, .yao-5, .yao-6 {
            animation: none !important;
            stroke-dashoffset: 0 !important;
            opacity: 1 !important;
          }
          .yao-changing {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
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
    </>
  );
};

export default HexagramDraw;
