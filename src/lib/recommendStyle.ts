/**
 * Smart Style Recommendation Engine — 智能风格推荐核心算法
 *
 * 基于四维加权评分系统：
 * - 五行匹配 (40%)
 * - 运势等级匹配 (30%)
 * - 符咒分类匹配 (20%)
 * - 英文关键词语义匹配 (10%)
 */

import type { PosterStyleName } from '@/lib/posterStyles';
import type { Gua64 } from '@/data/gua64';
import type { HexagramTalisman, TalismanCategory } from '@/data/hexagram-talismans';

export interface StyleRecommendation {
  primary: PosterStyleName;
  secondary: PosterStyleName;
  confidence: number;
  reason: string;
  reasonZh: string;
}

/* ------------------------------------------------------------------ */
/* 1. 常量映射表                                                      */
/* ------------------------------------------------------------------ */

/** 每种风格最佳匹配的五行 */
const STYLE_ELEMENTS: Record<PosterStyleName, string[]> = {
  ink: ['水', '木'],
  dark: ['水', '金'],
  royal: ['金', '火'],
  vintage: ['土', '金'],
  tianshi: ['土', '火'],
  blackgold: ['金', '火'],
};

/** 运势 → 风格得分映射 (0~1) */
const FORTUNE_SCORES: Record<string, Partial<Record<PosterStyleName, number>>> = {
  '大吉': { royal: 1.0, blackgold: 1.0, ink: 0.3, vintage: 0.3 },
  '吉': { ink: 1.0, vintage: 1.0, royal: 0.3, blackgold: 0.2 },
  '中吉': { tianshi: 1.0, ink: 0.5, vintage: 0.3 },
  '中平': { ink: 1.0, vintage: 1.0, tianshi: 0.5 },
  '小凶': { dark: 1.0, tianshi: 0.3 },
  '凶': { dark: 1.0, tianshi: 0.3 },
  '大凶': { dark: 1.0, tianshi: 0.3, blackgold: 0.3 },
  '转运': { tianshi: 1.0, blackgold: 1.0, dark: 0.5 },
};

/** 符咒分类 → 风格得分映射 */
const CATEGORY_SCORES: Record<TalismanCategory, Partial<Record<PosterStyleName, number>>> = {
  '天官赐福': { royal: 1.0, blackgold: 0.3 },
  '地母护身': { vintage: 1.0, tianshi: 0.3 },
  '文昌启智': { ink: 1.0, vintage: 0.3 },
  '财运亨通': { blackgold: 1.0, royal: 0.7 },
  '姻缘和合': { vintage: 1.0, tianshi: 0.7 },
  '平安顺遂': { ink: 1.0, vintage: 0.7 },
  '武运昌隆': { blackgold: 1.0, dark: 0.7 },
  '转运破厄': { tianshi: 1.0, dark: 0.8 },
};

/** 英文关键词 → 目标风格映射 (用于语义匹配) */
const KEYWORD_GROUPS: { keywords: string[]; styles: PosterStyleName[] }[] = [
  {
    keywords: ['Dark', 'Difficult', 'Mystery', 'Obstacles', 'Stagnation', 'Conflict', 'Dispute', 'Conservatism', 'Waiting', 'Hidden', 'Danger', 'Misfortune'],
    styles: ['dark'],
  },
  {
    keywords: ['Success', 'Wealth', 'Prosperity', 'Harvest', 'Creation', 'Progress', 'Vigor', 'Leadership', 'Fortune', 'Great', 'Sublime', 'Supreme', 'Achievement'],
    styles: ['royal', 'blackgold'],
  },
  {
    keywords: ['Enlightenment', 'Learning', 'Education', 'Growth', 'Knowledge', 'Wisdom', 'Humility', 'Patience', 'Preparation', 'Trust', 'Youthful', 'Folly', 'Seek', 'Understanding'],
    styles: ['ink'],
  },
  {
    keywords: ['Joy', 'Harmony', 'Peace', 'Fellowship', 'Unity', 'Cooperation', 'Modesty', 'Caution', 'Virtue', 'Steadiness', 'Gentleness', 'Inclusiveness', 'Bearing', 'Receptive'],
    styles: ['vintage'],
  },
  {
    keywords: ['Army', 'War', 'Force', 'Strength', 'Power', 'Courage', 'Brightness', 'Action', 'Struggle', 'Resolute', 'Resolution', 'Discipline'],
    styles: ['blackgold', 'dark'],
  },
  {
    keywords: ['New', 'Birth', 'Rebirth', 'Transformation', 'Renewal', 'Change', 'Hope', 'Recovery'],
    styles: ['tianshi'],
  },
];

