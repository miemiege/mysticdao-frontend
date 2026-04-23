/**
 * 二十四山向风水数据
 * ------------------
 * 二十四山向将圆周360°均分为24份，每山15°。
 * 以子（正北）为起点，按顺时针方向排列。
 * 二十四山向是风水罗盘的核心理论基础。
 *
 * 八卦方位对应：
 * - 坎卦 ☵ 正北（水）- 壬、子、癸
 * - 艮卦 ☶ 东北（土）- 丑、艮、寅
 * - 震卦 ☳ 正东（木）- 甲、卯、乙
 * - 巽卦 ☴ 东南（木）- 辰、巽、巳
 * - 离卦 ☲ 正南（火）- 丙、午、丁
 * - 坤卦 ☷ 西南（土）- 未、坤、申
 * - 兑卦 ☱ 正西（金）- 庚、酉、辛
 * - 乾卦 ☰ 西北（金）- 戌、乾、亥
 */

/** 二十四山向数据结构 */
export interface Mountain24 {
  /** 唯一标识，如 "zi", "chou" 等 */
  id: string;
  /** 山向名称，如 "子", "癸", "丑" 等 */
  name: string;
  /** 所属主方向 key，如 "north", "northeast" 等 */
  direction: string;
  /** 主方向中文，如 "北", "东北" 等 */
  directionLabel: string;
  /** 所属卦名，如 "坎", "艮" 等 */
  trigram: string;
  /** 卦象字符，如 "☵", "☶" 等 */
  trigramChar: string;
  /** 五行：金木水火土 */
  element: string;
  /** 中心角度（0-360） */
  angle: number;
  /** 吉凶评级 */
  auspicious: '吉' | '凶' | '平';
  /** 宜：适合做什么（3-4条） */
  suitable: string[];
  /** 忌：不适合做什么（2-3条） */
  avoid: string[];
  /** 简短建议文本（1-2句） */
  advice: string;
}

// ==========================================
// 二十四山向完整数据
// 按顺时针顺序排列，从正北开始
// ==========================================

