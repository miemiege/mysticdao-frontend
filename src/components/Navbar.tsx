import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#/' },
  { label: 'Bazi', href: '#/bazi' },
  { label: 'Feng Shui', href: '#/fengshui' },
  { label: 'Daily', href: '#/daily' },
  { label: 'Compass', href: '#/compass' },
  { label: 'Pricing', href: '#/pricing' },
];

function YinYangIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10V2z" fill="currentColor" fillOpacity="0.6" />
      <circle cx="12" cy="7" r="2" fill="currentColor" />
      <circle cx="12" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePath, setActivePath] = useState('/');

  useEffect(() => {
    const path = window.location.hash.replace('#', '') || '/';
    setActivePath(path);
    const handleHashChange = () => {
      const p = window.location.hash.replace('#', '') || '/';
      setActivePath(p);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isActive = (href: string) => {
    const path = href.replace('/#', '') || '/';
    return activePath === path;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] backdrop-blur-xl bg-black/70 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Brand */}
          <a href="./#/" className="flex items-center gap-2 text-gold">
            <YinYangIcon className="w-6 h-6" />
            <span className="font-heading text-xl font-bold tracking-tight">MysticDao</span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-gold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gold"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="./#/bazi"
              className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full bg-gold text-black text-xs font-medium uppercase tracking-widest hover:bg-gold-light hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(200,164,92,0.3)] transition-all duration-300"
            >
              Begin Your Journey
            </a>
            <button
              className="md:hidden text-white/80 hover:text-white p-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-[100]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-black border-l border-white/[0.08] z-[101] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <span className="font-heading text-lg font-bold text-gold">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-white/60 hover:text-white p-1"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium uppercase tracking-widest transition-colors ${
                      isActive(link.href)
                        ? 'text-gold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
              <div className="mt-auto p-6">
                <a
                  href="./#/bazi"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-6 py-3 rounded-full bg-gold text-black text-xs font-medium uppercase tracking-widest"
                >
                  Begin Your Journey
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
