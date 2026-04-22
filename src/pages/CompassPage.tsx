import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowRight } from 'lucide-react';
import WebCompass from '@/components/compass/WebCompass';

const GOLD = '#c8a45c';

export default function CompassPage() {
  const [active, setActive] = useState(false);

  const handleActivate = useCallback(() => {
    setActive(true);
  }, []);

  const handleClose = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div
            key="landing"
            className="flex flex-col items-center text-center px-6 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            {/* Decorative Icon */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Compass size={48} style={{ color: GOLD }} strokeWidth={1.5} />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="font-serif mt-6 mb-4"
              style={{
                color: GOLD,
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                letterSpacing: '0.05em',
                lineHeight: 1.2,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Digital Compass
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="leading-relaxed mb-10"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                maxWidth: 420,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              Discover the ancient wisdom of Feng Shui directions. Align yourself
              with the energy of the universe and unlock insights about your path,
              element, and fortune.
            </motion.p>

            {/* Activate Button */}
            <motion.button
              className="flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm uppercase cursor-pointer"
              style={{
                backgroundColor: GOLD,
                color: '#000000',
                letterSpacing: '0.15em',
                boxShadow: '0 0 20px rgba(200, 164, 92, 0.3)',
              }}
              onClick={handleActivate}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(200, 164, 92, 0.6)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Activate Compass</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </motion.button>

            {/* Decorative glow orbs */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 300,
                height: 300,
                background: 'radial-gradient(circle, rgba(200,164,92,0.08) 0%, transparent 70%)',
                top: '10%',
                left: '-10%',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 250,
                height: 250,
                background: 'radial-gradient(circle, rgba(200,164,92,0.06) 0%, transparent 70%)',
                bottom: '15%',
                right: '-5%',
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="compass"
            className="fixed inset-0 z-50"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <WebCompass onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
