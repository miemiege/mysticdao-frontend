/**
 * Style Recommendation Test Suite — 风格推荐算法测试集
 *
 * 使用简单 assert 函数，无外部测试框架依赖。
 * 覆盖不同五行、运势、分类的组合，验证推荐核心逻辑。
 */

import { recommendStyle, type StyleRecommendation } from '@/lib/recommendStyle';
import type { Gua64 } from '@/data/gua64';
import type { HexagramTalisman } from '@/data/hexagram-talismans';

/* ------------------------------------------------------------------ */
/* 极简 assert 工具                                                    */
/* ------------------------------------------------------------------ */

let passCount = 0;
let failCount = 0;
const failures: string[] = [];

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual === expected) {
    passCount++;
  } else {
    failCount++;
    failures.push(`FAIL: ${message}\n  expected: ${expected}\n  actual: ${actual}`);
  }
}

function assertPrimary(
  rec: StyleRecommendation,
  expectedPrimary: string,
  testName: string
) {
  assertEqual(rec.primary, expectedPrimary as any, `${testName} — primary style`);
}

function assertSecondary(
  rec: StyleRecommendation,
  expectedSecondary: string,
  testName: string
) {
  assertEqual(rec.secondary, expectedSecondary as any, `${testName} — secondary style`);
}

