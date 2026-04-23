import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Globe, Instagram, Twitter, MessageCircle, Share2 } from 'lucide-react';
import { PLATFORM_LIST, type PlatformKey } from '@/lib/share-platforms';

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
  hexagramName, blessingTheme, element, category, seed, score, goldenQuote, onClose
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

        {/* Preview Card */}
        <div className="px-4 pb-4">
          <div
            ref={cardRef}
            className="relative rounded-xl overflow-hidden border border-gold/15"
            style={{
              width: '100%',
              aspectRatio: `${activeConfig.width} / ${activeConfig.height}`,
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1200 50%, #0a0a0a 100%)',
            }}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-20" style={{
              background: `radial-gradient(circle at 30% 20%, ${activeConfig.textColor}20, transparent 50%), radial-gradient(circle at 70% 80%, ${activeConfig.textColor}10, transparent 50%)`
            }} />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold/50 mb-3">Daily I Ching</div>
              <h2 className="text-2xl font-bold text-gold mb-1" style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}>
                {hexagramName}
              </h2>
              <div className="text-xs text-gold/60 mb-4">{blessingTheme} · {category}</div>

              <div className="w-16 h-16 rounded-full border-2 border-gold/30 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-gold">{score}</span>
              </div>

              <div className="text-sm text-text-secondary leading-relaxed max-w-[80%] mb-4">
                {goldenQuote}
              </div>

              <div className="text-[10px] text-gold/40 tracking-wider">MysticDao · {new Date().toLocaleDateString()}</div>
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
