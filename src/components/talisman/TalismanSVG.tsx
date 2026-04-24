import React, { useState, useEffect } from 'react';
import { getTheme, getSealInfo, FU_GALL_CHARS } from '@/lib/theme';
import { getTalismanImage, type TalismanStyle } from '@/data/talisman-images';

interface TalismanSVGProps {
  hexagramName: string;
  blessingTheme: string;
  element: string;
  category: string;
  seed: number;
  score?: number;
  width?: number;
  height?: number;
  showSeal?: boolean;
  talismanStyle?: TalismanStyle; // NEW: 'dark' | 'vintage'
}

/* ─── Sub-components ─── */

const SanqingHead: React.FC<{ color: string }> = ({ color }) => (
  <g transform="translate(0, 10)">
    <circle cx="0" cy="0" r="8" fill="none" stroke={color} strokeWidth="1.2" opacity="0.8" />
    <circle cx="-18" cy="5" r="6" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
    <circle cx="18" cy="5" r="6" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
    <path d="M0,-12 L0,-25 M-18,-1 L-18,-15 M18,-1 L18,-15" stroke={color} strokeWidth="1" opacity="0.5" />
  </g>
);

const SantaiHead: React.FC<{ color: string }> = ({ color }) => (
  <g transform="translate(0, 10)">
    <rect x="-20" y="-8" width="12" height="16" rx="2" fill="none" stroke={color} strokeWidth="1.2" opacity="0.7" />
    <rect x="-6" y="-10" width="12" height="20" rx="2" fill="none" stroke={color} strokeWidth="1.2" opacity="0.8" />
    <rect x="8" y="-8" width="12" height="16" rx="2" fill="none" stroke={color} strokeWidth="1.2" opacity="0.7" />
    <line x1="-14" y1="-15" x2="-14" y2="-22" stroke={color} strokeWidth="1" opacity="0.5" />
    <line x1="0" y1="-18" x2="0" y2="-25" stroke={color} strokeWidth="1" opacity="0.5" />
    <line x1="14" y1="-15" x2="14" y2="-22" stroke={color} strokeWidth="1" opacity="0.5" />
  </g>
);

const ChilingHead: React.FC<{ color: string }> = ({ color }) => (
  <g transform="translate(0, 10)">
    <text x="0" y="0" textAnchor="middle" fill={color} fontSize="22" fontWeight="bold" opacity="0.85" fontFamily="serif">敕令</text>
    <path d="M-30,5 L30,5" stroke={color} strokeWidth="0.8" opacity="0.4" />
  </g>
);

const FuGall: React.FC<{ char: string; color: string }> = ({ char, color }) => (
  <text x="0" y="0" textAnchor="middle" fill={color} fontSize="42" fontWeight="bold" opacity="0.9" fontFamily="serif" style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}>
    {char}
  </text>
);

const SealStamp: React.FC<{ grade: string; color: string; size: number }> = ({ grade, color, size }) => (
  <g transform={`translate(0, ${size / 2 + 10})`}>
    <rect x={-size / 2} y={-size / 2} width={size} height={size} rx="4" fill="none" stroke={color} strokeWidth="2" opacity="0.8" />
    <rect x={-size / 2 + 3} y={-size / 2 + 3} width={size - 6} height={size - 6} rx="2" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
    <text x="0" y="4" textAnchor="middle" fill={color} fontSize={size * 0.35} fontWeight="bold" opacity="0.9" fontFamily="serif">{grade}</text>
  </g>
);

const HexagramLines: React.FC<{ seed: number; color: string }> = ({ seed, color }) => {
  const lines = [];
  for (let i = 0; i < 6; i++) {
    const isYang = ((seed + i * 7) % 2) === 0;
    const y = 60 + i * 14;
    if (isYang) {
      lines.push(<line key={i} x1="-30" y1={y} x2="30" y2={y} stroke={color} strokeWidth="2" opacity="0.6" />);
    } else {
      lines.push(
        <g key={i}>
          <line x1="-30" y1={y} x2="-8" y2={y} stroke={color} strokeWidth="2" opacity="0.6" />
          <line x1="8" y1={y} x2="30" y2={y} stroke={color} strokeWidth="2" opacity="0.6" />
        </g>
      );
    }
  }
  return <g>{lines}</g>;
};

const BackgroundPattern: React.FC<{ color: string }> = ({ color }) => (
  <>
    <rect x="-140" y="-210" width="280" height="420" fill={`url(#noise)`} opacity="0.03" />
    <defs>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
    </defs>
    <rect x="-140" y="-210" width="280" height="420" fill="none" stroke={color} strokeWidth="1" opacity="0.15" rx="8" />
    <rect x="-135" y="-205" width="270" height="410" fill="none" stroke={color} strokeWidth="0.5" opacity="0.08" rx="6" />
  </>
);

