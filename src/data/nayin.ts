export interface Nayin { name: string; element: string; elementEn: string; description: string; descriptionEn: string; nature: string; natureEn: string; fortune: string; fortuneEn: string; }

export const NAYIN_LIST: Nayin[] = [
  { name: '海中金', element: '金', elementEn: 'Metal', description: '金在海底，深藏不露', descriptionEn: 'Metal in the sea, hidden and unrevealed', nature: '深藏之金，需火炼方能成器', natureEn: 'Deep-hidden metal, needs fire to forge', fortune: '早年平淡，中年后显达', fortuneEn: 'Ordinary early years, distinguished after middle age' },
  { name: '炉中火', element: '火', elementEn: 'Fire', description: '炉火燃烧，温暖光明', descriptionEn: 'Stove fire burning, warm and bright', nature: '炉中之火，需木生方能持久', natureEn: 'Fire in the stove, needs wood to sustain', fortune: '热情奔放，但需控制', fortuneEn: 'Passionate and unrestrained, but needs control' },
  { name: '大林木', element: '木', elementEn: 'Wood', description: '大树林立，茂盛繁荣', descriptionEn: 'Great forest standing, lush and prosperous', nature: '大林之木，需金修剪方能成材', natureEn: 'Great forest wood, needs metal pruning to become useful', fortune: '根基深厚，发展稳健', fortuneEn: 'Deep roots, steady development' },
  { name: '路旁土', element: '土', elementEn: 'Earth', description: '路旁之土，承载万物', descriptionEn: 'Earth by the roadside, bearing all things', nature: '路旁之土，需水滋润方能肥沃', natureEn: 'Roadside earth, needs water to fertilize', fortune: '平稳踏实，但需努力', fortuneEn: 'Steady and solid, but needs effort' },
  { name: '剑锋金', element: '金', elementEn: 'Metal', description: '剑锋锐利，所向披靡', descriptionEn: 'Sword edge sharp, invincible', nature: '剑锋之金，刚猛锐利', natureEn: 'Sword-edge metal, fierce and sharp', fortune: '锋芒毕露，宜收敛', fortuneEn: 'Sharp edge revealed, should be restrained' },
  { name: '山头火', element: '火', elementEn: 'Fire', description: '山头之火，照耀四方', descriptionEn: 'Fire on the mountain, illuminating all directions', nature: '山头之火，需风助方能燎原', natureEn: 'Mountain-top fire, needs wind to spread', fortune: '光明磊落，但需防熄灭', fortuneEn: 'Open and aboveboard, but guard against extinction' },
  { name: '涧下水', element: '水', elementEn: 'Water', description: '涧下之水，清澈流动', descriptionEn: 'Water under the ravine, clear and flowing', nature: '涧下之水，需土堤方能汇聚', natureEn: 'Ravine water, needs earth banks to gather', fortune: '灵活多变，但需方向', fortuneEn: 'Flexible and versatile, but needs direction' },
  { name: '城头土', element: '土', elementEn: 'Earth', description: '城头之土，坚固稳重', descriptionEn: 'Earth on the city wall, solid and steady', nature: '城头之土，需木植方能生机', natureEn: 'City-wall earth, needs wood planting for vitality', fortune: '稳重可靠，但需创新', fortuneEn: 'Reliable and steady, but needs innovation' },
  { name: '白蜡金', element: '金', elementEn: 'Metal', description: '白蜡之金，纯净柔和', descriptionEn: 'White wax metal, pure and soft', nature: '白蜡之金，需火炼方能成器', natureEn: 'White-wax metal, needs fire to forge', fortune: '纯净柔和，但需锻炼', fortuneEn: 'Pure and soft, but needs tempering' },
  { name: '杨柳木', element: '木', elementEn: 'Wood', description: '杨柳依依，柔韧多姿', descriptionEn: 'Willow swaying, flexible and graceful', nature: '杨柳之木，柔韧多姿', natureEn: 'Willow wood, flexible and graceful', fortune: '柔韧有余，但需坚韧', fortuneEn: 'Flexible enough, but needs toughness' },
  { name: '泉中水', element: '水', elementEn: 'Water', description: '泉中之水，源源不断', descriptionEn: 'Water in the spring, continuously flowing', nature: '泉中之水，清澈甘甜', natureEn: 'Spring water, clear and sweet', fortune: '源源不断，但需汇聚', fortuneEn: 'Continuous flow, but needs gathering' },
  { name: '屋上土', element: '土', elementEn: 'Earth', description: '屋上之土，庇护众生', descriptionEn: 'Earth on the roof, sheltering all beings', nature: '屋上之土，需木支撑方能稳固', natureEn: 'Roof earth, needs wood support to be stable', fortune: '庇护他人，但需根基', fortuneEn: 'Sheltering others, but needs foundation' },
  { name: '霹雳火', element: '火', elementEn: 'Fire', description: '霹雳之火，迅猛激烈', descriptionEn: 'Thunder fire, swift and fierce', nature: '霹雳之火，迅猛激烈', natureEn: 'Thunder fire, swift and fierce', fortune: '迅猛激烈，但需控制', fortuneEn: 'Swift and fierce, but needs control' },
  { name: '松柏木', element: '木', elementEn: 'Wood', description: '松柏之木，坚韧不拔', descriptionEn: 'Pine and cypress wood, tenacious and unyielding', nature: '松柏之木，岁寒不凋', natureEn: 'Pine-cypress wood, never withers in cold', fortune: '坚韧不拔，长寿安康', fortuneEn: 'Tenacious and unyielding, long life and health' },
  { name: '长流水', element: '水', elementEn: 'Water', description: '长流之水，绵延不绝', descriptionEn: 'Long-flowing water, continuous and unending', nature: '长流之水，源远流长', natureEn: 'Long-flowing water, far-reaching source', fortune: '源远流长，但需汇聚', fortuneEn: 'Far-reaching source, but needs gathering' },
  { name: '沙中金', element: '金', elementEn: 'Metal', description: '沙中之金，需淘洗方显', descriptionEn: 'Metal in the sand, needs washing to reveal', nature: '沙中之金，需淘洗方显', natureEn: 'Sand metal, needs washing to reveal', fortune: '需经磨练，方能显达', fortuneEn: 'Needs tempering to become distinguished' },
  { name: '山下火', element: '火', elementEn: 'Fire', description: '山下之火，温暖内敛', descriptionEn: 'Fire under the mountain, warm and restrained', nature: '山下之火，温暖内敛', natureEn: 'Mountain-base fire, warm and restrained', fortune: '温暖内敛，但需光明', fortuneEn: 'Warm and restrained, but needs light' },
  { name: '平地木', element: '木', elementEn: 'Wood', description: '平地之木，平凡中见不凡', descriptionEn: 'Wood on flat ground, extraordinary in the ordinary', nature: '平地之木，需阳光雨露', natureEn: 'Flat-ground wood, needs sun and rain', fortune: '平凡中见不凡，但需机遇', fortuneEn: 'Extraordinary in the ordinary, but needs opportunity' },
  { name: '壁上土', element: '土', elementEn: 'Earth', description: '壁上之土，依附坚固', descriptionEn: 'Earth on the wall, attached and solid', nature: '壁上之土，需依附方能稳固', natureEn: 'Wall earth, needs attachment to be stable', fortune: '依附他人，但需自立', fortuneEn: 'Attached to others, but needs independence' },
  { name: '金箔金', element: '金', elementEn: 'Metal', description: '金箔之金，华丽轻薄', descriptionEn: 'Gold foil metal, gorgeous and thin', nature: '金箔之金，华丽但需保护', natureEn: 'Gold-foil metal, gorgeous but needs protection', fortune: '华丽外表，但需内涵', fortuneEn: 'Gorgeous appearance, but needs substance' },
  { name: '佛灯火', element: '火', elementEn: 'Fire', description: '佛灯之火，光明智慧', descriptionEn: 'Buddha lamp fire, bright and wise', nature: '佛灯之火，智慧光明', natureEn: 'Buddha-lamp fire, wisdom and light', fortune: '智慧光明，但需守护', fortuneEn: 'Wisdom and light, but needs guarding' },
  { name: '天河水', element: '水', elementEn: 'Water', description: '天河之水，浩瀚无边', descriptionEn: 'Milky Way water, vast and boundless', nature: '天河之水，浩瀚无边', natureEn: 'Milky Way water, vast and boundless', fortune: '浩瀚无边，但需节制', fortuneEn: 'Vast and boundless, but needs moderation' },
  { name: '大驿土', element: '土', elementEn: 'Earth', description: '大驿之土，通达四方', descriptionEn: 'Great post-station earth, reaching all directions', nature: '大驿之土，通达四方', natureEn: 'Post-station earth, reaching all directions', fortune: '通达四方，但需根基', fortuneEn: 'Reaching all directions, but needs foundation' },
  { name: '钗钏金', element: '金', elementEn: 'Metal', description: '钗钏之金，精致华美', descriptionEn: 'Hairpin and bracelet metal, exquisite and gorgeous', nature: '钗钏之金，精致华美', natureEn: 'Hairpin-bracelet metal, exquisite and gorgeous', fortune: '精致华美，但需实用', fortuneEn: 'Exquisite and gorgeous, but needs practicality' },
  { name: '桑柘木', element: '木', elementEn: 'Wood', description: '桑柘之木，实用坚韧', descriptionEn: 'Mulberry and catalpa wood, practical and tough', nature: '桑柘之木，实用坚韧', natureEn: 'Mulberry-catalpa wood, practical and tough', fortune: '实用坚韧，但需灵活', fortuneEn: 'Practical and tough, but needs flexibility' },
  { name: '大溪水', element: '水', elementEn: 'Water', description: '大溪之水，奔流不息', descriptionEn: 'Great stream water, rushing and unceasing', nature: '大溪之水，奔流不息', natureEn: 'Great-stream water, rushing and unceasing', fortune: '奔流不息，但需方向', fortuneEn: 'Rushing and unceasing, but needs direction' },
  { name: '沙中土', element: '土', elementEn: 'Earth', description: '沙中之土，松散不稳', descriptionEn: 'Earth in the sand, loose and unstable', nature: '沙中之土，需凝聚方能稳固', natureEn: 'Sand earth, needs cohesion to be stable', fortune: '松散不稳，但需凝聚', fortuneEn: 'Loose and unstable, but needs cohesion' },
  { name: '天上火', element: '火', elementEn: 'Fire', description: '天上之火，光明普照', descriptionEn: 'Fire in the sky, illuminating all', nature: '天上之火，光明普照', natureEn: 'Sky fire, illuminating all', fortune: '光明普照，但需谦逊', fortuneEn: 'Illuminating all, but needs humility' },
  { name: '石榴木', element: '木', elementEn: 'Wood', description: '石榴之木，硕果累累', descriptionEn: 'Pomegranate wood, abundant fruit', nature: '石榴之木，硕果累累', natureEn: 'Pomegranate wood, abundant fruit', fortune: '硕果累累，但需分享', fortuneEn: 'Abundant fruit, but needs sharing' },
  { name: '大海水', element: '水', elementEn: 'Water', description: '大海之水，浩瀚深邃', descriptionEn: 'Great sea water, vast and profound', nature: '大海之水，浩瀚深邃', natureEn: 'Great-sea water, vast and profound', fortune: '浩瀚深邃，但需节制', fortuneEn: 'Vast and profound, but needs moderation' },
];

export const NAYIN_MAP: Record<string, Nayin> = Object.fromEntries(NAYIN_LIST.map(n => [n.name, n]));

export function getNayin(name: string): Nayin | undefined { return NAYIN_MAP[name]; }
export function getNayinByElement(element: string): Nayin[] { return NAYIN_LIST.filter(n => n.element === element); }

export const NAYIN_CYCLE: string[] = [
  '海中金','炉中火','大林木','路旁土','剑锋金','山头火',
  '涧下水','城头土','白蜡金','杨柳木','泉中水','屋上土',
  '霹雳火','松柏木','长流水','沙中金','山下火','平地木',
  '壁上土','金箔金','佛灯火','天河水','大驿土','钗钏金',
  '桑柘木','大溪水','沙中土','天上火','石榴木','大海水',
];

export function getNayinByGanzhiIndex(index: number): Nayin | undefined {
  return NAYIN_LIST[index % 30];
}
