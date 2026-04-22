import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  Smartphone,
  MousePointerClick,
  RotateCcw,
  Sparkles,
  Palette,
  Hash,
  Compass,
} from 'lucide-react';
import {
  directionData,
  directions,
  getDirectionFromAngle,
} from '@/components/fengshui/fengshuiData';

const GOLD = '#c8a45c';
const GOLD_GLOW = 'rgba(200, 164, 92, 0.15)';

interface WebCompassProps {
  onClose?: () => void;
}

const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// ─── Inline useCompass (sensor-driven) ───────────────────────────
function useCompass() {
  const [heading, setHeading] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let h: number;
    const anyEvent = event as any;
    if (anyEvent.webkitCompassHeading !== undefined) {
      h = anyEvent.webkitCompassHeading;
    } else if (event.alpha !== null) {
      h = 360 - event.alpha;
    } else {
      return;
    }
    setHeading(((h % 360) + 360) % 360);
    if ('webkitCompassAccuracy' in event) {
      setAccuracy(anyEvent.webkitCompassAccuracy);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  const requestPermission = useCallback(async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response !== 'granted') setError('传感器权限被拒绝');
      } catch {
        setError('请求传感器权限失败');
      }
    }
  }, []);

  const startCalibration = useCallback(() => {
    setIsCalibrating(true);
    setTimeout(() => setIsCalibrating(false), 5000);
  }, []);

  return { heading, accuracy, isCalibrating, error, requestPermission, startCalibration };
}

// ─── Inline useCompassPC (mouse/touch drag) ──────────────────────
function useCompassPC() {
  const [heading, setHeading] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const startAngleRef = useRef<number>(0);
  const startHeadingRef = useRef<number>(0);
  const centerRef = useRef<{ x: number; y: number } | null>(null);

  const getAngle = useCallback((clientX: number, clientY: number): number => {
    if (!centerRef.current) return 0;
    const dx = clientX - centerRef.current.x;
    const dy = clientY - centerRef.current.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  }, []);

  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startAngleRef.current = getAngle(clientX, clientY);
    startHeadingRef.current = heading;
    setIsDragging(true);
  }, [heading, getAngle]);

  const onDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const angle = getAngle(clientX, clientY);
    const delta = angle - startAngleRef.current;
    const newHeading = ((startHeadingRef.current - delta) % 360 + 360) % 360;
    setHeading(newHeading);
  }, [isDragging, getAngle]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  return { heading, isDragging, startDrag, onDrag, endDrag };
}