/* ─── SVG Fallback Mode ─── */

const TalismanSVGMode: React.FC<TalismanSVGProps> = ({
  hexagramName, blessingTheme, element, category, seed, score = 75, width = 360, height = 540, showSeal = true
}) => {
  const theme = getTheme(element);
  const seal = getSealInfo(score);
  const fuGallChar = FU_GALL_CHARS[element] || '罡';
  const headType = seed % 3;

  return (
    <svg width={width} height={height} viewBox="-150 -250 300 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={theme.primary} stopOpacity="0.15" />
          <stop offset="50%" stopColor={theme.primary} stopOpacity="0.05" />
          <stop offset="100%" stopColor={theme.primary} stopOpacity="0.1" />
        </linearGradient>
        <filter id="textGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="-150" y="-250" width="300" height="500" fill={theme.bg} rx="12" />
      <rect x="-150" y="-250" width="300" height="500" fill="url(#glow)" rx="12" />
      <BackgroundPattern color={theme.primary} />
      {headType === 0 && <SanqingHead color={theme.primary} />}
      {headType === 1 && <SantaiHead color={theme.primary} />}
      {headType === 2 && <ChilingHead color={theme.primary} />}
      <text x="0" y="-185" textAnchor="middle" fill={theme.primary} fontSize="16" fontWeight="bold" opacity="0.7" fontFamily="serif" letterSpacing="2">{hexagramName}</text>
      <text x="0" y="-168" textAnchor="middle" fill={theme.secondary} fontSize="10" opacity="0.5" letterSpacing="1">{category}</text>
      <text x="0" y="155" textAnchor="middle" fill={theme.accent} fontSize="11" opacity="0.6" letterSpacing="1">{blessingTheme}</text>
      <HexagramLines seed={seed} color={theme.primary} />
      <FuGall char={fuGallChar} color={theme.primary} />
      {showSeal && <SealStamp grade={seal.grade} color={seal.color} size={seal.size} />}
      <text x="0" y="200" textAnchor="middle" fill={theme.primary} fontSize="14" opacity="0.5" fontFamily="serif">{score}</text>
    </svg>
  );
};

/* ─── AI Image Mode ─── */

const TalismanImageMode: React.FC<{ hexagramName: string; score: number; element: string; blessingTheme: string; category: string; style: TalismanStyle; width?: number; height?: number }> = ({
  hexagramName, score, element, blessingTheme, category, style, width = 360, height = 540
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imgSrc = getTalismanImage(hexagramName, style);
  const theme = getTheme(element);
  const seal = getSealInfo(score);

  if (!imgSrc || imgError) return null;

  return (
    <div style={{ position: 'relative', width, height, borderRadius: '12px', overflow: 'hidden' }}>
      <img
        src={imgSrc}
        alt={`${hexagramName} 符咒`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: imgLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgError(true)}
      />
      {!imgLoaded && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.bg }}>
          <span style={{ color: theme.primary, fontSize: '14px', opacity: 0.5 }}>Loading...</span>
        </div>
      )}
      <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ color: '#fff', fontSize: '11px', opacity: 0.7, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          {blessingTheme} · {category}
        </span>
        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', opacity: 0.9, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          {score}
        </span>
      </div>
      <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
        <span style={{
          color: seal.color,
          fontSize: '12px',
          fontWeight: 'bold',
          opacity: 0.8,
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          padding: '2px 6px',
          border: `1px solid ${seal.color}40`,
          borderRadius: '4px',
          background: 'rgba(0,0,0,0.3)',
        }}>
          {seal.grade}
        </span>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */

const TalismanSVG: React.FC<TalismanSVGProps> = (props) => {
  const { hexagramName, talismanStyle = 'dark', score = 75, element, blessingTheme, category, width = 360, height = 540 } = props;
  const imgSrc = getTalismanImage(hexagramName, talismanStyle);
  const [useImage, setUseImage] = useState(!!imgSrc);

  useEffect(() => {
    setUseImage(!!imgSrc);
  }, [imgSrc]);

  if (useImage && imgSrc) {
    return (
      <TalismanImageMode
        hexagramName={hexagramName}
        score={score}
        element={element}
        blessingTheme={blessingTheme}
        category={category}
        style={talismanStyle}
        width={width}
        height={height}
      />
    );
  }

  return <TalismanSVGMode {...props} />;
};

export default TalismanSVG;
