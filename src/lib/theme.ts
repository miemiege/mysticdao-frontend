/**
 * Theme System — 五行主题化颜色系统
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  background: string;
  seal: string;
  gold: string;
  goldGlow: string;
}

export const THEMES: Record<string, ThemeColors> = {
  金: {
    primary: '#C8A45C',
    secondary: '#E8D5A3',
    accent: '#FFF8E7',
    glow: 'rgba(200, 164, 92, 0.3)',
    background: 'rgba(200, 164, 92, 0.06)',
    seal: '#8B0000',
    gold: '#C8A45C',
    goldGlow: 'rgba(200, 164, 92, 0.4)',
  },
  木: {
    primary: '#4A7C59',
    secondary: '#6B9E7A',
    accent: '#C8E6C9',
    glow: 'rgba(74, 124, 89, 0.3)',
    background: 'rgba(74, 124, 89, 0.06)',
    seal: '#8B0000',
    gold: '#C8A45C',
    goldGlow: 'rgba(200, 164, 92, 0.4)',
  },
  水: {
    primary: '#4A90A4',
    secondary: '#6BB3C7',
    accent: '#B3E5FC',
    glow: 'rgba(74, 144, 164, 0.3)',
    background: 'rgba(74, 144, 164, 0.06)',
    seal: '#8B0000',
    gold: '#C8A45C',
    goldGlow: 'rgba(200, 164, 92, 0.4)',
  },
  火: {
    primary: '#B22222',
    secondary: '#D44040',
    accent: '#FFCDD2',
    glow: 'rgba(178, 34, 34, 0.3)',
    background: 'rgba(178, 34, 34, 0.06)',
    seal: '#8B0000',
    gold: '#C8A45C',
    goldGlow: 'rgba(200, 164, 92, 0.4)',
  },
  土: {
    primary: '#8B7355',
    secondary: '#A68B6B',
    accent: '#D7CCC8',
    glow: 'rgba(139, 115, 85, 0.3)',
    background: 'rgba(139, 115, 85, 0.06)',
    seal: '#8B0000',
    gold: '#C8A45C',
    goldGlow: 'rgba(200, 164, 92, 0.4)',
  },
};

export const getTheme = (element: string): ThemeColors => THEMES[element] || THEMES['金'];

export interface SealInfo {
  text: string;
  color: string;
  shape: 'circle' | 'square' | 'oval';
  size: number;
}

export const getSealInfo = (score: number): SealInfo => {
  if (score >= 90) return { text: '上上签', color: '#8B0000', shape: 'circle', size: 52 };
  if (score >= 80) return { text: '上吉', color: '#A52A2A', shape: 'circle', size: 48 };
  if (score >= 70) return { text: '中吉', color: '#A52A2A', shape: 'square', size: 46 };
  if (score >= 60) return { text: '小吉', color: '#6B4423', shape: 'square', size: 44 };
  if (score >= 50) return { text: '平', color: '#6B4423', shape: 'oval', size: 40 };
  return { text: '需谨慎', color: '#4A3728', shape: 'oval', size: 44 };
};

export const FU_GALL_CHARS: Record<string, string> = {
  金: '罡',
  木: '化',
  水: '井',
  火: '马',
  土: '井',
};

export const FU_HEAD_TYPE: Record<string, 'sanqing' | 'santai' | 'chiling'> = {
  '天官赐福': 'sanqing',
  '武运昌隆': 'sanqing',
  '地母护身': 'santai',
  '姻缘和合': 'santai',
  '文昌启智': 'chiling',
  '财运亨通': 'chiling',
  '平安顺遂': 'chiling',
  '转运破厄': 'chiling',
};