/** 二十四山向数据数组（从正北顺时针排列） */
export const mountains24: Mountain24[] = [
  // ───── 坎卦 ☵ 正北（水）─────
  {
    id: 'ren',
    name: '壬',
    direction: 'north',
    directionLabel: '北',
    trigram: '坎',
    trigramChar: '☵',
    element: '水',
    angle: 352.5,
    auspicious: '吉',
    suitable: ['开门立户，纳气迎财', '修建水渠，引水归堂', '安葬先人，福荫子孙', '商旅远行，顺风顺水'],
    avoid: ['大兴土木，动土破基', '火源近身，引火烧身'],
    advice: '壬水通天，气场流通，宜把握时机布局聚财。此时辰得水之灵气，万事亨通。',
  },
  {
    id: 'zi',
    name: '子',
    direction: 'north',
    directionLabel: '北',
    trigram: '坎',
    trigramChar: '☵',
    element: '水',
    angle: 0,
    auspicious: '平',
    suitable: ['静修打坐，养精蓄锐', '读书悟道，明心见性', '收藏珍宝，锁气聚灵'],
    avoid: ['婚嫁喜庆，易生波折', '动土开工，冲犯太岁'],
    advice: '子为正北之极，阴阳交替之刻。宜静不宜动，韬光养晦以待天时。',
  },
  {
    id: 'gui',
    name: '癸',
    direction: 'north',
    directionLabel: '北',
    trigram: '坎',
    trigramChar: '☵',
    element: '水',
    angle: 7.5,
    auspicious: '凶',
    suitable: ['祈福禳灾，化解戾气'],
    avoid: ['搬迁入宅，气运不稳', '签约立约，易有反悔', '远行涉水，险象环生'],
    advice: '癸水阴寒，气场凝滞。此山向阴气偏重，行事须加倍谨慎，凡事三思而后行。',
  },

  // ───── 艮卦 ☶ 东北（土）─────
  {
    id: 'chou',
    name: '丑',
    direction: 'northeast',
    directionLabel: '东北',
    trigram: '艮',
    trigramChar: '☶',
    element: '土',
    angle: 22.5,
    auspicious: '平',
    suitable: ['修缮房屋，巩固根基', '整理仓储，盘点积藏', '祭祀祖先，感恩报德'],
    avoid: ['开业庆典，人气不旺', '破土动工，地气未苏'],
    advice: '丑土藏金，万物蛰伏。此时节地气沉潜，宜守成不宜冒进，静待春回大地。',
  },
  {
    id: 'gen',
    name: '艮',
    direction: 'northeast',
    directionLabel: '东北',
    trigram: '艮',
    trigramChar: '☶',
    element: '土',
    angle: 37.5,
    auspicious: '吉',
    suitable: ['开山立向，借势而为', '求学拜师，增长智慧', '种植果树，生根发芽', '健身练功，强筋健骨'],
    avoid: ['沉迷酒色，耗散元气'],
    advice: '艮为山，止于其所。此山向得土之厚重，宜稳健前行，步步为营则大吉大利。',
  },
  {
    id: 'yin',
    name: '寅',
    direction: 'northeast',
    directionLabel: '东北',
    trigram: '艮',
    trigramChar: '☶',
    element: '土',
    angle: 52.5,
    auspicious: '凶',
    suitable: ['布设风水阵，化解煞气'],
    avoid: ['开仓出货，财散人离', '争讼是非，引祸上身', '嫁娶纳采，夫妻不和'],
    advice: '寅位猛虎出林，煞气暗藏。此方位锋芒毕露，易招是非，宜低调隐忍，避其锐气。',
  },

  // ───── 震卦 ☳ 正东（木）─────
  {
    id: 'jia',
    name: '甲',
    direction: 'east',
    directionLabel: '东',
    trigram: '震',
    trigramChar: '☳',
    element: '木',
    angle: 67.5,
    auspicious: '吉',
    suitable: ['创业开基，一鸣惊人', '播种插秧，万物复苏', '拜师学艺，蒸蒸日上', '运动竞技，气势如虹'],
    avoid: ['过度操劳，损肝伤神'],
    advice: '甲木参天，生机勃发。此山向承东方之朝气，万物复苏之时，诸事皆宜，蒸蒸日上。',
  },
  {
    id: 'mao',
    name: '卯',
    direction: 'east',
    directionLabel: '东',
    trigram: '震',
    trigramChar: '☳',
    element: '木',
    angle: 82.5,
    auspicious: '平',
    suitable: ['春日踏青，吸纳生气', '读书习字，开卷有益', '绿化环境，植树造林'],
    avoid: ['大兴土木，伐木伤根', '口舌之争，易结仇怨'],
    advice: '卯为正东之门，日月升起的方向。气场平和中正，守正则吉，妄动则失。',
  },
  {
    id: 'yi',
    name: '乙',
    direction: 'east',
    directionLabel: '东',
    trigram: '震',
    trigramChar: '☳',
    element: '木',
    angle: 97.5,
    auspicious: '吉',
    suitable: ['婚嫁喜庆，鸾凤和鸣', '开门纳客，广结善缘', '文创作画，灵感泉涌', '调理身体，养肝明目'],
    avoid: ['金属利器，砍伐伤木'],
    advice: '乙木柔韧，花草藤萝。此山向温柔而有生机，宜以柔克刚，和气生财，人缘大旺。',
  },

  // ───── 巽卦 ☴ 东南（木）─────
  {
    id: 'chen',
    name: '辰',
    direction: 'southeast',
    directionLabel: '东南',
    trigram: '巽',
    trigramChar: '☴',
    element: '木',
    angle: 112.5,
    auspicious: '凶',
    suitable: ['清理旧物，除秽更新'],
    avoid: ['投资置业，财运不畅', '涉水游泳，暗藏凶险', '妄言妄语，是非缠身'],
    advice: '辰为湿土，木气受困。此方位气场驳杂，阴晴不定，须防小人暗算，谨守本分。',
  },
  {
    id: 'xun',
    name: '巽',
    direction: 'southeast',
    directionLabel: '东南',
    trigram: '巽',
    trigramChar: '☴',
    element: '木',
    angle: 127.5,
    auspicious: '平',
    suitable: ['通风换气，流通气场', '纺织缝纫，手作精巧', '教育传道，春风化雨'],
    avoid: ['封闭堵塞，气滞不畅', '暴饮暴食，肠胃不和'],
    advice: '巽为风，入而后散。此山向如风拂面，宜顺势而为，不可逆势强争，以柔为本。',
  },
  {
    id: 'si',
    name: '巳',
    direction: 'southeast',
    directionLabel: '东南',
    trigram: '巽',
    trigramChar: '☴',
    element: '木',
    angle: 142.5,
    auspicious: '吉',
    suitable: ['求学考试，文思泉涌', '交友聚会，人气旺盛', '布置文昌，增慧开智', '养生调理，疏通经络'],
    avoid: ['火气太盛，易生焦躁'],
    advice: '巳火藏金，木火通明。此方位文昌星照，利学业文书，勤勉精进必有所成。',
  },

  // ───── 离卦 ☲ 正南（火）─────
  {
    id: 'bing',
    name: '丙',
    direction: 'south',
    directionLabel: '南',
    trigram: '离',
    trigramChar: '☲',
    element: '火',
    angle: 157.5,
    auspicious: '平',
    suitable: ['晾晒衣物，吸收阳气', '修心养德，光明磊落', '布置明堂，聚集阳气'],
    avoid: ['水火相冲，情绪不稳', '过度张扬，树大招风'],
    advice: '丙火为阳，如日中天。此方位阳气充盈但过犹不及，宜收敛锋芒，藏智守拙。',
  },
  {
    id: 'wu',
    name: '午',
    direction: 'south',
    directionLabel: '南',
    trigram: '离',
    trigramChar: '☲',
    element: '火',
    angle: 172.5,
    auspicious: '吉',
    suitable: ['登基受封，名正言顺', '祭祀天地，敬天法祖', '开业剪彩，红红火火', '治病驱邪，阳气克阴'],
    avoid: ['行阴暗之事，天理不容'],
    advice: '午为正南之极，阳气鼎盛。此方位如日当空，正大光明，百事皆宜，鸿运当头。',
  },
  {
    id: 'ding',
    name: '丁',
    direction: 'south',
    directionLabel: '南',
    trigram: '离',
    trigramChar: '☲',
    element: '火',
    angle: 187.5,
    auspicious: '吉',
    suitable: ['结婚拜堂，百年好合', '点灯祈福，光明照路', '修心养性，定慧等持', '社交联谊，贵人相助'],
    avoid: ['阴湿之地，火气受损', '口舌是非，名誉受污'],
    advice: '丁火如灯，温暖而明。此方位柔中带刚，贵人星临，宜广结善缘，必得助力。',
  },

  // ───── 坤卦 ☷ 西南（土）─────
  {
    id: 'wei',
    name: '未',
    direction: 'southwest',
    directionLabel: '西南',
    trigram: '坤',
    trigramChar: '☷',
    element: '土',
    angle: 202.5,
    auspicious: '凶',
    suitable: ['忏悔改过，洗心革面'],
    avoid: ['开仓放粮，库财散尽', '动土修坟，惊扰地灵', '结伙成派，引火烧身'],
    advice: '未为燥土，木气枯竭。此方位气运低迷，易生变故，宜退守自保，不可妄动贪功。',
  },
  {
    id: 'kun',
    name: '坤',
    direction: 'southwest',
    directionLabel: '西南',
    trigram: '坤',
    trigramChar: '☷',
    element: '土',
    angle: 217.5,
    auspicious: '平',
    suitable: ['农耕播种，厚德载物', '养育儿女，母慈子孝', '积德行善，广种福田'],
    avoid: ['冒进投机，易有损耗', '争斗好胜，两败俱伤'],
    advice: '坤为地，厚德载物。此方位沉稳厚重，宜以静制动，修身积德，自有福报降临。',
  },
  {
    id: 'shen',
    name: '申',
    direction: 'southwest',
    directionLabel: '西南',
    trigram: '坤',
    trigramChar: '☷',
    element: '土',
    angle: 232.5,
    auspicious: '平',
    suitable: ['冶金炼石，精雕细琢', '司法诉讼，明辨是非', '健身运动，强健体魄'],
    avoid: ['游泳涉水，金沉水底', '轻信他人，易遭欺骗'],
    advice: '申金生水，变化莫测。此方位气场流转不定，宜随机应变，以智慧化解困厄。',
  },

  // ───── 兑卦 ☱ 正西（金）─────
  {
    id: 'geng',
    name: '庚',
    direction: 'west',
    directionLabel: '西',
    trigram: '兑',
    trigramChar: '☱',
    element: '金',
    angle: 247.5,
    auspicious: '吉',
    suitable: ['锻造利器，精益求精', '决断大事，果断执行', '理财聚财，金玉满堂', '赴任就职，权责加身'],
    avoid: ['优柔寡断，错失良机'],
    advice: '庚金为阳，刚健锐利。此方位得金之正气，利于决断与开拓，果敢前行必有所获。',
  },
  {
    id: 'you',
    name: '酉',
    direction: 'west',
    directionLabel: '西',
    trigram: '兑',
    trigramChar: '☱',
    element: '金',
    angle: 262.5,
    auspicious: '平',
    suitable: ['归家团聚，共享天伦', '品茶论道，怡情养性', '修缮兵器，磨砺锋芒'],
    avoid: ['大兴土木，金土相克', '过度饮酒，伤肝败性'],
    advice: '酉为正西之门，日落之处。此方位气场内敛收束，宜收敛而归藏，养精蓄锐。',
  },
  {
    id: 'xin',
    name: '辛',
    direction: 'west',
    directionLabel: '西',
    trigram: '兑',
    trigramChar: '☱',
    element: '金',
    angle: 277.5,
    auspicious: '凶',
    suitable: ['铸造首饰，精雕细刻'],
    avoid: ['嫁娶成婚，易有离别', '远行西方，路途艰险', '言语不慎，刀光剑影'],
    advice: '辛金为阴，珠宝之金。此方位锋芒内敛却暗藏杀机，宜谨言慎行，远离争端是非。',
  },

  // ───── 乾卦 ☰ 西北（金）─────
  {
    id: 'xu',
    name: '戌',
    direction: 'northwest',
    directionLabel: '西北',
    trigram: '乾',
    trigramChar: '☰',
    element: '金',
    angle: 292.5,
    auspicious: '凶',
    suitable: ['守墓祭祀，慎终追远'],
    avoid: ['开业经商，财运不通', '婚嫁迎娶，易生口角', '动土兴工，劳而无功'],
    advice: '戌为燥土，金气受困。此方位气场滞涩，百事不顺，宜退守不宜进取，静待时变。',
  },
  {
    id: 'qian',
    name: '乾',
    direction: 'northwest',
    directionLabel: '西北',
    trigram: '乾',
    trigramChar: '☰',
    element: '金',
    angle: 307.5,
    auspicious: '吉',
    suitable: ['拜见长者，得授真传', '登高望远，胸怀天下', '建功立业，名利双收', '修身齐家，天道酬勤'],
    avoid: ['骄奢淫逸，盛极必衰'],
    advice: '乾为天，自强不息。此方位得天地之正气，领袖群伦，宜乘势而上，大展宏图。',
  },
  {
    id: 'hai',
    name: '亥',
    direction: 'northwest',
    directionLabel: '西北',
    trigram: '乾',
    trigramChar: '☰',
    element: '金',
    angle: 322.5,
    auspicious: '吉',
    suitable: ['读书悟道，登科及第', '静思冥想，通达玄机', '蓄养牲畜，六畜兴旺', '祈福许愿，心诚则灵'],
    avoid: ['涉水行舟，风浪不平', '过度奢靡，耗费元气'],
    advice: '亥水藏金，智慧之源。此方位文星高照，利于智慧与领悟，专心致志必有所悟。',
  },
];

