export type Wuxing = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type YinYang = 'yin' | 'yang' | '阴' | '阳';

export interface WuxingInfo { name: string; nameEn: string; nameEnShort: string; yinYang: YinYang; color: string; colorHex: string; direction: string; season: string; organ: string; organEn: string; emotion: string; emotionEn: string; taste: string; nature: string; natureEn: string; traits: string[]; traitsEn: string[]; sheng: Wuxing; ke: Wuxing; beiSheng: Wuxing; beiKe: Wuxing; }

export const WUXING_LIST: WuxingInfo[] = [
  { name: '木', nameEn: 'Wood', nameEnShort: 'Wood', yinYang: 'yang', color: '青', colorHex: '#4ADE80', direction: '东', season: '春', organ: '肝', organEn: 'Liver', emotion: '怒', emotionEn: 'Anger', taste: '酸', nature: '生发、条达', natureEn: 'Growth and expansion', traits: ['仁慈','正直','有主见','善变','进取'], traitsEn: ['Benevolent','Upright','Decisive','Changeable','Progressive'], sheng: 'fire', ke: 'earth', beiSheng: 'water', beiKe: 'metal' },
  { name: '火', nameEn: 'Fire', nameEnShort: 'Fire', yinYang: 'yang', color: '赤', colorHex: '#F87171', direction: '南', season: '夏', organ: '心', organEn: 'Heart', emotion: '喜', emotionEn: 'Joy', taste: '苦', nature: '炎热、向上', natureEn: 'Heat and ascent', traits: ['热情','礼貌','急躁','光明','活跃'], traitsEn: ['Passionate','Courteous','Impatient','Bright','Active'], sheng: 'earth', ke: 'metal', beiSheng: 'wood', beiKe: 'water' },
  { name: '土', nameEn: 'Earth', nameEnShort: 'Earth', yinYang: 'yin', color: '黄', colorHex: '#FBBF24', direction: '中', season: '长夏', organ: '脾', organEn: 'Spleen', emotion: '思', emotionEn: 'Pensiveness', taste: '甘', nature: '承载、生化', natureEn: 'Bearing and transformation', traits: ['诚信','稳重','包容','固执','忍耐'], traitsEn: ['Honest','Steady','Inclusive','Stubborn','Patient'], sheng: 'metal', ke: 'water', beiSheng: 'fire', beiKe: 'wood' },
  { name: '金', nameEn: 'Metal', nameEnShort: 'Metal', yinYang: 'yin', color: '白', colorHex: '#E5E7EB', direction: '西', season: '秋', organ: '肺', organEn: 'Lungs', emotion: '悲', emotionEn: 'Grief', taste: '辛', nature: '肃杀、收敛', natureEn: 'Austerity and contraction', traits: ['义气','果断','刚强','冷酷','重情'], traitsEn: ['Righteous','Decisive','Strong','Cold','Loyal'], sheng: 'water', ke: 'wood', beiSheng: 'earth', beiKe: 'fire' },
  { name: '水', nameEn: 'Water', nameEnShort: 'Water', yinYang: 'yin', color: '黑', colorHex: '#60A5FA', direction: '北', season: '冬', organ: '肾', organEn: 'Kidneys', emotion: '恐', emotionEn: 'Fear', taste: '咸', nature: '寒凉、向下', natureEn: 'Cold and descent', traits: ['智慧','灵活','善变','深沉','冷静'], traitsEn: ['Wise','Flexible','Changeable','Profound','Calm'], sheng: 'wood', ke: 'fire', beiSheng: 'metal', beiKe: 'earth' },
];

export const WUXING_MAP: Record<string, WuxingInfo> = Object.fromEntries(WUXING_LIST.map(w => [w.name, w]));

export function getWuxing(name: string): WuxingInfo | undefined { return WUXING_MAP[name]; }
export function getWuxingByElement(element: Wuxing): WuxingInfo | undefined { return WUXING_LIST.find(w => w.nameEnShort.toLowerCase() === element); }

export const WUXING_SHENG: Record<Wuxing, Wuxing> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
export const WUXING_KE: Record<Wuxing, Wuxing> = { wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' };

export function getSheng(from: Wuxing): Wuxing { return WUXING_SHENG[from]; }
export function getKe(from: Wuxing): Wuxing { return WUXING_KE[from]; }
export function getBeiSheng(to: Wuxing): Wuxing {
  for (const [k, v] of Object.entries(WUXING_SHENG)) { if (v === to) return k as Wuxing; }
  return to;
}
export function getBeiKe(to: Wuxing): Wuxing {
  for (const [k, v] of Object.entries(WUXING_KE)) { if (v === to) return k as Wuxing; }
  return to;
}

export function getWuxingRelation(a: Wuxing, b: Wuxing): '生' | '克' | '被生' | '被克' | '同' {
  if (a === b) return '同';
  if (WUXING_SHENG[a] === b) return '生';
  if (WUXING_KE[a] === b) return '克';
  if (WUXING_SHENG[b] === a) return '被生';
  if (WUXING_KE[b] === a) return '被克';
  return '同';
}

export const WUXING_COLORS: Record<Wuxing, string> = { wood: '#4ADE80', fire: '#F87171', earth: '#FBBF24', metal: '#E5E7EB', water: '#60A5FA' };
export const WUXING_COLORS_CN: Record<string, string> = { '木': '#4ADE80', '火': '#F87171', '土': '#FBBF24', '金': '#E5E7EB', '水': '#60A5FA' };
