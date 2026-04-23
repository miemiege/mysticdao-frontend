import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CoinFlip from './CoinFlip';
import { useRitualSound } from '@/hooks/useRitualSound';
import type { Yao } from './HexagramDraw';

interface RitualDrawingProps {
  onComplete?: () => void;
  lines?: Yao[];
  hexagramName?: string;
}

const BambooTube: React.FC<{ isShaking: boolean }> = ({ isShaking }) => {
  return (
    <motion.div
      className="relative"
      style={{ width: 72, height: 126 }}
      animate={
        isShaking
          ? {
              rotate: [-6, 8, -10, 6, -5, 3, -2, 0],
              x: [-4, 6, -8, 5, -3, 2, -1, 0],
              y: [0, -2, 0, -1, 0, 0, 0, 0],
            }
          : { x: 0, y: 0, rotate: 0 }
      }
      transition={isShaking ? { duration: 0.45, ease: 'easeInOut' } : { duration: 0.3 }}
    >
      <div
        className="absolute inset-0 rounded-b-2xl rounded-t-lg overflow-hidden"
        style={{
          background:
            'linear-gradient(90deg, #1a1209 0%, #2d1f0e 15%, #3d2b15 30%, #2d1f0e 50%, #1a1209 70%, #0f0a04 100%)',
          boxShadow:
            'inset 2px 0 8px rgba(200,164,92,0.1), inset -2px 0 8px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.6)',
        }}
      >
        {[20, 50, 80].map((top) => (
          <div
            key={top}
            className="absolute left-0 right-0 h-[2px]"
            style={{
              top: `${top}%`,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(200,164,92,0.15) 30%, rgba(200,164,92,0.25) 50%, rgba(200,164,92,0.15) 70%, transparent 100%)',
            }}
          />
        ))}
        <div
          className="absolute top-[8%] left-[-2px] right-[-2px] h-[3px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #c8a45c 20%, #e8d5a3 50%, #c8a45c 80%, transparent 100%)',
            boxShadow: '0 0 8px rgba(200,164,92,0.3)',
          }}
        />
        <div
          className="absolute bottom-[12%] left-[-2px] right-[-2px] h-[3px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #c8a45c 20%, #e8d5a3 50%, #c8a45c 80%, transparent 100%)',
            boxShadow: '0 0 8px rgba(200,164,92,0.3)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <svg viewBox="0 0 40 40" className="w-10 h-10">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#c8a45c" strokeWidth="1" />
            <path d="M20 2C10 2 2 10 2 20s8 18 18 18V2z" fill="#c8a45c" fillOpacity="0.6" />
            <circle cx="20" cy="11" r="3.5" fill="#c8a45c" />
            <circle cx="20" cy="29" r="3.5" fill="none" stroke="#c8a45c" strokeWidth="1" />
          </svg>
        </div>
        <div
          className="absolute bottom-[18%] left-0 right-0 text-center font-heading text-lg tracking-widest"
          style={{ color: 'rgba(200,164,92,0.25)' }}
        >
          運
        </div>
      </div>
      <div
        className="absolute top-0 left-0 right-0 h-[6px] rounded-t-lg"
        style={{
          background:
            'linear-gradient(90deg, #0f0a04 0%, #3d2b15 30%, #c8a45c40 50%, #3d2b15 70%, #0f0a04 100%)',
        }}
      />
    </motion.div>
  );
};

const BAGUA_SYMBOLS = ['☰', '☷', '☳', '☵', '☶', '☴', '☲', '☱'];

