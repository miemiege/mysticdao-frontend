import { ScrollText, Compass, Sparkles, Crown } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/#/' },
  { label: 'Bazi', href: '/#/bazi' },
  { label: 'Feng Shui', href: '/#/fengshui' },
  { label: 'Daily I Ching', href: '/#/daily' },
  { label: 'Pricing', href: '/#/pricing' },
];

const services = [
  { label: 'Bazi Destiny', icon: ScrollText, href: '/#/bazi' },
  { label: 'Feng Shui', icon: Compass, href: '/#/fengshui' },
  { label: 'Daily I Ching', icon: Sparkles, href: '/#/daily' },
  { label: 'Premium Access', icon: Crown, href: '/#/pricing' },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 text-gold mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10V2z" fill="currentColor" fillOpacity="0.6" />
                <circle cx="12" cy="7" r="2" fill="currentColor" />
                <circle cx="12" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="font-heading text-lg font-bold">MysticDao</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Ancient Eastern wisdom, digitally reborn. Discover the secrets of
              Bazi, Feng Shui, and I Ching in a modern sacred space.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-gold mb-4">
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <a
                    href={service.href}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    <service.icon className="w-3.5 h-3.5 text-gold/60" />
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-xs text-white/35">
            &copy; {new Date().getFullYear()} MysticDao. All rights reserved. Ancient wisdom for the modern soul.
          </p>
        </div>
      </div>
    </footer>
  );
}
