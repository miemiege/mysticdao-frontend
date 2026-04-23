import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { directionData, directions } from './fengshuiData';
import type { DirectionInfo } from './fengshuiData';

interface Compass3DProps {
  onSelectDirection: (key: string, info: DirectionInfo) => void;
  selectedDirection: string | null;
}

// 五行配色
const ELEMENT_COLORS: Record<string, { main: string; glow: string; bg: string }> = {
  Water:  { main: '#4a7ab8', glow: 'rgba(74,122,184,0.5)',  bg: 'rgba(74,122,184,0.08)' },
  Earth:  { main: '#c8a45c', glow: 'rgba(200,164,92,0.5)',  bg: 'rgba(200,164,92,0.08)' },
  Wood:   { main: '#4a9b7f', glow: 'rgba(74,155,127,0.5)',  bg: 'rgba(74,155,127,0.08)' },
  Fire:   { main: '#c84a3d', glow: 'rgba(200,74,61,0.5)',   bg: 'rgba(200,74,61,0.08)' },
  Metal:  { main: '#d1ccc4', glow: 'rgba(209,204,196,0.5)', bg: 'rgba(209,204,196,0.08)' },
};

// 24山向
const MOUNTAIN_24 = [
  // North (345°-15°)
  { name: '壬', angle: 337.5, dir: 'north' },
  { name: '子', angle: 0,     dir: 'north' },
  { name: '癸', angle: 7.5,   dir: 'north' },
  // Northeast (15°-75°)
  { name: '丑', angle: 22.5,  dir: 'northeast' },
  { name: '艮', angle: 37.5,  dir: 'northeast' },
  { name: '寅', angle: 52.5,  dir: 'northeast' },
  // East (75°-105°)
  { name: '甲', angle: 67.5,  dir: 'east' },
  { name: '卯', angle: 90,    dir: 'east' },
  { name: '乙', angle: 97.5,  dir: 'east' },
  // Southeast (105°-165°)
  { name: '辰', angle: 112.5, dir: 'southeast' },
  { name: '巽', angle: 127.5, dir: 'southeast' },
  { name: '巳', angle: 142.5, dir: 'southeast' },
  // South (165°-195°)
  { name: '丙', angle: 157.5, dir: 'south' },
  { name: '午', angle: 180,   dir: 'south' },
  { name: '丁', angle: 187.5, dir: 'south' },
  // Southwest (195°-255°)
  { name: '未', angle: 202.5, dir: 'southwest' },
  { name: '坤', angle: 217.5, dir: 'southwest' },
  { name: '申', angle: 232.5, dir: 'southwest' },
  // West (255°-285°)
  { name: '庚', angle: 247.5, dir: 'west' },
  { name: '酉', angle: 270,   dir: 'west' },
  { name: '辛', angle: 277.5, dir: 'west' },
  // Northwest (285°-345°)
  { name: '戌', angle: 292.5, dir: 'northwest' },
  { name: '乾', angle: 307.5, dir: 'northwest' },
  { name: '亥', angle: 322.5, dir: 'northwest' },
];

