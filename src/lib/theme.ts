export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
  seal: string;
  cloud: string;
}

export interface SealInfo {
  grade: string;
  color: string;
  shape: 'circle' | 'square' | 'rounded';
  size: number;
}

export const ELEMENT_THEMES: Record<string, ThemeColors> = {
  金: { primary: '#C8A45C', secondary: '#D4AF37', accent: '#F0E68C', bg: '#1A1508', text: '#E8DCC8', seal: '#B8860B', cloud: '#DAA520' },
  木: { primary: '#2D6B5F', secondary: '#3D8B73', accent: '#5F9E8A', bg: '#0A1A14', text: '#C8E0D4', seal: '#228B22', cloud: '#2E8B57' },
  水: { primary: '#1E5A8C', secondary: '#2E7EB8', accent: '#4A9FD4', bg: '#080F1A', text: '#C8D8E8', seal: '#4682B4', cloud: '#5F9EA0' },
  火: { primary: '#8B2C2C', secondary: '#B83232', accent: '#D44848', bg: '#1A0808', text: '#E8C8C8', seal: '#DC143C', cloud: '#CD5C5C' },
  土: { primary: '#B8860B', secondary: '#D4A843', accent: '#E8C878', bg: '#1A1408', text: '#E8DCC0', seal: '#DAA520', cloud: '#DEB887' },
};

export function getTheme(element: string): ThemeColors {
  return ELEMENT_THEMES[element] || ELEMENT_THEMES['金'];
}

export function getSealInfo(score: number): SealInfo {
  if (score >= 90) return { grade: '上上签', color: '#D4AF37', shape: 'circle', size: 64 };
  if (score >= 75) return { grade: '上吉', color: '#C8A45C', shape: 'rounded', size: 56 };
  if (score >= 60) return { grade: '中吉', color: '#B8860B', shape: 'square', size: 48 };
  if (score >= 45) return { grade: '小吉', color: '#8B7355', shape: 'rounded', size: 48 };
  if (score >= 30) return { grade: '平', color: '#696969', shape: 'square', size: 40 };
  return { grade: '需谨慎', color: '#8B4513', shape: 'square', size: 40 };
}

export const FU_GALL_CHARS: Record<string, string> = {
  金: '罡', 木: '化', 水: '井', 火: '马', 土: '井',
};
