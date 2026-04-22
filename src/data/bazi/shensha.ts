// ═══════════════════════════════════════════════════════════════
//  神煞系统 — 源自《渊海子平》《三命通会》
//  神煞是命理分析的辅助系统，用于补充和细化判断
//  吉神：天乙贵人、天月德、文昌、桃花、驿马
//  凶煞：羊刃、劫煞、亡神、孤辰、寡宿
// ═══════════════════════════════════════════════════════════════

export type ShenshaType = 'ji' | 'xiong' | 'zhongxing';

export interface Shensha {
  name: string;
  nameEn: string;
  type: ShenshaType;
  description: string;
  descriptionEn: string;
  effect: string;
  effectEn: string;
  calculation: string;
  calculationEn: string;
  meaning: string;
  meaningEn: string;
  icon: string;
  color: string;
}

export const SHENSHA_LIST: Shensha[] = [
  {
    name: '天乙贵人',
    nameEn: 'Heavenly Noble',
    type: 'ji',
    description: '命理中最吉之神，逢凶化吉，遇难呈祥',
    descriptionEn: 'The most auspicious deity in destiny, turning misfortune into blessing',
    effect: '主贵人相助，逢凶化吉，事业顺利',
    effectEn: 'Benefactors help, misfortune turns to blessing, career success',
    calculation: '甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸蛇兔藏，六辛逢马虎',
    calculationEn: 'Jia/Wu/Geng: Ox/Sheep; Yi/Ji: Rat/Monkey; Bing/Ding: Pig/Rooster; Ren/Gui: Snake/Rabbit; Xin: Horse/Tiger',
    meaning: '命带天乙贵人，一生多得贵人相助，逢凶化吉，事业顺遂。',
    meaningEn: 'Those with Heavenly Noble receive help from benefactors throughout life.',
    icon: '👑',
    color: '#c8a45c',
  },
  {
    name: '文昌贵人',
    nameEn: 'Literary Star',
    type: 'ji',
    description: '主聪明智慧，学业有成，文采出众',
    descriptionEn: 'Governs intelligence, academic success, literary talent',
    effect: '主学业优秀，聪明过人，适合文化工作',
    effectEn: 'Academic excellence, intelligence, suitable for cultural work',
    calculation: '甲乙巳午，丙戊申宫，丁己鸡，庚猪辛鼠壬逢虎，癸人见卯',
    calculationEn: 'Jia/Yi: Si/Wu; Bing/Wu: Shen; Ding/Ji: You; Geng: Hai; Xin: Zi; Ren: Yin; Gui: Mao',
    meaning: '命带文昌，聪明好学，文采出众，考试顺利，适合学术研究工作。',
    meaningEn: 'Those with Literary Star are intelligent and studious, excel in academics.',
    icon: '📚',
    color: '#60A5FA',
  },
  {
    name: '桃花',
    nameEn: 'Peach Blossom',
    type: 'zhongxing',
    description: '主异性缘、魅力、人际关系',
    descriptionEn: 'Governs attractiveness, charm, interpersonal relationships',
    effect: '主异性缘佳，魅力出众，但易感情纷扰',
    effectEn: 'Good with opposite sex, charming, but prone to romantic troubles',
    calculation: '申子辰在酉，巳酉丑在午，亥卯未在子，寅午戌在卯',
    calculationEn: 'Shen/Zi/Chen: You; Si/You/Chou: Wu; Hai/Mao/Wei: Zi; Yin/Wu/Xu: Mao',
    meaning: '命带桃花，人缘好，异性缘佳，但需防感情纷扰。墙内桃花主夫妻恩爱，墙外桃花主外遇。',
    meaningEn: 'Those with Peach Blossom are popular and attractive, but guard against romantic troubles.',
    icon: '🌸',
    color: '#F472B6',
  },
  {
    name: '驿马',
    nameEn: 'Traveling Star',
    type: 'zhongxing',
    description: '主变动、迁移、远行',
    descriptionEn: 'Governs change, migration, long journeys',
    effect: '主奔波劳碌，多动少静，适合流动性工作',
    effectEn: 'Busy and mobile, suitable for jobs requiring travel',
    calculation: '申子辰马在寅，巳酉丑马在亥，亥卯未马在巳，寅午戌马在申',
    calculationEn: 'Shen/Zi/Chen: Yin; Si/You/Chou: Hai; Hai/Mao/Wei: Si; Yin/Wu/Xu: Shen',
    meaning: '命带驿马，一生多动，适合出差、旅行、外贸等工作。但过多则奔波劳碌。',
    meaningEn: 'Those with Traveling Star are mobile, suitable for travel-related work.',
    icon: '🐎',
    color: '#FBBF24',
  },
  {
    name: '天月德',
    nameEn: 'Heavenly Virtue',
    type: 'ji',
    description: '主仁慈善良，逢凶化吉',
    descriptionEn: 'Governs kindness and benevolence, turning misfortune to blessing',
    effect: '主心地善良，积德行善，一生平安',
    effectEn: 'Kind-hearted, virtuous, peaceful life',
    calculation: '正月生见丁，二月生见申，三月生见壬，四月生见辛，五月生见甲，六月生见癸',
    calculationEn: 'Month 1: Ding; Month 2: Shen; Month 3: Ren; Month 4: Xin; Month 5: Jia; Month 6: Gui',
    meaning: '命带天月德，心地善良，乐于助人，一生多得福报，逢凶化吉。',
    meaningEn: 'Those with Heavenly Virtue are kind and receive blessings throughout life.',
    icon: '☀️',
    color: '#FBBF24',
  },
  {
    name: '羊刃',
    nameEn: 'Yang Blade',
    type: 'xiong',
    description: '主刚强、冲动、刑伤',
    descriptionEn: 'Governs strength, impulsiveness, injury',
    effect: '主性格刚烈，易冲动，有刑伤之虞',
    effectEn: 'Fierce personality, impulsive, prone to injury',
    calculation: '甲刃在卯，乙刃在寅，丙戊刃在午，丁己刃在巳，庚刃在酉，辛刃在申，壬刃在子，癸刃在亥',
    calculationEn: 'Jia: Mao; Yi: Yin; Bing/Wu: Wu; Ding/Ji: Si; Geng: You; Xin: Shen; Ren: Zi; Gui: Hai',
    meaning: '命带羊刃，性格刚烈，有魄力但易冲动。身旺则凶，身弱可帮身。',
    meaningEn: 'Those with Yang Blade are fierce and bold. Dangerous when strong DM, helpful when weak.',
    icon: '⚔️',
    color: '#991b1b',
  },
  {
    name: '劫煞',
    nameEn: 'Robbery Sha',
    type: 'xiong',
    description: '主破财、劫难、小人',
    descriptionEn: 'Governs financial loss, calamity, petty people',
    effect: '主破财损财，易遇小人，多有波折',
    effectEn: 'Financial loss, encounters petty people, many setbacks',
    calculation: '申子辰煞在巳，巳酉丑煞在寅，亥卯未煞在申，寅午戌煞在亥',
    calculationEn: 'Shen/Zi/Chen: Si; Si/You/Chou: Yin; Hai/Mao/Wei: Shen; Yin/Wu/Xu: Hai',
    meaning: '命带劫煞，易破财损财，需防小人暗算，凡事谨慎。',
    meaningEn: 'Those with Robbery Sha should guard against financial loss and petty people.',
    icon: '⚡',
    color: '#F87171',
  },
  {
    name: '亡神',
    nameEn: 'Death Spirit',
    type: 'xiong',
    description: '主心神不宁、灾祸、官非',
    descriptionEn: 'Governs restlessness, disaster, legal trouble',
    effect: '主心神不宁，易有灾祸官非',
    effectEn: 'Restless mind, prone to disaster and legal issues',
    calculation: '申子辰亡神在亥，巳酉丑亡神在申，亥卯未亡神在寅，寅午戌亡神在巳',
    calculationEn: 'Shen/Zi/Chen: Hai; Si/You/Chou: Shen; Hai/Mao/Wei: Yin; Yin/Wu/Xu: Si',
    meaning: '命带亡神，心神不宁，易有灾祸。需修身养性，谨慎行事。',
    meaningEn: 'Those with Death Spirit are restless and prone to disaster. Practice self-cultivation.',
    icon: '💀',
    color: '#7c2d12',
  },
  {
    name: '孤辰',
    nameEn: 'Loneliness Star',
    type: 'xiong',
    description: '主孤独、寡合、人缘差',
    descriptionEn: 'Governs loneliness, isolation, poor relationships',
    effect: '主性格孤僻，不善交际，人缘较差',
    effectEn: 'Aloof personality, poor social skills, weak relationships',
    calculation: '亥子丑人见寅，寅卯辰人见巳，巳午未人见申，申酉戌人见亥',
    calculationEn: 'Hai/Zi/Chou: Yin; Yin/Mao/Chen: Si; Si/Wu/Wei: Shen; Shen/You/Xu: Hai',
    meaning: '命带孤辰，性格孤僻，不善交际。男命忌孤辰，女命忌寡宿。',
    meaningEn: 'Those with Loneliness Star are aloof. Males fear this, females fear Widow Star.',
    icon: '🌑',
    color: '#4b5563',
  },
  {
    name: '寡宿',
    nameEn: 'Widow Star',
    type: 'xiong',
    description: '主孤独、婚姻不顺',
    descriptionEn: 'Governs loneliness, marital difficulties',
    effect: '主婚姻不顺，易孤独终老',
    effectEn: 'Marital difficulties, prone to ending life alone',
    calculation: '亥子丑人见戌，寅卯辰人见丑，巳午未人见辰，申酉戌人见未',
    calculationEn: 'Hai/Zi/Chou: Xu; Yin/Mao/Chen: Chou; Si/Wu/Wei: Chen; Shen/You/Xu: Wei',
    meaning: '命带寡宿，婚姻不顺，女命尤忌。需主动社交，改善人际关系。',
    meaningEn: 'Those with Widow Star have marital difficulties, especially females. Be proactive socially.',
    icon: '🌑',
    color: '#4b5563',
  },
  {
    name: '华盖',
    nameEn: 'Canopy Star',
    type: 'zhongxing',
    description: '主孤独、才华、玄学天赋',
    descriptionEn: 'Governs solitude, talent, metaphysical aptitude',
    effect: '主孤独清高，有艺术或玄学天赋',
    effectEn: 'Aloof and refined, with artistic or metaphysical talent',
    calculation: '申子辰见辰，巳酉丑见丑，亥卯未见未，寅午戌见戌',
    calculationEn: 'Shen/Zi/Chen: Chen; Si/You/Chou: Chou; Hai/Mao/Wei: Wei; Yin/Wu/Xu: Xu',
    meaning: '命带华盖，孤独清高，有艺术或玄学天赋。适合研究、艺术、宗教等领域。',
    meaningEn: 'Those with Canopy Star are aloof with artistic or metaphysical talent.',
    icon: '☂️',
    color: '#7c3aed',
  },
  {
    name: '金舆',
    nameEn: 'Golden Chariot',
    type: 'ji',
    description: '主富贵、车舆、享受',
    descriptionEn: 'Governs wealth, luxury vehicles, enjoyment',
    effect: '主富贵荣华，享受优渥',
    effectEn: 'Wealth and prosperity, luxurious lifestyle',
    calculation: '甲龙乙蛇丙戊羊，丁己猴歌庚犬方，辛猪壬牛癸逢虎',
    calculationEn: 'Jia: Chen; Yi: Si; Bing/Wu: Wei; Ding/Ji: Shen; Geng: Xu; Xin: Hai; Ren: Chou; Gui: Yin',
    meaning: '命带金舆，富贵荣华，有车舆之福，生活优渥。',
    meaningEn: 'Those with Golden Chariot enjoy wealth and luxury.',
    icon: '🚗',
    color: '#c8a45c',
  },
];

