// ═══════════════════════════════════════════════════════════════
//  大游年歌诀 — 源自《八宅明镜》《阳宅三要》
//  八宅派核心口诀，以坐山起伏位，顺布七星定吉凶
//  乾六天五祸绝延生 坎五天生延绝祸六
//  艮六绝祸生延天五 震延生祸绝五天六
//  巽天五六祸生绝延 离六五绝延祸生天
//  坤天延绝生祸五六 兑生祸延绝六五天
// ═══════════════════════════════════════════════════════════════

/** 大游年歌诀：从伏位开始顺时针排列的七颗星 */
export const DAYOUNIAN_GEJUE: Record<string, string[]> = {
  '乾': ['伏位', '六煞', '天医', '五鬼', '祸害', '绝命', '延年', '生气'],
  '坎': ['伏位', '五鬼', '天医', '生气', '延年', '绝命', '祸害', '六煞'],
  '艮': ['伏位', '六煞', '绝命', '祸害', '生气', '延年', '天医', '五鬼'],
  '震': ['伏位', '延年', '生气', '祸害', '绝命', '五鬼', '天医', '六煞'],
  '巽': ['伏位', '天医', '五鬼', '六煞', '祸害', '生气', '绝命', '延年'],
  '离': ['伏位', '六煞', '五鬼', '绝命', '延年', '祸害', '生气', '天医'],
  '坤': ['伏位', '天医', '延年', '绝命', '生气', '祸害', '五鬼', '六煞'],
  '兑': ['伏位', '生气', '祸害', '延年', '绝命', '六煞', '五鬼', '天医'],
};

/** 大游年歌诀原文 */
export const DAYOUNIAN_ORIGINAL: Record<string, string> = {
  '乾': '乾六天五祸绝延生',
  '坎': '坎五天生延绝祸六',
  '艮': '艮六绝祸生延天五',
  '震': '震延生祸绝五天六',
  '巽': '巽天五六祸生绝延',
  '离': '离六五绝延祸生天',
  '坤': '坤天延绝生祸五六',
  '兑': '兑生祸延绝六五天',
};

/** 后天八卦方位顺序（顺时针） */
export const HOUTIAN_DIRECTION_ORDER = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];

/** 八卦对应的方位 */
export const BAGUA_DIRECTION: Record<string, string> = {
  '坎': '北', '艮': '东北', '震': '东', '巽': '东南',
  '离': '南', '坤': '西南', '兑': '西', '乾': '西北',
};

/** 方位对应的八卦 */
export const DIRECTION_BAGUA: Record<string, string> = {
  '北': '坎', '东北': '艮', '东': '震', '东南': '巽',
  '南': '离', '西南': '坤', '西': '兑', '西北': '乾',
};

/**
 * 根据坐山获取八宅游星分布
 */
export function getYouxingDistribution(zuoshan: string): Record<string, string> | undefined {
  const stars = DAYOUNIAN_GEJUE[zuoshan];
  if (!stars) return undefined;
  const directions = HOUTIAN_DIRECTION_ORDER;
  const result: Record<string, string> = {};
  for (let i = 0; i < 8; i++) {
    result[directions[i]] = stars[i];
  }
  return result;
}

/**
 * 根据坐山和方位获取游星
 */
export function getYouxingByDirection(zuoshan: string, direction: string): string | undefined {
  const distribution = getYouxingDistribution(zuoshan);
  return distribution?.[direction];
}

/**
 * 根据坐山和游星获取方位
 */
export function getDirectionByYouxing(zuoshan: string, youxing: string): string | undefined {
  const distribution = getYouxingDistribution(zuoshan);
  if (!distribution) return undefined;
  for (const [dir, star] of Object.entries(distribution)) {
    if (star === youxing) return dir;
  }
  return undefined;
}

/**
 * 获取某坐山的四吉方
 */
export function getJiFang(zuoshan: string): string[] {
  const distribution = getYouxingDistribution(zuoshan);
  if (!distribution) return [];
  return Object.entries(distribution)
    .filter(([, star]) => ['生气', '天医', '延年', '伏位'].includes(star))
    .map(([dir]) => dir);
}

/**
 * 获取某坐山的四凶方
 */
export function getXiongFang(zuoshan: string): string[] {
  const distribution = getYouxingDistribution(zuoshan);
  if (!distribution) return [];
  return Object.entries(distribution)
    .filter(([, star]) => ['绝命', '五鬼', '六煞', '祸害'].includes(star))
    .map(([dir]) => dir);
}

/**
 * 判断宅命是否相配
 */
export function checkZhaiMingMatch(minggua: string, zhai: string): { match: boolean; reason: string } {
  const dongsi = ['坎', '离', '震', '巽'];
  const mingType = dongsi.includes(minggua) ? '东四' : '西四';
  const zhaiType = dongsi.includes(zhai) ? '东四' : '西四';
  if (mingType === zhaiType) {
    return { match: true, reason: `${mingType}命配${zhaiType}宅，宅命相配，吉。` };
  }
  return { match: false, reason: `${mingType}命配${zhaiType}宅，宅命不配，需化解。` };
}

/**
 * 获取阳宅三要（门、主、灶）的吉凶判断
 */
export function getYangzhaiSanyao(
  zuoshan: string,
  men: string,
  zhu: string,
  zao: string
): { men: string; zhu: string; zao: string; overall: string } {
  const menStar = getYouxingByDirection(zuoshan, men) || '未知';
  const zhuStar = getYouxingByDirection(zuoshan, zhu) || '未知';
  const zaoStar = getYouxingByDirection(zuoshan, zao) || '未知';
  const jiStars = ['生气', '天医', '延年', '伏位'];
  const menJi = jiStars.includes(menStar);
  const zhuJi = jiStars.includes(zhuStar);
  const zaoJi = jiStars.includes(zaoStar);
  let overall = '';
  if (menJi && zhuJi && zaoJi) {
    overall = '三方全吉，大吉之宅。';
  } else if (!menJi && !zhuJi && !zaoJi) {
    overall = '三方全凶，大凶之宅，需重新布局。';
  } else {
    const jiCount = [menJi, zhuJi, zaoJi].filter(Boolean).length;
    overall = `${jiCount}方吉，${3 - jiCount}方凶，需调整布局。`;
  }
  return {
    men: `门在${men}，${menStar}方，${menJi ? '吉' : '凶'}`,
    zhu: `主在${zhu}，${zhuStar}方，${zhuJi ? '吉' : '凶'}`,
    zao: `灶在${zao}，${zaoStar}方，${zaoJi ? '吉' : '凶'}`,
    overall,
  };
}
