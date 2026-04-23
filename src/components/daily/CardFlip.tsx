import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { CollectedCard } from '@/lib/cardRarity';
import { getRarityColor, getRarityBorderColor, getRarityLabel } from '@/lib/cardRarity';
import { GUA64_LIST } from '@/data/gua64';
import { Share2 } from 'lucide-react';

interface CardFlipProps {
  card: CollectedCard;
  onShare?: (card: CollectedCard) => void;
}

const getHexagramSymbol = (name: string): string => {
  const map: Record<string, string> = {
    '乾为天': '☰',
    '坤为地': '☷',
    '水雷屯': '☵☳',
    '山水蒙': '☶☵',
    '水天需': '☵☰',
    '天水讼': '☰☵',
    '地水师': '☷☵',
    '水地比': '☵☷',
  };
  const gua = GUA64_LIST.find((g) => g.name === name);
  return gua?.symbol || map[name] || '☯';
};

const CardFlip: React.FC<CardFlipProps> = ({ card, onShare }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const gua = GUA64_LIST.find((g) => g.number === card.hexagramNumber);
  const symbol = getHexagramSymbol(card.hexagramName);

  const borderStyle = getRarityBorderColor(card.rarity);

  return (
    <div
      className="relative w-full aspect-[3/4] cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 正面 */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            border: '2px solid transparent',
            background: `linear-gradient(#0a0a0f, #0a0a0f) padding-box, ${borderStyle} border-box`,
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div
              className="text-4xl mb-3"
              style={{
                color: getRarityColor(card.rarity),
                textShadow: `0 0 20px ${getRarityColor(card.rarity)}40`,
              }}
            >
              {symbol}
            </div>
            <div className="text-sm font-bold text-white mb-2 tracking-wide">{card.hexagramName}</div>
            <div
              className="px-2 py-0.5 rounded text-[10px] font-bold"
              style={{
                background: `${getRarityColor(card.rarity)}20`,
                color: getRarityColor(card.rarity),
                border: `1px solid ${getRarityColor(card.rarity)}40`,
              }}
            >
              {getRarityLabel(card.rarity)}
            </div>
            {card.isLimited && (
              <div className="mt-2 px-2 py-0.5 rounded-full text-[9px] font-medium bg-gold/10 text-gold border border-gold/20">
                限定
              </div>
            )}
          </div>
        </div>

        {/* 背面 */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, rgba(200,164,92,0.08) 0%, rgba(0,0,0,0.6) 100%)',
            border: '1px solid rgba(200,164,92,0.15)',
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-text-muted mb-2">解读摘要</div>
            <p className="text-xs text-text-secondary leading-relaxed mb-3 line-clamp-4">
              {gua?.meaning || '宇宙之大，人心之微，皆有定数'}
            </p>
            <div className="text-[10px] text-text-muted mb-4">
              获得于 {new Date(card.obtainedAt).toLocaleDateString('zh-CN')}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(card);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-gold border border-gold/30 hover:bg-gold/10 transition-colors"
            >
              <Share2 size={12} /> 分享此卡
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CardFlip;
