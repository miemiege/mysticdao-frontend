import React from 'react';
import { Palette, Hash, Navigation } from 'lucide-react';

interface LuckyInfoProps {
  color: string;
  number: string;
  direction: string;
}

const LuckyInfo: React.FC<LuckyInfoProps> = ({ color, number, direction }) => {
  const items = [
    { icon: <Palette size={16} />, label: '幸运色', value: color },
    { icon: <Hash size={16} />, label: '幸运数字', value: number },
    { icon: <Navigation size={16} />, label: '幸运方位', value: direction },
  ];

  return (
    <>
      <style>{`
        @keyframes luckyFadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lucky-info-item {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="lucky-info-item flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{
              background: 'rgba(200, 164, 92, 0.05)',
              borderColor: 'rgba(200, 164, 92, 0.15)',
              animation: `luckyFadeInUp 0.4s ease-out ${0.3 + index * 0.1}s both`,
            }}
          >
            <span className="text-gold/70">{item.icon}</span>
            <span className="text-xs text-text-muted">{item.label}</span>
            <span className="text-sm font-medium text-gold">{item.value}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default LuckyInfo;
