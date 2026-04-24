/**
 * useExportPoster.ts — React Hook for poster export
 *
 * Features:
 *   - Wraps exportPosterToImage
 *   - Manages loading / error / result states
 *   - Auto-cleanup object URLs on unmount or new export
 *   - Provides progress callback support
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  exportPosterToImage,
  downloadImage,
  revokeExportUrl,
  type ExportOptions,
  type ExportResult,
} from '@/lib/exportPoster';
import { getRecommendedFormat } from '@/lib/exportCompatibility';

/* ─── Hook State ─── */

export interface UseExportPosterState {
  loading: boolean;
  error: Error | null;
  result: ExportResult | null;
  progress: number; // 0-100
  elapsedMs: number;
}

export interface UseExportPosterActions {
  exportImage: (
    svgRef: React.RefObject<SVGSVGElement | null>,
    options?: ExportOptions & { filename?: string }
  ) => Promise<ExportResult | null>;
  exportAndDownload: (
    svgRef: React.RefObject<SVGSVGElement | null>,
    options?: ExportOptions & { filename?: string }
  ) => Promise<void>;
  clear: () => void;
}

export function useExportPoster(): UseExportPosterState & UseExportPosterActions {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<ExportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  // 用于保存上一次生成的 URL，以便清理
  const lastUrlRef = useRef<string | undefined>(undefined);

  const clear = useCallback(() => {
    if (lastUrlRef.current) {
      revokeExportUrl(lastUrlRef.current);
      lastUrlRef.current = undefined;
    }
    setResult(null);
    setError(null);
    setProgress(0);
    setElapsedMs(0);
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (lastUrlRef.current) {
        revokeExportUrl(lastUrlRef.current);
      }
    };
  }, []);

  const exportImage = useCallback(
    async (
      svgRef: React.RefObject<SVGSVGElement | null>,
      options?: ExportOptions & { filename?: string }
    ): Promise<ExportResult | null> => {
      const svg = svgRef.current;
      if (!svg) {
        const err = new Error('SVG element not found (ref is null)');
        setError(err);
        return null;
      }

      // 清理上一次结果
      if (lastUrlRef.current) {
        revokeExportUrl(lastUrlRef.current);
        lastUrlRef.current = undefined;
      }

      setLoading(true);
      setError(null);
      setResult(null);
      setProgress(10);
      setElapsedMs(0);

      const start = performance.now();

      try {
        setProgress(30);
        const mergedOpts: ExportOptions = {
          ...getRecommendedFormat(),
          ...options,
        };

        const exportResult = await exportPosterToImage(svg, mergedOpts);
        setProgress(90);

        lastUrlRef.current = exportResult.url;
        setResult(exportResult);
        setProgress(100);
        setElapsedMs(Math.round(performance.now() - start));

        return exportResult;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        setProgress(0);
        setElapsedMs(Math.round(performance.now() - start));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const exportAndDownload = useCallback(
    async (
      svgRef: React.RefObject<SVGSVGElement | null>,
      options?: ExportOptions & { filename?: string }
    ): Promise<void> => {
      const { filename = 'poster.png', ...exportOpts } = options ?? {};
      const res = await exportImage(svgRef, exportOpts);
      if (res) {
        downloadImage(res.url, filename);
      }
    },
    [exportImage]
  );

  return {
    loading,
    error,
    result,
    progress,
    elapsedMs,
    exportImage,
    exportAndDownload,
    clear,
  };
}