// ==========================================
// 辅助函数
// ==========================================

/**
 * 根据角度获取对应的山向（最近邻）
 * @param angle - 角度值（0-360）
 * @returns 对应的山向数据
 */
export function getMountainFromAngle(angle: number): Mountain24 {
  // 将角度规范化为 0-360 范围
  const normalized = ((angle % 360) + 360) % 360;

  // 找到角度最近的山向
  let closest = mountains24[0];
  let minDiff = 360;

  for (const mountain of mountains24) {
    const diff = Math.abs(normalized - mountain.angle);
    // 处理跨越 0°/360° 的情况
    const wrapDiff = Math.min(diff, 360 - diff);
    if (wrapDiff < minDiff) {
      minDiff = wrapDiff;
      closest = mountain;
    }
  }

  return closest;
}

/**
 * 根据主方向 key 获取该方向的3个山
 * @param directionKey - 方向键值，如 "north", "northeast" 等
 * @returns 该方向的三个山向数据数组
 */
export function getMountainsByDirection(directionKey: string): Mountain24[] {
  return mountains24.filter((m) => m.direction === directionKey);
}

/**
 * 获取主方向对应的卦名信息
 * @param directionKey - 方向键值，如 "north", "northeast" 等
 * @returns 卦名、卦象字符和五行信息
 */
export function getTrigramForDirection(directionKey: string): {
  trigram: string;
  trigramChar: string;
  element: string;
} {
  const trigramMap: Record<string, { trigram: string; trigramChar: string; element: string }> = {
    north:      { trigram: '坎', trigramChar: '☵', element: '水' },
    northeast:  { trigram: '艮', trigramChar: '☶', element: '土' },
    east:       { trigram: '震', trigramChar: '☳', element: '木' },
    southeast:  { trigram: '巽', trigramChar: '☴', element: '木' },
    south:      { trigram: '离', trigramChar: '☲', element: '火' },
    southwest:  { trigram: '坤', trigramChar: '☷', element: '土' },
    west:       { trigram: '兑', trigramChar: '☱', element: '金' },
    northwest:  { trigram: '乾', trigramChar: '☰', element: '金' },
  };

  const result = trigramMap[directionKey];
  if (!result) {
    throw new Error(`未知方向键值: ${directionKey}`);
  }

  return result;
}
