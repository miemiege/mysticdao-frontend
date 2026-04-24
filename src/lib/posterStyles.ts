/**
 * Poster Styles — 8种海报风格配置系统
 */

export type PosterStyleName = 'ink' | 'dark' | 'royal' | 'vintage' | 'tianshi' | 'blackgold' | 'cybertao' | 'zengarden';

export interface PosterStyleConfig {
  name: PosterStyleName;
  label: string;
  labelEn: string;
  description: string;
  bgColor: string;
  bgGradient?: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  borderStyle: 'none' | 'solid' | 'double' | 'ornate';
  fontFamily: string;
  fontFamilyEn: string;
  sealColor: string;
  sealBg: string;
  footerColor: string;
  noiseOpacity: number;
  glowIntensity: number;
  inkWashOpacity?: number;
  goldLeafOpacity?: number;
}

export const POSTER_STYLES: Record<PosterStyleName, PosterStyleConfig> = {
  ink: {
    name: 'ink',
    label: '水墨',
    labelEn: 'Ink Wash',
    description: 'Traditional Chinese ink painting aesthetic with flowing brush strokes',
    bgColor: '#F5F0E8',
    bgGradient: 'linear-gradient(135deg, #F5F0E8 0%, #E8E0D0 100%)',
    textColor: '#2C2C2C',
    accentColor: '#8B0000',
    borderColor: '#3A3A3A',
    borderStyle: 'ornate',
    fontFamily: "'Noto Serif SC', 'STSong', serif",
    fontFamilyEn: "'Cinzel', 'Noto Serif SC', serif",
    sealColor: '#8B0000',
    sealBg: 'transparent',
    footerColor: '#2C2C2C',
    noiseOpacity: 0.03,
    glowIntensity: 0.1,
    inkWashOpacity: 0.15,
  },
  dark: {
    name: 'dark',
    label: '暗黑',
    labelEn: 'Dark Mystic',
    description: 'Deep shadow aesthetic with subtle purple and blue undertones',
    bgColor: '#0A0A0F',
    bgGradient: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 100%)',
    textColor: '#E0E0E0',
    accentColor: '#9D4EDD',
    borderColor: '#4A4A6A',
    borderStyle: 'solid',
    fontFamily: "'Noto Serif SC', serif",
    fontFamilyEn: "'Cinzel', serif",
    sealColor: '#C8A45C',
    sealBg: 'rgba(200, 164, 92, 0.1)',
    footerColor: '#E0E0E0',
    noiseOpacity: 0.05,
    glowIntensity: 0.3,
  },
  royal: {
    name: 'royal',
    label: '皇家金',
    labelEn: 'Imperial Gold',
    description: 'Imperial court aesthetic with rich gold and crimson accents',
    bgColor: '#1C0F0A',
    bgGradient: 'linear-gradient(135deg, #1C0F0A 0%, #2C1810 50%, #1C0F0A 100%)',
    textColor: '#F5E6D3',
    accentColor: '#C8A45C',
    borderColor: '#C8A45C',
    borderStyle: 'double',
    fontFamily: "'Noto Serif SC', serif",
    fontFamilyEn: "'Cinzel', 'Playfair Display', serif",
    sealColor: '#8B0000',
    sealBg: 'rgba(200, 164, 92, 0.15)',
    footerColor: '#F5E6D3',
    noiseOpacity: 0.04,
    glowIntensity: 0.4,
    goldLeafOpacity: 0.2,
  },
  vintage: {
    name: 'vintage',
    label: '复古',
    labelEn: 'Vintage',
    description: 'Aged parchment with weathered edges and antique typography',
    bgColor: '#D4C5B0',
    bgGradient: 'linear-gradient(135deg, #D4C5B0 0%, #C9B8A0 100%)',
    textColor: '#3E2723',
    accentColor: '#5D4037',
    borderColor: '#5D4037',
    borderStyle: 'ornate',
    fontFamily: "'Noto Serif SC', serif",
    fontFamilyEn: "'Cinzel', 'EB Garamond', serif",
    sealColor: '#8B0000',
    sealBg: 'rgba(139, 0, 0, 0.05)',
    footerColor: '#3E2723',
    noiseOpacity: 0.06,
    glowIntensity: 0.05,
  },
  tianshi: {
    name: 'tianshi',
    label: '天师黄',
    labelEn: 'Tianshi Yellow',
    description: 'Daoist talisman paper aesthetic with vermilion red and golden yellow',
    bgColor: '#F5E6A3',
    bgGradient: 'linear-gradient(135deg, #F5E6A3 0%, #EDE0B0 100%)',
    textColor: '#8B0000',
    accentColor: '#D4AF37',
    borderColor: '#8B0000',
    borderStyle: 'double',
    fontFamily: "'Noto Serif SC', 'KaiTi', serif",
    fontFamilyEn: "'Cinzel', serif",
    sealColor: '#8B0000',
    sealBg: 'rgba(212, 175, 55, 0.15)',
    footerColor: '#8B0000',
    noiseOpacity: 0.04,
    glowIntensity: 0.15,
  },
  blackgold: {
    name: 'blackgold',
    label: '黑金',
    labelEn: 'Black & Gold',
    description: 'Modern luxury aesthetic with matte black and metallic gold contrast',
    bgColor: '#0D0D0D',
    bgGradient: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #0D0D0D 100%)',
    textColor: '#FFFFFF',
    accentColor: '#D4AF37',
    borderColor: '#D4AF37',
    borderStyle: 'solid',
    fontFamily: "'Noto Serif SC', serif",
    fontFamilyEn: "'Cinzel', 'Playfair Display', serif",
    sealColor: '#D4AF37',
    sealBg: 'rgba(212, 175, 55, 0.1)',
    footerColor: '#FFFFFF',
    noiseOpacity: 0.03,
    glowIntensity: 0.5,
    goldLeafOpacity: 0.25,
  },
  cybertao: {
    name: 'cybertao',
    label: '赛博道',
    labelEn: 'Cyber Tao',
    description: 'Neon Eastern cyberpunk: deep blue-purple-black base with neon cyan/magenta highlights and CRT scanlines',
    bgColor: '#0A0A1A',
    bgGradient: 'linear-gradient(135deg, #0A0A1A 0%, #1A0A2E 50%, #0D1B2A 100%)',
    textColor: '#E0E0E0',
    accentColor: '#00F5FF',        // 霓虹青
    borderColor: '#FF00FF',        // 品红
    borderStyle: 'solid',
    fontFamily: "'Noto Serif SC', 'Orbitron', monospace",
    fontFamilyEn: "'Orbitron', 'Cinzel', monospace",
    sealColor: '#00F5FF',          // 霓虹青印章
    sealBg: 'rgba(0, 245, 255, 0.1)',
    footerColor: '#E0E0E0',
    noiseOpacity: 0.04,
    glowIntensity: 0.8,            // 高发光强度
  },
  zengarden: {
    name: 'zengarden',
    label: '禅意园',
    labelEn: 'Zen Garden',
    description: 'Wabi-sabi aesthetics + dry landscape: cream/sand base with ink green/stone gray, generous whitespace',
    bgColor: '#F5F0E6',
    bgGradient: 'linear-gradient(135deg, #F5F0E6 0%, #EDE7DB 50%, #E8E2D4 100%)',
    textColor: '#4A4A4A',
    accentColor: '#5B7B6F',        // 墨绿
    borderColor: '#8B9D83',        // 石灰绿
    borderStyle: 'ornate',
    fontFamily: "'Noto Serif SC', 'Zen Old Mincho', serif",
    fontFamilyEn: "'Cinzel', 'Cormorant Garamond', serif",
    sealColor: '#8B4513',          // 赭石印章
    sealBg: 'rgba(139, 69, 19, 0.08)',
    footerColor: '#4A4A4A',
    noiseOpacity: 0.02,            // 极低噪点
    glowIntensity: 0.05,           // 极低光晕
  },
};

