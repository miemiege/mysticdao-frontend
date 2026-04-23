import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check } from 'lucide-react';
import type { FourPillarsData } from './calendar';
import { countElementDistribution } from './calendar';
import type { Element } from './data';
import {
  NAMING_CHARS,
  WUXING_LABELS,
  getFavorableWuxing,
  pickRandom,
  capitalizePinyin,
} from '../../data/namingChars';

interface ChineseNamingProps {
  pillars: FourPillarsData;
  gender?: 'male' | 'female' | null;
}

interface GeneratedName {
  chars: NamingChar[];
  fullPinyin: string;
  overallMeaning: string;
  style: string;
}

import type { NamingChar } from '../../data/namingChars';

const ELEMENT_ORDER: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];

const ELEMENT_COLORS: Record<Element, string> = {
  wood: '#4ADE80',
  fire: '#F87171',
  earth: '#FBBF24',
  metal: '#E5E7EB',
  water: '#60A5FA',
};

/** 生成一组名字（2-3 个字） */
function generateNameGroup(
  chars: NamingChar[],
  count: number,
  style: string
): GeneratedName {
  const selected = pickRandom(chars, count);
  const fullPinyin = selected.map((c) => capitalizePinyin(c.pinyin)).join(' ');
  const overallMeaning = generateOverallMeaning(selected, style);
  return { chars: selected, fullPinyin, overallMeaning, style };
}

/** 根据选字和风格生成整体寓意 */
function generateOverallMeaning(chars: NamingChar[], style: string): string {
  const meanings = chars.map((c) => c.meaning.split('，')[0]);
  if (chars.length === 2) {
    return `${style} — ${meanings[0]}，${meanings[1]}，相得益彰`;
  }
  return `${style} — ${meanings.join('、')}，意蕴深远`;
}

export default function ChineseNaming({ pillars, gender }: ChineseNamingProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { distribution, favorable, names } = useMemo(() => {
    const dist = countElementDistribution(pillars);
    const fav = getFavorableWuxing(pillars);

    // 收集可用的字：喜用神优先，次选生助五行
    const pool: NamingChar[] = [];
    for (const el of fav.primary) {
      pool.push(...NAMING_CHARS.filter((c) => c.wuxing === el));
    }
    for (const el of fav.secondary) {
      pool.push(...NAMING_CHARS.filter((c) => c.wuxing === el));
    }
    // 如果 pool 不够，补充其他五行
    if (pool.length < 12) {
      for (const c of NAMING_CHARS) {
        if (!pool.some((p) => p.char === c.char)) {
          pool.push(c);
        }
      }
    }

    // 去重
    const uniquePool = pool.filter(
      (c, i, arr) => arr.findIndex((a) => a.char === c.char) === i
    );

    // 生成 3 组名字
    const generated: GeneratedName[] = [
      generateNameGroup(uniquePool, 2, '温润如玉'),
      generateNameGroup(uniquePool, 2, '清雅脱俗'),
      generateNameGroup(uniquePool, 2, '气宇轩昂'),
    ];

    return { distribution: dist, favorable: fav, names: generated };
  }, [pillars]);

  const handleCopy = useCallback(
    (index: number, name: GeneratedName) => {
      const charsStr = name.chars.map((c) => c.char).join('');
      const text = `我的八字吉祥名是：${charsStr} — ${name.overallMeaning}。来自 MysticDao AI 起名`;
      navigator.clipboard.writeText(text).catch(() => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      });
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    },
    []
  );

  const maxCount = Math.max(...Object.values(distribution));

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
          <Sparkles className="w-5 h-5 text-gold" />
          <h2 className="text-2xl font-bold text-text-primary">AI 智能起名</h2>
          <Sparkles className="w-5 h-5 text-gold" />
        </div>
        <p className="text-text-secondary text-sm">
          根据八字五行，为您推荐吉祥美名
          {gender && (
            <span className="ml-1">
              （{gender === 'male' ? '男' : '女'}孩推荐）
            </span>
          )}
        </p>
      </motion.div>

      {/* 五行分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-bg-card border border-border-subtle rounded-2xl p-6 mb-8"
      >
        <h3 className="text-sm font-medium text-text-secondary mb-4">
          命局五行分析
        </h3>
        <div className="space-y-3">
          {ELEMENT_ORDER.map((el) => {
            const count = distribution[el];
            const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const isFav =
              favorable.primary.includes(el) ||
              favorable.secondary.includes(el);
            return (
              <div key={el} className="flex items-center gap-3">
                <span
                  className="text-sm w-8 shrink-0"
                  style={{ color: ELEMENT_COLORS[el] }}
                >
                  {WUXING_LABELS[el]}
                </span>
                <div className="flex-1 h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: ELEMENT_COLORS[el] }}
                  />
                </div>
                <span
                  className={`text-sm w-6 text-right ${
                    isFav ? 'text-gold font-medium' : 'text-text-muted'
                  }`}
                >
                  {count}
                </span>
                {isFav && (
                  <span className="text-xs text-gold shrink-0">
                    {favorable.primary.includes(el) ? '喜用' : '次选'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <p className="text-xs text-text-secondary">
            喜用神：
            <span className="text-gold">
              {favorable.primary.map((e) => WUXING_LABELS[e]).join('、')}
            </span>
            {favorable.secondary.length > 0 && (
              <>
                {' '}
                · 次选：
                <span className="text-text-muted">
                  {favorable.secondary.map((e) => WUXING_LABELS[e]).join('、')}
                </span>
              </>
            )}
          </p>
        </div>
      </motion.div>

      {/* 推荐名字 */}
      <div className="space-y-6">
        {names.map((name, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
            className="bg-bg-card border border-gold/30 rounded-2xl p-6 sm:p-8 hover:shadow-[0_0_20px_rgba(200,164,92,0.1)] transition-shadow duration-300"
          >
            {/* 方案编号 + 风格标签 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-text-muted">
                方案 {index + 1}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold">
                {name.style}
              </span>
            </div>

            {/* 中文名大字 */}
            <div className="text-center mb-4">
              <h3 className="text-4xl font-bold text-text-primary tracking-wider mb-2">
                {name.chars.map((c) => c.char).join('')}
              </h3>
              <p className="text-lg text-gold">{name.fullPinyin}</p>
            </div>

            {/* 五行属性标签 */}
            <div className="flex justify-center gap-2 mb-5">
              {name.chars.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                  style={{
                    color: ELEMENT_COLORS[c.wuxing],
                    backgroundColor: `${ELEMENT_COLORS[c.wuxing]}14`,
                  }}
                >
                  {c.char} · {WUXING_LABELS[c.wuxing]}
                </span>
              ))}
            </div>

            {/* 单字寓意 */}
            <div className="space-y-2 mb-5">
              {name.chars.map((c, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <span className="text-gold mt-0.5">◆</span>
                  <span>
                    <strong className="text-text-primary">{c.char}</strong> ={' '}
                    {c.meaning}
                  </span>
                </div>
              ))}
            </div>

            {/* 整体寓意 */}
            <p className="text-sm text-text-secondary leading-relaxed mb-5 pb-5 border-b border-border-subtle">
              {name.overallMeaning}
            </p>

            {/* 复制按钮 */}
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
                    复制名字
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 底部免责声明 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-text-muted leading-relaxed">
          名字推荐基于五行八字分析，仅供参考，不承诺改命效果。
        </p>
      </motion.div>
    </div>
  );
}
