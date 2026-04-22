import { motion } from 'framer-motion';
import { ELEMENT_COLORS } from './data';
import type { FourPillarsData } from './calendar';
import { countElementDistribution } from './calendar';
import PillarColumn from './PillarColumn';
import type { Element } from './data';

interface FourPillarsProps {
  pillars: FourPillarsData;
  onRequestReading: () => void;
}

const ELEMENT_ORDER: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
const ELEMENT_NAMES_CN: Record<Element, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

export default function FourPillars({ pillars, onRequestReading }: FourPillarsProps) {
  const distribution = countElementDistribution(pillars);
  const total = 8; // 4 pillars × 2 (stem + branch)

  const pillarsArray = [
    { key: 'year' as const, label: '年柱', data: pillars.year },
    { key: 'month' as const, label: '月柱', data: pillars.month },
    { key: 'day' as const, label: '日柱', data: pillars.day },
    { key: 'hour' as const, label: '时柱', data: pillars.hour },
  ];

  return (
    <div className="w-full max-w-[900px] mx-auto">
      {/* Four Pillars Table */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-10 overflow-hidden"
      >
        {/* Pillar columns grid */}
        <div className="grid grid-cols-4 gap-1">
          {pillarsArray.map((pillar, index) => (
            <div key={pillar.key} className="relative">
              {/* Vertical divider between pillars */}
              {index > 0 && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-px bg-[rgba(255,255,255,0.06)]"
                />
              )}
              <div className="py-4 sm:py-5">
                <PillarColumn
                  label={pillar.label}
                  pillar={pillar.data}
                  index={index}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Five Elements Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        className="mt-8"
      >
        <p className="text-sm text-text-secondary mb-3">五行分布</p>

        {/* Element bar */}
        <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden flex">
          {ELEMENT_ORDER.map((element) => {
            const count = distribution[element];
            const width = total > 0 ? (count / total) * 100 : 0;
            return (
              <motion.div
                key={element}
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ delay: 1.0, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
                style={{ backgroundColor: ELEMENT_COLORS[element] }}
                className="h-full"
              />
            );
          })}
        </div>

        {/* Element Legend */}
        <div className="flex flex-wrap gap-2 mt-4">
          {ELEMENT_ORDER.map((element) => {
            const count = distribution[element];
            const color = ELEMENT_COLORS[element];
            return (
              <div
                key={element}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-sm"
                style={{
                  color,
                  backgroundColor: `${color}14`, // ~8% opacity
                }}
              >
                <span>{ELEMENT_NAMES_CN[element]}</span>
                <span className="font-mono">{count}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        className="flex justify-center mt-12"
      >
        <button
          onClick={onRequestReading}
          className="px-8 py-3.5 bg-white text-black text-base font-semibold rounded-pill transition-all duration-200 hover:bg-[#E5E5E5] hover:scale-[1.03] active:scale-[0.98]"
        >
          获取 AI 解读
        </button>
      </motion.div>
    </div>
  );
}
