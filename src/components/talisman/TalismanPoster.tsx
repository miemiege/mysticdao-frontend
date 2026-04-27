/**
 * TalismanPoster -- Cyber-Oriental Sigil v7.0
 *
 * Based on ManifestDao Brand Visual System:
 * - Handcrafted rice-paper texture (trembling brush, flying white, ink density)
 * - Vertical three-section layout: Heaven(25%) + Human(50%) + Earth(25%)
 * - Chinese-English mixed: Chinese calligraphy as main, English script as footnote
 * - Seal system: wax seal + main seal + corner seal
 * - Hand-drawn trembling border
 * - Pure SVG, html2canvas compatible
 */

import React from "react";
import { GUA64_LIST } from "../../data/gua64";
import { getTheme } from "../../lib/theme";

interface Props {
  hexagramName: string;
  score?: number;
  width?: number;
  height?: number;
  showSeal?: boolean;
}

const TRIGRAM_LINES: Record<string, ("yang"|"yin")[]> = {
  "乾": ["yang","yang","yang"], "坤": ["yin","yin","yin"], "震": ["yang","yin","yin"],
  "巽": ["yin","yang","yang"], "坎": ["yin","yang","yin"], "离": ["yang","yin","yang"],
  "艮": ["yin","yin","yang"], "兑": ["yang","yang","yin"],
};

/** Hand-drawn trembling border path generator */
const trembleBorder = (x: number, y: number, w: number, h: number, jitter: number): string => {
  const j = () => (Math.random() - 0.5) * jitter;
  return `M ${x+j()} ${y+j()} L ${x+w+j()} ${y+j()} L ${x+w+j()} ${y+h+j()} L ${x+j()} ${y+h+j()} Z`;
};

