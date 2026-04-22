// Five Elements color definitions
export const ELEMENT_COLORS: Record<string, string> = {
  wood: '#4ADE80',
  fire: '#F87171',
  earth: '#FBBF24',
  metal: '#E5E7EB',
  water: '#60A5FA',
} as const;

export const ELEMENT_GLOW: Record<string, string> = {
  wood: 'rgba(74, 222, 128, 0.4)',
  fire: 'rgba(248, 113, 113, 0.4)',
  earth: 'rgba(251, 191, 36, 0.4)',
  metal: 'rgba(229, 231, 235, 0.4)',
  water: 'rgba(96, 165, 250, 0.4)',
} as const;

export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

// Heavenly Stems (天干)
export const HEAVENLY_STEMS = [
  '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸',
] as const;

// Earthly Branches (地支)
export const EARTHLY_BRANCHES = [
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥',
] as const;

// Element mapping for each Heavenly Stem
export const STEM_ELEMENTS: Record<string, Element> = {
  '甲': 'wood',
  '乙': 'wood',
  '丙': 'fire',
  '丁': 'fire',
  '戊': 'earth',
  '己': 'earth',
  '庚': 'metal',
  '辛': 'metal',
  '壬': 'water',
  '癸': 'water',
} as const;

// Element mapping for each Earthly Branch
export const BRANCH_ELEMENTS: Record<string, Element> = {
  '子': 'water',
  '丑': 'earth',
  '寅': 'wood',
  '卯': 'wood',
  '辰': 'earth',
  '巳': 'fire',
  '午': 'fire',
  '未': 'earth',
  '申': 'metal',
  '酉': 'metal',
  '戌': 'earth',
  '亥': 'water',
} as const;

// Hidden stems for each earthly branch (藏干)
export const HIDDEN_STEMS: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
} as const;

// Element Chinese names
export const ELEMENT_NAMES: Record<Element, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
} as const;

// Get color for a stem or branch character
export function getCharElementColor(char: string): string {
  const element = STEM_ELEMENTS[char] || BRANCH_ELEMENTS[char];
  return element ? ELEMENT_COLORS[element] : '#FFFFFF';
}

export function getCharElement(char: string): Element | undefined {
  return STEM_ELEMENTS[char] || BRANCH_ELEMENTS[char];
}

export function getCharGlowColor(char: string): string {
  const element = STEM_ELEMENTS[char] || BRANCH_ELEMENTS[char];
  return element ? ELEMENT_GLOW[element] : 'rgba(255,255,255,0.15)';
}

// Traditional Chinese time periods
export const TIME_PERIODS = [
  { label: '未知', hour: -1 },
  { label: '子时 (23:00-01:00)', hour: 0 },
  { label: '丑时 (01:00-03:00)', hour: 1 },
  { label: '寅时 (03:00-05:00)', hour: 3 },
  { label: '卯时 (05:00-07:00)', hour: 5 },
  { label: '辰时 (07:00-09:00)', hour: 7 },
  { label: '巳时 (09:00-11:00)', hour: 9 },
  { label: '午时 (11:00-13:00)', hour: 11 },
  { label: '未时 (13:00-15:00)', hour: 13 },
  { label: '申时 (15:00-17:00)', hour: 15 },
  { label: '酉时 (17:00-19:00)', hour: 17 },
  { label: '戌时 (19:00-21:00)', hour: 19 },
  { label: '亥时 (21:00-23:00)', hour: 21 },
] as const;

// Zodiac animals for branches
export const BRANCH_ANIMALS: Record<string, string> = {
  '子': '鼠',
  '丑': '牛',
  '寅': '虎',
  '卯': '兔',
  '辰': '龙',
  '巳': '蛇',
  '午': '马',
  '未': '羊',
  '申': '猴',
  '酉': '鸡',
  '戌': '狗',
  '亥': '猪',
} as const;