// ───────────────────────────────────────────────────────────────
//  神煞计算表
// ───────────────────────────────────────────────────────────────

/** 天乙贵人查表 */
export const TIANYI_TABLE: Record<string, string[]> = {
  '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
  '乙': ['子', '申'], '己': ['子', '申'],
  '丙': ['亥', '酉'], '丁': ['亥', '酉'],
  '壬': ['卯', '巳'], '癸': ['卯', '巳'],
  '辛': ['午', '寅'],
};

/** 文昌贵人查表 */
export const WENCHANG_TABLE: Record<string, string> = {
  '甲': '巳', '乙': '午',
  '丙': '申', '戊': '申',
  '丁': '酉', '己': '酉',
  '庚': '亥', '辛': '子',
  '壬': '寅', '癸': '卯',
};

/** 桃花查表（年支/日支） */
export const TAOHUA_TABLE: Record<string, string> = {
  '申': '酉', '子': '酉', '辰': '酉',
  '巳': '午', '酉': '午', '丑': '午',
  '亥': '子', '卯': '子', '未': '子',
  '寅': '卯', '午': '卯', '戌': '卯',
};

/** 驿马查表（年支/日支） */
export const YIMA_TABLE: Record<string, string> = {
  '申': '寅', '子': '寅', '辰': '寅',
  '巳': '亥', '酉': '亥', '丑': '亥',
  '亥': '巳', '卯': '巳', '未': '巳',
  '寅': '申', '午': '申', '戌': '申',
};

