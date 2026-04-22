import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, ArrowLeft } from 'lucide-react';
import WebCompass from '@/components/compass/WebCompass';

export default function CompassPage() {
  const [active, setActive] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-black flex flex-col">
      {!active ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-full border-2 border-[#c8a45c]/30 flex items-center justify-center mx-auto mb-6">
              <Navigation size={32} className="text-[#c8a45c]" />
            </div>
            <h1 className="font-sans text-3xl md:text-4xl font-medium text-white mb-3">
              Digital Compass
            </h1>
            <p className="font-sans text-sm text-white/50 leading-relaxed mb-8">
              Your device becomes a Luopan. On mobile, sensors drive the needle.
              On desktop, drag to explore directions.
            </p>
            <button
              onClick={() => setActive(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#c8a45c] text-black text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-all"
            >
              <Navigation size={16} />
              Activate Compass
            </button>
            <a
              href="/#/fengshui"
              className="block mt-6 text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              <ArrowLeft size={12} className="inline mr-1" />
              Back to Feng Shui
            </a>
          </motion.div>
        </div>
      ) : (
        <WebCompass onClose={() => setActive(false)} />
      )}
    </div>
  );
}
