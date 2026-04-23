import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RitualDrawingProps {
  onComplete?: () => void;
  drawnCard?: { name: string; keyword: string; aspect: string } | null;
}

// 八卦符号
const BAGUA_SYMBOLS = ['☰', '☷', '☳', '☵', '☶', '☴', '☲', '☱'];

// 金色粒子
const GoldenParticle: React.FC<{ delay: number; x: number }> = ({ delay, x }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-gold"
    style={{ left: `${x}%`, top: '20%' }}
    initial={{ opacity: 0, y: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      y: [-20, -80, -140],
      x: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 30],
      scale: [0, 1.2, 0],
    }}
    transition={{ delay, duration: 2, ease: 'easeOut' }}
  />
);

// 竹筒组件
const BambooTube: React.FC<{ isShaking: boolean }> = ({ isShaking }) => {
  return (
    <motion.div
      className="relative"
      style={{ width: 80, height: 140 }}
      animate={isShaking ? {
        rotate: [-8, 10, -12, 8, -6, 4, -2, 0],
        x: [-5, 8, -10, 6, -4, 3, -1, 0],
      } : {}}
      transition={isShaking ? { duration: 1.8, ease: 'easeInOut' } : {}}
    >
      {/* 筒身 - 圆柱体效果 */}
      <div
        className="absolute inset-0 rounded-b-2xl rounded-t-lg overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #1a1209 0%, #2d1f0e 15%, #3d2b15 30%, #2d1f0e 50%, #1a1209 70%, #0f0a04 100%)',
          boxShadow: 'inset 2px 0 8px rgba(200,164,92,0.1), inset -2px 0 8px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.6)',
        }}
      >
        {/* 竹节纹理 */}
        {[20, 50, 80].map((top) => (
          <div
            key={top}
            className="absolute left-0 right-0 h-[2px]"
            style={{
              top: `${top}%`,
              background: 'linear-gradient(90deg, transparent 0%, rgba(200,164,92,0.15) 30%, rgba(200,164,92,0.25) 50%, rgba(200,164,92,0.15) 70%, transparent 100%)',
            }}
          />
        ))}

        {/* 金色箍环 */}
        <div
          className="absolute top-[8%] left-[-2px] right-[-2px] h-[3px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #c8a45c 20%, #e8d5a3 50%, #c8a45c 80%, transparent 100%)',
            boxShadow: '0 0 8px rgba(200,164,92,0.3)',
          }}
        />
        <div
          className="absolute bottom-[12%] left-[-2px] right-[-2px] h-[3px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #c8a45c 20%, #e8d5a3 50%, #c8a45c 80%, transparent 100%)',
            boxShadow: '0 0 8px rgba(200,164,92,0.3)',
          }}
        />

        {/* 太极符号 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <svg viewBox="0 0 40 40" className="w-10 h-10">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#c8a45c" strokeWidth="1" />
            <path d="M20 2C10 2 2 10 2 20s8 18 18 18V2z" fill="#c8a45c" fillOpacity="0.6" />
            <circle cx="20" cy="11" r="3.5" fill="#c8a45c" />
            <circle cx="20" cy="29" r="3.5" fill="none" stroke="#c8a45c" strokeWidth="1" />
          </svg>
        </div>

        {/* "运" 字 */}
        <div
          className="absolute bottom-[18%] left-0 right-0 text-center font-heading text-lg tracking-widest"
          style={{ color: 'rgba(200,164,92,0.25)' }}
        >
          運
        </div>
      </div>

      {/* 筒口高光 */}
      <div
        className="absolute top-0 left-0 right-0 h-[6px] rounded-t-lg"
        style={{
          background: 'linear-gradient(90deg, #0f0a04 0%, #3d2b15 30%, #c8a45c40 50%, #3d2b15 70%, #0f0a04 100%)',
        }}
      />
    </motion.div>
  );
};

