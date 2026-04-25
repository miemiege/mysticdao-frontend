import React, { useEffect, useRef, useState } from 'react';

interface RollingNumberProps {
  value: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const RollingNumber: React.FC<RollingNumberProps> = ({ value, delay = 0, className = '', style }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      hasAnimated.current = true;
      return;
    }

    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const duration = 1000; // 1 second
      let rafId: number;

      const tick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOut: 1 - (1 - progress)^2
        const eased = 1 - (1 - progress) * (1 - progress);
        setDisplayValue(Math.round(eased * value));

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          hasAnimated.current = true;
        }
      };

      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <span className={className} style={style}>
      {displayValue}
    </span>
  );
};

export default RollingNumber;
