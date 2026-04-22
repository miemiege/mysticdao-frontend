// ═══════════════════════════════════════════════════════════════
//  调候系统 — 源自《穷通宝鉴》（栏江网）
//  核心思想：「调候为急」— 五行需配合季节气候
// ═══════════════════════════════════════════════════════════════

export interface Tiaohou {
  dayMaster: string;
  monthBranch: string;
  season: string;
  condition: string;
  conditionEn: string;
  needs: string[];
  needsEn: string[];
  likes: string[];
  likesEn: string[];
  dislikes: string[];
  dislikesEn: string[];
  meaning: string;
  meaningEn: string;
  classicQuote: string;
}

export const TIAOHOU_LIST: Tiaohou[] = [
  {
    dayMaster: '甲', monthBranch: '寅', season: '春',
    condition: '初春余寒未尽', conditionEn: 'Early spring, residual cold',
    needs: ['丙火', '癸水'], needsEn: ['Bing Fire', 'Gui Water'],
    likes: ['火来暖局', '水来生木'], likesEn: ['Fire to warm', 'Water to nourish wood'],
    dislikes: ['金多克木', '土重埋木'], dislikesEn: ['Much metal cutting wood', 'Heavy earth burying wood'],
    meaning: '甲木参天，脱胎要火。春木初生，需丙火暖局，癸水滋润。',
    meaningEn: 'Jia Wood reaching sky needs fire to be born. Spring wood needs warmth and moisture.',
    classicQuote: '「甲木参天，脱胎要火。春不容金，秋不容土。」——《穷通宝鉴》',
  },
  {
    dayMaster: '甲', monthBranch: '卯', season: '春',
    condition: '仲春木旺', conditionEn: 'Mid-spring, wood prosperous',
    needs: ['庚金', '丁火'], needsEn: ['Geng Metal', 'Ding Fire'],
    likes: ['金来修剪', '火来泄秀'], likesEn: ['Metal to trim', 'Fire to express'],
    dislikes: ['水多木漂', '土重'], dislikesEn: ['Much water floating wood', 'Heavy earth'],
    meaning: '春木茂盛，需庚金修剪成器，丁火泄其秀气。',
    meaningEn: 'Spring wood lush, needs metal trimming and fire expression.',
    classicQuote: '「阳木气刚，得金为栋梁。」——《穷通宝鉴》',
  },
  {
    dayMaster: '甲', monthBranch: '辰', season: '春',
    condition: '季春土旺', conditionEn: 'Late spring, earth prosperous',
    needs: ['庚金', '壬水'], needsEn: ['Geng Metal', 'Ren Water'],
    likes: ['金来疏土', '水来滋润'], likesEn: ['Metal to loosen earth', 'Water to moisten'],
    dislikes: ['土重埋木', '火多'], dislikesEn: ['Heavy earth burying wood', 'Much fire'],
    meaning: '季春土旺，甲木需庚金疏土，壬水滋润。',
    meaningEn: 'Late spring earth strong, wood needs metal and water.',
    classicQuote: '「三月甲木，木气相竭，先取庚金，次取壬水。」——《穷通宝鉴》',
  },
  {
    dayMaster: '乙', monthBranch: '寅', season: '春',
    condition: '初春余寒', conditionEn: 'Early spring, residual cold',
    needs: ['丙火', '癸水'], needsEn: ['Bing Fire', 'Gui Water'],
    likes: ['火来暖局', '水来滋润'], likesEn: ['Fire to warm', 'Water to nourish'],
    dislikes: ['金多', '土重'], dislikesEn: ['Much metal', 'Heavy earth'],
    meaning: '乙木为花草，初春需丙火暖局，癸水滋润。',
    meaningEn: 'Yi Wood as flowers needs warmth and moisture in early spring.',
    classicQuote: '「乙木虽柔，刲羊解牛。」——《滴天髓》',
  },
  {
    dayMaster: '乙', monthBranch: '卯', season: '春',
    condition: '仲春木旺', conditionEn: 'Mid-spring, wood prosperous',
    needs: ['癸水', '丙火'], needsEn: ['Gui Water', 'Bing Fire'],
    likes: ['水来滋润', '火来泄秀'], likesEn: ['Water to nourish', 'Fire to express'],
    dislikes: ['金多', '土重'], dislikesEn: ['Much metal', 'Heavy earth'],
    meaning: '春木茂盛，需癸水滋润，丙火泄秀。',
    meaningEn: 'Spring wood lush, needs water and fire.',
    classicQuote: '「春木旺而火相，不可缺癸。」——《穷通宝鉴》',
  },
  {
    dayMaster: '丙', monthBranch: '巳', season: '夏',
    condition: '初夏火渐旺', conditionEn: 'Early summer, fire growing',
    needs: ['壬水', '庚金'], needsEn: ['Ren Water', 'Geng Metal'],
    likes: ['水来既济', '金来生水'], likesEn: ['Water to balance', 'Metal to generate water'],
    dislikes: ['木多火炽', '土重'], dislikesEn: ['Much wood intensifying fire', 'Heavy earth'],
    meaning: '丙火为太阳，初夏渐旺，需壬水既济，庚金生水。',
    meaningEn: 'Bing Fire as sun growing strong, needs water balance.',
    classicQuote: '「丙火猛烈，欺霜侮雪。能煅庚金，逢辛反怯。」——《滴天髓》',
  },
  {
    dayMaster: '丙', monthBranch: '午', season: '夏',
    condition: '仲夏火旺至极', conditionEn: 'Mid-summer, fire at peak',
    needs: ['壬水', '癸水'], needsEn: ['Ren Water', 'Gui Water'],
    likes: ['水来调候', '金来生水'], likesEn: ['Water to regulate', 'Metal to generate water'],
    dislikes: ['木多火炽', '土重晦火'], dislikesEn: ['Much wood', 'Heavy earth dimming fire'],
    meaning: '夏火炎上，需壬水调候，否则火炎土燥。',
    meaningEn: 'Summer fire blazing, needs water regulation.',
    classicQuote: '「五月丙火，炎威莫当，专用壬水。」——《穷通宝鉴》',
  },
  {
    dayMaster: '丙', monthBranch: '未', season: '夏',
    condition: '季夏土燥', conditionEn: 'Late summer, earth dry',
    needs: ['壬水', '庚金'], needsEn: ['Ren Water', 'Geng Metal'],
    likes: ['水来调候', '金来生水'], likesEn: ['Water to regulate', 'Metal to generate water'],
    dislikes: ['土重晦火', '木多'], dislikesEn: ['Heavy earth', 'Much wood'],
    meaning: '季夏土燥，丙火需壬水调候，庚金生水。',
    meaningEn: 'Late summer dry earth, fire needs water regulation.',
    classicQuote: '「六月丙火，退气之位，先壬后庚。」——《穷通宝鉴》',
  },
  {
    dayMaster: '丁', monthBranch: '巳', season: '夏',
    condition: '初夏', conditionEn: 'Early summer',
    needs: ['甲木', '庚金'], needsEn: ['Jia Wood', 'Geng Metal'],
    likes: ['木来生火', '金来生水'], likesEn: ['Wood to generate fire', 'Metal to generate water'],
    dislikes: ['水多火灭', '土重'], dislikesEn: ['Much water extinguishing fire', 'Heavy earth'],
    meaning: '丁火为灯烛，需甲木为薪，庚金劈甲引丁。',
    meaningEn: 'Ding Fire as candle needs wood as fuel.',
    classicQuote: '「丁火柔中，内性昭融。抱乙而孝，合壬而忠。」——《滴天髓》',
  },
  {
    dayMaster: '丁', monthBranch: '午', season: '夏',
    condition: '仲夏火旺', conditionEn: 'Mid-summer, fire strong',
    needs: ['壬水', '癸水'], needsEn: ['Ren Water', 'Gui Water'],
    likes: ['水来调候', '金来生水'], likesEn: ['Water to regulate', 'Metal to generate water'],
    dislikes: ['木多火炽', '土重'], dislikesEn: ['Much wood', 'Heavy earth'],
    meaning: '夏火炎上，丁火需水调候，否则灯烛易灭。',
    meaningEn: 'Summer fire blazing, Ding needs water regulation.',
    classicQuote: '「五月丁火，炎上之极，先壬次甲。」——《穷通宝鉴》',
  },
  {
    dayMaster: '戊', monthBranch: '辰', season: '春',
    condition: '季春土虚', conditionEn: 'Late spring, earth weak',
    needs: ['丙火', '甲木'], needsEn: ['Bing Fire', 'Jia Wood'],
    likes: ['火来生土', '木来疏土'], likesEn: ['Fire to generate earth', 'Wood to loosen earth'],
    dislikes: ['水多土流', '金多'], dislikesEn: ['Much water dissolving earth', 'Much metal'],
    meaning: '春土虚薄，需丙火暖局，甲木疏土。',
    meaningEn: 'Spring earth thin, needs fire and wood.',
    classicQuote: '「戊土固重，既中且正。静翕动辟，万物司命。」——《滴天髓》',
  },
  {
    dayMaster: '戊', monthBranch: '巳', season: '夏',
    condition: '初夏土燥', conditionEn: 'Early summer, earth dry',
    needs: ['癸水', '甲木'], needsEn: ['Gui Water', 'Jia Wood'],
    likes: ['水来滋润', '木来疏土'], likesEn: ['Water to moisten', 'Wood to loosen'],
    dislikes: ['火多土焦', '金多'], dislikesEn: ['Much fire scorching earth', 'Much metal'],
    meaning: '夏土干燥，需癸水滋润，甲木疏土。',
    meaningEn: 'Summer earth dry, needs water and wood.',
    classicQuote: '「四月戊土，阳气发外，燥寒内凝，先癸后丙。」——《穷通宝鉴》',
  },
  {
    dayMaster: '戊', monthBranch: '午', season: '夏',
    condition: '仲夏土燥至极', conditionEn: 'Mid-summer, earth extremely dry',
    needs: ['壬水', '癸水'], needsEn: ['Ren Water', 'Gui Water'],
    likes: ['水来调候', '金来生水'], likesEn: ['Water to regulate', 'Metal to generate water'],
    dislikes: ['火多土焦', '木多'], dislikesEn: ['Much fire', 'Much wood'],
    meaning: '夏土焦燥，需壬水调候，否则万物不生。',
    meaningEn: 'Summer earth scorched, needs water regulation.',
    classicQuote: '「五月戊土，仲夏火炎，专用壬水。」——《穷通宝鉴》',
  },
  {
    dayMaster: '庚', monthBranch: '申', season: '秋',
    condition: '初秋金旺', conditionEn: 'Early autumn, metal prosperous',
    needs: ['丁火', '甲木'], needsEn: ['Ding Fire', 'Jia Wood'],
    likes: ['火来炼金', '木来生火'], likesEn: ['Fire to refine metal', 'Wood to generate fire'],
    dislikes: ['水多金沉', '土重埋金'], dislikesEn: ['Much water sinking metal', 'Heavy earth burying metal'],
    meaning: '秋金刚健，需丁火炼金成器，甲木生火。',
    meaningEn: 'Autumn metal strong, needs fire to refine into tool.',
    classicQuote: '「庚金带煞，刚健为最。得水而清，得火而锐。」——《滴天髓》',
  },
  {
    dayMaster: '庚', monthBranch: '酉', season: '秋',
    condition: '仲秋金旺至极', conditionEn: 'Mid-autumn, metal at peak',
    needs: ['丁火', '甲木'], needsEn: ['Ding Fire', 'Jia Wood'],
    likes: ['火来炼金', '木来生火'], likesEn: ['Fire to refine', 'Wood to generate fire'],
    dislikes: ['水多金沉', '土重'], dislikesEn: ['Much water', 'Heavy earth'],
    meaning: '酉月金旺，需丁火炼金，甲木为薪。',
    meaningEn: 'You month metal strong, needs fire and wood.',
    classicQuote: '「八月庚金，刚锐未退，专用丁火，次取甲木。」——《穷通宝鉴》',
  },
  {
    dayMaster: '辛', monthBranch: '申', season: '秋',
    condition: '初秋', conditionEn: 'Early autumn',
    needs: ['壬水', '甲木'], needsEn: ['Ren Water', 'Jia Wood'],
    likes: ['水来淘洗', '木来疏土'], likesEn: ['Water to wash', 'Wood to loosen earth'],
    dislikes: ['土重埋金', '火多'], dislikesEn: ['Heavy earth', 'Much fire'],
    meaning: '辛金为珠玉，需壬水淘洗，甲木疏土。',
    meaningEn: 'Xin Metal as jewel needs water to wash clean.',
    classicQuote: '「辛金软弱，温润而清。畏土之叠，乐水之盈。」——《滴天髓》',
  },
  {
    dayMaster: '辛', monthBranch: '酉', season: '秋',
    condition: '仲秋', conditionEn: 'Mid-autumn',
    needs: ['壬水', '丁火'], needsEn: ['Ren Water', 'Ding Fire'],
    likes: ['水来淘洗', '火来炼金'], likesEn: ['Water to wash', 'Fire to refine'],
    dislikes: ['土重', '火多'], dislikesEn: ['Heavy earth', 'Much fire'],
    meaning: '酉月辛金，需壬水淘洗，丁火温养。',
    meaningEn: 'You month Xin Metal needs water and fire.',
    classicQuote: '「八月辛金，当权得令，专用壬水淘洗。」——《穷通宝鉴》',
  },
  {
    dayMaster: '壬', monthBranch: '亥', season: '冬',
    condition: '初冬水旺', conditionEn: 'Early winter, water prosperous',
    needs: ['丙火', '戊土'], needsEn: ['Bing Fire', 'Wu Earth'],
    likes: ['火来暖局', '土来止水'], likesEn: ['Fire to warm', 'Earth to stop water'],
    dislikes: ['水多泛滥', '金多'], dislikesEn: ['Much water flooding', 'Much metal'],
    meaning: '冬水寒冷，需丙火暖局，戊土堤防。',
    meaningEn: 'Winter water cold, needs fire to warm and earth to dam.',
    classicQuote: '「壬水通河，能泄金气。刚中之德，周流不滞。」——《滴天髓》',
  },
  {
    dayMaster: '壬', monthBranch: '子', season: '冬',
    condition: '仲冬水旺至极', conditionEn: 'Mid-winter, water at peak',
    needs: ['丙火', '戊土'], needsEn: ['Bing Fire', 'Wu Earth'],
    likes: ['火来调候', '土来止水'], likesEn: ['Fire to regulate', 'Earth to stop water'],
    dislikes: ['水多泛滥', '金多水浊'], dislikesEn: ['Much water flooding', 'Much metal muddying water'],
    meaning: '子月水旺，需丙火调候，戊土为堤。',
    meaningEn: 'Zi month water strong, needs fire and earth.',
    classicQuote: '「十一月壬水，阳刃司令，专用丙火。」——《穷通宝鉴》',
  },
  {
    dayMaster: '癸', monthBranch: '亥', season: '冬',
    condition: '初冬', conditionEn: 'Early winter',
    needs: ['丙火', '辛金'], needsEn: ['Bing Fire', 'Xin Metal'],
    likes: ['火来暖局', '金来生水'], likesEn: ['Fire to warm', 'Metal to generate water'],
    dislikes: ['水多', '土重'], dislikesEn: ['Much water', 'Heavy earth'],
    meaning: '冬水寒冷，癸水需丙火暖局，辛金发源。',
    meaningEn: 'Winter water cold, Gui needs fire and metal.',
    classicQuote: '「癸水至弱，达于天津。得龙而运，功化斯神。」——《滴天髓》',
  },
  {
    dayMaster: '癸', monthBranch: '子', season: '冬',
    condition: '仲冬', conditionEn: 'Mid-winter',
    needs: ['丙火', '辛金'], needsEn: ['Bing Fire', 'Xin Metal'],
    likes: ['火来调候', '金来生水'], likesEn: ['Fire to regulate', 'Metal to generate water'],
    dislikes: ['水多', '土重'], dislikesEn: ['Much water', 'Heavy earth'],
    meaning: '子月癸水，需丙火调候，辛金发源。',
    meaningEn: 'Zi month Gui Water needs fire and metal.',
    classicQuote: '「十一月癸水，冰冻寒凝，专用丙火解冻。」——《穷通宝鉴》',
  },
];

export function getTiaohou(dayMaster: string, monthBranch: string): Tiaohou | undefined {
  return TIAOHOU_LIST.find(t => t.dayMaster === dayMaster && t.monthBranch === monthBranch);
}

export function getTiaohouBySeason(season: string): Tiaohou[] {
  return TIAOHOU_LIST.filter(t => t.season === season);
}

export function getTiaohouByDayMaster(dayMaster: string): Tiaohou[] {
  return TIAOHOU_LIST.filter(t => t.dayMaster === dayMaster);
}
