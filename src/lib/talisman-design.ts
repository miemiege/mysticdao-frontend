/**
 * Talisman Design System v8.0 — Digital Archive Aesthetic
 *
 * Based on social media research for Western Gen Z/Millennial spirituality content:
 * - Co-Star minimal edgy aesthetic
 * - Oriental mysticism viral Pinterest trends
 * - "De-AI-fication" standards for authentic handmade feel
 * - Cyberpunk neon accents (desaturated)
 */

import type { Gua64 } from '../data/gua64';

// ─── Color Tokens ───
export const PALETTE = {
  /* Rice paper base — aged, muted, never pure white */
  paper: '#F5E6C8',
  paperDark: '#E8D5B0',
  paperEdge: '#D4C4A0',
  paperShadow: '#C4B090',

  /* Ink system */
  ink: '#1A1510',
  inkLight: '#3A3530',
  inkWash: '#5A5550',

  /* Cinnabar — desaturated 15-20% to avoid AI-saturation */
  cinnabar: '#8B1A1A',
  cinnabarLight: '#B85450',
  cinnabarGlow: 'rgba(180, 60, 50, 0.4)',

  /* Gold — antique, not bright */
  gold: '#B8860B',
  goldLight: '#D4A84B',
  goldFade: 'rgba(184, 134, 11, 0.3)',

  /* Cyber accents — muted to avoid "AI neon cheapness" */
  neonCyan: '#00D4AA',
  neonCyanFade: 'rgba(0, 212, 170, 0.25)',
  neonMagenta: '#C71585',
  hologram: 'rgba(100, 200, 255, 0.2)',

  /* Utility */
  transparent: 'transparent',
  white: '#FFFFFF',
} as const;

// ─── Font Stack ───
export const FONTS = {
  /* Chinese — Noto Serif SC via Google Fonts CDN */
  chinese: '"Noto Serif SC", "STSong", "SimSun", serif',
  /* English body — elegant serif for blessing text */
  english: 'Georgia, "Times New Roman", serif',
  /* English display — monospace for cyber elements */
  mono: '"Share Tech Mono", "Courier New", monospace',
  /* Handwritten — for edgy taglines and annotations */
  script: '"Caveat", "Dancing Script", cursive',
} as const;

// ─── Edgy Tagline Generator ───
const TAGLINE_TEMPLATES: Record<string, string[]> = {
  'Great Fortune': [
    "YOUR CHAOS IS COSMIC.",
    "THE UNIVERSE CONSPIRES.",
    "RIDE THE LIGHTNING.",
    "CREATED TO CREATE.",
    "STARS ALIGN FOR YOU.",
  ],
  'Fortune': [
    "TRUST THE CURRENT.",
    "BLOOM IN THE CRACKS.",
    "SMALL STEPS. BIG MAGIC.",
    "THE TAO IS OPEN.",
    "KEEP GOING.",
  ],
  'Moderate Fortune': [
    "BALANCE IS A VERB.",
    "PATIENCE IS A PORTAL.",
    "NOT YET. STILL COMING.",
    "GROW THROUGH WHAT YOU GO THROUGH.",
    "THE MIDDLE PATH IS WILD.",
  ],
  'Neutral': [
    "STILLNESS IS ALIVE.",
    "WAIT. WATCH. WONDER.",
    "THE VOID HOLDS ANSWERS.",
    "NOTHING IS ALSO SOMETHING.",
    "BREATHE. THE TAO DOES TOO.",
  ],
  'Minor Misfortune': [
    "SHADOWS TEACH LIGHT.",
    "BEND. DON'T BREAK.",
    "THIS TOO IS THE PATH.",
    "STORM BEFORE STILLNESS.",
    "THE TAO TESTS THE BRAVE.",
  ],
  'Misfortune': [
    "DARKNESS IS DATA.",
    "FALL APART TO FALL TOGETHER.",
    "THE CAVE YOU FEAR HOLDS TREASURE.",
    "BURN IT DOWN. BUILD NEW.",
    "NOT THE END. JUST A TURN.",
  ],
  'Great Misfortune': [
    "TOTAL RESET INCOMING.",
    "EVERYTHING MUST GO.",
    "FROM ASHES. ALWAYS.",
    "THE OLD YOU IS EXPIRED.",
    "COLLAPSE IS JUST COMPRESSED CHANGE.",
  ],
};

