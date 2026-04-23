import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Copy, Check, Wand2 } from 'lucide-react';
import type { FourPillarsData } from './calendar';

interface ForeignerNamingProps {
  pillars?: FourPillarsData | null;
}

interface GeneratedForeignName {
  surname: string;
  givenName: string;
  fullPinyin: string;
  transliteration: string;
  bridgeMeaning: string;
}

// ═══════════════════════════════════════════════════════════════
//  音译规则表
// ═══════════════════════════════════════════════════════════════
const PHONETIC_MAP: Record<string, { male: string[]; female: string[] }> = {
  A: { male: ['安', '艾', '奥'], female: ['雅', '艾', '安娜'] },
  B: { male: ['波', '柏', '贝'], female: ['贝', '柏', '芭'] },
  C: { male: ['克', '凯', '柯'], female: ['克', '凯', '柯'] },
  D: { male: ['德', '大', '丹'], female: ['黛', '丹', '达'] },
  E: { male: ['恩', '尔', '埃'], female: ['伊', '艾', '埃'] },
  F: { male: ['福', '费', '方'], female: ['菲', '芙', '方'] },
  G: { male: ['格', '吉', '高'], female: ['格', '吉', '葛'] },
  H: { male: ['赫', '海', '霍'], female: ['赫', '海', '霍'] },
  I: { male: ['伊', '艾', '因'], female: ['伊', '艾', '英'] },
  J: { male: ['杰', '吉', '嘉'], female: ['杰', '吉', '嘉'] },
  K: { male: ['凯', '科', '克'], female: ['凯', '科', '克'] },
  L: { male: ['雷', '里', '卢'], female: ['莉', '蕾', '丽'] },
  M: { male: ['明', '铭', '麦'], female: ['明', '美', '蜜'] },
  N: { male: ['恩', '尼', '纳'], female: ['娜', '妮', '南'] },
  O: { male: ['奥', '欧', '沃'], female: ['奥', '欧', '沃'] },
  P: { male: ['派', '帕', '皮'], female: ['佩', '帕', '皮'] },
  Q: { male: ['乔', '邱', '屈'], female: ['乔', '秋', '琼'] },
  R: { male: ['雷', '瑞', '罗'], female: ['瑞', '蕾', '罗'] },
  S: { male: ['思', '斯', '塞'], female: ['丝', '思', '莎'] },
  T: { male: ['特', '托', '泰'], female: ['特', '托', '泰'] },
  U: { male: ['乌', '尤', '厄'], female: ['乌', '尤', '厄'] },
  V: { male: ['维', '文', '瓦'], female: ['维', '薇', '瓦'] },
  W: { male: ['威', '沃', '温'], female: ['薇', '温', '沃'] },
  X: { male: ['克', '赛', '艾'], female: ['克', '赛', '艾'] },
  Y: { male: ['亚', '伊', '扬'], female: ['雅', '伊', '娅'] },
  Z: { male: ['泽', '扎', '佐'], female: ['泽', '扎', '佐'] },
};

