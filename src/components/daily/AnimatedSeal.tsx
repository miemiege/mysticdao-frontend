/**
 * AnimatedSeal — 动态朱砂印章
 *
 * 盖印动画：scale从2→1 + opacity从0→1 + rotate随机角度
 * 模拟真实手盖印章的仪式感
 */

import React from 'react';
import { motion } from 'framer-motion';
import { getSealInfo } from '../../lib/theme';

/** 伪随机（基于seed） */
const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

interface AnimatedSealProps {
  score: number;
  seed?: number;
  delay?: number;
}

const AnimatedSeal: React.FC<AnimatedSealProps> = ({ score, seed = 42, delay = 0.9 }) => {
  const info = getSealInfo(score);
  const rng = seededRandom(seed + 999);
  const rotation = (rng() - 0.5) * 14;

  return (
    <motion.div
      initial={{ scale: 2.5, opacity: 0, rotate: rotation + 25 }}
      animate={{ scale: 1, opacity: 1, rotate: rotation }}
      transition={{ delay, type: 'spring', stiffness: 180, damping: 12 }}
      className="inline-flex items-center justify-center relative"
      style={{ width: info.size, height: info.size }}
    >
      {info.shape === 'circle' && (
        <>
          <div
            className="absolute inset-0 rounded-full border-[2.5px]"
            style={{ borderColor: info.color }}
          />
          <div
            className="absolute inset-[5px] rounded-full border"
            style={{ borderColor: info.color, opacity: 0.35 }}
          />
        </>
      )}
      {info.shape === 'square' && (
        <>
          <div
            className="absolute inset-0 border-[2.5px]"
            style={{ borderColor: info.color }}
          />
          <div
            className="absolute inset-[5px] border"
            style={{ borderColor: info.color, opacity: 0.35 }}
          />
        </>
      )}
      {info.shape === 'oval' && (
        <>
          <div
            className="absolute inset-0 rounded-full border-[2.5px]"
            style={{ borderColor: info.color }}
          />
          <div
            className="absolute inset-[5px] rounded-full border"
            style={{ borderColor: info.color, opacity: 0.35 }}
          />
        </>
      )}
      <span
        className="relative text-xs font-bold font-serif tracking-wider z-10"
        style={{ color: info.color }}
      >
        {info.text}
      </span>
      {/* 印章噪点纹理 */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />
    </motion.div>
  );
};

export default AnimatedSeal;
