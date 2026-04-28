/**
 * Lantern Core Showcase — "离-A 灯核" Design Variant
 *
 * Dedicated page for the Li-A "Inner Lantern" visual treatment.
 * Displays the lantern-core variant of the Li (Fire) hexagram poster
 * at full resolution for design review and PNG export.
 */

import TalismanPoster from '../components/talisman/TalismanPoster';

export default function LanternCore() {
  return (
    <div className="min-h-screen bg-surface-page flex flex-col items-center justify-center py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gold tracking-wide">离-A 「灯核」</h1>
        <p className="text-sm text-gold/40 mt-2">Inner Lantern · Design Variant v9.1-lantern</p>
        <p className="text-xs text-gold/20 mt-1">
          灯笼光晕 · 火焰纹 · 竹骨竖线 · 阴爻卷曲 · 中央贴花印章 · 圆形压角章
        </p>
      </div>

      <div
        className="rounded-lg overflow-hidden shadow-2xl"
        style={{ background: '#1a1a1a', padding: 20 }}
      >
        <TalismanPoster
          hexagramName="离为火"
          score={85}
          width={400}
          height={640}
          showSeal
          cyberMode
          variant="lantern-core"
        />
      </div>

      <div className="mt-8 max-w-md text-center">
        <p className="text-xs text-gold/30 leading-relaxed">
          Energy: 光明 · 扩散 · 温暖
        </p>
        <p className="text-sm text-gold/50 mt-2 font-script italic">
          "The dark is just the light taking a breath."
        </p>
      </div>
    </div>
  );
}
