// ═══════════════════════════════════════════════════════════════
//  起名汉字字库 — 按五行分类，100+ 常用吉祥字
// ═══════════════════════════════════════════════════════════════

import type { FourPillarsData } from '../components/bazi/calendar';
import { countElementDistribution } from '../components/bazi/calendar';
import type { Element } from '../components/bazi/data';

export interface NamingChar {
  char: string;        // 汉字
  pinyin: string;      // 拼音（带声调）
  wuxing: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  meaning: string;     // 单字寓意
  strokeCount: number; // 笔画数
}

export const WUXING_LABELS: Record<string, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

// 五行相生关系：木→火→土→金→水→木
const GENERATING_CYCLE: Record<Element, Element> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

// ═══════════════════════════════════════════════════════════════
//  木行字（23个）— 生长、仁德、向上
// ═══════════════════════════════════════════════════════════════
const WOOD_CHARS: NamingChar[] = [
  { char: '杰', pinyin: 'jié', wuxing: 'wood', meaning: '杰出卓越，才智超群', strokeCount: 8 },
  { char: '林', pinyin: 'lín', wuxing: 'wood', meaning: '林木葱茏，生机勃勃', strokeCount: 8 },
  { char: '森', pinyin: 'sēn', wuxing: 'wood', meaning: '森罗万象，繁茂昌盛', strokeCount: 12 },
  { char: '柏', pinyin: 'bǎi', wuxing: 'wood', meaning: '柏树常青，坚贞不屈', strokeCount: 9 },
  { char: '梓', pinyin: 'zǐ', wuxing: 'wood', meaning: '梓材可雕，栋梁之器', strokeCount: 11 },
  { char: '楠', pinyin: 'nán', wuxing: 'wood', meaning: '楠木高贵，香韵悠长', strokeCount: 13 },
  { char: '桐', pinyin: 'tóng', wuxing: 'wood', meaning: '桐花烂漫，高洁清雅', strokeCount: 10 },
  { char: '枫', pinyin: 'fēng', wuxing: 'wood', meaning: '枫叶如丹，热情绚烂', strokeCount: 8 },
  { char: '桦', pinyin: 'huà', wuxing: 'wood', meaning: '白桦挺拔，纯洁正直', strokeCount: 10 },
  { char: '楷', pinyin: 'kǎi', wuxing: 'wood', meaning: '楷模典范，端正守礼', strokeCount: 13 },
  { char: '樱', pinyin: 'yīng', wuxing: 'wood', meaning: '樱花烂漫，柔美纯洁', strokeCount: 15 },
  { char: '棠', pinyin: 'táng', wuxing: 'wood', meaning: '海棠花开，温文尔雅', strokeCount: 12 },
  { char: '桦', pinyin: 'huá', wuxing: 'wood', meaning: '桦树洁白，正直清朗', strokeCount: 10 },
  { char: '松', pinyin: 'sōng', wuxing: 'wood', meaning: '松柏之志，坚韧不拔', strokeCount: 8 },
  { char: '竹', pinyin: 'zhú', wuxing: 'wood', meaning: '竹子虚心，高风亮节', strokeCount: 6 },
  { char: '梅', pinyin: 'méi', wuxing: 'wood', meaning: '梅花傲雪，坚贞高洁', strokeCount: 11 },
  { char: '柳', pinyin: 'liǔ', wuxing: 'wood', meaning: '柳丝依依，温柔多情', strokeCount: 9 },
  { char: '桐', pinyin: 'tóng', wuxing: 'wood', meaning: '梧桐引凤，高贵吉祥', strokeCount: 10 },
  { char: '杨', pinyin: 'yáng', wuxing: 'wood', meaning: '杨柳依依，飘逸洒脱', strokeCount: 7 },
  { char: '栋', pinyin: 'dòng', wuxing: 'wood', meaning: '栋梁之才，擎天架海', strokeCount: 9 },
  { char: '梁', pinyin: 'liáng', wuxing: 'wood', meaning: '桥梁通达，担当大任', strokeCount: 11 },
  { char: '棋', pinyin: 'qí', wuxing: 'wood', meaning: '棋逢对手，智慧从容', strokeCount: 12 },
  { char: '荣', pinyin: 'róng', wuxing: 'wood', meaning: '荣华富贵，欣欣向荣', strokeCount: 9 },
];