// ═══════════════════════════════════════════════════════════════
//  英文名语义映射
// ═══════════════════════════════════════════════════════════════
const NAME_MEANINGS: Record<string, string> = {
  james: '希伯来语「替代者」，引申为「杰出之人」',
  john: '希伯来语「上帝是仁慈的」',
  robert: '日耳曼语「辉煌的名声」',
  michael: '希伯来语「与上帝相似」',
  william: '日耳曼语「坚定的保护者」',
  david: '希伯来语「被蒙爱的」',
  richard: '日耳曼语「勇敢的统治者」',
  joseph: '希伯来语「上帝将增加」',
  thomas: '阿拉米语「双胞胎」',
  charles: '日耳曼语「自由的人」',
  daniel: '希伯来语「上帝是我的审判者」',
  matthew: '希伯来语「上帝的礼物」',
  anthony: '拉丁语「无价的」',
  mark: '拉丁语「战神」',
  paul: '拉丁语「小的，谦逊的」',
  steven: '希腊语「花环，皇冠」',
  andrew: '希腊语「勇敢的，有男子气概的」',
  kevin: '凯尔特语「温柔的，可爱的」',
  brian: '凯尔特语「高贵的，强大的」',
  jason: '希腊语「治愈者」',
  ryan: '凯尔特语「小国王」',
  eric: '日耳曼语「永远的统治者」',
  jacob: '希伯来语「抓住脚跟的人」',
  nicholas: '希腊语「胜利的人民」',
  joshua: '希伯来语「上帝是拯救」',
  chris: '希腊语「受膏者，基督的追随者」',
  alex: '希腊语「人类的守护者」',
  ben: '希伯来语「右手之子，幸运」',
  sam: '希伯来语「上帝听见」',
  max: '拉丁语「最伟大的」',
  leo: '拉丁语「狮子」，象征勇猛',
  lucas: '拉丁语「光明，带来光明的人」',
  henry: '日耳曼语「家族的统治者」',
  oliver: '拉丁语「橄榄树」，象征和平',
  jack: '英语「上帝是仁慈的」',
  harry: '日耳曼语「家族的统治者」',
  george: '希腊语「农夫，土地工作者」',
  edward: '英语「富有的守护者」',
  // 女性名字
  mary: '希伯来语「苦海」或「蒙爱者」',
  jennifer: '凯尔特语「白色波浪」',
  linda: '西班牙语「美丽的」',
  patricia: '拉丁语「贵族」',
  elizabeth: '希伯来语「上帝的誓约」',
  susan: '希伯来语「百合花」',
  jessica: '希伯来语「上帝看见」',
  sarah: '希伯来语「公主」',
  karen: '希腊语「纯洁的」',
  nancy: '希伯来语「恩典」',
  lisa: '希伯来语「上帝的誓约」',
  betty: '希伯来语「上帝的誓约」',
  margaret: '希腊语「珍珠」',
  sandra: '希腊语「人类的保护者」',
  ashley: '英语「梣树林地」',
  kimberly: '英语「皇家堡垒」',
  emily: '拉丁语「勤勉的」',
  emma: '日耳曼语「完整的，普遍的」',
  olivia: '拉丁语「橄榄树」象征和平',
  sophia: '希腊语「智慧」',
  ava: '拉丁语「鸟」象征自由',
  mia: '意大利语「我的」',
  charlotte: '法语「自由的人」',
  amelia: '日耳曼语「勤勉的」',
  harper: '英语「竖琴师」',
  evelyn: '凯尔特语「被期盼的孩子」',
  abigail: '希伯来语「父亲的喜悦」',
  lily: '英语「百合花」，象征纯洁',
  grace: '拉丁语「优雅的，恩典」',
  chloe: '希腊语「嫩芽，新绿」',
  hannah: '希伯来语「恩典」',
};

// ═══════════════════════════════════════════════════════════════
//  拼音映射
// ═══════════════════════════════════════════════════════════════
const PINYIN_MAP: Record<string, string> = {
  安: 'Ān', 艾: 'Ài', 奥: 'Ào', 雅: 'Yǎ', 安娜: 'Ān nà',
  波: 'Bō', 柏: 'Bǎi', 贝: 'Bèi', 芭: 'Bā',
  克: 'Kè', 凯: 'Kǎi', 柯: 'Kē',
  德: 'Dé', 大: 'Dà', 丹: 'Dān', 黛: 'Dài', 达: 'Dá',
  恩: 'Ēn', 尔: 'Ěr', 埃: 'Āi', 伊: 'Yī',
  福: 'Fú', 费: 'Fèi', 方: 'Fāng', 菲: 'Fēi', 芙: 'Fú',
  格: 'Gé', 吉: 'Jí', 高: 'Gāo', 葛: 'Gě',
  赫: 'Hè', 海: 'Hǎi', 霍: 'Huò',
  因: 'Yīn', 英: 'Yīng',
  杰: 'Jié', 嘉: 'Jiā',
  科: 'Kē', 酷: 'Kù',
  雷: 'Léi', 里: 'Lǐ', 卢: 'Lú', 莉: 'Lì', 蕾: 'Lěi', 丽: 'Lì',
  明: 'Míng', 铭: 'Míng', 麦: 'Mài', 美: 'Měi', 蜜: 'Mì',
  尼: 'Ní', 纳: 'Nà', 娜: 'Nà', 妮: 'Nī', 南: 'Nán',
  欧: 'Ōu', 沃: 'Wò',
  派: 'Pài', 帕: 'Pà', 皮: 'Pí', 佩: 'Pèi',
  乔: 'Qiáo', 邱: 'Qiū', 屈: 'Qū', 秋: 'Qiū', 琼: 'Qióng',
  瑞: 'Ruì', 罗: 'Luó',
  思: 'Sī', 斯: 'Sī', 塞: 'Sāi', 丝: 'Sī', 莎: 'Shā',
  特: 'Tè', 托: 'Tuō', 泰: 'Tài',
  乌: 'Wū', 尤: 'Yóu', 厄: 'È',
  维: 'Wéi', 文: 'Wén', 瓦: 'Wǎ', 薇: 'Wēi',
  威: 'Wēi', 温: 'Wēn',
  赛: 'Sài',
  亚: 'Yà', 扬: 'Yáng', 娅: 'Yà',
  泽: 'Zé', 扎: 'Zhā', 佐: 'Zuǒ',
};