/** 华盖查表（年支/日支） */
export const HUAGAI_TABLE: Record<string, string> = {
  '申': '辰', '子': '辰', '辰': '辰',
  '巳': '丑', '酉': '丑', '丑': '丑',
  '亥': '未', '卯': '未', '未': '未',
  '寅': '戌', '午': '戌', '戌': '戌',
};

/** 羊刃查表 */
export const YANGREN_TABLE: Record<string, string> = {
  '甲': '卯', '乙': '寅',
  '丙': '午', '戊': '午',
  '丁': '巳', '己': '巳',
  '庚': '酉', '辛': '申',
  '壬': '子', '癸': '亥',
};

// ───────────────────────────────────────────────────────────────
//  查询函数
// ───────────────────────────────────────────────────────────────

export function getShensha(name: string): Shensha | undefined {
  return SHENSHA_LIST.find(s => s.name === name);
}

/** 检查某天干是否有天乙贵人（看地支） */
export function hasTianyi(dayMaster: string, branch: string): boolean {
  return (TIANYI_TABLE[dayMaster] || []).includes(branch);
}

/** 检查某天干是否有文昌贵人（看地支） */
export function hasWenchang(dayMaster: string, branch: string): boolean {
  return WENCHANG_TABLE[dayMaster] === branch;
}

