import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Mountain, TreePine, Flame, CircleDot, Palette, Hash, Shapes, Lightbulb } from 'lucide-react';
import type { DirectionInfo } from './fengshuiData';
import { roomTypes, roomAdvice } from './fengshuiData';

interface DirectionPanelProps {
  directionKey: string;
  info: DirectionInfo;
  selectedRoom: string;
  onRoomChange: (room: string) => void;
}

const elementIcons: Record<string, React.ReactNode> = {
  Water: <Droplets size={16} />,
  Earth: <Mountain size={16} />,
  Wood: <TreePine size={16} />,
  Fire: <Flame size={16} />,
  Metal: <CircleDot size={16} />,
};

const DirectionPanel = memo(function DirectionPanel({
  directionKey,
  info,
  selectedRoom,
  onRoomChange,
}: DirectionPanelProps) {
  const currentAdvice = roomAdvice[selectedRoom]?.[directionKey];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={directionKey + selectedRoom}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="bg-bg-card border border-[#c8a45c]/15 rounded-[10px] p-6 md:p-8 mt-8"
      >
        {/* Direction header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-chinese font-semibold"
            style={{
              backgroundColor: `${info.color}15`,
              color: info.color,
              border: `1px solid ${info.color}40`,
            }}
          >
            {info.chinese}
          </div>
          <div>
            <h3 className="font-sans text-[22px] font-medium text-text-primary">
              {directionKey.charAt(0).toUpperCase() + directionKey.slice(1)} <span className="text-[#c8a45c]/70 font-chinese text-lg">({info.chinese})</span>
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span style={{ color: info.color }}>{elementIcons[info.element]}</span>
              <span className="font-sans text-sm" style={{ color: info.color }}>
                {info.element} Element
              </span>
            </div>
          </div>
        </div>

        {/* Meaning and general advice */}
        <div className="mb-6">
          <h4 className="font-sans text-lg text-[#e8d5a3] mb-2">
            {info.meaning}
          </h4>
          <p className="font-sans text-sm text-text-secondary leading-relaxed">
            {info.advice}
          </p>
        </div>

        {/* Attributes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-elevated rounded-lg p-4 border border-[#c8a45c]/8">
            <div className="flex items-center gap-2 mb-2">
              <Palette size={14} className="text-[#c8a45c]/70" />
              <span className="font-sans text-xs uppercase tracking-[0.06em] text-[#c8a45c]/70">Lucky Colors</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {info.colors.map((color) => (
                <span key={color} className="font-sans text-sm text-text-primary">
                  {color}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-bg-elevated rounded-lg p-4 border border-[#c8a45c]/8">
            <div className="flex items-center gap-2 mb-2">
              <Hash size={14} className="text-[#c8a45c]/70" />
              <span className="font-sans text-xs uppercase tracking-[0.06em] text-[#c8a45c]/70">Lucky Numbers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {info.numbers.map((num) => (
                <span key={num} className="font-sans text-sm text-text-primary">
                  {num}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-bg-elevated rounded-lg p-4 border border-[#c8a45c]/8">
            <div className="flex items-center gap-2 mb-2">
              <Shapes size={14} className="text-[#c8a45c]/70" />
              <span className="font-sans text-xs uppercase tracking-[0.06em] text-[#c8a45c]/70">Lucky Shapes</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {info.shapes.map((shape) => (
                <span key={shape} className="font-sans text-sm text-text-primary">
                  {shape}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Room type selector */}
        <div className="border-t border-[#c8a45c]/10 pt-6">
          <h4 className="font-sans text-xs uppercase tracking-[0.06em] text-[#c8a45c]/70 mb-4">
            Select Room Type for Specific Tips
          </h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {roomTypes.map((room) => (
              <button
                key={room}
                onClick={() => onRoomChange(room)}
                className={`px-4 py-2 rounded-md font-sans text-sm transition-all duration-300 ${
                  selectedRoom === room
                    ? 'text-void font-medium'
                    : 'border border-[#c8a45c]/30 text-[#c8a45c] hover:bg-[#c8a45c]/8'
                }`}
                style={
                  selectedRoom === room
                    ? {
                        background: 'linear-gradient(135deg, #c8a45c 0%, #e8d5a3 40%, #f0d878 60%, #c8a45c 100%)',
                      }
                    : {}
                }
              >
                {room}
              </button>
            ))}
          </div>

          {/* Room-specific tips */}
          {currentAdvice && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-bg-elevated rounded-lg p-5 border border-[#c8a45c]/8"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={16} className="text-[#c8a45c]" />
                <h5 className="font-sans text-base text-text-primary">
                  Tips for {selectedRoom}
                </h5>
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded font-sans"
                  style={{
                    backgroundColor: `${info.color}15`,
                    color: info.color,
                  }}
                >
                  {currentAdvice.elementFocus} Focus
                </span>
              </div>
              <ul className="space-y-2.5">
                {currentAdvice.tips.map((tip, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="font-sans text-sm text-text-secondary leading-relaxed">
                      {tip}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export default DirectionPanel;
