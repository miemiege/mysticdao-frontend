import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Globe, Instagram, Twitter, MessageCircle, Share2 } from 'lucide-react';
import { PLATFORM_LIST, type PlatformKey } from '@/lib/share-platforms';
import { getTalismanImage } from '@/data/talisman-images';

interface ShareCardProps {
  hexagramName: string;
  blessingTheme: string;
  element: string;
  category: string;
  seed: number;
  score: number;
  goldenQuote: string;
  onClose: () => void;
}

const platformIcons: Record<string, React.ReactNode> = {
  globe: <Globe size={18} />,
  camera: <Instagram size={18} />,
  smartphone: <Instagram size={18} />,
  twitter: <Twitter size={18} />,
  'message-circle': <MessageCircle size={18} />,
  'share-2': <Share2 size={18} />,
};

const ShareCard: React.FC<ShareCardProps> = ({
  hexagramName, blessingTheme, category, score, goldenQuote, onClose
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activePlatform, setActivePlatform] = useState<PlatformKey>('web');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      if (!cardRef.current) return;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `mysticdao-${hexagramName}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const activeConfig = PLATFORM_LIST.find(p => p.key === activePlatform) || PLATFORM_LIST[0];
  const talismanBg = getTalismanImage(hexagramName, 'dark');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative bg-black border border-gold/20 rounded-2xl overflow-hidden max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gold/10">
          <h3 className="text-sm font-semibold text-gold/80 tracking-wider">Share Your Fortune</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gold/10 text-gold/60 hover:text-gold transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Platform Selector */}
        <div className="flex gap-2 p-4 overflow-x-auto">
          {PLATFORM_LIST.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePlatform(p.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                activePlatform === p.key
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'bg-gold/5 text-text-muted border border-gold/10 hover:text-gold/70'
              }`}
            >
              {platformIcons[p.icon] || <Share2 size={14} />}
              {p.label}
            </button>
          ))}
        </div>

        {/* Preview Card - 上上签海报风格 */}
        <div className="px-4 pb-4">
          <div
            ref={cardRef}
            className="relative rounded-xl overflow-hidden border-2"
            style={{
              width: '100%',
              aspectRatio: `${activeConfig.width} / ${activeConfig.height}`,
              borderColor: 'rgba(200,164,92,0.3)',
            }}
          >
            {/* AI 符咒背景图 */}
            {talismanBg ? (
              <>
                <img
                  src={talismanBg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  crossOrigin="anonymous"
                  style={{ filter: 'brightness(0.6)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
              </>
            ) : (
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a0800 0%, #1a1200 30%, #0a0800 100%)' }} />
            )}

            {/* 云纹内边框装饰 */}
            <div className="absolute inset-2 border border-gold/10 rounded-lg pointer-events-none" />

            {/* 顶部：卦名大标题 */}
            <div className="absolute top-6 left-0 right-0 text-center z-10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold/40 mb-1">Daily I Ching</div>
              <h2 className="text-3xl font-bold text-gold" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", textShadow: '0 0 20px rgba(200,164,92,0.5)' }}>
                {hexagramName}
              </h2>
              <div className="text-xs text-gold/60 mt-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{blessingTheme} · {category}</div>
            </div>

            {/* 中间：分数大数字 + 印章 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <div className="text-5xl font-bold text-gold" style={{ textShadow: '0 0 30px rgba(200,164,92,0.6)' }}>
                {score}
              </div>
              <div className="text-[10px] text-gold/40 tracking-wider mt-1">FORTUNE SCORE</div>
              <img src="./seal-stamp.png" alt="" className="w-10 h-10 mx-auto mt-2 opacity-80" loading="lazy" decoding="async" />
            </div>

            {/* 底部：金色语录 + 日期 */}
            <div className="absolute bottom-6 left-0 right-0 text-center px-6 z-10">
              <div className="text-sm text-white/80 leading-relaxed italic" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                {goldenQuote}
              </div>
              <div className="text-[10px] text-gold/40 tracking-wider mt-3" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>MysticDao · {new Date().toLocaleDateString()}</div>
            </div>

            {/* 二维码区域占位 */}
            <div className="absolute bottom-2 right-3 w-8 h-8 border border-gold/20 rounded flex items-center justify-center z-10">
              <span className="text-[6px] text-gold/30">QR</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gold/10 border border-gold/20 text-sm text-gold hover:bg-gold/20 transition-all disabled:opacity-50"
          >
            <Download size={16} />
            {downloading ? 'Exporting...' : 'Download'}
          </button>
          <button
            onClick={() => {
              const text = `My daily I Ching: ${hexagramName} · Score: ${score}/100 · ${goldenQuote}`;
              navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard'));
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-gold/15 text-sm text-text-secondary hover:text-gold hover:border-gold/30 transition-all"
          >
            <Share2 size={16} />
            Copy Text
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareCard;
