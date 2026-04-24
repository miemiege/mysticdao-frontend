/**
 * Poster Styles — 6种海报风格配置系统
 */

export type PosterStyleName = 'ink' | 'dark' | 'royal' | 'vintage' | 'tianshi' | 'blackgold';

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
    noiseOpacity: 0.03,
    glowIntensity: 0.5,
    goldLeafOpacity: 0.25,
  },
};

export const getStyleConfig = (name: PosterStyleName): PosterStyleConfig => POSTER_STYLES[name];
export const getAllStyles = (): PosterStyleConfig[] => Object.values(POSTER_STYLES);
export const getStyleNames = (): PosterStyleName[] => Object.keys(POSTER_STYLES) as PosterStyleName[];

/* ================================================================ */
/* 兼容层 — 旧系统 (src/components/talisman/) 命名与接口映射       */
/* ================================================================ */

/** 旧系统风格键（长命名） */
export type StyleKey = 'ink' | 'darkMystic' | 'imperialGold' | 'vintagePrint' | 'taoistYellow' | 'obsidianLux';

/** 新系统 → 旧系统 风格名称映射表 */
export const STYLE_NAME_MAP: Record<PosterStyleName, StyleKey> = {
  ink: 'ink',
  dark: 'darkMystic',
  royal: 'imperialGold',
  vintage: 'vintagePrint',
  tianshi: 'taoistYellow',
  blackgold: 'obsidianLux',
};

/** 旧系统 → 新系统 风格名称反向映射表 */
export const LEGACY_STYLE_NAME_MAP: Record<StyleKey, PosterStyleName> = {
  ink: 'ink',
  darkMystic: 'dark',
  imperialGold: 'royal',
  vintagePrint: 'vintage',
  taoistYellow: 'tianshi',
  obsidianLux: 'blackgold',
};

/** 旧系统海报主题配置接口 */
export interface PosterStyleTheme {
  key: StyleKey;
  name: string;
  nameEn: string;
  bgPrimary: string;
  bgSecondary?: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  sealColor: string;
  borderColor: string;
  decoColor: string;
  gold: string;
  glow: string;
  textureOpacity: number;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'double' | 'ornate' | 'geometric' | 'none';
  borderRadius: number;
  fontFamily: string;
  fontTitle: string;
  fontCJK: string;
  decoDensity: number;
  sealStyle: 'circle' | 'square' | 'oval' | 'rect';
  textDirection: 'horizontal' | 'vertical' | 'mixed';
  inspiration: string;
}

/** 旧系统完整风格配置表 */
export const POSTER_STYLES_LEGACY: Record<StyleKey, PosterStyleTheme> = {
  ink: {
    key: 'ink', name: '水墨', nameEn: 'Ink Wash',
    bgPrimary: '#F5F0EB', bgSecondary: '#E8E0D8',
    textPrimary: '#2C2C2C', textSecondary: '#6B6560',
    accent: '#8B7355', sealColor: '#8B0000', borderColor: '#C4B8A8',
    decoColor: '#B8A898', gold: '#8B7355',
    glow: 'rgba(139, 115, 85, 0.15)',
    textureOpacity: 0.08, borderStyle: 'none', borderRadius: 0,
    fontFamily: "Georgia, 'Noto Serif', serif",
    fontTitle: "Georgia, 'Playfair Display', serif",
    fontCJK: "'Noto Serif SC', 'SimSun', serif",
    decoDensity: 0.2, sealStyle: 'square', textDirection: 'mixed',
    inspiration: '水墨太极 — 极简留白，东方禅意',
  },
  darkMystic: {
    key: 'darkMystic', name: '暗黑神秘', nameEn: 'Dark Mystic',
    bgPrimary: '#0A0A0F', bgSecondary: '#1A1018',
    textPrimary: '#D4C5B0', textSecondary: '#8B7D6B',
    accent: '#8B0000', sealColor: '#DC143C', borderColor: '#3A2525',
    decoColor: '#5A3A3A', gold: '#B8860B',
    glow: 'rgba(139, 0, 0, 0.3)',
    textureOpacity: 0.15, borderStyle: 'ornate', borderRadius: 4,
    fontFamily: "Georgia, 'Cinzel', serif",
    fontTitle: "Georgia, 'Cinzel Decorative', serif",
    fontCJK: "'Noto Serif SC', serif",
    decoDensity: 0.8, sealStyle: 'oval', textDirection: 'vertical',
    inspiration: '暗黑佛手印 — 红黑高对比，宗教神秘感',
  },
  imperialGold: {
    key: 'imperialGold', name: '皇家金', nameEn: 'Imperial Gold',
    bgPrimary: '#0A0A00', bgSecondary: '#1A1000',
    textPrimary: '#D4AF37', textSecondary: '#B8860B',
    accent: '#DC143C', sealColor: '#DC143C', borderColor: '#8B6914',
    decoColor: '#6B4226', gold: '#FFD700',
    glow: 'rgba(212, 175, 55, 0.35)',
    textureOpacity: 0.12, borderStyle: 'ornate', borderRadius: 8,
    fontFamily: "Georgia, 'Cinzel', serif",
    fontTitle: "Georgia, 'Playfair Display', serif",
    fontCJK: "'Noto Serif SC', 'STKaiti', serif",
    decoDensity: 0.7, sealStyle: 'square', textDirection: 'vertical',
    inspiration: '黑底金红符咒 — 莲花线描，红金印章',
  },
  vintagePrint: {
    key: 'vintagePrint', name: '复古印刷', nameEn: 'Vintage Print',
    bgPrimary: '#E8DCC8', bgSecondary: '#D4C4A8',
    textPrimary: '#3A3028', textSecondary: '#6B5D4F',
    accent: '#8B0000', sealColor: '#8B0000', borderColor: '#5A4A3A',
    decoColor: '#7A6A5A', gold: '#B8860B',
    glow: 'rgba(90, 74, 58, 0.1)',
    textureOpacity: 0.2, borderStyle: 'double', borderRadius: 2,
    fontFamily: "Georgia, 'Courier New', serif",
    fontTitle: "Georgia, 'Playfair Display', serif",
    fontCJK: "'Noto Serif SC', 'FangSong', serif",
    decoDensity: 0.6, sealStyle: 'rect', textDirection: 'mixed',
    inspiration: '牛皮纸GOOD LUCK — 中西混排，活字印刷',
  },
  taoistYellow: {
    key: 'taoistYellow', name: '天师黄', nameEn: 'Taoist Yellow',
    bgPrimary: '#E6B800', bgSecondary: '#D4A800',
    textPrimary: '#1A1A1A', textSecondary: '#3A3020',
    accent: '#DC143C', sealColor: '#DC143C', borderColor: '#1A1A1A',
    decoColor: '#2A2A2A', gold: '#1A1A1A',
    glow: 'rgba(26, 26, 26, 0.15)',
    textureOpacity: 0.05, borderStyle: 'geometric', borderRadius: 0,
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontTitle: "'Helvetica Neue', 'Arial Black', sans-serif",
    fontCJK: "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
    decoDensity: 0.5, sealStyle: 'square', textDirection: 'horizontal',
    inspiration: '亮黄天师符 — 几何边框，红色大印章',
  },
  obsidianLux: {
    key: 'obsidianLux', name: '黑金高级', nameEn: 'Obsidian Lux',
    bgPrimary: '#080808', bgSecondary: '#121212',
    textPrimary: '#D4AF37', textSecondary: '#8B7355',
    accent: '#FFD700', sealColor: '#8B0000', borderColor: '#D4AF37',
    decoColor: '#B8860B', gold: '#FFD700',
    glow: 'rgba(212, 175, 55, 0.4)',
    textureOpacity: 0.18, borderStyle: 'solid', borderRadius: 12,
    fontFamily: "Georgia, 'Cinzel', serif",
    fontTitle: "Georgia, 'Playfair Display', serif",
    fontCJK: "'Noto Serif SC', 'STKaiti', serif",
    decoDensity: 0.5, sealStyle: 'circle', textDirection: 'vertical',
    inspiration: '黑金上上签 — 金箔渐变，云纹装饰',
  },
};

