/**
 * Poster Style System — 6种符咒海报视觉风格
 * 
 * 覆盖海外华人与海外用户的多元审美偏好
 */

export type StyleKey = 'ink' | 'darkMystic' | 'imperialGold' | 'vintagePrint' | 'taoistYellow' | 'obsidianLux';

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

export const POSTER_STYLES: Record<StyleKey, PosterStyleTheme> = {
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

export const getPosterStyle = (style: StyleKey): PosterStyleTheme => {
  return POSTER_STYLES[style] || POSTER_STYLES.obsidianLux;
};

export const STYLE_LIST: { key: StyleKey; name: string; nameEn: string }[] = [
  { key: 'ink', name: '水墨', nameEn: 'Ink Wash' },
  { key: 'darkMystic', name: '暗黑神秘', nameEn: 'Dark Mystic' },
  { key: 'imperialGold', name: '皇家金', nameEn: 'Imperial Gold' },
  { key: 'vintagePrint', name: '复古印刷', nameEn: 'Vintage Print' },
  { key: 'taoistYellow', name: '天师黄', nameEn: 'Taoist Yellow' },
  { key: 'obsidianLux', name: '黑金高级', nameEn: 'Obsidian Lux' },
];

export interface SealInfo {
  text: string;
  textCn: string;
  color: string;
  shape: 'circle' | 'square' | 'oval' | 'rect';
  size: number;
  fontSize: number;
}

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
