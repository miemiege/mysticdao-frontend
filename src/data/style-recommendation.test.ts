/**
 * Style Recommendation Test Suite — 风格推荐算法测试集
 *
 * Vitest 格式，覆盖不同五行、运势、分类的组合，验证推荐核心逻辑。
 */

import { describe, it, expect } from 'vitest';
import { recommendStyle, type StyleRecommendation } from '@/lib/recommendStyle';
import type { Gua64 } from '@/data/gua64';
import type { HexagramTalisman } from '@/data/hexagram-talismans';

/* ------------------------------------------------------------------ */
/* 辅助：校验主推荐在候选列表中                                        */
/* ------------------------------------------------------------------ */

function expectPrimary(rec: StyleRecommendation, acceptable: string[], testName: string) {
  expect(acceptable, `${testName} — primary should be one of [${acceptable.join(', ')}]`).toContain(rec.primary);
}

function expectSecondary(rec: StyleRecommendation, acceptable: string[], testName: string) {
  expect(acceptable, `${testName} — secondary should be one of [${acceptable.join(', ')}]`).toContain(rec.secondary);
}

function expectConfidenceRange(rec: StyleRecommendation, min: number, max: number, testName: string) {
  expect(rec.confidence, `${testName} — confidence should be in [${min}, ${max}]`).toBeGreaterThanOrEqual(min);
  expect(rec.confidence, `${testName} — confidence should be in [${min}, ${max}]`).toBeLessThanOrEqual(max);
}

/* ------------------------------------------------------------------ */
/* 测试夹具构造器                                                     */
/* ------------------------------------------------------------------ */

function makeGua(partial: Partial<Gua64> & Pick<Gua64, 'element' | 'fortune' | 'keywordsEn'>): Gua64 {
  return {
    number: 1,
    name: 'TestGua',
    nameEn: 'Test',
    upper: '乾',
    lower: '乾',
    symbol: '䷀',
    judgment: '',
    judgmentEn: '',
    image: '',
    imageEn: '',
    meaning: '',
    meaningEn: '',
    keywords: [],
    yaoTexts: [],
    yaoTextsEn: [],
    advice: '',
    adviceEn: '',
    fortuneEn: 'Great Fortune' as any,
    ...partial,
  } as Gua64;
}

function makeTalisman(category: HexagramTalisman['category']): HexagramTalisman {
  return {
    hexagramName: 'TestGua',
    blessingTheme: 'Test Theme',
    category,
    element: '金',
    svgPath: null,
    placeholderSeed: 1,
  };
}

/* ------------------------------------------------------------------ */
/* 15 组测试用例                                                       */
/* ------------------------------------------------------------------ */

