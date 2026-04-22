// ═══════════════════════════════════════════════════════════════
//  格局论 — 源自《子平真诠》
//  八正格 + 变格体系
// ═══════════════════════════════════════════════════════════════

export type GejuType = '正官格' | '七杀格' | '正财格' | '偏财格' | '正印格' | '偏印格' | '食神格' | '伤官格' | '建禄格' | '羊刃格' | '从格' | '化格' | '特殊格';

export interface Geju {
  type: GejuType;
  nameEn: string;
  description: string;
  descriptionEn: string;
  conditions: string[];
  conditionsEn: string[];
  xiangShen: string[];
  xiangShenEn: string[];
  yongShen: string[];
  yongShenEn: string[];
  jiShen: string[];
  jiShenEn: string[];
  meaning: string;
  meaningEn: string;
  level: '上' | '中' | '下';
}

export const GEJU_LIST: Geju[] = [
  {
    type: '正官格', nameEn: 'Proper Authority',
    description: '月令正官透出，或官星得令而旺',
    descriptionEn: 'Proper authority in the month branch, revealed in stem',
    conditions: ['月令为正官', '官星透干', '身强能任官'],
    conditionsEn: ['Month branch is authority', 'Authority revealed in stem', 'Strong day master'],
    xiangShen: ['财星', '印星'], xiangShenEn: ['Wealth', 'Resource'],
    yongShen: ['正官', '财星'], yongShenEn: ['Authority', 'Wealth'],
    jiShen: ['伤官', '七杀'], jiShenEn: ['Rebellion', 'Challenger'],
    meaning: '正官格主贵，为人正直守信，有责任感，适合公职、管理。',
    meaningEn: 'Authority pattern governs nobility; upright and responsible, suitable for public service.',
    level: '上',
  },
  {
    type: '七杀格', nameEn: 'Seven Killings',
    description: '月令七杀透出，或七杀得令而旺',
    descriptionEn: 'Seven killings in month branch, revealed in stem',
    conditions: ['月令为七杀', '七杀透干', '有制化'],
    conditionsEn: ['Month branch is seven killings', 'Revealed in stem', 'Has control'],
    xiangShen: ['食神', '印星'], xiangShenEn: ['Output', 'Resource'],
    yongShen: ['食神', '印星'], yongShenEn: ['Output', 'Resource'],
    jiShen: ['财星', '比劫'], jiShenEn: ['Wealth', 'Friend'],
    meaning: '七杀格主武贵，有魄力，敢挑战，需制化方能为用。',
    meaningEn: 'Seven killings pattern governs martial nobility; bold but needs control.',
    level: '中',
  },
  {
    type: '正财格', nameEn: 'Proper Wealth',
    description: '月令正财透出，或财星得令而旺',
    descriptionEn: 'Proper wealth in month branch, revealed in stem',
    conditions: ['月令为正财', '财星透干', '身强能任财'],
    conditionsEn: ['Month branch is wealth', 'Wealth revealed', 'Strong day master'],
    xiangShen: ['官星', '食伤'], xiangShenEn: ['Authority', 'Output'],
    yongShen: ['正财', '官星'], yongShenEn: ['Wealth', 'Authority'],
    jiShen: ['比劫', '印星'], jiShenEn: ['Friend', 'Resource'],
    meaning: '正财格主富，勤俭持家，务实稳重，适合经商、理财。',
    meaningEn: 'Wealth pattern governs riches; frugal and practical, suitable for business.',
    level: '上',
  },
  {
    type: '偏财格', nameEn: 'Unexpected Wealth',
    description: '月令偏财透出，或偏财得令而旺',
    descriptionEn: 'Unexpected wealth in month branch, revealed in stem',
    conditions: ['月令为偏财', '偏财透干', '身强'],
    conditionsEn: ['Month branch is unexpected wealth', 'Revealed', 'Strong'],
    xiangShen: ['食神', '官星'], xiangShenEn: ['Output', 'Authority'],
    yongShen: ['偏财', '食神'], yongShenEn: ['Unexpected wealth', 'Output'],
    jiShen: ['比劫', '印星'], jiShenEn: ['Friend', 'Resource'],
    meaning: '偏财格主横财，有商业头脑，善交际，但财来财去。',
    meaningEn: 'Unexpected wealth pattern; business-minded, sociable, but volatile.',
    level: '中',
  },
  {
    type: '正印格', nameEn: 'Proper Resource',
    description: '月令正印透出，或印星得令而旺',
    descriptionEn: 'Proper resource in month branch, revealed in stem',
    conditions: ['月令为正印', '印星透干', '身弱喜印'],
    conditionsEn: ['Month branch is resource', 'Revealed', 'Weak day master likes resource'],
    xiangShen: ['官星', '比劫'], xiangShenEn: ['Authority', 'Friend'],
    yongShen: ['正印', '官星'], yongShenEn: ['Resource', 'Authority'],
    jiShen: ['财星', '食伤'], jiShenEn: ['Wealth', 'Output'],
    meaning: '正印格主文贵，学识渊博，有贵人相助，适合学术、教育。',
    meaningEn: 'Resource pattern governs scholarly nobility; learned, with benefactors.',
    level: '上',
  },
  {
    type: '偏印格', nameEn: 'Unexpected Resource',
    description: '月令偏印透出，或偏印得令而旺',
    descriptionEn: 'Unexpected resource in month branch, revealed in stem',
    conditions: ['月令为偏印', '偏印透干', '身弱'],
    conditionsEn: ['Month branch is unexpected resource', 'Revealed', 'Weak'],
    xiangShen: ['偏财', '比劫'], xiangShenEn: ['Unexpected wealth', 'Friend'],
    yongShen: ['偏财', '比劫'], yongShenEn: ['Unexpected wealth', 'Friend'],
    jiShen: ['食神', '正财'], jiShenEn: ['Output', 'Wealth'],
    meaning: '偏印格主偏门技艺，思维独特，有玄学天赋，但易孤独。',
    meaningEn: 'Unexpected resource pattern; unique thinking, metaphysical talent, but lonely.',
    level: '中',
  },
  {
    type: '食神格', nameEn: 'Output',
    description: '月令食神透出，或食神得令而旺',
    descriptionEn: 'Output in month branch, revealed in stem',
    conditions: ['月令为食神', '食神透干', '身强'],
    conditionsEn: ['Month branch is output', 'Revealed', 'Strong'],
    xiangShen: ['财星', '正官'], xiangShenEn: ['Wealth', 'Authority'],
    yongShen: ['食神', '财星'], yongShenEn: ['Output', 'Wealth'],
    jiShen: ['印星', '比劫'], jiShenEn: ['Resource', 'Friend'],
    meaning: '食神格主福，才华横溢，温和善良，懂得享受，适合艺术、餐饮。',
    meaningEn: 'Output pattern governs blessing; talented, kind, enjoys life.',
    level: '上',
  },
  {
    type: '伤官格', nameEn: 'Rebellion',
    description: '月令伤官透出，或伤官得令而旺',
    descriptionEn: 'Rebellion in month branch, revealed in stem',
    conditions: ['月令为伤官', '伤官透干', '有财星转化'],
    conditionsEn: ['Month branch is rebellion', 'Revealed', 'Has wealth to transform'],
    xiangShen: ['财星', '印星'], xiangShenEn: ['Wealth', 'Resource'],
    yongShen: ['财星', '印星'], yongShenEn: ['Wealth', 'Resource'],
    jiShen: ['官星', '比劫'], jiShenEn: ['Authority', 'Friend'],
    meaning: '伤官格主才华，聪明绝顶，创意无限，但易叛逆不羁。',
    meaningEn: 'Rebellion pattern governs talent; brilliant and creative, but rebellious.',
    level: '中',
  },
  {
    type: '建禄格', nameEn: 'Salary',
    description: '月令为日主临官之地',
    descriptionEn: 'Month branch is day master\'s临官 position',
    conditions: ['月令为日主临官', '身强', '喜财官'],
    conditionsEn: ['Month branch is临官', 'Strong', 'Likes wealth and authority'],
    xiangShen: ['财星', '官星'], xiangShenEn: ['Wealth', 'Authority'],
    yongShen: ['财星', '官星'], yongShenEn: ['Wealth', 'Authority'],
    jiShen: ['印星', '比劫'], jiShenEn: ['Resource', 'Friend'],
    meaning: '建禄格主自立，白手起家，有创业精神，但需财官配合。',
    meaningEn: 'Salary pattern; self-made, entrepreneurial, needs wealth and authority.',
    level: '中',
  },
  {
    type: '羊刃格', nameEn: 'Goat Blade',
    description: '月令为日主羊刃之地',
    descriptionEn: 'Month branch is day master\'s goat blade',
    conditions: ['月令为羊刃', '身强极', '有官杀制伏'],
    conditionsEn: ['Month branch is goat blade', 'Extremely strong', 'Has authority to control'],
    xiangShen: ['官杀', '食伤'], xiangShenEn: ['Authority', 'Output'],
    yongShen: ['七杀', '食神'], yongShenEn: ['Seven killings', 'Output'],
    jiShen: ['财星', '印星'], jiShenEn: ['Wealth', 'Resource'],
    meaning: '羊刃格主刚强，性格刚烈，有魄力，但易冲动惹祸。',
    meaningEn: 'Goat blade pattern; fierce character, bold, but impulsive.',
    level: '下',
  },
  {
    type: '从格', nameEn: 'Following',
    description: '日主极弱，不得不从旺神',
    descriptionEn: 'Day master extremely weak, must follow the strong element',
    conditions: ['日主极弱', '某五行极旺', '无根无助'],
    conditionsEn: ['Extremely weak', 'One element extremely strong', 'No support'],
    xiangShen: ['旺神'], xiangShenEn: ['Strong element'],
    yongShen: ['旺神', '生旺神之五行'], yongShenEn: ['Strong element', 'Element that generates it'],
    jiShen: ['比劫', '印星'], jiShenEn: ['Friend', 'Resource'],
    meaning: '从格主顺势，顺应大势，可成大业，但不可逆。',
    meaningEn: 'Following pattern; go with the flow, can achieve great things.',
    level: '中',
  },
  {
    type: '化格', nameEn: 'Transformation',
    description: '天干五合而化',
    descriptionEn: 'Heavenly stem five combinations transform',
    conditions: ['天干五合', '化神当令', '无破'],
    conditionsEn: ['Five combinations', 'Transforming element in season', 'No breakage'],
    xiangShen: ['化神'], xiangShenEn: ['Transforming element'],
    yongShen: ['化神'], yongShenEn: ['Transforming element'],
    jiShen: ['克化神之五行'], jiShenEn: ['Element that overcomes transforming element'],
    meaning: '化格主变化，化气成功，格局清奇，但条件苛刻。',
    meaningEn: 'Transformation pattern; successful transformation, unique pattern.',
    level: '上',
  },
  {
    type: '特殊格', nameEn: 'Special',
    description: '不符合常规格局的特殊组合',
    descriptionEn: 'Special combinations not fitting conventional patterns',
    conditions: ['特殊组合', '格局清奇'],
    conditionsEn: ['Special combination', 'Unique pattern'],
    xiangShen: ['视具体情况'], xiangShenEn: ['Depends on situation'],
    yongShen: ['视具体情况'], yongShenEn: ['Depends on situation'],
    jiShen: ['视具体情况'], jiShenEn: ['Depends on situation'],
    meaning: '特殊格千变万化，需具体分析，不可拘泥。',
    meaningEn: 'Special patterns vary greatly; analyze specifically.',
    level: '中',
  },
];