/** 旧系统兼容：获取风格配置 */
export const getPosterStyle = (styleKey: StyleKey): PosterStyleTheme => POSTER_STYLES_LEGACY[styleKey];

/** 旧系统兼容：印章信息接口 */
export interface SealInfo {
  text: string;
  textCn: string;
  color: string;
  shape: 'circle' | 'square' | 'oval' | 'rect';
  size: number;
  fontSize: number;
}

/** 旧系统兼容：获取印章信息 */
export const getSealInfo = (score: number, style: StyleKey): SealInfo => {
  const base = score >= 90 ? { text: 'GREAT\nFORTUNE', textCn: '上上签', fontSize: 11 }
    : score >= 80 ? { text: 'FORTUNE', textCn: '上吉', fontSize: 12 }
    : score >= 70 ? { text: 'GOOD', textCn: '中吉', fontSize: 13 }
    : score >= 60 ? { text: 'FAIR', textCn: '小吉', fontSize: 12 }
    : score >= 50 ? { text: 'NEUTRAL', textCn: '平', fontSize: 13 }
    : { text: 'CAUTION', textCn: '需谨慎', fontSize: 11 };

  const shapeMap: Record<StyleKey, SealInfo['shape']> = {
    ink: 'square', darkMystic: 'oval', imperialGold: 'square',
    vintagePrint: 'rect', taoistYellow: 'square', obsidianLux: 'circle',
  };

  const colorMap: Record<StyleKey, string> = {
    ink: '#8B0000', darkMystic: '#DC143C', imperialGold: '#DC143C',
    vintagePrint: '#8B0000', taoistYellow: '#DC143C', obsidianLux: '#8B0000',
  };

  return {
    ...base,
    color: colorMap[style],
    shape: shapeMap[style],
    size: score >= 90 ? 52 : score >= 80 ? 48 : score >= 70 ? 44 : score >= 60 ? 42 : score >= 50 ? 40 : 42,
  };
};

/** 旧系统兼容：根据五行与风格获取颜色 */
export const getElementColor = (element: string, style: StyleKey): string => {
  const colorMap: Record<string, Record<StyleKey, string>> = {
    '金': { ink: '#8B7355', darkMystic: '#B8860B', imperialGold: '#D4AF37', vintagePrint: '#B8860B', taoistYellow: '#1A1A1A', obsidianLux: '#D4AF37' },
    '木': { ink: '#5A7A5A', darkMystic: '#4A7C59', imperialGold: '#6B9E7A', vintagePrint: '#4A6A4A', taoistYellow: '#1A1A1A', obsidianLux: '#6B9E7A' },
    '水': { ink: '#5A7A8A', darkMystic: '#4A708A', imperialGold: '#5A9AAA', vintagePrint: '#4A6A8A', taoistYellow: '#1A1A1A', obsidianLux: '#5A9AAA' },
    '火': { ink: '#A0522D', darkMystic: '#B22222', imperialGold: '#FF6347', vintagePrint: '#8B4513', taoistYellow: '#1A1A1A', obsidianLux: '#FF6347' },
    '土': { ink: '#8B7355', darkMystic: '#8B7355', imperialGold: '#D4A76A', vintagePrint: '#8B7355', taoistYellow: '#1A1A1A', obsidianLux: '#D4A76A' },
  };
  return colorMap[element]?.[style] || colorMap['金'][style];
};
