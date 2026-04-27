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

        {/* ═══ Unreadable Seal Filter: heavy blur + displacement ═══ */}
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
         ║  HEAVEN SECTION (~18%): Cloud + Brand + Archive ID         ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      {/* Cloud top ornament — restored from v8.0, oriental talisman DNA */}
      <g transform={`translate(${cx}, ${heavenY + heavenH * 0.18})`} opacity="0.3">
        <path d="M -30 0 Q -20 -8 -10 0 Q 0 -6 10 0 Q 20 -8 30 0" fill="none" stroke={PALETTE.ink} strokeWidth="1" strokeLinecap="round" />
        <path d="M -20 4 Q -10 0 0 4 Q 10 0 20 4" fill="none" stroke={PALETTE.ink} strokeWidth="0.6" strokeOpacity="0.5" />
      </g>

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

      {/* Wax seal (天官賜福) — UNREADABLE: blur + displacement makes it visual texture only */}
      {showSeal && (
        <g
          transform={`translate(${cx + 1.5}, ${heavenY + heavenH * 0.72})`}
          filter={`url(#unreadable-seal-${uid})`}
        >
          <ellipse cx="0" cy="0" rx="28" ry="24" fill="none" stroke={PALETTE.cinnabar} strokeWidth="2" opacity="0.7" />
          <ellipse cx="0" cy="0" rx="24" ry="20" fill="none" stroke={PALETTE.cinnabar} strokeWidth="0.6" opacity="0.3" />
          <text
            x="0"
            y="2"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={PALETTE.cinnabar}
            fontSize="9"
            fontFamily={FONTS.chinese}
            fontWeight="bold"
            letterSpacing="2"
            opacity="0.85"
          >
            天官賜福
          </text>
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

      {/* Vertical tremble lines — aesthetic backbone, NOT readable text */}
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
      {/* Corner seal (压角章 開運) — UNREADABLE: blur + displacement makes it visual texture */}
      {showSeal && (
        <g
          transform={`translate(${W - m - 28}, ${earthY + earthH * 0.35})`}
          filter={`url(#unreadable-seal-${uid})`}
        >
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
