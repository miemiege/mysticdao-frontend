/**
 * StepLoading — 加载中状态：太极旋转 + "正在解卦..."文字
 */
import React, { useState, useEffect } from 'react';
import './shared.css';

interface StepLoadingProps {
  loadingMsgIndex?: number;
}

const loadingMessages = [
  'Connecting to the sacred realm...',
  'Calculating your cosmic alignment...',
  'Channeling ancient wisdom...',
];

const StepLoading: React.FC<StepLoadingProps> = ({ loadingMsgIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  // 自动轮播 loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % loadingMessages.length);
        setFadeState('in');
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 响应外部传入的索引
  useEffect(() => {
    if (loadingMsgIndex >= 0 && loadingMsgIndex < loadingMessages.length) {
      setFadeState('out');
      setTimeout(() => {
        setCurrentIndex(loadingMsgIndex);
        setFadeState('in');
      }, 300);
    }
  }, [loadingMsgIndex]);

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
      }}
    >
      {/* ── 光晕背景 ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,164,92,0.1) 0%, transparent 65%)',
          pointerEvents: 'none',
          animation: 'glowPulse 3s ease-in-out infinite',
        }}
      />

      {/* ── 太极 SVG 旋转器 ── */}
      <div
        style={{
          position: 'relative',
          width: '100px',
          height: '100px',
          marginBottom: '36px',
          animation: 'spinLoader 3s linear infinite',
        }}
      >
        {/* 外圈圆环 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(200,164,92,0.2)',
          }}
        />
        {/* 内圈圆环 */}
        <div
          style={{
            position: 'absolute',
            inset: '8px',
            borderRadius: '50%',
            border: '1px solid rgba(200,164,92,0.12)',
          }}
        />
        {/* 太极 SVG */}
        <svg
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            inset: '16px',
            width: '68px',
            height: '68px',
          }}
        >
          <defs>
            <clipPath id="taiji-clip">
              <circle cx="50" cy="50" r="48" />
            </clipPath>
          </defs>
          {/* 白色半（阳） */}
          <path
            d="M50,2 A48,48 0 0,1 50,98 A24,24 0 0,1 50,50 A24,24 0 0,0 50,2 Z"
            fill="#C8A45C"
            opacity="0.9"
          />
          {/* 黑色半（阴） */}
          <path
            d="M50,2 A48,48 0 0,0 50,98 A24,24 0 0,0 50,50 A24,24 0 0,1 50,2 Z"
            fill="#3D3D3D"
            opacity="0.9"
          />
          {/* 阳眼（黑点） */}
          <circle cx="50" cy="26" r="7" fill="#3D3D3D" />
          {/* 阴眼（白/金点） */}
          <circle cx="50" cy="74" r="7" fill="#C8A45C" />
          {/* 外圈描边 */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#C8A45C"
            strokeWidth="1.5"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* ── Loading Message ── */}
      <p
        style={{
          color: '#C8A45C',
          fontSize: '15px',
          fontWeight: 500,
          textAlign: 'center',
          minHeight: '24px',
          letterSpacing: '0.01em',
          opacity: fadeState === 'in' ? 1 : 0,
          transform: fadeState === 'in' ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {loadingMessages[currentIndex]}
      </p>

      {/* ── 小圆点指示器 ── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '20px',
          alignItems: 'center',
        }}
      >
        {loadingMessages.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentIndex ? '20px' : '6px',
              height: '6px',
              borderRadius: i === currentIndex ? '3px' : '50%',
              background: i === currentIndex
                ? 'linear-gradient(90deg, #C8A45C, #E8D5A3)'
                : 'rgba(200,164,92,0.25)',
              transition: 'all 0.4s ease',
              boxShadow: i === currentIndex
                ? '0 0 8px rgba(200,164,92,0.3)'
                : 'none',
            }}
          />
        ))}
      </div>

      {/* ── prefers-reduced-motion 媒体查询样式 ── */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          div[style*="animation: spinLoader"] {
            animation: none !important;
          }
          div[style*="animation: glowPulse"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StepLoading;
