/**
 * TalismanGallery — 64卦符咒海报设计预览画廊
 *
 * 用途：UI 设计评审，展示所有卦象的符咒海报效果
 * 支持：按八卦筛选、按尺寸切换、分数模拟
 */

import { useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, Download } from 'lucide-react';
import TalismanPoster from '../components/talisman/TalismanPoster';
import { GUA64_LIST } from '../data/gua64';
import { exportPosterToImage, downloadImage } from '../lib/exportPoster';

const TRIGRAMS = ['乾', '坤', '震', '巽', '坎', '离', '艮', '兑'] as const;

const SCORE_PRESETS = [
  { label: 'Great (95)', value: 95 },
  { label: 'Good (85)', value: 85 },
  { label: 'Fair (75)', value: 75 },
  { label: 'Neutral (55)', value: 55 },
  { label: 'Caution (45)', value: 45 },
];

const SIZE_PRESETS = [
  { label: 'Story 9:16', w: 360, h: 640 },
  { label: 'Feed 4:5', w: 400, h: 500 },
  { label: 'Web 3:4', w: 400, h: 533 },
];

export default function TalismanGallery() {
  const [selectedTrigram, setSelectedTrigram] = useState<string | 'all'>('all');
  const [score, setScore] = useState(85);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);
  const { w, h } = SIZE_PRESETS[sizeIdx];

  const filtered = useMemo(() => {
    if (selectedTrigram === 'all') return GUA64_LIST;
    return GUA64_LIST.filter((g) => g.upper === selectedTrigram);
  }, [selectedTrigram]);

  return (
    <div className="min-h-screen bg-surface-page text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-surface-page/90 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-gold tracking-wide">TALISMAN v9.1 DIGITAL MANUSCRIPT</h1>
              <p className="text-xs text-gold/40 mt-1">64 Hexagrams · Digital Manuscript Aesthetic · Gen-Z Ready</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* 八卦筛选 */}
              <div className="flex items-center gap-1 bg-surface-card rounded-lg p-1 border border-gold/10">
                <button
                  onClick={() => setSelectedTrigram('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedTrigram === 'all' ? 'bg-gold/15 text-gold' : 'text-gold/40 hover:text-gold/70'
                  }`}
                >
                  All 64
                </button>
                {TRIGRAMS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTrigram(t)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      selectedTrigram === t ? 'bg-gold/15 text-gold' : 'text-gold/40 hover:text-gold/70'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* 分数 */}
              <div className="flex items-center gap-1 bg-surface-card rounded-lg p-1 border border-gold/10">
                {SCORE_PRESETS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setScore(s.value)}
                    className={`px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                      score === s.value ? 'bg-seal/20 text-seal-light' : 'text-gold/30 hover:text-gold/60'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* 尺寸 */}
              <div className="flex items-center gap-1 bg-surface-card rounded-lg p-1 border border-gold/10">
                {SIZE_PRESETS.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setSizeIdx(i)}
                    className={`px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                      sizeIdx === i ? 'bg-gold/15 text-gold' : 'text-gold/30 hover:text-gold/60'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`p-2 rounded-lg border transition-all ${
                  showLabels ? 'bg-gold/10 border-gold/20 text-gold' : 'border-gold/10 text-gold/30'
                }`}
              >
                <Eye size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 text-[10px] text-gold/30">
            <span>Showing {filtered.length} of 64 hexagrams</span>
            <span>·</span>
            <span>Size: {w}×{h}</span>
            <span>·</span>
            <span>Score: {score}</span>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${w + 40}px, 1fr))` }}
        >
          {filtered.map((gua, i) => (
            <PosterCard
              key={gua.name}
              gua={gua}
              score={score}
              w={w}
              h={h}
              showLabels={showLabels}
              index={i}
              exporting={exporting}
              setExporting={setExporting}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Poster Card with Export ─── */
function PosterCard({
  gua,
  score,
  w,
  h,
  showLabels,
  index,
  exporting,
  setExporting,
}: {
  gua: (typeof GUA64_LIST)[0];
  score: number;
  w: number;
  h: number;
  showLabels: boolean;
  index: number;
  exporting: string | null;
  setExporting: (name: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(async () => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    setExporting(gua.name);
    try {
      const result = await exportPosterToImage(svg as SVGSVGElement, {
        format: 'png',
        scale: 2,
      });
      const filename = `talisman_${gua.name}_${score}.png`;
      downloadImage(result.url, filename, gua.name, score);
      URL.revokeObjectURL(result.url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('导出失败，请重试');
    } finally {
      setExporting(null);
    }
  }, [gua.name, score, setExporting]);

  const isExporting = exporting === gua.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.5) }}
      className="flex flex-col items-center gap-3 group"
    >
      <div
        ref={containerRef}
        className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-gold-lg transition-shadow"
        style={{ width: w, height: h, background: '#000' }}
      >
        <TalismanPoster hexagramName={gua.name} score={score} width={w} height={h} showSeal />
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`absolute top-2 right-2 z-10 p-1.5 rounded-md transition-all ${
            isExporting
              ? 'bg-gold/20 text-gold/50 cursor-wait'
              : 'bg-black/60 text-gold/80 opacity-0 group-hover:opacity-100 hover:bg-gold/20 hover:text-gold'
          }`}
          title="导出 PNG"
        >
          <Download size={12} />
        </button>
      </div>
      {showLabels && (
        <div className="text-center">
          <div className="text-xs font-medium text-gold/70">{gua.name}</div>
          <div className="text-[10px] text-gold/30">{gua.nameEn}</div>
          <div className="text-[9px] text-gold/20 mt-0.5">{gua.upper}☰ {gua.element}</div>
        </div>
      )}
    </motion.div>
  );
}