// Nayin (纳音) lookup - simplified mapping by year stem-branch combination
export const NAYIN_LOOKUP: Record<string, string> = {
  '甲子': '海中金', '乙丑': '海中金',
  '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木',
  '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金',
  '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水',
  '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金',
  '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水',
  '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火',
  '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水',
  '甲午': '沙中金', '乙未': '沙中金',
  '丙申': '山下火', '丁酉': '山下火',
  '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土',
  '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火',
  '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土',
  '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木',
  '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土',
  '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木',
  '壬戌': '大海水', '癸亥': '大海水',
} as const;

// Pillar labels
export const PILLAR_LABELS = ['年柱', '月柱', '日柱', '时柱'] as const;

// Pillar keys
export type PillarKey = 'year' | 'month' | 'day' | 'hour';

// ═══════════════════════════════════════════════════════════════
//  Rich content from v1.0 — meanings, traits, mock data
// ═══════════════════════════════════════════════════════════════

/** English label for each element */
export const ELEMENT_LABEL: Record<Element, string> = {
  wood:  'Wood',
  fire:  'Fire',
  earth: 'Earth',
  metal: 'Metal',
  water: 'Water',
};

/** Tooltip / hover copy for each heavenly stem */
export const STEM_MEANINGS: Record<string, string> = {
  '甲': 'Jia Wood — The Tall Tree. Growth, leadership, upright character.',
  '乙': 'Yi Wood — The Gentle Vine. Flexibility, adaptability, diplomacy.',
  '丙': 'Bing Fire — The Sun. Charisma, passion, generosity.',
  '丁': 'Ding Fire — The Candle. Focus, refinement, inner warmth.',
  '戊': 'Wu Earth — The Mountain. Stability, reliability, great patience.',
  '己': 'Ji Earth — The Garden Soil. Nurturing, supportive, detail-oriented.',
  '庚': 'Geng Metal — The Axe. Decisiveness, justice, strong will.',
  '辛': 'Xin Metal — The Jewel. Precision, beauty, emotional depth.',
  '壬': 'Ren Water — The Ocean. Wisdom, depth, boundless potential.',
  '癸': 'Gui Water — The Mist. Intuition, subtlety, creative flow.',
};

/** Tooltip copy for each earthly branch */
export const BRANCH_MEANINGS: Record<string, string> = {
  '子': 'Zi Rat — Resourcefulness, quick wit, midnight water energy.',
  '丑': 'Chou Ox — Perseverance, loyalty, early-spring earth energy.',
  '寅': 'Yin Tiger — Courage, ambition, dawn wood energy.',
  '卯': 'Mao Rabbit — Grace, diplomacy, sunrise wood energy.',
  '辰': 'Chen Dragon — Power, charisma, late-spring earth energy.',
  '巳': 'Si Snake — Wisdom, mystery, mid-morning fire energy.',
  '午': 'Wu Horse — Freedom, passion, noon fire energy.',
  '未': 'Wei Goat — Artistry, compassion, mid-afternoon earth energy.',
  '申': 'Shen Monkey — Cleverness, versatility, late-afternoon metal energy.',
  '酉': 'You Rooster — Confidence, precision, evening metal energy.',
  '戌': 'Xu Dog — Loyalty, justice, dusk earth energy.',
  '亥': 'Hai Pig — Sincerity, depth, night water energy.',
};

/** Generic description for each element */
export const ELEMENT_DESCRIPTIONS: Record<Element, string> = {
  wood:  'Growth, creativity, compassion. Strong Wood brings vision and generosity. Weak Wood may indicate indecision or lack of direction.',
  fire:  'Passion, joy, transformation. Strong Fire brings charisma and enthusiasm. Weak Fire may suggest emotional coldness or low energy.',
  earth: 'Stability, nurturing, trust. Strong Earth brings reliability and practicality. Weak Earth may indicate restlessness or insecurity.',
  metal: 'Precision, discipline, justice. Strong Metal brings focus and determination. Weak Metal may suggest disorganization or lack of boundaries.',
  water: 'Wisdom, flexibility, depth. Strong Water brings intuition and adaptability. Weak Water may indicate rigidity or shallow thinking.',
};

