import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';

const GOLD = '#c8a45c';
const GOLD_GLOW = 'rgba(200, 164, 92, 0.4)';

/* ═══════════════════════════════════════════════════════════════════════
   Data: 24 Mountains (二十四山向) + Bagua (八卦) + Wuxing (五行)
   ═══════════════════════════════════════════════════════════════════════ */

type WuxingKey = 'water' | 'fire' | 'wood' | 'earth' | 'metal';

const WUXING: Record<WuxingKey, { color: string; glow: string; name: string }> = {
  water: { color: '#60A5FA', glow: 'rgba(96,165,250,0.5)', name: '水' },
  fire:  { color: '#F87171', glow: 'rgba(248,113,113,0.5)', name: '火' },
  wood:  { color: '#4ADE80', glow: 'rgba(74,222,128,0.5)', name: '木' },
  earth: { color: '#FBBF24', glow: 'rgba(251,191,36,0.5)', name: '土' },
  metal: { color: '#E5E7EB', glow: 'rgba(229,231,235,0.5)', name: '金' },
};

interface Mountain24 {
  name: string;
  angle: number;
  wx: WuxingKey;
}

const MOUNTAINS24: Mountain24[] = [
  { name: '子', angle: 0,   wx: 'water' },
  { name: '癸', angle: 15,  wx: 'water' },
  { name: '丑', angle: 30,  wx: 'earth' },
  { name: '艮', angle: 45,  wx: 'earth' },
  { name: '寅', angle: 60,  wx: 'earth' },
  { name: '甲', angle: 75,  wx: 'wood' },
  { name: '卯', angle: 90,  wx: 'wood' },
  { name: '乙', angle: 105, wx: 'wood' },
  { name: '辰', angle: 120, wx: 'wood' },
  { name: '巽', angle: 135, wx: 'wood' },
  { name: '巳', angle: 150, wx: 'wood' },
  { name: '丙', angle: 165, wx: 'fire' },
  { name: '午', angle: 180, wx: 'fire' },
  { name: '丁', angle: 195, wx: 'fire' },
  { name: '未', angle: 210, wx: 'earth' },
  { name: '坤', angle: 225, wx: 'earth' },
  { name: '申', angle: 240, wx: 'earth' },
  { name: '庚', angle: 255, wx: 'metal' },
  { name: '酉', angle: 270, wx: 'metal' },
  { name: '辛', angle: 285, wx: 'metal' },
  { name: '戌', angle: 300, wx: 'metal' },
  { name: '乾', angle: 315, wx: 'metal' },
  { name: '亥', angle: 330, wx: 'water' },
  { name: '壬', angle: 345, wx: 'water' },
];

interface Trigram {
  symbol: string;
  name: string;
  angle: number;
  wx: WuxingKey;
}

const TRIGRAMS: Trigram[] = [
  { symbol: '☵', name: '坎', angle: 0,   wx: 'water' },
  { symbol: '☶', name: '艮', angle: 45,  wx: 'earth' },
  { symbol: '☳', name: '震', angle: 90,  wx: 'wood' },
  { symbol: '☴', name: '巽', angle: 135, wx: 'wood' },
  { symbol: '☲', name: '离', angle: 180, wx: 'fire' },
  { symbol: '☷', name: '坤', angle: 225, wx: 'earth' },
  { symbol: '☱', name: '兑', angle: 270, wx: 'metal' },
  { symbol: '☰', name: '乾', angle: 315, wx: 'metal' },
];

interface Direction {
  label: string;
  angle: number;
}

const DIRECTIONS: Direction[] = [
  { label: '北', angle: 0 },
  { label: '东北', angle: 45 },
  { label: '东', angle: 90 },
  { label: '东南', angle: 135 },
  { label: '南', angle: 180 },
  { label: '西南', angle: 225 },
  { label: '西', angle: 270 },
  { label: '西北', angle: 315 },
];

/* ─── Helpers ───────────────────────────────────────────────────────── */

function shortestAngleDiff(current: number, target: number): number {
  let diff = target - current;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}

function getTrigramFromHeading(heading: number): Trigram {
  const n = ((heading % 360) + 360) % 360;
  const idx = Math.round(n / 45) % 8;
  return TRIGRAMS[idx];
}

