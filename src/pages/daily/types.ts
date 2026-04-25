/**
 * Daily Page — 共享类型定义
 */

import type { Yao } from '@/components/daily/HexagramDraw';
import type { PosterStyleName } from '@/lib/posterStyles';

export type Step = 'idle' | 'ritual' | 'loading' | 'result';

export interface FortuneResult {
  card: {
    name: string;
    keyword: string;
    aspect: string;
    color: string;
  };
  overallScore: number;
  scores: { label: string; score: number; color: string }[];
  luckyColor: string;
  luckyNumber: string;
  luckyDirection: string;
  reading: string;
}

export interface DailyState {
  step: Step;
  fortune: FortuneResult | null;
  lines: Yao[] | null;
  reading: string;
  error: string;
  alreadyDrawn: boolean;
}

export interface StepResultUI {
  revealedStage: number;
  selectedStyle: PosterStyleName | null;
  hexagramDrawn: boolean;
  showStyleSelector: boolean;
}

/** 从卦名生成六爻数据 */
export interface HexagramData {
  lines: Yao[];
  name: string;
  symbol: string;
}
