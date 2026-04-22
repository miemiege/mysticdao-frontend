import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCharElementColor, getCharGlowColor, STEM_MEANINGS, BRANCH_MEANINGS } from './data';
import type { PillarData } from './calendar';

interface PillarColumnProps {
  label: string;
  pillar: PillarData;
  index: number;
}

export default function PillarColumn({ label, pillar, index }: PillarColumnProps) {
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);

  const stemColor = getCharElementColor(pillar.stem);
  const stemGlow = getCharGlowColor(pillar.stem);
  const branchColor = getCharElementColor(pillar.branch);
  const branchGlow = getCharGlowColor(pillar.branch);

  // Hidden stems joined
  const hiddenStemsText = pillar.hiddenStems.join('');

  const handleMouseEnter = useCallback((char: string) => {
    setHoveredChar(char);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredChar(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      className="flex flex-col items-center gap-4"
    >
      {/* Header label */}
      <div className="text-xs tracking-[0.1em] text-text-secondary font-mono uppercase">
        {label}
      </div>

      {/* Heavenly Stem (天干) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + index * 0.15, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        className="relative"
      >
        <span
          className="text-[28px] sm:text-[32px] font-semibold font-mono cursor-default transition-all duration-200"
          style={{
            color: stemColor,
            textShadow: hoveredChar === 'stem' ? `0 0 12px ${stemGlow}` : 'none',
            transform: hoveredChar === 'stem' ? 'scale(1.1)' : 'scale(1)',
            display: 'inline-block',
          }}
          onMouseEnter={() => handleMouseEnter('stem')}
          onMouseLeave={handleMouseLeave}
        >
          {pillar.stem}
        </span>
        <AnimatePresence>
          {hoveredChar === 'stem' && STEM_MEANINGS[pillar.stem] && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 w-48 px-3 py-2 rounded-lg text-[11px] leading-relaxed text-text-secondary bg-bg-elevated border border-border-subtle shadow-lg pointer-events-none"
            >
              {STEM_MEANINGS[pillar.stem]}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Divider */}
      <div className="w-8 h-px bg-[rgba(255,255,255,0.08)]" />

      {/* Earthly Branch (地支) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 + index * 0.15, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        className="relative"
      >
        <span
          className="text-[28px] sm:text-[32px] font-semibold font-mono cursor-default transition-all duration-200"
          style={{
            color: branchColor,
            textShadow: hoveredChar === 'branch' ? `0 0 12px ${branchGlow}` : 'none',
            transform: hoveredChar === 'branch' ? 'scale(1.1)' : 'scale(1)',
            display: 'inline-block',
          }}
          onMouseEnter={() => handleMouseEnter('branch')}
          onMouseLeave={handleMouseLeave}
        >
          {pillar.branch}
        </span>
        <AnimatePresence>
          {hoveredChar === 'branch' && BRANCH_MEANINGS[pillar.branch] && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 w-48 px-3 py-2 rounded-lg text-[11px] leading-relaxed text-text-secondary bg-bg-elevated border border-border-subtle shadow-lg pointer-events-none"
            >
              {BRANCH_MEANINGS[pillar.branch]}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hidden Stems (藏干) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 + index * 0.15, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        className="flex items-center gap-0.5 min-h-[20px]"
      >
        {hiddenStemsText ? (
          <div className="flex gap-0.5">
            {pillar.hiddenStems.map((stem, i) => (
              <span
                key={`${stem}-${i}`}
                className="text-[11px] font-mono cursor-default transition-all duration-200"
                style={{
                  color: getCharElementColor(stem),
                  opacity: 0.7,
                  textShadow: hoveredChar === `hidden-${i}` ? `0 0 8px ${getCharGlowColor(stem)}` : 'none',
                  transform: hoveredChar === `hidden-${i}` ? 'scale(1.15)' : 'scale(1)',
                  display: 'inline-block',
                }}
                onMouseEnter={() => handleMouseEnter(`hidden-${i}`)}
                onMouseLeave={handleMouseLeave}
              >
                {stem}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[11px] font-mono text-text-muted">-</span>
        )}
      </motion.div>
    </motion.div>
  );
}
