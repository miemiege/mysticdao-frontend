/**
 * 海报降级导出模块
 * 当 html2canvas 和 SVG 序列化均失败时，使用 Canvas API 进行保底绘制
 */

export interface PosterData {
  style: string;
  title?: string;
  content?: string;
  author?: string;
  date?: string;
  qrUrl?: string;
}

/**
 * 简化版海报绘制 - 保底降级策略
 * 当所有高级导出方式失败时，使用纯 Canvas API 绘制基础海报
 */
export function drawSimplifiedPoster(
  canvas: HTMLCanvasElement,
  data: PosterData
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法获取 Canvas 2D 上下文');
  }

  const width = canvas.width;
  const height = canvas.height;
  const style = data.style || 'ink';

  // ============================================================
  // 8 风格配色方案（降级保底绘制）
  // ============================================================
  const palette: Record<string, { bg: string; text: string; accent: string; border: string }> = {
    // 水墨风 - 传统东方美学
    ink: { bg: '#F5F0E8', text: '#2C2C2C', accent: '#8B0000', border: '#3A3A3A' },
    // 暗黑风 - 神秘深邃
    dark: { bg: '#0A0A0F', text: '#E0E0E0', accent: '#9D4EDD', border: '#4A4A6A' },
    // 皇家风 - 尊贵典雅
    royal: { bg: '#1C0F0A', text: '#F5E6D3', accent: '#C8A45C', border: '#C8A45C' },
    // 复古风 - 怀旧质感
    vintage: { bg: '#D4C5B0', text: '#3E2723', accent: '#5D4037', border: '#5D4037' },
    // 天师风 - 道教符箓
    tianshi: { bg: '#F5E6A3', text: '#8B0000', accent: '#D4AF37', border: '#8B0000' },
    // 黑金风 - 奢华庄重
    blackgold: { bg: '#0D0D0D', text: '#FFFFFF', accent: '#D4AF37', border: '#D4AF37' },
    // 赛博道 - 科幻东方融合
    cybertao: { bg: '#0A0A1A', text: '#E0E0E0', accent: '#00F5FF', border: '#FF00FF' },
    // 禅意园 - 日式庭院美学
    zengarden: { bg: '#F5F0E6', text: '#4A4A4A', accent: '#5B7B6F', border: '#8B9D83' },
  };

  const colors = palette[style] || palette.ink;

  // 绘制背景
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);

  // 绘制边框
  const padding = Math.min(width, height) * 0.04;
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

  // 绘制标题
  if (data.title) {
    ctx.fillStyle = colors.accent;
    ctx.font = `bold ${Math.max(16, width * 0.05)}px "Noto Serif SC", serif`;
    ctx.textAlign = 'center';
    ctx.fillText(data.title, width / 2, height * 0.2);
  }

  // 绘制内容
  if (data.content) {
    ctx.fillStyle = colors.text;
    ctx.font = `${Math.max(12, width * 0.03)}px "Noto Sans SC", sans-serif`;
    ctx.textAlign = 'center';

    // 简单文本换行
    const maxWidth = width * 0.8;
    const lineHeight = Math.max(18, width * 0.045);
    const words = data.content.split('');
    let line = '';
    let y = height * 0.35;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, width / 2, y);
        line = words[i];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);
  }

  // 绘制作者
  if (data.author) {
    ctx.fillStyle = colors.accent;
    ctx.font = `${Math.max(10, width * 0.025)}px "Noto Serif SC", serif`;
    ctx.textAlign = 'right';
    ctx.fillText(`—— ${data.author}`, width - padding * 2, height * 0.75);
  }

  // 绘制日期
  if (data.date) {
    ctx.fillStyle = colors.text;
    ctx.font = `${Math.max(10, width * 0.02)}px "Noto Sans SC", sans-serif`;
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.6;
    ctx.fillText(data.date, width / 2, height * 0.88);
    ctx.globalAlpha = 1;
  }

  // 绘制底部装饰线
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width * 0.3, height * 0.92);
  ctx.lineTo(width * 0.7, height * 0.92);
  ctx.stroke();

  return canvas;
}

/**
 * 导出海报为图片 Blob
 */
export async function exportPosterAsBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas 转 Blob 失败'));
        }
      },
      `image/${format}`,
      quality
    );
  });
}

/**
 * 触发浏览器下载
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =================================================================== */
/* 兼容导出 — 供 useExportPoster / ExportButton / ExportTester 使用     */
/* =================================================================== */

export interface ExportOptions {
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  scale?: number;
  width?: number;
  height?: number;
  ignoreFilters?: boolean;
}

export interface ExportResult {
  url: string;
  blob: Blob;
  sizeBytes: number;
  durationMs: number;
  format: string;
  strategy?: string;
}

/** 导出海报为图片（高级接口，供 hook 使用） */
export async function exportPosterToImage(
  svgEl: SVGSVGElement,
  options: ExportOptions = {}
): Promise<ExportResult> {
  const start = performance.now();
  const {
    format = 'png',
    quality = 0.92,
    scale = 2,
  } = options;

  // Serialize SVG
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  // Draw to canvas
  const canvas = document.createElement('canvas');
  const rect = svgEl.getBoundingClientRect();
  canvas.width = (options.width || rect.width || 400) * scale;
  canvas.height = (options.height || rect.height || 640) * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('SVG image load failed'));
    img.src = url;
  });

  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(url);

  // Export blob
  const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))), mime, quality);
  });

  const resultUrl = URL.createObjectURL(blob);
  return {
    url: resultUrl,
    blob,
    sizeBytes: blob.size,
    durationMs: Math.round(performance.now() - start),
    format: mime,
    strategy: 'svg-canvas',
  };
}

/** 触发图片下载 */
export function downloadImage(url: string, filename: string, hexagramName?: string, score?: number, style?: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // GA4 tracking
  if (typeof gtag === 'function' && hexagramName) {
    gtag('event', 'poster_export', {
      event_category: 'engagement',
      event_label: hexagramName,
      value: score || 0,
      custom_parameter_1: style || 'unknown',
    });
  }
}

/** 释放 object URL */
export function revokeExportUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/** 格式化文件大小 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
