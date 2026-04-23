/**
 * JadeCard — 墨玉质感卡片
 *
 * 深色半透明玻璃态 + 金色微光 + 顶部blur光晕
 * 用于包裹结果页各section，统一视觉语言
 */

import React from 'react';
import { motion } from 'framer-motion';

interface JadeCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  glowColor?: string;
}

const JadeCard: React.FC<JadeCardProps> = ({
  children,
  delay = 0,
  className = '',
  glowColor = 'rgba(200, 164, 92, 0.06)',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-2xl overflow-hidden border border-gold/10 ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(12,12,18,0.95) 0%, rgba(6,6,10,0.98) 100%)',
        boxShadow: `0 0 50px ${glowColor}, inset 0 1px 0 rgba(200,164,92,0.06)`,
      }}
    >
      {/* 顶部光晕 */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-20 rounded-full pointer-events-none"
        style={{ background: 'rgba(200,164,92,0.04)', filter: 'blur(40px)' }}
      />
      {/* 边框高光 */}
      <div
        className="absolute top-0 left-4 right-4 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.15), transparent)' }}
      />
      <div className="relative p-6 md:p-8">{children}</div>
    </motion.div>
  );
};

export default JadeCard;
