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
