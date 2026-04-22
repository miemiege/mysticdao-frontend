import type { Wuxing, YinYang } from './wuxing';

export interface Tiangan { name: string; pinyin: string; order: number; yinYang: YinYang; element: Wuxing; nature: string; natureEn: string; direction: string; season: string; meaning: string; meaningEn: string; traits: string[]; traitsEn: string[]; bodyPart: string; organ: string; }

export const TIANGAN_LIST: Tiangan[] = [
  { name: '甲', pinyin: 'jiǎ', order: 1, yinYang: 'yang', element: 'wood', nature: '参天大树', natureEn: 'Tall tree', direction: '东', season: '春', meaning: '阳木之首，象征参天大树，刚健正直', meaningEn: 'First Yang Wood, symbolizing a tall tree, vigorous and upright', traits: ['刚健','正直','仁慈','有领导力','进取'], traitsEn: ['Vigorous','Upright','Benevolent','Leadership','Progressive'], bodyPart: '头', organ: '胆' },
  { name: '乙', pinyin: 'yǐ', order: 2, yinYang: 'yin', element: 'wood', nature: '花草藤蔓', natureEn: 'Flowers and vines', direction: '东', season: '春', meaning: '阴木之次，象征花草藤蔓，柔顺灵活', meaningEn: 'Second Yin Wood, symbolizing flowers and vines, gentle and flexible', traits: ['柔顺','灵活','善良','有艺术感','善变'], traitsEn: ['Gentle','Flexible','Kind','Artistic','Changeable'], bodyPart: '颈', organ: '肝' },
  { name: '丙', pinyin: 'bǐng', order: 3, yinYang: 'yang', element: 'fire', nature: '太阳烈火', natureEn: 'Sun and fierce fire', direction: '南', season: '夏', meaning: '阳火之首，象征太阳烈火，热情光明', meaningEn: 'First Yang Fire, symbolizing the sun and fierce fire, passionate and bright', traits: ['热情','光明','礼貌','急躁','慷慨'], traitsEn: ['Passionate','Bright','Courteous','Impatient','Generous'], bodyPart: '肩', organ: '小肠' },
  { name: '丁', pinyin: 'dīng', order: 4, yinYang: 'yin', element: 'fire', nature: '灯烛柔火', natureEn: 'Lamp and candle flame', direction: '南', season: '夏', meaning: '阴火之次，象征灯烛柔火，温和内敛', meaningEn: 'Second Yin Fire, symbolizing lamp and candle flame, gentle and restrained', traits: ['温和','内敛','细心','有耐心','重感情'], traitsEn: ['Gentle','Restrained','Careful','Patient','Emotional'], bodyPart: '心', organ: '心' },
  { name: '戊', pinyin: 'wù', order: 5, yinYang: 'yang', element: 'earth', nature: '城墙厚土', natureEn: 'City wall earth', direction: '中', season: '长夏', meaning: '阳土之首，象征城墙厚土，稳重可靠', meaningEn: 'First Yang Earth, symbolizing city wall earth, steady and reliable', traits: ['稳重','可靠','诚信','固执','包容'], traitsEn: ['Steady','Reliable','Honest','Stubborn','Inclusive'], bodyPart: '胃', organ: '胃' },
  { name: '己', pinyin: 'jǐ', order: 6, yinYang: 'yin', element: 'earth', nature: '田园湿土', natureEn: 'Garden and field earth', direction: '中', season: '长夏', meaning: '阴土之次，象征田园湿土，柔顺滋养', meaningEn: 'Second Yin Earth, symbolizing garden earth, gentle and nourishing', traits: ['柔顺','滋养','包容','多疑','谨慎'], traitsEn: ['Gentle','Nourishing','Inclusive','Suspicious','Cautious'], bodyPart: '脾', organ: '脾' },
  { name: '庚', pinyin: 'gēng', order: 7, yinYang: 'yang', element: 'metal', nature: '刀剑锐金', natureEn: 'Sword and blade metal', direction: '西', season: '秋', meaning: '阳金之首，象征刀剑锐金，刚猛果断', meaningEn: 'First Yang Metal, symbolizing sword and blade, fierce and decisive', traits: ['刚猛','果断','义气','冷酷','重情'], traitsEn: ['Fierce','Decisive','Righteous','Cold','Loyal'], bodyPart: '大肠', organ: '大肠' },
  { name: '辛', pinyin: 'xīn', order: 8, yinYang: 'yin', element: 'metal', nature: '珠玉柔金', natureEn: 'Pearl and jade metal', direction: '西', season: '秋', meaning: '阴金之次，象征珠玉柔金，精致美丽', meaningEn: 'Second Yin Metal, symbolizing pearl and jade, exquisite and beautiful', traits: ['精致','美丽','重外表','善变','有艺术感'], traitsEn: ['Exquisite','Beautiful','Appearance-focused','Changeable','Artistic'], bodyPart: '肺', organ: '肺' },
  { name: '壬', pinyin: 'rén', order: 9, yinYang: 'yang', element: 'water', nature: '江河大水', natureEn: 'River and great water', direction: '北', season: '冬', meaning: '阳水之首，象征江河大水，奔放自由', meaningEn: 'First Yang Water, symbolizing river and great water, free and unrestrained', traits: ['奔放','自由','智慧','善变','有谋略'], traitsEn: ['Unrestrained','Free','Wise','Changeable','Strategic'], bodyPart: '膀胱', organ: '膀胱' },
  { name: '癸', pinyin: 'guǐ', order: 10, yinYang: 'yin', element: 'water', nature: '雨露细水', natureEn: 'Rain and dew water', direction: '北', season: '冬', meaning: '阴水之次，象征雨露细水，温柔细腻', meaningEn: 'Second Yin Water, symbolizing rain and dew, gentle and delicate', traits: ['温柔','细腻','有智慧','内向','敏感'], traitsEn: ['Gentle','Delicate','Wise','Introverted','Sensitive'], bodyPart: '肾', organ: '肾' },
];

export const TIANGAN_MAP: Record<string, Tiangan> = Object.fromEntries(TIANGAN_LIST.map(t => [t.name, t]));

export function getTiangan(name: string): Tiangan | undefined { return TIANGAN_MAP[name]; }
export function getTianganByOrder(order: number): Tiangan | undefined { return TIANGAN_LIST.find(t => t.order === order); }
export function getTianganByElement(element: Wuxing): Tiangan[] { return TIANGAN_LIST.filter(t => t.element === element); }
export function getTianganByYinYang(yinYang: YinYang): Tiangan[] { return TIANGAN_LIST.filter(t => t.yinYang === yinYang); }

export const TIANGAN_HE: Record<string, { partner: string; result: Wuxing }> = {
  '甲': { partner: '己', result: 'earth' }, '己': { partner: '甲', result: 'earth' },
  '乙': { partner: '庚', result: 'metal' }, '庚': { partner: '乙', result: 'metal' },
  '丙': { partner: '辛', result: 'water' }, '辛': { partner: '丙', result: 'water' },
  '丁': { partner: '壬', result: 'wood' }, '壬': { partner: '丁', result: 'wood' },
  '戊': { partner: '癸', result: 'fire' }, '癸': { partner: '戊', result: 'fire' },
};

export const TIANGAN_CHONG: Record<string, string> = {
  '甲': '庚', '庚': '甲', '乙': '辛', '辛': '乙', '丙': '壬', '壬': '丙', '丁': '癸', '癸': '丁', '戊': '戊', '己': '己',
};

export function getTianganHe(name: string) { return TIANGAN_HE[name]; }
export function getTianganChong(name: string) { return TIANGAN_CHONG[name]; }
