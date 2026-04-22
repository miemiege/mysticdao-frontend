import type { Wuxing, YinYang } from './wuxing';

export interface Bagua { name: string; nameEn: string; symbol: string; trigram: YinYang[]; element: Wuxing; yinYang: YinYang; nature: string; natureEn: string; family: string; familyEn: string; bodyPart: string; direction: string; number: number; color: string; animal: string; meaning: string; meaningEn: string; traits: string[]; traitsEn: string[]; }

export const BAGUA_LIST: Bagua[] = [
  { name: '乾', nameEn: 'Qian', symbol: '☰', trigram: ["阳","阳","阳"], element: 'metal', yinYang: 'yang', nature: '天', natureEn: 'Heaven', family: '父', familyEn: 'Father', bodyPart: '首', direction: '西北', number: 1, color: '#E5E7EB', animal: '马', meaning: '天行健，君子以自强不息', meaningEn: 'Heaven moves vigorously; the superior man strengthens himself ceaselessly', traits: ['刚健','创造','领导','权威','进取'], traitsEn: ['Vigorous','Creative','Leadership','Authority','Progressive'] },
  { name: '坤', nameEn: 'Kun', symbol: '☷', trigram: ["阴","阴","阴"], element: 'earth', yinYang: 'yin', nature: '地', natureEn: 'Earth', family: '母', familyEn: 'Mother', bodyPart: '腹', direction: '西南', number: 2, color: '#FBBF24', animal: '牛', meaning: '地势坤，君子以厚德载物', meaningEn: 'Earth is receptive; the superior man carries virtue with a generous nature', traits: ['柔顺','包容','承载','稳重','耐心'], traitsEn: ['Gentle','Inclusive','Bearing','Steady','Patient'] },
  { name: '震', nameEn: 'Zhen', symbol: '☳', trigram: ["阴","阴","阳"], element: 'wood', yinYang: 'yang', nature: '雷', natureEn: 'Thunder', family: '长男', familyEn: 'Eldest Son', bodyPart: '足', direction: '东', number: 3, color: '#4ADE80', animal: '龙', meaning: '雷出地奋，震惊百里', meaningEn: 'Thunder emerges from the earth, startling for a hundred li', traits: ['震动','行动','开创','勇敢','果断'], traitsEn: ['Vibrant','Active','Initiating','Brave','Decisive'] },
  { name: '巽', nameEn: 'Xun', symbol: '☴', trigram: ["阳","阳","阴"], element: 'wood', yinYang: 'yin', nature: '风', natureEn: 'Wind', family: '长女', familyEn: 'Eldest Daughter', bodyPart: '股', direction: '东南', number: 4, color: '#4ADE80', animal: '鸡', meaning: '随风巽，君子以申命行事', meaningEn: 'Wind follows wind; the superior man spreads his commands and carries out his affairs', traits: ['入','顺从','渗透','灵活','谦逊'], traitsEn: ['Penetrating','Compliant','Infiltrating','Flexible','Humble'] },
  { name: '坎', nameEn: 'Kan', symbol: '☵', trigram: ["阴","阳","阴"], element: 'water', yinYang: 'yang', nature: '水', natureEn: 'Water', family: '中男', familyEn: 'Middle Son', bodyPart: '耳', direction: '北', number: 6, color: '#60A5FA', animal: '猪', meaning: '水洊至，习坎', meaningEn: 'Water flows continuously; one becomes accustomed to danger', traits: ['险陷','智慧','隐秘','深沉','灵动'], traitsEn: ['Perilous','Wise','Hidden','Profound','Agile'] },
  { name: '离', nameEn: 'Li', symbol: '☲', trigram: ["阳","阴","阳"], element: 'fire', yinYang: 'yin', nature: '火', natureEn: 'Fire', family: '中女', familyEn: 'Middle Daughter', bodyPart: '目', direction: '南', number: 9, color: '#F87171', animal: '雉', meaning: '明两作，离', meaningEn: 'Brightness doubled forms Li', traits: ['光明','美丽','依附','文明','热情'], traitsEn: ['Bright','Beautiful','Dependent','Civilized','Passionate'] },
  { name: '艮', nameEn: 'Gen', symbol: '☶', trigram: ["阴","阴","阳"], element: 'earth', yinYang: 'yang', nature: '山', natureEn: 'Mountain', family: '少男', familyEn: 'Youngest Son', bodyPart: '手', direction: '东北', number: 8, color: '#FBBF24', animal: '狗', meaning: '兼山艮，君子以思不出其位', meaningEn: 'Mountains standing together; the superior man does not go beyond his position in thought', traits: ['止','稳重','静止','坚守','节制'], traitsEn: ['Stopping','Steady','Still','Persistent','Temperate'] },
  { name: '兑', nameEn: 'Dui', symbol: '☱', trigram: ["阳","阳","阴"], element: 'metal', yinYang: 'yin', nature: '泽', natureEn: 'Lake', family: '少女', familyEn: 'Youngest Daughter', bodyPart: '口', direction: '西', number: 7, color: '#E5E7EB', animal: '羊', meaning: '丽泽兑，君子以朋友讲习', meaningEn: 'Lakes reflecting each other; the superior man discusses and practices with friends', traits: ['喜悦','口舌','交流','愉悦','和谐'], traitsEn: ['Joyful','Eloquent','Communicative','Pleasant','Harmonious'] },
];

export const BAGUA_MAP: Record<string, Bagua> = Object.fromEntries(BAGUA_LIST.map(b => [b.name, b]));

export function getBagua(name: string): Bagua | undefined { return BAGUA_MAP[name]; }
export function getBaguaBySymbol(symbol: string): Bagua | undefined { return BAGUA_LIST.find(b => b.symbol === symbol); }
export function getBaguaByElement(element: Wuxing): Bagua[] { return BAGUA_LIST.filter(b => b.element === element); }
export function getBaguaByDirection(direction: string): Bagua | undefined { return BAGUA_LIST.find(b => b.direction === direction); }

export function getBaguaFromTrigram(trigram: YinYang[]): Bagua | undefined {
  const key = trigram.join(',');
  return BAGUA_LIST.find(b => b.trigram.join(',') === key);
}

export function getBaguaFromLines(lines: number[]): Bagua | undefined {
  const tg = lines.map(l => l >= 1 ? '阳' : '阴');
  return getBaguaFromTrigram(tg as YinYang[]);
}
