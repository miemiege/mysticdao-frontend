import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface GlobalCounterProps {
  // 暂无外部 props，预留未来扩展
}

// TODO: Replace with real API fetch
// const fetchGlobalCount = async (): Promise<number> => {
//   const res = await fetch('/api/daily/count');
//   const data = await res.json();
//   return data.count;
// };

const simulateCount = (): number => {
  return Math.floor(1200 + Math.random() * 2300); // 1200-3500
};

const GlobalCounter: React.FC<GlobalCounterProps> = () => {
  const [count, setCount] = useState<number>(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(simulateCount());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center"
    >
      <div
        className="flex items-center gap-3 px-6 py-3 rounded-pill border max-w-md w-full justify-center"
        style={{
          background: 'rgba(200, 164, 92, 0.06)',
          borderColor: 'rgba(200, 164, 92, 0.15)',
        }}
      >
        <Users size={18} className="text-gold flex-shrink-0" />
        <div className="flex items-center gap-2">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl font-heading text-gold tabular-nums"
            style={{ textShadow: '0 0 12px rgba(200, 164, 92, 0.3)' }}
          >
            {count.toLocaleString()}
          </motion.span>
          <span className="text-sm text-white/60 whitespace-nowrap">
            people drew their fortune today
          </span>
        </div>
        <span className="relative flex h-2 w-2 flex-shrink-0 ml-1">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: '#c8a45c' }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: '#c8a45c' }}
          />
        </span>
      </div>
      <p className="text-xs text-white/30 mt-3">
        Join thousands of seekers worldwide
      </p>
    </motion.div>
  );
};

export default GlobalCounter;
