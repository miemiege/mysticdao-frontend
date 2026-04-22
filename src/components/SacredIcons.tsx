import React from 'react';

/* Bagua / Eight Trigrams icon */
export const BaguaIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="32" cy="32" r="28" strokeOpacity="0.3" />
    <circle cx="32" cy="32" r="20" strokeOpacity="0.3" />
    <circle cx="32" cy="32" r="12" strokeOpacity="0.3" />
    {/* Trigram positions around the circle */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 32 + Math.cos(rad) * 24;
      const y1 = 32 + Math.sin(rad) * 24;
      const x2 = 32 + Math.cos(rad) * 30;
      const y2 = 32 + Math.sin(rad) * 30;
      return (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} />
          {/* Small trigram lines */}
          <g transform={`translate(${x2}, ${y2}) rotate(${angle + 90})`}>
            <line x1="-3" y1="-2" x2="3" y2="-2" strokeWidth="1" />
            <line x1="-3" y1="0" x2={i % 2 === 0 ? '1' : '3'} y2="0" strokeWidth="1" />
            <line x1="-3" y1="2" x2="3" y2="2" strokeWidth="1" />
          </g>
        </g>
      );
    })}
    <circle cx="32" cy="32" r="3" fill="currentColor" fillOpacity="0.4" />
  </svg>
);

/* Compass / Luopan icon */
export const CompassIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="32" cy="32" r="26" />
    <circle cx="32" cy="32" r="20" strokeOpacity="0.5" />
    <circle cx="32" cy="32" r="14" strokeOpacity="0.4" />
    <circle cx="32" cy="32" r="6" fill="currentColor" fillOpacity="0.2" />
    {/* Direction markers */}
    <line x1="32" y1="4" x2="32" y2="10" strokeWidth="2" />
    <line x1="32" y1="54" x2="32" y2="60" strokeWidth="1.5" />
    <line x1="4" y1="32" x2="10" y2="32" strokeWidth="1.5" />
    <line x1="54" y1="32" x2="60" y2="32" strokeWidth="1.5" />
    {/* Inner cross */}
    <line x1="32" y1="18" x2="32" y2="22" strokeOpacity="0.5" />
    <line x1="32" y1="42" x2="32" y2="46" strokeOpacity="0.5" />
    <line x1="18" y1="32" x2="22" y2="32" strokeOpacity="0.5" />
    <line x1="42" y1="32" x2="46" y2="32" strokeOpacity="0.5" />
    {/* N marker */}
    <text x="32" y="16" textAnchor="middle" fontSize="6" fontFamily="serif" fontWeight="600" fill="currentColor">N</text>
  </svg>
);

/* Tarot Star icon */
export const TarotStarIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="12" y="8" width="40" height="48" rx="3" strokeOpacity="0.5" />
    <rect x="16" y="12" width="32" height="40" rx="2" strokeOpacity="0.3" />
    {/* Central star */}
    <path
      d="M32 20l2.5 7h7.5l-6 4.5 2.5 7-6.5-4.5-6.5 4.5 2.5-7-6-4.5h7.5z"
      fill="currentColor"
      fillOpacity="0.3"
    />
    {/* Moon crescent */}
    <path
      d="M38 42a8 8 0 1 1-6-14.5 6 6 0 0 0 0 10.5 8 8 0 0 1 6 4z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    {/* Decorative dots */}
    <circle cx="20" cy="18" r="1.5" fill="currentColor" fillOpacity="0.3" />
    <circle cx="44" cy="18" r="1.5" fill="currentColor" fillOpacity="0.3" />
    <circle cx="20" cy="46" r="1.5" fill="currentColor" fillOpacity="0.3" />
    <circle cx="44" cy="46" r="1.5" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

