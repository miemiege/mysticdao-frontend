import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, JSX } from 'react';

// ─── Types ───────────────────────────────────────────────────────────

interface BaguaOverlayProps {
  heading: number;       // 0-360, real-time heading
  isCapturing?: boolean; // flash on capture
}

// ─── Constants ───────────────────────────────────────────────────────

/** 8 cardinal directions */
const DIRECTIONS = [
  { label: '北',   angle: 0   },
  { label: '东北', angle: 45  },
  { label: '东',   angle: 90  },
  { label: '东南', angle: 135 },
  { label: '南',   angle: 180 },
  { label: '西南', angle: 225 },
  { label: '西',   angle: 270 },
  { label: '西北', angle: 315 },
];

/** 12 earthly branches (时辰) */
const EARTHLY_BRANCHES = [
  { label: '子', angle: 0   },
  { label: '丑', angle: 30  },
  { label: '寅', angle: 60  },
  { label: '卯', angle: 90  },
  { label: '辰', angle: 120 },
  { label: '巳', angle: 150 },
  { label: '午', angle: 180 },
  { label: '未', angle: 210 },
  { label: '申', angle: 240 },
  { label: '酉', angle: 270 },
  { label: '戌', angle: 300 },
  { label: '亥', angle: 330 },
];

/** Major direction angles for thicker ticks */
const MAJOR_ANGLES = new Set([0, 45, 90, 135, 180, 225, 270, 315]);

// ─── Helpers ─────────────────────────────────────────────────────────

/**
 * Convert polar coordinates to percentage-based cartesian
 * for positioning inside the square compass container.
 */
function polarToPercent(angleDeg: number, radiusPercent: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: 50 + radiusPercent * Math.cos(rad),
    y: 50 + radiusPercent * Math.sin(rad),
  };
}

// ─── Sub-component: Control Slider ───────────────────────────────────

function ControlSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  displayValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  displayValue: string;
}): JSX.Element {
  return (
    <div style={sliderRowStyle}>
      <span style={sliderLabelStyle}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={sliderInputStyle}
      />
      <span style={sliderValueStyle}>{displayValue}</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export default function BaguaOverlay({
  heading,
  isCapturing = false,
}: BaguaOverlayProps): JSX.Element {
  // -- State: visual controls --
  const [brightness, setBrightness] = useState(1.2);
  const [opacity, setOpacity] = useState(0.6);
  const [glowSize, setGlowSize] = useState(15);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [flashActive, setFlashActive] = useState(false);

  // -- Refs for rAF-driven rotation (no setState in rAF) --
  const compassRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const smoothedRef = useRef(0);
  const targetRef = useRef(0);

  // Update target on every render (ref mutation is safe during render)
  targetRef.current = -heading;

  // rAF loop: start once on mount, read refs each frame
  useEffect(() => {
    const animate = (): void => {
      const current = smoothedRef.current;
      const target = targetRef.current;

      // Shortest-angle interpolation
      let diff = target - current;
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;

      smoothedRef.current = current + diff * 0.25;

      // Normalize to [-180, 180] to prevent cumulative drift
      while (smoothedRef.current > 180) smoothedRef.current -= 360;
      while (smoothedRef.current < -180) smoothedRef.current += 360;

      if (compassRef.current) {
        compassRef.current.style.transform =
          `rotateX(25deg) rotateZ(${smoothedRef.current}deg) scale(1.02)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Flash effect when isCapturing becomes true
  useEffect(() => {
    if (isCapturing) {
      setFlashActive(true);
      const timer = setTimeout(() => setFlashActive(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isCapturing]);

  // ─── Render: Scale Marks (72 ticks, every 5°) ─────────────────────

  const scaleMarks: JSX.Element[] = [];
  for (let i = 0; i < 72; i++) {
    const angle = i * 5;
    const isMajor = MAJOR_ANGLES.has(angle);
    const { x, y } = polarToPercent(angle, 45);

    scaleMarks.push(
      <div
        key={`mark-${i}`}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          width: `${isMajor ? 2 : 1}px`,
          height: `${isMajor ? 12 : 7}px`,
          backgroundColor: isMajor ? '#c8a45c' : 'rgba(200, 164, 92, 0.45)',
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          transformOrigin: 'center center',
          opacity: isMajor ? 0.75 : 0.35,
          boxShadow: isMajor ? '0 0 4px rgba(200, 164, 92, 0.4)' : 'none',
          animation: isMajor ? 'pulseMajor 2s ease-in-out infinite' : undefined,
        } as CSSProperties}
      />,
    );
  }

  // ─── Render: Direction Labels ──────────────────────────────────────

  const dirLabels = DIRECTIONS.map((dir) => {
    const { x, y } = polarToPercent(dir.angle, 37);
    return (
      <span
        key={dir.label}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
          color: '#c8a45c',
          fontSize: '14px',
          fontWeight: 'bold',
          opacity: 0.7,
          textShadow: '0 0 6px rgba(200, 164, 92, 0.4)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        } as CSSProperties}
      >
        {dir.label}
      </span>
    );
  });

  // ─── Render: Earthly Branches ──────────────────────────────────────

  const branchLabels = EARTHLY_BRANCHES.map((branch) => {
    const { x, y } = polarToPercent(branch.angle, 26);
    return (
      <span
        key={branch.label}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
          color: 'rgba(200, 164, 92, 0.6)',
          fontSize: '11px',
          opacity: 0.45,
          pointerEvents: 'none',
        } as CSSProperties}
      >
        {branch.label}
      </span>
    );
  });

  // ─── Styles ────────────────────────────────────────────────────────

  const compassSize = 'min(100vw, 100vh)';

  const compassBaseStyle: CSSProperties = {
    width: compassSize,
    height: compassSize,
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: `calc(${compassSize} * -0.5)`,
    marginTop: `calc(${compassSize} * -0.5)`,
    transformOrigin: 'center center',
    transformStyle: 'preserve-3d',
    opacity,
    filter: `brightness(${brightness}) drop-shadow(0 0 ${glowSize}px rgba(200, 164, 92, 0.5))`,
    pointerEvents: 'none',
  };

  return (
    <>
      {/* ─── Compass Layer ─────────────────────────────────────────── */}
      <div style={layerContainerStyle}>
        {/* Entrance animation wrapper */}
        <div style={animatedWrapperStyle}>

          {/* North pointer — fixed at top, never rotates */}
          <div style={northPointerContainerStyle}>
            <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
              <path d="M10 0L20 18H0L10 0Z" fill="#e74c3c" opacity="0.9" />
              <path d="M10 18L6 26H14L10 18Z" fill="#c0392b" opacity="0.9" />
            </svg>
            {/* N letter below arrow */}
            <div style={northLetterStyle}>N</div>
          </div>

          {/* Rotating compass body */}
          <div ref={compassRef} style={compassBaseStyle}>
            {/* Outer ring */}
            <div style={outerRingStyle} />

            {/* Middle decorative ring */}
            <div style={middleRingStyle} />

            {/* Scale marks */}
            {scaleMarks}

            {/* Direction labels */}
            {dirLabels}

            {/* Inner ring */}
            <div style={innerRingStyle} />

            {/* Earthly branches */}
            {branchLabels}

            {/* Center hub */}
            <div style={centerDotStyle} />
            <div style={centerGlowStyle} />
          </div>

          {/* Capture flash overlay */}
          {flashActive && <div style={flashOverlayStyle} />}
        </div>
      </div>

      {/* ─── Control Panel ─────────────────────────────────────────── */}
      <div style={controlPanelContainerStyle}>
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          style={toggleButtonStyle}
        >
          {isPanelOpen ? '收起控制' : '展开控制'}
        </button>

        {isPanelOpen && (
          <div style={panelStyle}>
            <ControlSlider
              label="亮度"
              value={brightness}
              min={0.5}
              max={2.5}
              step={0.1}
              onChange={setBrightness}
              displayValue={`${brightness.toFixed(1)}x`}
            />
            <ControlSlider
              label="透明度"
              value={opacity}
              min={0.2}
              max={1}
              step={0.05}
              onChange={setOpacity}
              displayValue={`${Math.round(opacity * 100)}%`}
            />
            <ControlSlider
              label="发光"
              value={glowSize}
              min={0}
              max={40}
              step={1}
              onChange={setGlowSize}
              displayValue={`${glowSize}px`}
            />
          </div>
        )}
      </div>

      {/* ─── Keyframe Animations ───────────────────────────────────── */}
      <style>{`
        @keyframes baguaEnter {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes baguaFlash {
          0%   { opacity: 0.6; }
          100% { opacity: 0; }
        }

        @keyframes pulseMajor {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
      `}</style>
    </>
  );
}

// ─── Static Styles ───────────────────────────────────────────────────

const layerContainerStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  zIndex: 50,
};

const animatedWrapperStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'baguaEnter 0.6s ease-out',
  perspective: 800,
  transformStyle: 'preserve-3d',
};

const northPointerContainerStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 51,
  pointerEvents: 'none',
  marginTop: 'calc(min(100vw, 100vh) * -0.52 - 6px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
};

const northLetterStyle: CSSProperties = {
  color: '#e74c3c',
  fontSize: '10px',
  fontWeight: 'bold',
  opacity: 0.8,
};

const outerRingStyle: CSSProperties = {
  position: 'absolute',
  inset: '2%',
  borderRadius: '50%',
  border: '1.5px solid rgba(200, 164, 92, 0.3)',
  opacity: 0.7,
};

const middleRingStyle: CSSProperties = {
  position: 'absolute',
  inset: '14%',
  borderRadius: '50%',
  border: '1px solid rgba(200, 164, 92, 0.18)',
  opacity: 0.5,
};

const innerRingStyle: CSSProperties = {
  position: 'absolute',
  inset: '26%',
  borderRadius: '50%',
  border: '1px solid rgba(200, 164, 92, 0.15)',
  opacity: 0.4,
};

const centerDotStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: '10px',
  height: '10px',
  transform: 'translate(-50%, -50%)',
  borderRadius: '50%',
  backgroundColor: 'rgba(200, 164, 92, 0.65)',
  boxShadow: '0 0 12px rgba(200, 164, 92, 0.5)',
};

const centerGlowStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: '3px',
  height: '3px',
  transform: 'translate(-50%, -50%)',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
};

const flashOverlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  zIndex: 52,
  animation: 'baguaFlash 0.15s ease-out forwards',
  pointerEvents: 'none',
};

const controlPanelContainerStyle: CSSProperties = {
  position: 'fixed',
  bottom: '130px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 55,
  pointerEvents: 'auto',
};

const toggleButtonStyle: CSSProperties = {
  display: 'block',
  margin: '0 auto 6px',
  padding: '3px 14px',
  backgroundColor: 'rgba(0,0,0,0.55)',
  color: '#c8a45c',
  border: '1px solid rgba(200, 164, 92, 0.25)',
  borderRadius: '10px',
  fontSize: '11px',
  cursor: 'pointer',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
};

const panelStyle: CSSProperties = {
  backgroundColor: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '12px',
  padding: '12px 16px',
  border: '1px solid rgba(200, 164, 92, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  minWidth: '240px',
};

const sliderRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const sliderLabelStyle: CSSProperties = {
  color: '#c8a45c',
  fontSize: '12px',
  minWidth: '48px',
  textAlign: 'right',
};

const sliderInputStyle: CSSProperties = {
  flex: 1,
  accentColor: '#c8a45c',
};

const sliderValueStyle: CSSProperties = {
  color: 'rgba(200, 164, 92, 0.8)',
  fontSize: '11px',
  minWidth: '40px',
  textAlign: 'right',
};
