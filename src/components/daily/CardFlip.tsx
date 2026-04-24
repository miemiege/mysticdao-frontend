import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Rarity, RarityInfo } from '@/lib/cardRarity';

interface CardFlipProps {
  front: React.ReactNode;
  backImage?: string;
  rarity: Rarity;
  rarityInfo: RarityInfo;
  onClick?: () => void;
}

const CardFlip: React.FC<CardFlipProps> = ({ front, backImage = '/tarot-card-back.png', rarity: _rarity, rarityInfo, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="group cursor-pointer" style={{ perspective: '1000px' }} onClick={() => { setIsFlipped(!isFlipped); onClick?.(); }}>
      <motion.div
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 正面 */}
        <div className="relative rounded-2xl overflow-hidden border-2" style={{ borderColor: rarityInfo.color + '40', backfaceVisibility: 'hidden' }}>
          {front}
        </div>

        {/* 背面 */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden border-2" style={{ borderColor: rarityInfo.color + '40', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <img src={backImage} alt="" className="w-full h-full object-cover" />
          {/* 叠加 bagua-geometry.png 纹理（加分项P1） */}
          <img src="/bagua-geometry.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gold/60 text-sm tracking-wider">Tap to Reveal</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CardFlip;
