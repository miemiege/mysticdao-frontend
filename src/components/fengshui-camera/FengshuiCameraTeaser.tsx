import { useCallback, useEffect, useState } from "react";
import type { JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Share2,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useCamera } from "@/hooks/useCamera";

type Screen = "intro" | "scan" | "result";

/* ═══════════════════════════════════════════════════════════════════
   Screen 1 — Concept / Intro
   ═══════════════════════════════════════════════════════════════════ */
function TeaserIntro({ onStart }: { onStart: () => void }): JSX.Element {
  const particles = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6 }}
      className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-black overflow-hidden px-6"
    >
      {/* Blurred concept background */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(200,164,92,0.18) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(0,212,255,0.08) 0%, transparent 50%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#c8a45c]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 6px rgba(200,164,92,0.6)",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.15, 0.7, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <Sparkles size={48} className="text-[#c8a45c] mx-auto mb-4" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-[36px] md:text-[48px] font-medium text-[#c8a45c] leading-tight mb-4"
        >
          AI 风水相机
          <br />
          <span className="text-[28px] md:text-[36px] text-[#c8a45c]/80">
            · 即将开启
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/70 text-base md:text-lg font-light mb-12 max-w-xs"
        >
          扫描你的空间，获取专属风水能量图
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="relative px-10 py-4 rounded-full bg-[#c8a45c] text-black font-semibold text-base tracking-wide animate-pulse"
          style={{
            boxShadow:
              "0 0 20px rgba(200,164,92,0.4), 0 0 60px rgba(200,164,92,0.15)",
          }}
        >
          立即体验
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Typewriter hook
   ═══════════════════════════════════════════════════════════════════ */
function useTypewriter(text: string, speed = 60): string {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return displayed;
}

/* ═══════════════════════════════════════════════════════════════════
   Screen 2 — Scan Simulation
   ═══════════════════════════════════════════════════════════════════ */
function ScanSimulation({
  onComplete,
}: {
  onComplete: () => void;
}): JSX.Element {
  const { videoRef, start, stop, error, isActive } = useCamera();
  const [progress, setProgress] = useState(0);
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });
  const typeText = useTypewriter("正在分析空间能量场...");

  // Start camera on mount
  useEffect(() => {
    void start();
    return () => stop();
  }, [start, stop]);

  // Progress bar 0 → 100 over ~4.5s then auto-advance
  useEffect(() => {
    const duration = 4500;
    const begin = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - begin;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  // Random jumping coordinates
  useEffect(() => {
    const interval = setInterval(() => {
      setCoords({
        x: Math.floor(Math.random() * 360),
        y: Math.floor(Math.random() * 360),
        z: Math.floor(Math.random() * 100),
      });
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const hasCamera = isActive && !error;

  return (
    <motion.div
      key="scan"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-black overflow-hidden"
    >
      {/* Camera feed or fallback gradient */}
      {hasCamera ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, #1a1a2e 0%, #000 100%)",
          }}
        />
      )}

      {/* 50% black overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* HUD Grid */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,212,255,0.3) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,212,255,0.3) 40px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Scanning line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-[#00d4ff]"
          style={{
            boxShadow: "0 0 12px #00d4ff, 0 0 24px rgba(0,212,255,0.5)",
          }}
          initial={{ top: "0%" }}
          animate={{ top: "100%" }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Corner brackets */}
      <div className="absolute top-[max(2rem,env(safe-area-inset-top))] left-8 w-12 h-12 border-l-2 border-t-2 border-[#00d4ff]/60" />
      <div className="absolute top-[max(2rem,env(safe-area-inset-top))] right-8 w-12 h-12 border-r-2 border-t-2 border-[#00d4ff]/60" />
      <div className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-8 w-12 h-12 border-l-2 border-b-2 border-[#00d4ff]/60" />
      <div className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] right-8 w-12 h-12 border-r-2 border-b-2 border-[#00d4ff]/60" />

      {/* Random coordinates */}
      <div className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 font-mono text-[10px] text-[#00d4ff]/70 space-y-0.5">
        <div>X: {coords.x.toString().padStart(3, "0")}.42</div>
        <div>Y: {coords.y.toString().padStart(3, "0")}.81</div>
        <div>Z: {coords.z.toString().padStart(2, "0")}.15</div>
      </div>

      {/* Camera error fallback message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-20"
          >
            <span className="text-[10px] text-white/50 font-mono">
              功能即将上线
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center text & progress */}
      <div className="relative z-10 flex flex-col items-center px-6">
        <p className="font-mono text-[#00d4ff] text-sm md:text-base tracking-widest mb-6 min-h-[1.5em]">
          {typeText}
          <span className="animate-pulse">_</span>
        </p>

        <div className="w-64 md:w-80 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#c8a45c] to-[#00d4ff]"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 10px rgba(200,164,92,0.5)",
            }}
          />
        </div>
        <p className="mt-2 font-mono text-xs text-[#c8a45c]/80">
          {Math.round(progress)}%
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Screen 3 — Coming Soon / Result
   ═══════════════════════════════════════════════════════════════════ */
function ComingSoon({ onClose }: { onClose: () => void }): JSX.Element {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSaveEmail = useCallback(() => {
    if (!email.trim() || !email.includes("@")) return;
    localStorage.setItem("mysticdao_teaser_email", email.trim());
    setSaved(true);
  }, [email]);

  const handleShare = useCallback(async () => {
    const text =
      "AI 风水相机即将上线！扫描空间获取专属风水能量图，快来一起期待吧 ✨";
    if (navigator.share) {
      try {
        await navigator.share({ title: "MysticDao AI 风水相机", text });
        return;
      } catch {
        // fallback
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      alert("已复制到剪贴板");
    } catch {
      // ignore
    }
  }, []);

  const wuxing = [
    { name: "金", key: "metal", color: "#E5E7EB", pct: 88 },
    { name: "木", key: "wood", color: "#4ADE80", pct: 72 },
    { name: "水", key: "water", color: "#60A5FA", pct: 95 },
    { name: "火", key: "fire", color: "#F87171", pct: 64 },
    { name: "土", key: "earth", color: "#FBBF24", pct: 81 },
  ];

  const baguaLabels = [
    { char: "乾", label: "Qian", top: "8%", left: "75%" },
    { char: "坤", label: "Kun", top: "75%", left: "20%" },
    { char: "震", label: "Zhen", top: "30%", left: "85%" },
    { char: "巽", label: "Xun", top: "20%", left: "15%" },
    { char: "坎", label: "Kan", top: "50%", left: "50%" },
    { char: "离", label: "Li", top: "15%", left: "55%" },
    { char: "艮", label: "Gen", top: "70%", left: "70%" },
    { char: "兑", label: "Dui", top: "60%", left: "10%" },
  ];

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex flex-col min-h-[100dvh] bg-black overflow-hidden"
    >
      {/* Header */}
      <div className="pt-[env(safe-area-inset-top,16px)] px-4 pb-3 flex items-center shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-white/80 active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">返回</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pb-[env(safe-area-inset-bottom,24px)] overflow-y-auto">
        {/* Completion text */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={24} className="text-[#c8a45c]" />
          </motion.div>
          <span className="font-heading text-2xl text-[#c8a45c]">
            空间分析完成
          </span>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <Sparkles size={24} className="text-[#c8a45c]" />
          </motion.div>
        </motion.div>

        {/* Mock result card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden mb-6 border border-[#c8a45c]/20"
        >
          {/* Placeholder blurred room image via CSS */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 40% 60%, #1e1b2e 0%, #0f0f1a 50%, #000 100%)",
            }}
          />
          {/* Abstract room geometry */}
          <div className="absolute inset-[15%] border border-white/10 rounded-lg bg-white/[0.03]" />
          <div className="absolute top-[30%] left-[20%] right-[20%] h-[1px] bg-white/10" />
          <div className="absolute top-[30%] bottom-[30%] left-[50%] w-[1px] bg-white/10" />

          {/* Bagua labels */}
          {baguaLabels.map((b, i) => (
            <motion.div
              key={b.label}
              className="absolute flex flex-col items-center"
              style={{ top: b.top, left: b.left, transform: "translate(-50%, -50%)" }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
            >
              <span className="text-[#c8a45c] text-xs font-bold">{b.char}</span>
              <span className="text-white/40 text-[8px] uppercase">
                {b.label}
              </span>
            </motion.div>
          ))}

          {/* Glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
        </motion.div>

        {/* Wuxing bars */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-sm mb-8 space-y-3"
        >
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
            五行能量分析
          </p>
          {wuxing.map((wx, i) => (
            <div key={wx.key} className="flex items-center gap-3">
              <span className="text-white/60 text-sm w-4">{wx.name}</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: wx.color,
                    boxShadow: `0 0 8px ${wx.color}66`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${wx.pct}%` }}
                  transition={{
                    delay: 0.8 + i * 0.15,
                    duration: 1,
                    ease: "easeOut",
                  }}
                />
              </div>
              <span className="text-white/50 text-xs font-mono w-8 text-right">
                {wx.pct}%
              </span>
            </div>
          ))}
        </motion.div>

        {/* Coming soon text */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="font-heading text-xl text-white/90 mb-6 text-center"
        >
          完整功能即将上线
        </motion.h2>

        {/* Email input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="w-full max-w-sm mb-4"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="留下邮箱，第一时间体验"
                className="w-full pl-9 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c8a45c]/50 transition-colors"
              />
            </div>
            <button
              onClick={handleSaveEmail}
              disabled={saved}
              className="px-4 py-3 rounded-lg bg-[#c8a45c] text-black text-sm font-semibold active:scale-95 transition-transform disabled:opacity-60 flex items-center justify-center"
            >
              {saved ? <CheckCircle2 size={18} /> : "订阅"}
            </button>
          </div>
          {saved && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#c8a45c] text-xs mt-2"
            >
              已保存，我们会在上线时通知你 ✨
            </motion.p>
          )}
        </motion.div>

        {/* Share button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#c8a45c]/30 text-[#c8a45c] text-sm active:scale-95 transition-transform mb-8"
        >
          <Share2 size={16} />
          分享给朋友，一起期待
        </motion.button>

        {/* Close text */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          onClick={onClose}
          className="text-white/40 text-sm underline underline-offset-4 hover:text-white/60 transition-colors mb-4"
        >
          关闭并返回
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Exported Component
   ═══════════════════════════════════════════════════════════════════ */
export function FengshuiCameraTeaser({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element {
  const [screen, setScreen] = useState<Screen>("intro");

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <AnimatePresence mode="wait">
        {screen === "intro" && (
          <TeaserIntro key="intro" onStart={() => setScreen("scan")} />
        )}
        {screen === "scan" && (
          <ScanSimulation
            key="scan"
            onComplete={() => setScreen("result")}
          />
        )}
        {screen === "result" && (
          <ComingSoon key="result" onClose={onClose} />
        )}
      </AnimatePresence>
    </div>
  );
}
