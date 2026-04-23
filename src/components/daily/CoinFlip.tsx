import React from 'react';
import { motion } from 'framer-motion';

export type CoinSide = 'heads' | 'tails';

export interface CoinFlipProps {
  index: number; // 0=left, 1=center, 2=right
  side: CoinSide;
  delay?: number;
  flightDuration?: number;
  onLand?: () => void;
  size?: number;
  containerWidth?: number;
}

const CoinSVG: React.FC<{ side: CoinSide; size: number }> = ({ side, size }) => {
  const isHeads = side === 'heads';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ filter: isHeads ? 'drop-shadow(0 0 4px rgba(200,164,92,0.5))' : 'none' }}>
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={isHeads ? '#c8a45c' : '#2a2a2a'}
        stroke={isHeads ? '#e8d5a3' : '#444'}
        strokeWidth="1.5"
      />
      {isHeads && (
        <>
          <circle cx="24" cy="24" r="16" fill="none" stroke="#e8d5a3" strokeWidth="0.8" opacity="0.5" />
          <text
            x="24"
            y="28"
            textAnchor="middle"
            fill="#1a1209"
            fontSize="14"
            fontWeight="bold"
            fontFamily="'Noto Sans SC', sans-serif"
          >
            乾
          </text>
          <circle cx="24" cy="14" r="1.8" fill="#1a1209" opacity="0.25" />
          <rect x="19" y="32" width="10" height="1.5" rx="0.5" fill="#1a1209" opacity="0.25" />
        </>
      )}
      {!isHeads && (
        <>
          <circle cx="24" cy="24" r="12" fill="none" stroke="#555" strokeWidth="0.5" opacity="0.3" />
          <line x1="16" y1="16" x2="32" y2="32" stroke="#555" strokeWidth="0.5" opacity="0.25" />
          <line x1="32" y1="16" x2="16" y2="32" stroke="#555" strokeWidth="0.5" opacity="0.25" />
        </>
      )}
    </svg>
  );
};

const CoinFlip: React.FC<CoinFlipProps> = ({
  index,
  side,
  delay = 0,
  flightDuration = 1.0,
  onLand,
  size = 36,
}) => {
  // Three divergent flight paths
  const paths = [
    { x: [0, -50, -85, -80], y: [0, -110, 15, 5], rotateZ: [0, -50, 30, -10] },
    { x: [0, 5, 15, 10], y: [0, -130, 10, 0], rotateZ: [0, 20, -40, 5] },
    { x: [0, 50, 85, 80], y: [0, -110, 15, 5], rotateZ: [0, 50, -30, 10] },
  ];
  const path = paths[index % 3];

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: size, height: size, perspective: 500, left: '50%', top: '20%', marginLeft: -size / 2 }}
      initial={{
        x: 0,
        y: 0,
        opacity: 0,
        rotateX: 0,
        rotateZ: 0,
        scale: 0.4,
      }}
      animate={{
        x: path.x,
        y: path.y,
        rotateX: [0, 360, 720, 1080],
        rotateZ: path.rotateZ,
        opacity: [0, 1, 1, 1],
        scale: [0.4, 1, 1, 1],
      }}
      transition={{ duration: flightDuration, delay, ease: 'easeOut' }}
      onAnimationComplete={onLand}
    >
      <motion.div
        style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
        animate={{ rotateY: [0, 180, 360, 540] }}
        transition={{ duration: flightDuration, delay, ease: 'easeOut' }}
      >
        <CoinSVG side={side} size={size} />
      </motion.div>
    </motion.div>
  );
};

export default CoinFlip;
