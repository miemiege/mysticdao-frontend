import { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Camera,
  Trash2,
  Download,
  ArrowLeft,
  Image as ImageIcon,
  LocateFixed,
} from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { useCompass } from '../../hooks/useCompass';
import {
  directionData,
  getDirectionFromAngle,
} from '../fengshui/fengshuiData';
import BaguaOverlay from './BaguaOverlay';

// ─── Types ───────────────────────────────────────────────────────────

interface PhotoItem {
  id: string;
  dataUrl: string;
  directionKey: string;
  timestamp: number;
  directionName: string;
}

// ─── Constants ───────────────────────────────────────────────────────

const STORAGE_KEY = 'mysticdao_camera_photos';
const MAX_PHOTOS = 20;

// ─── Helpers ─────────────────────────────────────────────────────────

function loadPhotos(): PhotoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed as PhotoItem[];
    return [];
  } catch {
    return [];
  }
}

function savePhotos(photos: PhotoItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, '0');
  const D = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${Y}.${M}.${D} ${h}:${m}:${s}`;
}

function formatShortDate(timestamp: number): string {
  const d = new Date(timestamp);
  const M = String(d.getMonth() + 1).padStart(2, '0');
  const D = String(d.getDate()).padStart(2, '0');
  return `${M}/${D}`;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Main Component ────────────────────────────────────────────────────

export function FengshuiCamera({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element {
  const {
    videoRef,
    error,
    start,
    stop,
  } = useCamera();
  const { heading, isSupported, calibrate, permissionGranted, requestPermission } = useCompass();

  const [mode, setMode] = useState<'camera' | 'preview' | 'gallery'>('camera');
  const [lastPhoto, setLastPhoto] = useState<PhotoItem | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>(loadPhotos);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);


  // Lifecycle: start/stop camera
  useEffect(() => {
    void start();
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived
  const directionKey = getDirectionFromAngle(heading);
  const dirInfo = directionData[directionKey];

  // ─── Capture Logic ─────────────────────────────────────────────────

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;

    const canvas = document.createElement('canvas');
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, w, h);

    // Bottom info bar
    const barHeight = Math.round(h * 0.14);
    const barY = h - barHeight;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, barY, w, barHeight);

    const padX = Math.round(w * 0.04);
    const padY = Math.round(barHeight * 0.18);
    const baseY = barY + padY;

    // Line 1: Brand
    ctx.fillStyle = '#c8a45c';
    ctx.font = `bold ${Math.round(h * 0.035)}px sans-serif`;
    ctx.fillText(
      'MysticDao \u00b7 \u98ce\u6c34 Lens',
      padX,
      baseY + Math.round(h * 0.025)
    );

    // Line 2: Direction info
    const line2 = dirInfo
      ? `${dirInfo.chinese} \u00b7 ${Math.round(heading)}\u00b0 \u00b7 ${dirInfo.element}`
      : `\u65b9\u4f4d \u00b7 ${Math.round(heading)}\u00b0`;
    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.round(h * 0.025)}px sans-serif`;
    ctx.fillText(line2, padX, baseY + Math.round(h * 0.055));

    // Line 3: Timestamp
    const ts = formatDate(Date.now());
    ctx.fillStyle = '#cccccc';
    ctx.font = `${Math.round(h * 0.02)}px sans-serif`;
    ctx.fillText(ts, padX, baseY + Math.round(h * 0.085));

    // Export
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    const newPhoto: PhotoItem = {
      id: generateId(),
      dataUrl,
      directionKey,
      timestamp: Date.now(),
      directionName: dirInfo?.chinese ?? directionKey,
    };

    setLastPhoto(newPhoto);
    setPhotos((prev) => {
      const next = [newPhoto, ...prev];
      if (next.length > MAX_PHOTOS) next.pop();
      savePhotos(next);
      return next;
    });
    setMode('preview');
  }, [videoRef, heading, dirInfo, directionKey]);

  // ─── Gallery Actions ────────────────────────────────────────────────

  const handleDeletePhoto = useCallback((id: string) => {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      savePhotos(next);
      return next;
    });
    setSelectedPhotoId(null);
  }, []);

  const handleDownloadPhoto = useCallback((photo: PhotoItem) => {
    downloadDataUrl(photo.dataUrl, `mysticdao-${photo.id}.jpg`);
  }, []);

  // ─── Render: Top Bar ────────────────────────────────────────────────

  const topBar = (
    <div className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 pt-[env(safe-area-inset-top,16px)] pb-3 bg-black/60 backdrop-blur-sm">
      <button
        onClick={() => {
          stop();
          onClose();
        }}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-black/40 text-white active:scale-95 transition-transform"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      <div className="flex flex-col items-center">
        <span className="text-white text-2xl font-bold tracking-wide">
          {Math.round(heading)}&deg;
        </span>
        <span className="text-[#c8a45c] text-sm font-medium">
          {dirInfo
            ? `${dirInfo.chinese} \u00b7 ${dirInfo.element}`
            : directionKey}
        </span>
      </div>

      <button
        onClick={() => setMode(mode === 'gallery' ? 'camera' : 'gallery')}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-black/40 text-white active:scale-95 transition-transform"
        aria-label={mode === 'gallery' ? 'Camera' : 'Gallery'}
      >
        {mode === 'gallery' ? <Camera size={20} /> : <ImageIcon size={20} />}
      </button>
    </div>
  );

  // ─── Render: Camera Mode ────────────────────────────────────────────

  const cameraModeView = (
    <motion.div
      key="camera"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      <BaguaOverlay heading={heading} isCapturing={isCapturing} />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[55] flex items-center justify-center bg-black/80"
          >
            <div className="text-center px-6">
              <p className="text-white text-lg mb-2">
                Camera Error
              </p>
              <p className="text-[#c8a45c] text-sm">{error}</p>
              <button
                onClick={() => void start()}
                className="mt-4 px-5 py-2 rounded-full bg-[#c8a45c] text-black font-semibold text-sm active:scale-95 transition-transform"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-[60] flex items-center justify-between px-6 pb-[env(safe-area-inset-bottom,24px)] pt-4 h-[120px]">
        <button
          onClick={() => {
            stop();
            onClose();
          }}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-black/50 text-white active:scale-95 transition-transform"
          aria-label="Close camera"
        >
          <X size={22} />
        </button>

        <motion.button
          onClick={handleCapture}
          whileTap={{ scale: 0.9 }}
          className="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-[#c8a45c] bg-transparent"
          aria-label="Capture"
        >
          <div className="w-14 h-14 rounded-full bg-[#c8a45c]" />
        </motion.button>

        <button
          onClick={() => {
            if (!permissionGranted && isSupported) {
              requestPermission();
            } else {
              calibrate();
            }
          }}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-full bg-black/50 text-white active:scale-95 transition-transform ${
            isSupported ? '' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Calibrate compass"
        >
          <LocateFixed size={20} />
          <span className="text-[10px] mt-0.5">Calibrate</span>
        </button>
      </div>
    </motion.div>
  );

  // ─── Render: Preview Mode ───────────────────────────────────────────

  const previewModeView = lastPhoto ? (
    <motion.div
      key="preview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col bg-black"
    >
      <div className="fixed top-0 left-0 right-0 z-[60] flex items-center px-4 pt-[env(safe-area-inset-top,16px)] pb-3">
        <button
          onClick={() => setMode('camera')}
          className="flex items-center gap-1 text-white active:scale-95 transition-transform"
        >
          <ArrowLeft size={22} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center pt-14 pb-4">
        <img
          src={lastPhoto.dataUrl}
          alt="Feng Shui capture"
          className="max-h-[80vh] max-w-full object-contain"
        />
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="mx-4 mb-[env(safe-area-inset-bottom,16px)] rounded-lg bg-black/70 backdrop-blur-md border-t-4 border-[#c8a45c] px-4 py-4"
      >
        {(() => {
          const info = directionData[lastPhoto.directionKey];
          return info ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#c8a45c] font-bold text-lg">
                  {info.chinese}
                </span>
                <span className="text-white/80 text-sm">
                  {info.trigramChar} &middot; {info.element}
                </span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-3">
                {info.advice}
              </p>
            </>
          ) : (
            <p className="text-white/70 text-sm mb-3">
              No feng shui advice for this direction.
            </p>
          );
        })()}
        <div className="flex gap-3">
          <button
            onClick={() =>
              downloadDataUrl(
                lastPhoto.dataUrl,
                `mysticdao-${lastPhoto.id}.jpg`
              )
            }
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#c8a45c] text-black font-semibold text-sm active:scale-95 transition-transform"
          >
            <Download size={16} />
            Save
          </button>
          <button
            onClick={() => setMode('camera')}
            className="flex items-center justify-center px-4 py-2.5 rounded-full border border-white/30 text-white text-sm active:scale-95 transition-transform"
          >
            <Camera size={16} className="mr-1.5" />
            Retake
          </button>
        </div>
      </motion.div>
    </motion.div>
  ) : null;

  // ─── Render: Gallery Mode ───────────────────────────────────────────

  const galleryModeView = (
    <motion.div
      key="gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 bg-black pt-20 pb-24 px-2 overflow-y-auto"
    >
      <h2 className="text-white text-lg font-semibold mb-4 px-2">
        Gallery
      </h2>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-white/60">
          <ImageIcon size={48} className="mb-3" />
          <p className="text-base">No photos yet</p>
          <button
            onClick={() => setMode('camera')}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c8a45c] text-black font-semibold text-sm active:scale-95 transition-transform"
          >
            <Camera size={18} />
            Take Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03, duration: 0.25 }}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedPhotoId(photo.id)}
            >
              <img
                src={photo.dataUrl}
                alt={photo.directionName}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-[#c8a45c] text-black text-xs font-bold px-2 py-1 rounded">
                {photo.directionName}
              </span>
              <span className="absolute bottom-2 right-2 text-white text-xs bg-black/40 px-1.5 py-0.5 rounded">
                {formatShortDate(photo.timestamp)}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  // ─── Render: Gallery Fullscreen Preview ─────────────────────────────

  const galleryFullscreen = selectedPhotoId
    ? (() => {
        const photo = photos.find((p) => p.id === selectedPhotoId);
        if (!photo) return null;
        return (
          <motion.div
            key="gallery-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col bg-black"
          >
            <div className="flex items-center justify-between px-4 pt-[env(safe-area-inset-top,16px)] pb-3">
              <button
                onClick={() => setSelectedPhotoId(null)}
                className="flex items-center gap-1 text-white active:scale-95 transition-transform"
              >
                <ArrowLeft size={22} />
                <span className="text-sm font-medium">Back</span>
              </button>
              <span className="text-[#c8a45c] text-sm font-medium">
                {photo.directionName}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center px-4">
              <img
                src={photo.dataUrl}
                alt={photo.directionName}
                className="max-h-[80vh] max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-center gap-6 px-4 pb-[env(safe-area-inset-bottom,24px)] pt-4">
              <button
                onClick={() => handleDownloadPhoto(photo)}
                className="flex flex-col items-center gap-1 text-white active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-[#c8a45c]/20 flex items-center justify-center">
                  <Download size={22} className="text-[#c8a45c]" />
                </div>
                <span className="text-xs">Download</span>
              </button>
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="flex flex-col items-center gap-1 text-white active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 size={22} className="text-red-400" />
                </div>
                <span className="text-xs">Delete</span>
              </button>
              <button
                onClick={() => setSelectedPhotoId(null)}
                className="flex flex-col items-center gap-1 text-white active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <X size={22} />
                </div>
                <span className="text-xs">Close</span>
              </button>
            </div>
          </motion.div>
        );
      })()
    : null;

  // ─── Root Render ────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {topBar}

      <AnimatePresence mode="wait">
        {mode === 'camera' && cameraModeView}
        {mode === 'preview' && previewModeView}
        {mode === 'gallery' && galleryModeView}
      </AnimatePresence>

      <AnimatePresence>{galleryFullscreen}</AnimatePresence>
    </div>
  );
}