// ═══════════════════════════════════════════════════════════════
//  火行字（22个）— 光明、热情、活力
// ═══════════════════════════════════════════════════════════════
const FIRE_CHARS: NamingChar[] = [
  { char: '炎', pinyin: 'yán', wuxing: 'fire', meaning: '炎黄子孙，热情如火', strokeCount: 8 },
  { char: '煜', pinyin: 'yù', wuxing: 'fire', meaning: '煜煜生辉，光芒万丈', strokeCount: 13 },
  { char: '炜', pinyin: 'wěi', wuxing: 'fire', meaning: '炜烨光明，辉煌灿烂', strokeCount: 8 },
  { char: '烨', pinyin: 'yè', wuxing: 'fire', meaning: '烨然出众，光彩照人', strokeCount: 10 },
  { char: '烁', pinyin: 'shuò', wuxing: 'fire', meaning: '烁烁其华，闪耀夺目', strokeCount: 9 },
  { char: '焕', pinyin: 'huàn', wuxing: 'fire', meaning: '焕然一新，朝气蓬勃', strokeCount: 11 },
  { char: '炳', pinyin: 'bǐng', wuxing: 'fire', meaning: '炳炳麟麟，文采斐然', strokeCount: 9 },
  { char: '灿', pinyin: 'càn', wuxing: 'fire', meaning: '灿烂辉煌，光彩夺目', strokeCount: 7 },
  { char: '晴', pinyin: 'qíng', wuxing: 'fire', meaning: '晴空万里，开朗明媚', strokeCount: 12 },
  { char: '昕', pinyin: 'xīn', wuxing: 'fire', meaning: '昕旦初升，希望之光', strokeCount: 8 },
  { char: '昱', pinyin: 'yù', wuxing: 'fire', meaning: '昱昱日光，明亮温暖', strokeCount: 9 },
  { char: '晟', pinyin: 'shèng', wuxing: 'fire', meaning: '晟大明盛，光明炽盛', strokeCount: 10 },
  { char: '煦', pinyin: 'xù', wuxing: 'fire', meaning: '煦日和风，温暖祥和', strokeCount: 13 },
  { char: '晗', pinyin: 'hán', wuxing: 'fire', meaning: '晗光初露，朝气蓬勃', strokeCount: 11 },
  { char: '熹', pinyin: 'xī', wuxing: 'fire', meaning: '熹微晨光，温暖安宁', strokeCount: 16 },
  { char: '曜', pinyin: 'yào', wuxing: 'fire', meaning: '日曜光华，辉煌耀眼', strokeCount: 18 },
  { char: '晶', pinyin: 'jīng', wuxing: 'fire', meaning: '晶莹剔透，纯净明亮', strokeCount: 12 },
  { char: '昭', pinyin: 'zhāo', wuxing: 'fire', meaning: '昭示光明，明白通达', strokeCount: 9 },
  { char: '朗', pinyin: 'lǎng', wuxing: 'fire', meaning: '朗朗乾坤，开朗豁达', strokeCount: 10 },
  { char: '明', pinyin: 'míng', wuxing: 'fire', meaning: '明德惟馨，聪慧光明', strokeCount: 8 },
  { char: '晴', pinyin: 'qíng', wuxing: 'fire', meaning: '雨过天晴，豁然开朗', strokeCount: 12 },
  { char: '暖', pinyin: 'nuǎn', wuxing: 'fire', meaning: '暖阳和熙，温馨慈爱', strokeCount: 13 },
];

