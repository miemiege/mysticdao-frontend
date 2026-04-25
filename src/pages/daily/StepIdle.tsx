/**
 * StepIdle — 待抽状态：太极符号 + "开始摇卦"按钮
 */
import React from 'react';
import { Sparkles } from 'lucide-react';
import './shared.css';

interface StepIdleProps {
  onDraw: () => void;
  error: string;
}

const StepIdle: React.FC<StepIdleProps> = ({ onDraw, error }) => {
  return (
    <div
      className="step-transition"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '24px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── 背景装饰光晕 ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -55%)',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,164,92,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'glowPulse 4s ease-in-out infinite',
        }}
      />

      {/* ── 太极符号 ── */}
      <div
        style={{
          animation: 'fadeIn 0.8s ease-out forwards',
          marginBottom: '32px',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: '120px',
            lineHeight: 1,
            opacity: 0.08,
            color: '#C8A45C',
            textShadow: '0 0 40px rgba(200,164,92,0.3)',
            userSelect: 'none',
            filter: 'drop-shadow(0 0 8px rgba(200,164,92,0.2))',
          }}
        >
          {'\u262F'}
        </div>
        {/* 外圈装饰环 */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            border: '1px solid rgba(200,164,92,0.1)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── 标题 ── */}
      <h2
        style={{
          animation: 'fadeInUp 0.6s ease-out 0.2s both',
          color: '#C8A45C',
          fontSize: '22px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        MysticDAO Daily
      </h2>

      <p
        style={{
          animation: 'fadeInUp 0.6s ease-out 0.35s both',
          color: '#8B7355',
          fontSize: '14px',
          textAlign: 'center',
          marginBottom: '32px',
          lineHeight: 1.5,
        }}
      >
        Discover your daily guidance through ancient divination
      </p>

      {/* ── 抽卦按钮 ── */}
      <button
        onClick={onDraw}
        style={{
          animation: 'scaleIn 0.5s ease-out 0.5s both',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px 32px',
          borderRadius: '9999px',
          border: 'none',
          background: 'linear-gradient(135deg, #C8A45C 0%, #E8D5A3 50%, #C8A45C 100%)',
          backgroundSize: '200% 100%',
          color: '#0A0A0F',
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '0.02em',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(200,164,92,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          WebkitTapHighlightColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(200,164,92,0.35), inset 0 1px 0 rgba(255,255,255,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,164,92,0.25), inset 0 1px 0 rgba(255,255,255,0.2)';
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = 'scale(0.97)';
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          setTimeout(() => {
            e.currentTarget.style.transform = 'scale(1)';
          }, 150);
        }}
      >
        <Sparkles size={18} style={{ flexShrink: 0 }} />
        Draw Your Fortune
      </button>

      {/* ── 提示文字 ── */}
      <p
        style={{
          animation: 'fadeIn 0.6s ease-out 0.8s both',
          color: 'rgba(139,115,85,0.6)',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '20px',
          letterSpacing: '0.03em',
        }}
      >
        One draw per day {'\u00B7'} Connect with ancient wisdom
      </p>

      {/* ── 错误提示 ── */}
      {error && (
        <p
          style={{
            animation: 'fadeInUp 0.4s ease-out forwards',
            color: '#E05555',
            fontSize: '13px',
            textAlign: 'center',
            marginTop: '16px',
            padding: '8px 16px',
            background: 'rgba(224,85,85,0.08)',
            borderRadius: '8px',
            maxWidth: '100%',
            lineHeight: 1.4,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default StepIdle;