const Compass3D = memo(function Compass3D({ onSelectDirection, selectedDirection }: Compass3DProps) {
  const [hoveredDir, setHoveredDir] = useState<string | null>(null);

  const handleClick = useCallback((key: string) => {
    const info = directionData[key];
    if (info) onSelectDirection(key, info);
  }, [onSelectDirection]);

  const size = 460;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 205;
  const innerR = 148;
  const centerR = 48;

  const getSlicePath = (index: number, rOuter: number, rInner: number) => {
    const startAngle = (index * 45 - 90 - 22.5) * (Math.PI / 180);
    const endAngle = (index * 45 - 90 + 22.5) * (Math.PI / 180);
    const x1 = cx + rOuter * Math.cos(startAngle);
    const y1 = cy + rOuter * Math.sin(startAngle);
    const x2 = cx + rOuter * Math.cos(endAngle);
    const y2 = cy + rOuter * Math.sin(endAngle);
    const x3 = cx + rInner * Math.cos(endAngle);
    const y3 = cy + rInner * Math.sin(endAngle);
    const x4 = cx + rInner * Math.cos(startAngle);
    const y4 = cy + rInner * Math.sin(startAngle);
    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 0 0 ${x4} ${y4} Z`;
  };

  const getLabelPos = (index: number, r: number) => {
    const angle = (index * 45 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // 24山向位置
  const getMountainPos = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  return (
    <div className="relative mx-auto" style={{ width: size, height: size, perspective: 1200 }}>
      {/* 3D Tilt Container */}
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0, rotateX: 45, scale: 0.8 }}
        animate={{ opacity: 1, rotateX: 35, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute inset-[-8px] rounded-full pointer-events-none"
          style={{
            boxShadow: '0 0 60px rgba(200,164,92,0.06), inset 0 0 60px rgba(200,164,92,0.03)',
          }}
        />
        <div className="absolute inset-0 rounded-full border border-[#c8a45c]/10" />
        <div className="absolute inset-2 rounded-full border border-[#c8a45c]/5" />

        {/* Rotating outer decorative ring */}
        <motion.svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          {/* Radial lines */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 - 90) * (Math.PI / 180);
            const x1 = cx + (outerR + 5) * Math.cos(angle);
            const y1 = cy + (outerR + 5) * Math.sin(angle);
            const x2 = cx + (outerR + 20) * Math.cos(angle);
            const y2 = cy + (outerR + 20) * Math.sin(angle);
            return (
              <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(200,164,92,0.15)" strokeWidth={1.5}
              />
            );
          })}
        </motion.svg>

        {/* Main interactive SVG */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10">
          {/* Direction slices with 5-element coloring */}
          {directions.map((dir, i) => {
            const info = directionData[dir.key];
            const elem = ELEMENT_COLORS[info.element] || ELEMENT_COLORS.Earth;
            const isSelected = selectedDirection === dir.key;
            const isHovered = hoveredDir === dir.key;

            return (
              <g key={dir.key}>
                <path
                  d={getSlicePath(i, outerR, innerR)}
                  fill={isSelected ? elem.main : isHovered ? elem.bg : 'rgba(15,15,25,0.6)'}
                  fillOpacity={isSelected ? 0.25 : isHovered ? 0.15 : 0.5}
                  stroke={isSelected ? elem.main : isHovered ? elem.main : 'rgba(200,164,92,0.08)'}
                  strokeWidth={isSelected ? 2.5 : 1}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => handleClick(dir.key)}
                  onMouseEnter={() => setHoveredDir(dir.key)}
                  onMouseLeave={() => setHoveredDir(null)}
                  style={{
                    filter: isSelected
                      ? `drop-shadow(0 0 14px ${elem.glow})`
                      : isHovered
                      ? `drop-shadow(0 0 8px ${elem.glow})`
                      : 'none',
                  }}
                />
                {/* Element indicator dot */}
                {isSelected && (
                  <circle
                    cx={getLabelPos(i, (outerR + innerR) / 2).x}
                    cy={getLabelPos(i, (outerR + innerR) / 2).y}
                    r={3}
                    fill={elem.main}
                    style={{ filter: `drop-shadow(0 0 6px ${elem.glow})` }}
                  />
                )}
              </g>
            );
          })}

          {/* 24 Mountain ring (山向刻度) */}
          {MOUNTAIN_24.map((mt, i) => {
            const pos = getMountainPos(mt.angle, outerR + 14);
            const isMain = mt.name.length === 1 && ['子', '午', '卯', '酉', '乾', '坤', '艮', '巽'].includes(mt.name);
            return (
              <g key={`mt-${i}`}>
                {/* 刻度线 */}
                <line
                  x1={getMountainPos(mt.angle, outerR + 2).x}
                  y1={getMountainPos(mt.angle, outerR + 2).y}
                  x2={getMountainPos(mt.angle, outerR + (isMain ? 10 : 6)).x}
                  y2={getMountainPos(mt.angle, outerR + (isMain ? 10 : 6)).y}
                  stroke={isMain ? 'rgba(200,164,92,0.35)' : 'rgba(200,164,92,0.12)'}
                  strokeWidth={isMain ? 1.2 : 0.6}
                />
                {/* 山向文字 */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isMain ? 'rgba(200,164,92,0.6)' : 'rgba(200,164,92,0.3)'}
                  fontSize={isMain ? 8.5 : 7}
                  fontFamily="'Noto Serif SC', serif"
                  fontWeight={isMain ? 600 : 400}
                  className="pointer-events-none select-none"
                >
                  {mt.name}
                </text>
              </g>
            );
          })}

          {/* 24 Mountain inner ring */}
          {MOUNTAIN_24.map((mt, i) => {
            const pos = getMountainPos(mt.angle, innerR + 10);
            const isMain = ['子', '午', '卯', '酉', '乾', '坤', '艮', '巽'].includes(mt.name);
            return (
              <text
                key={`mt-inner-${i}`}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isMain ? 'rgba(200,164,92,0.25)' : 'rgba(200,164,92,0.12)'}
                fontSize={isMain ? 7 : 6}
                fontFamily="'Noto Serif SC', serif"
                className="pointer-events-none select-none"
              >
                {mt.name}
              </text>
            );
          })}

          {/* Center circle */}
          <circle cx={cx} cy={cy} r={centerR} fill="#0a0a0f" stroke="rgba(200,164,92,0.25)" strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={centerR - 6} fill="none" stroke="rgba(200,164,92,0.08)" strokeWidth={0.5} />

          {/* Self-rotating Taiji */}
          <motion.g
            transform={`translate(${cx}, ${cy})`}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx={0} cy={0} r={20} fill="none" stroke="#c8a45c" strokeWidth={1} />
            <path
              d="M0,-20 A10,10 0 0,1 0,0 A10,10 0 0,0 0,20 A20,20 0 0,1 0,-20Z"
              fill="#c8a45c"
              fillOpacity={0.75}
            />
            <circle cx={0} cy={-10} r={3} fill="#0a0a0f" />
            <circle cx={0} cy={10} r={3} fill="#c8a45c" />
          </motion.g>

          {/* Taiji label */}
          <text x={cx} y={cy + centerR + 16} textAnchor="middle" fill="#8a7342" fontSize={9} fontFamily="Inter, sans-serif" letterSpacing={3} fontWeight={500}>TAIJI</text>

          {/* Element labels around center */}
          {directions.map((dir, i) => {
            const pos = getLabelPos(i, centerR + 22);
            const info = directionData[dir.key];
            const elem = ELEMENT_COLORS[info.element];
            return (
              <g key={`elem-${dir.key}`}>
                <circle cx={pos.x} cy={pos.y} r={5} fill={elem?.bg || 'rgba(200,164,92,0.05)'} stroke={elem?.main || '#c8a45c'} strokeWidth={0.5} strokeOpacity={0.3} />
                <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="central" fill={elem?.main || '#c8a45c'} fillOpacity={0.6} fontSize={5} fontFamily="Inter, sans-serif" fontWeight={600}>
                  {info.element.charAt(0)}
                </text>
              </g>
            );
          })}

          {/* Direction labels */}
          {directions.map((dir, i) => {
            const pos = getLabelPos(i, outerR - 32);
            const info = directionData[dir.key];
            const isSelected = selectedDirection === dir.key;
            const elem = ELEMENT_COLORS[info.element];

            return (
              <g key={`label-${dir.key}`} className="cursor-pointer" onClick={() => handleClick(dir.key)} onMouseEnter={() => setHoveredDir(dir.key)} onMouseLeave={() => setHoveredDir(null)}>
                <text x={pos.x} y={pos.y - 3} textAnchor="middle" dominantBaseline="central" fill={isSelected ? elem?.main || '#f5efe6' : '#f5efe6'} fillOpacity={isSelected ? 1 : 0.7} fontSize={13} fontFamily="Inter, sans-serif" fontWeight={700} letterSpacing={1}>
                  {dir.label}
                </text>
                <text x={pos.x} y={pos.y + 12} textAnchor="middle" dominantBaseline="central" fill={isSelected ? elem?.main || '#8a7342' : '#8a7342'} fontSize={14} fontFamily="'Noto Serif SC', serif" fontWeight={500}>
                  {info.chinese}
                </text>
              </g>
            );
          })}

          {/* Trigram labels */}
          {directions.map((dir, i) => {
            const pos = getLabelPos(i, innerR - 20);
            const info = directionData[dir.key];
            return (
              <g key={`trigram-${dir.key}`}>
                <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fill="#8a7342" fontSize={10} fontFamily="Inter, sans-serif" letterSpacing={0.5}>
                  {info.trigram} ({info.trigramChar})
                </text>
              </g>
            );
          })}

          {/* Earthly branch */}
          {directions.map((_, i) => {
            const pos = getLabelPos(i, innerR + 14);
            const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未'];
            return (
              <text key={`branch-${i}`} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fill="rgba(245,239,230,0.12)" fontSize={9} fontFamily="'Noto Serif SC', serif">
                {branches[i]}
              </text>
            );
          })}
        </svg>

        {/* Bottom reflection/glow for 3D effect */}
        <div
          className="absolute bottom-[-20px] left-[10%] right-[10%] h-[30px] rounded-[50%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(200,164,92,0.06) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
      </motion.div>
    </div>
  );
});

export default Compass3D;
