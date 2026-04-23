/**
 * TalismanRenderer — 符咒分层渲染组件
 *
 * Layer 1: AI Image (Pollinations.ai) — 异步加载，淡入替换
 * Layer 2: Enhanced SVG — 保底，永远不失败
 * Layer 3: Background — 墨玉黑底
 *
 * 缓存策略: localStorage 缓存 AI 图 blob URL，同卦同分数区间只生成一次
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TalismanSVG from './TalismanSVG';
import { getPollinationsUrl, getAICacheKey } from '../../lib/ai-prompts';
import { getAICachedUrl, setAICachedUrl } from '../../lib/storage';

interface TalismanRendererProps {
  hexagramName: string;
  blessingTheme: string;
  element: string;
  category: string;
  seed: number;
  score?: number;
  width?: number;
  height?: number;
  className?: string;
}

const TalismanRenderer: React.FC<TalismanRendererProps> = ({
  hexagramName,
  blessingTheme,
  element,
  category,
  seed,
  score = 75,
  width = 360,
  height = 540,
  className = '',
}) => {
  const [aiUrl, setAiUrl] = useState<string | null>(null);
  const [aiLoaded, setAiLoaded] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cacheKey = getAICacheKey(hexagramName, score);

  /** 尝试加载AI图 */
  const loadAIImage = useCallback(async () => {
    // 先检查缓存
    const cached = getAICachedUrl(cacheKey);
    if (cached) {
      setAiUrl(cached);
      setIsGenerating(true);
      return;
    }

    // 生成 Pollinations URL
    const url = getPollinationsUrl(hexagramName, score);
    setAiUrl(url);
    setIsGenerating(true);

    // 5秒超时保护
    timeoutRef.current = setTimeout(() => {
      setAiError(true);
      setIsGenerating(false);
    }, 8000);
  }, [cacheKey, hexagramName, score]);

  useEffect(() => {
    loadAIImage();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loadAIImage]);

  /** AI图加载成功 */
  const handleImageLoad = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAiLoaded(true);
    setIsGenerating(false);
    setAiError(false);

    // 尝试缓存（如果同源或blob）
    if (aiUrl && aiUrl.startsWith('blob:')) {
      setAICachedUrl(cacheKey, aiUrl);
    }
  }, [aiUrl, cacheKey]);

  /** AI图加载失败 */
  const handleImageError = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAiError(true);
    setIsGenerating(false);
  }, []);

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width, height }}
    >
      {/* Layer 2: Enhanced SVG（保底，始终显示） */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: aiLoaded ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out',
        }}
      >
        <TalismanSVG
          hexagramName={hexagramName}
          blessingTheme={blessingTheme}
          element={element}
          category={category}
          seed={seed}
          score={score}
          width={width}
          height={height}
          showSeal
        />
      </div>

      {/* Layer 1: AI Image（异步加载，成功后淡入） */}
      <AnimatePresence>
        {aiUrl && !aiError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: aiLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              ref={imgRef}
              src={aiUrl}
              alt={`${hexagramName} talisman`}
              className="w-full h-full object-contain"
              style={{ borderRadius: '4px' }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI生成中指示器 */}
      <AnimatePresence>
        {isGenerating && !aiLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-pulse" />
            <span className="text-[9px] text-gold/50 tracking-wider">AI</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TalismanRenderer;
