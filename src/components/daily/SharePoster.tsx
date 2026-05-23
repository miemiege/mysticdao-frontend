import React, { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SharePosterProps {
  hexagramName: string;
  fortuneScore: number;
  goldenQuote: string;
  variant?: 'classic' | 'talisman';
}

const getHexagramSymbol = (name: string): string => {
  const map: Record<string, string> = {
    '乾为天': '☰', '坤为地': '☷', '水雷屯': '☵☳', '山水蒙': '☶☵',
    '水天需': '☵☰', '天水讼': '☰☵', '地水师': '☷☵', '水地比': '☵☷',
  };
  return map[name] || '☯';
};

const SharePoster: React.FC<SharePosterProps> = ({
  hexagramName,
  fortuneScore,
  goldenQuote,
  variant = 'classic',
}) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const symbol = getHexagramSymbol(hexagramName);

  const getSealText = (score: number): string => {
    if (score >= 90) return '上上签';
    if (score >= 80) return '上吉';
    if (score >= 70) return '中吉';
    if (score >= 60) return '小吉';
    if (score >= 50) return '平';
    return '需谨慎';
  };

  const sealText = getSealText(fortuneScore);

  const formatDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const handleDownload = useCallback(async () => {
    if (!posterRef.current) return;

    setIsGenerating(true);

    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(posterRef.current, {
        scale: 1,
        backgroundColor: '#000000',
        useCORS: true,
        logging: false,
      });

      // AI 生成内容合规水印
      const { drawWatermark: drawWM } = await import('@/lib/watermark');
      drawWM(canvas);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `mysticdao-fortune-${hexagramName}-${formatDate()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Poster downloaded successfully');
    } catch (error) {
      console.error('Failed to generate poster:', error);
      toast.error('Failed to generate poster, please try again');
    } finally {
      setIsGenerating(false);
    }
  }, [hexagramName]);

  const handleCopyText = useCallback(async () => {
    const text = `Today's I Ching: ${hexagramName} · Fortune Score: ${fortuneScore}/100\n'${goldenQuote}'\nWhat's your fortune today? → https://mysticdao.com`;

    try {
      await navigator.clipboard.writeText(text);
      toast.success('Text copied to clipboard');
    } catch (error) {
      console.error('Failed to copy text:', error);
      toast.error('Failed to copy text');
    }
  }, [hexagramName, fortuneScore, goldenQuote]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Hidden poster DOM for html2canvas capture */}
      {variant === 'talisman' ? (
        <div
          ref={posterRef}
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1080px',
            height: '1920px',
            backgroundColor: '#0A0A0F',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '100px 120px',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {/* Subtle texture overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c8a45c\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', pointerEvents: 'none' }} />

          {/* Outer gold border */}
          <div style={{ position: 'absolute', inset: '40px', border: '1px solid rgba(200,164,92,0.2)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: '48px', border: '1px solid rgba(200,164,92,0.1)', pointerEvents: 'none' }} />

          {/* Corner decorations */}
          <div style={{ position: 'absolute', top: '56px', left: '56px', width: '24px', height: '24px', borderTop: '2px solid rgba(200,164,92,0.4)', borderLeft: '2px solid rgba(200,164,92,0.4)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '56px', right: '56px', width: '24px', height: '24px', borderTop: '2px solid rgba(200,164,92,0.4)', borderRight: '2px solid rgba(200,164,92,0.4)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '56px', left: '56px', width: '24px', height: '24px', borderBottom: '2px solid rgba(200,164,92,0.4)', borderLeft: '2px solid rgba(200,164,92,0.4)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '56px', right: '56px', width: '24px', height: '24px', borderBottom: '2px solid rgba(200,164,92,0.4)', borderRight: '2px solid rgba(200,164,92,0.4)', pointerEvents: 'none' }} />

          {/* Top: Brand */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '14px', color: 'rgba(200,164,92,0.5)', letterSpacing: '8px', fontFamily: '"Playfair Display", Georgia, serif', textTransform: 'uppercase' }}>MysticDao</p>
            <div style={{ width: '120px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.3), transparent)', margin: '16px auto 0' }} />
          </div>

          {/* Center: Hexagram */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, marginTop: '-60px' }}>
            <div style={{ fontSize: '72px', color: 'rgba(200,164,92,0.8)', fontFamily: '"Playfair Display", Georgia, serif', lineHeight: 1.2, marginBottom: '24px', textShadow: '0 0 40px rgba(200,164,92,0.2)' }}>{symbol}</div>
            <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, transparent, #c8a45c, transparent)', margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '48px', color: '#c8a45c', fontFamily: '"Noto Sans SC", serif', fontWeight: 700, letterSpacing: '8px' }}>{hexagramName}</h2>
          </div>

          {/* Seal + Score */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, marginTop: '-40px' }}>
            {/* Red Seal */}
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '140px', height: '140px', border: '3px solid #8B0000', background: 'rgba(139,0,0,0.08)', marginBottom: '40px' }}>
              <span style={{ fontSize: '36px', color: '#8B0000', fontFamily: '"Noto Sans SC", serif', fontWeight: 700, letterSpacing: '4px' }}>{sealText}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' }}>
              <span style={{ fontSize: '96px', color: '#c8a45c', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, lineHeight: 1, textShadow: '0 0 30px rgba(200,164,92,0.3)' }}>{fortuneScore}</span>
              <span style={{ fontSize: '28px', color: 'rgba(200,164,92,0.4)', fontFamily: '"Playfair Display", Georgia, serif' }}>/100</span>
            </div>
          </div>

          {/* Quote */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '720px', marginTop: '-30px' }}>
            <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.3), transparent)', margin: '0 auto 32px' }} />
            <p style={{ fontSize: '40px', color: '#e8d5a3', fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', lineHeight: 1.6, letterSpacing: '1px' }}>&ldquo;{goldenQuote}&rdquo;</p>
            <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.3), transparent)', margin: '32px auto 0' }} />
          </div>

          {/* Bottom */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '14px', color: 'rgba(200,164,92,0.4)', letterSpacing: '4px', fontFamily: '"Playfair Display", Georgia, serif' }}>Ancient Wisdom · Modern Guidance</p>
          </div>
        </div>
      ) : (
        <div
          ref={posterRef}
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1080px',
            height: '1920px',
            backgroundColor: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '80px 100px',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {/* Subtle radial glow background */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '800px',
              height: '800px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,164,92,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top: Brand */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(200,164,92,0.6)',
                letterSpacing: '6px',
                fontFamily: '"Playfair Display", Georgia, serif',
                textTransform: 'uppercase',
              }}
            >
              MysticDao · Daily Fortune
            </p>
          </div>

          {/* Upper-middle: Hexagram Symbol + Name */}
          <div
            style={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              marginTop: '-40px',
            }}
          >
            <div
              style={{
                fontSize: '80px',
                color: '#c8a45c',
                fontFamily: '"Playfair Display", Georgia, serif',
                lineHeight: 1.2,
                marginBottom: '16px',
                textShadow: '0 0 40px rgba(200,164,92,0.3)',
              }}
            >
              {symbol}
            </div>
            <div
              style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.5), transparent)',
                margin: '0 auto 20px',
              }}
            />
            <h2
              style={{
                fontSize: '36px',
                color: '#c8a45c',
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: 700,
                letterSpacing: '4px',
              }}
            >
              {hexagramName}
            </h2>
          </div>

          {/* Middle: Fortune Score */}
          <div
            style={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              marginTop: '-20px',
            }}
          >
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(200,164,92,0.5)',
                letterSpacing: '8px',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              Fortune Score
            </p>
            <div
              style={{
                width: '120px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.4), transparent)',
                margin: '0 auto 24px',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
              <span
                style={{
                  fontSize: '120px',
                  color: '#c8a45c',
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  lineHeight: 1,
                  textShadow: '0 0 40px rgba(200,164,92,0.4)',
                }}
              >
                {fortuneScore}
              </span>
              <span
                style={{
                  fontSize: '32px',
                  color: 'rgba(200,164,92,0.4)',
                  fontFamily: '"Playfair Display", Georgia, serif',
                }}
              >
                /100
              </span>
            </div>
          </div>

          {/* Lower-middle: Golden Quote */}
          <div
            style={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              maxWidth: '800px',
              marginTop: '-10px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.3), transparent)',
                margin: '0 auto 32px',
              }}
            />
            <p
              style={{
                fontSize: '56px',
                color: '#e8d5a3',
                fontFamily: '"Playfair Display", Georgia, serif',
                fontStyle: 'italic',
                lineHeight: 1.5,
                letterSpacing: '2px',
              }}
            >
              &ldquo;{goldenQuote}&rdquo;
            </p>
            <div
              style={{
                width: '80px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.3), transparent)',
                margin: '32px auto 0',
              }}
            />
          </div>

          {/* Bottom: Brand Slogan */}
          <div
            style={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: '200px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.2), transparent)',
                margin: '0 auto 32px',
              }}
            />
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(200,164,92,0.5)',
                letterSpacing: '4px',
                fontFamily: '"Playfair Display", Georgia, serif',
                marginBottom: '16px',
              }}
            >
              Ancient Wisdom · Modern Guidance
            </p>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(200,164,92,0.3)',
                letterSpacing: '2px',
              }}
            >
              Scan for your fortune
            </p>
          </div>
        </div>
      )}

      {/* Visible UI Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4"
      >
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center gap-2.5 px-6 py-3 rounded-pill font-medium text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: 'linear-gradient(135deg, #1a2744 0%, #0d1b2a 100%)',
            color: '#c8a45c',
            border: '1px solid rgba(200,164,92,0.25)',
            boxShadow: '0 0 20px rgba(200,164,92,0.1), inset 0 1px 0 rgba(200,164,92,0.08)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(200,164,92,0.2), inset 0 1px 0 rgba(200,164,92,0.12)';
            e.currentTarget.style.borderColor = 'rgba(200,164,92,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(200,164,92,0.1), inset 0 1px 0 rgba(200,164,92,0.08)';
            e.currentTarget.style.borderColor = 'rgba(200,164,92,0.25)';
          }}
        >
          <Download size={16} />
          {isGenerating ? 'Generating...' : 'Download Poster'}
        </button>

        <button
          onClick={handleCopyText}
          className="flex items-center gap-2.5 px-6 py-3 rounded-pill font-medium text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'transparent',
            color: '#c8a45c',
            border: '1px solid rgba(200,164,92,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(200,164,92,0.08)';
            e.currentTarget.style.borderColor = 'rgba(200,164,92,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(200,164,92,0.3)';
          }}
        >
          <Copy size={16} />
          Copy Text
        </button>
      </motion.div>
    </div>
  );
};

export default SharePoster;