// ═══════════════════════════════════════════════════════════════
//  土行字（22个）— 稳重、诚信、包容
// ═══════════════════════════════════════════════════════════════
const EARTH_CHARS: NamingChar[] = [
  { char: '坤', pinyin: 'kūn', wuxing: 'earth', meaning: '坤厚载物，厚德载物', strokeCount: 8 },
  { char: '垚', pinyin: 'yáo', wuxing: 'earth', meaning: '垚垚高山，稳重不拔', strokeCount: 9 },
  { char: '培', pinyin: 'péi', wuxing: 'earth', meaning: '培育英才，栽培成就', strokeCount: 11 },
  { char: '城', pinyin: 'chéng', wuxing: 'earth', meaning: '城池稳固，坚不可摧', strokeCount: 9 },
  { char: '垣', pinyin: 'yuán', wuxing: 'earth', meaning: '垣墙守护，安稳可靠', strokeCount: 9 },
  { char: '峻', pinyin: 'jùn', wuxing: 'earth', meaning: '峻拔高挺，气度不凡', strokeCount: 10 },
  { char: '峰', pinyin: 'fēng', wuxing: 'earth', meaning: '峰峦叠嶂，卓尔不群', strokeCount: 10 },
  { char: '岳', pinyin: 'yuè', wuxing: 'earth', meaning: '岳峙渊渟，稳重如山', strokeCount: 8 },
  { char: '岩', pinyin: 'yán', wuxing: 'earth', meaning: '岩岩磐石，坚定不移', strokeCount: 8 },
  { char: '磊', pinyin: 'lěi', wuxing: 'earth', meaning: '磊落光明，坦荡无私', strokeCount: 15 },
  { char: '坤', pinyin: 'kūn', wuxing: 'earth', meaning: '坤元亨利，包容万物', strokeCount: 8 },
  { char: '均', pinyin: 'jūn', wuxing: 'earth', meaning: '均衡中正，公平公正', strokeCount: 7 },
  { char: '基', pinyin: 'jī', wuxing: 'earth', meaning: '基业长青，根基稳固', strokeCount: 11 },
  { char: '堂', pinyin: 'táng', wuxing: 'earth', meaning: '堂堂正正，光明磊落', strokeCount: 11 },
  { char: '墨', pinyin: 'mò', wuxing: 'earth', meaning: '墨香书韵，文雅深沉', strokeCount: 15 },
  { char: '境', pinyin: 'jìng', wuxing: 'earth', meaning: '境界高远，心境澄明', strokeCount: 14 },
  { char: '安', pinyin: 'ān', wuxing: 'earth', meaning: '安之若素，平安喜乐', strokeCount: 6 },
  { char: '宇', pinyin: 'yǔ', wuxing: 'earth', meaning: '宇量弘深，气度恢宏', strokeCount: 6 },
  { char: '辰', pinyin: 'chén', wuxing: 'earth', meaning: '辰光美好，时运亨通', strokeCount: 7 },
  { char: '佑', pinyin: 'yòu', wuxing: 'earth', meaning: '佑护平安，福泽绵长', strokeCount: 7 },
  { char: '翔', pinyin: 'xiáng', wuxing: 'earth', meaning: '翔鸾翥凤，自由高远', strokeCount: 12 },
  { char: '培', pinyin: 'péi', wuxing: 'earth', meaning: '培风图南，志向远大', strokeCount: 11 },
];

