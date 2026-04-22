// ═══════════════════════════════════════════════════════════════
//  MysticDao 知识库统一导出
//  东方玄学数字化核心数据层 v2.0
//  涵盖：五行、天干地支、十神、格局、调候、神煞、纳音
//        八卦、六十四卦、风水方位、八宅游星、大游年、易经
// ═══════════════════════════════════════════════════════════════

// ── 五行系统 ──
export {
  WUXING_LIST, WUXING_MAP, WUXING_SHENG, WUXING_KE,
  WUXING_COLORS, WUXING_COLORS_CN,
  getWuxing, getWuxingByElement, getSheng, getKe, getBeiSheng, getBeiKe,
  getWuxingRelation,
} from './wuxing';
export type { Wuxing, YinYang, WuxingInfo } from './wuxing';

// ── 天干系统 ──
export {
  TIANGAN_LIST, TIANGAN_HE, TIANGAN_CHONG,
  getTiangan, getTianganByOrder, getTianganByElement,
  getTianganByYinYang, getTianganHe, getTianganChong,
} from './tiangan';
export type { Tiangan } from './tiangan';

// ── 地支系统 ──
export {
  DIZHI_LIST, DIZHI_LIUHE, DIZHI_LIUCHONG,
  DIZHI_SANHE, DIZHI_SANHUI, DIZHI_LIUHAI,
  CHANGSHENG_ORDER, CHANGSHENG_TABLE,
  getDizhi, getDizhiByOrder, getDizhiByAnimal,
  getDizhiByElement,
  getDizhiLiuhe, getDizhiChong, getDizhiHai,
  getChangSheng, checkSanhe,
} from './dizhi';
export type { Dizhi, ChangShengStage } from './dizhi';

// ── 十神系统 ──
export {
  SHISHEN_LIST,
  calculateShishen, getShishen, getShishenElement,
} from './shishen';
export type { Shishen, ShishenName } from './shishen';

// ── 格局论（子平真诠） ──
export {
  GEJU_LIST,
  determineGeju, getGeju, getGejuLevel,
} from './bazi/juege';
export type { Geju, GejuType } from './bazi/juege';

// ── 调候系统（穷通宝鉴） ──
export {
  TIAOHOU_LIST,
  getTiaohou, getTiaohouBySeason, getTiaohouByDayMaster,
} from './bazi/tiaohou';
export type { Tiaohou } from './bazi/tiaohou';

// ── 神煞系统（渊海子平） ──
export {
  SHENSHA_LIST,
  TIANYI_TABLE, WENCHANG_TABLE, TAOHUA_TABLE,
  YIMA_TABLE, HUAGAI_TABLE, YANGREN_TABLE,
  getShensha, hasTianyi, hasWenchang, hasTaohua,
  hasYima, hasHuagai, hasYangren, getAllShensha,
} from './bazi/shensha';
export type { Shensha, ShenshaType } from './bazi/shensha';

// ── 纳音系统 ──
export {
  NAYIN_LIST, NAYIN_MAP, NAYIN_CYCLE,
  getNayin, getNayinByElement, getNayinByGanzhiIndex,
} from './nayin';
export type { Nayin } from './nayin';

// ── 八卦系统 ──
export {
  BAGUA_LIST, BAGUA_MAP,
  getBagua, getBaguaBySymbol, getBaguaByElement,
  getBaguaByDirection, getBaguaFromTrigram, getBaguaFromLines,
} from './bagua';
export type { Bagua } from './bagua';

// ── 六十四卦 ──
export {
  GUA64_LIST, GUA64_MAP,
  getGua64, getGua64ByNumber, getGua64ByUpperLower,
  getGua64BySymbol, getGua64ByFortune, getRandomGua64,
  getGua64ByElement,
} from './gua64';
export type { Gua64 } from './gua64';

// ── 易经核心原文 ──
export {
  YIJING_QUOTES,
  getYijingQuotes, getYijingQuoteBySource,
  getRandomYijingQuote, getDailyYijingQuote,
} from './yijing';
export type { YijingQuote } from './yijing';

// ── 风水方位 ──
export {
  DIRECTIONS, DIRECTION_NAMES, DIRECTION_LIST,
  getDirectionByAngle, getDirectionByName,
  getDirectionByBagua, getDirectionByElement,
} from './fengshui/directions';
export type { DirectionInfo } from './fengshui/directions';

// ── 八宅游星 ──
export {
  YOUXING_LIST, YOUXING_MAP, YOUXING_ORDER,
  YOUXING_DIRECTION_MAP,
  getYouxing, getYouxingByType,
  getYouxingByDirection, getYouxingLayout,
} from './fengshui/youxing';
export type { Youxing, YouxingName } from './fengshui/youxing';

// ── 大游年歌诀（八宅明镜） ──
export {
  DAYOUNIAN_GEJUE, DAYOUNIAN_ORIGINAL,
  HOUTIAN_DIRECTION_ORDER, BAGUA_DIRECTION, DIRECTION_BAGUA,
  getYouxingDistribution, // getYouxingByDirection also in youxing.ts,
  getDirectionByYouxing, getJiFang, getXiongFang,
  checkZhaiMingMatch, getYangzhaiSanyao,
} from './fengshui/dayounian';