// ─── Main Component ──────────────────────────────────────────────
export default function WebCompass({ onClose }: WebCompassProps) {
  const [mode, setMode] = useState<'sensor' | 'manual'>(isMobileDevice ? 'sensor' : 'manual');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showCalibrate, setShowCalibrate] = useState(false);

  const compassMobile = useCompass();
  const compassPC = useCompassPC();

  const isSensorMode = mode === 'sensor';
  const heading = isSensorMode ? compassMobile.heading : compassPC.heading;
  const currentKey = getDirectionFromAngle(heading);
  const currentDir = directions.find((d) => d.key === currentKey);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === 'sensor' ? 'manual' : 'sensor'));
  }, []);

  const handleCalibrate = useCallback(() => {
    if (isSensorMode) {
      compassMobile.startCalibration();
      setShowCalibrate(true);
    }
  }, [isSensorMode, compassMobile]);

  useEffect(() => {
    if (!showCalibrate) return;
    const t = setTimeout(() => setShowCalibrate(false), 5000);
    return () => clearTimeout(t);
  }, [showCalibrate]);

  const diskSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 320 : 400;
  const radius = diskSize / 2 - 20;

  // Generate tick marks (360° every 5°)
  const ticks = useMemo(() => {
    const result: { angle: number; isMajor: boolean }[] = [];
    for (let i = 0; i < 360; i += 5) {
      result.push({ angle: i, isMajor: i % 30 === 0 });
    }
    return result;
  }, []);

  const handleSectorClick = useCallback((key: string) => {
    setSelectedKey(key);
  }, []);

  const closePanel = useCallback(() => {
    setSelectedKey(null);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: '#000000' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
            <span className="text-sm">返回</span>
          </button>
        )}

        <div className="flex-1 flex flex-col items-center">
          <motion.div
            className="text-5xl md:text-6xl font-bold tabular-nums"
            style={{ color: GOLD }}
            key={Math.round(heading)}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {Math.round(heading)}°
          </motion.div>
          <div className="text-lg md:text-xl text-white/80 mt-1">
            {currentDir ? `${currentDir.label} · ${directionData[currentKey]?.chinese || ''}` : currentKey}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isMobileDevice && (
            <button
              onClick={toggleMode}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition-colors"
              style={{
                borderColor: 'rgba(200,164,92,0.4)',
                color: GOLD,
                backgroundColor: 'rgba(200,164,92,0.1)',
              }}
            >
              {isSensorMode ? <Smartphone size={14} /> : <MousePointerClick size={14} />}
              {isSensorMode ? '传感器' : '手动'}
            </button>
          )}
          {isMobileDevice && isSensorMode && (
            <button
              onClick={handleCalibrate}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition-colors"
              style={{
                borderColor: 'rgba(200,164,92,0.4)',
                color: GOLD,
                backgroundColor: 'rgba(200,164,92,0.1)',
              }}
            >
              <RotateCcw size={14} />
              校准
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors ml-1">
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Calibration Overlay */}
      <AnimatePresence>
        {showCalibrate && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCalibrate(false)}
          >
            <svg width="200" height="120" viewBox="0 0 200 120" className="mb-6">
              <path
                d="M 20 60 C 20 20, 80 20, 100 60 C 120 100, 180 100, 180 60 C 180 20, 120 20, 100 60 C 80 100, 20 100, 20 60"
                fill="none"
                stroke={GOLD}
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.5"
              />
              <circle r="6" fill={GOLD} filter="drop-shadow(0 0 8px rgba(200,164,92,0.8))">
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path="M 20 60 C 20 20, 80 20, 100 60 C 120 100, 180 100, 180 60 C 180 20, 120 20, 100 60 C 80 100, 20 100, 20 60"
                />
              </circle>
            </svg>
            <div className="text-white text-center px-8">
              <div className="text-lg font-medium mb-2" style={{ color: GOLD }}>
                正在校准指南针
              </div>
              <div className="text-sm text-white/60">
                请将设备在空中画 8 字以校准指南针
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compass Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Fixed North Pointer (golden triangle at top) */}
        <div
          className="absolute"
          style={{
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: `16px solid ${GOLD}`,
            top: '8%',
            zIndex: 10,
            filter: 'drop-shadow(0 0 6px rgba(200,164,92,0.5))',
          }}
        />

        {/* Rotating Compass Disk */}
        <motion.div
          className="relative rounded-full cursor-grab active:cursor-grabbing"
          style={{
            width: diskSize,
            height: diskSize,
            border: `1px solid rgba(200,164,92,0.3)`,
            boxShadow: `0 0 40px rgba(200,164,92,0.1), inset 0 0 60px rgba(200,164,92,0.05)`,
          }}
          animate={{ rotate: -heading }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          {...(!isSensorMode ? {
            onMouseDown: compassPC.startDrag,
            onMouseMove: compassPC.onDrag,
            onMouseUp: compassPC.endDrag,
            onMouseLeave: compassPC.endDrag,
            onTouchStart: compassPC.startDrag,
            onTouchMove: compassPC.onDrag,
            onTouchEnd: compassPC.endDrag,
          } : {})}
        >
          <svg
            width={diskSize}
            height={diskSize}
            viewBox={`0 0 ${diskSize} ${diskSize}`}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Tick marks */}
            {ticks.map((tick, i) => {
              const inner = tick.isMajor ? radius - 20 : radius - 10;
              const outer = radius;
              const rad = (tick.angle * Math.PI) / 180;
              const cx = diskSize / 2;
              const cy = diskSize / 2;
              return (
                <line
                  key={i}
                  x1={cx + Math.cos(rad) * inner}
                  y1={cy + Math.sin(rad) * inner}
                  x2={cx + Math.cos(rad) * outer}
                  y2={cy + Math.sin(rad) * outer}
                  stroke={tick.isMajor ? GOLD : 'rgba(255,255,255,0.2)'}
                  strokeWidth={tick.isMajor ? 2 : 1}
                />
              );
            })}

            {/* 8 Direction Labels */}
            {directions.map((dir) => {
              const rad = (dir.angle * Math.PI) / 180;
              const cx = diskSize / 2 + Math.cos(rad) * (radius - 36);
              const cy = diskSize / 2 + Math.sin(rad) * (radius - 36);
              const isActive = dir.key === currentKey;
              return (
                <text
                  key={dir.key}
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isActive ? GOLD : 'rgba(255,255,255,0.6)'}
                  fontSize={isActive ? 16 : 13}
                  fontWeight={isActive ? 700 : 500}
                  style={{ userSelect: 'none' }}
                >
                  {dir.label}
                </text>
              );
            })}

            {/* Inner sectors — 8 slices, clickable via transparent overlay */}
            {directions.map((dir, i) => {
              const startAngle = i * 45 - 22.5;
              const endAngle = i * 45 + 22.5;
              const isActive = dir.key === currentKey;
              const r = radius - 50;
              const cx = diskSize / 2;
              const cy = diskSize / 2;

              const toRad = (a: number) => (a * Math.PI) / 180;
              const x1 = cx + Math.cos(toRad(startAngle)) * r;
              const y1 = cy + Math.sin(toRad(startAngle)) * r;
              const x2 = cx + Math.cos(toRad(endAngle)) * r;
              const y2 = cy + Math.sin(toRad(endAngle)) * r;

              const largeArc = endAngle - startAngle > 180 ? 1 : 0;
              const path = [
                `M ${cx} ${cy}`,
                `L ${x1} ${y1}`,
                `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
                'Z',
              ].join(' ');

              const midAngle = i * 45;
              const labelR = r * 0.65;
              const lx = cx + Math.cos(toRad(midAngle)) * labelR;
              const ly = cy + Math.sin(toRad(midAngle)) * labelR;

              return (
                <g key={dir.key}>
                  <path
                    d={path}
                    fill={isActive ? GOLD_GLOW : 'rgba(255,255,255,0.02)'}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={1}
                    style={{ pointerEvents: 'all', cursor: 'pointer' }}
                    onClick={() => handleSectorClick(dir.key)}
                  />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isActive ? GOLD : 'rgba(255,255,255,0.5)'}
                    fontSize={12}
                    fontWeight={isActive ? 600 : 400}
                    style={{ userSelect: 'none', pointerEvents: 'none' }}
                  >
                    {directionData[dir.key]?.chinese || dir.label}
                  </text>
                </g>
              );
            })}

            {/* Center dot */}
            <circle cx={diskSize / 2} cy={diskSize / 2} r={4} fill={GOLD} opacity={0.8} />
          </svg>
        </motion.div>

        {/* Manual mode hint */}
        {!isSensorMode && (
          <motion.div
            className="absolute bottom-24 text-sm"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {isMobileDevice ? '滑动旋转罗盘' : '拖拽罗盘旋转'}
          </motion.div>
        )}
      </div>

      {/* Bottom Detail Panel */}
      <AnimatePresence>
        {selectedKey && directionData[selectedKey] && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-30"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div
              className="relative px-6 py-6 pb-10 md:px-10 md:pb-12"
              style={{
                backgroundColor: 'rgba(17, 17, 17, 0.95)',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderTop: `1px solid rgba(200,164,92,0.2)`,
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Close button */}
              <button
                onClick={closePanel}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>

              {(() => {
                const info = directionData[selectedKey];
                const dirObj = directions.find((d) => d.key === selectedKey);
                return (
                  <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <Compass size={24} style={{ color: GOLD }} />
                      <div>
                        <div className="text-xl font-bold" style={{ color: GOLD }}>
                          {info.chinese} · {info.trigramChar}卦
                        </div>
                        <div className="text-xs text-white/40 mt-0.5">
                          {dirObj?.label} — {info.meaning}
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div
                        className="flex flex-col items-center p-3 rounded-xl"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      >
                        <span className="text-xs text-white/40 mb-1">五行</span>
                        <span className="text-sm font-medium text-white">{info.element}</span>
                      </div>
                      <div
                        className="flex flex-col items-center p-3 rounded-xl"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      >
                        <span className="text-xs text-white/40 mb-1 flex items-center gap-1">
                          <Palette size={10} /> 幸运色
                        </span>
                        <span className="text-sm font-medium text-white text-center">
                          {info.colors[0]}
                        </span>
                      </div>
                      <div
                        className="flex flex-col items-center p-3 rounded-xl"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      >
                        <span className="text-xs text-white/40 mb-1 flex items-center gap-1">
                          <Hash size={10} /> 幸运数
                        </span>
                        <span className="text-2xl font-bold" style={{ color: GOLD }}>
                          {info.numbers[0]}
                        </span>
                      </div>
                    </div>

                    {/* Advice */}
                    <div
                      className="flex gap-2 p-4 rounded-xl"
                      style={{ backgroundColor: 'rgba(200,164,92,0.08)' }}
                    >
                      <Sparkles size={16} style={{ color: GOLD, marginTop: 2, flexShrink: 0 }} />
                      <p className="text-sm text-white/80 leading-relaxed">{info.advice}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