export const getStyleConfig = (name: PosterStyleName): PosterStyleConfig => POSTER_STYLES[name];
export const getAllStyles = (): PosterStyleConfig[] => Object.values(POSTER_STYLES);
export const getStyleNames = (): PosterStyleName[] => Object.keys(POSTER_STYLES) as PosterStyleName[];

/* ================================================================ */
/* 兼容层 — 旧系统 (src/components/talisman/) 命名与接口映射       */
/* ================================================================ */

/** 旧系统风格键名 — 包含新增风格的映射键 */
export type StyleKey = 'ink' | 'darkMystic' | 'imperialGold' | 'vintagePrint' | 'taoistYellow' | 'obsidianLux' | 'cyberTao' | 'zenGarden';

/** 旧系统原始 6 种风格的子集 */
export type LegacyStyleKey = 'ink' | 'darkMystic' | 'imperialGold' | 'vintagePrint' | 'taoistYellow' | 'obsidianLux';

export const STYLE_NAME_MAP: Record<PosterStyleName, StyleKey> = {
  ink: 'ink',
  dark: 'darkMystic',
  royal: 'imperialGold',
  vintage: 'vintagePrint',
  tianshi: 'taoistYellow',
  blackgold: 'obsidianLux',
  cybertao: 'cyberTao',
  zengarden: 'zenGarden',
};

