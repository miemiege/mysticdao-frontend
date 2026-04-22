import { useEffect, useRef, useState, memo } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { ChevronDown, ScrollText, Compass, Sparkles, Crown, ArrowRight } from 'lucide-react';

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
        src="/hero-mandala-bg.png"
        alt=""
        className="w-[800px] h-[800px] lg:w-[1000px] lg:h-[1000px] object-contain opacity-[0.15] animate-spin-slow"
        aria-hidden="true"
      />
    </div>
  );
});

const MandalaMemo = RotatingMandala;

/* ─── Particle Field (Canvas) ─── */
const ParticleField = memo(function ParticleField({ count = 150 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w: number, h: number;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
    }

    const particles: Particle[] = [];

    function resize() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
    }

    function init() {
      resize();
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 1 + Math.random() * 2,
          speedY: -(0.2 + Math.random() * 0.3),
          speedX: (Math.random() - 0.5) * 0.2,
          opacity: 0.3 + Math.random() * 0.5,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200, 164, 92, ${p.opacity})`;
        ctx!.fill();
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
      }
      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
      aria-hidden="true"
    />
  );
});

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
        <ParticleField count={150} />
      </div>

      {/* Layer 3: Mandala */}
      <MandalaMemo />

      {/* Layer 4: Fog */}
      <motion.div
        style={{ y: fogY }}
        className="absolute inset-0 z-[3] pointer-events-none"
      >
        <img
          src="/hero-fog-layer.png"
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
          style={{ textShadow: '0 0 60px rgba(200,164,92,0.15)' }}
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
          Eastern mysticism for the modern soul. Bazi destiny, Feng Shui harmony, and daily I Ching guidance — all in one sacred space.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6, ease: easeOutExpo }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="./#/bazi"
            className="inline-flex items-center px-8 py-3 rounded-full bg-gold text-black text-xs font-medium uppercase tracking-widest hover:bg-gold-light hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(200,164,92,0.3)] transition-all duration-300"
          >
            Get Your Free Reading
          </a>
          <a
            href="#features"
            className="inline-flex items-center px-8 py-3 rounded-full border border-gold/40 text-gold text-xs font-medium uppercase tracking-widest hover:bg-gold/[0.08] hover:border-gold/70 transition-all duration-300"
          >
            Explore Services
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
    title: 'Bazi Destiny',
    chinese: '\u516B\u5B57\u547D\u7406',
    description: 'Uncover the blueprint of your life written in the stars at your birth. Your Four Pillars reveal personality, career path, relationships, and fortune cycles.',
    href: '/#/bazi',
    icon: ScrollText,
  },
  {
    title: 'Feng Shui',
    chinese: '\u98CE\u6C34\u7F57\u76D8',
    description: 'Harmonize your living and working spaces with the ancient art of energy flow. Discover how orientation, layout, and elements shape your daily fortune.',
    href: '/#/fengshui',
    icon: Compass,
  },
  {
    title: 'Daily I Ching',
    chinese: '\u6BCF\u65E5\u4E00\u5366',
    description: 'Draw from the timeless I Ching for daily guidance and deep introspection. Each hexagram carries a message from the universe, waiting to be revealed.',
    href: '/#/daily',
    icon: Sparkles,
  },
  {
    title: 'Premium Access',
    chinese: '',
    description: 'Unlock deeper insights with AI-powered interpretations. Personalized readings, detailed analysis, and unlimited daily draws.',
    href: '/#/pricing',
    icon: Crown,
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
            Three Paths of Ancient Wisdom
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={staggerItem}>
              <a href={f.href} className="block group h-full">
                <div className="h-full bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 transition-all duration-400 hover:border-gold/30 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(200,164,92,0.08)]">
                  <div className="w-12 h-12 rounded-xl bg-gold/[0.08] flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-gold/[0.15]">
                    <f.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-white mb-1">
                    {f.title}
                  </h3>
                  {f.chinese && (
                    <span className="text-xs text-gold/60 block mb-3">{f.chinese}</span>
                  )}
                  <p className="text-sm text-white/60 leading-relaxed mb-6">
                    {f.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.1em] text-gold group-hover:underline">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
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
function BrandStorySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const trigrams = ['\u2630', '\u2637', '\u2633', '\u2634', '\u2635', '\u2636', '\u2631', '\u2632'];

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* Left Column — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOutExpo }}
          >
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-3 block">
              Our Story
            </span>
            <h2 className="font-heading text-[26px] lg:text-[36px] font-semibold text-white leading-tight mb-6">
              Where Ancient Science Meets Modern Insight
            </h2>
            <p className="text-base text-white/60 leading-relaxed mb-5">
              For thousands of years, the sages of the East have studied the hidden patterns of the universe — the flow of Qi (&#x6C14;), the balance of Yin and Yang, the cycles of the Five Elements. These ancient arts were never meant to be locked in temples or buried in scrolls.
            </p>
            <p className="text-base text-white/60 leading-relaxed mb-6">
              MysticDao was born from a simple belief: that the wisdom of Bazi, Feng Shui, and the I Ching should be accessible to every seeker in the modern world. We blend time-honored metaphysical principles with thoughtful digital craft, creating a space where ancient insight meets contemporary clarity.
            </p>
            <div className="w-[60px] h-[1px] bg-gold/40" />
          </motion.div>

          {/* Right Column — Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: easeOutExpo }}
            className="flex items-center justify-center"
          >
            <div className="relative w-[300px] h-[300px] animate-spin-slow">
              {/* Outer circle */}
              <div className="absolute inset-0 rounded-full border border-gold/10" />
              {/* Trigrams */}
              {trigrams.map((t, i) => {
                const angle = (i * 360) / 8;
                const rad = (angle * Math.PI) / 180;
                const x = 50 + 40 * Math.sin(rad);
                const y = 50 - 40 * Math.cos(rad);
                return (
                  <span
                    key={i}
                    className="absolute text-gold/15 text-lg font-heading select-none"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    {t}
                  </span>
                );
              })}
              {/* Inner circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[100px] h-[100px] rounded-full bg-gold/[0.03] flex items-center justify-center">
                  <span className="font-heading text-[48px] text-gold/40">&#x9053;</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 4: Stats ─── */
const stats = [
  { number: '50K+', label: 'Seekers Guided', numericValue: 50 },
  { number: '98%', label: 'Satisfaction Rate', numericValue: 98, suffix: '%' },
  { number: '500+', label: 'Years Wisdom', numericValue: 500, suffix: '+' },
  { number: '24/7', label: 'AI Guidance', numericValue: 24, suffix: '/7' },
];

function AnimatedCounter({
  target,
  suffix = '',
  isInView,
}: {
  target: number;
  suffix?: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const duration = 2000;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="text-center mb-14"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-3 block">
            Testimonials
          </span>
          <h2 className="font-heading text-[26px] lg:text-[36px] font-semibold text-white leading-tight mb-4">
            Voices of Destiny
          </h2>
          <div className="w-[60px] h-[1px] bg-gold mx-auto" />
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: easeOutExpo }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 mb-16"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-heading text-[32px] lg:text-[48px] font-bold text-gold leading-none mb-2">
                {i < 3 ? (
                  <AnimatedCounter target={s.numericValue} suffix={s.suffix || '+'} isInView={isInView} />
                ) : (
                  <>
                    <AnimatedCounter target={24} suffix="" isInView={isInView} />
                    <span className="text-gold">/7</span>
                  </>
                )}
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/35">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Testimonial Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              name: 'Sarah M.',
              title: 'Marketing Director, Los Angeles',
              quote: 'The Bazi reading was shockingly accurate about my career crossroads. It described my personality in ways no Western astrology ever has. I revisit my chart whenever I need clarity.',
              initials: 'SM',
            },
            {
              name: 'Elena R.',
              title: 'Interior Designer, London',
              quote: 'After the Feng Shui analysis, I rearranged my home office following the energy flow suggestions. Within weeks, I felt more focused and three new clients found me. Coincidence? I don\'t think so.',
              initials: 'ER',
            },
            {
              name: 'Marcus T.',
              title: 'Software Engineer, Singapore',
              quote: 'The Daily I Ching has become my morning ritual. Each reading feels personally crafted \u2014 the AI interpretation adds a layer of depth that makes ancient wisdom feel surprisingly relevant to my daily challenges.',
              initials: 'MT',
            },
          ].map((t) => (
            <motion.div key={t.name} variants={staggerItem}>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 h-full">
                <span className="text-gold/30 text-[48px] font-heading leading-none block mb-2">&ldquo;</span>
                <p className="text-sm text-white/60 leading-relaxed italic mb-5">
                  {t.quote}
                </p>
                <div className="w-full h-[1px] bg-white/[0.06] mb-5" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/[0.15] flex items-center justify-center">
                    <span className="text-xs font-medium text-gold">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-[11px] text-white/35">{t.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Section 5: How It Works ─── */
const steps = [
  {
    num: '01',
    label: 'SHARE',
    title: 'Enter Your Sacred Details',
    description: 'Share your birth date, time, and the question weighing on your heart. Every reading is personal, private, and protected \u2014 your trust is sacred to us.',
  },
  {
    num: '02',
    label: 'DISCOVER',
    title: 'Receive Your Cosmic Reading',
    description: 'Ancient algorithms meet modern intelligence. Our system weaves together Bazi charts, I Ching wisdom, and Feng Shui principles tailored to your unique cosmic signature.',
  },
  {
    num: '03',
    label: 'REFLECT',
    title: 'Find Your Path Forward',
    description: 'Read your personalized insights, save your readings, and return whenever you seek guidance. Your journey of self-discovery continues with every visit.',
  },
];

function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="text-center mb-14"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-3 block">
            The Journey
          </span>
          <h2 className="font-heading text-[26px] lg:text-[36px] font-semibold text-white leading-tight mb-4">
            How MysticDao Works
          </h2>
          <p className="text-base text-white/60 max-w-[480px] mx-auto">
            A seamless path from curiosity to cosmic clarity. Your wisdom journey in three simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line - desktop only */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, ease: easeOutExpo, delay: 0.3 }}
            className="hidden lg:block absolute top-6 left-[16.67%] right-[16.67%] h-[1px] bg-gold/15 origin-left"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8"
          >
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={staggerItem} className="text-center">
                <motion.div
                  initial={{ borderColor: 'rgba(200,164,92,0.3)', backgroundColor: 'transparent' }}
                  animate={isInView ? { borderColor: 'rgba(200,164,92,0.6)', backgroundColor: 'rgba(200,164,92,0.1)' } : {}}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.4 }}
                  className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mx-auto mb-4"
                >
                  <span className="font-heading text-lg font-semibold text-gold">{step.num}</span>
                </motion.div>
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold block mb-2">
                  {step.label}
                </span>
                <h3 className="font-heading text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-[280px] mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 6: CTA ─── */
function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(200,164,92,0.06) 0%, transparent 60%)' }}
      />
      <div className="absolute inset-0 z-[1]">
        <ParticleField count={50} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: easeOutExpo }}
        className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center"
      >
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-3 block">
          Your Journey Awaits
        </span>
        <h2 className="font-heading text-[26px] lg:text-[36px] font-semibold text-white leading-tight mb-4">
          Begin Your Journey Today
        </h2>
        <p className="text-base text-white/60 max-w-[460px] mx-auto mb-8">
          The universe has been waiting for you to ask. Discover what the ancient wisdom can reveal about your path.
        </p>

        <a
          href="./#/bazi"
          className="inline-flex items-center px-10 py-4 rounded-full bg-gold text-black text-sm font-medium uppercase tracking-widest hover:bg-gold-light hover:scale-[1.03] animate-glow-pulse transition-all duration-300"
        >
          Get Your Free Reading
        </a>

        <div className="mt-6">
          <a
            href="./#/pricing"
            className="text-sm text-gold hover:underline transition-all duration-200"
          >
            View Pricing Plans
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Home Page ─── */
export default function Home() {
  return (
    <div className="bg-black">
      <HeroSection />
      <FeatureSection />
      <BrandStorySection />
      <StatsSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}
