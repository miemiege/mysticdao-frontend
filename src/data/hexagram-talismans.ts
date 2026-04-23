/**
 * Hexagram Talisman Library — 64卦符咒素材映射库
 *
 * 设计原则：
 * 1. 每卦对应一种祈福主题，符咒有实际祈福意义
 * 2. 素材路径指向 public/talismans/ 目录
 * 3. 占位符模式：无真实素材时，用程序化 SVG 生成符咒
 * 4. 可扩展：后续只需替换 svgPath 为真实素材，其他数据不变
 *
 * 符咒分类（8大类）：
 * - 天官赐福类（事业/创造）
 * - 地母护身类（包容/承载）
 * - 文昌启智类（学业/启蒙）
 * - 财运亨通类（财富/丰收）
 * - 姻缘和合类（感情/人际）
 * - 平安顺遂类（健康/平安）
 * - 武运昌隆类（竞争/突破）
 * - 转运破厄类（化解/转变）
 */

export interface HexagramTalisman {
  /** 卦名 */
  hexagramName: string;
  /** 祈福主题（如"天官赐福"） */
  blessingTheme: string;
  /** 符咒分类 */
  category: TalismanCategory;
  /** 五行属性 */
  element: string;
  /** 素材路径（相对 public/），null 表示使用占位符 */
  svgPath: string | null;
  /** 占位符生成种子（确保同卦符咒每次都一样） */
  placeholderSeed: number;
}

export type TalismanCategory =
  | '天官赐福' // 事业、创造、领导
  | '地母护身' // 包容、承载、稳定
  | '文昌启智' // 学业、启蒙、智慧
  | '财运亨通' // 财富、丰收、资源
  | '姻缘和合' // 感情、人际、合作
  | '平安顺遂' // 健康、平安、谨慎
  | '武运昌隆' // 竞争、突破、力量
  | '转运破厄'; // 化解、转变、重生

/** 根据运势分数获取印章文字 */
export const getSealText = (score: number): string => {
  if (score >= 90) return '上上签';
  if (score >= 80) return '上吉';
  if (score >= 70) return '中吉';
  if (score >= 60) return '小吉';
  if (score >= 50) return '平';
  return '需谨慎';
};

/** 根据运势分数获取印章颜色 */
export const getSealColor = (score: number): string => {
  if (score >= 80) return '#8B0000';
  if (score >= 60) return '#A52A2A';
  return '#6B4423';
};