/** Personality traits for each Day Master element */
export const DAY_MASTER_TRAITS: Record<Element, string[]> = {
  wood: [
    'Natural leader with strong moral compass',
    'Prefers steady, long-term growth over quick wins',
    'Deeply loyal to friends and family',
    'Can be stubborn when principles are challenged',
    'Thrives in roles that allow creative vision',
    'May need to cultivate flexibility and patience',
  ],
  fire: [
    'Naturally charismatic and enthusiastic',
    'Inspires others with infectious energy',
    'Values connection and emotional warmth',
    'Can act impulsively when passions run high',
    'Excels in roles requiring presence and influence',
    'May need to cultivate calm and consistency',
  ],
  earth: [
    'Steady and reliable under pressure',
    'Naturally nurtures and supports others',
    'Has immense patience for long projects',
    'Can resist change even when needed',
    'Thrives in roles requiring structure and care',
    'May need to cultivate adaptability and spontaneity',
  ],
  metal: [
    'Highly disciplined and detail-oriented',
    'Values justice, fairness, and clear boundaries',
    'Excels at cutting through confusion',
    'Can appear cold or overly critical',
    'Thrives in roles requiring precision and analysis',
    'May need to cultivate warmth and flexibility',
  ],
  water: [
    'Deeply intuitive and adaptable',
    'Flows around obstacles with creative solutions',
    'Values wisdom and continuous learning',
    'Can be indecisive or overly accommodating',
    'Thrives in roles requiring strategy and insight',
    'May need to cultivate boundaries and decisiveness',
  ],
};

/** Day Master titles */
export const DAY_MASTER_TITLES: Record<Element, { title: string; tagline: string }> = {
  wood:  { title: 'Jia Wood — The Tall Tree', tagline: 'Reaching ever upward, rooted in purpose' },
  fire:  { title: 'Bing Fire — The Sun', tagline: 'Illuminating all with warmth and light' },
  earth: { title: 'Wu Earth — The Mountain', tagline: 'Unshakeable foundation beneath the sky' },
  metal: { title: 'Geng Metal — The Axe', tagline: 'Cutting through illusion to reveal truth' },
  water: { title: 'Ren Water — The Ocean', tagline: 'Boundless depth concealing infinite wisdom' },
};

/** Fortune period for timeline display */
export interface FortunePeriod {
  age: string;
  element: Element;
  description: string;
}

/** Mock reading for demo */
export const MOCK_FORTUNE_PERIODS: FortunePeriod[] = [
  { age: '0-10',  element: 'wood',  description: '童年成长 — 如树苗破土，天性初显' },
  { age: '11-20', element: 'fire',  description: '少年热血 — 志向萌芽，意气风发' },
  { age: '21-30', element: 'earth', description: '立业筑基 — 稳扎稳打，根基渐深' },
  { age: '31-40', element: 'metal', description: '精铁淬火 — 技艺精进，锋芒初露' },
  { age: '41-50', element: 'water', description: '不惑知命 — 智慧通达，顺流而行' },
  { age: '51-60', element: 'wood',  description: '知天命 — 返璞归真，薪火相传' },
];

/** Time ranges for the birth-time dropdown (v1.0 format) */
export const TIME_RANGES = [
  { label: '11:00 PM – 1:00 AM (子时)',   value: '23:00-01:00' },
  { label: '1:00 AM – 3:00 AM (丑时)',  value: '01:00-03:00' },
  { label: '3:00 AM – 5:00 AM (寅时)',   value: '03:00-05:00' },
  { label: '5:00 AM – 7:00 AM (卯时)',   value: '05:00-07:00' },
  { label: '7:00 AM – 9:00 AM (辰时)',  value: '07:00-09:00' },
  { label: '9:00 AM – 11:00 AM (巳时)',   value: '09:00-11:00' },
  { label: '11:00 AM – 1:00 PM (午时)',   value: '11:00-13:00' },
  { label: '1:00 PM – 3:00 PM (未时)',   value: '13:00-15:00' },
  { label: '3:00 PM – 5:00 PM (申时)',  value: '15:00-17:00' },
  { label: '5:00 PM – 7:00 PM (酉时)',   value: '17:00-19:00' },
  { label: '7:00 PM – 9:00 PM (戌时)',    value: '19:00-21:00' },
  { label: '9:00 PM – 11:00 PM (亥时)',  value: '21:00-23:00' },
];
