import React from 'react';

interface BaguaLoaderProps {
  size?: number;
  className?: string;
}

const BaguaLoader: React.FC<BaguaLoaderProps> = ({ size = 160, className = '' }) => {
  // Bagua trigram names and their corresponding line patterns (from bottom to top)
  // Each trigram has 3 lines: broken (yin) or solid (yang)
  const trigrams = [
    { name: '乾', lines: [1, 1, 1], angle: 0 },     // Heaven ☰
    { name: '兑', lines: [1, 1, 0], angle: 45 },    // Lake ☱
    { name: '离', lines: [1, 0, 1], angle: 90 },    // Fire ☲
    { name: '震', lines: [0, 0, 1], angle: 135 },   // Thunder ☳
    { name: '巽', lines: [0, 1, 1], angle: 180 },   // Wind ☴
    { name: '坎', lines: [0, 1, 0], angle: 225 },   // Water ☵
    { name: '艮', lines: [1, 0, 0], angle: 270 },   // Mountain ☶
    { name: '坤', lines: [0, 0, 0], angle: 315 },   // Earth ☷
  ];

  const radius = size * 0.32;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 160 160"
        width={size}
        height={size}
        className="animate-spin-slower"
        style={{ filter: 'drop-shadow(0 0 16px rgba(255,255,255,0.1))' }}
      >
        {/* Outer ring */}
        <circle
          cx="80"
          cy="80"
          r="75"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        {/* Inner ring */}
        <circle
          cx="80"
          cy="80"
          r="55"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />

        {trigrams.map((trigram) => {
          const rad = ((trigram.angle - 90) * Math.PI) / 180;
          const cx = 80 + radius * Math.cos(rad);
          const cy = 80 + radius * Math.sin(rad);
          const lineWidth = 14;
          const lineHeight = 3;
          const gap = 5;

          return (
            <g key={trigram.name}>
              {trigram.lines.map((line, i) => {
                const yOffset = (i - 1) * gap;
                if (line === 1) {
                  // Solid line (yang)
                  return (
                    <rect
                      key={i}
                      x={cx - lineWidth / 2}
                      y={cy + yOffset - lineHeight / 2}
                      width={lineWidth}
                      height={lineHeight}
                      rx="1.5"
                      fill="rgba(255,255,255,0.7)"
                    />
                  );
                } else {
                  // Broken line (yin) - two segments
                  return (
                    <g key={i}>
                      <rect
                        x={cx - lineWidth / 2}
                        y={cy + yOffset - lineHeight / 2}
                        width={lineWidth * 0.4}
                        height={lineHeight}
                        rx="1.5"
                        fill="rgba(255,255,255,0.7)"
                      />
                      <rect
                        x={cx + lineWidth * 0.1}
                        y={cy + yOffset - lineHeight / 2}
                        width={lineWidth * 0.4}
                        height={lineHeight}
                        rx="1.5"
                        fill="rgba(255,255,255,0.7)"
                      />
                    </g>
                  );
                }
              })}
              {/* Trigram character label */}
              <text
                x={cx}
                y={cy + 20}
                textAnchor="middle"
                fill="rgba(255,255,255,0.5)"
                fontSize="8"
                fontFamily="Noto Sans SC, sans-serif"
              >
                {trigram.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default React.memo(BaguaLoader);
