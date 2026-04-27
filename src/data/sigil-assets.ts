/**
 * SigilAssets — OmniSigil Studio 素材索引
 * 路径基于 public/omnisigil/ 目录
 */

export const BG_IMAGES = [
  '/omnisigil/backgrounds/bg_01.jpg',
  '/omnisigil/backgrounds/bg_02.jpg',
  '/omnisigil/backgrounds/bg_03.jpg',
  '/omnisigil/backgrounds/bg_04.jpg',
  '/omnisigil/backgrounds/bg_05.jpg',
  '/omnisigil/backgrounds/bg_06.jpg',
  '/omnisigil/backgrounds/bg_07.jpg',
  '/omnisigil/backgrounds/bg_08.jpg',
  '/omnisigil/backgrounds/bg_09.jpg',
  '/omnisigil/backgrounds/bg_10.jpg',
];

export const SEAL_IMAGES = [
  '/omnisigil/seals/seal_01.jpg',
  '/omnisigil/seals/seal_02.jpg',
  '/omnisigil/seals/seal_03.jpg',
  '/omnisigil/seals/seal_04.jpg',
  '/omnisigil/seals/seal_05.jpg',
  '/omnisigil/seals/seal_06.jpg',
  '/omnisigil/seals/seal_07.jpg',
  '/omnisigil/seals/seal_08.jpg',
];

export const BORDER_IMAGES = [
  '/omnisigil/borders/border_01.jpg',
  '/omnisigil/borders/border_02.jpg',
  '/omnisigil/borders/border_03.jpg',
  '/omnisigil/borders/border_04.jpg',
  '/omnisigil/borders/border_05.jpg',
  '/omnisigil/borders/border_06.jpg',
  '/omnisigil/borders/border_07.jpg',
  '/omnisigil/borders/border_08.jpg',
];

/** 根据五行/上卦选择背景图索引 */
export const getBackgroundIndex = (element: string, upper: string): number => {
  const map: Record<string, number> = { '金': 0, '木': 1, '水': 2, '火': 3, '土': 4 };
  const base = map[element] ?? 0;
  const trigramMap: Record<string, number> = { '乾': 0, '坤': 1, '震': 2, '巽': 3, '坎': 4, '离': 5, '艮': 6, '兑': 7 };
  const offset = trigramMap[upper] ?? 0;
  return (base + offset) % BG_IMAGES.length;
};

/** 根据分数选择印章图索引 */
export const getSealIndex = (score: number): number => {
  if (score >= 90) return 0;
  if (score >= 80) return 1;
  if (score >= 70) return 2;
  if (score >= 60) return 3;
  if (score >= 50) return 4;
  return 5;
};

/** 根据上卦选择边框类型 */
export const getBorderType = (upper: string): 'a' | 'b' | 'c' => {
  if (['乾', '震', '离'].includes(upper)) return 'a';
  if (['坤', '艮', '兑'].includes(upper)) return 'b';
  return 'c';
};
