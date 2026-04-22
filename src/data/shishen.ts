import type { Wuxing } from './wuxing';

export type ShishenName = '比肩' | '劫财' | '食神' | '伤官' | '正财' | '偏财' | '正官' | '七杀' | '正印' | '偏印';

export interface Shishen { name: ShishenName; nameEn: string; nameEnShort: string; relation: string; relationEn: string; elementLogic: string; yinYangPattern: string; meaning: string; meaningEn: string; lifeArea: string; lifeAreaEn: string; positive: string[]; positiveEn: string[]; negative: string[]; negativeEn: string[]; inYear: string; inMonth: string; inDay: string; inHour: string; icon: string; color: string; }

export const SHISHEN_LIST: Shishen[] = [
  { name: '比肩', nameEn: 'Friend', nameEnShort: 'Friend', relation: '同我且阴阳相同', relationEn: 'Same element, same yin-yang', elementLogic: '与我同五行、同阴阳', yinYangPattern: '阳见阳，阴见阴', meaning: '自我、独立、竞争、兄弟朋友', meaningEn: 'Self, independence, competition', lifeArea: '兄弟朋友、自我意识', lifeAreaEn: 'Siblings, self-identity', positive: ['独立自主','重情义','有主见','自尊心强'], positiveEn: ['Independent','Loyal','Decisive','Self-respecting'], negative: ['固执己见','刚愎自用','争强好胜','孤僻'], negativeEn: ['Stubborn','Arrogant','Overly competitive','Aloof'], inYear: '祖上有产业，少年得兄弟之助', inMonth: '兄弟姐妹多，青年竞争激烈', inDay: '夫妻同心，配偶独立有主见', inHour: '子女独立，晚年有依靠', icon: '👥', color: '#c8a45c' },
  { name: '劫财', nameEn: 'Competitor', nameEnShort: 'Competitor', relation: '同我且阴阳不同', relationEn: 'Same element, opposite yin-yang', elementLogic: '与我同五行、异阴阳', yinYangPattern: '阳见阴，阴见阳', meaning: '竞争、争夺、冒险、投机', meaningEn: 'Competition, rivalry, adventure', lifeArea: '竞争、破财、冒险', lifeAreaEn: 'Rivalry, financial loss, risk', positive: ['行动力强','敢于冒险','有魄力','适应力佳'], positiveEn: ['Action-oriented','Risk-taking','Bold','Adaptable'], negative: ['冲动鲁莽','破财','好赌','易与人争执'], negativeEn: ['Impulsive','Financial loss','Gambling','Argumentative'], inYear: '祖业易散，少年多变动', inMonth: '青年竞争激烈，财来财去', inDay: '配偶个性强，夫妻关系需磨合', inHour: '子女有主见，晚年注意财务', icon: '⚔️', color: '#F87171' },
  { name: '食神', nameEn: 'Output', nameEnShort: 'Output', relation: '我生且阴阳相同', relationEn: 'I generate, same yin-yang', elementLogic: '我所生之五行、同阴阳', yinYangPattern: '阳生阳，阴生阴', meaning: '才华、享受、福气、温和', meaningEn: 'Talent, enjoyment, blessing', lifeArea: '才华、享受、福气', lifeAreaEn: 'Talent, pleasure, blessing', positive: ['才华横溢','温和善良','懂得享受','口福好'], positiveEn: ['Talented','Kind','Enjoys life','Good appetite'], negative: ['懒散','贪图安逸','缺乏进取心','多愁善感'], negativeEn: ['Lazy','Indulgent','Lacks ambition','Sentimental'], inYear: '祖上有福，少年生活优渥', inMonth: '青年才华显露，适合创意工作', inDay: '配偶温和，婚姻美满', inHour: '子女有才华，晚年享福', icon: '🍵', color: '#4ADE80' },
  { name: '伤官', nameEn: 'Rebellion', nameEnShort: 'Rebellion', relation: '我生且阴阳不同', relationEn: 'I generate, opposite yin-yang', elementLogic: '我所生之五行、异阴阳', yinYangPattern: '阳生阴，阴生阳', meaning: '才华、叛逆、创新、口才', meaningEn: 'Talent, rebellion, innovation', lifeArea: '才华、创新、叛逆', lifeAreaEn: 'Talent, innovation, rebellion', positive: ['聪明绝顶','创意无限','口才出众','敢于挑战'], positiveEn: ['Brilliant','Creative','Eloquent','Challenger'], negative: ['叛逆不羁','口舌是非','目中无人','不守规矩'], negativeEn: ['Rebellious','Gossipy','Arrogant','Rule-breaking'], inYear: '祖上可能有文人，少年聪明', inMonth: '青年才华出众但易与上级冲突', inDay: '配偶个性强，婚姻需包容', inHour: '子女聪明叛逆，晚年注意沟通', icon: '⚡', color: '#F87171' },
  { name: '正财', nameEn: 'Proper Wealth', nameEnShort: 'Proper Wealth', relation: '我克且阴阳不同', relationEn: 'I overcome, opposite yin-yang', elementLogic: '我所克之五行、异阴阳', yinYangPattern: '阳克阴，阴克阳', meaning: '正当财富、稳定收入、务实', meaningEn: 'Proper wealth, stable income', lifeArea: '财富、妻子、稳定收入', lifeAreaEn: 'Wealth, spouse, stable income', positive: ['勤俭持家','务实稳重','理财有方','重视家庭'], positiveEn: ['Frugal','Practical','Good with money','Family-oriented'], negative: ['吝啬','过于保守','缺乏冒险精神','计较'], negativeEn: ['Stingy','Conservative','Risk-averse','Calculating'], inYear: '祖上有财，少年家境不错', inMonth: '青年财运稳定，适合正当职业', inDay: '配偶贤惠，婚姻稳定', inHour: '子女务实，晚年财务稳定', icon: '💰', color: '#FBBF24' },
  { name: '偏财', nameEn: 'Unexpected Wealth', nameEnShort: 'Unexpected Wealth', relation: '我克且阴阳相同', relationEn: 'I overcome, same yin-yang', elementLogic: '我所克之五行、同阴阳', yinYangPattern: '阳克阳，阴克阴', meaning: '意外之财、投机、商业头脑', meaningEn: 'Unexpected wealth, speculation', lifeArea: '偏财、父亲、社交', lifeAreaEn: 'Side income, father, social life', positive: ['慷慨大方','社交能力强','善于理财','有商业头脑'], positiveEn: ['Generous','Sociable','Financially savvy','Business-minded'], negative: ['挥霍','投机取巧','感情不专','好面子'], negativeEn: ['Wasteful','Speculative','Unfaithful','Face-conscious'], inYear: '祖上可能有经商传统，少年多变', inMonth: '青年财运起伏，适合商业投资', inDay: '配偶大方，但需注意感情稳定', inHour: '子女有商业头脑，晚年注意理财', icon: '💎', color: '#c8a45c' },
  { name: '正官', nameEn: 'Authority', nameEnShort: 'Authority', relation: '克我且阴阳不同', relationEn: 'Overcomes me, opposite yin-yang', elementLogic: '克我之五行、异阴阳', yinYangPattern: '阴克阳，阳克阴', meaning: '权威、规矩、事业、责任感', meaningEn: 'Authority, rules, career, responsibility', lifeArea: '事业、官职、丈夫', lifeAreaEn: 'Career, position, spouse', positive: ['正直守信','有责任心','遵纪守法','事业心强'], positiveEn: ['Honest','Responsible','Law-abiding','Ambitious'], negative: ['过于保守','压力大','墨守成规','懦弱'], negativeEn: ['Conservative','Stressed','Rigid','Timid'], inYear: '祖上有官贵，少年受良好教育', inMonth: '青年事业顺利，适合公职', inDay: '配偶正直可靠，婚姻稳定', inHour: '子女有出息，晚年受人尊敬', icon: '👑', color: '#E5E7EB' },
  { name: '七杀', nameEn: 'Challenger', nameEnShort: 'Challenger', relation: '克我且阴阳相同', relationEn: 'Overcomes me, same yin-yang', elementLogic: '克我之五行、同阴阳', yinYangPattern: '阳克阳，阴克阴', meaning: '压力、挑战、权威、魄力', meaningEn: 'Pressure, challenge, boldness', lifeArea: '压力、挑战、小人', lifeAreaEn: 'Pressure, challenge, adversaries', positive: ['魄力十足','敢于挑战','有领导力','危机处理强'], positiveEn: ['Bold','Challenging','Leadership','Crisis management'], negative: ['压力大','易遇小人','冲动','意外风险'], negativeEn: ['Stressed','Adversaries','Impulsive','Accident-prone'], inYear: '祖上可能有武职，少年多挑战', inMonth: '青年压力大，但锻炼出魄力', inDay: '配偶强势，需注意沟通', inHour: '子女独立有主见，晚年注意健康', icon: '🗡️', color: '#991b1b' },
  { name: '正印', nameEn: 'Nurturer', nameEnShort: 'Nurturer', relation: '生我且阴阳不同', relationEn: 'Generates me, opposite yin-yang', elementLogic: '生我之五行、异阴阳', yinYangPattern: '阴生阳，阳生阴', meaning: '学识、母亲、贵人、庇护', meaningEn: 'Knowledge, mother, benefactors', lifeArea: '学识、母亲、贵人', lifeAreaEn: 'Knowledge, mother, benefactors', positive: ['学识渊博','慈悲为怀','有贵人相助','重视教育'], positiveEn: ['Learned','Compassionate','Benefactors','Education-focused'], negative: ['依赖性强','懒惰','空想','过于理想化'], negativeEn: ['Dependent','Lazy','Dreamy','Idealistic'], inYear: '祖上有文化，少年得母亲庇护', inMonth: '青年学业顺利，有贵人提携', inDay: '配偶善良有文化，婚姻温馨', inHour: '子女有学识，晚年受人照顾', icon: '📖', color: '#60A5FA' },
  { name: '偏印', nameEn: 'Eccentric', nameEnShort: 'Eccentric', relation: '生我且阴阳相同', relationEn: 'Generates me, same yin-yang', elementLogic: '生我之五行、同阴阳', yinYangPattern: '阳生阳，阴生阴', meaning: '偏门学识、孤独、独创性', meaningEn: 'Niche knowledge, solitude, originality', lifeArea: '偏门学识、孤独、玄学', lifeAreaEn: 'Niche knowledge, solitude, metaphysics', positive: ['思维独特','有玄学天赋','独创性强','洞察力强'], positiveEn: ['Unique thinker','Metaphysical talent','Original','Insightful'], negative: ['孤独','多疑','偏执','不合群'], negativeEn: ['Lonely','Suspicious','Paranoid','Aloof'], inYear: '祖上可能有偏门技艺，少年孤独', inMonth: '青年思维独特，适合研究性工作', inDay: '配偶独特有个性，婚姻需理解', inHour: '子女有天赋，晚年注意精神生活', icon: '🔮', color: '#7c3aed' },
];

