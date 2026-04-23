import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface RollingNumberProps {
  value: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const RollingNumber: React.FC<RollingNumberProps> = ({ value, delay = 0, className = '', style }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    const timeout = setTimeout(() => {
      const controls = animate(count, value, {
        duration: 1,
        ease: 'easeOut',
        onComplete: () => {
          hasAnimated.current = true;
        },
      });
      return () => controls.stop();
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay, count]);

  return (
    <motion.span className={className} style={style}>
      {rounded}
    </motion.span>
  );
};

export default RollingNumber;
