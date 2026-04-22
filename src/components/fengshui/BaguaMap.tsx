import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { directionData } from './fengshuiData';

const BaguaMap = memo(function BaguaMap() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const cells = [
    { key: 'northwest', dir: 'NW', label: 'Helpful People', pos: 'col-start-1 row-start-1' },
    { key: 'north', dir: 'N', label: 'Career', pos: 'col-start-2 row-start-1' },
    { key: 'northeast', dir: 'NE', label: 'Knowledge', pos: 'col-start-3 row-start-1' },
    { key: 'west', dir: 'W', label: 'Children', pos: 'col-start-1 row-start-2' },
    { key: 'center', dir: '', label: 'Taiji', pos: 'col-start-2 row-start-2' },
    { key: 'east', dir: 'E', label: 'Family', pos: 'col-start-3 row-start-2' },
    { key: 'southwest', dir: 'SW', label: 'Love', pos: 'col-start-1 row-start-3' },
    { key: 'south', dir: 'S', label: 'Fame', pos: 'col-start-2 row-start-3' },
    { key: 'southeast', dir: 'SE', label: 'Wealth', pos: 'col-start-3 row-start-3' },
  ];

  const cellVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.06,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <div className="grid grid-cols-3 gap-1 max-w-[600px] mx-auto">
      {cells.map((cell, i) => {
        const isCenter = cell.key === 'center';
        const info = directionData[cell.key];
        const isHovered = hoveredCell === cell.key;

        if (isCenter) {
          return (
            <motion.div
              key={cell.key}
              custom={i}
              variants={cellVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg-elevated aspect-square flex flex-col items-center justify-center border border-[#c8a45c]/10 rounded-sm relative overflow-hidden"
              onMouseEnter={() => setHoveredCell(cell.key)}
              onMouseLeave={() => setHoveredCell(null)}
            >
              {/* Yin-yang symbol */}
              <motion.div
                initial={{ scale: 0.5, rotate: 180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  ease: [0.68, -0.3, 0.32, 1.3] as [number, number, number, number],
                }}
                className="w-12 h-12 relative"
              >
                <svg viewBox="0 0 48 48" className="w-full h-full animate-yin-yang">
                  <circle cx="24" cy="24" r="22" stroke="#c8a45c" strokeWidth={1.5} fill="none" />
                  <path
                    d="M24 2a22 22 0 0 1 0 44 11 11 0 0 1 0-22 11 11 0 0 0 0-22z"
                    fill="#c8a45c"
                    fillOpacity={0.8}
                  />
                  <circle cx="24" cy="13" r="3.5" fill="#1a1a24" />
                  <circle cx="24" cy="35" r="3.5" fill="#c8a45c" />
                </svg>
              </motion.div>
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#c8a45c]/70 mt-2">
                TAIJI
              </span>
              <span className="font-chinese text-xs text-[#c8a45c]/70/60 mt-0.5">太极</span>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={cell.key}
            custom={i}
            variants={cellVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`aspect-square p-3 md:p-4 border rounded-sm cursor-pointer transition-all duration-300 relative overflow-hidden ${
              isHovered
                ? 'bg-[#c8a45c]/5 border-[#c8a45c]/30'
                : 'bg-bg-card border-[#c8a45c]/10'
            }`}
            onMouseEnter={() => setHoveredCell(cell.key)}
            onMouseLeave={() => setHoveredCell(null)}
          >
            {/* Direction label */}
            <div className="flex items-center justify-between mb-1">
              <span className="font-sans text-[10px] uppercase text-text-muted tracking-wider">
                {cell.dir}
              </span>
              {info && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: info.color }}
                />
              )}
            </div>

            {/* Life aspect */}
            <p className="font-sans text-xs md:text-sm font-medium text-text-primary leading-tight">
              {cell.label}
            </p>

            {/* Element info */}
            {info && (
              <div className="mt-1.5">
                <span className="font-sans text-[10px] md:text-xs" style={{ color: info.color }}>
                  {info.element}
                </span>
              </div>
            )}

            {/* Chinese trigram */}
            {info && (
              <span className="absolute bottom-2 right-3 font-chinese text-sm text-[#c8a45c]/70/40">
                {info.trigramChar}
              </span>
            )}

            {/* Hover tooltip */}
            {isHovered && info && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-bg-elevated/98 backdrop-blur-sm p-3 flex flex-col justify-center items-center text-center z-10"
              >
                <p className="font-sans text-sm text-[#e8d5a3] mb-1">
                  {info.meaning}
                </p>
                <p className="font-sans text-[10px] text-text-secondary leading-relaxed line-clamp-3">
                  {info.advice}
                </p>
                <div className="flex gap-1 mt-1.5">
                  {info.colors.slice(0, 2).map((c) => (
                    <span key={c} className="text-[9px] text-text-muted">{c}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
});

export default BaguaMap;
