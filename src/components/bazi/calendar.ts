/**
 * Chinese Calendar Conversion Utilities
 * Maps solar (Gregorian) dates to Four Pillars (四柱) using simplified algorithms.
 */

import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_ELEMENTS,
  BRANCH_ELEMENTS,
  HIDDEN_STEMS,
  NAYIN_LOOKUP,
  type Element,
  type PillarKey,
} from './data';

export interface PillarData {
  stem: string;
  branch: string;
  element: Element;
  hiddenStems: string[];
}

export interface FourPillarsData {
  year: PillarData;
  month: PillarData;
  day: PillarData;
  hour: PillarData;
}

// Get element for a stem
function getStemElement(stem: string): Element {
  return STEM_ELEMENTS[stem] || 'earth';
}

// Get element for a branch
function getBranchElement(branch: string): Element {
  return BRANCH_ELEMENTS[branch] || 'earth';
}

// Get hidden stems for a branch
function getHiddenStems(branch: string): string[] {
  return HIDDEN_STEMS[branch] || [];
}

/**
 * Calculate the year pillar from a Gregorian year.
 * Uses the Chinese calendar alignment where 1984 = 甲子 (Jia-Zi).
 */
export function getYearPillar(year: number): PillarData {
  // 1984 is 甲子 (Jia-Zi), which is index 0 for both stems and branches
  const baseYear = 1984;
  const diff = year - baseYear;

  const stemIndex = ((diff % 10) + 10) % 10;
  const branchIndex = ((diff % 12) + 12) % 12;

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  return {
    stem,
    branch,
    element: getStemElement(stem),
    hiddenStems: getHiddenStems(branch),
  };
}

/**
 * Calculate the month pillar.
 * Uses the "Year Stem determines Month Stem" rule (年上起月法).
 * Tiger month (寅月) is the first month of the year in Chinese calendar.
 * Month stem base index is determined by the year's stem.
 */
export function getMonthPillar(year: number, month: number): PillarData {
  // Get year stem to determine month stem base
  const yearPillar = getYearPillar(year);
  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearPillar.stem as (typeof HEAVENLY_STEMS)[number]);

  // The month stem base: using the "五虎遁月" method
  // Year stem determines the stem of the first month (寅月)
  const monthStemBaseMap: Record<number, number> = {
    0: 2, // 甲 -> 丙 (index 2)
    1: 4, // 乙 -> 戊 (index 4)
    2: 6, // 丙 -> 庚 (index 6)
    3: 8, // 丁 -> 壬 (index 8)
    4: 0, // 戊 -> 甲 (index 0)
    5: 2, // 己 -> 丙 (index 2)
    6: 4, // 庚 -> 戊 (index 4)
    7: 6, // 辛 -> 庚 (index 6)
    8: 8, // 壬 -> 壬 (index 8)
    9: 0, // 癸 -> 甲 (index 0)
  };

  const monthStemBase = monthStemBaseMap[yearStemIndex] || 0;

  // Chinese calendar months: 寅(0), 卯(1), 辰(2), 巳(3), 午(4), 未(5), 申(6), 酉(7), 戌(8), 亥(9), 子(10), 丑(11)
  // Gregorian month to Chinese month offset: month 1-2 -> 寅 (branch index 2)
  // Approximate mapping: (month + 1) % 12 for branch, with adjustment
  const chineseMonthBranchIndex = ((month + 1) % 12);
  const branch = EARTHLY_BRANCHES[chineseMonthBranchIndex];

  // Month stem index: base + chineseMonthOffset
  const stemIndex = (monthStemBase + chineseMonthBranchIndex) % 10;
  const stem = HEAVENLY_STEMS[stemIndex];

  return {
    stem,
    branch,
    element: getStemElement(stem),
    hiddenStems: getHiddenStems(branch),
  };
}

/**
 * Calculate the day pillar from a date.
 * Uses a known reference date and offsets from it.
 * Reference: 1900-01-31 = 甲子 (Jia-Zi).
 */
export function getDayPillar(year: number, month: number, day: number): PillarData {
  // Reference date: 1900-01-31 = 甲子
  const referenceDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);

  // Calculate days difference
  const diffMs = targetDate.getTime() - referenceDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Handle dates before reference
  const adjustedDiff = ((diffDays % 60) + 60) % 60;

  const stemIndex = adjustedDiff % 10;
  const branchIndex = adjustedDiff % 12;

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  return {
    stem,
    branch,
    element: getStemElement(stem),
    hiddenStems: getHiddenStems(branch),
  };
}

