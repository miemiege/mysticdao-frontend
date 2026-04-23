import React from 'react';
import { motion } from 'framer-motion';

interface FortuneCardProps {
  name: string;
  keyword: string;
  aspect: string;
  color: string;
  index?: number;
}

const getHexagramSymbol = (name: string): string => {
  const map: Record<string, string> = {
    '乾为天': '☰', '坤为地': '☷', '水雷屯': '☵☳', '山水蒙': '☶☵',
    '水天需': '☵☰', '天水讼': '☰☵', '地水师': '☷☵', '水地比': '☵☷',
  };
  return map[name] || '☯';
};

const FortuneCard: React.FC<FortuneCardProps> = ({ name, keyword, aspect, color, index = 0 }) => {
  const symbol = getHexagramSymbol(name);

  const particles = React.useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      const distance = 40 + Math.random() * 40;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const delay = Math.random() * 0.2;
      return { tx, ty, delay, key: i };
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl border text-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(200,164,92,0.05) 0%, rgba(0,0,0,0.4) 50%, rgba(200,164,92,0.03) 100%)',
        borderColor: `${color}30`,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 0 40px ${color}10, inset 0 1px 0 ${color}15`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${color}60 30%, ${color} 50%, ${color}60 70%, transparent 100%)` }}
      />
      <div className="absolute top-2 right-3 text-6xl font-heading opacity-[0.04] pointer-events-none select-none" style={{ color }}>{symbol}</div>
      <div className="relative p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + index * 0.15, duration: 0.5, type: 'spring' }}
          className="mb-4"
        >
          <span className="text-5xl font-heading block" style={{ color: `${color}90`, textShadow: `0 0 20px ${color}30`, filter: `drop-shadow(0 0 8px ${color}40)` }}>{symbol}</span>
        </motion.div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase mb-4" style={{ background: `${color}12`, color: `${color}cc`, border: `1px solid ${color}20` }}>
          <span className="w-1 h-1 rounded-full" style={{ background: color }} />{aspect}
        </div>
        <motion.h4 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.15, duration: 0.5 }} className="text-3xl font-bold text-white mb-3 tracking-tight relative" style={{ textShadow: `0 0 30px ${color}20` }}>
          {name}
          <div className="particle-burst" aria-hidden="true">
            {particles.map((p) => (
              <div
                key={p.key}
                className="particle"
                style={{
                  left: '50%',
                  top: '50%',
                  '--tx': `${p.tx}px`,
                  '--ty': `${p.ty}px`,
                  animationDelay: `${0.4 + index * 0.15 + p.delay}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        </motion.h4>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + index * 0.15 }} className="inline-block px-4 py-1.5 rounded-full text-sm font-medium" style={{ background: `${color}10`, color, border: `1px solid ${color}25`, boxShadow: `0 0 12px ${color}10` }}>{keyword}</motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}30 50%, transparent 100%)` }} />
      <div className="absolute top-3 left-3 w-2 h-2 border-t border-l rounded-tl" style={{ borderColor: `${color}40` }} />
      <div className="absolute top-3 right-3 w-2 h-2 border-t border-r rounded-tr" style={{ borderColor: `${color}40` }} />
      <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l rounded-bl" style={{ borderColor: `${color}40` }} />
      <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r rounded-br" style={{ borderColor: `${color}40` }} />
    </motion.div>
  );
};

export default FortuneCard;
