import type { Gua64 } from '@/data/gua64';

export type Rarity = 'N' | 'R' | 'SR' | 'SSR';

export interface CollectedCard {
  hexagramNumber: number;
  hexagramName: string;
  rarity: Rarity;
  isLimited: boolean;
  obtainedAt: string;
  changingLines: number[];
  dailyScore: number;
  shareCount: number;
}

// 限定卦映射：节日名称 -> 卦编号
const LIMITED_HEXAGRAMS: Record<string, number> = {
  lichun: 24, // 复卦
  chunjie: 1, // 乾卦
  zhongqiu: 11, // 泰卦
  dongzhi: 2, // 坤卦
  qingming: 57, // 巽卦
  qixi: 30, // 离卦
  chongyang: 52, // 艮卦
  laba: 29, // 坎卦
};

// 农历节日公历日期查表 (2024-2030)
const LUNAR_FESTIVALS: Record<number, Record<string, [number, number]>> = {
  2024: { chunjie: [2, 10], qixi: [8, 10], zhongqiu: [9, 17], chongyang: [10, 11], laba: [1, 7] },
  2025: { chunjie: [1, 29], qixi: [8, 29], zhongqiu: [10, 6], chongyang: [10, 29], laba: [1, 7] },
  2026: { chunjie: [2, 17], qixi: [8, 19], zhongqiu: [9, 25], chongyang: [10, 19], laba: [1, 26] },
  2027: { chunjie: [2, 6], qixi: [8, 8], zhongqiu: [9, 15], chongyang: [10, 9], laba: [1, 15] },
  2028: { chunjie: [1, 26], qixi: [8, 26], zhongqiu: [10, 3], chongyang: [10, 26], laba: [1, 3] },
  2029: { chunjie: [2, 13], qixi: [8, 15], zhongqiu: [9, 22], chongyang: [10, 16], laba: [1, 22] },
  2030: { chunjie: [2, 3], qixi: [8, 4], zhongqiu: [9, 12], chongyang: [10, 6], laba: [1, 11] },
};

function getSolarTermDate(year: number, term: string): [number, number] | null {
  const fixed: Record<string, [number, number]> = {
    lichun: [2, 4],
    qingming: [4, 4],
    dongzhi: [12, 21],
  };
  if (fixed[term]) return fixed[term];

  const yearTable = LUNAR_FESTIVALS[year];
  if (!yearTable) return null;
  return yearTable[term] || null;
}

function isLimitedDate(date: Date): { isLimited: boolean; festival: string | null; hexagramNumber: number | null } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const checkFestival = (key: string) => {
    const d = getSolarTermDate(year, key);
    if (!d) return false;
    return month === d[0] && Math.abs(day - d[1]) <= 1;
  };

  for (const [festival, hexNum] of Object.entries(LIMITED_HEXAGRAMS)) {
    if (checkFestival(festival)) {
      return { isLimited: true, festival, hexagramNumber: hexNum };
    }
  }

  return { isLimited: false, festival: null, hexagramNumber: null };
}

function getFavorableElement(): string | null {
  try {
    const raw = localStorage.getItem('mysticdao_bazi_result');
    if (raw) {
      const data = JSON.parse(raw);
      if (data?.favorableElement) return data.favorableElement;
      if (data?.xiyongshen) return data.xiyongshen;
      if (data?.喜用神) return data.喜用神;
    }
    // Fallback: 从 storage state 的 pillars 推导
    const stateRaw = localStorage.getItem('mysticdao_state');
    if (stateRaw) {
      const state = JSON.parse(stateRaw);
      const pillars = state?.bazi?.pillars;
      if (pillars && Array.isArray(pillars)) {
        const counts: Record<string, number> = {};
        pillars.forEach((p: any) => {
          const el = p.element;
          if (el) counts[el] = (counts[el] || 0) + 1;
        });
        const elements = ['木', '火', '土', '金', '水'];
        let minEl = elements[0];
        let minCount = Infinity;
        elements.forEach((el) => {
          const c = counts[el] || 0;
          if (c < minCount) {
            minCount = c;
            minEl = el;
          }
        });
        return minEl;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function calculateRarity(
  hexagram: Gua64,
  changingLines: number[],
  _userBazi: unknown,
  date: Date
): { rarity: Rarity; isLimited: boolean } {
  const { isLimited, hexagramNumber } = isLimitedDate(date);

  const isThisLimited = isLimited && hexagramNumber === hexagram.number;

  const changeCount = changingLines.length;
  let rarity: Rarity;
  if (changeCount === 0) rarity = 'N';
  else if (changeCount <= 2) rarity = 'R';
  else if (changeCount <= 4) rarity = 'SR';
  else rarity = 'SSR';

  if (isThisLimited) {
    if (rarity === 'N' || rarity === 'R') rarity = 'SR';
  }

  const favorableElement = getFavorableElement();
  if (favorableElement && hexagram.element === favorableElement) {
    if (Math.random() < 0.2) {
      if (rarity === 'SR') rarity = 'SSR';
      else if (rarity === 'R') rarity = 'SR';
      else if (rarity === 'N') rarity = 'R';
    }
  }

  return { rarity, isLimited: isThisLimited };
}

export function getRarityColor(rarity: Rarity): string {
  switch (rarity) {
    case 'SSR':
      return '#FFD700';
    case 'SR':
      return '#DA70D6';
    case 'R':
      return '#FF4500';
    case 'N':
      return '#888888';
    default:
      return '#888888';
  }
}

export function getRarityBorderColor(rarity: Rarity): string {
  switch (rarity) {
    case 'SSR':
      return 'linear-gradient(135deg, #FFD700, #FFA500)';
    case 'SR':
      return 'linear-gradient(135deg, #DA70D6, #9932CC)';
    case 'R':
      return 'linear-gradient(135deg, #FF4500, #DC143C)';
    case 'N':
      return 'linear-gradient(135deg, #888888, #555555)';
    default:
      return 'linear-gradient(135deg, #888888, #555555)';
  }
}

export function getRarityLabel(rarity: Rarity): string {
  return rarity;
}
