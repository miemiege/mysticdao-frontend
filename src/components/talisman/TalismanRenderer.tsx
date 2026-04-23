import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import TalismanSVG from './TalismanSVG';
import { getPollinationsUrl, getAICacheKey } from '@/lib/ai-prompts';

interface TalismanRendererProps {
  hexagramName: string;
  blessingTheme: string;
  element: string;
  category: string;
  seed: number;
  score?: number;
  width?: number;
  height?: number;
}

const AI_CACHE_PREFIX = 'mysticdao_ai_cache_';
const AI_CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
const AI_CACHE_LIMIT = 20;

function getAICachedUrl(key: string): string | null {
  try {
    const data = localStorage.getItem(AI_CACHE_PREFIX + key);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (Date.now() - parsed.timestamp > AI_CACHE_EXPIRY) {
      localStorage.removeItem(AI_CACHE_PREFIX + key);
      return null;
    }
    return parsed.url;
  } catch {
    return null;
  }
}

function setAICachedUrl(key: string, url: string): void {
  try {
    // Check limit
    const keys = Object.keys(localStorage).filter(k => k.startsWith(AI_CACHE_PREFIX));
    if (keys.length >= AI_CACHE_LIMIT) {
      // Remove oldest
      let oldest = keys[0];
      let oldestTime = Infinity;
      for (const k of keys) {
        try {
          const d = JSON.parse(localStorage.getItem(k) || '{}');
          if (d.timestamp < oldestTime) {
            oldestTime = d.timestamp;
            oldest = k;
          }
        } catch { /* ignore */ }
      }
      localStorage.removeItem(oldest);
    }
    localStorage.setItem(AI_CACHE_PREFIX + key, JSON.stringify({ url, timestamp: Date.now() }));
  } catch { /* ignore */ }
}

const TalismanRenderer: React.FC<TalismanRendererProps> = ({
  hexagramName, blessingTheme, element, category, seed, score = 75, width = 360, height = 540
}) => {
  const [aiUrl, setAiUrl] = useState<string | null>(null);
  const [aiLoaded, setAiLoaded] = useState(false);

  const loadAIImage = useCallback(() => {
    const cacheKey = getAICacheKey(hexagramName, score);
    const cached = getAICachedUrl(cacheKey);
    if (cached) {
      setAiUrl(cached);
      return;
    }

    const url = getPollinationsUrl(hexagramName, blessingTheme, element, category, score, width, height);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setAiUrl(url);
      setAICachedUrl(cacheKey, url);
    };
    img.onerror = () => {
      // SVG fallback handles this
    };
    img.src = url;

    // Timeout fallback
    const timer = setTimeout(() => {
      if (!aiUrl) {
        // Keep SVG as fallback
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [hexagramName, blessingTheme, element, category, score, width, height, aiUrl]);

  useEffect(() => {
    loadAIImage();
  }, [loadAIImage]);

  const handleImageLoad = () => {
    setAiLoaded(true);
  };

  return (
    <div className="relative" style={{ width, height }}>
      {/* Layer 1: AI Image */}
      {aiUrl && (
        <motion.img
          src={aiUrl}
          alt={`${hexagramName} talisman`}
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
          style={{ opacity: aiLoaded ? 1 : 0, transition: 'opacity 1.2s ease-in-out' }}
          onLoad={handleImageLoad}
          crossOrigin="anonymous"
        />
      )}

      {/* Layer 2: SVG Fallback (always rendered underneath) */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: aiLoaded ? 0.15 : 1, transition: 'opacity 1.2s ease-in-out' }}>
        <TalismanSVG
          hexagramName={hexagramName}
          blessingTheme={blessingTheme}
          element={element}
          category={category}
          seed={seed}
          score={score}
          width={width}
          height={height}
        />
      </div>

      {/* Layer 3: Background */}
      <div className="absolute inset-0 -z-10 bg-black rounded-xl" />
    </div>
  );
};

export default TalismanRenderer;
