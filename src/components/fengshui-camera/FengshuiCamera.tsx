import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RotateCcw, Download, Trash2, ChevronLeft, Navigation } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { useCompass, useCompassPC } from '@/hooks/useCompass';
import { usePermission } from '@/hooks/usePermission';
import { BaguaIcon } from '@/components/SacredIcons';
import { fetchAIInterpretation } from '@/services/api';

const STORAGE_KEY = 'mysticdao_camera_photos';

interface PhotoRecord {
  id: string;
  dataUrl: string;
  heading: number;
  direction: string;
  timestamp: number;
  analysis?: string;
}

function loadPhotos(): PhotoRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function savePhotos(photos: PhotoRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos.slice(0, 20)));
}

function isMobile() {
  return typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export default function FengshuiCamera({ onClose }: { onClose: () => void }) {
  const { videoRef, isActive, error: camError, start, stop, takePhoto } = useCamera();
  const { permissions, request } = usePermission();
  const mobileCompass = useCompass(isMobile() && isActive);
  const pcCompass = useCompassPC();
  const [photos, setPhotos] = useState<PhotoRecord[]>(loadPhotos);
  const [mode, setMode] = useState<'camera' | 'gallery'>('camera');
  const [analyzing, setAnalyzing] = useState(false);
  const [showPreview, setShowPreview] = useState<PhotoRecord | null>(null);

  const compass = isMobile() ? mobileCompass : pcCompass;

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const handleStart = useCallback(async () => {
    const ok = await request('camera');
    if (ok) {
      await start();
      if (isMobile()) await request('orientation');
    }
  }, [request, start]);

  const handleCapture = useCallback(async () => {
    const raw = takePhoto();
    if (!raw) return;

    const heading = compass.heading;
    const direction = (compass as any).directionName || '未知';

    // 合成图片：原图 + 罗盘 + 方位信息
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      // 原图
      ctx.drawImage(img, 0, 0);

      // 半透明黑色底部条
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

      // MysticDao 标识
      ctx.fillStyle = '#c8a45c';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('MysticDao · 风水 Lens', 20, canvas.height - 60);

      // 方位信息
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(`朝向: ${direction} · ${Math.round(heading)}°`, 20, canvas.height - 30);

      // 时间戳
      const now = new Date().toLocaleString('zh-CN');
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#888';
      ctx.textAlign = 'right';
      ctx.fillText(now, canvas.width - 20, canvas.height - 30);
      ctx.textAlign = 'left';

      const composed = canvas.toDataURL('image/jpeg', 0.92);
      const record: PhotoRecord = {
        id: Date.now().toString(),
        dataUrl: composed,
        heading,
        direction,
        timestamp: Date.now(),
      };

      const newPhotos = [record, ...photos];
      setPhotos(newPhotos);
      savePhotos(newPhotos);
      setShowPreview(record);

      // 获取风水分析
      setAnalyzing(true);
      try {
        const res = await fetchAIInterpretation({
          type: 'fengshui',
          data: { roomType: '客厅', orientation: direction, heading },
        });
        // analysis stored in record
        record.analysis = res.text;
        setPhotos((prev) => {
          const updated = prev.map((p) => (p.id === record.id ? record : p));
          savePhotos(updated);
          return updated;
        });
      } catch {
        // analysis stored in record
      } finally {
        setAnalyzing(false);
      }
    };
    img.src = raw;
  }, [takePhoto, compass, photos]);

  const handleDelete = useCallback((id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    savePhotos(updated);
    if (showPreview?.id === id) setShowPreview(null);
  }, [photos, showPreview]);

  const handleDownload = useCallback((record: PhotoRecord) => {
    const a = document.createElement('a');
    a.href = record.dataUrl;
    a.download = `mysticdao-fengshui-${record.id}.jpg`;
    a.click();
  }, []);

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
        <h2 className="text-sm font-medium text-[#c8a45c] tracking-wider">FENG SHUI LENS · 风水相机</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode(mode === 'camera' ? 'gallery' : 'camera')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              mode === 'gallery' ? 'bg-[#c8a45c] text-black border-[#c8a45c]' : 'text-white/60 border-white/20 hover:border-white/40'
            }`}
          >
            {mode === 'camera' ? `相册(${photos.length})` : '相机'}
          </button>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === 'camera' ? (
            <motion.div
              key="camera"
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {!isActive ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
                  <div className="w-20 h-20 rounded-full border border-[#c8a45c]/30 flex items-center justify-center">
                    <Camera size={32} className="text-[#c8a45c]" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium mb-2">打开风水相机</p>
                    <p className="text-white/50 text-sm max-w-[280px]">
                      摄像头画面将叠加八卦罗盘，拍照自动记录方位并生成风水分析
                    </p>
                  </div>
                  {camError && (
                    <p className="text-red-400 text-sm">{camError}</p>
                  )}
                  {permissions.camera.status === 'denied' && (
                    <p className="text-amber-400 text-sm">请在浏览器设置中允许摄像头权限</p>
                  )}
                  <button
                    onClick={handleStart}
                    className="px-8 py-3 rounded-full bg-[#c8a45c] text-black font-semibold text-sm hover:brightness-110 transition-all"
                  >
                    启动相机
                  </button>
                  {!isMobile() && (
                    <p className="text-white/30 text-xs">PC端支持鼠标拖拽调整罗盘角度</p>
                  )}
                </div>
              ) : (
                <div className="flex-1 relative">
                  {/* Video */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Compass Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px]">
                      {/* Rotating dial for PC */}
                      {!isMobile() && (
                        <div
                          className="absolute inset-0 cursor-grab active:cursor-grabbing pointer-events-auto"
                          onMouseDown={pcCompass.onMouseDown}
                          onMouseMove={pcCompass.onMouseMove}
                          onMouseUp={pcCompass.onMouseUp}
                          onMouseLeave={pcCompass.onMouseUp}
                        />
                      )}
                      <div
                        className="w-full h-full opacity-40"
                        style={{ transform: `rotate(${-compass.heading}deg)` }}
                      >
                        <BaguaIcon className="w-full h-full text-[#c8a45c]" />
                      </div>
                      {/* Center dot */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#c8a45c]" />
                      {/* N indicator */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[#c8a45c] text-xs font-bold">N</div>
                    </div>
                  </div>

                  {/* Heading info */}
                  <div className="absolute top-4 left-0 right-0 flex justify-center">
                    <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-3">
                      <Navigation size={16} className="text-[#c8a45c]" />
                      <span className="text-white text-sm font-medium">
                        {(compass as any).directionName || '未知'} · {Math.round(compass.heading)}°
                      </span>
                      {mobileCompass.isCalibrating && (
                        <span className="text-amber-400 text-xs">校准中...</span>
                      )}
                    </div>
                  </div>

                  {/* Bottom controls */}
                  <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6">
                    <button
                      onClick={stop}
                      className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-colors"
                    >
                      <X size={20} />
                    </button>
                    <button
                      onClick={handleCapture}
                      className="w-18 h-18 rounded-full border-4 border-[#c8a45c] flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                      style={{ width: 72, height: 72 }}
                    >
                      <div className="w-14 h-14 rounded-full bg-[#c8a45c]" />
                    </button>
                    {isMobile() && (
                      <button
                        onClick={mobileCompass.calibrate}
                        className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-colors"
                      >
                        <RotateCcw size={18} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              className="absolute inset-0 overflow-y-auto p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/40">
                  <Camera size={48} className="mb-4 opacity-30" />
                  <p>暂无照片</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 cursor-pointer group"
                      onClick={() => setShowPreview(photo)}
                    >
                      <img src={photo.dataUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-[#c8a45c] text-xs font-medium">{photo.direction} · {Math.round(photo.heading)}°</p>
                          <p className="text-white/50 text-[10px]">{new Date(photo.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Photo Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/95 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <button onClick={() => setShowPreview(null)} className="text-white/70 hover:text-white">
                <ChevronLeft size={24} />
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownload(showPreview)}
                  className="text-white/70 hover:text-[#c8a45c] transition-colors"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={() => handleDelete(showPreview.id)}
                  className="text-white/70 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
              <img src={showPreview.dataUrl} alt="" className="max-w-full max-h-[50vh] rounded-lg mb-4" />
              <div className="text-center mb-4">
                <p className="text-[#c8a45c] font-medium">{showPreview.direction} · {Math.round(showPreview.heading)}°</p>
                <p className="text-white/40 text-sm">{new Date(showPreview.timestamp).toLocaleString()}</p>
              </div>
              {analyzing && showPreview.id === photos[0]?.id ? (
                <div className="text-center">
                  <div className="w-6 h-6 border-2 border-[#c8a45c] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-white/50 text-sm">正在分析风水...</p>
                </div>
              ) : showPreview.analysis ? (
                <div className="max-w-[500px] w-full bg-white/5 rounded-lg p-4 text-sm text-white/80 whitespace-pre-wrap max-h-[30vh] overflow-y-auto">
                  {showPreview.analysis}
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
