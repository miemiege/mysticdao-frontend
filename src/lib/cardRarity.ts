export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface RarityInfo {
  key: Rarity;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  probability: number;
}

export const RARITY_TABLE: Record<Rarity, RarityInfo> = {
  common:    { key: 'common',    label: '普通',   color: '#9CA3AF', bgColor: '#1F2937', borderColor: '#4B5563', probability: 0.50 },
  rare:      { key: 'rare',      label: '稀有',   color: '#3B82F6', bgColor: '#1E3A5F', borderColor: '#2563EB', probability: 0.30 },
  epic:      { key: 'epic',      label: '史诗',   color: '#A855F7', bgColor: '#3B1D5C', borderColor: '#7C3AED', probability: 0.14 },
  legendary: { key: 'legendary', label: '传说',   color: '#F59E0B', bgColor: '#4A3000', borderColor: '#D97706', probability: 0.05 },
  mythic:    { key: 'mythic',    label: '神话',   color: '#EF4444', bgColor: '#450A0A', borderColor: '#DC2626', probability: 0.01 },
};

export function getRarity(score: number, hexagramNumber: number): Rarity {
  const seed = score + hexagramNumber * 7;
  const rand = (seed * 9301 + 49297) % 233280 / 233280;
  let cumulative = 0;
  const entries = Object.entries(RARITY_TABLE) as [Rarity, RarityInfo][];
  for (const [key, info] of entries) {
    cumulative += info.probability;
    if (rand <= cumulative) return key;
  }
  return 'common';
}

export function getRarityInfo(rarity: Rarity): RarityInfo {
  return RARITY_TABLE[rarity];
}