// ═══════════════════════════════════════════════════════════════
//  金行字（22个）— 刚毅、果断、义气
// ═══════════════════════════════════════════════════════════════
const METAL_CHARS: NamingChar[] = [
  { char: '钧', pinyin: 'jūn', wuxing: 'metal', meaning: '千钧之重，威严有力', strokeCount: 9 },
  { char: '铭', pinyin: 'míng', wuxing: 'metal', meaning: '铭记于心，志存高远', strokeCount: 11 },
  { char: '锐', pinyin: 'ruì', wuxing: 'metal', meaning: '锐意进取，锋芒毕露', strokeCount: 12 },
  { char: '锋', pinyin: 'fēng', wuxing: 'metal', meaning: '锋芒毕露，锐不可当', strokeCount: 12 },
  { char: '鑫', pinyin: 'xīn', wuxing: 'metal', meaning: '三金聚宝，财源广进', strokeCount: 24 },
  { char: '钰', pinyin: 'yù', wuxing: 'metal', meaning: '钰宝珍贵，温润如玉', strokeCount: 10 },
  { char: '锦', pinyin: 'jǐn', wuxing: 'metal', meaning: '锦绣前程，华丽美好', strokeCount: 16 },
  { char: '铮', pinyin: 'zhēng', wuxing: 'metal', meaning: '铮铮铁骨，刚正不阿', strokeCount: 11 },
  { char: '铄', pinyin: 'shuò', wuxing: 'metal', meaning: '铄石流金，刚毅果决', strokeCount: 10 },
  { char: '铠', pinyin: 'kǎi', wuxing: 'metal', meaning: '铠甲护身，坚强守护', strokeCount: 11 },
  { char: '铮', pinyin: 'zhēng', wuxing: 'metal', meaning: '铮铮有声，正直刚毅', strokeCount: 11 },
  { char: '铃', pinyin: 'líng', wuxing: 'metal', meaning: '铃音清脆，灵动活泼', strokeCount: 10 },
  { char: '钰', pinyin: 'yù', wuxing: 'metal', meaning: '珍宝无价，贵重典雅', strokeCount: 10 },
  { char: '钦', pinyin: 'qīn', wuxing: 'metal', meaning: '钦佩敬重，德高望重', strokeCount: 9 },
  { char: '锡', pinyin: 'xī', wuxing: 'metal', meaning: '锡福呈祥，赐予幸福', strokeCount: 13 },
  { char: '瑞', pinyin: 'ruì', wuxing: 'metal', meaning: '瑞气祥云，吉祥如意', strokeCount: 13 },
  { char: '琛', pinyin: 'chēn', wuxing: 'metal', meaning: '琛宝珍贵，稀世之珍', strokeCount: 12 },
  { char: '瑜', pinyin: 'yú', wuxing: 'metal', meaning: '瑜不掩瑕，美玉无瑕', strokeCount: 13 },
  { char: '瑾', pinyin: 'jǐn', wuxing: 'metal', meaning: '瑾瑜美玉，品德高尚', strokeCount: 15 },
  { char: '锐', pinyin: 'ruì', wuxing: 'metal', meaning: '敏锐聪慧，洞察秋毫', strokeCount: 12 },
  { char: '铸', pinyin: 'zhù', wuxing: 'metal', meaning: '铸就辉煌，成就大业', strokeCount: 12 },
  { char: '鉴', pinyin: 'jiàn', wuxing: 'metal', meaning: '鉴往知来，明察秋毫', strokeCount: 13 },
];

