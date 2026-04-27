/**
 * TalismanPoster v8.0 — Digital Archive Aesthetic
 *
 * Research-driven redesign for Western Gen Z / Millennial spirituality market:
 * - Viral Pinterest/TikTok "Oriental Mysticism" aesthetic
 * - Co-Star inspired edgy one-liner copy
 * - "De-AI-fication" via paper defects, brush irregularities, seal imperfections
 * - Cyberpunk accents: neon glow, scan lines, chromatic fringe (desaturated)
 * - Bilingual vertical layout: Chinese calligraphy + English monospace/script
 * - html2canvas-safe SVG filters only
 */

import React from "react";
import { GUA64_LIST } from "../../data/gua64";
import {
  PALETTE,
  FONTS,
  getEdgyTagline,
  getArchiveId,
  getAnnotation,
  calcLayout,
  trembleBorder,
  cornerOrnament,
  wrapText,
  getElementCyberColor,
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

/* ─── Cloud motif path (simplified traditional cloud pattern) ─── */
const CLOUD_TOP_PATH =
  "M -30 0 Q -20 -8 -10 0 Q 0 -6 10 0 Q 20 -8 30 0";

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
  const lower = gua?.lower || "乾";
  const symbol = gua?.symbol || "䷀";
  const element = gua?.element || "金";
  const cyberColor = getElementCyberColor(element);

  const edgyTagline = getEdgyTagline(gua);
  const archiveId = getArchiveId(gua);
  const annotation = getAnnotation(gua);

  const blessingText = gua?.imageEn || "The Tao that can be told is not the eternal Tao.";
  const blessingLines = wrapText(blessingText, 28);
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

  /* ─── Border paths with controlled randomness ─── */
  const bOuter = trembleBorder(m, m, W - m * 2, H - m * 2, 1.8, gua?.number || 0);
  const bInner = trembleBorder(
    m + 7,
    m + 7,
    W - m * 2 - 14,
    H - m * 2 - 14,
    1.2,
    (gua?.number || 0) + 100
  );

  /* ─── Deterministic corner positions (asymmetric) ─── */
  const corners = [
    { x: m + 5, y: m + 5, r: 0, v: 0 },
    { x: W - m - 5, y: m + 5, r: 90, v: 1 },
    { x: m + 5, y: H - m - 5, r: 270, v: 2 },
    { x: W - m - 5, y: H - m - 5, r: 180, v: 3 },
  ];

  /* ─── Yao line rendering ─── */
  const yaoStartY = humanY + humanH * 0.52;
  const yaoGap = Math.min(10, humanH * 0.028);
  const yaoSeg = Math.min(40, W * 0.1);

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", fontFamily: FONTS.chinese }}
    >
      <defs>
        {/* ═══ Paper Texture: rice-paper fiber ═══ */}
        <filter id={`paper-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55"
            numOctaves="5"
            seed={gua?.number || 0}
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
            baseFrequency="0.12"
            numOctaves="4"
            seed={(gua?.number || 0) + 50}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* ═══ Seal Weathering: stamp mottling ═══ */}
        <filter id={`seal-${uid}`}>
          <feTurbulence
            type="turbulence"
            baseFrequency="0.07"
            numOctaves="5"
            seed={(gua?.number || 0) + 200}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* ═══ Neon Glow: cyber accent on yao lines ═══ */}
        <filter id={`neon-${uid}`}>
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feFlood floodColor={cyberColor} floodOpacity="0.6" result="color" />
          <feComposite operator="in" in="color" in2="blur" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ═══ Soft Gold Glow ═══ */}
        <filter id={`glow-${uid}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
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
            floodOpacity="0.15"
          />
        </filter>

        {/* ═══ Scan Lines Pattern ═══ */}
        <pattern
          id={`scan-${uid}`}
          x="0"
          y="0"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="2" x2="4" y2="2" stroke={PALETTE.ink} strokeWidth="0.5" opacity="0.03" />
        </pattern>

        {/* ═══ Paper Aging Radial Gradient ═══ */}
        <radialGradient id={`paper-grad-${uid}`} cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor={PALETTE.paper} stopOpacity="1" />
          <stop offset="55%" stopColor={PALETTE.paperDark} stopOpacity="1" />
          <stop offset="85%" stopColor={PALETTE.paperEdge} stopOpacity="1" />
          <stop offset="100%" stopColor={PALETTE.paperShadow} stopOpacity="1" />
        </radialGradient>

        {/* ═══ Edge Darkening for vintage feel ═══ */}
        <radialGradient id={`edge-grad-${uid}`} cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor={PALETTE.transparent} stopOpacity="0" />
          <stop offset="100%" stopColor={PALETTE.ink} stopOpacity="0.12" />
        </radialGradient>

        {/* ═══ Vignette for focus ═══ */}
        <radialGradient id={`vignette-${uid}`} cx="50%" cy="50%" r="65%">
          <stop offset="50%" stopColor={PALETTE.transparent} stopOpacity="0" />
          <stop offset="100%" stopColor={PALETTE.ink} stopOpacity="0.06" />
        </radialGradient>
      </defs>

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  BACKGROUND LAYER: Aged rice paper + texture + scan lines   ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      <rect x="0" y="0" width={W} height={H} fill={PALETTE.paperShadow} />
      <rect x="0" y="0" width={W} height={H} fill={`url(#paper-grad-${uid})`} />
      {/* Paper fiber texture */}
      <rect x="0" y="0" width={W} height={H} fill={PALETTE.paper} filter={`url(#paper-${uid})`} opacity="0.5" />
      {/* Edge darkening (vintage book feel) */}
      <rect x="0" y="0" width={W} height={H} fill={`url(#edge-grad-${uid})`} />
      {/* Subtle vignette */}
      <rect x="0" y="0" width={W} height={H} fill={`url(#vignette-${uid})`} />
      {/* Scan lines overlay */}
      {cyberMode && (
        <rect x="0" y="0" width={W} height={H} fill={`url(#scan-${uid})`} opacity="0.6" />
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
        strokeOpacity="0.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner frame */}
      <path
        d={bInner}
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth="0.7"
        strokeOpacity="0.25"
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
            strokeOpacity="0.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
      {/* Optional: cyber neon border glow */}
      {cyberMode && (
        <path
          d={bOuter}
          fill="none"
          stroke={cyberColor}
          strokeWidth="0.8"
          strokeOpacity="0.15"
          filter={`url(#neon-${uid})`}
        />
      )}

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  HEAVEN SECTION (~20%): Cloud motif + wax seal + trigram   ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      {/* Cloud top ornament */}
      <g transform={`translate(${cx}, ${heavenY + heavenH * 0.18})`} opacity="0.35">
        <path d={CLOUD_TOP_PATH} fill="none" stroke={PALETTE.ink} strokeWidth="1" strokeLinecap="round" />
        <path d="M -20 4 Q -10 0 0 4 Q 10 0 20 4" fill="none" stroke={PALETTE.ink} strokeWidth="0.6" strokeOpacity="0.5" />
      </g>

      {/* Wax seal (天官賜福) — offset slightly for imperfection */}
      {showSeal && (
        <g
          transform={`translate(${cx + 1.5}, ${heavenY + heavenH * 0.42})`}
          filter={`url(#seal-${uid})`}
        >
          <ellipse cx="0" cy="0" rx="30" ry="26" fill="none" stroke={PALETTE.cinnabar} strokeWidth="2.2" opacity="0.85" />
          <ellipse cx="0" cy="0" rx="26" ry="22" fill="none" stroke={PALETTE.cinnabar} strokeWidth="0.7" opacity="0.35" />
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
            opacity="0.92"
          >
            天官賜福
          </text>
        </g>
      )}

      {/* Vertical trigram attributes (rotated for 竖排 feel) */}
      <g transform={`translate(${m + 14}, ${heavenY + heavenH * 0.55})`}>
        <text
          transform="rotate(-90)"
          textAnchor="middle"
          fill={PALETTE.ink}
          fontSize="7"
          fontFamily={FONTS.chinese}
          letterSpacing="3"
          opacity="0.3"
        >
          {upper}·{lower}·{element}
        </text>
      </g>

      {/* Brand mark (subtle) */}
      <text
        x={cx}
        y={heavenY + heavenH * 0.82}
        textAnchor="middle"
        fill={PALETTE.ink}
        fontSize="6"
        fontFamily={FONTS.mono}
        letterSpacing="4"
        opacity="0.2"
      >
        MYSTIC DAO
      </text>

      {/* Heaven-human divider */}
      <line
        x1={cx - 40}
        y1={heavenY + heavenH * 0.88}
        x2={cx + 40}
        y2={heavenY + heavenH * 0.88}
        stroke={PALETTE.ink}
        strokeWidth="0.5"
        strokeOpacity="0.15"
        strokeDasharray="3,2"
      />

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  HUMAN SECTION (~52%): Symbol + Name + Yao + Edgy tagline  ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      {/* Hexagram symbol — large, with optional cyber glow */}
      <text
        x={cx}
        y={humanY + humanH * 0.16}
        textAnchor="middle"
        fill={PALETTE.ink}
        fontSize={Math.min(48, W * 0.13)}
        fontFamily={FONTS.chinese}
        opacity="0.88"
        filter={cyberMode ? `url(#neon-${uid})` : `url(#glow-${uid})`}
      >
        {symbol}
      </text>

      {/* Chinese hexagram name — main calligraphy */}
      <text
        x={cx}
        y={humanY + humanH * 0.38}
        textAnchor="middle"
        fill={PALETTE.ink}
        fontSize={Math.min(26, W * 0.075)}
        fontFamily={FONTS.chinese}
        fontWeight="bold"
        letterSpacing="5"
        opacity="0.94"
        filter={`url(#brush-${uid})`}
      >
        {hexagramName}
      </text>

      {/* Six Yao lines — with subtle cyber glow */}
      <g transform={`translate(${cx}, ${yaoStartY})`}>
        {sixLines.map((lineType, i) => {
          const y = i * yaoGap;
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
                strokeOpacity="0.6"
                strokeLinecap="round"
                filter={cyberMode && i % 2 === 0 ? `url(#neon-${uid})` : undefined}
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
                strokeOpacity="0.5"
                strokeLinecap="round"
              />
              <line
                x1={gap}
                y1={y}
                x2={yaoSeg}
                y2={y}
                stroke={PALETTE.ink}
                strokeWidth="1.8"
                strokeOpacity="0.5"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </g>

      {/* Edgy one-liner tagline (Co-Star inspired) */}
      <text
        x={cx}
        y={humanY + humanH * 0.82}
        textAnchor="middle"
        fill={PALETTE.cinnabar}
        fontSize={Math.min(13, W * 0.038)}
        fontFamily={FONTS.script}
        fontWeight="bold"
        letterSpacing="1"
        opacity="0.85"
        filter={`url(#brush-${uid})`}
      >
        {edgyTagline}
      </text>

      {/* Human-earth divider */}
      <line
        x1={cx - 35}
        y1={humanY + humanH * 0.92}
        x2={cx + 35}
        y2={humanY + humanH * 0.92}
        stroke={PALETTE.ink}
        strokeWidth="0.5"
        strokeOpacity="0.12"
      />

      {/* ╔══════════════════════════════════════════════════════════════╗
         ║  EARTH SECTION (~28%): Name + Blessing + Seal + Archive    ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      {/* English hexagram name — uppercase serif */}
      <text
        x={cx}
        y={earthY + earthH * 0.18}
        textAnchor="middle"
        fill={PALETTE.ink}
        fontSize={gua?.nameEn && gua.nameEn.length > 18 ? 11 : 13}
        fontFamily={FONTS.english}
        fontWeight="bold"
        letterSpacing="2"
        opacity="0.7"
        filter={`url(#glow-${uid})`}
      >
        {(gua?.nameEn || "THE UNKNOWN").toUpperCase()}
      </text>

      {/* Blessing text (italic serif) */}
      <g transform={`translate(${cx}, ${earthY + earthH * 0.38})`}>
        <text
          x="0"
          y="-8"
          textAnchor="middle"
          fill={PALETTE.ink}
          fontSize="16"
          fontFamily={FONTS.english}
          opacity="0.1"
        >
          &ldquo;
        </text>
        {blessingLines.slice(0, 3).map((line, i) => (
          <text
            key={i}
            x="0"
            y={i * 13}
            textAnchor="middle"
            fill={PALETTE.inkLight}
            fontSize="8.5"
            fontFamily={FONTS.english}
            fontStyle="italic"
            opacity="0.55"
            letterSpacing="0.3"
          >
            {line}
          </text>
        ))}
      </g>

      {/* Corner seal (压角章) — slightly offset for authenticity */}
      {showSeal && (
        <g
          transform={`translate(${W - m - 30}, ${earthY + earthH * 0.62})`}
          filter={`url(#seal-${uid})`}
        >
          <rect
            x="-13"
            y="-11"
            width="26"
            height="22"
            fill="none"
            stroke={PALETTE.cinnabar}
            strokeWidth="1.4"
            opacity="0.65"
            rx="1.5"
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
            opacity="0.88"
          >
            開運
          </text>
        </g>
      )}

      {/* Keywords — monospace cyber feel */}
      {keywords.length > 0 && (
        <text
          x={cx}
          y={earthY + earthH * 0.75}
          textAnchor="middle"
          fill={PALETTE.ink}
          fontSize="6.5"
          fontFamily={FONTS.mono}
          letterSpacing="3"
          opacity="0.35"
        >
          {keywords.join(" · ").toUpperCase()}
        </text>
      )}

      {/* Handwritten annotation (corner note, "used" feel) */}
      {annotation && (
        <text
          x={m + 8}
          y={earthY + earthH * 0.78}
          fill={PALETTE.ink}
          fontSize="6"
          fontFamily={FONTS.script}
          opacity="0.25"
          transform={`rotate(-2, ${m + 8}, ${earthY + earthH * 0.78})`}
        >
          {annotation}
        </text>
      )}

      {/* Digital archive catalog number (monospace, bottom) */}
      <text
        x={cx}
        y={H - m - 6}
        textAnchor="middle"
        fill={PALETTE.ink}
        fontSize="5.5"
        fontFamily={FONTS.mono}
        letterSpacing="2"
        opacity="0.18"
      >
        {archiveId}
      </text>

      {/* Date stamp */}
      <text
        x={W - m - 6}
        y={H - m - 6}
        textAnchor="end"
        fill={PALETTE.ink}
        fontSize="5"
        fontFamily={FONTS.mono}
        letterSpacing="1"
        opacity="0.15"
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
         ║  CYBER OVERLAY: Subtle holographic edge accents             ║
         ╚══════════════════════════════════════════════════════════════╝ */}
      {cyberMode && (
        <>
          {/* Subtle chromatic fringe on left edge */}
          <rect x="0" y="0" width="3" height={H} fill={PALETTE.neonCyanFade} opacity="0.08" />
          <rect x={W - 3} y="0" width="3" height={H} fill={PALETTE.neonMagenta} opacity="0.05" />
          {/* Holographic corner glints */}
          <circle cx={m + 10} cy={m + 10} r="2" fill={PALETTE.hologram} opacity="0.3" />
          <circle cx={W - m - 10} cy={H - m - 10} r="1.5" fill={PALETTE.hologram} opacity="0.25" />
        </>
      )}
    </svg>
  );
};

export default TalismanPoster;
