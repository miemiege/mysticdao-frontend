/**
 * Poster Filters — SVG滤镜系统（噪点/光晕/金箔/水墨/CRT扫描线/霓虹/沙质纹理/苔藓光晕）
 */
import React from 'react';

export interface FilterProps {
  id: string;
  intensity?: number;
}

export const NoiseFilter: React.FC<FilterProps> = ({ id, intensity = 0.04 }) => (
  <filter id={id} x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" in="noise" result="coloredNoise" />
    <feComponentTransfer in="coloredNoise" result="opacityNoise">
      <feFuncA type="linear" slope={intensity} />
    </feComponentTransfer>
    <feBlend mode="overlay" in="SourceGraphic" in2="opacityNoise" />
  </filter>
);

export const GlowFilter: React.FC<FilterProps> = ({ id, intensity = 0.3 }) => (
  <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation={intensity * 4} result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

export const GoldLeafFilter: React.FC<FilterProps> = ({ id, intensity = 0.2 }) => (
  <filter id={id} x="0" y="0" width="100%" height="100%">
    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale={intensity * 10} xChannelSelector="R" yChannelSelector="G" />
    <feSpecularLighting surfaceScale={2} specularConstant={0.8} specularExponent={15} lightingColor="#D4AF37" result="specular">
      <fePointLight x="-500" y="-500" z="200" />
    </feSpecularLighting>
    <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularComposite" />
    <feBlend mode="screen" in="specularComposite" in2="SourceGraphic" />
  </filter>
);

export const InkWashFilter: React.FC<FilterProps> = ({ id, intensity = 0.15 }) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale={intensity * 20} xChannelSelector="R" yChannelSelector="G" result="displaced" />
    <feGaussianBlur in="displaced" stdDeviation={intensity * 3} result="blurred" />
    <feBlend mode="multiply" in="blurred" in2="SourceGraphic" />
  </filter>
);

export const PaperTextureFilter: React.FC<FilterProps> = ({ id }) => (
  <filter id={id} x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
    <feDiffuseLighting in="noise" lightingColor="#FFF8E7" surfaceScale="1">
      <feDistantLight azimuth="45" elevation="60" />
    </feDiffuseLighting>
  </filter>
);

export const DropShadowFilter: React.FC<FilterProps> = ({ id }) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
  </filter>
);

/** CyberTao 风格 — CRT 扫描线效果 */
export const CRTScanlineFilter: React.FC<FilterProps> = ({ id, intensity = 0.15 }) => (
  <filter id={id} x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0 0.8" numOctaves="1" result="scanlines" />
    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.3 0" in="scanlines" result="coloredScanlines" />
    <feComponentTransfer in="coloredScanlines" result="opacityScanlines">
      <feFuncA type="linear" slope={intensity * 2} />
    </feComponentTransfer>
    <feBlend mode="overlay" in="SourceGraphic" in2="opacityScanlines" />
  </filter>
);

/** CyberTao 风格 — 霓虹发光效果 */
export const NeonGlowFilter: React.FC<FilterProps> = ({ id, intensity = 0.8 }) => (
  <filter id={id} x="-100%" y="-100%" width="300%" height="300%">
    <feGaussianBlur stdDeviation={intensity * 6} result="blur1" />
    <feGaussianBlur stdDeviation={intensity * 3} result="blur2" />
    <feMerge>
      <feMergeNode in="blur1" />
      <feMergeNode in="blur2" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

/** ZenGarden 风格 — 沙质纹理 */
export const SandTextureFilter: React.FC<FilterProps> = ({ id, intensity = 0.08 }) => (
  <filter id={id} x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.3" numOctaves="5" seed="2" result="sand" />
    <feColorMatrix type="matrix" values="0.9 0 0 0 0.1  0 0.85 0 0 0.1  0 0 0.8 0 0.05  0 0 0 0.4 0" in="sand" result="coloredSand" />
    <feComponentTransfer in="coloredSand" result="opacitySand">
      <feFuncA type="linear" slope={intensity} />
    </feComponentTransfer>
    <feBlend mode="multiply" in="SourceGraphic" in2="opacitySand" />
  </filter>
);

/** ZenGarden 风格 — 柔和苔藓光晕 */
export const MossGlowFilter: React.FC<FilterProps> = ({ id, intensity = 0.05 }) => (
  <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation={intensity * 4} result="blur" />
    <feColorMatrix type="matrix" values="0.4 0 0 0 0  0 0.55 0 0 0  0 0 0.45 0 0  0 0 0 1 0" in="blur" result="greenBlur" />
    <feMerge>
      <feMergeNode in="greenBlur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

export const PosterFilters: React.FC = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <NoiseFilter id="poster-noise" />
      <GlowFilter id="poster-glow" />
      <GoldLeafFilter id="poster-gold" />
      <InkWashFilter id="poster-ink" />
      <PaperTextureFilter id="poster-paper" />
      <DropShadowFilter id="poster-shadow" />
      <CRTScanlineFilter id="poster-crt" />
      <NeonGlowFilter id="poster-neon" />
      <SandTextureFilter id="poster-sand" />
      <MossGlowFilter id="poster-moss" />
    </defs>
  </svg>
);

export default PosterFilters;
