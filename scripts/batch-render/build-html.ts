/**
 * SVG 海报 HTML 构建器
 * 将素材库图片内联为 base64，生成完整 HTML 供 Playwright 截图
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { GuaData } from './gua-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const ASSET_BASE = path.join(PUBLIC_DIR, 'talisman-assets/自己整理z素材库');

// ─── Asset Pools (mirroring src/components/talisman/asset-pools.ts) ───
function getAssetPool(category: string): string[] {
  const dir = path.join(ASSET_BASE, category);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort()
    .map(f => `/talisman-assets/自己整理z素材库/${category}/${f}`);
}

const CALLIGRAPHY_POOL = getAssetPool('calligraphy');
const PATTERN_POOL = getAssetPool('pattern');
const SEAL_POOL = getAssetPool('seal');
const TEXTURE_POOL = getAssetPool('texture');

// ─── Image Inliner ───
function fileToBase64(relPath: string): string | null {
  const absPath = path.join(PUBLIC_DIR, relPath);
  if (!fs.existsSync(absPath)) return null;
  const buf = fs.readFileSync(absPath);
  const ext = path.extname(absPath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

// ─── Design Constants ───
const PALETTE = {
  paper: '#F9F4ED',
  paperDark: '#F0E8D8',
  paperEdge: '#D8CDB8',
  ink: '#1A1A1A',
  cinnabar: '#c41e1e',
  gold: '#C9A227',
};

const TRIGRAM_LINES: Record<string, ("yang" | "yin")[]> = {
  乾: ["yang", "yang", "yang"],
  坤: ["yin", "yin", "yin"],
  震: ["yang", "yin", "yin"],
  巽: ["yin", "yang", "yang"],
  坎: ["yin", "yang", "yin"],
  离: ["yang", "yin", "yang"],
  艮: ["yin", "yin", "yang"],
  兑: ["yang", "yang", "yin"],
};

const TAGLINE_TEMPLATES: Record<string, string[]> = {
  'Great Fortune': ['YOUR CHAOS IS COSMIC.', 'THE UNIVERSE CONSPIRES.', 'RIDE THE LIGHTNING.', 'CREATED TO CREATE.', 'STARS ALIGN FOR YOU.'],
  'Fortune': ['TRUST THE CURRENT.', 'BLOOM IN THE CRACKS.', 'SMALL STEPS. BIG MAGIC.', 'KEEP GOING.', 'FLOWERS NEED RAIN TOO.'],
  'Moderate Fortune': ['BALANCE IS A VERB.', 'PATIENCE IS A PORTAL.', 'NOT YET. STILL COMING.', 'GROW THROUGH IT.', 'THE MIDDLE PATH IS WILD.'],
  'Neutral': ['STILLNESS IS ALIVE.', 'WAIT. WATCH. WONDER.', 'THE VOID HOLDS ANSWERS.', 'BREATHE. THE TAO DOES TOO.', 'PAUSE IS NOT STOP.'],
  'Minor Misfortune': ['SHADOWS TEACH LIGHT.', 'BEND. DON\'T BREAK.', 'THIS TOO IS THE PATH.', 'STORM BEFORE STILLNESS.', 'NECESSARY CONTRACTION.'],
  'Misfortune': ['DARKNESS IS DATA.', 'FALL APART TO FALL TOGETHER.', 'THE CAVE YOU FEAR HOLDS TREASURE.', 'BURN IT DOWN. BUILD NEW.', 'NOT THE END. JUST A TURN.'],
  'Great Misfortune': ['TOTAL RESET INCOMING.', 'FROM ASHES. ALWAYS.', 'THE OLD YOU IS EXPIRED.', 'COLLAPSE IS COMPRESSED CHANGE.', 'EVERYTHING MUST GO.'],
};

function getTagline(gua: GuaData): string {
  const templates = TAGLINE_TEMPLATES[gua.fortuneEn] || TAGLINE_TEMPLATES['Neutral'];
  return templates[(gua.number * 7 + 13) % templates.length];
}

function getArchiveId(gua: GuaData): string {
  const hex = gua.number.toString(16).toUpperCase().padStart(2, '0');
  return `MDX-${hex}-WB`;
}

function getAnnotation(gua: GuaData): string {
  const notes = [`${gua.element.toLowerCase()} phase`, `no.${gua.number} of 64`, gua.fortuneEn.toLowerCase()];
  return notes[(gua.number * 3) % notes.length];
}

function trembleBorder(x: number, y: number, w: number, h: number, jitter: number, seed: number): string {
  const j = (n: number) => {
    const s = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
    return (s - Math.floor(s) - 0.5) * jitter;
  };
  return `M ${x + j(0)} ${y + j(1)} L ${x + w + j(2)} ${y + j(3)} L ${x + w + j(4)} ${y + h + j(5)} L ${x + j(6)} ${y + h + j(7)} Z`;
}

function cornerOrnament(x: number, y: number, variant: number): string {
  const sizes = [[12, 3, 12], [10, 4, 10], [14, 2, 10], [11, 3, 11]];
  const [a, b, c] = sizes[variant % 4];
  return `M ${x} ${y} L ${x + a} ${y} L ${x + a} ${y + b} L ${x + b} ${y + b} L ${x + b} ${y + c} L ${x} ${y + c} Z`;
}

// ─── SVG Builder ───
export function buildTalismanHtml(gua: GuaData): string {
  const W = 400;
  const H = 640;
  const cx = W / 2;
  const m = Math.min(W, H) * 0.07;
  const seed = gua.number;

  const heavenH = H * 0.18;
  const humanH = H * 0.55;
  const earthH = H * 0.27;
  const heavenY = m + 4;
  const humanY = heavenY + heavenH;
  const earthY = humanY + humanH;

  const uid = `sigil-${gua.number}`;

  // ─── Asset Selection ───
  const bgTexture = TEXTURE_POOL[seed % TEXTURE_POOL.length];
  const newTextureAsset = TEXTURE_POOL[seed % TEXTURE_POOL.length];

  const ELEMENT_PATTERN_MAP: Record<string, number[]> = {
    '金': [0, 1, 2, 3],
    '木': [3, 4, 5, 6, 10],
    '水': [17, 8, 9, 11],
    '火': [12, 13, 14, 15],
    '土': [16, 5, 6, 0],
  };
  const patternPrefs = ELEMENT_PATTERN_MAP[gua.element] || [0];
  const newPatternAsset = PATTERN_POOL[patternPrefs[seed % patternPrefs.length]];
  const newCalligraphyAsset = CALLIGRAPHY_POOL[seed % CALLIGRAPHY_POOL.length];
  const newSealHeaven = SEAL_POOL[seed % SEAL_POOL.length];
  const newSealEarth = SEAL_POOL[(seed + 1) % SEAL_POOL.length];

  // ─── Inline Images ───
  const bgTextureData = bgTexture ? fileToBase64(bgTexture) : null;
  const newTextureData = newTextureAsset ? fileToBase64(newTextureAsset) : null;
  const newPatternData = newPatternAsset ? fileToBase64(newPatternAsset) : null;
  const newCalligraphyData = newCalligraphyAsset ? fileToBase64(newCalligraphyAsset) : null;
  const newSealHeavenData = newSealHeaven ? fileToBase64(newSealHeaven) : null;
  const newSealEarthData = newSealEarth ? fileToBase64(newSealEarth) : null;

  // ─── Yao Lines ───
  const lowerLines = TRIGRAM_LINES[gua.lower] || TRIGRAM_LINES['乾'];
  const upperLines = TRIGRAM_LINES[gua.upper] || TRIGRAM_LINES['乾'];
  const sixLines = [...lowerLines, ...upperLines];

  const yaoStartY = humanY + humanH * 0.48;
  const yaoGap = Math.min(10, humanH * 0.028);
  const yaoSeg = Math.min(40, W * 0.1);

  // ─── Borders ───
  const bOuter = trembleBorder(m, m, W - m * 2, H - m * 2, 1.8, seed);
  const bInner = trembleBorder(m + 7, m + 7, W - m * 2 - 14, H - m * 2 - 14, 1.2, seed + 100);

  const corners = [
    { x: m + 5, y: m + 5, r: 0, v: 0 },
    { x: W - m - 5, y: m + 5, r: 90, v: 1 },
    { x: m + 5, y: H - m - 5, r: 270, v: 2 },
    { x: W - m - 5, y: H - m - 5, r: 180, v: 3 },
  ];

  // ─── Vertical tremble lines ───
  const vLineLeftX = m + 22;
  const vLineRightX = W - m - 22;
  const vLineY1 = heavenY + heavenH * 0.6;
  const vLineY2 = humanY + humanH * 0.9;

  // ─── Tagline & Keywords ───
  const tagline = getTagline(gua);
  const keywords = gua.keywordsEn.slice(0, 3);
  const archiveId = getArchiveId(gua);
  const annotation = getAnnotation(gua);

  // ─── SVG Assembly ───
  const svgParts: string[] = [];

  // defs
  svgParts.push(`<defs>
    <filter id="paper-${uid}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="5" seed="${seed}" result="noise"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.08 0" in="noise" result="coloredNoise"/>
      <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite"/>
      <feBlend mode="multiply" in="composite" in2="SourceGraphic"/>
    </filter>
    <filter id="brush-${uid}">
      <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="4" seed="${seed + 50}" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="seal-${uid}">
      <feTurbulence type="turbulence" baseFrequency="0.07" numOctaves="5" seed="${seed + 200}" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="scan-noise-${uid}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="turbulence" baseFrequency="0.8" numOctaves="3" seed="${seed + 300}" result="noise"/>
      <feColorMatrix type="matrix" values="0.5 0 0 0 0 0 0.5 0 0 0 0 0 0.5 0 0 0 0 0 0.15 0" in="noise" result="grayNoise"/>
      <feComposite operator="in" in="grayNoise" in2="SourceGraphic" result="composite"/>
      <feBlend mode="overlay" in="composite" in2="SourceGraphic"/>
    </filter>
    <filter id="bleed-${uid}">
      <feGaussianBlur stdDeviation="1.2" result="blur"/>
      <feColorMatrix type="matrix" values="0.8 0 0 0 0 0 0.8 0 0 0 0 0 0.9 0 0 0 0 0 0.4 0" in="blur" result="bleed"/>
      <feMerge><feMergeNode in="bleed"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-${uid}">
      <feGaussianBlur stdDeviation="1.8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="unreadable-seal-${uid}">
      <feTurbulence type="turbulence" baseFrequency="0.15" numOctaves="4" seed="${seed + 400}" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
      <feGaussianBlur in="displaced" stdDeviation="1.2" result="blurred"/>
      <feMerge><feMergeNode in="blurred"/></feMerge>
    </filter>
    <filter id="shadow-${uid}">
      <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="${PALETTE.ink}" floodOpacity="0.12"/>
    </filter>
    <pattern id="scan-${uid}" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
      <line x1="0" y1="2" x2="4" y2="2" stroke="${PALETTE.ink}" stroke-width="0.5" opacity="0.035"/>
    </pattern>
    <radialGradient id="paper-grad-${uid}" cx="50%" cy="45%" r="75%">
      <stop offset="0%" stop-color="${PALETTE.paper}" stop-opacity="1"/>
      <stop offset="50%" stop-color="${PALETTE.paperDark}" stop-opacity="1"/>
      <stop offset="85%" stop-color="${PALETTE.paperEdge}" stop-opacity="1"/>
      <stop offset="100%" stop-color="#C4B8A0" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="edge-grad-${uid}" cx="50%" cy="50%" r="70%">
      <stop offset="60%" stop-color="transparent" stop-opacity="0"/>
      <stop offset="100%" stop-color="${PALETTE.ink}" stop-opacity="0.1"/>
    </radialGradient>
    <radialGradient id="vignette-${uid}" cx="50%" cy="50%" r="65%">
      <stop offset="50%" stop-color="transparent" stop-opacity="0"/>
      <stop offset="100%" stop-color="${PALETTE.ink}" stop-opacity="0.05"/>
    </radialGradient>
  </defs>`);

  // Background layers
  svgParts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="#C4B8A0"/>`);
  svgParts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="url(#paper-grad-${uid})"/>`);
  svgParts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PALETTE.paper}" filter="url(#paper-${uid})" opacity="0.5"/>`);

  if (bgTextureData) {
    svgParts.push(`<image href="${bgTextureData}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" opacity="0.22"/>`);
  }

  svgParts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${PALETTE.paperDark}" filter="url(#scan-noise-${uid})" opacity="0.3"/>`);

  if (newTextureData) {
    svgParts.push(`<image href="${newTextureData}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" opacity="0.12"/>`);
  }
  if (newPatternData) {
    svgParts.push(`<image href="${newPatternData}" x="${m}" y="${m}" width="${W - m * 2}" height="${H - m * 2}" preserveAspectRatio="xMidYMid slice" opacity="0.06"/>`);
  }

  svgParts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="url(#edge-grad-${uid})"/>`);
  svgParts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="url(#vignette-${uid})"/>`);
  svgParts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="url(#scan-${uid})" opacity="0.4"/>`);

  // Borders
  svgParts.push(`<path d="${bOuter}" fill="none" stroke="${PALETTE.ink}" stroke-width="1.6" stroke-opacity="0.5" stroke-linecap="round" stroke-linejoin="round"/>`);
  svgParts.push(`<path d="${bInner}" fill="none" stroke="${PALETTE.ink}" stroke-width="0.7" stroke-opacity="0.22" stroke-linecap="round" stroke-linejoin="round"/>`);

  corners.forEach(({ x, y, r, v }) => {
    const d = cornerOrnament(x, y, v);
    svgParts.push(`<g transform="rotate(${r}, ${x}, ${y})"><path d="${d}" fill="none" stroke="${PALETTE.ink}" stroke-width="0.9" stroke-opacity="0.3" stroke-linecap="round" stroke-linejoin="round"/></g>`);
  });

  // ─── Heaven Section ───
  // Cloud ornament
  svgParts.push(`<g transform="translate(${cx}, ${heavenY + heavenH * 0.18})" opacity="0.3">
    <path d="M -30 0 Q -20 -8 -10 0 Q 0 -6 10 0 Q 20 -8 30 0" fill="none" stroke="${PALETTE.ink}" stroke-width="1" stroke-linecap="round"/>
    <path d="M -20 4 Q -10 0 0 4 Q 10 0 20 4" fill="none" stroke="${PALETTE.ink}" stroke-width="0.6" stroke-opacity="0.5"/>
  </g>`);

  // Brand mark
  svgParts.push(`<text x="${cx}" y="${heavenY + heavenH * 0.42}" text-anchor="middle" fill="${PALETTE.ink}" font-size="6" font-family="monospace" letter-spacing="4" opacity="0.2">MANIFEST DAO</text>`);

  // Wax seal
  svgParts.push(`<g transform="translate(${cx + 1.5}, ${heavenY + heavenH * 0.72})" filter="url(#unreadable-seal-${uid})">
    <ellipse cx="0" cy="0" rx="28" ry="24" fill="none" stroke="${PALETTE.cinnabar}" stroke-width="2" opacity="0.7"/>
    <ellipse cx="0" cy="0" rx="24" ry="20" fill="none" stroke="${PALETTE.cinnabar}" stroke-width="0.6" opacity="0.3"/>
    <text x="0" y="2" text-anchor="middle" dominant-baseline="middle" fill="${PALETTE.cinnabar}" font-size="9" font-family="serif" font-weight="bold" letter-spacing="2" opacity="0.85">天官賜福</text>
    ${newSealHeavenData ? `<image href="${newSealHeavenData}" x="-22" y="-18" width="44" height="36" preserveAspectRatio="xMidYMid meet" opacity="0.65" filter="url(#seal-${uid})"/>` : ''}
  </g>`);

  // Archive ID
  svgParts.push(`<text x="${cx}" y="${heavenY + heavenH * 0.68}" text-anchor="middle" fill="${PALETTE.ink}" font-size="5.5" font-family="monospace" letter-spacing="3" opacity="0.18">${archiveId}</text>`);

  // Element label
  svgParts.push(`<text x="${W - m - 8}" y="${heavenY + heavenH * 0.35}" text-anchor="end" fill="${PALETTE.ink}" font-size="6" font-family="monospace" letter-spacing="2" opacity="0.18">${gua.element.toUpperCase()}</text>`);

  // Divider
  svgParts.push(`<line x1="${cx - 35}" y1="${heavenY + heavenH * 0.82}" x2="${cx + 35}" y2="${heavenY + heavenH * 0.82}" stroke="${PALETTE.ink}" stroke-width="0.5" stroke-opacity="0.12" stroke-dasharray="3,2"/>`);

  // ─── Human Section ───
  // Hexagram symbol
  svgParts.push(`<text x="${cx}" y="${humanY + humanH * 0.18}" text-anchor="middle" fill="${PALETTE.ink}" font-size="${Math.min(46, W * 0.12)}" font-family="serif" opacity="0.85" filter="url(#glow-${uid})">${gua.symbol}</text>`);

  // Calligraphy overlay
  if (newCalligraphyData) {
    svgParts.push(`<image href="${newCalligraphyData}" x="${cx - W * 0.3}" y="${humanY + humanH * 0.28}" width="${W * 0.6}" height="${humanH * 0.35}" preserveAspectRatio="xMidYMid meet" opacity="0.28" filter="url(#bleed-${uid})"/>`);
  }

  // Vertical tremble lines
  svgParts.push(`<line x1="${vLineLeftX}" y1="${vLineY1}" x2="${vLineLeftX + (seed % 3 - 1) * 0.8}" y2="${vLineY2}" stroke="${PALETTE.ink}" stroke-width="0.6" stroke-opacity="0.15" stroke-linecap="round" filter="url(#brush-${uid})"/>`);
  svgParts.push(`<line x1="${vLineRightX}" y1="${vLineY1}" x2="${vLineRightX + (seed % 5 - 2) * 0.6}" y2="${vLineY2}" stroke="${PALETTE.ink}" stroke-width="0.6" stroke-opacity="0.15" stroke-linecap="round" filter="url(#brush-${uid})"/>`);

  // Six Yao lines
  svgParts.push(`<g transform="translate(${cx}, ${yaoStartY})">`);
  sixLines.forEach((lineType, i) => {
    const y = i * yaoGap;
    if (lineType === 'yang') {
      svgParts.push(`<line x1="${-yaoSeg}" y1="${y}" x2="${yaoSeg}" y2="${y}" stroke="${PALETTE.ink}" stroke-width="1.8" stroke-opacity="0.55" stroke-linecap="round"/>`);
    } else {
      const gap = Math.min(8, yaoSeg * 0.2);
      svgParts.push(`<line x1="${-yaoSeg}" y1="${y}" x2="${-gap}" y2="${y}" stroke="${PALETTE.ink}" stroke-width="1.8" stroke-opacity="0.45" stroke-linecap="round"/>`);
      svgParts.push(`<line x1="${gap}" y1="${y}" x2="${yaoSeg}" y2="${y}" stroke="${PALETTE.ink}" stroke-width="1.8" stroke-opacity="0.45" stroke-linecap="round"/>`);
    }
  });
  svgParts.push(`</g>`);

  // English name
  const nameEnSize = gua.nameEn.length > 18 ? 13 : 15;
  svgParts.push(`<text x="${cx}" y="${humanY + humanH * 0.72}" text-anchor="middle" fill="${PALETTE.ink}" font-size="${nameEnSize}" font-family="cursive, serif" font-weight="600" letter-spacing="1" opacity="0.8" filter="url(#brush-${uid})">${gua.nameEn}</text>`);

  // Edgy tagline
  svgParts.push(`<text x="${cx}" y="${humanY + humanH * 0.84}" text-anchor="middle" fill="${PALETTE.cinnabar}" font-size="${Math.min(12, W * 0.035)}" font-family="cursive, serif" font-weight="bold" letter-spacing="1.5" opacity="0.82" filter="url(#brush-${uid})">${tagline}</text>`);

  // Divider
  svgParts.push(`<line x1="${cx - 30}" y1="${humanY + humanH * 0.97}" x2="${cx + 30}" y2="${humanY + humanH * 0.97}" stroke="${PALETTE.ink}" stroke-width="0.5" stroke-opacity="0.1"/>`);

  // ─── Earth Section ───
  // Corner seal
  svgParts.push(`<g transform="translate(${W - m - 28}, ${earthY + earthH * 0.35})" filter="url(#unreadable-seal-${uid})">
    <rect x="-13" y="-11" width="26" height="22" fill="none" stroke="${PALETTE.cinnabar}" stroke-width="1.4" opacity="0.6" rx="1"/>
    <text x="0" y="2" text-anchor="middle" dominant-baseline="middle" fill="${PALETTE.cinnabar}" font-size="7" font-family="serif" font-weight="bold" letter-spacing="1" opacity="0.8">開運</text>
    ${newSealEarthData ? `<image href="${newSealEarthData}" x="-12" y="-10" width="24" height="20" preserveAspectRatio="xMidYMid meet" opacity="0.65" filter="url(#seal-${uid})"/>` : ''}
  </g>`);

  // Keywords
  if (keywords.length > 0) {
    svgParts.push(`<text x="${cx}" y="${earthY + earthH * 0.45}" text-anchor="middle" fill="${PALETTE.ink}" font-size="6.5" font-family="monospace" letter-spacing="3.5" opacity="0.32">${keywords.join(' · ').toUpperCase()}</text>`);
  }

  // Annotation
  if (annotation) {
    svgParts.push(`<text x="${m + 10}" y="${earthY + earthH * 0.55}" fill="${PALETTE.ink}" font-size="6" font-family="cursive, serif" opacity="0.22">${annotation}</text>`);
  }

  // Bottom brand
  svgParts.push(`<text x="${cx}" y="${earthY + earthH * 0.72}" text-anchor="middle" fill="${PALETTE.ink}" font-size="5.5" font-family="monospace" letter-spacing="3" opacity="0.15">MYSTIC DAO</text>`);

  // Bottom line
  svgParts.push(`<line x1="${cx - 25}" y1="${earthY + earthH * 0.82}" x2="${cx + 25}" y2="${earthY + earthH * 0.82}" stroke="${PALETTE.ink}" stroke-width="0.5" stroke-opacity="0.12"/>`);

  // Blessing theme
  svgParts.push(`<text x="${cx}" y="${earthY + earthH * 0.92}" text-anchor="middle" fill="${PALETTE.ink}" font-size="6" font-family="serif" opacity="0.2">${gua.name} · ${gua.element}行</text>`);

  const svgContent = svgParts.join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${W}px;
      height: ${H}px;
      background: ${PALETTE.paper};
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg { display: block; }
  </style>
</head>
<body>
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${svgContent}
  </svg>
</body>
</html>`;
}
