import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Hash, Navigation } from 'lucide-react';

interface LuckyInfoProps {
  color: string;
  number: string;
  direction: string;
}

const LuckyInfo: React.FC<LuckyInfoProps> = ({ color, number, direction }) => {
  const items = [
    { icon: <Palette size={16} />, label: '幸运色', value: color },
    { icon: <Hash size={16} />, label: '幸运数字', value: number },
    { icon: <Navigation size={16} />, label: '幸运方位', value: direction },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border"
          style={{
            background: 'rgba(251, 191, 36, 0.06)',
            borderColor: 'rgba(251, 191, 36, 0.15)',
          }}
        >
          <span className="text-amber-400">{item.icon}</span>
          <span className="text-xs text-text-muted">{item.label}</span>
          <span className="text-sm font-medium text-amber-300">{item.value}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default LuckyInfo;
