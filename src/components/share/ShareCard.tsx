/**
 * ShareCard — 多平台分享卡生成器
 *
 * 基于平台配置动态渲染不同尺寸的分享卡，使用 html2canvas 导出 PNG
 */

import React, { useRef, useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { Download, Copy, X, Instagram, Twitter, MessageCircle, Monitor, Smartphone, Check } from 'lucide-react';
import { toast } from 'sonner';
import { PLATFORMS, type PlatformKey } from '../../lib/share-platforms';
import TalismanSVG from '../talisman/TalismanSVG';
import { getTheme } from '../../lib/theme';

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

const iconMap: Record<string, React.ReactNode> = {
  monitor: <Monitor size={16} />,
  instagram: <Instagram size={16} />,
  smartphone: <Smartphone size={16} />,
  twitter: <Twitter size={16} />,
  'message-circle': <MessageCircle size={16} />,
};

const ShareCard: React.FC<ShareCardProps> = ({
  hexagramName,
  blessingTheme,
  element,
  category,
  seed,
  score,
  goldenQuote,
  onClose,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey>('universal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = getTheme(element);

  const config = PLATFORMS[selectedPlatform];
  const sealText = score >= 90 ? '上上签' : score >= 80 ? '上吉' : score >= 70 ? '中吉' : score >= 60 ? '小吉' : score >= 50 ? '平' : '需谨慎';

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        width: config.width,
        height: config.height,
        scale: 2,
        backgroundColor: '#000000',
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `mysticdao-${hexagramName}-${selectedPlatform}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Downloaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  }, [cardRef, config, hexagramName, selectedPlatform]);

  const handleCopy = useCallback(async () => {
    try {
      const text = `今日卦象：${hexagramName} · ${sealText}\n${goldenQuote}\n\nMysticDAO.app`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Copy failed');
    }
  }, [hexagramName, sealText, goldenQuote]);

  /** 渲染分享卡内容（根据平台布局） */
  const renderCardContent = () => {
    const isLandscape = config.layout === 'landscape';
    const isStory = config.layout === 'story';

    if (isLandscape) {
      // Twitter/X 宽屏布局：左侧符咒 + 右侧文字
      return (
        <div className="flex w-full h-full">
          <div className="flex-shrink-0 flex items-center justify-center" style={{ width: '42%', padding: '40px' }}>
            <TalismanSVG
              hexagramName={hexagramName}
              blessingTheme={blessingTheme}
              element={element}
              category={category}
              seed={seed}
              score={score}
              width={400}
              height={560}
              showSeal
            />
          </div>
          <div className="flex-1 flex flex-col justify-center pr-12">
            <div className="text-gold/40 text-sm tracking-widest mb-4">DAILY I CHING</div>
            <div className="text-white text-5xl font-bold mb-2" style={{ textShadow: `0 0 30px ${theme.glow}` }}>
              {hexagramName}
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold" style={{ color: theme.primary }}>{score}</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider" style={{ background: theme.seal + '20', color: theme.seal, border: `1px solid ${theme.seal}40` }}>
                {sealText}
              </span>
            </div>
            <div className="text-gold/60 text-lg leading-relaxed mb-8 max-w-md">{goldenQuote}</div>
            <div className="text-gold/30 text-xs tracking-wider">MysticDAO.app</div>
          </div>
        </div>
      );
    }

    // 竖版布局（Web / INS Feed / INS Story / 微信 / 通用）
    return (
      <div className="flex flex-col items-center w-full h-full relative">
        {/* 顶部品牌（Story安全区内） */}
        {!isStory && (
          <div className="absolute top-6 left-0 right-0 text-center">
            <span className="text-xs tracking-[0.2em] text-gold/30">MYSTICDAO</span>
          </div>
        )}
        {isStory && (
          <div className="absolute top-8 left-0 right-0 text-center">
            <span className="text-xs tracking-[0.2em] text-gold/40">MYSTICDAO</span>
          </div>
        )}

        {/* 符咒主体 */}
        <div className="flex-1 flex items-center justify-center w-full" style={{ padding: isStory ? '120px 30px 180px' : '60px 30px 40px' }}>
          <TalismanSVG
            hexagramName={hexagramName}
            blessingTheme={blessingTheme}
            element={element}
            category={category}
            seed={seed}
            score={score}
            width={isStory ? 520 : 380}
            height={isStory ? 780 : 570}
            showSeal
          />
        </div>

        {/* 底部信息 */}
        <div className="absolute bottom-0 left-0 right-0 text-center pb-8" style={isStory ? { paddingBottom: '60px' } : {}}>
          <div className="text-white text-xl font-bold mb-1">{hexagramName}</div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-2xl font-bold" style={{ color: theme.primary }}>{score}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider" style={{ background: theme.seal + '20', color: theme.seal, border: `1px solid ${theme.seal}40` }}>
              {sealText}
            </span>
          </div>
          <div className="text-gold/40 text-xs max-w-sm mx-auto px-6 leading-relaxed mb-3">{goldenQuote}</div>
          <div className="text-gold/20 text-[10px] tracking-wider">MysticDAO.app · {new Date().toLocaleDateString()}</div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-[#0a0a0f] border border-gold/10 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gold/10">
          <h3 className="text-sm font-medium text-gold/70 tracking-wider">SHARE YOUR FORTUNE</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gold/10 text-gold/50 hover:text-gold transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧：预览区 */}
          <div className="flex-1 flex items-center justify-center bg-black/40 p-6 overflow-auto">
            <div
              ref={cardRef}
              style={{
                width: config.width,
                height: config.height,
                minWidth: config.width,
                minHeight: config.height,
                background: '#000000',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {renderCardContent()}
            </div>
          </div>

          {/* 右侧：控制面板 */}
          <div className="w-64 border-l border-gold/10 p-4 flex flex-col gap-4">
            {/* 平台选择 */}
            <div>
              <label className="text-[10px] text-gold/40 tracking-widest uppercase mb-2 block">Platform</label>
              <div className="space-y-1.5">
                {Object.entries(PLATFORMS).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlatform(key as PlatformKey)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                      selectedPlatform === key
                        ? 'bg-gold/10 text-gold border border-gold/20'
                        : 'text-gold/50 hover:text-gold/70 hover:bg-gold/5'
                    }`}
                  >
                    <span className="opacity-60">{iconMap[p.icon]}</span>
                    <span>{p.name}</span>
                    <span className="ml-auto text-[9px] opacity-30">{p.ratio}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-auto space-y-2">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium hover:bg-gold/20 transition-all disabled:opacity-50"
              >
                {isGenerating ? <span className="animate-pulse">Generating...</span> : <><Download size={14} /> Download PNG</>}
              </button>
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gold/5 border border-gold/10 text-gold/70 text-xs hover:bg-gold/10 transition-all"
              >
                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Text</>}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareCard;
