import React from 'react';
import { motion } from 'framer-motion';

interface FortuneCardProps {
  name: string;
  keyword: string;
  aspect: string;
  color: string;
  index?: number;
}

const FortuneCard: React.FC<FortuneCardProps> = ({ name, keyword, aspect, color, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative rounded-xl border p-6 text-center"
      style={{
        background: `${color}08`,
        borderColor: `${color}20`,
        perspective: 1000,
      }}
    >
      <div
        className="text-xs font-medium mb-3 tracking-widest uppercase"
        style={{ color: `${color}99` }}
      >
        {aspect}
      </div>
      <h4 className="text-2xl font-bold text-text-primary mb-2">{name}</h4>
      <div
        className="inline-block px-3 py-1 rounded-full text-xs"
        style={{
          background: `${color}15`,
          color,
          border: `1px solid ${color}25`,
        }}
      >
        {keyword}
      </div>
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: `0 0 30px ${color}10`,
        }}
      />
    </motion.div>
  );
};

export default FortuneCard;