/**
 * Calculate the hour pillar.
 * Uses the "Day Stem determines Hour Stem" rule (日上起时法 / 五鼠遁元).
 */
export function getHourPillar(dayStem: string, hour: number): PillarData {
  // Hour branch is determined by the hour directly
  // 23-1 -> 子(0), 1-3 -> 丑(1), 3-5 -> 寅(2), etc.
  let hourBranchIndex: number;
  if (hour === -1) {
    // Unknown hour -> default to 子 (Zi, midnight)
    hourBranchIndex = 0;
  } else {
    hourBranchIndex = Math.floor(((hour + 1) % 24) / 2) % 12;
  }
  const branch = EARTHLY_BRANCHES[hourBranchIndex];

  // Hour stem: using "五鼠遁元" method
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem as (typeof HEAVENLY_STEMS)[number]);

  // Day stem determines the starting stem of 子时 (Zi hour, 23:00-01:00)
  const hourStemBaseMap: Record<number, number> = {
    0: 0, // 甲 -> 甲 (index 0)
    1: 2, // 乙 -> 丙 (index 2)
    2: 4, // 丙 -> 戊 (index 4)
    3: 6, // 丁 -> 庚 (index 6)
    4: 8, // 戊 -> 壬 (index 8)
    5: 0, // 己 -> 甲 (index 0)
    6: 2, // 庚 -> 丙 (index 2)
    7: 4, // 辛 -> 戊 (index 4)
    8: 6, // 壬 -> 庚 (index 6)
    9: 8, // 癸 -> 壬 (index 8)
  };

  const hourStemBase = hourStemBaseMap[dayStemIndex] || 0;
  const stemIndex = (hourStemBase + hourBranchIndex) % 10;
  const stem = HEAVENLY_STEMS[stemIndex];

  return {
    stem,
    branch,
    element: getStemElement(stem),
    hiddenStems: getHiddenStems(branch),
  };
}

/**
 * Calculate all four pillars from birth information.
 */
export function calculateFourPillars(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number
): FourPillarsData {
  const yearPillar = getYearPillar(birthYear);
  const monthPillar = getMonthPillar(birthYear, birthMonth);
  const dayPillar = getDayPillar(birthYear, birthMonth, birthDay);
  const hourPillar = getHourPillar(dayPillar.stem, birthHour);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };
}

/**
 * Get pillars in array order for display.
 */
export function getPillarsArray(pillars: FourPillarsData): Array<{ key: PillarKey; label: string; data: PillarData }> {
  return [
    { key: 'year', label: '年柱', data: pillars.year },
    { key: 'month', label: '月柱', data: pillars.month },
    { key: 'day', label: '日柱', data: pillars.day },
    { key: 'hour', label: '时柱', data: pillars.hour },
  ];
}

/**
 * Count element distribution across all pillars (stems + branches).
 */
export function countElementDistribution(pillars: FourPillarsData): Record<Element, number> {
  const counts: Record<Element, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  const allPillars = [pillars.year, pillars.month, pillars.day, pillars.hour];

  for (const pillar of allPillars) {
    // Count stem element
    const stemElement = getStemElement(pillar.stem);
    counts[stemElement]++;

    // Count branch element
    const branchElement = getBranchElement(pillar.branch);
    counts[branchElement]++;
  }

  return counts;
}

/**
 * Get Nayin (纳音) for a given pillar combination.
 */
export function getNayin(stem: string, branch: string): string {
  return NAYIN_LOOKUP[`${stem}${branch}`] || '';
}

/**
 * Get gender text.
 */
export function getGenderText(gender: 'male' | 'female'): string {
  return gender === 'male' ? '男' : '女';
}

/**
 * Format birth date string.
 */
export function formatBirthDate(
  year: number,
  month: number,
  day: number,
  hour: number
): string {
  const hourStr = hour === -1 ? '未知时辰' : `${hour.toString().padStart(2, '0')}:00`;
  return `${year}年${month}月${day}日 ${hourStr}`;
}