const TalismanPoster: React.FC<Props> = ({ hexagramName, score: _score = 75, width = 400, height = 640, showSeal = true }) => {
  const gua = GUA64_LIST.find((g) => g.name === hexagramName);
  const upper = gua?.upper || "乾";
  const symbol = gua?.symbol || "䷀";
  const element = gua?.element || "金";
  const theme = getTheme(element);

  const blessingText = gua?.imageEn || gua?.judgmentEn || "The Tao that can be told is not the eternal Tao.";
  const shortBlessing = blessingText.length > 100 ? blessingText.slice(0, 100) + "..." : blessingText;
  const keywords = (gua?.keywordsEn || []).slice(0, 3);

  const lowerLines = gua?.lower ? TRIGRAM_LINES[gua.lower] || TRIGRAM_LINES["乾"] : TRIGRAM_LINES["乾"];
  const upperLines = TRIGRAM_LINES[upper] || TRIGRAM_LINES["乾"];
  const sixLines = [...lowerLines, ...upperLines];

  const W = width, H = height, cx = W / 2;
  const m = Math.min(W, H) * 0.08;
  const uid = `sigil-${hexagramName}-${W}-${H}`;

  // Three-section layout
  const heavenH = H * 0.22;
  const humanH = H * 0.56;
  const earthH = H * 0.22;
  const heavenY = m;
  const humanY = heavenY + heavenH;
  const earthY = humanY + humanH;

  // Blessing text word wrap
  const words = shortBlessing.split(" ");
  const lines: string[] = [];
  let cur = "";
  words.forEach((w) => {
    if ((cur + w).length > 26 && cur) { lines.push(cur.trim()); cur = w + " "; }
    else { cur += w + " "; }
  });
  if (cur) lines.push(cur.trim());

  // Border paths with hand-drawn tremble
  const bOuter = trembleBorder(m, m, W - m*2, H - m*2, 1.5);
  const bInner = trembleBorder(m+6, m+6, W - m*2 - 12, H - m*2 - 12, 1.0);

  // Vertical decorative trembling lines
  const vLineLeft = `M ${cx - 55} ${humanY + 20} Q ${cx - 58} ${humanY + humanH/2} ${cx - 55} ${humanY + humanH - 20}`;
  const vLineRight = `M ${cx + 55} ${humanY + 20} Q ${cx + 58} ${humanY + humanH/2} ${cx + 55} ${humanY + humanH - 20}`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <defs>
        {/* Rice-paper noise texture */}
        <filter id={`paper-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.06 0" in="noise" result="coloredNoise" />
          <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
          <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
        </filter>

        {/* Brush flying-white effect */}
        <filter id={`brush-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Seal mottled effect */}
        <filter id={`seal-${uid}`}>
          <feTurbulence type="turbulence" baseFrequency="0.08" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Gold glow */}
        <filter id={`glow-${uid}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Paper base gradient */}
        <radialGradient id={`paper-grad-${uid}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#1a1510" stopOpacity="1" />
          <stop offset="60%" stopColor="#0f0c08" stopOpacity="1" />
          <stop offset="100%" stopColor="#050403" stopOpacity="1" />
        </radialGradient>

        {/* Gold dust speckles */}
        <filter id={`gold-dust-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.78  0 0 0 0 0.64  0 0 0 0 0.36  0 0 0 0.3 0" in="noise" />
        </filter>
      </defs>

      {/* ====== Background Layer ====== */}
      <rect x="0" y="0" width={W} height={H} fill="#050403" />
      <rect x="0" y="0" width={W} height={H} fill={`url(#paper-grad-${uid})`} />
      <rect x="0" y="0" width={W} height={H} fill="#000" filter={`url(#paper-${uid})`} opacity="0.4" />
      <rect x="0" y="0" width={W} height={H} filter={`url(#gold-dust-${uid})`} opacity="0.15" />

      {/* ====== Hand-drawn trembling border ====== */}
      <path d={bOuter} fill="none" stroke={theme.gold} strokeWidth="1.8" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={bInner} fill="none" stroke={theme.gold} strokeWidth="0.8" strokeOpacity="0.25" strokeLinecap="round" strokeLinejoin="round" />

      {/* Corner accents */}
      {[[m+4,m+4,0], [W-m-4,m+4,90], [m+4,H-m-4,270], [W-m-4,H-m-4,180]].map(([x,y,r], i) => (
        <g key={i} transform={`rotate(${r}, ${x}, ${y})`}>
          <path d={`M ${x} ${y} L ${x+12} ${y} L ${x+12} ${y+3} L ${x+3} ${y+3} L ${x+3} ${y+12} L ${x} ${y+12} Z`}
            fill="none" stroke={theme.gold} strokeWidth="0.8" strokeOpacity="0.3" />
        </g>
      ))}

      {/* ====== Heaven Section (25%) ====== */}
      {/* Wax seal */}
      {showSeal && (
        <g transform={`translate(${cx}, ${heavenY + heavenH * 0.35})`} filter={`url(#seal-${uid})`}>
          <ellipse cx="0" cy="0" rx="32" ry="28" fill="none" stroke="#9B2C2C" strokeWidth="2.5" opacity="0.9" />
          <ellipse cx="0" cy="0" rx="28" ry="24" fill="none" stroke="#9B2C2C" strokeWidth="0.8" opacity="0.4" />
          <text x="0" y="3" textAnchor="middle" dominantBaseline="middle" fill="#9B2C2C"
            fontSize="9" fontFamily="serif" fontWeight="bold" letterSpacing="2" opacity="0.95">
            天官賜福
          </text>
        </g>
      )}

      {/* Brand name */}
      <text x={cx} y={heavenY + heavenH * 0.72} textAnchor="middle" fill={theme.gold}
        fontSize="7" fontFamily="sans-serif" letterSpacing="5" opacity="0.3">
        MYSTIC DAO
      </text>

      {/* Heaven divider */}
      <line x1={cx - 35} y1={heavenY + heavenH * 0.82} x2={cx + 35} y2={heavenY + heavenH * 0.82}
        stroke={theme.gold} strokeWidth="0.6" strokeOpacity="0.2" />

      {/* ====== Human Section (50%) ====== */}
      {/* Decorative trembling vertical lines */}
      <path d={vLineLeft} fill="none" stroke={theme.primary} strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="4,3" />
      <path d={vLineRight} fill="none" stroke={theme.primary} strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="4,3" />

      {/* Hexagram symbol */}
      <text x={cx} y={humanY + humanH * 0.18} textAnchor="middle" fill={theme.gold}
        fontSize="42" fontFamily="serif" opacity="0.9" filter={`url(#glow-${uid})`}>
        {symbol}
      </text>

      {/* Chinese hexagram name -- main calligraphy text */}
      <text x={cx} y={humanY + humanH * 0.42} textAnchor="middle" fill={theme.primary}
        fontSize="28" fontFamily="serif" fontWeight="bold" letterSpacing="6"
        opacity="0.95" filter={`url(#brush-${uid})`}>
        {hexagramName}
      </text>

      {/* Six Yao lines */}
      <g transform={`translate(${cx}, ${humanY + humanH * 0.55})`}>
        {sixLines.map((lineType, i) => {
          const y = i * 9;
          const segLen = 38;
          if (lineType === "yang") {
            return <line key={i} x1={-segLen} y1={y} x2={segLen} y2={y}
              stroke={theme.primary} strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />;
          }
          const gap = 8;
          return (
            <g key={i}>
              <line x1={-segLen} y1={y} x2={-gap} y2={y} stroke={theme.primary} strokeWidth="2" strokeOpacity="0.55" strokeLinecap="round" />
              <line x1={gap} y1={y} x2={segLen} y2={y} stroke={theme.primary} strokeWidth="2" strokeOpacity="0.55" strokeLinecap="round" />
            </g>
          );
        })}
      </g>

      {/* Energy symbol lines (geometric lines on sides) */}
      <g transform={`translate(${cx - 50}, ${humanY + humanH * 0.72})`} opacity="0.2">
        {[0, 1, 2].map((i) => (
          <line key={i} x1="0" y1={i * 6} x2="12" y2={i * 6 - 3}
            stroke={theme.gold} strokeWidth="1" strokeLinecap="round" />
        ))}
      </g>
      <g transform={`translate(${cx + 38}, ${humanY + humanH * 0.72})`} opacity="0.2">
        {[0, 1, 2].map((i) => (
          <line key={i} x1="0" y1={i * 6 - 3} x2="12" y2={i * 6}
            stroke={theme.gold} strokeWidth="1" strokeLinecap="round" />
        ))}
      </g>

      {/* ====== Earth Section (25%) ====== */}
      {/* English caption */}
      <text x={cx} y={earthY + earthH * 0.22} textAnchor="middle" fill={theme.gold}
        fontSize={gua?.nameEn && gua.nameEn.length > 16 ? 13 : 15}
        fontFamily="Georgia, 'Playfair Display', serif" fontWeight="bold"
        letterSpacing="1" opacity="0.75" filter={`url(#glow-${uid})`}>
        {(gua?.nameEn || "THE UNKNOWN").toUpperCase()}
      </text>

      {/* Blessing text */}
      <g transform={`translate(${cx}, ${earthY + earthH * 0.42})`}>
        <text x="0" y="-6" textAnchor="middle" fill={theme.gold} fontSize="14"
          fontFamily="Georgia, serif" opacity="0.15">&ldquo;</text>
        {lines.map((line, i) => (
          <text key={i} x="0" y={i * 14} textAnchor="middle" fill={theme.secondary}
            fontSize="9" fontFamily="Georgia, 'Playfair Display', serif" fontStyle="italic"
            opacity="0.6" letterSpacing="0.3">
            {line}
          </text>
        ))}
      </g>

      {/* Corner seal (压角章) */}
      {showSeal && (
        <g transform={`translate(${W - m - 28}, ${earthY + earthH * 0.72})`} filter={`url(#seal-${uid})`}>
          <rect x="-14" y="-12" width="28" height="24" fill="none" stroke="#9B2C2C" strokeWidth="1.5" opacity="0.7" rx="2" />
          <text x="0" y="3" textAnchor="middle" dominantBaseline="middle" fill="#9B2C2C"
            fontSize="7" fontFamily="serif" fontWeight="bold" letterSpacing="1" opacity="0.9">
            開運
          </text>
        </g>
      )}

      {/* Keywords */}
      {keywords.length > 0 && (
        <text x={cx} y={earthY + earthH * 0.85} textAnchor="middle" fill={theme.gold}
          fontSize="7" fontFamily="sans-serif" letterSpacing="3" opacity="0.3">
          {keywords.join(" · ").toUpperCase()}
        </text>
      )}

      {/* Date */}
      <text x={cx} y={H - m - 8} textAnchor="middle" fill={theme.gold}
        fontSize="6" fontFamily="sans-serif" letterSpacing="2" opacity="0.2">
        {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toUpperCase()}
      </text>
    </svg>
  );
};

export default TalismanPoster;