const BaguaCircle: React.FC<{ show: boolean }> = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="absolute pointer-events-none"
          style={{ width: 260, height: 260 }}
        >
          {BAGUA_SYMBOLS.map((symbol, i) => {
            const angle = (i * 360) / 8 - 90;
            const rad = (angle * Math.PI) / 180;
            const x = 130 + 115 * Math.cos(rad);
            const y = 130 + 115 * Math.sin(rad);
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.22, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                className="absolute text-gold text-xl font-heading"
                style={{
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                  textShadow: '0 0 15px rgba(200,164,92,0.4)',
                }}
              >
                {symbol}
              </motion.span>
            );
          })}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(200,164,92,0.1)',
              boxShadow: '0 0 30px rgba(200,164,92,0.05), inset 0 0 30px rgba(200,164,92,0.02)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AssembledCoin: React.FC<{ yao: Yao; index: number; delay: number }> = ({ yao, index, delay }) => {
  const yPos = (5 - index) * 44 - 110;
  const startX = [-70, 70, -50, 50, -30, 30][index];
  const startY = [60, 50, 30, 20, 0, -20][index];
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ width: 30, height: 30, marginLeft: -15, marginTop: -15 }}
      initial={{ x: startX, y: startY, opacity: 0, scale: 0.5 }}
      animate={{ x: 0, y: yPos, opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center text-[10px] font-bold"
        style={{
          background:
            yao.value === 1
              ? 'linear-gradient(135deg, #c8a45c, #e8d5a3)'
              : 'linear-gradient(135deg, #2a2a2a, #3d3d3d)',
          color: yao.value === 1 ? '#1a1209' : '#777',
          boxShadow: yao.value === 1 ? '0 0 10px rgba(200,164,92,0.35)' : 'inset 0 1px 2px rgba(0,0,0,0.5)',
          border: yao.changing ? '2px solid rgba(200,164,92,0.8)' : '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {yao.changing ? '动' : yao.value === 1 ? '阳' : '阴'}
      </div>
    </motion.div>
  );
};

const RitualDrawing: React.FC<RitualDrawingProps> = ({ onComplete, lines: linesProp, hexagramName }) => {
  const lines = React.useMemo(() => {
    if (linesProp && linesProp.length > 0) return linesProp;
    return Array.from({ length: 6 }, () => ({
      value: (Math.random() > 0.5 ? 1 : 0) as 0 | 1,
      changing: Math.random() > 0.7,
    }));
  }, [linesProp]);
  const displayName = hexagramName || '卦象已现';
  const [phase, setPhase] = useState<'intro' | 'shaking' | 'tossing' | 'landing' | 'settled' | 'assembling' | 'revealing'>('intro');
  const [round, setRound] = useState(0);
  const [showBagua, setShowBagua] = useState(false);
  const { playShake, playCoinDrop, playReveal, vibrate } = useRitualSound();

  const getCoinSides = useCallback(
    (roundIndex: number): Array<'heads' | 'tails'> => {
      const yao = lines[roundIndex];
      if (!yao) return ['heads', 'tails', 'heads'];
      if (yao.changing) {
        return yao.value === 1 ? ['heads', 'heads', 'heads'] : ['tails', 'tails', 'tails'];
      }
      return yao.value === 1 ? ['heads', 'tails', 'tails'] : ['heads', 'heads', 'tails'];
    },
    [lines]
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setPhase('shaking');
        playShake();
        vibrate([50, 100, 50]);
      }, 500)
    );

    let cumulative = 500;
    const roundDuration = (r: number) => (r < 2 ? 1100 : r < 4 ? 900 : 750);

    for (let r = 0; r < 6; r++) {
      const dur = roundDuration(r);

      timers.push(
        setTimeout(() => {
          setRound(r);
          setPhase('shaking');
          playShake();
          vibrate([50, 100, 50]);
        }, cumulative)
      );

      timers.push(
        setTimeout(() => {
          setPhase('tossing');
        }, cumulative + 350)
      );

      timers.push(
        setTimeout(() => {
          setPhase('landing');
          playCoinDrop();
          vibrate([30, 50, 30, 50, 30]);
        }, cumulative + 650)
      );

      timers.push(
        setTimeout(() => {
          setPhase('settled');
        }, cumulative + dur - 80)
      );

      cumulative += dur;
    }

    timers.push(
      setTimeout(() => {
        setPhase('assembling');
        playReveal();
      }, cumulative + 150)
    );

    timers.push(
      setTimeout(() => {
        setPhase('revealing');
        setShowBagua(true);
      }, cumulative + 1300)
    );

    timers.push(
      setTimeout(() => {
        onComplete?.();
      }, cumulative + 2200)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete, playShake, playCoinDrop, playReveal, vibrate]);

  const coinSides = getCoinSides(round);

  const phaseLabel: Record<string, string> = {
    intro: 'Preparing the Sacred Ritual',
    shaking: `Casting Round ${round + 1} of 6…`,
    tossing: 'Coins in Flight…',
    landing: 'Coins Landing…',
    settled: `Round ${round + 1} Revealed`,
    assembling: 'Assembling the Hexagram…',
    revealing: 'Your Hexagram Revealed',
  };

  const phaseTitle: Record<string, string> = {
    intro: '求签问卜',
    shaking: `诚心摇卦 · 第${round + 1}爻`,
    tossing: '铜钱飞出',
    landing: '落地有声',
    settled: `第${round + 1}爻已现`,
    assembling: '卦象凝聚',
    revealing: displayName,
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(200,164,92,0.04) 0%, transparent 50%)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <BaguaCircle show={showBagua} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 z-10"
      >
        <motion.p
          className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-3 font-medium"
          animate={phase === 'shaking' || phase === 'tossing' ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
          transition={{ duration: 1.0, repeat: phase === 'shaking' || phase === 'tossing' ? Infinity : 0 }}
        >
          {phaseLabel[phase]}
        </motion.p>
        <h2
          className="font-heading text-2xl text-white"
          style={{ textShadow: '0 0 40px rgba(200,164,92,0.2)' }}
        >
          {phaseTitle[phase]}
        </h2>
      </motion.div>

      <div className="relative flex flex-col items-center z-10" style={{ minHeight: 260, width: 300 }}>
        <AnimatePresence mode="wait">
          {(phase === 'intro' || phase === 'shaking') && (
            <motion.div
              key="tube"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <BambooTube isShaking={phase === 'shaking'} />
            </motion.div>
          )}

          {(phase === 'tossing' || phase === 'landing' || phase === 'settled') && (
            <motion.div
              key={`coins-${round}`}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              {[0, 1, 2].map((i) => (
                <CoinFlip key={`${round}-${i}`} index={i} side={coinSides[i]} delay={i * 0.05} size={32} />
              ))}
              {phase === 'landing' && (
                <motion.div
                  className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-24 h-5 rounded-full"
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: [0, 0.6, 0], scale: [0.3, 1.6, 2.2] }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: 'radial-gradient(ellipse, rgba(200,164,92,0.35) 0%, transparent 70%)',
                  }}
                />
              )}
            </motion.div>
          )}

          {phase === 'assembling' && (
            <motion.div
              key="assembling"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {lines.map((yao, i) => (
                <AssembledCoin key={i} yao={yao} index={i} delay={i * 0.12} />
              ))}
            </motion.div>
          )}

          {phase === 'revealing' && (
            <motion.div
              key="revealed"
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="text-5xl font-heading text-gold"
                style={{ textShadow: '0 0 30px rgba(200,164,92,0.4)' }}
              >
                {hexagramName}
              </div>
              <div className="flex gap-2 items-center">
                {lines.map((yao, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all"
                    style={{
                      width: 7,
                      height: 7,
                      background: yao.value === 1 ? '#c8a45c' : '#3d3d3d',
                      boxShadow: yao.changing ? '0 0 8px #c8a45c, 0 0 2px #c8a45c' : 'none',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: phase === 'revealing' ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-40 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.3), transparent)',
        }}
      />
    </div>
  );
};

export default RitualDrawing;
