import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { getFavorites, removeFavorite } from '@/lib/storage';
import { getRarity, getRarityInfo } from '@/lib/cardRarity';
import CardFlip from './CardFlip';
import TalismanSVG from '@/components/talisman/TalismanSVG';
import type { FavoriteItem } from '@/lib/storage';
import type { Rarity } from '@/lib/cardRarity';

type FilterRarity = 'all' | Rarity;

// Helper to safely access fortune data from FavoriteItem
type DailyFortuneData = {
  fortune?: {
    overallScore?: number;
    card?: {
      name?: string;
      keyword?: string;
      number?: number;
    };
  };
};

function getFortuneFromFavorite(fav: FavoriteItem): DailyFortuneData['fortune'] | undefined {
  if (fav.type !== 'daily') return undefined;
  const data = fav.data as DailyFortuneData | undefined;
  return data?.fortune;
}

const CardAlbum: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(getFavorites);
  const [filter, setFilter] = useState<FilterRarity>('all');

  const filtered = favorites.filter(f => {
    if (filter === 'all') return true;
    const fortune = getFortuneFromFavorite(f);
    const score = fortune?.overallScore || 50;
    const hexNum = fortune?.card?.number || 1;
    const rarity = getRarity(score, hexNum);
    return rarity === filter;
  });

  const handleRemove = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavorites());
  };

  const filterOptions: { value: FilterRarity; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'common', label: getRarityInfo('common').label },
    { value: 'rare', label: getRarityInfo('rare').label },
    { value: 'epic', label: getRarityInfo('epic').label },
    { value: 'legendary', label: getRarityInfo('legendary').label },
    { value: 'mythic', label: getRarityInfo('mythic').label },
  ];

  return (
    <div>
      {/* 筛选栏 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs tracking-wider transition-all ${
              filter === opt.value
                ? 'bg-gold/15 text-gold border border-gold/30'
                : 'bg-gold/5 text-text-muted border border-gold/10 hover:text-gold/70'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 卡片网格 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-20">☯</div>
          <p className="text-text-muted text-sm mb-4">还没有收藏的卦象，去抽一张吧</p>
          <a
            href="/#/daily"
            className="inline-flex items-center px-5 py-2 rounded-full border border-gold/20 text-gold text-xs hover:bg-gold/10 transition-all"
          >
            去抽卦 →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((fav, i) => {
              const fortune = getFortuneFromFavorite(fav);
              const score = fortune?.overallScore || 50;
              const hexNum = fortune?.card?.number || 1;
              const rarity = getRarity(score, hexNum);
              const rarityInfo = getRarityInfo(rarity);
              const cardName = fortune?.card?.name || fav.title || '未知';
              const keyword = fortune?.card?.keyword || '';

              return (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CardFlip
                    rarity={rarity}
                    rarityInfo={rarityInfo}
                    front={(
                      <div className="relative bg-black p-4">
                        {/* 符咒缩略图 */}
                        <div className="flex justify-center mb-3">
                          <TalismanSVG
                            hexagramName={cardName}
                            blessingTheme={keyword}
                            element="金"
                            category=""
                            seed={hexNum}
                            score={score}
                            width={120}
                            height={180}
                            showSeal={false}
                          />
                        </div>
                        {/* 卦名 */}
                        <div className="text-center">
                          <h3
                            className="text-gold font-bold text-lg"
                            style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}
                          >
                            {cardName}
                          </h3>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="text-2xl font-bold text-gold">{score}</span>
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px]"
                              style={{
                                background: rarityInfo.color + '20',
                                color: rarityInfo.color,
                                border: `1px solid ${rarityInfo.color}40`,
                              }}
                            >
                              {rarityInfo.label}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-muted mt-1">
                            {new Date(fav.date).toLocaleDateString()}
                          </p>
                        </div>
                        {/* 删除按钮 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(fav.id);
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CardAlbum;
