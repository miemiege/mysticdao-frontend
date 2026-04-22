import type { Wuxing, YinYang } from './wuxing';

export interface Dizhi { name: string; pinyin: string; order: number; yinYang: YinYang; element: Wuxing; animal: string; animalEn: string; month: number; hourStart: number; hourEnd: number; hourLabel: string; direction: string; season: string; canggan: string[]; meaning: string; meaningEn: string; nature: string; traits: string[]; bodyPart: string; organ: string; }

export const DIZHI_LIST: Dizhi[] = [
  { name: '子', pinyin: 'zǐ', order: 1, yinYang: 'yang', element: 'water', animal: '鼠', animalEn: 'Rat', month: 11, hourStart: 23, hourEnd: 1, hourLabel: '子时', direction: '北', season: '冬', canggan: ['癸'], meaning: '阳水，万物萌发之始', meaningEn: 'Yang Water — beginning of all things', nature: '墨池、泉水', traits: ['机智','灵活','善变','谨慎','直觉敏锐'], bodyPart: '耳', organ: '膀胱' },
  { name: '丑', pinyin: 'chǒu', order: 2, yinYang: 'yin', element: 'earth', animal: '牛', animalEn: 'Ox', month: 12, hourStart: 1, hourEnd: 3, hourLabel: '丑时', direction: '东北偏北', season: '冬', canggan: ['己','癸','辛'], meaning: '阴土，金库之所在', meaningEn: 'Yin Earth — Metal treasury', nature: '柳岸、田园', traits: ['勤劳','踏实','固执','忍耐','忠诚'], bodyPart: '肚', organ: '脾' },
  { name: '寅', pinyin: 'yín', order: 3, yinYang: 'yang', element: 'wood', animal: '虎', animalEn: 'Tiger', month: 1, hourStart: 3, hourEnd: 5, hourLabel: '寅时', direction: '东北偏东', season: '春', canggan: ['甲','丙','戊'], meaning: '阳木，火长生之地', meaningEn: 'Yang Wood — Fire birthplace', nature: '广谷、山林', traits: ['勇敢','进取','威严','冲动','有领导力'], bodyPart: '手', organ: '胆' },
  { name: '卯', pinyin: 'mǎo', order: 4, yinYang: 'yin', element: 'wood', animal: '兔', animalEn: 'Rabbit', month: 2, hourStart: 5, hourEnd: 7, hourLabel: '卯时', direction: '东', season: '春', canggan: ['乙'], meaning: '阴木，万物繁茂之象', meaningEn: 'Yin Wood — Flourishing growth', nature: '琼林、花木', traits: ['温和','优雅','谨慎','善良','有艺术气质'], bodyPart: '指', organ: '肝' },
  { name: '辰', pinyin: 'chén', order: 5, yinYang: 'yang', element: 'earth', animal: '龙', animalEn: 'Dragon', month: 3, hourStart: 7, hourEnd: 9, hourLabel: '辰时', direction: '东南偏东', season: '春', canggan: ['戊','乙','癸'], meaning: '阳土，水库之所在', meaningEn: 'Yang Earth — Water treasury', nature: '草泽、湿土', traits: ['自信','大气','有魅力','善变','理想主义'], bodyPart: '肩胸', organ: '胃' },
  { name: '巳', pinyin: 'sì', order: 6, yinYang: 'yin', element: 'fire', animal: '蛇', animalEn: 'Snake', month: 4, hourStart: 9, hourEnd: 11, hourLabel: '巳时', direction: '东南偏南', season: '夏', canggan: ['丙','庚','戊'], meaning: '阴火，金长生之地', meaningEn: 'Yin Fire — Metal birthplace', nature: '大驿、熔炉', traits: ['智慧','神秘','敏锐','多疑','有洞察力'], bodyPart: '面', organ: '心' },
  { name: '午', pinyin: 'wǔ', order: 7, yinYang: 'yang', element: 'fire', animal: '马', animalEn: 'Horse', month: 5, hourStart: 11, hourEnd: 13, hourLabel: '午时', direction: '南', season: '夏', canggan: ['丁','己'], meaning: '阳火，日正中天', meaningEn: 'Yang Fire — High noon', nature: '烽堠、烈日', traits: ['热情','奔放','自由','急躁','有感染力'], bodyPart: '眼', organ: '小肠' },
  { name: '未', pinyin: 'wèi', order: 8, yinYang: 'yin', element: 'earth', animal: '羊', animalEn: 'Goat', month: 6, hourStart: 13, hourEnd: 15, hourLabel: '未时', direction: '西南偏南', season: '夏', canggan: ['己','丁','乙'], meaning: '阴土，木库之所在', meaningEn: 'Yin Earth — Wood treasury', nature: '花园、燥土', traits: ['温和','善良','有艺术感','依赖','多愁善感'], bodyPart: '脊梁', organ: '脾' },
  { name: '申', pinyin: 'shēn', order: 9, yinYang: 'yang', element: 'metal', animal: '猴', animalEn: 'Monkey', month: 7, hourStart: 15, hourEnd: 17, hourLabel: '申时', direction: '西南偏西', season: '秋', canggan: ['庚','壬','戊'], meaning: '阳金，水长生之地', meaningEn: 'Yang Metal — Water birthplace', nature: '名都、矿石', traits: ['聪明','机灵','善变','好奇','多才多艺'], bodyPart: '经络', organ: '大肠' },
  { name: '酉', pinyin: 'yǒu', order: 10, yinYang: 'yin', element: 'metal', animal: '鸡', animalEn: 'Rooster', month: 8, hourStart: 17, hourEnd: 19, hourLabel: '酉时', direction: '西', season: '秋', canggan: ['辛'], meaning: '阴金，金之正位', meaningEn: 'Yin Metal — Pure metal position', nature: '寺钟、金器', traits: ['精致','自信','爱美','挑剔','重外表'], bodyPart: '精血', organ: '肺' },
  { name: '戌', pinyin: 'xū', order: 11, yinYang: 'yang', element: 'earth', animal: '狗', animalEn: 'Dog', month: 9, hourStart: 19, hourEnd: 21, hourLabel: '戌时', direction: '西北偏西', season: '秋', canggan: ['戊','辛','丁'], meaning: '阳土，火库之所在', meaningEn: 'Yang Earth — Fire treasury', nature: '烧原、燥土', traits: ['忠诚','正义','可靠','固执','保护欲强'], bodyPart: '命门', organ: '胃' },
  { name: '亥', pinyin: 'hài', order: 12, yinYang: 'yin', element: 'water', animal: '猪', animalEn: 'Pig', month: 10, hourStart: 21, hourEnd: 23, hourLabel: '亥时', direction: '西北偏北', season: '冬', canggan: ['壬','甲'], meaning: '阴水，木长生之地', meaningEn: 'Yin Water — Wood birthplace', nature: '悬河、湖泊', traits: ['真诚','豁达','有福气','懒散','重享受'], bodyPart: '头', organ: '肾' },
];