// 灵签组件
const FortuneStick: React.FC<{ cardName: string; onSettled: () => void }> = ({ cardName, onSettled }) => {
  const [phase, setPhase] = useState<'falling' | 'glowing' | 'revealing'>('falling');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('glowing'), 1200);
    const t2 = setTimeout(() => {
      setPhase('revealing');
      onSettled();
    }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onSettled]);

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ y: -40, opacity: 0, rotateX: 45 }}
      animate={phase === 'falling' ? { y: 60, opacity: 1, rotateX: 0 } : { y: 60, opacity: 1 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* 签体 */}
      <motion.div
        className="relative overflow-hidden"
        style={{
          width: 28,
          height: phase === 'revealing' ? 120 : 80,
          borderRadius: 4,
          background: phase === 'revealing'
            ? 'linear-gradient(180deg, #1a1209 0%, #2d1f0e 50%, #1a1209 100%)'
            : 'linear-gradient(180deg, #c8a45c 0%, #e8d5a3 30%, #c8a45c 60%, #1a1209 100%)',
          boxShadow: phase === 'glowing' || phase === 'revealing'
            ? '0 0 20px rgba(200,164,92,0.4), 0 0 40px rgba(200,164,92,0.15)'
            : '0 2px 8px rgba(0,0,0,0.5)',
          transition: 'height 0.6s ease, background 0.6s ease, box-shadow 0.6s ease',
        }}
      >
        {/* 签头金色 */}
        {phase !== 'revealing' && (
          <div
            className="absolute top-0 left-0 right-0 h-3"
            style={{
              background: 'linear-gradient(180deg, #e8d5a3 0%, #c8a45c 100%)',
            }}
          />
        )}

        {/* 卦名显示 */}
        <AnimatePresence>
          {phase === 'revealing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span className="text-gold font-heading text-xs tracking-wider mb-1" style={{ textShadow: '0 0 8px rgba(200,164,92,0.5)' }}>
                第{Math.floor(Math.random() * 64 + 1)}卦
              </span>
              <span className="text-white font-bold text-sm" style={{ textShadow: '0 0 10px rgba(200,164,92,0.3)' }}>
                {cardName}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 金色边框 */}
        <div
          className="absolute inset-0 rounded pointer-events-none"
          style={{
            border: '1px solid rgba(200,164,92,0.3)',
          }}
        />
      </motion.div>

      {/* 落地光效 */}
      <AnimatePresence>
        {phase === 'glowing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-0 w-20 h-4 rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(200,164,92,0.3) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 八卦环绕符号
const BaguaCircle: React.FC<{ show: boolean }> = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute pointer-events-none"
          style={{ width: 300, height: 300 }}
        >
          {BAGUA_SYMBOLS.map((symbol, i) => {
            const angle = (i * 360) / 8 - 90;
            const rad = (angle * Math.PI) / 180;
            const x = 150 + 130 * Math.cos(rad);
            const y = 150 + 130 * Math.sin(rad);
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.25, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.08, duration: 0.4 }}
                className="absolute text-gold text-2xl font-heading"
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
          {/* 外圈光环 */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(200,164,92,0.1)',
              boxShadow: '0 0 30px rgba(200,164,92,0.05), inset 0 0 30px rgba(200,164,92,0.02)',
            }}
          />
          <div
            className="absolute inset-[15%] rounded-full"
            style={{
              border: '1px solid rgba(200,164,92,0.08)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 主仪式动画组件
const RitualDrawing: React.FC<RitualDrawingProps> = ({ onComplete, drawnCard }) => {
  const [phase, setPhase] = useState<'intro' | 'shaking' | 'dropping' | 'revealing'>('intro');
  const [showBagua, setShowBagua] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('shaking'), 600),
      setTimeout(() => setPhase('dropping'), 2400),
      setTimeout(() => setShowBagua(true), 2600),
      setTimeout(() => setPhase('revealing'), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStickSettled = () => {
    onComplete?.();
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh]">
      {/* 背景光晕 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(200,164,92,0.04) 0%, transparent 50%)',
        }}
      />

      {/* 八卦环绕 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <BaguaCircle show={showBagua} />
      </div>

      {/* 仪式标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 z-10"
      >
        <motion.p
          className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-3 font-medium"
          animate={phase === 'shaking' ? { opacity: [0.6, 1, 0.6] } : {}}
          transition={phase === 'shaking' ? { duration: 1.5, repeat: Infinity } : {}}
        >
          {phase === 'intro' && 'Preparing the Sacred Ritual'}
          {phase === 'shaking' && 'Shaking the Fortune Sticks...'}
          {phase === 'dropping' && 'A Stick Emerges...'}
          {phase === 'revealing' && 'Your Hexagram Revealed'}
        </motion.p>
        <h2
          className="font-heading text-2xl text-white"
          style={{ textShadow: '0 0 40px rgba(200,164,92,0.2)' }}
        >
          {phase === 'intro' && '求签问卜'}
          {phase === 'shaking' && '诚心摇卦'}
          {phase === 'dropping' && '灵签落地'}
          {phase === 'revealing' && (drawnCard?.name || '卦象已现')}
        </h2>
      </motion.div>

      {/* 竹筒 + 签 容器 */}
      <div className="relative flex flex-col items-center z-10" style={{ minHeight: 280 }}>
        {/* 金色粒子 */}
        <AnimatePresence>
          {phase === 'shaking' && (
            <>
              {Array.from({ length: 12 }).map((_, i) => (
                <GoldenParticle
                  key={i}
                  delay={0.3 + i * 0.15}
                  x={35 + Math.random() * 30}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* 竹筒 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <BambooTube isShaking={phase === 'shaking'} />
        </motion.div>

        {/* 签 */}
        <div className="absolute" style={{ top: 0 }}>
          {(phase === 'dropping' || phase === 'revealing') && drawnCard && (
            <FortuneStick
              cardName={drawnCard.name}
              onSettled={handleStickSettled}
            />
          )}
        </div>
      </div>

      {/* 底部装饰线 */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: phase === 'revealing' ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-40 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(200,164,92,0.3), transparent)',
        }}
      />
    </div>
  );
};

export default RitualDrawing;
