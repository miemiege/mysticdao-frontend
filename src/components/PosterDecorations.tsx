/**
 * Poster Decorations — 装饰元素库（角饰/边框/莲花/龙纹/云纹/太极/印章）
 */
import React from 'react';

export interface DecorationProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  color?: string;
  opacity?: number;
  filter?: string;
}

export const CornerOrnament: React.FC<DecorationProps> = ({ x = 0, y = 0, width = 60, height = 60, color = '#C8A45C', opacity = 0.8, filter }) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity} filter={filter}>
    <path d={`M0 ${height} L0 0 L${width} 0`} fill="none" stroke={color} strokeWidth="1.5" />
    <path d={`M8 ${height} L8 8 L${width} 8`} fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
    <circle cx="4" cy="4" r="2" fill={color} opacity="0.6" />
  </g>
);

export const BorderFrame: React.FC<DecorationProps & { inset?: number }> = ({ x = 0, y = 0, width = 400, height = 600, color = '#C8A45C', opacity = 0.6, inset = 20, filter }) => (
  <g opacity={opacity} filter={filter}>
    <rect x={Number(x) + inset} y={Number(y) + inset} width={Number(width) - inset * 2} height={Number(height) - inset * 2} fill="none" stroke={color} strokeWidth="2" rx="4" />
    <rect x={Number(x) + inset + 6} y={Number(y) + inset + 6} width={Number(width) - inset * 2 - 12} height={Number(height) - inset * 2 - 12} fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" rx="2" />
  </g>
);

export const LotusPattern: React.FC<DecorationProps> = ({ x = 200, y = 300, width = 80, height = 80, color = '#C8A45C', opacity = 0.3, filter }) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity} filter={filter}>
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <ellipse key={i} cx={Math.cos((angle * Math.PI) / 180) * 20} cy={Math.sin((angle * Math.PI) / 180) * 20} rx="12" ry="24" fill="none" stroke={color} strokeWidth="0.8" transform={`rotate(${angle})`} />
    ))}
    <circle r="6" fill={color} opacity="0.5" />
  </g>
);

export const CloudPattern: React.FC<DecorationProps & { count?: number }> = ({ x = 0, y = 0, width = 400, color = '#C8A45C', opacity = 0.15, count = 3, filter }) => (
  <g opacity={opacity} filter={filter}>
    {Array.from({ length: count }).map((_, i) => (
      <path key={i} d={`M${Number(x) + i * 120} ${Number(y)} Q${Number(x) + i * 120 + 20} ${Number(y) - 15} ${Number(x) + i * 120 + 40} ${Number(y)} Q${Number(x) + i * 120 + 60} ${Number(y) + 10} ${Number(x) + i * 120 + 80} ${Number(y)}`} fill="none" stroke={color} strokeWidth="1" />
    ))}
  </g>
);

export const TaiChiSymbol: React.FC<DecorationProps> = ({ x = 200, y = 200, width = 100, color = '#2C2C2C', opacity = 0.4, filter }) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity} filter={filter}>
    <circle r={Number(width) / 2} fill="none" stroke={color} strokeWidth="1.5" />
    <path d={`M0 -${Number(width) / 2} A${Number(width) / 4} ${Number(width) / 4} 0 0 1 0 0 A${Number(width) / 4} ${Number(width) / 4} 0 0 0 0 ${Number(width) / 2} A${Number(width) / 2} ${Number(width) / 2} 0 0 1 0 -${Number(width) / 2}Z`} fill={color} />
    <circle cx="0" cy={-Number(width) / 4} r={Number(width) / 12} fill="#F5F0E8" />
    <circle cx="0" cy={Number(width) / 4} r={Number(width) / 12} fill={color} />
  </g>
);

export const SealStamp: React.FC<DecorationProps & { text?: string; size?: number; bgColor?: string }> = ({ x = 350, y = 550, text = '上吉', size = 48, color = '#8B0000', opacity = 0.9, bgColor = 'transparent', filter }) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity} filter={filter}>
    <rect x={-size / 2} y={-size / 2} width={size} height={size} fill={bgColor} stroke={color} strokeWidth="2" rx="4" />
    <text x="0" y="4" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={size * 0.45} fontFamily="'Noto Serif SC', serif" fontWeight="bold" style={{ writingMode: 'vertical-rl' }}>
      {text}
    </text>
  </g>
);

export const DragonPattern: React.FC<DecorationProps> = ({ x = 200, y = 100, width = 200, color = '#C8A45C', opacity = 0.2, filter }) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity} filter={filter}>
    <path d="M-80 20 Q-40 -20 0 0 Q40 -20 80 20 Q60 40 40 30 Q20 40 0 25 Q-20 40 -40 30 Q-60 40 -80 20Z" fill="none" stroke={color} strokeWidth="1" />
    <path d="M-60 25 Q-30 -5 0 10 Q30 -5 60 25" fill="none" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <circle cx="-70" cy="15" r="3" fill={color} opacity="0.5" />
  </g>
);

export const PosterDecorations: React.FC<{ style: string }> = ({ style }) => {
  const configs: Record<string, React.ReactNode> = {
    ink: <><CornerOrnament color="#3A3A3A" /><CornerOrnament x="340" color="#3A3A3A" /><CornerOrnament y="540" color="#3A3A3A" /><CornerOrnament x="340" y="540" color="#3A3A3A" /><CloudPattern color="#3A3A3A" opacity={0.08} /></>,
    dark: <><CornerOrnament color="#9D4EDD" opacity={0.5} filter="url(#poster-glow)" /><TaiChiSymbol color="#E0E0E0" opacity={0.15} /></>,
    royal: <><BorderFrame color="#C8A45C" opacity={0.8} /><DragonPattern color="#C8A45C" opacity={0.15} /><SealStamp color="#8B0000" bgColor="rgba(200,164,92,0.1)" /></>,
    vintage: <><BorderFrame color="#5D4037" opacity={0.6} inset={16} /><CornerOrnament color="#5D4037" opacity={0.5} /><LotusPattern color="#5D4037" opacity={0.1} /></>,
    tianshi: <><BorderFrame color="#8B0000" opacity={0.7} inset={24} /><SealStamp color="#8B0000" size={56} text="天师" /><CloudPattern color="#8B0000" opacity={0.08} count={5} /></>,
    blackgold: <><BorderFrame color="#D4AF37" opacity={0.6} /><CornerOrnament color="#D4AF37" opacity={0.7} filter="url(#poster-glow)" /><LotusPattern color="#D4AF37" opacity={0.1} filter="url(#poster-gold)" /></>,
  };
  return <>{configs[style] || null}</>;
};

export default PosterDecorations;