export const DIZHI_LIUHE: Record<string, { partner: string; result: Wuxing }> = {
  '子': { partner: '丑', result: 'earth' }, '丑': { partner: '子', result: 'earth' },
  '寅': { partner: '亥', result: 'wood' }, '亥': { partner: '寅', result: 'wood' },
  '卯': { partner: '戌', result: 'fire' }, '戌': { partner: '卯', result: 'fire' },
  '辰': { partner: '酉', result: 'metal' }, '酉': { partner: '辰', result: 'metal' },
  '巳': { partner: '申', result: 'water' }, '申': { partner: '巳', result: 'water' },
  '午': { partner: '未', result: 'earth' }, '未': { partner: '午', result: 'earth' },
};

export const DIZHI_LIUCHONG: Record<string, string> = {
  '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳',
};

export const DIZHI_SANHE: Record<string, { members: string[]; result: Wuxing }> = {
  '申子辰': { members: ['申','子','辰'], result: 'water' },
  '寅午戌': { members: ['寅','午','戌'], result: 'fire' },
  '巳酉丑': { members: ['巳','酉','丑'], result: 'metal' },
  '亥卯未': { members: ['亥','卯','未'], result: 'wood' },
};

export const DIZHI_SANHUI: Record<string, { members: string[]; result: Wuxing }> = {
  '寅卯辰': { members: ['寅','卯','辰'], result: 'wood' },
  '巳午未': { members: ['巳','午','未'], result: 'fire' },
  '申酉戌': { members: ['申','酉','戌'], result: 'metal' },
  '亥子丑': { members: ['亥','子','丑'], result: 'water' },
};

