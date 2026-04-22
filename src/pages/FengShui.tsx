import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass as CompassIcon, Sparkles, ChevronDown } from 'lucide-react';
import { fetchAIInterpretation } from '@/services/api';
import { BaguaIcon } from '@/components/SacredIcons';
import Compass from '@/components/fengshui/Compass';
import DirectionPanel from '@/components/fengshui/DirectionPanel';
import BaguaMap from '@/components/fengshui/BaguaMap';
import { directionData } from '@/components/fengshui/fengshuiData';
import type { DirectionInfo } from '@/components/fengshui/fengshuiData';

/* Animation variants */
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function FengShui() {
  const [selectedDir, setSelectedDir] = useState<string | null>(null);
  const [dirInfo, setDirInfo] = useState<DirectionInfo | null>(null);
  const [selectedRoom, setSelectedRoom] = useState('Living Room');
  const [dailyGuidance, setDailyGuidance] = useState('');

  useEffect(() => {
    // Fetch daily fengshui guidance
    fetchAIInterpretation({ type: 'fengshui', data: { roomType: 'Living Room', orientation: 'South' } })
      .then((res) => {
        setDailyGuidance(res.text);
      })
      .catch(() => {
        setDailyGuidance('今日风水：东南方为财位，宜摆放绿植招财。北方为事业位，保持整洁有利事业发展。');
      });
  }, []);

  const handleSelectDirection = useCallback((key: string, info: DirectionInfo) => {
    setSelectedDir(key);
    setDirInfo(info);
  }, []);

  return (
    <div className="min-h-[100dvh]">
      {/* ===== Section 1: Hero ===== */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style={{ minHeight: '560px' }}>
        {/* Background */}
        <div className="absolute inset-0 bg-bg-primary" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(200,164,92,0.04) 0%, transparent 50%)',
          }}
        />

        {/* Rotating Bagua background */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <BaguaIcon className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] text-[#c8a45c] animate-spin-slow opacity-[0.04]" />
        </motion.div>

        {/* Directional lines */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = i * 45;
          return (
            <motion.div
              key={`line-${i}`}
              className="absolute left-1/2 top-1/2 w-[1px] bg-[#c8a45c]/6 origin-top"
              style={{
                height: '60%',
                transform: `rotate(${angle}deg)`,
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5 + i * 0.1,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
            />
          );
        })}

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-[640px] mx-auto">
          {/* Eyebrow */}
          <motion.p
            className="font-sans text-xs font-medium uppercase tracking-[0.12em] text-[#c8a45c]/70 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            FENG SHUI · 风水
          </motion.p>

          {/* Headline */}
          <motion.div
            className="mb-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={staggerItem}
              className="font-sans text-[40px] md:text-[52px] font-medium leading-[1.1] tracking-[-0.015em]"
            >
              <span className="text-text-primary">Harmonize</span>
            </motion.h1>
            <motion.h1
              variants={staggerItem}
              className="font-sans text-[40px] md:text-[52px] font-medium leading-[1.1] tracking-[-0.015em]"
            >
              <span className="text-[#c8a45c]">Your Space</span>
            </motion.h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            className="font-sans text-base md:text-lg font-light text-text-secondary leading-relaxed max-w-[520px] mx-auto mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            The ancient art of placement and energy flow. Discover how your environment shapes your fortune, health, and relationships — and how to align it with the forces of nature.
          </motion.p>

          {/* Daily Guidance */}
          {dailyGuidance && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="max-w-[480px] mx-auto mb-8 px-4 py-3 rounded-lg border border-[#c8a45c]/20 bg-[#c8a45c]/5"
            >
              <p className="font-sans text-xs text-[#c8a45c]/70 uppercase tracking-wider mb-1">今日能量指引</p>
              <p className="font-sans text-sm text-text-secondary leading-relaxed">{dailyGuidance}</p>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <motion.a
              href="/#/pricing"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md font-sans text-sm font-semibold uppercase tracking-[0.04em] transition-all duration-300 hover:scale-[1.02] hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #c8a45c 0%, #e8d5a3 40%, #f0d878 60%, #c8a45c 100%)',
                backgroundSize: '200% 200%',
                color: '#0a0a0f',
              }}
              whileHover={{ boxShadow: '0 0 30px rgba(200,164,92,0.3)' }}
            >
              <CompassIcon size={16} />
              Get Full Analysis
            </motion.a>
            <a
              href="/#/bazi"
              className="inline-flex items-center px-8 py-3.5 rounded-md font-sans text-sm font-medium border transition-all duration-300 hover:bg-[#c8a45c]/8 border-[#c8a45c]/30 text-[#c8a45c]"
            >
              Try Bazi Destiny
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-12 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <ChevronDown size={20} className="text-[#c8a45c]/70/50 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ===== Section 2: The Compass ===== */}
      <section id="compass" className="relative bg-bg-primary py-16 md:py-24 lg:py-28">
        <div className="max-w-[900px] mx-auto px-6">
          {/* Section header */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <p className="font-sans text-xs font-medium uppercase tracking-[0.12em] text-[#c8a45c]/70 mb-3">
              THE LUOPAN COMPASS · 罗盘
            </p>
            <h2 className="font-sans text-[28px] md:text-[36px] font-medium text-text-primary mb-3">
              The Energy Map
            </h2>
            <p className="font-sans text-sm md:text-base text-text-secondary max-w-[520px] mx-auto">
              The ancient Feng Shui compass reveals how energy flows through space. Click any direction to learn its significance.
            </p>
          </motion.div>

          {/* Compass */}
          <Compass
            onSelectDirection={handleSelectDirection}
            selectedDirection={selectedDir}
          />

          {/* Direction analysis panel */}
          {selectedDir && dirInfo && (
            <DirectionPanel
              directionKey={selectedDir}
              info={dirInfo}
              selectedRoom={selectedRoom}
              onRoomChange={setSelectedRoom}
            />
          )}

          {/* Hint text when no direction selected */}
          {!selectedDir && (
            <motion.p
              className="text-center mt-8 font-sans text-sm text-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <Sparkles size={14} className="inline-block mr-2 -mt-0.5" />
              Click on a direction to reveal its energy analysis
            </motion.p>
          )}
        </div>
      </section>

      {/* ===== Section 3: Bagua Map ===== */}
      <section className="relative bg-bg-primary py-16 md:py-24 lg:py-28 border-t border-[#c8a45c]/5">
        <div className="max-w-[1000px] mx-auto px-6">
          {/* Section header */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <p className="font-sans text-xs font-medium uppercase tracking-[0.12em] text-[#c8a45c]/70 mb-3">
              BAGUA MAP · 八卦图
            </p>
            <h2 className="font-sans text-[28px] md:text-[36px] font-medium text-text-primary mb-3">
              The Eight Areas of Life
            </h2>
            <p className="font-sans text-sm md:text-base text-text-secondary max-w-[560px] mx-auto">
              The Bagua map divides your space into eight life aspects. Each area corresponds to a direction, element, and aspect of your wellbeing.
            </p>
          </motion.div>

          {/* Bagua Grid */}
          <BaguaMap />

          {/* Direction legend */}
          <motion.div
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {Object.entries(directionData).map(([key, info]) => (
              <button
                key={key}
                onClick={() => handleSelectDirection(key, info)}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: info.color }}
                />
                <span className="font-sans text-xs text-text-muted group-hover:text-text-secondary transition-colors">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== Section 4: CTA ===== */}
      <section className="relative py-16 md:py-24" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #f5efe6 100%)' }}>
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <h2 className="font-sans text-[28px] md:text-[36px] font-medium text-black mb-4">
              Your Space Shapes Your Life
            </h2>
            <p className="font-sans text-base text-gray-600 leading-relaxed mb-8">
              Small changes in your environment can create profound shifts in your energy, mood, and fortune. Start your transformation today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/#/pricing"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md font-sans text-sm font-semibold uppercase tracking-[0.04em] transition-all duration-300 hover:scale-[1.02] hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #c8a45c 0%, #e8d5a3 40%, #f0d878 60%, #c8a45c 100%)',
                  color: '#0a0a0f',
                }}
              >
                Get Full Analysis
              </a>
              <a
                href="/#/bazi"
                className="inline-flex items-center px-8 py-3.5 rounded-md font-sans text-sm font-medium border transition-all duration-300 hover:bg-[#c8a45c]/8 border-[#c8a45c]/30 text-[#c8a45c]"
              >
                Try Bazi Destiny
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
