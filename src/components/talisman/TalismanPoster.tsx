/**
 * TalismanPoster v9.0 — Digital Manuscript Aesthetic
 *
 * 10-dimension research synthesis:
 * - No readable Chinese characters (semiotics + cultural safety)
 * - Horizontal layout only (typography research)
 * - ≤15 words per poster (information density)
 * - 70% talisman prototype + 30% cyber trace (aesthetic balance)
 * - Enhanced de-AI: feibai, ink bleed, scan noise, color desaturation
 * - Tea Wash palette: avoids pure yellow + pure black
 * - "Student posture" copy — no "master/unlock/Oriental"
 * - Pseudo-symbol system inspired by Xu Bing's Book from the Sky
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
  generatePseudoSymbols,
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
}) => {
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
  const { W, H, cx, m, heavenY, heavenH, humanY, humanH, earthY, earthH } =
    calcLayout(width, height);
  const uid = `sigil-${hexagramName}-${W}-${H}`;
  const seed = gua?.number || 0;

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

  /* ─── Pseudo-symbol paths (Xu Bing inspired dot-circle-line) ─── */
  const pseudoPath = generatePseudoSymbols(seed, 24, cx, heavenY + heavenH * 0.45, 28);

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
      </defs>

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  BACKGROUND LAYER: Tea Wash paper + texture + scan lines    ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      <rect x="0" y="0" width={W} height={H} fill={PALETTE.paperShadow} />
      <rect x="0" y="0" width={W} height={H} fill={`url(#paper-grad-${uid})`} />
      {/* Paper fiber texture */}
      <rect x="0" y="0" width={W} height={H} fill={PALETTE.paper} filter={`url(#paper-${uid})`} opacity="0.5" />
      {/* Scan noise layer (v9 de-AI) */}
      <rect x="0" y="0" width={W} height={H} fill={PALETTE.paperDark} filter={`url(#scan-noise-${uid})`} opacity="0.3" />
      {/* Edge darkening */}
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
         ║  HEAVEN SECTION (~18%): Pseudo-symbols + Archive ID        ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      {/* Pseudo-symbol constellation (Xu Bing inspired dot-circle-line) */}
      <g transform={`translate(0, 0)`} opacity="0.25">
        <path
          d={pseudoPath}
          fill="none"
          stroke={PALETTE.ink}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Archive ID (top center, monospace) */}
      <text
        x={cx}
        y={heavenY + heavenH * 0.35}
        textAnchor="middle"
        fill={PALETTE.ink}
        fontSize="6.5"
        fontFamily={FONTS.mono}
        letterSpacing="3"
        opacity="0.22"
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
      {/* Hexagram symbol — large Unicode glyph with subtle glow */}
      <text
        x={cx}
        y={humanY + humanH * 0.18}
        textAnchor="middle"
        fill={PALETTE.ink}
        fontSize={Math.min(46, W * 0.12)}
        fontFamily={FONTS.chinese}
        opacity="0.85"
        filter={cyberMode ? `url(#neon-${uid})` : `url(#glow-${uid})`}
      >
        {symbol}
      </text>

      {/* Six Yao lines — core visual identity */}
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
                strokeWidth="1.8"
                strokeOpacity="0.55"
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
                x2={-gap}
                y2={y}
                stroke={PALETTE.ink}
                strokeWidth="1.8"
                strokeOpacity="0.45"
                strokeLinecap="round"
              />
              <line
                x1={gap}
                y1={y}
                x2={yaoSeg}
                y2={y}
                stroke={PALETTE.ink}
                strokeWidth="1.8"
                strokeOpacity="0.45"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </g>

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
      {/* Abstract seal (no readable text — cultural safety) */}
      {showSeal && (
        <g
          transform={`translate(${W - m - 28}, ${earthY + earthH * 0.35})`}
          filter={`url(#seal-${uid})`}
        >
          <rect
            x="-12"
            y="-10"
            width="24"
            height="20"
            fill="none"
            stroke={PALETTE.cinnabar}
            strokeWidth="1.6"
            opacity="0.55"
            rx="1"
          />
          {/* Inner abstract texture instead of text */}
          <line x1="-6" y1="-3" x2="6" y2="-3" stroke={PALETTE.cinnabar} strokeWidth="0.8" opacity="0.4" />
          <line x1="-4" y1="0" x2="4" y2="0" stroke={PALETTE.cinnabar} strokeWidth="0.8" opacity="0.4" />
          <line x1="-6" y1="3" x2="6" y2="3" stroke={PALETTE.cinnabar} strokeWidth="0.8" opacity="0.4" />
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