/* ═══════════════════════════════════════════════════════════════════════
   SVG Compass Dial — 72 ticks + 24 mountains + 8 trigrams + directions
   ═══════════════════════════════════════════════════════════════════════ */

function CompassDialSVG({ glowIntensity }: { glowIntensity: number }): JSX.Element {
  const rTicks = 142;
  const rMountains = 108;
  const rTrigrams = 68;
  const rDirections = 158;

  // 72 ticks (every 5°)
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const angle = i * 5;
    const isMain = i % 6 === 0; // every 30°
    const isSub = i % 3 === 0;  // every 15°
    const len = isMain ? 10 : isSub ? 6 : 3;
    const rad = (angle * Math.PI) / 180;
    const x1 = Math.sin(rad) * (rTicks - len);
    const y1 = -Math.cos(rad) * (rTicks - len);
    const x2 = Math.sin(rad) * rTicks;
    const y2 = -Math.cos(rad) * rTicks;
    return { x1, y1, x2, y2, isMain, isSub, angle };
  });

  return (
    <svg
      viewBox="-180 -180 360 360"
      className="w-full h-full"
      style={{ filter: `drop-shadow(0 0 ${glowIntensity * 0.5}px ${GOLD_GLOW})` }}
    >
      {/* Outer gold ring */}
      <circle
        cx="0" cy="0" r="175"
        fill="none"
        stroke={GOLD}
        strokeWidth="1"
        opacity={0.6}
      />
      <circle
        cx="0" cy="0" r="172"
        fill="none"
        stroke={GOLD}
        strokeWidth="0.5"
        opacity={0.3}
      />

      {/* Inner decorative ring */}
      <circle
        cx="0" cy="0" r={rTicks + 2}
        fill="none"
        stroke={GOLD}
        strokeWidth="0.5"
        opacity={0.25}
      />

      {/* 72 Ticks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke={t.isMain ? GOLD : '#c8a45c'}
          strokeWidth={t.isMain ? 1.5 : 0.8}
          opacity={t.isMain ? 0.9 : 0.4}
        />
      ))}

      {/* 24 Mountains text */}
      {MOUNTAINS24.map((m) => {
        const rad = (m.angle * Math.PI) / 180;
        const x = Math.sin(rad) * rMountains;
        const y = -Math.cos(rad) * rMountains;
        const wx = WUXING[m.wx];
        return (
          <text
            key={m.name}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={wx.color}
            fontSize={m.name.length === 1 ? '11' : '9'}
            fontWeight="500"
            opacity={0.9}
            style={{ fontFamily: 'serif' }}
          >
            {m.name}
          </text>
        );
      })}

      {/* 8 Trigram symbols */}
      {TRIGRAMS.map((t) => {
        const rad = (t.angle * Math.PI) / 180;
        const x = Math.sin(rad) * rTrigrams;
        const y = -Math.cos(rad) * rTrigrams;
        const wx = WUXING[t.wx];
        return (
          <g key={t.name}>
            <text
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={wx.color}
              fontSize="22"
              fontWeight="bold"
              opacity={0.95}
              style={{ filter: `drop-shadow(0 0 2px ${wx.glow})` }}
            >
              {t.symbol}
            </text>
            <text
              x={x} y={y + 16}
              textAnchor="middle"
              dominantBaseline="central"
              fill={GOLD}
              fontSize="9"
              opacity={0.7}
              style={{ fontFamily: 'serif' }}
            >
              {t.name}
            </text>
          </g>
        );
      })}

      {/* Direction labels (N/E/S/W only, larger) */}
      {DIRECTIONS.map((d) => {
        const rad = (d.angle * Math.PI) / 180;
        const x = Math.sin(rad) * rDirections;
        const y = -Math.cos(rad) * rDirections;
        const isCardinal = d.angle % 90 === 0;
        return (
          <text
            key={d.label}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={isCardinal ? GOLD : `${GOLD}99`}
            fontSize={isCardinal ? '16' : '11'}
            fontWeight={isCardinal ? 'bold' : 'normal'}
            opacity={isCardinal ? 1 : 0.7}
            style={{ fontFamily: 'serif' }}
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Taiji — CSS-drawn spinning symbol
   ═══════════════════════════════════════════════════════════════════════ */

function Taiji({ size = 48 }: { size?: number }): JSX.Element {
  const half = size / 2;
  const eye = size / 8;
  return (
    <div
      className="taiji-spin"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(to right, #000 50%, #fff 50%)',
        position: 'relative',
        boxShadow: `0 0 12px ${GOLD_GLOW}, inset 0 0 8px rgba(200,164,92,0.15)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: half,
          transform: 'translateX(-50%)',
          width: half,
          height: half,
          borderRadius: '50%',
          background: '#000',
          border: `${eye}px solid #fff`,
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: half,
          transform: 'translateX(-50%)',
          width: half,
          height: half,
          borderRadius: '50%',
          background: '#fff',
          border: `${eye}px solid #000`,
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Wuxing Sweep — conic-gradient flash on trigram transition
   ═══════════════════════════════════════════════════════════════════════ */

function WuxingSweep({
  color,
  active,
}: {
  color: string;
  active: boolean;
}): JSX.Element | null {
  if (!active) return null;
  return (
    <div
      className="wuxing-sweep-anim"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: `conic-gradient(from 0deg, transparent 0deg, ${color} 30deg, transparent 60deg)`,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Controls Bar
   ═══════════════════════════════════════════════════════════════════════ */

interface ControlsBarProps {
  brightness: number;
  opacity: number;
  glow: number;
  onBrightnessChange: (v: number) => void;
  onOpacityChange: (v: number) => void;
  onGlowChange: (v: number) => void;
}

function ControlsBar({
  brightness,
  opacity,
  glow,
  onBrightnessChange,
  onOpacityChange,
  onGlowChange,
}: ControlsBarProps): JSX.Element {
  const sliderCls =
    "w-20 h-1 rounded-full appearance-none cursor-pointer accent-[#c8a45c] bg-white/10";

  return (
    <div
      className="flex items-center gap-4 px-4 py-2 rounded-full"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${GOLD}25`,
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-[#c8a45c] opacity-70">亮度</span>
        <input
          type="range" min="0.3" max="2" step="0.05"
          value={brightness}
          onChange={(e) => onBrightnessChange(parseFloat(e.target.value))}
          className={sliderCls}
        />
      </div>
      <div className="w-px h-6 bg-white/10" />
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-[#c8a45c] opacity-70">透明</span>
        <input
          type="range" min="0.1" max="1" step="0.05"
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className={sliderCls}
        />
      </div>
      <div className="w-px h-6 bg-white/10" />
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-[#c8a45c] opacity-70">发光</span>
        <input
          type="range" min="0" max="40" step="1"
          value={glow}
          onChange={(e) => onGlowChange(parseFloat(e.target.value))}
          className={sliderCls}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   BaguaOverlay — Main Component
   ═══════════════════════════════════════════════════════════════════════ */

interface BaguaOverlayProps {
  heading: number;
  isCapturing: boolean;
}

export default function BaguaOverlay({
  heading,
  isCapturing,
}: BaguaOverlayProps): JSX.Element {
  const smoothedRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const compassRef = useRef<HTMLDivElement>(null);

  const [brightness, setBrightness] = useState(1.2);
  const [opacity, setOpacity] = useState(0.85);
  const [glow, setGlow] = useState(12);

  // Sweep animation state
  const [sweep, setSweep] = useState<{ color: string; key: number } | null>(null);
  const lastTrigramRef = useRef<string | null>(null);

  // Normalize heading to [-180, 180] for rotation
  const normalizedHeading = ((heading % 360) + 360) % 360;
  targetRef.current = -normalizedHeading; //罗盘反向旋转，北指针固定朝上

  // rAF smooth rotation
  useEffect(() => {
    const animate = (): void => {
      const current = smoothedRef.current;
      const target = targetRef.current;
      const diff = shortestAngleDiff(current, target);
      smoothedRef.current = current + diff * 0.25;

      // Normalize to [-180, 180]
      while (smoothedRef.current > 180) smoothedRef.current -= 360;
      while (smoothedRef.current < -180) smoothedRef.current += 360;

      if (compassRef.current) {
        compassRef.current.style.transform =
          `rotateX(35deg) rotateZ(${smoothedRef.current}deg) scale(1.02)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Detect trigram transition → trigger wuxing sweep
  useEffect(() => {
    const tri = getTrigramFromHeading(normalizedHeading);
    if (lastTrigramRef.current && lastTrigramRef.current !== tri.name) {
      const wx = WUXING[tri.wx];
      setSweep({ color: wx.color, key: Date.now() });
      const timer = setTimeout(() => setSweep(null), 700);
      return () => clearTimeout(timer);
    }
    lastTrigramRef.current = tri.name;
  }, [normalizedHeading]);

  // Capture flash
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (isCapturing) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 400);
      return () => clearTimeout(t);
    }
  }, [isCapturing]);

  const currentTri = getTrigramFromHeading(normalizedHeading);
  const currentWx = WUXING[currentTri.wx];

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        pointerEvents: 'none',
        perspective: '800px',
        filter: `brightness(${brightness})`,
        opacity,
      }}
    >
      {/* Flash overlay */}
      {flash && (
        <div
          className="absolute inset-0 z-[60] bg-white"
          style={{
            animation: 'flashFade 0.4s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 3D Compass container */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Rotating dial */}
        <div
          ref={compassRef}
          className="relative"
          style={{
            width: 'min(80vw, 80vh)',
            height: 'min(80vw, 80vh)',
            maxWidth: 480,
            maxHeight: 480,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Glow halo (breathing) */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${currentWx.glow} 0%, transparent 70%)`,
              animation: 'breatheHalo 3s ease-in-out infinite',
              filter: `blur(${glow * 0.5}px)`,
            }}
          />

          {/* Outer ring glow */}
          <div
            className="absolute inset-[-8px] rounded-full"
            style={{
              boxShadow: `
                0 0 ${glow}px ${GOLD_GLOW},
                0 0 ${glow * 2}px ${currentWx.glow},
                inset 0 0 ${glow * 0.5}px ${GOLD_GLOW}
              `,
            }}
          />

          {/* SVG dial */}
          <div className="absolute inset-0">
            <CompassDialSVG glowIntensity={glow} />
          </div>

          {/* Center Taiji */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Taiji size={56} />
          </div>

          {/* Wuxing sweep effect */}
          {sweep && (
            <WuxingSweep color={sweep.color} active={true} />
          )}
        </div>
      </div>

      {/* Fixed North pointer */}
      <div
        className="absolute top-[15%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
        style={{ filter: `drop-shadow(0 0 ${glow * 0.3}px ${GOLD})` }}
      >
        <svg width="24" height="32" viewBox="0 0 24 32">
          <polygon
            points="12,0 24,24 12,20 0,24"
            fill={GOLD}
            opacity={0.9}
          />
          <text
            x="12" y="30"
            textAnchor="middle"
            fill={GOLD}
            fontSize="10"
            fontWeight="bold"
          >
            N
          </text>
        </svg>
      </div>

      {/* Trigram info badge */}
      <div
        className="absolute top-[22%] left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full"
        style={{
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          border: `1px solid ${currentWx.color}40`,
          color: currentWx.color,
          fontSize: '12px',
          fontWeight: 500,
          opacity: 0.9,
        }}
      >
        {currentTri.symbol} {currentTri.name} · {currentWx.name} · {Math.round(normalizedHeading)}°
      </div>

      {/* Controls (bottom center) */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 z-10">
        <ControlsBar
          brightness={brightness}
          opacity={opacity}
          glow={glow}
          onBrightnessChange={setBrightness}
          onOpacityChange={setOpacity}
          onGlowChange={setGlow}
        />
      </div>

      {/* CSS animations injected */}
      <style>{`
        @keyframes breatheHalo {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes taiji-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .taiji-spin {
          animation: taiji-spin 12s linear infinite;
        }
        @keyframes flashFade {
          0% { opacity: 0.6; }
          100% { opacity: 0; }
        }
        @keyframes sweepRotate {
          0% { transform: rotate(0deg); opacity: 0.6; }
          100% { transform: rotate(360deg); opacity: 0; }
        }
        .wuxing-sweep-anim {
          animation: sweepRotate 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
