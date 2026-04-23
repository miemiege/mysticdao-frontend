import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpDown, BookOpen } from 'lucide-react';
import type { CollectedCard, Rarity } from '@/lib/cardRarity';
// import { getRarityLabel } from '@/lib/cardRarity';
import { GUA64_LIST } from '@/data/gua64';
import { getCards } from '@/lib/storage';
import CardFlip from './CardFlip';
import CardShare from './CardShare';

type FilterType = 'all' | 'N' | 'R' | 'SR' | 'SSR' | 'limited';
type SortType = 'time' | 'number' | 'rarity';

const rarityOrder: Record<Rarity, number> = { SSR: 4, SR: 3, R: 2, N: 1 };

interface CardAlbumProps {
  onClose: () => void;
}

const CardAlbum: React.FC<CardAlbumProps> = ({ onClose }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('time');
  const [shareCard, setShareCard] = useState<CollectedCard | null>(null);

  const cards = useMemo(() => getCards(), []);

  const filteredAndSorted = useMemo(() => {
    let list = [...cards];
    if (filter !== 'all') {
      if (filter === 'limited') {
        list = list.filter((c) => c.isLimited);
      } else {
        list = list.filter((c) => c.rarity === filter);
      }
    }
    list.sort((a, b) => {
      if (sort === 'time') return new Date(b.obtainedAt).getTime() - new Date(a.obtainedAt).getTime();
      if (sort === 'number') return a.hexagramNumber - b.hexagramNumber;
      if (sort === 'rarity') return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      return 0;
    });
    return list;
  }, [cards, filter, sort]);

  const allHexagrams = GUA64_LIST;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto"
    >
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading flex items-center gap-3">
              <BookOpen className="text-gold" size={28} />
              我的卦卡册
            </h2>
            <p className="text-text-muted text-sm mt-1">已收集 {cards.length}/64</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-border-subtle text-text-secondary hover:text-gold hover:border-gold/30 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* 筛选和排序 */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['all', 'N', 'R', 'SR', 'SSR', 'limited'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  filter === f
                    ? 'bg-gold/15 text-gold border-gold/40'
                    : 'bg-transparent text-text-muted border-border-subtle hover:text-text-secondary'
                }`}
              >
                {f === 'all' ? '全部' : f === 'limited' ? '限定' : f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown size={14} className="text-text-muted" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="bg-transparent text-text-secondary text-xs border border-border-subtle rounded-lg px-2 py-1.5 outline-none focus:border-gold/30"
            >
              <option value="time">按获得时间</option>
              <option value="number">按卦序</option>
              <option value="rarity">按稀有度</option>
            </select>
          </div>
        </div>

        {/* 网格 */}
        {filter === 'all' ? (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
            {allHexagrams.map((gua) => {
              const card = cards.find((c) => c.hexagramNumber === gua.number);
              if (card) {
                return (
                  <div key={gua.number}>
                    <CardFlip card={card} onShare={(c) => setShareCard(c)} />
                  </div>
                );
              }
              return (
                <div
                  key={gua.number}
                  className="aspect-[3/4] rounded-xl border border-border-subtle bg-surface-card/50 flex flex-col items-center justify-center group relative overflow-hidden"
                  title="尚未解锁"
                >
                  <div className="text-2xl text-text-muted/30 mb-2">?</div>
                  <div className="text-[10px] text-text-muted/40">未解锁</div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                    <span className="text-[10px] text-text-secondary">尚未解锁</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
            {filteredAndSorted.map((card) => (
              <div key={card.hexagramNumber}>
                <CardFlip card={card} onShare={(c) => setShareCard(c)} />
              </div>
            ))}
            {filteredAndSorted.length === 0 && (
              <div className="col-span-full text-center py-12 text-text-muted text-sm">
                暂无符合条件的卦卡
              </div>
            )}
          </div>
        )}
      </div>

      {/* 分享弹窗 */}
      <AnimatePresence>
        {shareCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShareCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-card border border-gold/10 rounded-2xl p-6 max-w-sm w-full"
            >
              <CardShare
                card={shareCard}
                goldenQuote={
                  GUA64_LIST.find((g) => g.number === shareCard.hexagramNumber)?.image ||
                  '宇宙之大，人心之微，皆有定数'
                }
                onClose={() => setShareCard(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CardAlbum;