const TG_ELEMENT: Record<string, string> = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
const TG_YINYANG: Record<string, string> = { '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳', '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴' };
const WX_SHENG: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
const WX_KE: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };

export function calculateShishen(dayMaster: string, target: string): ShishenName {
  const dmEl = TG_ELEMENT[dayMaster], dmYy = TG_YINYANG[dayMaster], tgEl = TG_ELEMENT[target], tgYy = TG_YINYANG[target];
  if (!dmEl || !tgEl) return '比肩';
  if (dmEl === tgEl) return dmYy === tgYy ? '比肩' : '劫财';
  if (WX_SHENG[dmEl] === tgEl) return dmYy === tgYy ? '食神' : '伤官';
  if (WX_KE[dmEl] === tgEl) return dmYy === tgYy ? '偏财' : '正财';
  if (WX_KE[tgEl] === dmEl) return dmYy === tgYy ? '七杀' : '正官';
  if (WX_SHENG[tgEl] === dmEl) return dmYy === tgYy ? '偏印' : '正印';
  return '比肩';
}

export function getShishen(name: ShishenName): Shishen | undefined { return SHISHEN_LIST.find(s => s.name === name); }

export function getShishenElement(shishen: ShishenName, dayMasterElement: Wuxing): Wuxing {
  const shengMap: Record<Wuxing, Wuxing> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
  const keMap: Record<Wuxing, Wuxing> = { wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' };
  const beiShengMap: Record<Wuxing, Wuxing> = { wood: 'water', fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal' };
  switch (shishen) {
    case '比肩': case '劫财': return dayMasterElement;
    case '食神': case '伤官': return shengMap[dayMasterElement];
    case '正财': case '偏财': return keMap[dayMasterElement];
    case '正官': case '七杀': return beiShengMap[dayMasterElement];
    case '正印': case '偏印': return beiShengMap[dayMasterElement];
    default: return dayMasterElement;
  }
}