/** 检查某地支是否有桃花（看年支或日支） */
export function hasTaohua(yearBranch: string, branch: string): boolean {
  return TAOHUA_TABLE[yearBranch] === branch;
}

/** 检查某地支是否有驿马（看年支或日支） */
export function hasYima(yearBranch: string, branch: string): boolean {
  return YIMA_TABLE[yearBranch] === branch;
}

/** 检查某地支是否有华盖（看年支或日支） */
export function hasHuagai(yearBranch: string, branch: string): boolean {
  return HUAGAI_TABLE[yearBranch] === branch;
}

/** 检查某天干是否有羊刃（看地支） */
export function hasYangren(dayMaster: string, branch: string): boolean {
  return YANGREN_TABLE[dayMaster] === branch;
}

/** 获取命盘所有神煞 */
export function getAllShensha(
  dayMaster: string,
  yearBranch: string,
  branches: string[]
): { name: string; type: ShenshaType; description: string }[] {
  const result: { name: string; type: ShenshaType; description: string }[] = [];
  
  for (const branch of branches) {
    if (hasTianyi(dayMaster, branch)) {
      result.push({ name: '天乙贵人', type: 'ji', description: '逢凶化吉，贵人相助' });
    }
    if (hasWenchang(dayMaster, branch)) {
      result.push({ name: '文昌贵人', type: 'ji', description: '聪明好学，文采出众' });
    }
    if (hasTaohua(yearBranch, branch)) {
      result.push({ name: '桃花', type: 'zhongxing', description: '人缘好，异性缘佳' });
    }
    if (hasYima(yearBranch, branch)) {
      result.push({ name: '驿马', type: 'zhongxing', description: '多动少静，适合流动性工作' });
    }
    if (hasHuagai(yearBranch, branch)) {
      result.push({ name: '华盖', type: 'zhongxing', description: '孤独清高，有玄学天赋' });
    }
    if (hasYangren(dayMaster, branch)) {
      result.push({ name: '羊刃', type: 'xiong', description: '性格刚烈，易冲动' });
    }
  }
  
  return result;
}