/** 维度权重 */
const WEIGHTS = {
  element: 0.40,
  fortune: 0.30,
  category: 0.20,
  keyword: 0.10,
};

const ALL_STYLES: PosterStyleName[] = ['ink', 'dark', 'royal', 'vintage', 'tianshi', 'blackgold'];

/* ------------------------------------------------------------------ */
/* 2. 评分函数                                                        */
/* ------------------------------------------------------------------ */

function scoreElement(style: PosterStyleName, element: string): number {
  return STYLE_ELEMENTS[style].includes(element) ? 1.0 : 0.15;
}

function scoreFortune(style: PosterStyleName, fortune: string): number {
  return FORTUNE_SCORES[fortune]?.[style] ?? 0.05;
}

function scoreCategory(style: PosterStyleName, category: TalismanCategory): number {
  return CATEGORY_SCORES[category]?.[style] ?? 0.05;
}

function scoreKeywords(style: PosterStyleName, keywordsEn: string[]): number {
  let best = 0.0;
  for (const group of KEYWORD_GROUPS) {
    if (!group.styles.includes(style)) continue;
    const hasMatch = keywordsEn.some(kw =>
      group.keywords.some(gk => kw.toLowerCase().includes(gk.toLowerCase()) || gk.toLowerCase().includes(kw.toLowerCase()))
    );
    if (hasMatch) {
      // 主风格 1.0，次风格 0.5
      best = Math.max(best, group.styles[0] === style ? 1.0 : 0.5);
    }
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* 3. 核心推荐函数                                                    */
/* ------------------------------------------------------------------ */

interface ScoreBreakdown {
  style: PosterStyleName;
  total: number;
  element: number;
  fortune: number;
  category: number;
  keyword: number;
}

function computeScores(gua: Gua64, talisman: HexagramTalisman): ScoreBreakdown[] {
  return ALL_STYLES.map(style => {
    const e = scoreElement(style, gua.element);
    const f = scoreFortune(style, gua.fortune);
    const c = scoreCategory(style, talisman.category);
    const k = scoreKeywords(style, gua.keywordsEn);
    const total = e * WEIGHTS.element + f * WEIGHTS.fortune + c * WEIGHTS.category + k * WEIGHTS.keyword;
    return { style, total, element: e, fortune: f, category: c, keyword: k };
  });
}

/** 找出贡献最大的维度，用于生成推荐理由 */
function findTopDimension(b: ScoreBreakdown): 'element' | 'fortune' | 'category' | 'keyword' {
  const weighted = {
    element: b.element * WEIGHTS.element,
    fortune: b.fortune * WEIGHTS.fortune,
    category: b.category * WEIGHTS.category,
    keyword: b.keyword * WEIGHTS.keyword,
  } as const;
  let best: 'element' | 'fortune' | 'category' | 'keyword' = 'element';
  let bestVal = weighted.element;
  for (const key of ['fortune', 'category', 'keyword'] as const) {
    if (weighted[key] > bestVal) {
      best = key;
      bestVal = weighted[key];
    }
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* 4. 推荐理由生成器                                                  */
/* ------------------------------------------------------------------ */

const REASON_TEMPLATES: Record<
  PosterStyleName,
  Record<'element' | 'fortune' | 'category' | 'keyword', [string, string]>
> = {
  ink: {
    element: ['Ink wash resonates with the {element} element\'s natural flow', '水墨风格与{element}行的自然流动相契合'],
    fortune: ['Ink wash suits the {fortune} fortune with calm clarity', '水墨风格以宁静清透匹配{fortune}运势'],
    category: ['Ink wash complements the {category} blessing theme', '水墨风格契合{category}的祈福主题'],
    keyword: ['Ink wash reflects the wisdom and clarity in the keywords', '水墨风格体现关键词中的智慧与清明'],
  },
  dark: {
    element: ['Dark mystic channels the {element} element\'s hidden depth', '暗黑风格引导{element}行的深层力量'],
    fortune: ['Dark mystic mirrors the {fortune} fortune with shadowed resilience', '暗黑风格以沉毅暗影映照{fortune}运势'],
    category: ['Dark mystic aligns with the {category} blessing theme', '暗黑风格契合{category}的祈福主题'],
    keyword: ['Dark mystic captures the mystery and depth in the keywords', '暗黑风格捕捉关键词中的神秘与深邃'],
  },
  royal: {
    element: ['Royal gold amplifies the {element} element\'s radiant intensity', '皇家金风格放大{五行}行的光辉强度'],
    fortune: ['Royal gold celebrates the {fortune} fortune with imperial grandeur', '皇家金风格以帝王气度庆祝{fortune}运势'],
    category: ['Royal gold honors the {category} blessing theme', '皇家金风格礼赞{category}的祈福主题'],
    keyword: ['Royal gold embodies the success and leadership in the keywords', '皇家金风格体现关键词中的成功与领导力'],
  },
  vintage: {
    element: ['Vintage parchment carries the {element} element\'s timeless grounding', '复古风格承载{element}行的 timeless 底蕴'],
    fortune: ['Vintage parchment suits the {fortune} fortune with steady warmth', '复古风格以温润稳重匹配{fortune}运势'],
    category: ['Vintage parchment matches the {category} blessing theme', '复古风格匹配{category}的祈福主题'],
    keyword: ['Vintage parchment reflects the harmony and virtue in the keywords', '复古风格体现关键词中的和谐与美德'],
  },
  tianshi: {
    element: ['Tianshi yellow channels the {element} element\'s transformative power', '天师黄风格引导{element}行的转化之力'],
    fortune: ['Tianshi yellow serves the {fortune} fortune with Daoist vitality', '天师黄风格以道家生气服务于{fortune}运势'],
    category: ['Tianshi yellow empowers the {category} blessing theme', '天师黄风格赋能{category}的祈福主题'],
    keyword: ['Tianshi yellow captures the renewal and hope in the keywords', '天师黄风格捕捉关键词中的更新与希望'],
  },
  blackgold: {
    element: ['Black & gold sharpens the {element} element\'s decisive edge', '黑金风格磨砺{element}行的决断锋芒'],
    fortune: ['Black & gold commands the {fortune} fortune with bold authority', '黑金风格以 bold 权威驾驭{fortune}运势'],
    category: ['Black & gold drives the {category} blessing theme', '黑金风格驱动{category}的祈福主题'],
    keyword: ['Black & gold channels the strength and power in the keywords', '黑金风格引导关键词中的力量与权能'],
  },
};

function buildReason(
  style: PosterStyleName,
  dim: 'element' | 'fortune' | 'category' | 'keyword',
  gua: Gua64,
  talisman: HexagramTalisman
): [string, string] {
  const tpl = REASON_TEMPLATES[style][dim];
  const replacements: Record<string, string> = {
    '{element}': gua.element,
    '{五行}': gua.element,
    '{fortune}': gua.fortune,
    '{category}': talisman.category,
  };
  const en = Object.entries(replacements).reduce((s, [k, v]) => s.replaceAll(k, v), tpl[0]);
  const zh = Object.entries(replacements).reduce((s, [k, v]) => s.replaceAll(k, v), tpl[1]);
  return [en, zh];
}

/* ------------------------------------------------------------------ */
/* 5. 主入口                                                          */
/* ------------------------------------------------------------------ */

export function recommendStyle(gua: Gua64, talisman: HexagramTalisman): StyleRecommendation {
  const scores = computeScores(gua, talisman);

  // 按总分降序
  const sorted = [...scores].sort((a, b) => b.total - a.total);
  const primary = sorted[0];
  const secondary = sorted[1];

  // 置信度 = 第一名总分 (理论上最高 1.0)
  const confidence = Math.min(1.0, Math.round(primary.total * 1000) / 1000);

  // 生成推荐理由 (基于 primary 的最高贡献维度)
  const dim = findTopDimension(primary);
  const [reason, reasonZh] = buildReason(primary.style, dim, gua, talisman);

  return {
    primary: primary.style,
    secondary: secondary.style,
    confidence,
    reason,
    reasonZh,
  };
}

/* ------------------------------------------------------------------ */
/* 6. 辅助导出 (用于调试 / 测试)                                       */
/* ------------------------------------------------------------------ */

export function getScoreBreakdown(gua: Gua64, talisman: HexagramTalisman): ScoreBreakdown[] {
  return computeScores(gua, talisman);
}

export { ALL_STYLES };
