import React, { useRef, useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import type { CollectedCard } from '@/lib/cardRarity';
import { getRarityColor, getRarityLabel } from '@/lib/cardRarity';
import { GUA64_LIST } from '@/data/gua64';

interface CardShareProps {
  card: CollectedCard;
  goldenQuote: string;
  onClose?: () => void;
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

const CardShare: React.FC<CardShareProps> = ({ card, goldenQuote, onClose }) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const symbol = getHexagramSymbol(card.hexagramName);

  const handleDownload = useCallback(async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: '#000000',
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `mysticdao-card-${card.hexagramName}-${card.rarity}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('卡片已保存');
    } catch (error) {
      toast.error('生成图片失败');
    } finally {
      setIsGenerating(false);
    }
  }, [card]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Hidden poster DOM */}
      <div
        ref={posterRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '320px',
          height: '568px',
          backgroundColor: '#000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 24px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: '10px',
              color: 'rgba(200,164,92,0.5)',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            MysticDao
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '48px',
              color: getRarityColor(card.rarity),
              lineHeight: 1.2,
              marginBottom: '12px',
              textShadow: `0 0 30px ${getRarityColor(card.rarity)}40`,
            }}
          >
            {symbol}
          </div>
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.5), transparent)',
              margin: '0 auto 12px',
            }}
          />
          <h2
            style={{
              fontSize: '24px',
              color: '#c8a45c',
              fontWeight: 700,
              letterSpacing: '4px',
            }}
          >
            {card.hexagramName}
          </h2>
          <div
            style={{
              marginTop: '8px',
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 'bold',
              background: `${getRarityColor(card.rarity)}20`,
              color: getRarityColor(card.rarity),
              border: `1px solid ${getRarityColor(card.rarity)}40`,
            }}
          >
            {getRarityLabel(card.rarity)}
          </div>
          {card.isLimited && (
            <div style={{ marginTop: '6px', fontSize: '10px', color: '#c8a45c' }}>✦ 限定 ✦</div>
          )}
        </div>
        <div style={{ textAlign: 'center', maxWidth: '260px' }}>
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.3), transparent)',
              margin: '0 auto 16px',
            }}
          />
          <p
            style={{
              fontSize: '16px',
              color: '#e8d5a3',
              fontStyle: 'italic',
              lineHeight: 1.5,
            }}
          >
            &ldquo;{goldenQuote}&rdquo;
          </p>
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.3), transparent)',
              margin: '16px auto 0',
            }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: 'rgba(200,164,92,0.4)', letterSpacing: '2px' }}>
            灵枢 MysticDAO · 东方心灵向导
          </p>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleDownload}
        disabled={isGenerating}
        className="flex items-center gap-2 px-6 py-3 rounded-pill font-medium text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
        style={{
          background: 'linear-gradient(135deg, #1a2744 0%, #0d1b2a 100%)',
          color: '#c8a45c',
          border: '1px solid rgba(200,164,92,0.25)',
        }}
      >
        <Download size={16} />
        {isGenerating ? '生成中...' : '下载分享卡片'}
      </motion.button>
      {onClose && (
        <button onClick={onClose} className="text-xs text-text-muted hover:text-text-secondary transition-colors">
          关闭
        </button>
      )}
    </div>
  );
};

export default CardShare;
