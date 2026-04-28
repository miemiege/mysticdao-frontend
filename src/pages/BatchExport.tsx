import { useState, useRef, useCallback } from 'react';
import TalismanPoster from '../components/talisman/TalismanPoster';
import { GUA64_LIST } from '../data/gua64';
import { exportPosterToImage, downloadImage } from '../lib/exportPoster';

export default function BatchExportPage() {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [log, setLog] = useState<string>('');
  const shouldPause = useRef(false);
  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const waitWhilePaused = async () => {
    while (shouldPause.current) {
      await new Promise((r) => setTimeout(r, 200));
    }
  };

  const startExport = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsPaused(false);
    shouldPause.current = false;

    const startIndex = progress >= GUA64_LIST.length ? 0 : progress;
    if (startIndex === 0) setProgress(0);

    for (let i = startIndex; i < GUA64_LIST.length; i++) {
      await waitWhilePaused();

      const gua = GUA64_LIST[i];
      const container = containerRefs.current.get(gua.name);
      if (!container) {
        setLog(`跳过 ${gua.name}：容器未找到`);
        setProgress(i + 1);
        continue;
      }

      const svg = container.querySelector('svg');
      if (!svg) {
        setLog(`跳过 ${gua.name}：SVG 未找到`);
        setProgress(i + 1);
        continue;
      }

      try {
        const result = await exportPosterToImage(svg as SVGSVGElement, {
          format: 'png',
          scale: 2,
        });
        downloadImage(result.url, `talisman_${gua.name}.png`, gua.name);
        URL.revokeObjectURL(result.url);
        setLog(`已导出 ${i + 1}/64 — ${gua.name}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setLog(`导出失败 ${gua.name}：${msg}`);
      }

      setProgress(i + 1);
      // 防止浏览器卡顿，每帧之间留空
      await new Promise((r) => setTimeout(r, 500));
    }

    setIsRunning(false);
    setIsPaused(false);
    shouldPause.current = false;
  }, [isRunning, progress]);

  const togglePause = useCallback(() => {
    if (!isRunning) return;
    const next = !isPaused;
    setIsPaused(next);
    shouldPause.current = next;
  }, [isRunning, isPaused]);

  const resetExport = useCallback(() => {
    setProgress(0);
    setIsRunning(false);
    setIsPaused(false);
    shouldPause.current = false;
    setLog('');
  }, []);

  const setContainerRef = useCallback(
    (name: string) => (el: HTMLDivElement | null) => {
      if (el) {
        containerRefs.current.set(name, el);
      } else {
        containerRefs.current.delete(name);
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-black text-gold p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold tracking-widest text-gold">
          批量导出64卦符咒海报
        </h1>

        {/* 控制面板 */}
        <div className="bg-white/5 border border-gold/20 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-lg">
              进度：
              <span className="font-mono text-gold font-bold">
                {progress} / {GUA64_LIST.length}
              </span>
            </div>
            <div className="text-sm text-gold/60">
              {isPaused ? '已暂停' : isRunning ? '导出中…' : progress === GUA64_LIST.length ? '已完成' : '就绪'}
            </div>
          </div>

          {/* 进度条 */}
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gold h-full transition-all duration-300 ease-out"
              style={{ width: `${(progress / GUA64_LIST.length) * 100}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={startExport}
              disabled={isRunning && !isPaused}
              className="px-5 py-2 bg-gold text-black font-bold rounded hover:bg-gold/80 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {progress > 0 && progress < GUA64_LIST.length ? '继续导出' : '开始导出'}
            </button>
            <button
              onClick={togglePause}
              disabled={!isRunning}
              className="px-5 py-2 border border-gold text-gold font-bold rounded hover:bg-gold/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {isPaused ? '继续' : '暂停'}
            </button>
            <button
              onClick={resetExport}
              disabled={isRunning && !isPaused}
              className="px-5 py-2 border border-white/20 text-white/70 font-bold rounded hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              重置
            </button>
          </div>

          {log && (
            <div className="text-sm text-gold/70 font-mono bg-black/30 rounded p-3">
              {log}
            </div>
          )}
        </div>

        {/* 海报容器网格（缩小显示以减少视觉干扰） */}
        <div className="grid grid-cols-8 gap-2">
          {GUA64_LIST.map((gua) => (
            <div
              key={gua.name}
              ref={setContainerRef(gua.name)}
              className="relative bg-white/5 border border-gold/10 rounded overflow-hidden"
              style={{ width: '100%', minHeight: '80px' }}
            >
              <div className="scale-[0.15] origin-top-left" style={{ width: '600px', height: '960px' }}>
                <TalismanPoster hexagramName={gua.name} width={600} height={960} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 text-center text-[10px] text-gold/40 bg-black/60 py-0.5 truncate">
                {gua.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
