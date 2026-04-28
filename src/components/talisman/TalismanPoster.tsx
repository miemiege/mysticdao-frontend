/**
 * TalismanPoster v9.1 — Digital Manuscript Aesthetic
 *
 * Brand Visual Director's Final Ruling applied:
 * - Warm rice paper base #F9F4ED (brand soul, never diluted)
 * - Calligraphy black #1A1A1A (handmade ink aesthetic)
 * - Seals PRESERVED but UNREADABLE: blur + displacement = visual texture
 * - Vertical tremble lines RESTORED as aesthetic backbone
 * - Cloud motif RESTORED (oriental talisman DNA)
 * - Brand mark MANIFEST DAO restored
 * - Pseudo-symbol system REMOVED (over-engineered)
 * - De-AI + Cyber parameters retained from v9.0
 * - "Student posture" copy retained
 * - Wilhelm-Baynes academic lineage retained
 */

import React from "react";
import { GUA64_LIST } from "../../data/gua64";
import {
  PALETTE,
  FONTS,
  getEdgyTagline,
  getShortPhrase,
  getArchiveId,
  getAnnotation,
  calcLayout,
  trembleBorder,
  cornerOrnament,
  getElementCyberColor,
  DE_AI,
} from "../../lib/talisman-design";

interface Props {
  hexagramName: string;
  score?: number;
  width?: number;
  height?: number;
  showSeal?: boolean;
  /** Optional: override with cyberpunk mode */
  cyberMode?: boolean;
  /** Design variant: 'lantern-core' for Li-A special treatment */
  variant?: 'default' | 'lantern-core';
  /** Use new curated asset library (自己整理z素材库) */
  useNewAssets?: boolean;
}

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