/* Red Thread / Love Heart icon */
export const LoveThreadIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    {/* Thread curves */}
    <path
      d="M16 48c8-8 8-20 0-28"
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
    <path
      d="M48 48c-8-8-8-20 0-28"
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
    {/* Heart at center */}
    <path
      d="M32 22c-4-4-10-2-10 3 0 5 10 12 10 12s10-7 10-12c0-5-6-7-10-3z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    {/* Decorative knots */}
    <circle cx="16" cy="48" r="3" fill="currentColor" fillOpacity="0.3" />
    <circle cx="48" cy="48" r="3" fill="currentColor" fillOpacity="0.3" />
    {/* Center glow */}
    <circle cx="32" cy="30" r="4" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

/* Yin Yang Icon for divider */
export const YinYangSvg = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M24 2a22 22 0 0 1 0 44 11 11 0 0 1 0-22 11 11 0 0 0 0-22z"
      fill="currentColor"
    />
    <circle cx="24" cy="13" r="3.5" fill="var(--color-void)" />
    <circle cx="24" cy="35" r="3.5" fill="currentColor" className="text-text-primary" />
  </svg>
);

/* Mandala Hero SVG */
export const MandalaHero = React.memo(({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 600 600" className={className} fill="none" stroke="currentColor" strokeWidth="0.8">
    {/* Outer ring */}
    <circle cx="300" cy="300" r="280" strokeOpacity="0.15" />
    <circle cx="300" cy="300" r="250" strokeOpacity="0.2" />
    {/* Petal shapes — outer */}
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x = 300 + Math.cos(angle) * 265;
      const y = 300 + Math.sin(angle) * 265;
      return (
        <circle
          key={`petal-${i}`}
          cx={x}
          cy={y}
          r="18"
          strokeOpacity="0.2"
        />
      );
    })}
    {/* Hexagon */}
    {Array.from({ length: 6 }).map((_, i) => {
      const angle = (i * 60 * Math.PI) / 180;
      const nextAngle = ((i + 1) * 60 * Math.PI) / 180;
      const x1 = 300 + Math.cos(angle) * 200;
      const y1 = 300 + Math.sin(angle) * 200;
      const x2 = 300 + Math.cos(nextAngle) * 200;
      const y2 = 300 + Math.sin(nextAngle) * 200;
      return <line key={`hex-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity="0.25" />;
    })}
    {/* Inner hexagon */}
    {Array.from({ length: 6 }).map((_, i) => {
      const angle = (i * 60 + 30) * (Math.PI / 180);
      const nextAngle = ((i + 1) * 60 + 30) * (Math.PI / 180);
      const x1 = 300 + Math.cos(angle) * 140;
      const y1 = 300 + Math.sin(angle) * 140;
      const x2 = 300 + Math.cos(nextAngle) * 140;
      const y2 = 300 + Math.sin(nextAngle) * 140;
      return <line key={`hex2-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity="0.2" />;
    })}
    {/* Radial lines */}
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      const x1 = 300 + Math.cos(angle) * 60;
      const y1 = 300 + Math.sin(angle) * 60;
      const x2 = 300 + Math.cos(angle) * 280;
      const y2 = 300 + Math.sin(angle) * 280;
      return <line key={`radial-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity="0.12" />;
    })}
    {/* Inner circles */}
    <circle cx="300" cy="300" r="100" strokeOpacity="0.2" />
    <circle cx="300" cy="300" r="60" strokeOpacity="0.25" />
    <circle cx="300" cy="300" r="30" strokeOpacity="0.3" />
    <circle cx="300" cy="300" r="12" fill="currentColor" fillOpacity="0.1" />
    {/* Star of David — inner */}
    {Array.from({ length: 6 }).map((_, i) => {
      const angle = (i * 60 * Math.PI) / 180;
      const nextAngle = ((i + 2) * 60 * Math.PI) / 180;
      const x1 = 300 + Math.cos(angle) * 60;
      const y1 = 300 + Math.sin(angle) * 60;
      const x2 = 300 + Math.cos(nextAngle) * 60;
      const y2 = 300 + Math.sin(nextAngle) * 60;
      return <line key={`star-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity="0.2" />;
    })}
  </svg>
));

MandalaHero.displayName = 'MandalaHero';
