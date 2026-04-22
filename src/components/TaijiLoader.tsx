import React from 'react';

interface TaijiLoaderProps {
  size?: number;
  className?: string;
}

const TaijiLoader: React.FC<TaijiLoaderProps> = ({ size = 120, className = '' }) => {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Taiji (Yin-Yang) SVG */}
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className="animate-spin-slow"
        style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.15))' }}
      >
        {/* Outer circle */}
        <circle
          cx="60"
          cy="60"
          r="58"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        {/* Yin (dark) half - the left/bottom side */}
        <path
          d="M60 2 A58 58 0 0 1 60 118 A29 29 0 0 1 60 60 A29 29 0 0 0 60 2"
          fill="rgba(255,255,255,0.85)"
        />
        {/* Yang (light) half - the right/top side */}
        <path
          d="M60 2 A58 58 0 0 0 60 118 A29 29 0 0 0 60 60 A29 29 0 0 1 60 2"
          fill="rgba(255,255,255,0.15)"
        />
        {/* Small dot in the white half */}
        <circle cx="60" cy="31" r="8" fill="rgba(255,255,255,0.15)" />
        {/* Small dot in the dark half */}
        <circle cx="60" cy="89" r="8" fill="rgba(255,255,255,0.85)" />
      </svg>
      {/* Glow pulse overlay */}
      <div
        className="absolute inset-0 rounded-full animate-glow-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};

export default React.memo(TaijiLoader);