export const LEGACY_STYLE_NAME_MAP: Record<StyleKey, PosterStyleName> = {
  ink: 'ink',
  darkMystic: 'dark',
  imperialGold: 'royal',
  vintagePrint: 'vintage',
  taoistYellow: 'tianshi',
  obsidianLux: 'blackgold',
  cyberTao: 'cybertao',
  zenGarden: 'zengarden',
};

/* ================================================================ */
/* 旧系统配置 — 兼容原始 6 风格（POSTER_STYLES_LEGACY 对象不新增） */
/* ================================================================ */

export interface PosterConfig {
  width: number;
  height: number;
  scale: number;
  bgColor: string;
  bgGradient?: string;
  noiseOpacity: number;
  frameColor: string;
  frameStyle: 'ornate' | 'simple' | 'none';
  frameWidth: number;
  textColor: string;
  titleFont: string;
  titleSize: number;
  titleWeight: string;
  titleLineHeight: number;
  bodyFont: string;
  bodySize: number;
  bodyLineHeight: number;
  accentColor: string;
  glowIntensity: number;
  sealColor: string;
  sealBg: string;
  sealShape: 'square' | 'round';
  sealSize: number;
  inkWashOpacity?: number;
  goldLeafOpacity?: number;
}

export interface LegacyStyleConfig {
  name: StyleKey;
  label: string;
  description: string;
  poster: PosterConfig;
}

