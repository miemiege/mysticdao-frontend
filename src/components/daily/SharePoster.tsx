import React, { useCallback, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SharePosterProps {
  hexagramName: string;
  fortuneScore: number;
  goldenQuote: string;
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
}) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const symbol = getHexagramSymbol(hexagramName);

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
      const canvas = await html2canvas(posterRef.current, {
        scale: 1,
        backgroundColor: '#000000',
        useCORS: true,
        logging: false,
      });

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

      {/* 红线装饰 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <img src="/red-thread-visual.png" alt="" className="h-2 w-48 object-cover opacity-[0.3]" aria-hidden="true" />
      </motion.div>

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