export const DIZHI_LIUHAI: Record<string, string> = {
  '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '巳', '巳': '寅',
  '卯': '辰', '辰': '卯', '申': '亥', '亥': '申', '酉': '戌', '戌': '酉',
};

export type ChangShengStage = '长生' | '沐浴' | '冠带' | '临官' | '帝旺' | '衰' | '病' | '死' | '墓' | '绝' | '胎' | '养';
export const CHANGSHENG_ORDER: ChangShengStage[] = ['长生','沐浴','冠带','临官','帝旺','衰','病','死','墓','绝','胎','养'];

export const CHANGSHENG_TABLE: Record<string, Record<string, ChangShengStage>> = {
  '甲': { '亥': '长生', '子': '沐浴', '丑': '冠带', '寅': '临官', '卯': '帝旺', '辰': '衰', '巳': '病', '午': '死', '未': '墓', '申': '绝', '酉': '胎', '戌': '养' },
  '丙': { '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺', '未': '衰', '申': '病', '酉': '死', '戌': '墓', '亥': '绝', '子': '胎', '丑': '养' },
  '戊': { '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺', '未': '衰', '申': '病', '酉': '死', '戌': '墓', '亥': '绝', '子': '胎', '丑': '养' },
  '庚': { '巳': '长生', '午': '沐浴', '未': '冠带', '申': '临官', '酉': '帝旺', '戌': '衰', '亥': '病', '子': '死', '丑': '墓', '寅': '绝', '卯': '胎', '辰': '养' },
  '壬': { '申': '长生', '酉': '沐浴', '戌': '冠带', '亥': '临官', '子': '帝旺', '丑': '衰', '寅': '病', '卯': '死', '辰': '墓', '巳': '绝', '午': '胎', '未': '养' },
  '乙': { '午': '长生', '巳': '沐浴', '辰': '冠带', '卯': '临官', '寅': '帝旺', '丑': '衰', '子': '病', '亥': '死', '戌': '墓', '酉': '绝', '申': '胎', '未': '养' },
  '丁': { '酉': '长生', '申': '沐浴', '未': '冠带', '午': '临官', '巳': '帝旺', '辰': '衰', '卯': '病', '寅': '死', '丑': '墓', '子': '绝', '亥': '胎', '戌': '养' },
  '己': { '酉': '长生', '申': '沐浴', '未': '冠带', '午': '临官', '巳': '帝旺', '辰': '衰', '卯': '病', '寅': '死', '丑': '墓', '子': '绝', '亥': '胎', '戌': '养' },
  '辛': { '子': '长生', '亥': '沐浴', '戌': '冠带', '酉': '临官', '申': '帝旺', '未': '衰', '午': '病', '巳': '死', '辰': '墓', '卯': '绝', '寅': '胎', '丑': '养' },
  '癸': { '卯': '长生', '寅': '沐浴', '丑': '冠带', '子': '临官', '亥': '帝旺', '戌': '衰', '酉': '病', '申': '死', '未': '墓', '午': '绝', '巳': '胎', '辰': '养' },
};

export function getDizhi(name: string): Dizhi | undefined { return DIZHI_LIST.find(d => d.name === name); }
export function getDizhiByOrder(order: number): Dizhi | undefined { return DIZHI_LIST.find(d => d.order === order); }
export function getDizhiByAnimal(animal: string): Dizhi | undefined { return DIZHI_LIST.find(d => d.animal === animal); }
export function getDizhiByElement(element: Wuxing): Dizhi[] { return DIZHI_LIST.filter(d => d.element === element); }
export function getDizhiLiuhe(name: string) { return DIZHI_LIUHE[name]; }
export function getDizhiChong(name: string) { return DIZHI_LIUCHONG[name]; }
export function getDizhiHai(name: string) { return DIZHI_LIUHAI[name]; }
export function getChangSheng(tg: string, dz: string): ChangShengStage | undefined { return CHANGSHENG_TABLE[tg]?.[dz]; }
export function checkSanhe(branches: string[]) {
  const sorted = [...branches].sort().join('');
  for (const [key, val] of Object.entries(DIZHI_SANHE)) {
    if (sorted === [...val.members].sort().join('')) return { name: key, result: val.result };
  }
  return null;
}
