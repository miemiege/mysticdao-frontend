import { useEffect, useRef, useState, memo } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { ChevronDown, Compass, Sparkles, ArrowRight } from 'lucide-react';
import TaijiParticles from '@/components/home/TaijiParticles';


/* ─── Easing Token ─── */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── Animation Variants ─── */
// fadeUp variant is inlined below for tree-shaking friendliness

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

/* ─── Perpetual Animation Isolation ─── */
const RotatingMandala = memo(function RotatingMandala() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
      <img
        src="./hero-mandala-bg.webp"
        alt=""
        className="w-[800px] h-[800px] lg:w-[1000px] lg:h-[1000px] object-contain opacity-[0.15] animate-spin-slow"
        aria-hidden="true"
      />
    </div>
  );
});

const MandalaMemo = RotatingMandala;

/* ─── Section 1: Hero ─── */
function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const parallaxY = useMotionValue(0);
  const fogY = useTransform(parallaxY, (v) => v * 0.3);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      parallaxY.set(y);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallaxY]);

  const words1 = ['Unlock', 'the', 'Wisdom'];
  const words2 = ['of', 'the', 'Ancient', 'East'];

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Layer 1: Black base */}
      <div className="absolute inset-0 bg-black z-0" />

      {/* Layer 2: Particle field */}
      <div className="absolute inset-0 z-[1]">
        <TaijiParticles count={80} />
      </div>

      {/* Layer 3: Mandala */}
      <MandalaMemo />

      {/* Layer 4: Fog */}
      <motion.div
        style={{ y: fogY }}
        className="absolute inset-0 z-[3] pointer-events-none"
      >
        <img
          src="./hero-fog-layer.webp"
          alt=""
          className="w-full h-full object-cover opacity-[0.08]"
          aria-hidden="true"
        />
      </motion.div>

      {/* Layer 5: Vignette */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #000000 85%)' }}
      />

      {/* Layer 5.5: Jade Glow */}
      <div
        className="absolute inset-0 z-[4.5] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(20,50,30,0.15) 0%, rgba(10,30,15,0.08) 40%, transparent 70%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: easeOutExpo }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/30 bg-gold/[0.06] mb-8"
        >
          <span className="text-xs font-medium tracking-[0.1em] text-gold uppercase">
            &lsaquo; Ancient Wisdom, Modern Guidance &rsaquo;
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="font-heading text-[40px] lg:text-[64px] font-bold text-white leading-[1.1] tracking-[-0.02em] mb-6"
          style={{ textShadow: '0 0 40px rgba(200,164,92,0.3)' }}
        >
          <span className="block overflow-hidden">
            {words1.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.06, duration: 0.8, ease: easeOutExpo }}
                className="inline-block mr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block overflow-hidden">
            {words2.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + (words1.length + i) * 0.06, duration: 0.8, ease: easeOutExpo }}
                className="inline-block mr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: easeOutExpo }}
          className="text-base text-white/60 leading-relaxed max-w-[540px] mx-auto mb-10"
        >
          Eastern mysticism for the modern soul. Feng Shui harmony and daily I Ching guidance.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6, ease: easeOutExpo }}
          className="flex flex-col items-center justify-center gap-5"
        >
          {/* Pre-CTA tagline */}
          <span className="text-xs text-gold/60 tracking-wider uppercase">
            Today&apos;s Wisdom Awaits
          </span>

          {/* Primary CTA */}
          <a
            href="./#/daily"
            className="inline-flex items-center px-10 py-4 rounded-full bg-gold text-black text-sm font-semibold uppercase tracking-widest animate-glow-pulse hover:bg-gold-light hover:scale-[1.04] hover:shadow-[0_0_50px_rgba(200,164,92,0.5)] transition-all duration-300"
          >
            🔮 Discover Your Daily Fortune
          </a>

          {/* Secondary CTA */}
          <a
            href="./#/fengshui"
            className="inline-flex items-center px-7 py-2.5 rounded-full border border-gold/40 text-gold text-[11px] font-medium uppercase tracking-widest hover:bg-gold/[0.08] hover:border-gold/70 hover:shadow-[0_0_20px_rgba(200,164,92,0.15)] transition-all duration-300"
          >
            Feng Shui Compass
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollY > 100 ? 0 : 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/35">Scroll</span>
        <ChevronDown className="w-4 h-4 text-white/35 animate-bounce-subtle" />
      </motion.div>
    </section>
  );
}

/* ─── Section 2: Feature Preview ─── */
const features = [
  {
    title: 'Feng Shui',
    chinese: '\u98CE\u6C34\u7F57\u76D8',
    description: 'Harmonize your living and working spaces with the ancient art of energy flow. Discover how orientation, layout, and elements shape your daily fortune.',
    href: '/#/fengshui',
    icon: Compass,
    image: './service-fengshui.jpg',
  },
  {
    title: 'Daily I Ching',
    chinese: '\u6BCF\u65E5\u4E00\u5366',
    description: 'Draw from the timeless I Ching for daily guidance and deep introspection. Each hexagram carries a message from the universe, waiting to be revealed.',
    href: '/#/daily',
    icon: Sparkles,
    image: './service-love.jpg',
  },
];

function FeatureSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="features" ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="text-center mb-14"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-3 block">
            Our Services
          </span>
          <h2 className="font-heading text-[26px] lg:text-[36px] font-semibold text-white leading-tight mb-4">
            Two Paths of Ancient Wisdom
          </h2>
          <p className="text-base text-white/60 max-w-[480px] mx-auto mb-6">
            Ancient Eastern arts, refined through timeless wisdom for your unique journey.
          </p>
          <div className="w-[60px] h-[1px] bg-gold mx-auto" />
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={staggerItem}>
              <a href={f.href} className="block group h-full">
                <div className="h-full relative rounded-2xl overflow-hidden border border-white/[0.08] transition-all duration-400 hover:border-gold/50 hover:-translate-y-[4px] hover:shadow-[0_12px_40px_rgba(200,164,92,0.15)]">
                  {/* Image background layer */}
                  <div className="absolute inset-0">
                    <img
                      src={f.image}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      aria-hidden="true"
                    />
                    {/* Black gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  </div>
                  {/* Content layer (above overlay) */}
                  <div className="relative h-full p-8 flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-gold/[0.15] backdrop-blur-sm flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-gold/[0.25]">
                      <f.icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-white mb-1">
                      {f.title}
                    </h3>
                    {f.chinese && (
                      <span className="text-xs text-gold/60 block mb-3">{f.chinese}</span>
                    )}
                    <p className="text-sm text-white/70 leading-relaxed mb-6 flex-1">
                      {f.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.1em] text-gold group-hover:underline">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Section 3: Brand Story ─── */

/* ─── Home Page ─── */
export default function Home() {
  return (
    <div className="bg-black">
      <HeroSection />
      <FeatureSection />


    </div>
  );
}
