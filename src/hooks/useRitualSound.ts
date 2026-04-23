import { useState, useCallback, useRef } from 'react';

const MUTE_KEY = 'ritual_sound_muted';

function createAudioContext(): AudioContext | null {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    return Ctx ? new Ctx() : null;
  } catch {
    return null;
  }
}

export function useRitualSound() {
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (!ctxRef.current) {
      ctxRef.current = createAudioContext();
    }
    return ctxRef.current;
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(MUTE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const playShake = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;

    const duration = 0.5;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    const gain = ctx.createGain();
    gain.gain.value = 0.35;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + duration);
  }, [muted, getCtx]);

  const playCoinDrop = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [1200, 1800, 2400];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now + i * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.02 + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.02);
      osc.stop(now + i * 0.02 + 0.18);
    });
  }, [muted, getCtx]);

  const playReveal = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [440, 554.37, 659.25]; // A4, C#5, E5 major triad
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.1, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + 1.8);
    });
  }, [muted, getCtx]);

  const vibrate = useCallback((pattern: number[]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  }, []);

  return { muted, toggleMute, playShake, playCoinDrop, playReveal, vibrate };
}
