/**
 * style-recommendation.comprehensive.test.ts
 *
 * 扩展测试覆盖：16卦 x 8分类 = 128 组合
 * vitest 格式（describe + it）
 */

import { describe, it, expect } from 'vitest';
import { recommendStyle } from '@/lib/recommendStyle';
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

const VALID_STYLES = ['ink', 'dark', 'royal', 'vintage', 'tianshi', 'blackgold', 'cybertao', 'zengarden'];

describe('Style Recommendation — Comprehensive (16 gua x 8 categories)', () => {
  for (const gua of GUA64_LIST) {
    const talisman = getHexagramTalisman(gua.name);
    for (const category of CATEGORIES) {
      it(`${gua.name} / ${category}`, () => {
        const testTalisman = { ...talisman, category: category as any };
        const rec = recommendStyle(gua, testTalisman);

        expect(rec).toBeDefined();
        expect(rec.primary).toBeTruthy();
        expect(rec.secondary).toBeTruthy();
        expect(rec.reason).toBeTruthy();
        expect(rec.reasonZh).toBeTruthy();
        expect(rec.confidence).toBeGreaterThan(0);
        expect(rec.confidence).toBeLessThanOrEqual(1);
        expect(VALID_STYLES).toContain(rec.primary);
        expect(VALID_STYLES).toContain(rec.secondary);
        expect(rec.primary).not.toBe(rec.secondary);
      });
    }
  }
});