export const GEJU_MAP: Record<string, Geju> = Object.fromEntries(GEJU_LIST.map(g => [g.type, g]));

export function getGeju(type: GejuType): Geju | undefined { return GEJU_MAP[type]; }

export function getGejuLevel(type: GejuType): string {
  return GEJU_MAP[type]?.level || '中';
}

interface Pillar { stem: string; branch: string; }

export function determineGeju(pillars: Pillar[], dayMaster: string): GejuType {
  const monthPillar = pillars[1];
  if (!monthPillar) return '特殊格';
  // const monthBranch = monthPillar.branch;
  const monthStem = monthPillar.stem;
  
  const tgElement: Record<string, string> = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
  const tgYy: Record<string, string> = { '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳', '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴' };
  const wxSheng: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const wxKe: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
  
  const dmEl = tgElement[dayMaster];
  if (!dmEl) return '特殊格';
  
  function calcShishen(tg: string): string {
    const tEl = tgElement[tg], tYy = tgYy[tg], dYy = tgYy[dayMaster];
    if (!tEl) return '比肩';
    if (dmEl === tEl) return dYy === tYy ? '比肩' : '劫财';
    if (wxSheng[dmEl] === tEl) return dYy === tYy ? '食神' : '伤官';
    if (wxKe[dmEl] === tEl) return dYy === tYy ? '偏财' : '正财';
    if (wxKe[tEl] === dmEl) return dYy === tYy ? '七杀' : '正官';
    if (wxSheng[tEl] === dmEl) return dYy === tYy ? '偏印' : '正印';
    return '比肩';
  }
  
  const monthShishen = calcShishen(monthStem);
  
  const shishenToGeju: Record<string, GejuType> = {
    '正官': '正官格', '七杀': '七杀格', '正财': '正财格', '偏财': '偏财格',
    '正印': '正印格', '偏印': '偏印格', '食神': '食神格', '伤官': '伤官格',
  };
  
  if (shishenToGeju[monthShishen]) return shishenToGeju[monthShishen];
  
  return '特殊格';
}