function assertConfidenceRange(
  rec: StyleRecommendation,
  min: number,
  max: number,
  testName: string
) {
  if (rec.confidence >= min && rec.confidence <= max) {
    passCount++;
  } else {
    failCount++;
    failures.push(
      `FAIL: ${testName} — confidence out of range [${min}, ${max}]\n  actual: ${rec.confidence}`
    );
  }
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
/* 12 组测试用例                                                       */
/* ------------------------------------------------------------------ */

function runTests() {
  /* 1. 乾为天 — 金 + 大吉 + 天官赐福 → royal (三重强匹配) */
  {
    const gua = makeGua({
      name: '乾为天',
      element: '金',
      fortune: '大吉',
      keywordsEn: ['Creation', 'Progress', 'Vigor', 'Leadership', 'Success'],
    });
    const talisman = makeTalisman('天官赐福');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'royal', '乾为天 (金/大吉/天官赐福)');
    assertSecondary(rec, 'blackgold', '乾为天 (金/大吉/天官赐福)');
    assertConfidenceRange(rec, 0.95, 1.0, '乾为天');
  }

  /* 2. 坤为地 — 土 + 大吉 + 地母护身 → vintage (土+地母双强) */
  {
    const gua = makeGua({
      name: '坤为地',
      element: '土',
      fortune: '大吉',
      keywordsEn: ['Gentleness', 'Inclusiveness', 'Bearing', 'Steadiness', 'Virtue'],
    });
    const talisman = makeTalisman('地母护身');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'vintage', '坤为地 (土/大吉/地母护身)');
    assertSecondary(rec, 'tianshi', '坤为地 (土/大吉/地母护身)');
    assertConfidenceRange(rec, 0.7, 0.85, '坤为地');
  }

  /* 3. 火天大有 — 火 + 大吉 + 财运亨通 → blackgold (火+大吉+财运三重) */
  {
    const gua = makeGua({
      name: '火天大有',
      element: '火',
      fortune: '大吉',
      keywordsEn: ['Harvest', 'Wealth', 'Success', 'Brightness', 'Prosperity'],
    });
    const talisman = makeTalisman('财运亨通');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'blackgold', '火天大有 (火/大吉/财运亨通)');
    assertSecondary(rec, 'royal', '火天大有 (火/大吉/财运亨通)');
    assertConfidenceRange(rec, 0.9, 1.0, '火天大有');
  }

  /* 4. 水雷屯 — 水 + 中吉 + 转运破厄 → dark (水+转运+Difficult关键词) */
  {
    const gua = makeGua({
      name: '水雷屯',
      element: '水',
      fortune: '中吉',
      keywordsEn: ['Difficulty', 'Beginning', 'Entrepreneurship', 'Perseverance', 'New birth'],
    });
    const talisman = makeTalisman('转运破厄');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'dark', '水雷屯 (水/中吉/转运破厄)');
    assertSecondary(rec, 'tianshi', '水雷屯 (水/中吉/转运破厄)');
    assertConfidenceRange(rec, 0.6, 0.7, '水雷屯');
  }

  /* 5. 风天小畜 — 木 + 中平 + 财运亨通 → ink (木+中平+平安关键词) */
  {
    const gua = makeGua({
      name: '风天小畜',
      element: '木',
      fortune: '中平',
      keywordsEn: ['Accumulation', 'Preparation', 'Waiting', 'Buildup', 'Patience'],
    });
    const talisman = makeTalisman('财运亨通');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'ink', '风天小畜 (木/中平/财运亨通)');
    assertSecondary(rec, 'vintage', '风天小畜 (木/中平/财运亨通)');
    assertConfidenceRange(rec, 0.75, 0.85, '风天小畜');
  }

  /* 6. 天水讼 — 金 + 小凶 + 转运破厄 → dark (金+小凶+转运+Conflict) */
  {
    const gua = makeGua({
      name: '天水讼',
      element: '金',
      fortune: '小凶',
      keywordsEn: ['Conflict', 'Dispute', 'Reconciliation', 'Caution', 'Compromise'],
    });
    const talisman = makeTalisman('转运破厄');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'dark', '天水讼 (金/小凶/转运破厄)');
    assertSecondary(rec, 'vintage', '天水讼 (金/小凶/转运破厄)');
    assertConfidenceRange(rec, 0.9, 1.0, '天水讼');
  }

  /* 7. 地水师 — 土 + 中吉 + 武运昌隆 → tianshi (土+中吉压过武运) */
  {
    const gua = makeGua({
      name: '地水师',
      element: '土',
      fortune: '中吉',
      keywordsEn: ['Army', 'Discipline', 'Leadership', 'Unity', 'War'],
    });
    const talisman = makeTalisman('武运昌隆');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'tianshi', '地水师 (土/中吉/武运昌隆)');
    assertSecondary(rec, 'vintage', '地水师 (土/中吉/武运昌隆)');
    assertConfidenceRange(rec, 0.65, 0.75, '地水师');
  }

  /* 8. 山水蒙 — 土 + 吉 + 文昌启智 → vintage (土+吉压过文昌) */
  {
    const gua = makeGua({
      name: '山水蒙',
      element: '土',
      fortune: '吉',
      keywordsEn: ['Enlightenment', 'Education', 'Learning', 'Humility', 'Growth'],
    });
    const talisman = makeTalisman('文昌启智');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'vintage', '山水蒙 (土/吉/文昌启智)');
    assertSecondary(rec, 'ink', '山水蒙 (土/吉/文昌启智)');
    assertConfidenceRange(rec, 0.7, 0.8, '山水蒙');
  }

  /* 9. 天地否 — 金 + 小凶 + 转运破厄 → dark (金+小凶+转运+Stagnation) */
  {
    const gua = makeGua({
      name: '天地否',
      element: '金',
      fortune: '小凶',
      keywordsEn: ['Stagnation', 'Obstacles', 'Difficulty', 'Conservatism', 'Waiting'],
    });
    const talisman = makeTalisman('转运破厄');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'dark', '天地否 (金/小凶/转运破厄)');
    assertSecondary(rec, 'royal', '天地否 (金/小凶/转运破厄)');
    assertConfidenceRange(rec, 0.9, 1.0, '天地否');
  }

  /* 10. 天火同人 — 金 + 中吉 + 姻缘和合 → vintage (姻缘+Unity/Harmony关键词) */
  {
    const gua = makeGua({
      name: '天火同人',
      element: '金',
      fortune: '中吉',
      keywordsEn: ['Unity', 'Cooperation', 'Comrades', 'Relationships', 'Harmony'],
    });
    const talisman = makeTalisman('姻缘和合');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'vintage', '天火同人 (金/中吉/姻缘和合)');
    assertSecondary(rec, 'tianshi', '天火同人 (金/中吉/姻缘和合)');
    assertConfidenceRange(rec, 0.75, 0.85, '天火同人');
  }

  /* 11. 雷地豫 — 木 + 中吉 + 平安顺遂 → ink (木+平安) */
  {
    const gua = makeGua({
      name: '雷地豫',
      element: '木',
      fortune: '中吉',
      keywordsEn: ['Joy', 'Vigor', 'Music', 'Delight', 'Drive'],
    });
    const talisman = makeTalisman('平安顺遂');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'ink', '雷地豫 (木/中吉/平安顺遂)');
    assertSecondary(rec, 'vintage', '雷地豫 (木/中吉/平安顺遂)');
    assertConfidenceRange(rec, 0.7, 0.8, '雷地豫');
  }

  /* 12. 天泽履 — 金 + 中吉 + 平安顺遂 → vintage (金+平安+Caution关键词) */
  {
    const gua = makeGua({
      name: '天泽履',
      element: '金',
      fortune: '中吉',
      keywordsEn: ['Caution', 'Conduct', 'Care', 'Etiquette', 'Order'],
    });
    const talisman = makeTalisman('平安顺遂');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'vintage', '天泽履 (金/中吉/平安顺遂)');
    assertSecondary(rec, 'dark', '天泽履 (金/中吉/平安顺遂)');
    assertConfidenceRange(rec, 0.7, 0.8, '天泽履');
  }

  /* 13. 额外验证：吉 + 文昌启智 + 水 → ink (文昌+水双重匹配) */
  {
    const gua = makeGua({
      name: '水天需',
      element: '水',
      fortune: '吉',
      keywordsEn: ['Waiting', 'Patience', 'Timing', 'Preparation', 'Trust'],
    });
    const talisman = makeTalisman('文昌启智');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'ink', '水天需 (水/吉/文昌启智)');
    assertSecondary(rec, 'dark', '水天需 (水/吉/文昌启智)');
    assertConfidenceRange(rec, 0.95, 1.0, '水天需');
  }

  /* 14. 额外验证：火 + 武运昌隆 + 凶 → blackgold (武运强匹配) */
  {
    const gua = makeGua({
      name: '离为火',
      element: '火',
      fortune: '吉',
      keywordsEn: ['Brightness', 'Fire', 'Clarity', 'Attachment', 'Illumination'],
    });
    const talisman = makeTalisman('武运昌隆');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'blackgold', '离为火 (火/吉/武运昌隆)');
    assertSecondary(rec, 'royal', '离为火 (火/吉/武运昌隆)');
    assertConfidenceRange(rec, 0.7, 0.8, '离为火');
  }

  /* 15. 额外验证：土 + 吉 + 姻缘和合 → vintage (土+吉+姻缘三重) */
  {
    const gua = makeGua({
      name: '地天泰',
      element: '土',
      fortune: '大吉',
      keywordsEn: ['Harmony', 'Smooth', 'Peace', 'Success', 'Prosperity'],
    });
    const talisman = makeTalisman('姻缘和合');
    const rec = recommendStyle(gua, talisman);
    assertPrimary(rec, 'vintage', '地天泰 (土/大吉/姻缘和合)');
    assertSecondary(rec, 'tianshi', '地天泰 (土/大吉/姻缘和合)');
    assertConfidenceRange(rec, 0.7, 0.85, '地天泰');
  }
}

/* ------------------------------------------------------------------ */
/* 执行 & 报告                                                         */
/* ------------------------------------------------------------------ */

runTests();

console.log(`\n========================================`);
console.log(`Style Recommendation Test Results`);
console.log(`========================================`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
console.log(`Total:  ${passCount + failCount}`);

if (failures.length > 0) {
  console.log(`\n--- Failure Details ---`);
  failures.forEach(f => console.log(f));
  throw new Error(`${failCount} test(s) failed`);
} else {
  console.log(`\nAll tests passed!`);
}
