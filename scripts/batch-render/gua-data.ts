/**
 * 64卦完整数据（补充 src/data/gua64.ts 缺失条目）
 * 数据源自 King Wen 序 + 项目已有 gua64.ts + hexagram-talismans.ts
 */

export interface GuaData {
  number: number;
  name: string;          // 中文卦名，如 "乾为天"
  nameEn: string;        // 英文卦名
  upper: string;         // 上卦
  lower: string;         // 下卦
  symbol: string;        // Unicode 卦象符号
  element: string;       // 五行
  fortuneEn: 'Great Fortune' | 'Fortune' | 'Moderate Fortune' | 'Neutral' | 'Minor Misfortune' | 'Misfortune' | 'Great Misfortune';
  keywordsEn: string[];
}

export const TRIGRAM_LINES: Record<string, ("yang" | "yin")[]> = {
  乾: ["yang", "yang", "yang"],
  坤: ["yin", "yin", "yin"],
  震: ["yang", "yin", "yin"],
  巽: ["yin", "yang", "yang"],
  坎: ["yin", "yang", "yin"],
  离: ["yang", "yin", "yang"],
  艮: ["yin", "yin", "yang"],
  兑: ["yang", "yang", "yin"],
};

export const GUA64_DATA: GuaData[] = [
  { number: 1, name: '乾为天', nameEn: 'The Creative', upper: '乾', lower: '乾', symbol: '䷀', element: '金', fortuneEn: 'Great Fortune', keywordsEn: ['Creation', 'Progress', 'Vigor', 'Leadership', 'Success'] },
  { number: 2, name: '坤为地', nameEn: 'The Receptive', upper: '坤', lower: '坤', symbol: '䷁', element: '土', fortuneEn: 'Great Fortune', keywordsEn: ['Gentleness', 'Inclusiveness', 'Bearing', 'Steadiness', 'Virtue'] },
  { number: 3, name: '水雷屯', nameEn: 'Difficulty at the Beginning', upper: '坎', lower: '震', symbol: '䷂', element: '水', fortuneEn: 'Moderate Fortune', keywordsEn: ['Difficulty', 'Beginning', 'Entrepreneurship', 'Perseverance', 'New birth'] },
  { number: 4, name: '山水蒙', nameEn: 'Youthful Folly', upper: '艮', lower: '坎', symbol: '䷃', element: '土', fortuneEn: 'Fortune', keywordsEn: ['Enlightenment', 'Education', 'Learning', 'Humility', 'Growth'] },
  { number: 5, name: '水天需', nameEn: 'Waiting', upper: '坎', lower: '乾', symbol: '䷄', element: '水', fortuneEn: 'Fortune', keywordsEn: ['Waiting', 'Patience', 'Timing', 'Preparation', 'Trust'] },
  { number: 6, name: '天水讼', nameEn: 'Conflict', upper: '乾', lower: '坎', symbol: '䷅', element: '金', fortuneEn: 'Minor Misfortune', keywordsEn: ['Conflict', 'Dispute', 'Reconciliation', 'Caution', 'Compromise'] },
  { number: 7, name: '地水师', nameEn: 'The Army', upper: '坤', lower: '坎', symbol: '䷆', element: '土', fortuneEn: 'Moderate Fortune', keywordsEn: ['Army', 'Discipline', 'Leadership', 'Unity', 'War'] },
  { number: 8, name: '水地比', nameEn: 'Holding Together', upper: '坎', lower: '坤', symbol: '䷇', element: '水', fortuneEn: 'Fortune', keywordsEn: ['Unity', 'Cooperation', 'Closeness', 'Relationships', 'Alliance'] },
  { number: 9, name: '风天小畜', nameEn: 'The Taming Power of the Small', upper: '巽', lower: '乾', symbol: '䷈', element: '木', fortuneEn: 'Neutral', keywordsEn: ['Accumulation', 'Preparation', 'Waiting', 'Buildup', 'Patience'] },
  { number: 10, name: '天泽履', nameEn: 'Treading', upper: '乾', lower: '兑', symbol: '䷉', element: '金', fortuneEn: 'Moderate Fortune', keywordsEn: ['Caution', 'Conduct', 'Care', 'Etiquette', 'Order'] },
  { number: 11, name: '地天泰', nameEn: 'Peace', upper: '坤', lower: '乾', symbol: '䷊', element: '土', fortuneEn: 'Great Fortune', keywordsEn: ['Harmony', 'Smooth', 'Peace', 'Success', 'Prosperity'] },
  { number: 12, name: '天地否', nameEn: 'Standstill', upper: '乾', lower: '坤', symbol: '䷋', element: '金', fortuneEn: 'Minor Misfortune', keywordsEn: ['Stagnation', 'Obstacles', 'Difficulty', 'Conservatism', 'Waiting'] },
  { number: 13, name: '天火同人', nameEn: 'Fellowship with Men', upper: '乾', lower: '离', symbol: '䷌', element: '金', fortuneEn: 'Moderate Fortune', keywordsEn: ['Unity', 'Cooperation', 'Comrades', 'Relationships', 'Harmony'] },
  { number: 14, name: '火天大有', nameEn: 'Possession in Great Measure', upper: '离', lower: '乾', symbol: '䷍', element: '火', fortuneEn: 'Great Fortune', keywordsEn: ['Harvest', 'Wealth', 'Success', 'Brightness', 'Prosperity'] },
  { number: 15, name: '地山谦', nameEn: 'Modesty', upper: '坤', lower: '艮', symbol: '䷎', element: '土', fortuneEn: 'Great Fortune', keywordsEn: ['Modesty', 'Caution', 'Yielding', 'Benefit', 'Virtue'] },
  { number: 16, name: '雷地豫', nameEn: 'Enthusiasm', upper: '震', lower: '坤', symbol: '䷏', element: '木', fortuneEn: 'Moderate Fortune', keywordsEn: ['Joy', 'Vigor', 'Music', 'Delight', 'Drive'] },
  { number: 17, name: '泽雷随', nameEn: 'Following', upper: '兑', lower: '震', symbol: '䷐', element: '金', fortuneEn: 'Fortune', keywordsEn: ['Following', 'Adaptation', 'Flexibility', 'Cooperation', 'Trust'] },
  { number: 18, name: '山风蛊', nameEn: 'Work on the Decayed', upper: '艮', lower: '巽', symbol: '䷑', element: '土', fortuneEn: 'Minor Misfortune', keywordsEn: ['Reform', 'Renewal', 'Courage', 'Discipline', 'Change'] },
  { number: 19, name: '地泽临', nameEn: 'Approach', upper: '坤', lower: '兑', symbol: '䷒', element: '土', fortuneEn: 'Fortune', keywordsEn: ['Approach', 'Preparation', 'Opportunity', 'Leadership', 'Vision'] },
  { number: 20, name: '风地观', nameEn: 'Contemplation', upper: '巽', lower: '坤', symbol: '䷓', element: '木', fortuneEn: 'Moderate Fortune', keywordsEn: ['Observation', 'Wisdom', 'Patience', 'Insight', 'Clarity'] },
  { number: 21, name: '火雷噬嗑', nameEn: 'Biting Through', upper: '离', lower: '震', symbol: '䷔', element: '火', fortuneEn: 'Moderate Fortune', keywordsEn: ['Justice', 'Resolution', 'Clarity', 'Action', 'Truth'] },
  { number: 22, name: '山火贲', nameEn: 'Grace', upper: '艮', lower: '离', symbol: '䷕', element: '土', fortuneEn: 'Fortune', keywordsEn: ['Beauty', 'Elegance', 'Culture', 'Refinement', 'Art'] },
  { number: 23, name: '山地剥', nameEn: 'Splitting Apart', upper: '艮', lower: '坤', symbol: '䷖', element: '土', fortuneEn: 'Minor Misfortune', keywordsEn: ['Decline', 'Patience', 'Conservation', 'Preparation', 'Humility'] },
  { number: 24, name: '地雷复', nameEn: 'Return', upper: '坤', lower: '震', symbol: '䷗', element: '土', fortuneEn: 'Fortune', keywordsEn: ['Return', 'Renewal', 'Hope', 'Recovery', 'Cycle'] },
  { number: 25, name: '天雷无妄', nameEn: 'Innocence', upper: '乾', lower: '震', symbol: '䷘', element: '金', fortuneEn: 'Fortune', keywordsEn: ['Sincerity', 'Authenticity', 'Naturalness', 'Trust', 'Simplicity'] },
  { number: 26, name: '山天大畜', nameEn: 'The Taming Power of the Great', upper: '艮', lower: '乾', symbol: '䷙', element: '土', fortuneEn: 'Fortune', keywordsEn: ['Accumulation', 'Wisdom', 'Restraint', 'Preparation', 'Strength'] },
  { number: 27, name: '山雷颐', nameEn: 'The Corners of the Mouth', upper: '艮', lower: '震', symbol: '䷚', element: '土', fortuneEn: 'Moderate Fortune', keywordsEn: ['Nourishment', 'Self-care', 'Discipline', 'Health', 'Balance'] },
  { number: 28, name: '泽风大过', nameEn: 'Preponderance of the Great', upper: '兑', lower: '巽', symbol: '䷛', element: '金', fortuneEn: 'Minor Misfortune', keywordsEn: ['Excess', 'Courage', 'Risk', 'Balance', 'Transformation'] },
  { number: 29, name: '坎为水', nameEn: 'The Abysmal', upper: '坎', lower: '坎', symbol: '䷜', element: '水', fortuneEn: 'Neutral', keywordsEn: ['Danger', 'Depth', 'Wisdom', 'Perseverance', 'Flow'] },
  { number: 30, name: '离为火', nameEn: 'The Clinging', upper: '离', lower: '离', symbol: '䷝', element: '火', fortuneEn: 'Moderate Fortune', keywordsEn: ['Brightness', 'Beauty', 'Attachment', 'Fire', 'Civilization'] },
  { number: 31, name: '泽山咸', nameEn: 'Influence', upper: '兑', lower: '艮', symbol: '䷞', element: '金', fortuneEn: 'Fortune', keywordsEn: ['Attraction', 'Sensitivity', 'Relationship', 'Harmony', 'Connection'] },
  { number: 32, name: '雷风恒', nameEn: 'Duration', upper: '震', lower: '巽', symbol: '䷟', element: '木', fortuneEn: 'Fortune', keywordsEn: ['Perseverance', 'Stability', 'Commitment', 'Patience', 'Loyalty'] },
  { number: 33, name: '天山遁', nameEn: 'Retreat', upper: '乾', lower: '艮', symbol: '䷠', element: '金', fortuneEn: 'Neutral', keywordsEn: ['Retreat', 'Wisdom', 'Timing', 'Self-preservation', 'Strategy'] },
  { number: 34, name: '雷天大壮', nameEn: 'The Power of the Great', upper: '震', lower: '乾', symbol: '䷡', element: '木', fortuneEn: 'Moderate Fortune', keywordsEn: ['Strength', 'Power', 'Action', 'Courage', 'Momentum'] },
  { number: 35, name: '火地晋', nameEn: 'Progress', upper: '离', lower: '坤', symbol: '䷢', element: '火', fortuneEn: 'Fortune', keywordsEn: ['Progress', 'Rising', 'Advancement', 'Recognition', 'Growth'] },
  { number: 36, name: '地火明夷', nameEn: 'Darkening of the Light', upper: '坤', lower: '离', symbol: '䷣', element: '土', fortuneEn: 'Minor Misfortune', keywordsEn: ['Adversity', 'Endurance', 'Hope', 'Hidden virtue', 'Patience'] },
  { number: 37, name: '风火家人', nameEn: 'The Family', upper: '巽', lower: '离', symbol: '䷤', element: '木', fortuneEn: 'Fortune', keywordsEn: ['Family', 'Harmony', 'Responsibility', 'Love', 'Nurture'] },
  { number: 38, name: '火泽睽', nameEn: 'Opposition', upper: '离', lower: '兑', symbol: '䷥', element: '火', fortuneEn: 'Minor Misfortune', keywordsEn: ['Opposition', 'Diversity', 'Understanding', 'Tolerance', 'Perspective'] },
  { number: 39, name: '水山蹇', nameEn: 'Obstruction', upper: '坎', lower: '艮', symbol: '䷦', element: '水', fortuneEn: 'Minor Misfortune', keywordsEn: ['Obstacle', 'Patience', 'Wisdom', 'Caution', 'Perseverance'] },
  { number: 40, name: '雷水解', nameEn: 'Deliverance', upper: '震', lower: '坎', symbol: '䷧', element: '木', fortuneEn: 'Fortune', keywordsEn: ['Liberation', 'Relief', 'Recovery', 'Action', 'Renewal'] },
  { number: 41, name: '山泽损', nameEn: 'Decrease', upper: '艮', lower: '兑', symbol: '䷨', element: '土', fortuneEn: 'Moderate Fortune', keywordsEn: ['Sacrifice', 'Discipline', 'Simplicity', 'Self-control', 'Focus'] },
  { number: 42, name: '风雷益', nameEn: 'Increase', upper: '巽', lower: '震', symbol: '䷩', element: '木', fortuneEn: 'Great Fortune', keywordsEn: ['Growth', 'Benefit', 'Generosity', 'Support', 'Abundance'] },
  { number: 43, name: '泽天夬', nameEn: 'Break-through', upper: '兑', lower: '乾', symbol: '䷪', element: '金', fortuneEn: 'Moderate Fortune', keywordsEn: ['Resolution', 'Clarity', 'Decisiveness', 'Justice', 'Action'] },
  { number: 44, name: '天风姤', nameEn: 'Coming to Meet', upper: '乾', lower: '巽', symbol: '䷫', element: '金', fortuneEn: 'Minor Misfortune', keywordsEn: ['Encounter', 'Caution', 'Awareness', 'Vigilance', 'Boundaries'] },
  { number: 45, name: '泽地萃', nameEn: 'Gathering Together', upper: '兑', lower: '坤', symbol: '䷬', element: '金', fortuneEn: 'Fortune', keywordsEn: ['Community', 'Unity', 'Cooperation', 'Celebration', 'Togetherness'] },
  { number: 46, name: '地风升', nameEn: 'Pushing Upward', upper: '坤', lower: '巽', symbol: '䷭', element: '土', fortuneEn: 'Fortune', keywordsEn: ['Ascension', 'Growth', 'Effort', 'Aspiration', 'Rising'] },
  { number: 47, name: '泽水困', nameEn: 'Oppression', upper: '兑', lower: '坎', symbol: '䷮', element: '金', fortuneEn: 'Minor Misfortune', keywordsEn: ['Adversity', 'Endurance', 'Hope', 'Resourcefulness', 'Faith'] },
  { number: 48, name: '水风井', nameEn: 'The Well', upper: '坎', lower: '巽', symbol: '䷯', element: '水', fortuneEn: 'Fortune', keywordsEn: ['Source', 'Nourishment', 'Community', 'Tradition', 'Sustainability'] },
  { number: 49, name: '泽火革', nameEn: 'Revolution', upper: '兑', lower: '离', symbol: '䷰', element: '金', fortuneEn: 'Moderate Fortune', keywordsEn: ['Change', 'Transformation', 'Reform', 'Courage', 'Renewal'] },
  { number: 50, name: '火风鼎', nameEn: 'The Cauldron', upper: '离', lower: '巽', symbol: '䷱', element: '火', fortuneEn: 'Great Fortune', keywordsEn: ['Nourishment', 'Stability', 'Prosperity', 'Support', 'Foundation'] },
  { number: 51, name: '震为雷', nameEn: 'The Arousing', upper: '震', lower: '震', symbol: '䷲', element: '木', fortuneEn: 'Moderate Fortune', keywordsEn: ['Shock', 'Movement', 'Awakening', 'Action', 'Vitality'] },
  { number: 52, name: '艮为山', nameEn: 'Keeping Still', upper: '艮', lower: '艮', symbol: '䷳', element: '土', fortuneEn: 'Neutral', keywordsEn: ['Stillness', 'Meditation', 'Restraint', 'Focus', 'Peace'] },
  { number: 53, name: '风山渐', nameEn: 'Development', upper: '巽', lower: '艮', symbol: '䷴', element: '木', fortuneEn: 'Fortune', keywordsEn: ['Gradual progress', 'Patience', 'Growth', 'Natural order', 'Stability'] },
  { number: 54, name: '雷泽归妹', nameEn: 'The Marrying Maiden', upper: '震', lower: '兑', symbol: '䷵', element: '木', fortuneEn: 'Neutral', keywordsEn: ['Relationship', 'Commitment', 'Adaptation', 'Transition', 'Union'] },
  { number: 55, name: '雷火丰', nameEn: 'Abundance', upper: '震', lower: '离', symbol: '䷶', element: '木', fortuneEn: 'Great Fortune', keywordsEn: ['Abundance', 'Prosperity', 'Clarity', 'Celebration', 'Success'] },
  { number: 56, name: '火山旅', nameEn: 'The Wanderer', upper: '离', lower: '艮', symbol: '䷷', element: '火', fortuneEn: 'Neutral', keywordsEn: ['Travel', 'Adaptation', 'Independence', 'Observation', 'Journey'] },
  { number: 57, name: '巽为风', nameEn: 'The Gentle', upper: '巽', lower: '巽', symbol: '䷸', element: '木', fortuneEn: 'Fortune', keywordsEn: ['Gentleness', 'Penetration', 'Flexibility', 'Influence', 'Patience'] },
  { number: 58, name: '兑为泽', nameEn: 'The Joyous', upper: '兑', lower: '兑', symbol: '䷹', element: '金', fortuneEn: 'Fortune', keywordsEn: ['Joy', 'Communication', 'Pleasure', 'Openness', 'Harmony'] },
  { number: 59, name: '风水涣', nameEn: 'Dispersion', upper: '巽', lower: '坎', symbol: '䷺', element: '木', fortuneEn: 'Moderate Fortune', keywordsEn: ['Dispersion', 'Reunion', 'Communication', 'Relief', 'Connection'] },
  { number: 60, name: '水泽节', nameEn: 'Limitation', upper: '坎', lower: '兑', symbol: '䷻', element: '水', fortuneEn: 'Moderate Fortune', keywordsEn: ['Moderation', 'Discipline', 'Balance', 'Self-control', 'Harmony'] },
  { number: 61, name: '风泽中孚', nameEn: 'Inner Truth', upper: '巽', lower: '兑', symbol: '䷼', element: '木', fortuneEn: 'Fortune', keywordsEn: ['Sincerity', 'Trust', 'Authenticity', 'Faith', 'Connection'] },
  { number: 62, name: '雷山小过', nameEn: 'Preponderance of the Small', upper: '震', lower: '艮', symbol: '䷽', element: '木', fortuneEn: 'Neutral', keywordsEn: ['Caution', 'Humility', 'Patience', 'Attention', 'Care'] },
  { number: 63, name: '水火既济', nameEn: 'After Completion', upper: '坎', lower: '离', symbol: '䷾', element: '水', fortuneEn: 'Fortune', keywordsEn: ['Completion', 'Balance', 'Success', 'Caution', 'Maintenance'] },
  { number: 64, name: '火水未济', nameEn: 'Before Completion', upper: '离', lower: '坎', symbol: '䷿', element: '火', fortuneEn: 'Moderate Fortune', keywordsEn: ['Incompletion', 'Potential', 'Effort', 'Transition', 'Hope'] },
];

export function getGuaByName(name: string): GuaData | undefined {
  return GUA64_DATA.find(g => g.name === name);
}