// ═══════════════════════════════════════════════════════════════
//  含义桥接映射
// ═══════════════════════════════════════════════════════════════
const CHAR_BRIDGE_MEANINGS: Record<string, string> = {
  杰: '杰出 — 意为卓越出众',
  明: '明亮 — 意为光明智慧',
  安: '安宁 — 意为平安祥和',
  雅: '高雅 — 意为优雅高贵',
  瑞: '祥瑞 — 意为吉祥如意',
  凯: '凯旋 — 意为胜利归来',
  思: '思考 — 意为深思熟虑',
  威: '威严 — 意为威严有力',
  莉: '茉莉 — 意为芬芳美丽',
  娜: '婀娜 — 意为柔美多姿',
  美: '美丽 — 意为美好动人',
  雷: '雷霆 — 意为威猛有力',
  德: '品德 — 意为道德高尚',
  伊: '伊人 — 意为美好之人',
  菲: '芳菲 — 意为花草芳香',
  维: '维系 — 意为联结守护',
  柏: '松柏 — 意为坚韧不拔',
  嘉: '嘉许 — 意为美好赞许',
  阳: '阳光 — 意为温暖开朗',
  涵: '涵养 — 意为包容修养',
};

/** 根据英文名语义匹配最适合的中文字 */
function findSemanticMatch(
  englishName: string,
  candidates: string[]
): string | null {
  const meaning = NAME_MEANINGS[englishName.toLowerCase()] || '';
  if (!meaning) return null;

  // 根据英文名含义关键词匹配中文字
  const keywordMap: Record<string, string[]> = {
    杰出: ['杰', '凯', '嘉'],
    光明: ['明', '阳'],
    智慧: ['明', '思', '哲'],
    勇敢: ['威', '武', '勇'],
    保护: ['维', '守', '安'],
    和平: ['安', '和'],
    美丽: ['美', '莉', '菲'],
    优雅: ['雅', '娜', '伊'],
    胜利: ['凯', '胜'],
    高贵: ['雅', '瑞'],
    治愈: ['安', '康'],
    自由: ['安', '翔'],
    恩典: ['恩', '惠'],
    纯洁: ['纯', '清'],
  };

  for (const [, chars] of Object.entries(keywordMap)) {
    for (const c of chars) {
      if (candidates.includes(c)) return c;
    }
  }
  return null;
}

/** 生成外国人中国名 */
function generateForeignNames(
  englishName: string,
  gender: 'male' | 'female'
): GeneratedForeignName[] {
  const cleanName = englishName.trim();
  if (!cleanName) return [];

  const first = cleanName[0].toUpperCase();
  const last = cleanName[cleanName.length - 1].toUpperCase();

  const firstChars = PHONETIC_MAP[first]?.[gender] || ['安', '明', '杰'];
  const lastChars = PHONETIC_MAP[last]?.[gender] || ['娜', '瑞', '思'];

  const meaning = NAME_MEANINGS[cleanName.toLowerCase()] || '';
  const results: GeneratedForeignName[] = [];
  const used = new Set<string>();

  // 尝试语义匹配
  const semanticSurname = findSemanticMatch(cleanName, firstChars);
  const semanticGiven = findSemanticMatch(cleanName, lastChars);

  for (let i = 0; i < 3; i++) {
    const surname =
      (i === 0 && semanticSurname) ||
      firstChars[i % firstChars.length] ||
      firstChars[0];
    const givenPool = lastChars.filter((c) => c !== surname);
    if (givenPool.length === 0) {
      const all = [...firstChars, ...lastChars];
      const g = all.find((c) => c !== surname) || '明';
      givenPool.push(g);
    }
    const given =
      (i === 0 && semanticGiven && givenPool.includes(semanticGiven)
        ? semanticGiven
        : null) || givenPool[i % givenPool.length];

    const fullName = surname + given;
    if (used.has(fullName)) continue;
    used.add(fullName);

    const surnamePinyin = PINYIN_MAP[surname] || surname;
    const givenPinyin = PINYIN_MAP[given] || given;
    const fullPinyin = `${surnamePinyin} ${givenPinyin}`;

    // 构建桥接解释
    const bridgeParts: string[] = [];
    if (CHAR_BRIDGE_MEANINGS[surname]) {
      bridgeParts.push(`「${surname}」${CHAR_BRIDGE_MEANINGS[surname]}`);
    }
    if (CHAR_BRIDGE_MEANINGS[given]) {
      bridgeParts.push(`「${given}」${CHAR_BRIDGE_MEANINGS[given]}`);
    }

    let bridgeMeaning = bridgeParts.join('；');
    if (meaning) {
      bridgeMeaning += `。与 ${cleanName}（${meaning}）的语义共鸣。`;
    }
    if (!bridgeMeaning) {
      bridgeMeaning = `音译自 ${cleanName}，选取发音相近且寓意吉祥的汉字组合。`;
    }

    const transliteration = `${surname} ← ${cleanName} 首字母 ${first}，${given} ← 尾字母 ${last}`;

    results.push({ surname, givenName: given, fullPinyin, transliteration, bridgeMeaning });
  }

  return results;
}