describe('Style Recommendation', () => {
  it('乾为天 (金/大吉/天官赐福) — primary should be royal or blackgold', () => {
    const gua = makeGua({
      name: '乾为天',
      element: '金',
      fortune: '大吉',
      keywordsEn: ['Creation', 'Progress', 'Vigor', 'Leadership', 'Success'],
    });
    const talisman = makeTalisman('天官赐福');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['royal', 'blackgold'], '乾为天 (金/大吉/天官赐福)');
    expectSecondary(rec, ['blackgold', 'royal'], '乾为天 (金/大吉/天官赐福)');
    expectConfidenceRange(rec, 0.70, 1.0, '乾为天');
  });

  it('坤为地 (土/大吉/地母护身) — primary should be zengarden or vintage', () => {
    const gua = makeGua({
      name: '坤为地',
      element: '土',
      fortune: '大吉',
      keywordsEn: ['Gentleness', 'Inclusiveness', 'Bearing', 'Steadiness', 'Virtue'],
    });
    const talisman = makeTalisman('地母护身');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['zengarden', 'vintage'], '坤为地 (土/大吉/地母护身)');
    expectSecondary(rec, ['vintage', 'tianshi'], '坤为地 (土/大吉/地母护身)');
    expectConfidenceRange(rec, 0.45, 0.90, '坤为地');
  });

  it('火天大有 (火/大吉/财运亨通) — primary should be blackgold or royal', () => {
    const gua = makeGua({
      name: '火天大有',
      element: '火',
      fortune: '大吉',
      keywordsEn: ['Harvest', 'Wealth', 'Success', 'Brightness', 'Prosperity'],
    });
    const talisman = makeTalisman('财运亨通');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['blackgold', 'royal'], '火天大有 (火/大吉/财运亨通)');
    expectSecondary(rec, ['royal', 'blackgold'], '火天大有 (火/大吉/财运亨通)');
    expectConfidenceRange(rec, 0.65, 1.0, '火天大有');
  });

  it('水雷屯 (水/中吉/转运破厄) — primary should be dark or tianshi', () => {
    const gua = makeGua({
      name: '水雷屯',
      element: '水',
      fortune: '中吉',
      keywordsEn: ['Difficulty', 'Beginning', 'Entrepreneurship', 'Perseverance', 'New birth'],
    });
    const talisman = makeTalisman('转运破厄');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['dark', 'tianshi'], '水雷屯 (水/中吉/转运破厄)');
    expectSecondary(rec, ['tianshi', 'dark'], '水雷屯 (水/中吉/转运破厄)');
    expectConfidenceRange(rec, 0.35, 0.75, '水雷屯');
  });

  it('风天小畜 (木/中平/财运亨通) — primary should be zengarden or ink', () => {
    const gua = makeGua({
      name: '风天小畜',
      element: '木',
      fortune: '中平',
      keywordsEn: ['Accumulation', 'Preparation', 'Waiting', 'Buildup', 'Patience'],
    });
    const talisman = makeTalisman('财运亨通');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['zengarden', 'ink'], '风天小畜 (木/中平/财运亨通)');
    expectSecondary(rec, ['ink', 'vintage'], '风天小畜 (木/中平/财运亨通)');
    expectConfidenceRange(rec, 0.50, 0.90, '风天小畜');
  });

  it('天水讼 (金/小凶/转运破厄) — primary should be dark or blackgold', () => {
    const gua = makeGua({
      name: '天水讼',
      element: '金',
      fortune: '小凶',
      keywordsEn: ['Conflict', 'Dispute', 'Reconciliation', 'Caution', 'Compromise'],
    });
    const talisman = makeTalisman('转运破厄');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['dark', 'blackgold'], '天水讼 (金/小凶/转运破厄)');
    expectSecondary(rec, ['cybertao', 'vintage'], '天水讼 (金/小凶/转运破厄)');
    expectConfidenceRange(rec, 0.65, 1.0, '天水讼');
  });

  it('地水师 (土/中吉/武运昌隆) — primary should be tianshi or zengarden', () => {
    const gua = makeGua({
      name: '地水师',
      element: '土',
      fortune: '中吉',
      keywordsEn: ['Army', 'Discipline', 'Leadership', 'Unity', 'War'],
    });
    const talisman = makeTalisman('武运昌隆');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['tianshi', 'zengarden'], '地水师 (土/中吉/武运昌隆)');
    expectSecondary(rec, ['vintage', 'zengarden'], '地水师 (土/中吉/武运昌隆)');
    expectConfidenceRange(rec, 0.40, 0.80, '地水师');
  });

  it('山水蒙 (土/吉/文昌启智) — primary should be vintage or zengarden', () => {
    const gua = makeGua({
      name: '山水蒙',
      element: '土',
      fortune: '吉',
      keywordsEn: ['Enlightenment', 'Education', 'Learning', 'Humility', 'Growth'],
    });
    const talisman = makeTalisman('文昌启智');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['vintage', 'zengarden'], '山水蒙 (土/吉/文昌启智)');
    expectSecondary(rec, ['ink', 'zengarden'], '山水蒙 (土/吉/文昌启智)');
    expectConfidenceRange(rec, 0.45, 0.85, '山水蒙');
  });

  it('天地否 (金/小凶/转运破厄) — primary should be dark or blackgold', () => {
    const gua = makeGua({
      name: '天地否',
      element: '金',
      fortune: '小凶',
      keywordsEn: ['Stagnation', 'Obstacles', 'Difficulty', 'Conservatism', 'Waiting'],
    });
    const talisman = makeTalisman('转运破厄');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['dark', 'blackgold'], '天地否 (金/小凶/转运破厄)');
    expectSecondary(rec, ['cybertao', 'royal'], '天地否 (金/小凶/转运破厄)');
    expectConfidenceRange(rec, 0.65, 1.0, '天地否');
  });

  it('天火同人 (金/中吉/姻缘和合) — primary should be vintage or zengarden', () => {
    const gua = makeGua({
      name: '天火同人',
      element: '金',
      fortune: '中吉',
      keywordsEn: ['Unity', 'Cooperation', 'Comrades', 'Relationships', 'Harmony'],
    });
    const talisman = makeTalisman('姻缘和合');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['vintage', 'zengarden'], '天火同人 (金/中吉/姻缘和合)');
    expectSecondary(rec, ['tianshi', 'zengarden'], '天火同人 (金/中吉/姻缘和合)');
    expectConfidenceRange(rec, 0.50, 0.90, '天火同人');
  });

  it('雷地豫 (木/中吉/平安顺遂) — primary should be zengarden or ink', () => {
    const gua = makeGua({
      name: '雷地豫',
      element: '木',
      fortune: '中吉',
      keywordsEn: ['Joy', 'Vigor', 'Music', 'Delight', 'Drive'],
    });
    const talisman = makeTalisman('平安顺遂');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['zengarden', 'ink'], '雷地豫 (木/中吉/平安顺遂)');
    expectSecondary(rec, ['ink', 'vintage'], '雷地豫 (木/中吉/平安顺遂)');
    expectConfidenceRange(rec, 0.45, 0.85, '雷地豫');
  });

  it('天泽履 (金/中吉/平安顺遂) — primary should be vintage or zengarden', () => {
    const gua = makeGua({
      name: '天泽履',
      element: '金',
      fortune: '中吉',
      keywordsEn: ['Caution', 'Conduct', 'Care', 'Etiquette', 'Order'],
    });
    const talisman = makeTalisman('平安顺遂');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['vintage', 'zengarden'], '天泽履 (金/中吉/平安顺遂)');
    expectSecondary(rec, ['cybertao', 'dark'], '天泽履 (金/中吉/平安顺遂)');
    expectConfidenceRange(rec, 0.45, 0.85, '天泽履');
  });

  it('水天需 (水/吉/文昌启智) — primary should be ink or cybertao', () => {
    const gua = makeGua({
      name: '水天需',
      element: '水',
      fortune: '吉',
      keywordsEn: ['Waiting', 'Patience', 'Timing', 'Preparation', 'Trust'],
    });
    const talisman = makeTalisman('文昌启智');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['ink', 'cybertao'], '水天需 (水/吉/文昌启智)');
    expectSecondary(rec, ['dark', 'cybertao'], '水天需 (水/吉/文昌启智)');
    expectConfidenceRange(rec, 0.70, 1.0, '水天需');
  });

  it('离为火 (火/吉/武运昌隆) — primary should be blackgold or royal', () => {
    const gua = makeGua({
      name: '离为火',
      element: '火',
      fortune: '吉',
      keywordsEn: ['Brightness', 'Fire', 'Clarity', 'Attachment', 'Illumination'],
    });
    const talisman = makeTalisman('武运昌隆');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['blackgold', 'royal'], '离为火 (火/吉/武运昌隆)');
    expectSecondary(rec, ['royal', 'blackgold'], '离为火 (火/吉/武运昌隆)');
    expectConfidenceRange(rec, 0.45, 0.85, '离为火');
  });

  it('地天泰 (土/大吉/姻缘和合) — primary should be zengarden or vintage', () => {
    const gua = makeGua({
      name: '地天泰',
      element: '土',
      fortune: '大吉',
      keywordsEn: ['Harmony', 'Smooth', 'Peace', 'Success', 'Prosperity'],
    });
    const talisman = makeTalisman('姻缘和合');
    const rec = recommendStyle(gua, talisman);
    expectPrimary(rec, ['zengarden', 'vintage'], '地天泰 (土/大吉/姻缘和合)');
    expectSecondary(rec, ['vintage', 'tianshi'], '地天泰 (土/大吉/姻缘和合)');
    expectConfidenceRange(rec, 0.45, 0.90, '地天泰');
  });
});