const TalismanPoster: React.FC<Props> = ({
  hexagramName,
  score: _score = 75,
  width = 400,
  height = 640,
  showSeal = true,
  cyberMode = true,
  variant = 'default',
  useNewAssets = true,
}) => {
  const isLantern = variant === 'lantern-core' && hexagramName.includes('离');
  /* ─── Data lookup ─── */
  const gua = GUA64_LIST.find((g) => g.name === hexagramName);
  const upper = gua?.upper || "乾";
  const symbol = gua?.symbol || "䷀";
  const element = gua?.element || "金";
  const cyberColor = getElementCyberColor(element);

  const edgyTagline = getEdgyTagline(gua);
  const shortPhrase = getShortPhrase(gua);
  const archiveId = getArchiveId(gua);
  const annotation = getAnnotation(gua);
  const keywords = (gua?.keywordsEn || []).slice(0, 3);

  const lowerLines = gua?.lower
    ? TRIGRAM_LINES[gua.lower] || TRIGRAM_LINES["乾"]
    : TRIGRAM_LINES["乾"];
  const upperLines = TRIGRAM_LINES[upper] || TRIGRAM_LINES["乾"];
  const sixLines = [...lowerLines, ...upperLines];

  /* ─── Layout ─── */
  let { W, H, cx, m, heavenY, heavenH, humanY, humanH, earthY, earthH } =
    calcLayout(width, height);

  /* Lantern-core: override proportions for Li-A "Inner Lantern" */
  if (isLantern) {
    heavenH = H * 0.25;
    humanH = H * 0.48;
    earthH = H * 0.27;
    heavenY = m + 4;
    humanY = heavenY + heavenH;
    earthY = humanY + humanH;
  }

  const uid = `sigil-${hexagramName}-${W}-${H}-${variant}`;
  const seed = gua?.number || 0;

  /* ─── Background texture selection (deterministic per hexagram) ─── */
  const bgPool = [
    ...Array.from({ length: 500 }, (_, i) => `/talisman-assets/processed/calligraphy_${String(i).padStart(4, '0')}.jpg`),
    ...Array.from({ length: 200 }, (_, i) => `/talisman-assets/processed/charm_${String(i).padStart(4, '0')}.jpg`),
  ];
  const bgIndex = seed % bgPool.length;
  const bgTexture = bgPool[bgIndex];

  /* ─── New Curated Asset Pool (自己整理z素材库) ─── */
  const NEW_BASE = '/talisman-assets/自己整理z素材库';
  const CALLIGRAPHY_POOL = [
    'calligraphy/calligraphy_0000.jpg','calligraphy/calligraphy_0003.jpg','calligraphy/calligraphy_0005.jpg','calligraphy/calligraphy_0007.jpg','calligraphy/calligraphy_0008.jpg','calligraphy/calligraphy_0009.jpg','calligraphy/calligraphy_0011.jpg','calligraphy/calligraphy_0012.jpg','calligraphy/calligraphy_0016.jpg','calligraphy/calligraphy_0019.jpg','calligraphy/calligraphy_0020.jpg','calligraphy/calligraphy_0022.jpg','calligraphy/calligraphy_0027.jpg','calligraphy/calligraphy_0029.jpg','calligraphy/calligraphy_0031.jpg','calligraphy/calligraphy_0032.jpg','calligraphy/calligraphy_0034.jpg','calligraphy/calligraphy_0037.jpg','calligraphy/calligraphy_0039.jpg','calligraphy/calligraphy_0041.jpg','calligraphy/calligraphy_0042.jpg','calligraphy/calligraphy_0045.jpg','calligraphy/calligraphy_0046.jpg','calligraphy/calligraphy_0048.jpg',
  ];
  const PATTERN_POOL = [
    'pattern/pattern_0056.png','pattern/pattern_0058.png','pattern/pattern_0059.png','pattern/pattern_0060.png','pattern/pattern_0061.png','pattern/pattern_0064.png','pattern/pattern_0065.png','pattern/pattern_0067.png','pattern/pattern_0068.png','pattern/pattern_0069.png','pattern/pattern_0070.png','pattern/pattern_0071.png','pattern/pattern_0072.png','pattern/pattern_0073.png','pattern/pattern_0074.png','pattern/pattern_0075.png','pattern/pattern_0081.png','pattern/pattern_0082.png',
  ];
  const SEAL_POOL = ['seal/seal_0050.png','seal/seal_0051.png'];
  const TEXTURE_POOL = ['texture/texture_0053.jpg'];

  const ELEMENT_PATTERN_MAP: Record<string, number[]> = {
    '金': [0,1,2,3],
    '木': [3,4,5,6,10],
    '水': [17,8,9,11],
    '火': [12,13,14,15],
    '土': [16,5,6,0],
  };

  const newTextureAsset = useNewAssets ? `${NEW_BASE}/${TEXTURE_POOL[0]}` : null;
  const patternPrefs = ELEMENT_PATTERN_MAP[element] || [0];
  const newPatternAsset = useNewAssets
    ? `${NEW_BASE}/${PATTERN_POOL[patternPrefs[seed % patternPrefs.length]]}`
    : null;
  const newCalligraphyAsset = useNewAssets
    ? `${NEW_BASE}/${CALLIGRAPHY_POOL[seed % CALLIGRAPHY_POOL.length]}`
    : null;
  const newSealHeaven = useNewAssets
    ? `${NEW_BASE}/${SEAL_POOL[seed % SEAL_POOL.length]}`
    : null;
  const newSealEarth = useNewAssets
    ? `${NEW_BASE}/${SEAL_POOL[(seed + 1) % SEAL_POOL.length]}`
    : null;

  /* ─── Border paths with controlled randomness ─── */
  const bOuter = trembleBorder(m, m, W - m * 2, H - m * 2, 1.8, seed);
  const bInner = trembleBorder(
    m + 7,
    m + 7,
    W - m * 2 - 14,
    H - m * 2 - 14,
    1.2,
    seed + 100
  );

  /* ─── Deterministic corner positions (asymmetric) ─── */
  const corners = [
    { x: m + 5, y: m + 5, r: 0, v: 0 },
    { x: W - m - 5, y: m + 5, r: 90, v: 1 },
    { x: m + 5, y: H - m - 5, r: 270, v: 2 },
    { x: W - m - 5, y: H - m - 5, r: 180, v: 3 },
  ];

  /* ─── Yao line rendering ─── */
  const yaoStartY = humanY + humanH * 0.48;
  const yaoGap = Math.min(10, humanH * 0.028);
  const yaoSeg = Math.min(40, W * 0.1);

  /* ─── Vertical tremble lines (aesthetic backbone, not text) ─── */
  const vLineLeftX = m + 22;
  const vLineRightX = W - m - 22;
  const vLineY1 = heavenY + heavenH * 0.6;
  const vLineY2 = humanY + humanH * 0.9;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", fontFamily: FONTS.english }}
    >
      <defs>
        {/* ═══ Paper Fiber Texture ═══ */}
        <filter id={`paper-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={DE_AI.paperTurbulence.baseFrequency}
            numOctaves={DE_AI.paperTurbulence.numOctaves}
            seed={seed}
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0"
            in="noise"
            result="coloredNoise"
          />
          <feComposite
            operator="in"
            in="coloredNoise"
            in2="SourceGraphic"
            result="composite"
          />
          <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
        </filter>

        {/* ═══ Brush Flying-White: ink irregularity ═══ */}
        <filter id={`brush-${uid}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={DE_AI.brushDisplacement.baseFrequency}
            numOctaves={DE_AI.brushDisplacement.numOctaves}
            seed={seed + 50}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={DE_AI.brushDisplacement.scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* ═══ Seal Weathering: stamp mottling ═══ */}
        <filter id={`seal-${uid}`}>
          <feTurbulence
            type="turbulence"
            baseFrequency={DE_AI.sealTurbulence.baseFrequency}
            numOctaves={DE_AI.sealTurbulence.numOctaves}
            seed={seed + 200}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={DE_AI.sealTurbulence.scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* ═══ Scan Noise Layer (v9 de-AI enhancement) ═══ */}
        <filter id={`scan-noise-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="turbulence"
            baseFrequency={DE_AI.scanNoise.baseFrequency}
            numOctaves={DE_AI.scanNoise.numOctaves}
            seed={seed + 300}
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="0.5 0 0 0 0  0 0.5 0 0 0  0 0 0.5 0 0  0 0 0 0.15 0"
            in="noise"
            result="grayNoise"
          />
          <feComposite operator="in" in="grayNoise" in2="SourceGraphic" result="composite" />
          <feBlend mode="overlay" in="composite" in2="SourceGraphic" />
        </filter>

        {/* ═══ Ink Bleed: simulated paper absorption (v9) ═══ */}
        <filter id={`bleed-${uid}`}>
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feColorMatrix
            type="matrix"
            values="0.8 0 0 0 0  0 0.8 0 0 0  0 0 0.9 0 0  0 0 0 0.4 0"
            in="blur"
            result="bleed"
          />
          <feMerge>
            <feMergeNode in="bleed" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ═══ Selective Neon Glow (subtle, single element) ═══ */}
        <filter id={`neon-${uid}`}>
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feFlood floodColor={cyberColor} floodOpacity="0.5" result="color" />
          <feComposite operator="in" in="color" in2="blur" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ═══ Soft Glow ═══ */}
        <filter id={`glow-${uid}`}>
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ═══ Energy Core Glow: intense golden radiance ═══ */}
        <filter id={`core-glow-${uid}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#FFD700" floodOpacity="0.5" result="color" />
          <feComposite operator="in" in="color" in2="blur" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ═══ Seal Filter: lantern-core = readable + handmade texture; default = unreadable ═══ */}
        {isLantern ? (
          <filter id={`unreadable-seal-${uid}`}>
            <feTurbulence
              type="turbulence"
              baseFrequency="0.15"
              numOctaves="4"
              seed={seed + 400}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="9"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feMerge>
              <feMergeNode in="displaced" />
            </feMerge>
          </filter>
        ) : (
          <filter id={`unreadable-seal-${uid}`}>
            <feTurbulence
              type="turbulence"
              baseFrequency="0.15"
              numOctaves="4"
              seed={seed + 400}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="1.2" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
            </feMerge>
          </filter>
        )}

        {/* ═══ Drop Shadow: heavy blur + displacement ═══ */}
        <filter id={`unreadable-seal-${uid}`}>
          <feTurbulence
            type="turbulence"
            baseFrequency="0.15"
            numOctaves="4"
            seed={seed + 400}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="1.2" result="blurred" />
          <feMerge>
            <feMergeNode in="blurred" />
          </feMerge>
        </filter>

        {/* ═══ Drop Shadow for physical depth ═══ */}
        <filter id={`shadow-${uid}`}>
          <feDropShadow
            dx="1"
            dy="2"
            stdDeviation="2"
            floodColor={PALETTE.ink}
            floodOpacity="0.12"
          />
        </filter>

        {/* ═══ Scan Lines Pattern (v9: opacity 0.35-0.4) ═══ */}
        <pattern
          id={`scan-${uid}`}
          x="0"
          y="0"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="2" x2="4" y2="2" stroke={PALETTE.ink} strokeWidth="0.5" opacity="0.035" />
        </pattern>

        {/* ═══ Paper Aging Radial Gradient (Tea Wash) ═══ */}
        <radialGradient id={`paper-grad-${uid}`} cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor={PALETTE.paper} stopOpacity="1" />
          <stop offset="50%" stopColor={PALETTE.paperDark} stopOpacity="1" />
          <stop offset="85%" stopColor={PALETTE.paperEdge} stopOpacity="1" />
          <stop offset="100%" stopColor={PALETTE.paperShadow} stopOpacity="1" />
        </radialGradient>

        {/* ═══ Edge Darkening for vintage feel ═══ */}
        <radialGradient id={`edge-grad-${uid}`} cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor={PALETTE.transparent} stopOpacity="0" />
          <stop offset="100%" stopColor={PALETTE.ink} stopOpacity="0.1" />
        </radialGradient>

        {/* ═══ Vignette for focus ═══ */}
        <radialGradient id={`vignette-${uid}`} cx="50%" cy="50%" r="65%">
          <stop offset="50%" stopColor={PALETTE.transparent} stopOpacity="0" />
          <stop offset="100%" stopColor={PALETTE.ink} stopOpacity="0.05" />
        </radialGradient>

        {/* ═══ Lantern Glow: radial warm gold emanation (Li-A only) ═══ */}
        {isLantern && (
          <radialGradient id={`lantern-glow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.38" />
            <stop offset="40%" stopColor="#FFD700" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  BACKGROUND LAYER: Tea Wash paper + texture + scan lines    ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      <rect x="0" y="0" width={W} height={H} fill={PALETTE.paperShadow} />
      <rect x="0" y="0" width={W} height={H} fill={`url(#paper-grad-${uid})`} />
      {/* Paper fiber texture */}
      <rect x="0" y="0" width={W} height={H} fill={PALETTE.paper} filter={`url(#paper-${uid})`} opacity={isLantern ? "0.15" : "0.5"} />
      {/* Generated calligraphy texture — deterministic per hexagram */}
      <image
        href={bgTexture}
        x="0"
        y="0"
        width={W}
        height={H}
        preserveAspectRatio="xMidYMid slice"
        opacity={isLantern ? (useNewAssets ? "0" : "0.38") : (useNewAssets ? "0" : "0.22")}
      />
      {/* Scan noise layer (v9 de-AI) */}
      <rect x="0" y="0" width={W} height={H} fill={PALETTE.paperDark} filter={`url(#scan-noise-${uid})`} opacity={isLantern ? "0.15" : "0.3"} />
      {/* Curated texture overlay (自己整理z素材库) — low opacity keeps warm rice-paper base dominant */}
      {newTextureAsset && (
        <image
          href={newTextureAsset}
          x="0"
          y="0"
          width={W}
          height={H}
          preserveAspectRatio="xMidYMid slice"
          opacity={isLantern ? "0.08" : "0.12"}
        />
      )}
      {newPatternAsset && (
        <image
          href={newPatternAsset}
          x={m}
          y={m}
          width={W - m * 2}
          height={H - m * 2}
          preserveAspectRatio="xMidYMid slice"
          opacity={isLantern ? "0.04" : "0.06"}
        />
      )}
      {/* Edge darkening -->
      <rect x="0" y="0" width={W} height={H} fill={`url(#edge-grad-${uid})`} />
      {/* Vignette */}
      <rect x="0" y="0" width={W} height={H} fill={`url(#vignette-${uid})`} />
      {/* Scan lines overlay (v9: reduced opacity 0.35-0.4) */}
      {cyberMode && (
        <rect x="0" y="0" width={W} height={H} fill={`url(#scan-${uid})`} opacity="0.4" />
      )}

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  BORDER LAYER: Hand-drawn trembling + asymmetric corners    ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      {/* Outer trembling frame */}
      <path
        d={bOuter}
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth="1.6"
        strokeOpacity="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner frame */}
      <path
        d={bInner}
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth="0.7"
        strokeOpacity="0.22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Asymmetric corner ornaments */}
      {corners.map(({ x, y, r, v }, i) => (
        <g key={i} transform={`rotate(${r}, ${x}, ${y})`}>
          <path
            d={cornerOrnament(x, y, r, v)}
            fill="none"
            stroke={PALETTE.ink}
            strokeWidth="0.9"
            strokeOpacity="0.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
      {/* Cyber border glow (subtle, single layer) */}
      {cyberMode && (
        <path
          d={bOuter}
          fill="none"
          stroke={cyberColor}
          strokeWidth="0.8"
          strokeOpacity="0.12"
          filter={`url(#neon-${uid})`}
        />
      )}

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  HEAVEN SECTION (~18%): Cloud + Brand + Archive ID         ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      {/* Cloud / Flame top ornament — lantern-core uses calligraphic flame strokes */}
      {isLantern ? (
        <g transform={`translate(${cx}, ${heavenY + heavenH * 0.22})`} opacity="0.8">
          {/* Primary flame tongues — burgundy #9B2335, bold and reaching */}
          <path d="M 0 10 Q -4 -18 0 -30 Q 4 -18 0 10" fill="none" stroke="#9B2335" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
          <path d="M -16 8 Q -22 -12 -16 -24 Q -10 -12 -16 8" fill="none" stroke="#9B2335" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
          <path d="M 16 8 Q 10 -12 16 -24 Q 22 -12 16 8" fill="none" stroke="#9B2335" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
          {/* Secondary flame tongues — cinnabar #c41e1e, mid layer */}
          <path d="M -8 6 Q -12 -8 -8 -16 Q -4 -8 -8 6" fill="none" stroke="#c41e1e" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
          <path d="M 8 6 Q 4 -8 8 -16 Q 12 -8 8 6" fill="none" stroke="#c41e1e" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
          {/* Outer spreading flames — reaching outward, breaking frame */}
          <path d="M -26 4 Q -34 -6 -28 -14" fill="none" stroke="#9B2335" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
          <path d="M 26 4 Q 34 -6 28 -14" fill="none" stroke="#9B2335" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
          <path d="M -20 8 Q -28 2 -24 -6" fill="none" stroke="#c41e1e" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
          <path d="M 20 8 Q 28 2 24 -6" fill="none" stroke="#c41e1e" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
          {/* Inner core flickers — gold accents */}
          <path d="M -5 4 Q -7 -8 -5 -12" fill="none" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <path d="M 5 4 Q 7 -8 5 -12" fill="none" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <path d="M 0 6 Q 0 -10 0 -16" fill="none" stroke="#FFD700" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
          {/* Sparks */}
          <circle cx="-6" cy="-20" r="0.8" fill="#FFD700" opacity="0.7" />
          <circle cx="8" cy="-16" r="0.6" fill="#FFD700" opacity="0.6" />
          <circle cx="0" cy="-28" r="1" fill="#FFD700" opacity="0.8" />
        </g>
      ) : (
        <g transform={`translate(${cx}, ${heavenY + heavenH * 0.18})`} opacity="0.3">
          <path d="M -30 0 Q -20 -8 -10 0 Q 0 -6 10 0 Q 20 -8 30 0" fill="none" stroke={PALETTE.ink} strokeWidth="1" strokeLinecap="round" />
          <path d="M -20 4 Q -10 0 0 4 Q 10 0 20 4" fill="none" stroke={PALETTE.ink} strokeWidth="0.6" strokeOpacity="0.5" />
        </g>
      )}

      {/* Brand mark — MANIFEST DAO, subtle archival feel */}
      <text
        x={cx}
        y={heavenY + heavenH * 0.42}
        textAnchor="middle"
        fill={PALETTE.ink}
        fontSize="6"
        fontFamily={FONTS.mono}
        letterSpacing="4"
        opacity="0.2"
      >
        MANIFEST DAO
      </text>

      {/* Wax seal (天官賜福) — lantern-core: clear + textured; default: unreadable texture */}
      {showSeal && (
        <g
          transform={`translate(${cx + 1.5}, ${heavenY + heavenH * 0.72})`}
          filter={`url(#unreadable-seal-${uid})`}
        >
          <ellipse cx="0" cy="0" rx="28" ry="24" fill="none" stroke={isLantern ? "#c41e1e" : PALETTE.cinnabar} strokeWidth="2" opacity={isLantern ? "0.8" : "0.7"} />
          <ellipse cx="0" cy="0" rx="24" ry="20" fill="none" stroke={isLantern ? "#c41e1e" : PALETTE.cinnabar} strokeWidth="0.6" opacity={isLantern ? "0.5" : "0.3"} />
          <text
            x="0"
            y="2"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={isLantern ? "#c41e1e" : PALETTE.cinnabar}
            fontSize="9"
            fontFamily={FONTS.chinese}
            fontWeight="bold"
            letterSpacing="2"
            opacity={isLantern ? "0.9" : "0.85"}
          >
            天官賜福
          </text>
          {newSealHeaven && (
            <image
              href={newSealHeaven}
              x="-22"
              y="-18"
              width="44"
              height="36"
              preserveAspectRatio="xMidYMid meet"
              opacity={isLantern ? "0.75" : "0.65"}
              filter={`url(#seal-${uid})`}
            />
          )}
        </g>
      )}

      {/* Archive ID (top center, monospace) */}
      <text
        x={cx}
        y={heavenY + heavenH * 0.68}
        textAnchor="middle"
        fill={PALETTE.ink}
        fontSize="5.5"
        fontFamily={FONTS.mono}
        letterSpacing="3"
        opacity="0.18"
      >
        {archiveId}
      </text>

      {/* Element label (top right, monospace) */}
      <text
        x={W - m - 8}
        y={heavenY + heavenH * 0.35}
        textAnchor="end"
        fill={PALETTE.ink}
        fontSize="6"
        fontFamily={FONTS.mono}
        letterSpacing="2"
        opacity="0.18"
      >
        {element.toUpperCase()}
      </text>

      {/* Heaven-human divider */}
      <line
        x1={cx - 35}
        y1={heavenY + heavenH * 0.82}
        x2={cx + 35}
        y2={heavenY + heavenH * 0.82}
        stroke={PALETTE.ink}
        strokeWidth="0.5"
        strokeOpacity="0.12"
        strokeDasharray="3,2"
      />

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  HUMAN SECTION (~55%): Symbol + Yao + Name + Tagline       ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      {/* Hexagram symbol — large Unicode glyph, BOLD & CLEAR */}
      <text
        x={cx}
        y={humanY + humanH * 0.18}
        textAnchor="middle"
        fill={PALETTE.ink}
        fontSize={Math.min(46, W * 0.12)}
        fontFamily={FONTS.chinese}
        opacity={isLantern ? "0.9" : "0.85"}
        filter={cyberMode ? `url(#neon-${uid})` : `url(#glow-${uid})`}
      >
        {symbol}
      </text>

      {/* Curated calligraphy overlay (自己整理z素材库) */}
      {newCalligraphyAsset && (
        <image
          href={newCalligraphyAsset}
          x={cx - W * 0.3}
          y={humanY + humanH * 0.28}
          width={W * 0.6}
          height={humanH * 0.35}
          preserveAspectRatio="xMidYMid meet"
          opacity={isLantern ? "0.22" : "0.28"}
          filter={`url(#bleed-${uid})`}
        />
      )}

      {/* Lantern glow — warm gold radial emanation from yao center (Li-A only) */}
      {isLantern && (
        <ellipse
          cx={cx}
          cy={yaoStartY + yaoGap * 2.5}
          rx={yaoSeg * 1.8}
          ry={yaoGap * 5}
          fill={`url(#lantern-glow-${uid})`}
        />
      )}

      {/* Energy core light point — golden brilliance at yao center (Li-A only) */}
      {isLantern && (
        <circle
          cx={cx}
          cy={yaoStartY + yaoGap * 2.5}
          r="4"
          fill="#FFD700"
          opacity="0.8"
          filter={`url(#core-glow-${uid})`}
        />
      )}

      {/* Vertical tremble lines — aesthetic backbone, NOT readable text */}
      {isLantern ? (
        <>
          {/* Bamboo-joint vertical lines (Li-A): dasharray creates node segments */}
          <line
            x1={vLineLeftX}
            y1={vLineY1}
            x2={vLineLeftX + (seed % 3 - 1) * 0.5}
            y2={vLineY2}
            stroke="#2A1A1A"
            strokeWidth="0.7"
            strokeOpacity="0.28"
            strokeLinecap="round"
            strokeDasharray="18, 4"
            filter={`url(#brush-${uid})`}
          />
          <line
            x1={vLineRightX}
            y1={vLineY1}
            x2={vLineRightX + (seed % 5 - 2) * 0.4}
            y2={vLineY2}
            stroke="#2A1A1A"
            strokeWidth="0.7"
            strokeOpacity="0.28"
            strokeLinecap="round"
            strokeDasharray="14, 5"
            filter={`url(#brush-${uid})`}
          />
        </>
      ) : (
        <>
          <line
            x1={vLineLeftX}
            y1={vLineY1}
            x2={vLineLeftX + (seed % 3 - 1) * 0.8}
            y2={vLineY2}
            stroke={PALETTE.ink}
            strokeWidth="0.6"
            strokeOpacity="0.15"
            strokeLinecap="round"
            filter={`url(#brush-${uid})`}
          />
          <line
            x1={vLineRightX}
            y1={vLineY1}
            x2={vLineRightX + (seed % 5 - 2) * 0.6}
            y2={vLineY2}
            stroke={PALETTE.ink}
            strokeWidth="0.6"
            strokeOpacity="0.15"
            strokeLinecap="round"
            filter={`url(#brush-${uid})`}
          />
        </>
      )}

      {/* Six Yao lines — core visual identity, BOLD & UNWAVERING */}
      <g transform={`translate(${cx}, ${yaoStartY})`}>
        {sixLines.map((lineType, i) => {
          const y = i * yaoGap;
          const isGlow = cyberMode && i % 2 === 0;
          if (lineType === "yang") {
            return (
              <line
                key={i}
                x1={-yaoSeg}
                y1={y}
                x2={yaoSeg}
                y2={y}
                stroke={PALETTE.ink}
                strokeWidth={isLantern ? "2.4" : "1.8"}
                strokeOpacity={isLantern ? "0.7" : "0.55"}
                strokeLinecap="round"
                filter={isGlow ? `url(#neon-${uid})` : undefined}
              />
            );
          }
          const gap = Math.min(8, yaoSeg * 0.2);
          return (
            <g key={i}>
              <line
                x1={-yaoSeg}
                y1={y}
                x2={-gap - (isLantern ? 1 : 0)}
                y2={y}
                stroke={PALETTE.ink}
                strokeWidth={isLantern ? "2.4" : "1.8"}
                strokeOpacity={isLantern ? "0.65" : "0.45"}
                strokeLinecap="round"
                filter={isLantern ? `url(#glow-${uid})` : undefined}
              />
              <line
                x1={gap + (isLantern ? 1 : 0)}
                y1={y}
                x2={yaoSeg}
                y2={y}
                stroke={PALETTE.ink}
                strokeWidth={isLantern ? "2.4" : "1.8"}
                strokeOpacity={isLantern ? "0.65" : "0.45"}
                strokeLinecap="round"
                filter={isLantern ? `url(#glow-${uid})` : undefined}
              />
            </g>
          );
        })}
      </g>

      {/* Lantern-core: seal applique at Human center, overlaid on yao (translucent paper sticker) */}
      {isLantern && showSeal && (
        <g
          transform={`translate(${cx}, ${yaoStartY + yaoGap * 2.5})`}
          filter={`url(#unreadable-seal-${uid}) url(#glow-${uid})`}
          opacity="0.8"
        >
          <ellipse cx="0" cy="0" rx="26" ry="22" fill="none" stroke="#c41e1e" strokeWidth="1.8" />
          <ellipse cx="0" cy="0" rx="22" ry="18" fill="none" stroke="#c41e1e" strokeWidth="0.5" opacity="0.5" />
          <text
            x="0"
            y="2"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#c41e1e"
            fontSize="8"
            fontFamily={FONTS.chinese}
            fontWeight="bold"
            letterSpacing="2"
            opacity="0.85"
          >
            天官賜福
          </text>
        </g>
      )}

      {/* English hexagram name — handwritten, primary */}
      <text
        x={cx}
        y={humanY + humanH * 0.72}
        textAnchor="middle"
        fill={PALETTE.ink}
        fontSize={gua?.nameEn && gua.nameEn.length > 18 ? 13 : 15}
        fontFamily={FONTS.script}
        fontWeight="600"
        letterSpacing="1"
        opacity="0.8"
        filter={`url(#brush-${uid})`}
      >
        {gua?.nameEn || "The Unknown"}
      </text>

      {/* Edgy one-liner (Co-Star inspired) — burgundy, bold */}
      <text
        x={cx}
        y={humanY + humanH * 0.84}
        textAnchor="middle"
        fill={PALETTE.cinnabar}
        fontSize={Math.min(12, W * 0.035)}
        fontFamily={FONTS.script}
        fontWeight="bold"
        letterSpacing="1.5"
        opacity="0.82"
        filter={`url(#brush-${uid})`}
      >
        {edgyTagline}
      </text>

      {/* Short phrase (secondary, smaller) */}
      {shortPhrase && (
        <text
          x={cx}
          y={humanY + humanH * 0.94}
          textAnchor="middle"
          fill={PALETTE.inkWash}
          fontSize="8"
          fontFamily={FONTS.script}
          opacity="0.45"
        >
          {shortPhrase}
        </text>
      )}

      {/* Human-earth divider */}
      <line
        x1={cx - 30}
        y1={humanY + humanH * 0.97}
        x2={cx + 30}
        y2={humanY + humanH * 0.97}
        stroke={PALETTE.ink}
        strokeWidth="0.5"
        strokeOpacity="0.1"
      />

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  EARTH SECTION (~27%): Seal + Keywords + Annotation        ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      {/* Corner seal (压角章 開運) — UNREADABLE: blur + displacement makes it visual texture */}
      {showSeal && (
        <g
          transform={`translate(${W - m - 28}, ${earthY + earthH * 0.35})`}
          filter={`url(#unreadable-seal-${uid})`}
        >
          {isLantern ? (
            <>
              {/* Lantern-core: round seal like lantern bottom bell */}
              <ellipse
                cx="0"
                cy="0"
                rx="13"
                ry="11"
                fill="none"
                stroke="#c41e1e"
                strokeWidth="1.4"
                opacity="0.8"
              />
              <text
                x="0"
                y="2"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#c41e1e"
                fontSize="7"
                fontFamily={FONTS.chinese}
                fontWeight="bold"
                letterSpacing="1"
                opacity="0.85"
              >
                開運
              </text>
            </>
          ) : (
            <>
              <rect
                x="-13"
                y="-11"
                width="26"
                height="22"
                fill="none"
                stroke={PALETTE.cinnabar}
                strokeWidth="1.4"
                opacity="0.6"
                rx="1"
              />
              <text
                x="0"
                y="2"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={PALETTE.cinnabar}
                fontSize="7"
                fontFamily={FONTS.chinese}
                fontWeight="bold"
                letterSpacing="1"
                opacity="0.8"
              >
                開運
              </text>
            </>
          )}
          {newSealEarth && (
            <image
              href={newSealEarth}
              x="-12"
              y="-10"
              width="24"
              height="20"
              preserveAspectRatio="xMidYMid meet"
              opacity={isLantern ? "0.75" : "0.65"}
              filter={`url(#seal-${uid})`}
            />
          )}
        </g>
      )}

      {/* Keywords — monospace cyber feel, limited to 3 */}
      {keywords.length > 0 && (
        <text
          x={cx}
          y={earthY + earthH * 0.45}
          textAnchor="middle"
          fill={PALETTE.ink}
          fontSize="6.5"
          fontFamily={FONTS.mono}
          letterSpacing="3.5"
          opacity="0.32"
        >
          {keywords.join(" · ").toUpperCase()}
        </text>
      )}

      {/* Minimal annotation (corner note, English only) */}
      {annotation && (
        <text
          x={m + 10}
          y={earthY + earthH * 0.55}
          fill={PALETTE.ink}
          fontSize="6"
          fontFamily={FONTS.script}
          opacity="0.22"
          transform={`rotate(-1.5, ${m + 10}, ${earthY + earthH * 0.55})`}
        >
          {annotation}
        </text>
      )}

      {/* Date stamp (bottom right, monospace) */}
      <text
        x={W - m - 8}
        y={H - m - 8}
        textAnchor="end"
        fill={PALETTE.ink}
        fontSize="5"
        fontFamily={FONTS.mono}
        letterSpacing="1.5"
        opacity="0.14"
      >
        {new Date()
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, ".")}
      </text>

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  CYBER OVERLAY: Subtle edge accents (≤30% of design)       ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      {cyberMode && (
        <>
          {/* Subtle chromatic fringe on edges (1-2px max, per research) */}
          <rect x="0" y="0" width="2" height={H} fill={PALETTE.neonCyanFade} opacity="0.06" />
          <rect x={W - 2} y="0" width="2" height={H} fill={PALETTE.neonMagenta} opacity="0.04" />
          {/* Holographic corner glints (small area, ≤10%) */}
          <circle cx={m + 10} cy={m + 10} r="1.5" fill={PALETTE.hologram} opacity="0.25" />
          <circle cx={W - m - 10} cy={H - m - 10} r="1" fill={PALETTE.hologram} opacity="0.2" />
        </>
      )}
    </svg>
  );
};

export default TalismanPoster;