/** 64卦符咒映射表 — 按周易标准顺序排列 */
export const HEXAGRAM_TALISMANS: Record<string, HexagramTalisman> = {
  // === 上经 30卦 ===
  '乾为天':   { hexagramName: '乾为天',   blessingTheme: '天官赐福', category: '天官赐福', element: '金', svgPath: null, placeholderSeed: 1 },
  '坤为地':   { hexagramName: '坤为地',   blessingTheme: '地母护身', category: '地母护身', element: '土', svgPath: null, placeholderSeed: 2 },
  '水雷屯':   { hexagramName: '水雷屯',   blessingTheme: '开运转运', category: '转运破厄', element: '水', svgPath: null, placeholderSeed: 3 },
  '山水蒙':   { hexagramName: '山水蒙',   blessingTheme: '文昌启智', category: '文昌启智', element: '土', svgPath: null, placeholderSeed: 4 },
  '水天需':   { hexagramName: '水天需',   blessingTheme: '静待财来', category: '财运亨通', element: '水', svgPath: null, placeholderSeed: 5 },
  '天水讼':   { hexagramName: '天水讼',   blessingTheme: '息讼和解', category: '转运破厄', element: '金', svgPath: null, placeholderSeed: 6 },
  '地水师':   { hexagramName: '地水师',   blessingTheme: '武运昌隆', category: '武运昌隆', element: '土', svgPath: null, placeholderSeed: 7 },
  '水地比':   { hexagramName: '水地比',   blessingTheme: '贵人相助', category: '姻缘和合', element: '水', svgPath: null, placeholderSeed: 8 },
  '风天小畜': { hexagramName: '风天小畜', blessingTheme: '蓄积待发', category: '财运亨通', element: '木', svgPath: null, placeholderSeed: 9 },
  '天泽履':   { hexagramName: '天泽履',   blessingTheme: '步步平安', category: '平安顺遂', element: '金', svgPath: null, placeholderSeed: 10 },
  '地天泰':   { hexagramName: '地天泰',   blessingTheme: '天地通泰', category: '天官赐福', element: '土', svgPath: null, placeholderSeed: 11 },
  '天地否':   { hexagramName: '天地否',   blessingTheme: '转运破否', category: '转运破厄', element: '金', svgPath: null, placeholderSeed: 12 },
  '天火同人': { hexagramName: '天火同人', blessingTheme: '志同道合', category: '姻缘和合', element: '金', svgPath: null, placeholderSeed: 13 },
  '火天大有': { hexagramName: '火天大有', blessingTheme: '财运亨通', category: '财运亨通', element: '火', svgPath: null, placeholderSeed: 14 },
  '地山谦':   { hexagramName: '地山谦',   blessingTheme: '谦德载福', category: '天官赐福', element: '土', svgPath: null, placeholderSeed: 15 },
  '雷地豫':   { hexagramName: '雷地豫',   blessingTheme: '喜乐安康', category: '平安顺遂', element: '木', svgPath: null, placeholderSeed: 16 },
  '泽雷随':   { hexagramName: '泽雷随',   blessingTheme: '随顺通达', category: '平安顺遂', element: '金', svgPath: null, placeholderSeed: 17 },
  '山风蛊':   { hexagramName: '山风蛊',   blessingTheme: '除旧布新', category: '转运破厄', element: '土', svgPath: null, placeholderSeed: 18 },
  '地泽临':   { hexagramName: '地泽临',   blessingTheme: '临官进禄', category: '天官赐福', element: '土', svgPath: null, placeholderSeed: 19 },
  '风地观':   { hexagramName: '风地观',   blessingTheme: '明察秋毫', category: '文昌启智', element: '木', svgPath: null, placeholderSeed: 20 },
  '火雷噬嗑': { hexagramName: '火雷噬嗑', blessingTheme: '明罚勅法', category: '武运昌隆', element: '火', svgPath: null, placeholderSeed: 21 },
  '山火贲':   { hexagramName: '山火贲',   blessingTheme: '文质彬彬', category: '文昌启智', element: '土', svgPath: null, placeholderSeed: 22 },
  '山地剥':   { hexagramName: '山地剥',   blessingTheme: '守静待时', category: '转运破厄', element: '土', svgPath: null, placeholderSeed: 23 },
  '地雷复':   { hexagramName: '地雷复',   blessingTheme: '否极泰来', category: '转运破厄', element: '土', svgPath: null, placeholderSeed: 24 },
  '天雷无妄': { hexagramName: '天雷无妄', blessingTheme: '真实无妄', category: '天官赐福', element: '金', svgPath: null, placeholderSeed: 25 },
  '山天大畜': { hexagramName: '山天大畜', blessingTheme: '蓄德载物', category: '文昌启智', element: '土', svgPath: null, placeholderSeed: 26 },
  '山雷颐':   { hexagramName: '山雷颐',   blessingTheme: '颐养天年', category: '平安顺遂', element: '土', svgPath: null, placeholderSeed: 27 },
  '泽风大过': { hexagramName: '泽风大过', blessingTheme: '独立不惧', category: '转运破厄', element: '金', svgPath: null, placeholderSeed: 28 },
  '坎为水':   { hexagramName: '坎为水',   blessingTheme: '渡厄平安', category: '平安顺遂', element: '水', svgPath: null, placeholderSeed: 29 },
  '离为火':   { hexagramName: '离为火',   blessingTheme: '光明普照', category: '武运昌隆', element: '火', svgPath: null, placeholderSeed: 30 },
  // === 下经 34卦 ===
  '泽山咸':   { hexagramName: '泽山咸',   blessingTheme: '姻缘和合', category: '姻缘和合', element: '金', svgPath: null, placeholderSeed: 31 },
  '雷风恒':   { hexagramName: '雷风恒',   blessingTheme: '恒久不渝', category: '姻缘和合', element: '木', svgPath: null, placeholderSeed: 32 },
  '天山遁':   { hexagramName: '天山遁',   blessingTheme: '遁世保身', category: '平安顺遂', element: '金', svgPath: null, placeholderSeed: 33 },
  '雷天大壮': { hexagramName: '雷天大壮', blessingTheme: '壮盛守正', category: '武运昌隆', element: '木', svgPath: null, placeholderSeed: 34 },
  '火地晋':   { hexagramName: '火地晋',   blessingTheme: '晋升进禄', category: '武运昌隆', element: '火', svgPath: null, placeholderSeed: 35 },
  '地火明夷': { hexagramName: '地火明夷', blessingTheme: '韬光养晦', category: '转运破厄', element: '土', svgPath: null, placeholderSeed: 36 },
  '风火家人': { hexagramName: '风火家人', blessingTheme: '家和万事兴', category: '姻缘和合', element: '木', svgPath: null, placeholderSeed: 37 },
  '火泽睽':   { hexagramName: '火泽睽',   blessingTheme: '求同存异', category: '姻缘和合', element: '火', svgPath: null, placeholderSeed: 38 },
  '水山蹇':   { hexagramName: '水山蹇',   blessingTheme: '蹇难渡厄', category: '转运破厄', element: '水', svgPath: null, placeholderSeed: 39 },
  '雷水解':   { hexagramName: '雷水解',   blessingTheme: '解厄消灾', category: '转运破厄', element: '木', svgPath: null, placeholderSeed: 40 },
  '山泽损':   { hexagramName: '山泽损',   blessingTheme: '损上益下', category: '财运亨通', element: '土', svgPath: null, placeholderSeed: 41 },
  '风雷益':   { hexagramName: '风雷益',   blessingTheme: '益上益下', category: '财运亨通', element: '木', svgPath: null, placeholderSeed: 42 },
  '泽天夬':   { hexagramName: '泽天夬',   blessingTheme: '决断果敢', category: '武运昌隆', element: '金', svgPath: null, placeholderSeed: 43 },
  '天风姤':   { hexagramName: '天风姤',   blessingTheme: '防微杜渐', category: '转运破厄', element: '金', svgPath: null, placeholderSeed: 44 },
  '泽地萃':   { hexagramName: '泽地萃',   blessingTheme: '萃聚人缘', category: '姻缘和合', element: '金', svgPath: null, placeholderSeed: 45 },
  '地风升':   { hexagramName: '地风升',   blessingTheme: '步步高升', category: '天官赐福', element: '土', svgPath: null, placeholderSeed: 46 },
  '泽水困':   { hexagramName: '泽水困',   blessingTheme: '困中守正', category: '转运破厄', element: '金', svgPath: null, placeholderSeed: 47 },
  '水风井':   { hexagramName: '水风井',   blessingTheme: '井泉滋养', category: '财运亨通', element: '水', svgPath: null, placeholderSeed: 48 },
  '泽火革':   { hexagramName: '泽火革',   blessingTheme: '革故鼎新', category: '转运破厄', element: '金', svgPath: null, placeholderSeed: 49 },
  '火风鼎':   { hexagramName: '火风鼎',   blessingTheme: '鼎新立命', category: '武运昌隆', element: '火', svgPath: null, placeholderSeed: 50 },
  '震为雷':   { hexagramName: '震为雷',   blessingTheme: '雷震开运', category: '武运昌隆', element: '木', svgPath: null, placeholderSeed: 51 },
  '艮为山':   { hexagramName: '艮为山',   blessingTheme: '山止为安', category: '平安顺遂', element: '土', svgPath: null, placeholderSeed: 52 },
  '风山渐':   { hexagramName: '风山渐',   blessingTheme: '循序渐进', category: '文昌启智', element: '木', svgPath: null, placeholderSeed: 53 },
  '雷泽归妹': { hexagramName: '雷泽归妹', blessingTheme: '婚嫁吉祥', category: '姻缘和合', element: '木', svgPath: null, placeholderSeed: 54 },
  '雷火丰':   { hexagramName: '雷火丰',   blessingTheme: '丰亨豫大', category: '财运亨通', element: '木', svgPath: null, placeholderSeed: 55 },
  '火山旅':   { hexagramName: '火山旅',   blessingTheme: '旅途平安', category: '平安顺遂', element: '火', svgPath: null, placeholderSeed: 56 },
  '巽为风':   { hexagramName: '巽为风',   blessingTheme: '风行天下', category: '平安顺遂', element: '木', svgPath: null, placeholderSeed: 57 },
  '兑为泽':   { hexagramName: '兑为泽',   blessingTheme: '泽被万物', category: '姻缘和合', element: '金', svgPath: null, placeholderSeed: 58 },
  '风水涣':   { hexagramName: '风水涣',   blessingTheme: '涣散聚合', category: '平安顺遂', element: '木', svgPath: null, placeholderSeed: 59 },
  '水泽节':   { hexagramName: '水泽节',   blessingTheme: '节制生财', category: '财运亨通', element: '水', svgPath: null, placeholderSeed: 60 },
  '风泽中孚': { hexagramName: '风泽中孚', blessingTheme: '诚信为本', category: '姻缘和合', element: '木', svgPath: null, placeholderSeed: 61 },
  '雷山小过': { hexagramName: '雷山小过', blessingTheme: '小过无咎', category: '平安顺遂', element: '木', svgPath: null, placeholderSeed: 62 },
  '水火既济': { hexagramName: '水火既济', blessingTheme: '功成圆满', category: '天官赐福', element: '水', svgPath: null, placeholderSeed: 63 },
  '火水未济': { hexagramName: '火水未济', blessingTheme: '未济待机', category: '转运破厄', element: '火', svgPath: null, placeholderSeed: 64 },
};

/** 获取卦的符咒数据 */
export const getHexagramTalisman = (hexagramName: string): HexagramTalisman => {
  return (
    HEXAGRAM_TALISMANS[hexagramName] ?? {
      hexagramName,
      blessingTheme: '开运祈福',
      category: '天官赐福',
      element: '土',
      svgPath: null,
      placeholderSeed: hexagramName.split('').reduce((a, c) => a + c.charCodeAt(0), 0),
    }
  );
};

/** 检查某卦是否有真实素材 */
export const hasRealTalisman = (hexagramName: string): boolean => {
  const t = HEXAGRAM_TALISMANS[hexagramName];
  return t?.svgPath !== null && t?.svgPath !== undefined;
};

/** 获取分类下的所有卦 */
export const getHexagramsByCategory = (category: TalismanCategory): HexagramTalisman[] => {
  return Object.values(HEXAGRAM_TALISMANS).filter((t) => t.category === category);
};
