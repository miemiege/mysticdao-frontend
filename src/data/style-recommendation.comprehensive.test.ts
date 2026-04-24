/**
 * style-recommendation.comprehensive.test.ts
 *
 * 自动生成的扩展测试覆盖：16卦 × 8分类 = 128 组合
 * 注：当前数据仅包含16卦（GUA64_LIST 完整64卦待补充）
 */

import { recommendStyle, type StyleRecommendation } from '@/lib/recommendStyle';
import { GUA64_LIST } from '@/data/gua64';
import { getHexagramTalisman } from '@/data/hexagram-talismans';

const CATEGORIES = [
  '爱情婚姻',
  '事业前程',
  '财富投资',
  '健康疾病',
  '学业考试',
  '诉讼纠纷',
  '寻人失物',
  '出行旅行',
] as const;

function assertValidRecommendation(rec: StyleRecommendation): void {
  if (!rec || !rec.primary || !rec.secondary || !rec.reason) {
    throw new Error(`Invalid recommendation: ${JSON.stringify(rec)}`);
  }
  const validStyles = ['ink', 'dark', 'royal', 'vintage', 'tianshi', 'blackgold'];
  if (!validStyles.includes(rec.primary)) {
    throw new Error(`Invalid primary style: ${rec.primary}`);
  }
  if (!validStyles.includes(rec.secondary)) {
    throw new Error(`Invalid secondary style: ${rec.secondary}`);
  }
}

let passCount = 0;
let failCount = 0;

console.log(`[Comprehensive] Running ${GUA64_LIST.length} gua × ${CATEGORIES.length} categories = ${GUA64_LIST.length * CATEGORIES.length} tests...\n`);

for (const gua of GUA64_LIST) {
  const talisman = getHexagramTalisman(gua.name);
  for (const category of CATEGORIES) {
    try {
      const testTalisman = { ...talisman, category: category as any };
      const rec = recommendStyle(gua, testTalisman);
      assertValidRecommendation(rec);
      passCount++;
    } catch (err) {
      failCount++;
      console.error(`FAIL: ${gua.name} / ${category} — ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

console.log(`\n[Comprehensive] Done — ${passCount} passed, ${failCount} failed`);
if (failCount > 0) {
  throw new Error(`${failCount} comprehensive tests failed`);
}
