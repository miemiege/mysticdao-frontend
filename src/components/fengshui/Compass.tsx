import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { directionData, directions } from './fengshuiData';
import type { DirectionInfo } from './fengshuiData';

interface CompassProps {
  onSelectDirection: (key: string, info: DirectionInfo) => void;
  selectedDirection: string | null;
}

const Compass = memo(function Compass({ onSelectDirection, selectedDirection }: CompassProps) {
  const [hoveredDir, setHoveredDir] = useState<string | null>(null);

  const handleClick = useCallback((key: string) => {
    const info = directionData[key];
    if (info) {
      onSelectDirection(key, info);
    }
  }, [onSelectDirection]);

  const size = 420;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 200;
  const innerR = 140;
  const centerR = 45;

  // Generate pie slice path for each direction
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

  // Label position for each direction
  const getLabelPos = (index: number, r: number) => {
    const angle = (index * 45 - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  return (
    <motion.div
      className="relative mx-auto"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      {/* Outer decorative ring */}
      <div className="absolute inset-0 rounded-full border border-[#c8a45c]/10" />
      <div className="absolute inset-2 rounded-full border border-[#c8a45c]/5" />

      {/* Slow rotating container */}
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      >
        {/* Decorative radial lines */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 - 90) * (Math.PI / 180);
          const x1 = cx + (outerR + 5) * Math.cos(angle);
          const y1 = cy + (outerR + 5) * Math.sin(angle);
          const x2 = cx + (outerR + 18) * Math.cos(angle);
          const y2 = cy + (outerR + 18) * Math.sin(angle);
          return (
            <line
              key={`line-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(200,164,92,0.15)"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Outer circle ticks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 - 90) * (Math.PI / 180);
          const r1 = i % 2 === 0 ? outerR + 6 : outerR + 10;
          const r2 = outerR + 14;
          const x1 = cx + r1 * Math.cos(angle);
          const y1 = cy + r1 * Math.sin(angle);
          const x2 = cx + r2 * Math.cos(angle);
          const y2 = cy + r2 * Math.sin(angle);
          return (
            <line
              key={`tick-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(200,164,92,0.1)"
              strokeWidth={1}
            />
          );
        })}
      </motion.svg>

      {/* Main interactive SVG (non-rotating for interaction) */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10"
      >
        {/* Direction slices */}
        {directions.map((dir, i) => {
          const info = directionData[dir.key];
          const isSelected = selectedDirection === dir.key;
          const isHovered = hoveredDir === dir.key;
          const fillOpacity = isSelected ? 0.2 : isHovered ? 0.12 : 0.04;

          return (
            <g key={dir.key}>
              <path
                d={getSlicePath(i, outerR, innerR)}
                fill={isSelected ? info.color : isHovered ? '#c8a45c' : '#1a1a24'}
                fillOpacity={fillOpacity}
                stroke={isSelected ? info.color : 'rgba(200,164,92,0.1)'}
                strokeWidth={isSelected ? 2 : 1}
                className="cursor-pointer transition-all duration-300"
                onClick={() => handleClick(dir.key)}
                onMouseEnter={() => setHoveredDir(dir.key)}
                onMouseLeave={() => setHoveredDir(null)}
                style={{
                  filter: isSelected
                    ? `drop-shadow(0 0 12px ${info.color}80)`
                    : isHovered
                    ? 'drop-shadow(0 0 6px rgba(200,164,92,0.2))'
                    : 'none',
                }}
              />
            </g>
          );
        })}

        {/* Center yin-yang circle */}
        <circle
          cx={cx}
          cy={cy}
          r={centerR}
          fill="#111118"
          stroke="rgba(200,164,92,0.3)"
          strokeWidth={1.5}
        />
        {/* Yin-yang symbol */}
        <g transform={`translate(${cx}, ${cy})`}>
          <circle cx={0} cy={0} r={18} fill="none" stroke="#c8a45c" strokeWidth={1.2} />
          <path
            d="M0,-18 A9,9 0 0,1 0,0 A9,9 0 0,0 0,18 A18,18 0 0,1 0,-18Z"
            fill="#c8a45c"
            fillOpacity={0.8}
          />
          <circle cx={0} cy={-9} r={2.5} fill="#0a0a0f" />
          <circle cx={0} cy={9} r={2.5} fill="#c8a45c" />
        </g>

        {/* Taiji label */}
        <text
          x={cx}
          y={cy + centerR + 14}
          textAnchor="middle"
          fill="#8a7342"
          fontSize={9}
          fontFamily="Inter, sans-serif"
          letterSpacing={2}
        >
          TAIJI
        </text>

        {/* Direction labels */}
        {directions.map((dir, i) => {
          const pos = getLabelPos(i, outerR - 30);
          const info = directionData[dir.key];
          const isSelected = selectedDirection === dir.key;

          return (
            <g
              key={`label-${dir.key}`}
              className="cursor-pointer"
              onClick={() => handleClick(dir.key)}
              onMouseEnter={() => setHoveredDir(dir.key)}
              onMouseLeave={() => setHoveredDir(null)}
            >
              <text
                x={pos.x}
                y={pos.y - 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected ? info.color : '#f5efe6'}
                fillOpacity={isSelected ? 1 : 0.7}
                fontSize={12}
                fontFamily="Inter, sans-serif"
                fontWeight={600}
                letterSpacing={1}
              >
                {dir.label}
              </text>
              <text
                x={pos.x}
                y={pos.y + 12}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected ? info.color : '#8a7342'}
                fontSize={14}
                fontFamily="'Noto Serif SC', serif"
                fontWeight={500}
              >
                {info.chinese}
              </text>
            </g>
          );
        })}

        {/* Trigram labels on inner ring */}
        {directions.map((dir, i) => {
          const pos = getLabelPos(i, innerR - 18);
          const info = directionData[dir.key];

          return (
            <g key={`trigram-${dir.key}`}>
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#8a7342"
                fontSize={10}
                fontFamily="Inter, sans-serif"
                letterSpacing={0.5}
              >
                {info.trigram} ({info.trigramChar})
              </text>
            </g>
          );
        })}

        {/* Earthly branch symbols */}
        {directions.map((_, i) => {
          const pos = getLabelPos(i, innerR + 12);
          const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未'];

          return (
            <text
              key={`branch-${i}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(245,239,230,0.15)"
              fontSize={9}
              fontFamily="'Noto Serif SC', serif"
            >
              {branches[i]}
            </text>
          );
        })}
      </svg>
    </motion.div>
  );
});

export default Compass;
