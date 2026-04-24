/**
 * useStyleRecommendation — React Hook for Smart Style Recommendation
 *
 * Usage:
 *   const { recommendation, isLoading, refresh } = useStyleRecommendation(gua, talisman);
 *
 * If talisman is omitted, auto-resolves via getHexagramTalisman(gua.name).
 * Results are memoized via useMemo; calling refresh() forces a new calculation.
 */

import { useMemo, useState, useCallback } from 'react';
import type { Gua64 } from '@/data/gua64';
import type { HexagramTalisman } from '@/data/hexagram-talismans';
import { getHexagramTalisman } from '@/data/hexagram-talismans';
import { recommendStyle, type StyleRecommendation } from '@/lib/recommendStyle';

export interface UseStyleRecommendationResult {
  recommendation: StyleRecommendation;
  isLoading: boolean;
  refresh: () => void;
}

export function useStyleRecommendation(
  gua: Gua64,
  talisman?: HexagramTalisman
): UseStyleRecommendationResult {
  // 用于触发重新计算的版本计数器
  const [version, setVersion] = useState(0);

  const resolvedTalisman = talisman ?? getHexagramTalisman(gua.name);

  const recommendation = useMemo<StyleRecommendation>(
    () => recommendStyle(gua, resolvedTalisman),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gua, resolvedTalisman, version]
  );

  const refresh = useCallback(() => {
    setVersion(v => v + 1);
  }, []);

  // 计算是同步的，但为了 API 一致性保留 isLoading
  const isLoading = false;

  return { recommendation, isLoading, refresh };
}
