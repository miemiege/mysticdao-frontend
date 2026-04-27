/**
 * Talisman Design System v9.0 — Digital Manuscript Aesthetic
 *
 * Synthesis of 10-dimension research:
 * 1. Color Psychology      → Tea Wash palette, burgundy cinnabar
 * 2. Typography/Layout     → Horizontal only, ≤15 words, 5 info tiers
 * 3. Semiotics             → Pseudo-symbols over readable Chinese
 * 4. Copy Tone             → "Student posture", Jung/Wilhelm lineage hint
 * 5. Competitor Analysis   → Black+white viral, selective glow
 * 6. Share Motivation      → Aesthetic capital, S.C.R.I.P.T.
 * 7. Cyber-Oriental        → 70% talisman prototype + 30% cyber trace
 * 8. Cultural Appropriation→ No "Oriental", academic framing
 * 9. De-AI Techniques      → 15 anti-AI visual markers
 * 10. Talisman History     → Dot-circle-line DNA, Xu Bing pseudo-script
 */

import type { Gua64 } from '../data/gua64';

// ─── Color Tokens: Digital Manuscript Palette ───
export const PALETTE = {
  /* Tea Wash base — aged, muted, avoids pure yellow (funeral connotation in West) */
  paper: '#F5F0E8',        // Parchment
  paperDark: '#E8DCC8',    // Tea Wash
  paperEdge: '#D4C8B0',    // Aged edge
  paperShadow: '#B8A88C',  // Deep stain

  /* Ink — deep indigo instead of pure black (avoids Western death association) */
  ink: '#1A1A2E',          // Deep Indigo
  inkLight: '#3A3A4E',     // Washed ink
  inkWash: '#5A5A6E',      // Pale wash

  /* Cinnabar — shifted to burgundy (#9B2335) per color psychology research */
  cinnabar: '#9B2335',
  cinnabarLight: '#B8545E',
  cinnabarGlow: 'rgba(155, 35, 53, 0.35)',

  /* Gold — antique, ≤10% usage */
  gold: '#C9A227',
  goldLight: '#D4B84B',
  goldFade: 'rgba(201, 162, 39, 0.25)',

  /* Cyber accents — muted, selective */
  neonCyan: '#00B4A0',
  neonCyanFade: 'rgba(0, 180, 160, 0.2)',
  neonMagenta: '#A0527C',
  hologram: 'rgba(100, 200, 255, 0.15)',

  /* Utility */
  transparent: 'transparent',
  white: '#FFFFFF',
} as const;

// ─── Font Stack ───
export const FONTS = {
  /* Unicode symbols only — Noto Serif SC for hexagram glyphs */
  chinese: '"Noto Serif SC", "STSong", "SimSun", serif',
  /* English body — elegant serif */
  english: 'Georgia, "Times New Roman", serif',
  /* Monospace — cyber/d archival feel */
  mono: '"Share Tech Mono", "Courier New", monospace',
  /* Handwritten — edgy taglines, annotations */
  script: '"Caveat", "Dancing Script", cursive',
} as const;

// ─── Edgy Tagline Generator (v9: student posture, no "master/unlock") ───
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
    "KEEP GOING.",
    "FLOWERS NEED RAIN TOO.",
  ],
  'Moderate Fortune': [
    "BALANCE IS A VERB.",
    "PATIENCE IS A PORTAL.",
    "NOT YET. STILL COMING.",
    "GROW THROUGH IT.",
    "THE MIDDLE PATH IS WILD.",
  ],
  'Neutral': [
    "STILLNESS IS ALIVE.",
    "WAIT. WATCH. WONDER.",
    "THE VOID HOLDS ANSWERS.",
    "BREATHE. THE TAO DOES TOO.",
    "PAUSE IS NOT STOP.",
  ],
  'Minor Misfortune': [
    "SHADOWS TEACH LIGHT.",
    "BEND. DON'T BREAK.",
    "THIS TOO IS THE PATH.",
    "STORM BEFORE STILLNESS.",
    "NECESSARY CONTRACTION.",
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
    "FROM ASHES. ALWAYS.",
    "THE OLD YOU IS EXPIRED.",
    "COLLAPSE IS COMPRESSED CHANGE.",
    "EVERYTHING MUST GO.",
  ],
};

/** Generate an edgy one-liner based on fortune level */
export const getEdgyTagline = (gua: Gua64 | undefined): string => {
  if (!gua) return "THE PATTERN IS WATCHING.";
  const templates = TAGLINE_TEMPLATES[gua.fortuneEn] || TAGLINE_TEMPLATES['Neutral'];
  const idx = (gua.number * 7 + 13) % templates.length;
  return templates[idx];
};

