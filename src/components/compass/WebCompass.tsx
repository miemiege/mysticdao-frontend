import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Navigation, RotateCcw, Smartphone, MousePointer, ChevronLeft } from 'lucide-react';
import { useCompass, useCompassPC } from '@/hooks/useCompass';
import { usePermission } from '@/hooks/usePermission';
import { directionData } from '@/components/fengshui/fengshuiData';

function isMobileDevice() {
  return typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function getDirectionFromAngle(angle: number): string {
  const normalized = ((angle % 360) + 360) % 360;
  const dirs = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
  const idx = Math.round(normalized / 45) % 8;
  return dirs[idx];
}

const DIRECTION_LABELS: Record<string, { label: string; cn: string; angle: number }> = {
  north: { label: 'North', cn: '北', angle: 0 },
  northeast: { label: 'Northeast', cn: '东北', angle: 45 },
  east: { label: 'East', cn: '东', angle: 90 },
  southeast: { label: 'Southeast', cn: '东南', angle: 135 },
  south: { label: 'South', cn: '南', angle: 180 },
  southwest: { label: 'Southwest', cn: '西南', angle: 225 },
  west: { label: 'West', cn: '西', angle: 270 },
  northwest: { label: 'Northwest', cn: '西北', angle: 315 },
};

export default function WebCompass({ onClose }: { onClose: () => void }) {
  const isMobile = isMobileDevice();
  const [mode, setMode] = useState<'sensor' | 'manual'>(isMobile ? 'sensor' : 'manual');
  const [showCalibration, setShowCalibration] = useState(false);
  const [selectedDir, setSelectedDir] = useState<string | null>(null);

  const { permissions, request } = usePermission();
  const mobile = useCompass(mode === 'sensor' && isMobile);
  const pc = useCompassPC();

  const compass = mode === 'sensor' && isMobile ? mobile : pc;
  const heading = compass.heading;
  const directionKey = getDirectionFromAngle(heading);
  const dirInfo = DIRECTION_LABELS[directionKey];

  const startSensor = useCallback(async () => {
    const ok = await request('orientation');
    if (ok) setMode('sensor');
  }, [request]);

  // Calibration animation
  const [calibStep, setCalibStep] = useState(0);
  useEffect(() => {
    if (!showCalibration) return;
    const interval = setInterval(() => {
      setCalibStep((s) => (s + 1) % 4);
    }, 800);
    return () => clearInterval(interval);
  }, [showCalibration]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-sm font-medium text-[#c8a45c] tracking-wider">DIGITAL COMPASS · 数字罗盘</h2>
        <div className="w-6" />
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-2 py-3 border-b border-white/5">
        <button
          onClick={() => isMobile && startSensor()}
          className={`px-4 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-colors ${
            mode === 'sensor' ? 'bg-[#c8a45c] text-black' : 'bg-white/5 text-white/50 border border-white/10'
          } ${!isMobile ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <Smartphone size={14} />
          传感器
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`px-4 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-colors ${
            mode === 'manual' ? 'bg-[#c8a45c] text-black' : 'bg-white/5 text-white/50 border border-white/10'
          }`}
        >
          <MousePointer size={14} />
          手动
        </button>
      </div>

      {/* Calibration overlay */}
      {showCalibration && (
        <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#c8a45c]/50 flex items-center justify-center mb-4">
            <div
              className="w-20 h-20 rounded-full border border-[#c8a45c] transition-transform duration-700"
              style={{ transform: `rotate(${calibStep * 90}deg)` }}
            />
          </div>
          <p className="text-[#c8a45c] font-medium mb-1">正在校准罗盘</p>
          <p className="text-white/50 text-sm">请将手机在空中画"8"字形</p>
          <button
            onClick={() => setShowCalibration(false)}
            className="mt-6 px-6 py-2 rounded-full border border-white/20 text-white/60 text-sm hover:border-white/40 transition-colors"
          >
            跳过校准
          </button>
        </div>
      )}

      {/* Main Compass Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Heading display */}
        <div className="absolute top-6 text-center">
          <div className="text-[64px] md:text-[80px] font-light text-white tabular-nums leading-none">
            {Math.round(heading)}°
          </div>
          <div className="text-[#c8a45c] text-lg font-medium mt-1">
            {dirInfo?.cn} · {dirInfo?.label}
          </div>
        </div>

        {/* Compass Dial */}
        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-2 rounded-full border border-[#c8a45c]/20" />

          {/* Degree marks */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = i * 5;
            const isMain = angle % 30 === 0;
            const isSub = angle % 10 === 0;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-0 origin-bottom"
                style={{
                  height: '50%',
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <div
                  className={`mx-auto ${
                    isMain ? 'w-[2px] h-4 bg-[#c8a45c]' : isSub ? 'w-[1px] h-2 bg-white/30' : 'w-[1px] h-1 bg-white/10'
                  }`}
                />
              </div>
            );
          })}

          {/* Cardinal directions */}
          {Object.entries(DIRECTION_LABELS).map(([key, { label, angle }]) => (
            <div
              key={key}
              className="absolute left-1/2 top-0 origin-bottom text-center"
              style={{ height: '50%', transform: `rotate(${angle}deg)` }}
            >
              <div
                className="text-xs font-medium"
                style={{
                  transform: `rotate(${-angle}deg) translateY(8px)`,
                  color: key === directionKey ? '#c8a45c' : 'rgba(255,255,255,0.3)',
                }}
              >
                {label}
              </div>
            </div>
          ))}

          {/* Rotating inner dial */}
          <div
            className="absolute inset-8 rounded-full border border-white/5 flex items-center justify-center"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            {/* Direction segments */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = i * 45;
              const dirKeys = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
              const isActive = dirKeys[i] === directionKey;
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-0 origin-bottom"
                  style={{ height: '50%', transform: `rotate(${angle}deg)` }}
                >
                  <div
                    className={`w-12 h-[50%] mx-auto rounded-t-full cursor-pointer transition-colors ${
                      isActive ? 'bg-[#c8a45c]/15' : 'bg-transparent hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedDir(dirKeys[i])}
                  />
                </div>
              );
            })}
          </div>

          {/* Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#c8a45c]" />

          {/* North pointer (fixed, dial rotates) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <Navigation size={24} className="text-[#c8a45c]" />
          </div>
        </div>

        {/* PC hint */}
        {mode === 'manual' && (
          <p className="absolute bottom-24 text-white/30 text-xs">拖拽罗盘或点击方位查看详情</p>
        )}

        {/* Calibration button (mobile) */}
        {isMobile && mode === 'sensor' && (
          <button
            onClick={() => { mobile.calibrate(); setShowCalibration(true); }}
            className="absolute bottom-24 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white/50 text-xs hover:border-white/30 transition-colors"
          >
            <RotateCcw size={14} />
            校准罗盘
          </button>
        )}
      </div>

      {/* Selected direction info */}
      {selectedDir && directionData[selectedDir] && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-black/90 border-t border-[#c8a45c]/20 p-4"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
        >
          <div className="flex items-start justify-between max-w-[600px] mx-auto">
            <div>
              <p className="text-[#c8a45c] text-sm font-medium">
                {directionData[selectedDir].chinese} · {directionData[selectedDir].element}
              </p>
              <p className="text-white/60 text-xs mt-1">{directionData[selectedDir].advice}</p>
            </div>
            <button
              onClick={() => setSelectedDir(null)}
              className="text-white/40 hover:text-white text-xs"
            >
              关闭
            </button>
          </div>
        </motion.div>
      )}

      {/* Permission warning */}
      {mode === 'sensor' && permissions.orientation.status === 'denied' && (
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-amber-400 text-xs">请在设置中允许方向传感器权限</p>
        </div>
      )}
    </motion.div>
  );
}