/** 旧系统仅兼容原始 6 种风格 — 新风格通过 STYLE_NAME_MAP / LEGACY_STYLE_NAME_MAP 做双向映射 */
export const POSTER_STYLES_LEGACY: Record<LegacyStyleKey, LegacyStyleConfig> = {
  ink: {
    name: 'ink',
    label: '水墨',
    description: '传统水墨画美学，流动笔触',
    poster: {
      width: 750,
      height: 1200,
      scale: 1,
      bgColor: '#F5F0E8',
      bgGradient: 'linear-gradient(135deg, #F5F0E8 0%, #E8E0D0 100%)',
      noiseOpacity: 0.03,
      frameColor: '#3A3A3A',
      frameStyle: 'ornate',
      frameWidth: 4,
      textColor: '#2C2C2C',
      titleFont: "'Noto Serif SC', serif",
      titleSize: 36,
      titleWeight: '600',
      titleLineHeight: 1.6,
      bodyFont: "'Noto Serif SC', serif",
      bodySize: 20,
      bodyLineHeight: 1.8,
      accentColor: '#8B0000',
      glowIntensity: 0.1,
      sealColor: '#8B0000',
      sealBg: 'transparent',
      sealShape: 'square',
      sealSize: 48,
      inkWashOpacity: 0.15,
    },
  },
  darkMystic: {
    name: 'darkMystic',
    label: '暗黑',
    description: '深邃暗影美学，隐微紫蓝',
    poster: {
      width: 750,
      height: 1200,
      scale: 1,
      bgColor: '#0A0A0F',
      bgGradient: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 100%)',
      noiseOpacity: 0.05,
      frameColor: '#4A4A6A',
      frameStyle: 'simple',
      frameWidth: 2,
      textColor: '#E0E0E0',
      titleFont: "'Cinzel', serif",
      titleSize: 34,
      titleWeight: '500',
      titleLineHeight: 1.5,
      bodyFont: "'Noto Serif SC', serif",
      bodySize: 18,
      bodyLineHeight: 1.7,
      accentColor: '#9D4EDD',
      glowIntensity: 0.3,
      sealColor: '#C8A45C',
      sealBg: 'rgba(200, 164, 92, 0.1)',
      sealShape: 'round',
      sealSize: 44,
    },
  },
  imperialGold: {
    name: 'imperialGold',
    label: '皇家金',
    description: '帝王宫廷美学，金红华贵',
    poster: {
      width: 750,
      height: 1200,
      scale: 1,
      bgColor: '#1C0F0A',
      bgGradient: 'linear-gradient(135deg, #1C0F0A 0%, #2C1810 50%, #1C0F0A 100%)',
      noiseOpacity: 0.04,
      frameColor: '#C8A45C',
      frameStyle: 'ornate',
      frameWidth: 6,
      textColor: '#F5E6D3',
      titleFont: "'Cinzel', 'Playfair Display', serif",
      titleSize: 38,
      titleWeight: '600',
      titleLineHeight: 1.5,
      bodyFont: "'Noto Serif SC', serif",
      bodySize: 20,
      bodyLineHeight: 1.8,
      accentColor: '#C8A45C',
      glowIntensity: 0.4,
      sealColor: '#8B0000',
      sealBg: 'rgba(200, 164, 92, 0.15)',
      sealShape: 'square',
      sealSize: 52,
      goldLeafOpacity: 0.2,
    },
  },
  vintagePrint: {
    name: 'vintagePrint',
    label: '复古',
    description: '古旧羊皮纸美学，边缘斑驳',
    poster: {
      width: 750,
      height: 1200,
      scale: 1,
      bgColor: '#D4C5B0',
      bgGradient: 'linear-gradient(135deg, #D4C5B0 0%, #C9B8A0 100%)',
      noiseOpacity: 0.06,
      frameColor: '#5D4037',
      frameStyle: 'ornate',
      frameWidth: 5,
      textColor: '#3E2723',
      titleFont: "'Cinzel', 'EB Garamond', serif",
      titleSize: 32,
      titleWeight: '500',
      titleLineHeight: 1.6,
      bodyFont: "'Noto Serif SC', serif",
      bodySize: 19,
      bodyLineHeight: 1.8,
      accentColor: '#5D4037',
      glowIntensity: 0.05,
      sealColor: '#8B0000',
      sealBg: 'rgba(139, 0, 0, 0.05)',
      sealShape: 'square',
      sealSize: 46,
    },
  },
  taoistYellow: {
    name: 'taoistYellow',
    label: '天师黄',
    description: '道符黄纸美学，朱红金黄',
    poster: {
      width: 750,
      height: 1200,
      scale: 1,
      bgColor: '#F5E6A3',
      bgGradient: 'linear-gradient(135deg, #F5E6A3 0%, #EDE0B0 100%)',
      noiseOpacity: 0.04,
      frameColor: '#8B0000',
      frameStyle: 'simple',
      frameWidth: 3,
      textColor: '#8B0000',
      titleFont: "'Noto Serif SC', 'KaiTi', serif",
      titleSize: 36,
      titleWeight: '600',
      titleLineHeight: 1.6,
      bodyFont: "'Noto Serif SC', serif",
      bodySize: 20,
      bodyLineHeight: 1.8,
      accentColor: '#D4AF37',
      glowIntensity: 0.15,
      sealColor: '#8B0000',
      sealBg: 'rgba(212, 175, 55, 0.15)',
      sealShape: 'square',
      sealSize: 50,
    },
  },
  obsidianLux: {
    name: 'obsidianLux',
    label: '黑金',
    description: '现代奢华美学，哑黑金属金对比',
    poster: {
      width: 750,
      height: 1200,
      scale: 1,
      bgColor: '#0D0D0D',
      bgGradient: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #0D0D0D 100%)',
      noiseOpacity: 0.03,
      frameColor: '#D4AF37',
      frameStyle: 'simple',
      frameWidth: 2,
      textColor: '#FFFFFF',
      titleFont: "'Cinzel', 'Playfair Display', serif",
      titleSize: 38,
      titleWeight: '600',
      titleLineHeight: 1.4,
      bodyFont: "'Noto Serif SC', serif",
      bodySize: 20,
      bodyLineHeight: 1.8,
      accentColor: '#D4AF37',
      glowIntensity: 0.5,
      sealColor: '#D4AF37',
      sealBg: 'rgba(212, 175, 55, 0.1)',
      sealShape: 'round',
      sealSize: 48,
      goldLeafOpacity: 0.25,
    },
  },
};
