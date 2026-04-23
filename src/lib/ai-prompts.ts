/**
 * AI Prompts Generator — 符咒AI图片提示词生成器
 *
 * 根据卦属性自动生成 Pollinations.AI / Midjourney / Stable Diffusion 提示词
 * 支持中英文双语输出
 */

import { getHexagramTalisman, type HexagramTalisman } from '@/data/hexagram-talismans';

interface AIPromptResult {
  /** Pollinations.AI URL（可直接作为<img src>） */
  pollinationsUrl: string;
  /** 完整英文提示词 */
  englishPrompt: string;
  /** 完整中文提示词 */
  chinesePrompt: string;
  /** Midjourney格式提示词 */
  midjourneyPrompt: string;
}

/** 五行→英文元素描述 */
const ELEMENT_EN: Record<string, string> = {
  金: 'gold and white metal element',
  木: 'green wood element with flowing vines',
  水: 'deep blue water element with flowing waves',
  火: 'crimson red fire element with flame motifs',
  土: 'earthy brown and yellow earth element',
};

/** 分类→英文符头描述 */
const CATEGORY_HEAD_EN: Record<string, string> = {
  '天官赐福': 'three-hook Sanqing symbol at top representing heavenly blessings',
  '武运昌隆': 'three-hook Sanqing symbol with warrior spirit',
  '地母护身': 'three stars Santai symbol representing earth mother protection',
  '姻缘和合': 'three stars Santai symbol with harmony motifs',
  '文昌启智': 'Chiling decree symbol representing wisdom and enlightenment',
  '财运亨通': 'Chiling decree symbol with wealth and prosperity motifs',
  '平安顺遂': 'Chiling decree symbol for peace and safety',
  '转运破厄': 'Chiling decree symbol for breaking through obstacles',
};

/** 符胆→英文描述 */
const GALL_EN: Record<string, string> = {
  '罡': 'the character "Gang" in bold calligraphy representing heavenly power',
  '化': 'the character "Hua" in flowing calligraphy representing transformation',
  '井': 'the character "Jing" in square calligraphy representing the well of wisdom',
  '马': 'the character "Ma" in galloping calligraphy representing fiery energy',
};

/** 生成 Pollinations.AI 提示词 */
function generateEnglishPrompt(
  talisman: HexagramTalisman,
  score: number
): string {
  const elementDesc = ELEMENT_EN[talisman.element] || ELEMENT_EN['金'];
  const headDesc = CATEGORY_HEAD_EN[talisman.category] || CATEGORY_HEAD_EN['天官赐福'];
  const gallChar = { 金: '罡', 木: '化', 水: '井', 火: '马', 土: '井' }[talisman.element] || '罡';
  const gallDesc = GALL_EN[gallChar] || GALL_EN['罡'];
  const blessingEn = talisman.blessingTheme;

  return (
    `Traditional Chinese Taoist talisman (fu), vertical format 2:3, ` +
    `${elementDesc}, ${headDesc}, ` +
    `six horizontal yao lines in center, ${gallDesc} as the soul of the talisman, ` +
    `cloud patterns at bottom, red cinnabar seal stamp, ` +
    `Chinese calligraphy "${talisman.hexagramName}" and "${blessingEn}", ` +
    `golden double-line border with cloud corner decorations, ` +
    `subtle cloud texture on pure black background, mystical golden glow, ` +
    `cinnabar red ink strokes, ancient parchment texture, ` +
    `high detail digital art, mystical atmosphere, spiritual energy, ` +
    `fortune score ${score}, ${score >= 80 ? 'auspicious and blessed' : score >= 60 ? 'balanced and steady' : 'caution and patience required'}`
  );
}

/** 生成中文提示词 */
function generateChinesePrompt(
  talisman: HexagramTalisman,
  score: number
): string {
  const gallChar = { 金: '罡', 木: '化', 水: '井', 火: '马', 土: '井' }[talisman.element] || '罡';
  return (
    `传统道教符咒，竖版比例，${talisman.element}行主题色，` +
    `顶部${talisman.category === '天官赐福' || talisman.category === '武运昌隆' ? '三清符头（三勾）' : talisman.category === '地母护身' || talisman.category === '姻缘和合' ? '三台星君符头' : '敕令符头'}，` +
    `中部六爻排列，符胆「${gallChar}」字，` +
    `底部云纹收束，朱砂红印章「${score >= 90 ? '上上签' : score >= 80 ? '上吉' : score >= 70 ? '中吉' : score >= 60 ? '小吉' : score >= 50 ? '平' : '需谨慎'}」，` +
    `卦名「${talisman.hexagramName}」，祈福主题「${talisman.blessingTheme}」，` +
    `金色双线边框，云纹角装饰，墨玉黑底暗纹，` +
    `神秘金色光晕，朱砂笔墨质感，高清数字艺术`
  );
}

/** 生成 Midjourney 格式提示词 */
function generateMidjourneyPrompt(
  talisman: HexagramTalisman,
  score: number
): string {
  const prompt = generateEnglishPrompt(talisman, score);
  return (
    prompt +
    ` --ar 2:3 --style raw --s 250 ` +
    `--no text watermark signature blur low quality`
  );
}

/** 构造 Pollinations.AI URL */
function buildPollinationsUrl(prompt: string, seed: number): string {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=400&height=600&seed=${seed}&nologo=true`;
}

/**
 * 根据卦名和分数生成全套AI提示词
 */
export function generateAIPrompts(
  hexagramName: string,
  score: number
): AIPromptResult {
  const talisman = getHexagramTalisman(hexagramName);
  const seed = talisman.placeholderSeed + Math.floor(score);

  const englishPrompt = generateEnglishPrompt(talisman, score);
  const chinesePrompt = generateChinesePrompt(talisman, score);
  const midjourneyPrompt = generateMidjourneyPrompt(talisman, score);
  const pollinationsUrl = buildPollinationsUrl(englishPrompt, seed);

  return {
    pollinationsUrl,
    englishPrompt,
    chinesePrompt,
    midjourneyPrompt,
  };
}

/**
 * 直接获取 Pollinations.AI 图片URL（用于<img src>）
 */
export function getPollinationsUrl(
  hexagramName: string,
  score: number
): string {
  return generateAIPrompts(hexagramName, score).pollinationsUrl;
}

/**
 * 获取缓存key
 */
export function getAICacheKey(hexagramName: string, score: number): string {
  const talisman = getHexagramTalisman(hexagramName);
  return `mysticdao_ai_talisman_${hexagramName}_${talisman.placeholderSeed}_${Math.floor(score / 10) * 10}`;
}