/** Generate an edgy one-liner based on fortune level */
export const getEdgyTagline = (gua: Gua64 | undefined): string => {
  if (!gua) return "THE TAO IS WATCHING.";
  const templates = TAGLINE_TEMPLATES[gua.fortuneEn] || TAGLINE_TEMPLATES['Neutral'];
  // Deterministic pseudo-random based on gua number
  const idx = (gua.number * 7 + 13) % templates.length;
  return templates[idx];
};

/** Generate a "digital archive" catalog number */
export const getArchiveId = (gua: Gua64 | undefined): string => {
  if (!gua) return 'MDX-000-ANON';
  const hex = gua.number.toString(16).toUpperCase().padStart(2, '0');
  const el = gua.element.charAt(0);
  const up = gua.upper.charCodeAt(0).toString(36).toUpperCase();
  return `MDX-${hex}-${el}${up}`;
};

/** Generate a handwritten annotation (corner note) */
export const getAnnotation = (gua: Gua64 | undefined): string => {
  if (!gua) return '';
  const notes = [
    `sealed ${gua.element} day`,
    `${gua.upper}↑ ${gua.lower}↓`,
    `no.${gua.number} of 64`,
    `${gua.fortuneEn.toLowerCase()}`,
  ];
  const idx = (gua.number * 3) % notes.length;
  return notes[idx];
};

// ─── Layout Calculator ───
export interface LayoutMetrics {
  W: number;
  H: number;
  cx: number;
  m: number;
  /* Three sections */
  heavenY: number;
  heavenH: number;
  humanY: number;
  humanH: number;
  earthY: number;
  earthH: number;
}

export const calcLayout = (width: number, height: number): LayoutMetrics => {
  const W = width;
  const H = height;
  const cx = W / 2;
  const m = Math.min(W, H) * 0.07;

  /* Digital archive: slightly more generous margins */
  const heavenH = H * 0.20;
  const humanH = H * 0.52;
  const earthH = H * 0.28;
  const heavenY = m + 4;
  const humanY = heavenY + heavenH;
  const earthY = humanY + humanH;

  return { W, H, cx, m, heavenY, heavenH, humanY, humanH, earthY, earthH };
};

// ─── Hand-drawn Border Path Generator ───
export const trembleBorder = (
  x: number,
  y: number,
  w: number,
  h: number,
  jitter: number,
  seed = 0
): string => {
  const j = (n: number) => {
    // Deterministic pseudo-random
    const s = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
    return (s - Math.floor(s) - 0.5) * jitter;
  };
  return `M ${x + j(0)} ${y + j(1)} L ${x + w + j(2)} ${y + j(3)} L ${x + w + j(4)} ${y + h + j(5)} L ${x + j(6)} ${y + h + j(7)} Z`;
};

// ─── Corner Ornament (asymmetric per corner) ───
export const cornerOrnament = (
  x: number,
  y: number,
  _rotation: number,
  variant: number
): string => {
  // variant 0-3 gives slightly different corner shapes for asymmetry
  const sizes = [
    [12, 3, 12],
    [10, 4, 10],
    [14, 2, 10],
    [11, 3, 11],
  ];
  const [a, b, c] = sizes[variant % 4];
  return `M ${x} ${y} L ${x + a} ${y} L ${x + a} ${y + b} L ${x + b} ${y + b} L ${x + b} ${y + c} L ${x} ${y + c} Z`;
};

// ─── Paper Aging Gradient Stops ───
export const PAPER_GRADIENT_STOPS = [
  { offset: '0%', color: PALETTE.paper, opacity: 1 },
  { offset: '50%', color: PALETTE.paperDark, opacity: 1 },
  { offset: '85%', color: PALETTE.paperEdge, opacity: 1 },
  { offset: '100%', color: PALETTE.paperShadow, opacity: 1 },
];

// ─── Element-to-Cyber-Color mapping ───
export const getElementCyberColor = (element: string): string => {
  const map: Record<string, string> = {
    '金': PALETTE.gold,
    '木': PALETTE.neonCyan,
    '水': '#5B8DB8',
    '火': PALETTE.cinnabarLight,
    '土': PALETTE.paperShadow,
  };
  return map[element] || PALETTE.gold;
};

// ─── Word-wrap utility for blessing text ───
export const wrapText = (text: string, maxChars: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  words.forEach((w) => {
    if ((cur + ' ' + w).trim().length > maxChars && cur) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = cur ? cur + ' ' + w : w;
    }
  });
  if (cur) lines.push(cur.trim());
  return lines;
};
