export type YouxingName = '生气' | '延年' | '天医' | '伏位' | '绝命' | '五鬼' | '祸害' | '六煞';

export interface Youxing { name: YouxingName; nameEn: string; type: 'ji' | 'xiong'; element: string; description: string; descriptionEn: string; effect: string; effectEn: string; advice: string; adviceEn: string; color: string; number: number; }

export const YOUXING_LIST: Youxing[] = [
  { name: '生气', nameEn: 'Sheng Qi (Life Qi)', type: 'ji', element: '木', description: '生气方，主事业、财运、健康', descriptionEn: 'Life Qi direction, governing career, wealth, and health', effect: '大利事业、财运、健康，主生机勃勃', effectEn: 'Greatly benefits career, wealth, and health; full of vitality', advice: '宜开门、安床、设书房，增强事业运', adviceEn: 'Suitable for main door, bed placement, and study to enhance career', color: '#4ADE80', number: 1 },
  { name: '延年', nameEn: 'Yan Nian (Longevity)', type: 'ji', element: '金', description: '延年方，主婚姻、感情、长寿', descriptionEn: 'Longevity direction, governing marriage, relationships, and longevity', effect: '大利婚姻、感情、长寿，主和谐美满', effectEn: 'Greatly benefits marriage, relationships, and longevity; harmonious', advice: '宜设卧室、客厅，增强婚姻运', adviceEn: 'Suitable for bedroom and living room to enhance marriage luck', color: '#E5E7EB', number: 2 },
  { name: '天医', nameEn: 'Tian Yi (Heavenly Doctor)', type: 'ji', element: '土', description: '天医方，主健康、医疗、贵人', descriptionEn: 'Heavenly Doctor direction, governing health, medicine, and benefactors', effect: '大利健康、医疗、贵人相助', effectEn: 'Greatly benefits health, medicine, and benefactor support', advice: '宜设卧室、药房，增强健康运', adviceEn: 'Suitable for bedroom and medicine storage to enhance health', color: '#FBBF24', number: 3 },
  { name: '伏位', nameEn: 'Fu Wei (Stable Position)', type: 'ji', element: '木', description: '伏位方，主稳定、平安、保守', descriptionEn: 'Stable Position direction, governing stability, safety, and conservatism', effect: '主稳定、平安，但缺乏进取', effectEn: 'Governs stability and safety, but lacks progressiveness', advice: '宜设储藏室、静室，保持平稳', adviceEn: 'Suitable for storage and quiet rooms to maintain stability', color: '#4ADE80', number: 4 },
  { name: '绝命', nameEn: 'Jue Ming (Death)', type: 'xiong', element: '金', description: '绝命方，主灾祸、疾病、破财', descriptionEn: 'Death direction, governing disasters, illness, and financial loss', effect: '大凶，主灾祸、疾病、破财', effectEn: 'Very inauspicious; governs disasters, illness, and financial loss', advice: '忌开门、安床，宜设卫生间、储藏室', adviceEn: 'Avoid main door and bed; suitable for bathroom and storage', color: '#991b1b', number: 5 },
  { name: '五鬼', nameEn: 'Wu Gui (Five Ghosts)', type: 'xiong', element: '火', description: '五鬼方，主口舌、是非、小人', descriptionEn: 'Five Ghosts direction, governing gossip, disputes, and petty people', effect: '主口舌、是非、小人、火灾', effectEn: 'Governs gossip, disputes, petty people, and fire disasters', advice: '忌设厨房、卧室，宜设卫生间', adviceEn: 'Avoid kitchen and bedroom; suitable for bathroom', color: '#F87171', number: 6 },
  { name: '祸害', nameEn: 'Huo Hai (Misfortune)', type: 'xiong', element: '土', description: '祸害方，主疾病、损耗、是非', descriptionEn: 'Misfortune direction, governing illness, loss, and disputes', effect: '主疾病、损耗、是非、意外', effectEn: 'Governs illness, loss, disputes, and accidents', advice: '忌设卧室、厨房，宜设储藏室', adviceEn: 'Avoid bedroom and kitchen; suitable for storage', color: '#FBBF24', number: 7 },
  { name: '六煞', nameEn: 'Liu Sha (Six Killings)', type: 'xiong', element: '水', description: '六煞方，主桃花、感情、破财', descriptionEn: 'Six Killings direction, governing romance, relationships, and financial loss', effect: '主桃花、感情纠葛、破财', effectEn: 'Governs romance, relationship entanglements, and financial loss', advice: '忌设卧室，宜设卫生间、储藏室', adviceEn: 'Avoid bedroom; suitable for bathroom and storage', color: '#60A5FA', number: 8 },
];

export const YOUXING_MAP: Record<string, Youxing> = Object.fromEntries(YOUXING_LIST.map(y => [y.name, y]));

export function getYouxing(name: YouxingName): Youxing | undefined { return YOUXING_MAP[name]; }
export function getYouxingByType(type: 'ji' | 'xiong'): Youxing[] { return YOUXING_LIST.filter(y => y.type === type); }

export const YOUXING_ORDER: YouxingName[] = ['生气', '延年', '天医', '伏位', '绝命', '五鬼', '祸害', '六煞'];

export const YOUXING_DIRECTION_MAP: Record<string, Record<string, YouxingName>> = {
  '坎': { '北': '伏位', '东北': '五鬼', '东': '天医', '东南': '生气', '南': '延年', '西南': '绝命', '西': '祸害', '西北': '六煞' },
  '坤': { '北': '六煞', '东北': '生气', '东': '祸害', '东南': '五鬼', '南': '绝命', '西南': '伏位', '西': '延年', '西北': '天医' },
  '震': { '北': '天医', '东北': '六煞', '东': '伏位', '东南': '延年', '南': '生气', '西南': '祸害', '西': '五鬼', '西北': '绝命' },
  '巽': { '北': '生气', '东北': '延年', '东': '伏位', '东南': '天医', '南': '六煞', '西南': '五鬼', '西': '绝命', '西北': '祸害' },
  '乾': { '北': '六煞', '东北': '天医', '东': '五鬼', '东南': '祸害', '南': '绝命', '西南': '延年', '西': '生气', '西北': '伏位' },
  '兑': { '北': '五鬼', '东北': '祸害', '东': '绝命', '东南': '六煞', '南': '天医', '西南': '生气', '西': '伏位', '西北': '延年' },
  '艮': { '北': '五鬼', '东北': '伏位', '东': '六煞', '东南': '绝命', '南': '祸害', '西南': '生气', '西': '延年', '西北': '天医' },
  '离': { '北': '延年', '东北': '绝命', '东': '生气', '东南': '天医', '南': '伏位', '西南': '六煞', '西': '五鬼', '西北': '祸害' },
};

export function getYouxingByDirection(mingGua: string, direction: string): Youxing | undefined {
  const name = YOUXING_DIRECTION_MAP[mingGua]?.[direction];
  return name ? getYouxing(name) : undefined;
}

export function getYouxingLayout(mingGua: string): Record<string, Youxing> {
  const map = YOUXING_DIRECTION_MAP[mingGua];
  if (!map) return {};
  return Object.fromEntries(Object.entries(map).map(([dir, yx]) => [dir, getYouxing(yx)!]));
}
