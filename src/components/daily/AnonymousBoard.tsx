import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { GUA64_LIST } from '@/data/gua64';

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function getDateSeed(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

function generateAvatarColor(hexagramNumber: number, seed: number): string {
  const colors = [
    '#c8a45c',
    '#4ADE80',
    '#F87171',
    '#60A5FA',
    '#FBBF24',
    '#E5E7EB',
    '#FB923C',
    '#A78BFA',
    '#34D399',
    '#F472B6',
  ];
  const rand = seededRandom(seed + hexagramNumber * 997);
  return colors[Math.floor(rand() * colors.length)];
}

function generateAvatarPattern(hexagramNumber: number, seed: number): string {
  const rand = seededRandom(seed + hexagramNumber * 331);
  const patterns = ['◆', '●', '▲', '■', '★', '✦', '✹', '✻'];
  return patterns[Math.floor(rand() * patterns.length)];
}

interface AnonymousBoardProps {
  myHexagramNumber?: number;
}

const AnonymousBoard: React.FC<AnonymousBoardProps> = ({ myHexagramNumber }) => {
  const today = useMemo(() => new Date(), []);
  const seed = getDateSeed(today);

  const communityData = useMemo(() => {
    const rand = seededRandom(seed + 42);
    const count = 6 + Math.floor(rand() * 3);
    const data = [];
    const used = new Set<number>();
    for (let i = 0; i < count; i++) {
      let num = Math.floor(rand() * 64) + 1;
      let attempts = 0;
      while (used.has(num) && attempts < 10) {
        num = Math.floor(rand() * 64) + 1;
        attempts++;
      }
      used.add(num);
      const gua = GUA64_LIST.find((g) => g.number === num);
      data.push({
        id: i,
        hexagramNumber: num,
        hexagramName: gua?.name || '未知',
        keyword: gua?.keywords?.[0] || '修行',
        color: generateAvatarColor(num, seed),
        pattern: generateAvatarPattern(num, seed),
      });
    }
    return data;
  }, [seed]);

  const sameCount = useMemo(() => {
    if (!myHexagramNumber) return 0;
    const rand = seededRandom(seed + myHexagramNumber * 7);
    return 10 + Math.floor(rand() * 491);
  }, [seed, myHexagramNumber]);

  useMemo(() => {
    try {
      const key = `mysticdao_community_${seed}`;
      const raw = localStorage.getItem(key);
      if (!raw) {
        localStorage.setItem(
          key,
          JSON.stringify({
            communityData,
            sameCount,
            date: today.toISOString().split('T')[0],
          })
        );
      }
    } catch {
      // ignore
    }
  }, [communityData, sameCount, seed, today]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Users size={16} className="text-gold" />
        <h3 className="text-sm font-semibold text-gold/80 tracking-wider uppercase">今日灵签榜</h3>
      </div>

      {myHexagramNumber && sameCount > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-gold/10 text-gold border border-gold/20">
            今日有 {sameCount} 人和你同卦
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {communityData.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-border-subtle bg-surface-card/40"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: `${item.color}15`,
                color: item.color,
                border: `1px solid ${item.color}30`,
              }}
            >
              {item.pattern}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-text-secondary truncate">{item.hexagramName}</div>
              <div className="text-[10px] text-text-muted truncate">{item.keyword}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnonymousBoard;