export default function ForeignerNaming({ pillars }: ForeignerNamingProps) {
  void pillars; // 保留供未来五行平衡参考
  const [englishName, setEnglishName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [names, setNames] = useState<GeneratedForeignName[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(() => {
    if (!englishName.trim()) return;
    const generated = generateForeignNames(englishName.trim(), gender);
    setNames(generated);
  }, [englishName, gender]);

  const handleCopy = useCallback(
    (index: number, name: GeneratedForeignName) => {
      const text = `My Chinese name is ${name.surname}${name.givenName} (${name.fullPinyin}) — ${name.bridgeMeaning} From MysticDao AI`;
      navigator.clipboard.writeText(text).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      });
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2500);
    },
    []
  );

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-gold" />
          <h2 className="text-2xl font-bold text-text-primary">
            My Chinese Name
          </h2>
          <Globe className="w-5 h-5 text-gold" />
        </div>
        <p className="text-text-secondary text-sm">
          Enter your name — get a meaningful Chinese name
        </p>
      </motion.div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-bg-card border border-border-subtle rounded-2xl p-6 mb-8"
      >
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">
            Your English Name
          </label>
          <input
            type="text"
            value={englishName}
            onChange={(e) => setEnglishName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. James, Emily..."
            className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>

        {/* Gender Selection */}
        <div className="mb-6">
          <label className="block text-sm text-text-secondary mb-2">
            Gender
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                gender === 'male'
                  ? 'bg-gold/15 text-gold border border-gold/40'
                  : 'bg-bg-elevated text-text-secondary border border-border-subtle hover:border-border-hover'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                gender === 'female'
                  ? 'bg-gold/15 text-gold border border-gold/40'
                  : 'bg-bg-elevated text-text-secondary border border-border-subtle hover:border-border-hover'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!englishName.trim()}
          className="w-full py-3.5 bg-white text-black text-base font-semibold rounded-pill transition-all duration-200 hover:bg-[#E5E5E5] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          生成我的中国名
        </button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {names.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {names.map((name, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-bg-card border border-gold/30 rounded-2xl p-6 sm:p-8 hover:shadow-[0_0_20px_rgba(200,164,92,0.1)] transition-shadow duration-300"
              >
                {/* Option number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-text-muted">
                    Option {index + 1}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold">
                    {name.surname} + {name.givenName}
                  </span>
                </div>

                {/* Chinese Name Large */}
                <div className="text-center mb-4">
                  <h3 className="text-4xl font-bold text-text-primary tracking-wider mb-2">
                    {name.surname}
                    {name.givenName}
                  </h3>
                  <p className="text-lg text-gold">{name.fullPinyin}</p>
                </div>

                {/* Transliteration */}
                <div className="mb-4 pb-4 border-b border-border-subtle">
                  <p className="text-sm text-text-secondary">
                    <span className="text-text-muted">音译来源：</span>
                    {name.transliteration}
                  </p>
                </div>

                {/* Bridge Meaning */}
                <div className="mb-5 pb-5 border-b border-border-subtle">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    <span className="text-text-muted">含义桥接：</span>
                    {name.bridgeMeaning}
                  </p>
                </div>

                {/* Copy Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleCopy(index, name)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-subtle text-sm text-text-secondary hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all duration-200"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制我的中国名
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-text-muted leading-relaxed">
          名字推荐基于音译与语义分析，仅供参考娱乐。
        </p>
      </motion.div>
    </div>
  );
}
