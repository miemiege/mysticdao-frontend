import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Lock,
  Unlock,
  Bookmark,
  History,
  Copy,
  Sparkles,
  X,
  Navigation,
  MousePointer2,
} from 'lucide-react';
import { directions, getDirectionFromAngle } from '@/components/fengshui/fengshuiData';
import {
  mountains24,
  getMountainFromAngle,
  getMountainsByDirection,
  getTrigramForDirection,
} from './compassData';

// ═══════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════
const GOLD = '#c8a45c';
const GOLD_LIGHT = '#e8c87a';
const GOLD_DARK = '#8a7340';
const BG = '#000000';
const SNAP_THRESHOLD = 7.5;

// ═══════════════════════════════════════════════════════════════════════
// isMobileDevice
// ═══════════════════════════════════════════════════════════════════════
function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Props
// ═══════════════════════════════════════════════════════════════════════
interface WebCompassProps {
  onClose?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════
interface HistoryRecord {
  id: string;
  angle: number;
  direction: string;
  mountain: string;
  trigram: string;
  timestamp: number;
}

interface CompassState {
  heading: number;
  accuracy: number | null;
  supported: boolean;
  error: string | null;
}

// ═══════════════════════════════════════════════════════════════════════
// useCompass hook (传感器模式)
// ═══════════════════════════════════════════════════════════════════════
function useCompass(): {
  heading: number;
  accuracy: number | null;
  supported: boolean;
  error: string | null;
} {
  const [state, setState] = useState<CompassState>({
    heading: 0,
    accuracy: null,
    supported: false,
    error: null,
  });

  useEffect(() => {
    if (!isMobileDevice()) {
      setState((s) => ({ ...s, error: '非移动设备' }));
      return;
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading = 0;
      if ((e as any).webkitCompassHeading) {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        heading = 360 - e.alpha;
      }
      setState({
        heading: ((heading % 360) + 360) % 360,
        accuracy: e.alpha !== null ? 5 : null,
        supported: true,
        error: null,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation);
      setState((s) => ({ ...s, supported: true }));
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  return {
    heading: state.heading,
    accuracy: state.accuracy,
    supported: state.supported,
    error: state.error,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// useCompassPC hook (手动拖拽模式)
// ═══════════════════════════════════════════════════════════════════════
function useCompassPC(): {
  heading: number;
  isDragging: boolean;
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
} {
  const [heading, setHeading] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startHeadingRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeadingRef.current = heading;
  }, [heading]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const deltaY = startYRef.current - e.clientY;
    const newHeading = ((startHeadingRef.current + deltaY * 2) % 360 + 360) % 360;
    setHeading(newHeading);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
    startHeadingRef.current = heading;
  }, [heading]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    const deltaY = startYRef.current - e.touches[0].clientY;
    const newHeading = ((startHeadingRef.current + deltaY * 2) % 360 + 360) % 360;
    setHeading(newHeading);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    heading,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Helper: 获取最近24山角度
// ═══════════════════════════════════════════════════════════════════════
function getNearestMountainAngle(angle: number): number {
  const normalized = ((angle % 360) + 360) % 360;
  let minDiff = Infinity;
  let nearestAngle = 0;
  for (const m of mountains24) {
    const diff = Math.abs(((normalized - m.angle + 180) % 360) - 180);
    if (diff < minDiff) {
      minDiff = diff;
      nearestAngle = m.angle;
    }
  }
  return nearestAngle;
}

// ═══════════════════════════════════════════════════════════════════════
// Helper: Signal bars
// ═══════════════════════════════════════════════════════════════════════
function getSignalBars(accuracy: number | null): number {
  if (accuracy === null) return 0;
  if (accuracy < 5) return 3;
  if (accuracy < 15) return 2;
  if (accuracy < 30) return 1;
  return 0;
}

// ═══════════════════════════════════════════════════════════════════════
// Helper: Format date
// ═══════════════════════════════════════════════════════════════════════
function formatDate(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ═══════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════
function WebCompass({ onClose }: WebCompassProps) {
  const [isSensorMode, setIsSensorMode] = useState(isMobileDevice());
  const [locked, setLocked] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFengshui, setShowFengshui] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [copied, setCopied] = useState(false);
  const [headingSnapshot, setHeadingSnapshot] = useState(0);

  const compass = useCompass();
  const pcCompass = useCompassPC();

  // Heading from active mode
  const rawHeading = isSensorMode ? compass.heading : pcCompass.heading;

  // Animate heading transitions
  const animatedHeading = useMotionValue(rawHeading);
  const negatedHeading = useTransform(animatedHeading, (v) => -v);

  useEffect(() => {
    if (!locked) {
      animate(animatedHeading, rawHeading, {
        duration: 0.4,
        ease: 'easeOut',
      });
    }
  }, [rawHeading, locked, animatedHeading]);

  // Snap on drag end
  useEffect(() => {
    if (!isSensorMode && !pcCompass.isDragging && !locked) {
      const currentVal = animatedHeading.get();
      const snapAngle = getNearestMountainAngle(currentVal);
      const diff = Math.abs(((currentVal - snapAngle + 180) % 360) - 180);
      if (diff <= SNAP_THRESHOLD) {
        animate(animatedHeading, snapAngle, {
          duration: 0.3,
          ease: 'easeOut',
        });
      }
    }
  }, [pcCompass.isDragging, isSensorMode, locked, animatedHeading]);

  // Snapshot heading when locked
  useEffect(() => {
    if (locked) {
      setHeadingSnapshot(rawHeading);
    }
  }, [locked, rawHeading]);

  const currentHeading = locked ? headingSnapshot : rawHeading;
  const currentDirectionKey = getDirectionFromAngle(currentHeading);
  const currentDirection = directions.find((d) => d.key === currentDirectionKey) || directions[0];
  const currentMountain = getMountainFromAngle(currentHeading);
  const trigramInfo = getTrigramForDirection(currentDirectionKey);

  // Signal bars
  const signalBars = getSignalBars(compass.accuracy);

  // ═════════════════════════════════════════════════════════════════════
  // Memoized compass positions
  // ═════════════════════════════════════════════════════════════════════
  const size = 320;
  const center = size / 2;
  const radius = 130;

  const mountainPositions = useMemo(() => {
    return mountains24.map((m) => {
      const rad = ((m.angle - 90) * Math.PI) / 180;
      const r = radius + 28;
      return {
        ...m,
        x: center + r * Math.cos(rad),
        y: center + r * Math.sin(rad),
      };
    });
  }, []);

  const directionPositions = useMemo(() => {
    return directions.map((d) => {
      const rad = ((d.angle - 90) * Math.PI) / 180;
      return {
        ...d,
        x: center + radius * Math.cos(rad),
        y: center + radius * Math.sin(rad),
      };
    });
  }, []);

  // ═════════════════════════════════════════════════════════════════════
  // Load history from localStorage
  // ═════════════════════════════════════════════════════════════════════
  useEffect(() => {
    try {
      const saved = localStorage.getItem('compass-history');
      if (saved) {
        const parsed = JSON.parse(saved) as HistoryRecord[];
        setHistory(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((records: HistoryRecord[]) => {
    setHistory(records);
    try {
      localStorage.setItem('compass-history', JSON.stringify(records));
    } catch { /* ignore */ }
  }, []);

  // Handle save current direction
  const handleSave = useCallback(() => {
    const record: HistoryRecord = {
      id: Date.now().toString(),
      angle: Math.round(currentHeading),
      direction: currentDirection.label,
      mountain: currentMountain.name,
      trigram: trigramInfo.trigram,
      timestamp: Date.now(),
    };
    const newHistory = [record, ...history].slice(0, 20);
    saveHistory(newHistory);
  }, [currentHeading, currentDirection, currentMountain, trigramInfo, history, saveHistory]);

  // Handle copy
  const handleCopy = useCallback(async () => {
    const text = `方向：${currentDirection.label} · ${trigramInfo.trigram}卦 | 角度：${Math.round(currentHeading)}° | ${formatDate(Date.now())}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }, [currentDirection, trigramInfo, currentHeading]);

  // Handle click history item
  const handleHistoryClick = useCallback((record: HistoryRecord) => {
    setShowHistory(false);
    if (isSensorMode) {
      setIsSensorMode(false);
    }
    animate(animatedHeading, record.angle, {
      duration: 0.4,
      ease: 'easeOut',
    });
  }, [isSensorMode, animatedHeading]);

  // Delete history item
  const handleDeleteHistory = useCallback((id: string) => {
    const newHistory = history.filter((h) => h.id !== id);
    saveHistory(newHistory);
  }, [history, saveHistory]);

  // Toggle lock
  const toggleLock = useCallback(() => {
    setLocked((prev) => !prev);
  }, []);

  // Mode switch
  const switchMode = useCallback((sensor: boolean) => {
    setIsSensorMode(sensor);
    setLocked(false);
  }, []);

  // ═════════════════════════════════════════════════════════════════════
  // Render
  // ═════════════════════════════════════════════════════════════════════
  return (
    <div
      className="relative flex flex-col items-center w-full min-h-screen overflow-hidden select-none"
      style={{ backgroundColor: BG, color: GOLD }}
    >
      {/* ─── 顶部信息栏 ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center pt-6 pb-2 z-10 relative w-full">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full transition-all hover:scale-110"
            style={{ color: GOLD_DARK }}
          >
            <X size={22} />
          </button>
        )}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-4xl font-bold tracking-wider" style={{ color: GOLD_LIGHT }}>
            {Math.round(currentHeading)}°
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm" style={{ color: GOLD }}>
          <span className="text-base font-medium">{currentDirection.label}</span>
          <span>·</span>
          <span>{trigramInfo.trigram}卦</span>
          <span>{trigramInfo.trigramChar}</span>
          <span>·</span>
          <span>{trigramInfo.element}行</span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: GOLD_DARK }}>
          <span>{currentMountain.name}</span>
          <span>·</span>
          <span
            style={{
              color: currentMountain.auspicious === '吉' ? '#4ade80'
                : currentMountain.auspicious === '凶' ? '#f87171' : GOLD,
            }}
          >
            {currentMountain.auspicious}
          </span>
        </div>

        {/* 传感器信号 */}
        {isSensorMode && (
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-sm"
                style={{
                  width: 4,
                  height: 4 + i * 3,
                  backgroundColor: i <= signalBars ? GOLD : GOLD_DARK,
                  opacity: i <= signalBars ? 1 : 0.25,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
            <span className="ml-1 text-xs" style={{ color: GOLD_DARK }}>
              {compass.accuracy !== null ? `${Math.round(compass.accuracy)}°` : '无信号'}
            </span>
          </div>
        )}
      </div>

      {/* ─── 罗盘主体 (SVG) ────────────────────────────────────── */}
      <motion.div
        className="relative flex items-center justify-center my-4"
        style={{
          rotate: negatedHeading,
          cursor: !isSensorMode ? (pcCompass.isDragging ? 'grabbing' : 'grab') : 'default',
        }}
        {...(!isSensorMode && !locked ? pcCompass.handlers : {})}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: 'visible' }}
        >
          {/* CSS Animations */}
          <style>{`
            @keyframes orbitRotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes breathe {
              0%, 100% { filter: drop-shadow(0 0 8px rgba(200, 164, 92, 0.15)); }
              50% { filter: drop-shadow(0 0 22px rgba(200, 164, 92, 0.4)); }
            }
            .breathe-ring {
              animation: breathe 3s ease-in-out infinite;
            }
            .dir-text {
              transition: all 0.25s ease;
              cursor: default;
            }
            .dir-text:hover {
              font-size: 16px;
              filter: drop-shadow(0 0 6px rgba(200, 164, 92, 0.9));
            }
          `}</style>

          {/* 星轨环 - 外虚线旋转环 */}
          <g
            style={{
              transformOrigin: `${center}px ${center}px`,
              animation: 'orbitRotate 30s linear infinite',
            }}
          >
            <circle
              cx={center}
              cy={center}
              r={radius + 50}
              fill="none"
              stroke={GOLD}
              strokeWidth="1"
              strokeDasharray="6 8"
              opacity={0.35}
            />
            <circle
              cx={center}
              cy={center}
              r={radius + 42}
              fill="none"
              stroke={GOLD}
              strokeWidth="0.5"
              strokeDasharray="3 12"
              opacity={0.25}
            />
          </g>

          {/* 呼吸光环背景 */}
          <circle
            cx={center}
            cy={center}
            r={radius + 35}
            fill="none"
            stroke={GOLD}
            strokeWidth="1"
            opacity={0.15}
            className="breathe-ring"
          />

          {/* 罗盘盘面 */}
          <defs>
            <radialGradient id="compassBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1508" />
              <stop offset="70%" stopColor="#0a0804" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
            <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.12" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity="0.55" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 盘面背景 */}
          <circle cx={center} cy={center} r={radius + 20} fill="url(#compassBg)" stroke={GOLD_DARK} strokeWidth="1" />
          <circle cx={center} cy={center} r={radius + 20} fill="url(#goldGlow)" />

          {/* 主刻度环 */}
          <circle cx={center} cy={center} r={radius} fill="none" stroke={GOLD} strokeWidth="1.5" opacity={0.6} />
          <circle cx={center} cy={center} r={radius - 25} fill="none" stroke={GOLD_DARK} strokeWidth="0.5" opacity={0.4} />
          <circle cx={center} cy={center} r={28} fill="none" stroke={GOLD} strokeWidth="1" opacity={0.3} />

          {/* 中心点 */}
          <circle cx={center} cy={center} r={4} fill={GOLD} />
          <circle cx={center} cy={center} r={2} fill="#fff" />

          {/* 刻度线 (每5°) */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = i * 5;
            const rad = ((angle - 90) * Math.PI) / 180;
            const isMain = angle % 15 === 0;
            const isSub = angle % 45 === 0;
            const innerR = isSub ? radius - 20 : isMain ? radius - 12 : radius - 6;
            return (
              <line
                key={`tick-${i}`}
                x1={center + innerR * Math.cos(rad)}
                y1={center + innerR * Math.sin(rad)}
                x2={center + radius * Math.cos(rad)}
                y2={center + radius * Math.sin(rad)}
                stroke={isSub ? GOLD_LIGHT : GOLD}
                strokeWidth={isSub ? 1.5 : isMain ? 1 : 0.5}
                opacity={isSub ? 0.9 : isMain ? 0.6 : 0.3}
              />
            );
          })}

          {/* 8主方向文字 */}
          {directionPositions.map((d) => (
            <text
              key={d.key}
              x={d.x}
              y={d.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={d.key === currentDirection.key ? GOLD_LIGHT : GOLD}
              fontSize={d.key === currentDirection.key ? 18 : 14}
              fontWeight={d.key === currentDirection.key ? 'bold' : 'normal'}
              className="dir-text"
              style={{ transformOrigin: `${d.x}px ${d.y}px` }}
            >
              {d.label}
            </text>
          ))}

          {/* 24山文字 */}
          {mountainPositions.map((m) => (
            <text
              key={m.id}
              x={m.x}
              y={m.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={m.id === currentMountain.id ? GOLD_LIGHT : GOLD_DARK}
              fontSize={m.id === currentMountain.id ? 11 : 9}
              fontWeight={m.id === currentMountain.id ? 'bold' : 'normal'}
              opacity={0.85}
            >
              {m.name.replace('山', '')}
            </text>
          ))}

          {/* 卦象符号 - 内圈 */}
          {directionPositions.map((d) => {
            const rad = ((d.angle - 90) * Math.PI) / 180;
            const r = radius - 36;
            const trigramChar = getTrigramForDirection(d.key).trigramChar;
            return (
              <text
                key={`yao-${d.key}`}
                x={center + r * Math.cos(rad)}
                y={center + r * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={GOLD_DARK}
                fontSize={10}
                opacity={0.6}
              >
                {trigramChar}
              </text>
            );
          })}

          {/* 光束射线 - 随盘面旋转 */}
          <polygon
            points={`${center - 3},${center} ${center + 3},${center} ${center},${center - radius + 15}`}
            fill="url(#beamGrad)"
            opacity={0.5}
          />
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - radius + 15}
            stroke={GOLD_LIGHT}
            strokeWidth="1.5"
            opacity={0.6}
          />

          {/* 指针 (顶部固定指向，盘面旋转) */}
          <polygon
            points={`${center},${center - radius + 35} ${center - 6},${center + 15} ${center + 6},${center + 15}`}
            fill={GOLD}
            opacity={0.85}
          />
          <polygon
            points={`${center},${center + radius - 35} ${center - 5},${center - 10} ${center + 5},${center - 10}`}
            fill={GOLD_DARK}
            opacity={0.5}
          />

          {/* 模式指示标签 */}
          <text
            x={center}
            y={center + radius + 38}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={GOLD_DARK}
            fontSize={10}
            opacity={0.5}
          >
            {isSensorMode ? '传感器模式' : '手动模式'}
          </text>
        </svg>
      </motion.div>

      {/* ─── 当前24山信息卡片 ───────────────────────────────────── */}
      <div
        className="flex flex-col items-center px-5 py-3 mx-4 rounded-lg w-full max-w-xs"
        style={{
          border: `1px solid ${GOLD_DARK}`,
          backgroundColor: 'rgba(200, 164, 92, 0.06)',
        }}
      >
        <div className="flex items-center gap-2 text-sm mb-1 flex-wrap justify-center">
          <span className="font-bold" style={{ color: GOLD_LIGHT }}>{currentMountain.name}</span>
          <span>·</span>
          <span>{currentMountain.trigramChar}</span>
          <span>{currentMountain.trigram}卦</span>
          <span>·</span>
          <span>{currentMountain.element}</span>
          <span>·</span>
          <span
            className="font-bold"
            style={{
              color: currentMountain.auspicious === '吉' ? '#4ade80'
                : currentMountain.auspicious === '凶' ? '#f87171' : GOLD,
            }}
          >
            {currentMountain.auspicious}
          </span>
        </div>
        <p className="text-xs text-center leading-relaxed" style={{ color: GOLD_DARK }}>
          {currentMountain.advice}
        </p>
      </div>

      {/* ─── 模式切换按钮 ───────────────────────────────────────── */}
      <div className="flex items-center gap-2 mt-4 mb-2">
        <button
          onClick={() => switchMode(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-300"
          style={{
            border: `1px solid ${isSensorMode ? GOLD : GOLD_DARK}`,
            backgroundColor: isSensorMode ? 'rgba(200, 164, 92, 0.15)' : 'transparent',
            color: isSensorMode ? GOLD_LIGHT : GOLD_DARK,
          }}
        >
          <Navigation size={12} />
          传感器
        </button>
        <button
          onClick={() => switchMode(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-300"
          style={{
            border: `1px solid ${!isSensorMode ? GOLD : GOLD_DARK}`,
            backgroundColor: !isSensorMode ? 'rgba(200, 164, 92, 0.15)' : 'transparent',
            color: !isSensorMode ? GOLD_LIGHT : GOLD_DARK,
          }}
        >
          <MousePointer2 size={12} />
          手动
        </button>
      </div>

      {/* ─── 底部按钮栏 ─────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-3 mt-3 mb-4 z-20">
        {/* 锁定 */}
        <button
          onClick={toggleLock}
          title={locked ? '解锁' : '锁定'}
          className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
          style={{
            width: 36,
            height: 36,
            border: `1.5px solid ${locked ? GOLD_LIGHT : GOLD_DARK}`,
            backgroundColor: locked ? 'rgba(200, 164, 92, 0.2)' : 'rgba(0,0,0,0.5)',
            color: locked ? GOLD_LIGHT : GOLD,
          }}
        >
          {locked ? <Lock size={16} /> : <Unlock size={16} />}
        </button>

        {/* 保存 */}
        <button
          onClick={handleSave}
          title="保存当前方向"
          className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
          style={{
            width: 36,
            height: 36,
            border: `1.5px solid ${GOLD_DARK}`,
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: GOLD,
          }}
        >
          <Bookmark size={16} />
        </button>

        {/* 历史 */}
        <button
          onClick={() => { setShowHistory(true); setShowFengshui(false); }}
          title="查看历史"
          className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
          style={{
            width: 36,
            height: 36,
            border: `1.5px solid ${showHistory ? GOLD_LIGHT : GOLD_DARK}`,
            backgroundColor: showHistory ? 'rgba(200, 164, 92, 0.2)' : 'rgba(0,0,0,0.5)',
            color: showHistory ? GOLD_LIGHT : GOLD,
          }}
        >
          <History size={16} />
        </button>

        {/* 复制 */}
        <button
          onClick={handleCopy}
          title="复制方向信息"
          className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 relative"
          style={{
            width: 36,
            height: 36,
            border: `1.5px solid ${copied ? '#4ade80' : GOLD_DARK}`,
            backgroundColor: copied ? 'rgba(74, 222, 128, 0.15)' : 'rgba(0,0,0,0.5)',
            color: copied ? '#4ade80' : GOLD,
          }}
        >
          <Copy size={16} />
        </button>

        {/* 风水分析 */}
        <button
          onClick={() => { setShowFengshui(true); setShowHistory(false); }}
          title="风水分析"
          className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
          style={{
            width: 36,
            height: 36,
            border: `1.5px solid ${showFengshui ? GOLD_LIGHT : GOLD_DARK}`,
            backgroundColor: showFengshui ? 'rgba(200, 164, 92, 0.2)' : 'rgba(0,0,0,0.5)',
            color: showFengshui ? GOLD_LIGHT : GOLD,
          }}
        >
          <Sparkles size={16} />
        </button>
      </div>

      {/* ─── 复制成功提示 ───────────────────────────────────────── */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs z-50"
            style={{
              backgroundColor: 'rgba(74, 222, 128, 0.15)',
              border: '1px solid rgba(74, 222, 128, 0.4)',
              color: '#4ade80',
            }}
          >
            已复制到剪贴板
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 历史面板 ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-40 max-h-[60vh] overflow-y-auto rounded-t-2xl"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              borderTop: `1px solid ${GOLD_DARK}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-3 sticky top-0"
              style={{
                backgroundColor: 'rgba(0,0,0,0.95)',
                borderBottom: `1px solid ${GOLD_DARK}`,
              }}
            >
              <span className="text-sm font-bold" style={{ color: GOLD_LIGHT }}>历史记录</span>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded-full transition-all hover:scale-110"
                style={{ color: GOLD_DARK }}
              >
                <X size={18} />
              </button>
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center py-10" style={{ color: GOLD_DARK }}>
                <History size={32} opacity={0.3} />
                <p className="mt-2 text-sm">暂无保存的记录</p>
              </div>
            ) : (
              <div className="px-4 py-2 space-y-2">
                {history.map((record) => (
                  <motion.div
                    key={record.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:brightness-125"
                    style={{
                      border: `1px solid ${GOLD_DARK}`,
                      backgroundColor: 'rgba(200, 164, 92, 0.05)',
                    }}
                    onClick={() => handleHistoryClick(record)}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 text-sm">
                        <span style={{ color: GOLD_LIGHT }}>{record.direction}</span>
                        <span style={{ color: GOLD_DARK }}>·</span>
                        <span>{record.mountain}</span>
                        <span style={{ color: GOLD_DARK }}>·</span>
                        <span>{record.trigram}卦</span>
                        <span style={{ color: GOLD_DARK }}>·</span>
                        <span>{record.angle}°</span>
                      </div>
                      <span className="text-xs" style={{ color: GOLD_DARK }}>
                        {formatDate(record.timestamp)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteHistory(record.id); }}
                      className="p-1 rounded transition-all hover:scale-110"
                      style={{ color: GOLD_DARK }}
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 风水分析面板 ───────────────────────────────────────── */}
      <AnimatePresence>
        {showFengshui && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-40 max-h-[70vh] overflow-y-auto rounded-t-2xl"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              borderTop: `1px solid ${GOLD_DARK}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-3 sticky top-0 z-10"
              style={{
                backgroundColor: 'rgba(0,0,0,0.95)',
                borderBottom: `1px solid ${GOLD_DARK}`,
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} style={{ color: GOLD }} />
                <span className="text-sm font-bold" style={{ color: GOLD_LIGHT }}>
                  风水分析 · {currentMountain.name}
                </span>
              </div>
              <button
                onClick={() => setShowFengshui(false)}
                className="p-1 rounded-full transition-all hover:scale-110"
                style={{ color: GOLD_DARK }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* 基本信息行 */}
              <div className="flex items-center justify-center gap-4 py-3">
                <div className="flex flex-col items-center">
                  <span className="text-2xl">{currentMountain.trigramChar}</span>
                  <span className="text-xs mt-1" style={{ color: GOLD_DARK }}>{currentMountain.trigram}卦</span>
                </div>
                <div style={{ width: 1, height: 40, backgroundColor: GOLD_DARK, opacity: 0.4 }} />
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold" style={{ color: GOLD_LIGHT }}>{currentMountain.name}</span>
                  <span className="text-xs" style={{ color: GOLD_DARK }}>{currentMountain.directionLabel}</span>
                </div>
                <div style={{ width: 1, height: 40, backgroundColor: GOLD_DARK, opacity: 0.4 }} />
                <div className="flex flex-col items-center">
                  <span
                    className="text-lg font-bold"
                    style={{
                      color: currentMountain.auspicious === '吉' ? '#4ade80'
                        : currentMountain.auspicious === '凶' ? '#f87171' : GOLD,
                    }}
                  >
                    {currentMountain.auspicious}
                  </span>
                  <span className="text-xs" style={{ color: GOLD_DARK }}>评级</span>
                </div>
                <div style={{ width: 1, height: 40, backgroundColor: GOLD_DARK, opacity: 0.4 }} />
                <div className="flex flex-col items-center">
                  <span className="text-lg">{currentMountain.element}</span>
                  <span className="text-xs" style={{ color: GOLD_DARK }}>五行</span>
                </div>
              </div>

              {/* 角度信息 */}
              <div className="text-center text-xs" style={{ color: GOLD_DARK }}>
                角度：{currentMountain.angle}°（当前：{Math.round(currentHeading)}°）
              </div>

              {/* 宜 */}
              <div>
                <div className="text-xs font-bold mb-2" style={{ color: '#4ade80' }}>宜</div>
                <div className="flex flex-wrap gap-2">
                  {currentMountain.suitable.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-full text-xs"
                      style={{
                        border: '1px solid rgba(74, 222, 128, 0.35)',
                        backgroundColor: 'rgba(74, 222, 128, 0.08)',
                        color: '#4ade80',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* 忌 */}
              <div>
                <div className="text-xs font-bold mb-2" style={{ color: '#f87171' }}>忌</div>
                <div className="flex flex-wrap gap-2">
                  {currentMountain.avoid.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-full text-xs"
                      style={{
                        border: '1px solid rgba(248, 113, 113, 0.35)',
                        backgroundColor: 'rgba(248, 113, 113, 0.08)',
                        color: '#f87171',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* 建议 */}
              <div
                className="p-3 rounded-lg text-sm leading-relaxed"
                style={{
                  border: `1px solid ${GOLD_DARK}`,
                  backgroundColor: 'rgba(200, 164, 92, 0.06)',
                  color: GOLD,
                }}
              >
                {currentMountain.advice}
              </div>

              {/* 同向其他山 */}
              <div>
                <div className="text-xs font-bold mb-2" style={{ color: GOLD_DARK }}>
                  {currentDirection.label}方 · 同卦诸山
                </div>
                <div className="flex flex-wrap gap-2">
                  {getMountainsByDirection(currentDirection.key).map((m) => (
                    <span
                      key={m.id}
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        border: `1px solid ${m.id === currentMountain.id ? GOLD_LIGHT : GOLD_DARK}`,
                        backgroundColor: m.id === currentMountain.id ? 'rgba(200, 164, 92, 0.15)' : 'transparent',
                        color: m.id === currentMountain.id ? GOLD_LIGHT : GOLD_DARK,
                      }}
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 遮罩层 ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {(showHistory || showFengshui) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => { setShowHistory(false); setShowFengshui(false); }}
          />
        )}
      </AnimatePresence>

      {/* 底部留白 */}
      <div className="h-8" />
    </div>
  );
}

export default WebCompass;