// ═══════════════════════════════════════════════════════════════
//  水行字（22个）— 智慧、灵动、柔和
// ═══════════════════════════════════════════════════════════════
const WATER_CHARS: NamingChar[] = [
  { char: '沐', pinyin: 'mù', wuxing: 'water', meaning: '沐浴恩泽，润泽万物', strokeCount: 7 },
  { char: '泽', pinyin: 'zé', wuxing: 'water', meaning: '泽被苍生，润泽万物', strokeCount: 8 },
  { char: '浩', pinyin: 'hào', wuxing: 'water', meaning: '浩然正气，胸怀宽广', strokeCount: 10 },
  { char: '涵', pinyin: 'hán', wuxing: 'water', meaning: '涵养深厚，包容万物', strokeCount: 11 },
  { char: '洋', pinyin: 'yáng', wuxing: 'water', meaning: '洋洋大观，气度恢弘', strokeCount: 9 },
  { char: '润', pinyin: 'rùn', wuxing: 'water', meaning: '润物无声，温和滋养', strokeCount: 10 },
  { char: '沛', pinyin: 'pèi', wuxing: 'water', meaning: '沛然莫御，充沛有力', strokeCount: 7 },
  { char: '涛', pinyin: 'tāo', wuxing: 'water', meaning: '涛声澎湃，气势磅礴', strokeCount: 10 },
  { char: '澜', pinyin: 'lán', wuxing: 'water', meaning: '波澜壮阔，气度不凡', strokeCount: 15 },
  { char: '清', pinyin: 'qīng', wuxing: 'water', meaning: '清正廉明，纯净高洁', strokeCount: 11 },
  { char: '澄', pinyin: 'chéng', wuxing: 'water', meaning: '澄澈明净，心境通透', strokeCount: 15 },
  { char: '淳', pinyin: 'chún', wuxing: 'water', meaning: '淳朴善良，真诚质朴', strokeCount: 11 },
  { char: '溪', pinyin: 'xī', wuxing: 'water', meaning: '溪水潺潺，清澈灵动', strokeCount: 13 },
  { char: '潇', pinyin: 'xiāo', wuxing: 'water', meaning: '潇洒飘逸，超凡脱俗', strokeCount: 14 },
  { char: '瀚', pinyin: 'hàn', wuxing: 'water', meaning: '瀚海无涯，学识渊博', strokeCount: 19 },
  { char: '泓', pinyin: 'hóng', wuxing: 'water', meaning: '泓澄深邃，智慧深远', strokeCount: 8 },
  { char: '澈', pinyin: 'chè', wuxing: 'water', meaning: '澈底通明，明察秋毫', strokeCount: 15 },
  { char: '淳', pinyin: 'chún', wuxing: 'water', meaning: '淳厚质朴，心地纯良', strokeCount: 11 },
  { char: '沛', pinyin: 'pèi', wuxing: 'water', meaning: '精力充沛，生机勃勃', strokeCount: 7 },
  { char: '沅', pinyin: 'yuán', wuxing: 'water', meaning: '沅芷澧兰，高洁芬芳', strokeCount: 7 },
  { char: '淳', pinyin: 'chún', wuxing: 'water', meaning: '淳风尽散，返璞归真', strokeCount: 11 },
  { char: '洛', pinyin: 'luò', wuxing: 'water', meaning: '洛水神韵，优雅动人', strokeCount: 9 },
];

/** 全部起名汉字 */
export const NAMING_CHARS: NamingChar[] = [
  ...WOOD_CHARS,
  ...FIRE_CHARS,
  ...EARTH_CHARS,
  ...METAL_CHARS,
  ...WATER_CHARS,
];

/** 根据五行筛选汉字 */
export function getCharsByWuxing(wuxing: Element): NamingChar[] {
  return NAMING_CHARS.filter((c) => c.wuxing === wuxing);
}

/** 根据八字计算喜用神与次选用神 */
export function getFavorableWuxing(pillars: FourPillarsData): {
  primary: Element[];
  secondary: Element[];
} {
  const counts = countElementDistribution(pillars);

  // 按数量升序排列（最少的 = 最缺的 = 喜用神）
  const sorted = (Object.entries(counts) as [Element, number][]).sort(
    (a, b) => a[1] - b[1]
  );

  // 取最缺的 1–2 个五行为「喜用神」
  const primary: Element[] = [];
  const minCount = sorted[0][1];
  for (const [el, count] of sorted) {
    if (count === minCount && primary.length < 2) {
      primary.push(el);
    }
  }

  // 生助喜用神的五行为「次选用神」（根据五行相生）
  const secondary: Element[] = [];
  for (const el of primary) {
    const helper = GENERATING_CYCLE[el];
    if (!primary.includes(helper)) {
      secondary.push(helper);
    }
  }

  return { primary, secondary };
}

/** 从数组中随机取 n 个不重复元素 */
export function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

/** 拼音首字母大写 */
export function capitalizePinyin(pinyin: string): string {
  return pinyin.charAt(0).toUpperCase() + pinyin.slice(1);
}