/** Generate a secondary short phrase (6 words max) */
export const getShortPhrase = (gua: Gua64 | undefined): string => {
  if (!gua) return '';
  const phrases: Record<string, string[]> = {
    'Great Fortune': ["power moves only", "stay luminous", "full send"],
    'Fortune': ["keep showing up", "trust the process", "good trouble"],
    'Moderate Fortune': ["slow is smooth", "hold the line", "almost there"],
    'Neutral': ["read the room", "watch and learn", "gather data"],
    'Minor Misfortune': ["feel it all", "lean into it", "soft strength"],
    'Misfortune': ["let it burn", "rebuild better", "deconstruct to grow"],
    'Great Misfortune': ["start from zero", "nothing to lose", "phoenix mode"],
  };
  const list = phrases[gua.fortuneEn] || phrases['Neutral'];
  const idx = (gua.number * 5 + 3) % list.length;
  return list[idx];
};

/** Generate archive ID with academic lineage hint */
export const getArchiveId = (gua: Gua64 | undefined): string => {
  if (!gua) return 'MDX-00-UNK';
  const hex = gua.number.toString(16).toUpperCase().padStart(2, '0');
  // W-B = Wilhelm-Baynes (academic lineage signal)
  return `MDX-${hex}-WB`;
};

/** Generate a minimal annotation (English only) */
export const getAnnotation = (gua: Gua64 | undefined): string => {
  if (!gua) return '';
  const notes = [
    `${gua.element.toLowerCase()} phase`,
    `no.${gua.number} of 64`,
    gua.fortuneEn.toLowerCase(),
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

  /* v9: tighter sections, more breathing room */
  const heavenH = H * 0.18;
  const humanH = H * 0.55;
  const earthH = H * 0.27;
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
  const sizes = [
    [12, 3, 12],
    [10, 4, 10],
    [14, 2, 10],
    [11, 3, 11],
  ];
  const [a, b, c] = sizes[variant % 4];
  return `M ${x} ${y} L ${x + a} ${y} L ${x + a} ${y + b} L ${x + b} ${y + b} L ${x + b} ${y + c} L ${x} ${y + c} Z`;
};

// ─── Pseudo-Symbol Generator (Xu Bing inspired) ───
/** Generate a deterministic pseudo-script pattern from dot-circle-line DNA */
export const generatePseudoSymbols = (
  seed: number,
  count: number,
  cx: number,
  cy: number,
  scale: number
): string => {
  const rng = (n: number) => {
    const s = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
  let paths = '';
  for (let i = 0; i < count; i++) {
    const type = rng(i * 3) > 0.5 ? 'dot' : rng(i * 3) > 0.25 ? 'circle' : 'line';
    const px = cx + (rng(i * 7) - 0.5) * scale * 2;
    const py = cy + (rng(i * 11) - 0.5) * scale;
    if (type === 'dot') {
      paths += `M ${px} ${py} L ${px + 0.1} ${py} `;
    } else if (type === 'circle') {
      const r = 1 + rng(i * 13) * 2;
      paths += `M ${px + r} ${py} A ${r} ${r} 0 1 0 ${px - r} ${py} A ${r} ${r} 0 1 0 ${px + r} ${py} `;
    } else {
      const len = 3 + rng(i * 17) * 6;
      const angle = rng(i * 19) * Math.PI;
      paths += `M ${px} ${py} L ${px + Math.cos(angle) * len} ${py + Math.sin(angle) * len} `;
    }
  }
  return paths;
};

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

// ─── Word-wrap utility ───
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

// ─── De-AI Configuration (v9 enhanced) ───
export const DE_AI = {
  /* Paper texture */
  paperTurbulence: { baseFrequency: '0.55', numOctaves: 5 },
  /* Brush irregularity */
  brushDisplacement: { baseFrequency: '0.12', numOctaves: 4, scale: 2.5 },
  /* Seal weathering */
  sealTurbulence: { baseFrequency: '0.07', numOctaves: 5, scale: 3.5 },
  /* Scan noise layer */
  scanNoise: { baseFrequency: '0.8', numOctaves: 3, opacity: 0.35 },
  /* Color shift: pure black → deep indigo with warm undertone */
  inkColorShift: { from: '#000000', to: '#1A1A2E' },
  /* Sub-pixel rotation for scan misalignment */
  scanRotation: 0.15,
  /* Ink bleed simulation */
  inkBleedOpacity: 0.06,
} as const;
