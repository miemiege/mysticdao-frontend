/**
 * exportPoster.ts — SVG 海报导出核心工具（多级降级策略）
 *
 * 导出策略：
 *   Level 1: html2canvas 直接捕获（含 SVG foreignObject）
 *   Level 2: SVG → 序列化字符串 → Blob → Image → Canvas
 *   Level 3: 移除复杂 SVG filter 后重试 Level 2
 *   Level 4: Canvas 原生 API 绘制简化版保底
 *
 * 关键技术：
 *   - SVG XMLSerializer 序列化
 *   - WebFont 内联（探测 + data-url 回退）
 *   - Retina 适配（scale * devicePixelRatio）
 *   - CORS 安全（blob URL + crossOrigin）
 *   - 内存管理（revokeObjectURL 及时清理）
 */

/* ─── 类型 ─── */

export interface ExportOptions {
  scale?: number;           // 默认 2（Retina）
  quality?: number;         // JPEG quality 0–1，默认 0.92
  format?: 'png' | 'jpeg';  // 默认 png
  backgroundColor?: string; // JPEG 时默认 #FFFFFF
  ignoreFilters?: boolean;  // 是否跳过复杂 SVG 滤镜
}

export interface ExportResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

/** 每一级导出策略的执行结果 */
interface LevelResult {
  level: number;
  canvas: HTMLCanvasElement | null;
  error?: Error;
  durationMs: number;
}

const DEFAULT_OPTIONS: Required<Omit<ExportOptions, 'backgroundColor'>> &
  Pick<ExportOptions, 'backgroundColor'> = {
  scale: 2,
  quality: 0.92,
  format: 'png',
  backgroundColor: '#FFFFFF',
  ignoreFilters: false,
};

/* ─── 辅助：合并默认选项 ─── */
function mergeOptions(opts?: ExportOptions): Required<ExportOptions> {
  return {
    scale: opts?.scale ?? DEFAULT_OPTIONS.scale,
    quality: opts?.quality ?? DEFAULT_OPTIONS.quality,
    format: opts?.format ?? DEFAULT_OPTIONS.format,
    backgroundColor: opts?.backgroundColor ?? DEFAULT_OPTIONS.backgroundColor!,
    ignoreFilters: opts?.ignoreFilters ?? DEFAULT_OPTIONS.ignoreFilters,
  };
}

/* ─── 辅助：内联字体 ─── */

/** 收集页面中所有 @font-face 规则并包装成 <style> */
async function collectFontStyles(): Promise<string> {
  const rules: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const cssRules = Array.from(sheet.cssRules ?? []);
      for (const rule of cssRules) {
        if (rule instanceof CSSFontFaceRule) {
          rules.push(rule.cssText);
        }
      }
    } catch {
      // 跨域样式表无法访问，静默跳过
    }
  }
  if (rules.length === 0) return '';
  return `<style>${rules.join('\n')}</style>`;
}

/** 收集 Google Fonts <link> 标签（用于 html2canvas 场景） */
function collectFontLinks(): HTMLLinkElement[] {
  return Array.from(
    document.querySelectorAll('link[rel="stylesheet"]')
  ).filter((el): el is HTMLLinkElement => {
    const href = el.getAttribute('href') ?? '';
    return href.includes('fonts.googleapis.com') || href.includes('fonts.gstatic.com');
  });
}

/* ─── 辅助：SVG 序列化与清理 ─── */

/** 将 SVG 元素序列化为 XML 字符串 */
function serializeSVG(svg: SVGSVGElement): string {
  const serializer = new XMLSerializer();
  let str = serializer.serializeToString(svg);

  // 确保 xmlns 存在
  if (!str.includes('xmlns="http://www.w3.org/2000/svg"')) {
    str = str.replace(
      '<svg',
      '<svg xmlns="http://www.w3.org/2000/svg"'
    );
  }
  // 确保 xmlns:xlink 存在（兼容旧 filter 引用）
  if (!str.includes('xmlns:xlink')) {
    str = str.replace(
      '<svg',
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
    );
  }
  return str;
}

/** 创建“干净版”SVG：移除复杂滤镜 */
function createCleanSVG(svg: SVGSVGElement): SVGSVGElement {
  const clone = svg.cloneNode(true) as SVGSVGElement;

  // 移除 filter 属性（避免 feTurbulence / feSpecularLighting 等）
  const allWithFilter = clone.querySelectorAll('[filter]');
  allWithFilter.forEach((el) => el.removeAttribute('filter'));

  // 移除 defs 中的复杂滤镜定义
  const defsList = clone.querySelectorAll('defs');
  defsList.forEach((def) => {
    const complexFilters = def.querySelectorAll(
      'feTurbulence, feSpecularLighting, feDiffuseLighting, feDisplacementMap'
    );
    complexFilters.forEach((f) => f.parentElement?.remove());
  });

  // 移除 mixBlendMode 样式（canvas 不支持）
  const allWithBlend = clone.querySelectorAll('[style*="mixBlendMode"], [style*="mix-blend-mode"]');
  allWithBlend.forEach((el) => {
    const style = (el as HTMLElement).getAttribute('style') ?? '';
    (el as HTMLElement).setAttribute(
      'style',
      style.replace(/mix-blend-mode\s*:\s*[^;]+;?/gi, '').replace(/mixBlendMode\s*:\s*[^;]+;?/gi, '')
    );
  });

  return clone;
}

/* ─── Level 1: html2canvas ─── */

async function tryHtml2Canvas(
  svg: SVGSVGElement,
  opts: Required<ExportOptions>
): Promise<LevelResult> {
  const start = performance.now();
  let canvas: HTMLCanvasElement | null = null;

  try {
    const html2canvas = (await import('html2canvas')).default;

    // 临时将 SVG 包裹在一个 div 中，方便 html2canvas 捕获
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    // 精确尺寸避免模糊
    const rect = svg.getBoundingClientRect();
    const w = rect.width || parseFloat(svg.getAttribute('width') ?? '400');
    const h = rect.height || parseFloat(svg.getAttribute('height') ?? '600');
    wrapper.style.width = `${w}px`;
    wrapper.style.height = `${h}px`;

    // 克隆 SVG 并内联字体样式
    const clone = svg.cloneNode(true) as SVGSVGElement;
    const fontStyle = await collectFontStyles();
    if (fontStyle) {
      const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleEl.textContent = fontStyle.replace(/<style>|<\/style>/g, '');
      clone.insertBefore(styleEl, clone.firstChild);
    }

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // 复制字体链接到 wrapper shadow
    const fontLinks = collectFontLinks();
    fontLinks.forEach((link) => {
      const clonedLink = link.cloneNode() as HTMLLinkElement;
      wrapper.appendChild(clonedLink);
    });

    try {
      canvas = await html2canvas(wrapper, {
        scale: opts.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor:
          opts.format === 'jpeg' ? opts.backgroundColor : null,
        logging: false,
        onclone: (clonedDoc) => {
          // 在克隆文档中也确保字体链接存在
          const head = clonedDoc.head;
          fontLinks.forEach((link) => {
            if (!head.querySelector(`link[href="${link.href}"]`)) {
              head.appendChild(link.cloneNode());
            }
          });
        },
      });
    } finally {
      document.body.removeChild(wrapper);
    }

    return { level: 1, canvas, durationMs: performance.now() - start };
  } catch (err) {
    return {
      level: 1,
      canvas: null,
      error: err instanceof Error ? err : new Error(String(err)),
      durationMs: performance.now() - start,
    };
  }
}

/* ─── Level 2: SVG → Blob → Image → Canvas ─── */

async function trySVGImagePipeline(
  svg: SVGSVGElement,
  opts: Required<ExportOptions>,
  clean = false
): Promise<LevelResult> {
  const start = performance.now();
  let canvas: HTMLCanvasElement | null = null;

  try {
    const targetSVG = clean ? createCleanSVG(svg) : svg;
    let svgString = serializeSVG(targetSVG);

    // 注入字体样式（Data-URL 字体无法简单内联，这里注入 @font-face CSS）
    const fontStyle = await collectFontStyles();
    if (fontStyle) {
      // 在 <svg> 开始标签后插入 <defs><style>...</style></defs>
      const styleBlock = `<defs>${fontStyle}</defs>`;
      svgString = svgString.replace(/<svg([^>]*)>/i, `<svg$1>${styleBlock}`);
    }

    // 转为 Blob URL
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    try {
      const img = new Image();
      const rect = svg.getBoundingClientRect();
      const cssWidth = rect.width || parseFloat(svg.getAttribute('width') ?? '400');
      const cssHeight = rect.height || parseFloat(svg.getAttribute('height') ?? '600');

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('SVG image load failed'));
        img.src = url;
      });

      // Retina 适配
      const dpr = window.devicePixelRatio || 1;
      const scale = opts.scale * dpr;
      const outW = Math.round(cssWidth * scale);
      const outH = Math.round(cssHeight * scale);

      canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context not available');

      // 对于 JPEG，先填充背景色
      if (opts.format === 'jpeg') {
        ctx.fillStyle = opts.backgroundColor;
        ctx.fillRect(0, 0, outW, outH);
      }

      // 绘制时应用缩放
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, cssWidth, cssHeight);

      return { level: clean ? 3 : 2, canvas, durationMs: performance.now() - start };
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    return {
      level: clean ? 3 : 2,
      canvas: null,
      error: err instanceof Error ? err : new Error(String(err)),
      durationMs: performance.now() - start,
    };
  }
}

/* ─── Level 4: 原生 Canvas 保底绘制 ─── */

async function tryNativeCanvas(
  svg: SVGSVGElement,
  opts: Required<ExportOptions>
): Promise<LevelResult> {
  const start = performance.now();
  let canvas: HTMLCanvasElement | null = null;

  try {
    const rect = svg.getBoundingClientRect();
    const cssWidth = rect.width || parseFloat(svg.getAttribute('width') ?? '400');
    const cssHeight = rect.height || parseFloat(svg.getAttribute('height') ?? '600');
    const dpr = window.devicePixelRatio || 1;
    const scale = opts.scale * dpr;

    const outW = Math.round(cssWidth * scale);
    const outH = Math.round(cssHeight * scale);

    canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    // 读取 data-poster-style 判断风格
    const styleName = svg.getAttribute('data-poster-style') ?? 'ink';

    // 背景
    if (opts.format === 'jpeg') {
      ctx.fillStyle = opts.backgroundColor;
      ctx.fillRect(0, 0, outW, outH);
    }

    ctx.save();
    ctx.scale(scale, scale);

    // 简化版绘制：仅保留核心文字和几何
    await drawSimplifiedPoster(ctx, svg, cssWidth, cssHeight, styleName);

    ctx.restore();

    return { level: 4, canvas, durationMs: performance.now() - start };
  } catch (err) {
    return {
      level: 4,
      canvas: null,
      error: err instanceof Error ? err : new Error(String(err)),
      durationMs: performance.now() - start,
    };
  }
}

/** 使用 Canvas 2D API 绘制简化版海报 */
async function drawSimplifiedPoster(
  ctx: CanvasRenderingContext2D,
  svg: SVGSVGElement,
  width: number,
  height: number,
  styleName: string
): Promise<void> {
  // 配色映射（与 posterStyles 对应）
  const palette: Record<string, { bg: string; text: string; accent: string; border: string }> = {
    ink: { bg: '#F5F0E8', text: '#2C2C2C', accent: '#8B0000', border: '#3A3A3A' },
    dark: { bg: '#0A0A0F', text: '#E0E0E0', accent: '#9D4EDD', border: '#4A4A6A' },
    royal: { bg: '#1C0F0A', text: '#F5E6D3', accent: '#C8A45C', border: '#C8A45C' },
    vintage: { bg: '#D4C5B0', text: '#3E2723', accent: '#5D4037', border: '#5D4037' },
    tianshi: { bg: '#F5E6A3', text: '#8B0000', accent: '#D4AF37', border: '#8B0000' },
    blackgold: { bg: '#0D0D0D', text: '#FFFFFF', accent: '#D4AF37', border: '#D4AF37' },
  };

  const p = palette[styleName] ?? palette.ink;

  // 1. 背景
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, width, height);

  // 2. 边框
  ctx.strokeStyle = p.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  // 3. 从 SVG text 元素提取文字内容
  const texts = Array.from(svg.querySelectorAll('text'));
  const mainTitle = texts.find((t) => parseFloat(t.getAttribute('fontSize') ?? '0') >= 40)?.textContent ?? '';
  const subTitle = texts.find((t) => {
    const fs = parseFloat(t.getAttribute('fontSize') ?? '0');
    return fs >= 14 && fs < 30;
  })?.textContent ?? '';

  // 4. 印章文字
  const sealText = texts.find((t) => {
    const parent = t.closest('g[transform*="translate"]');
    return parent && t.getAttribute('fontSize') === '18';
  })?.textContent ?? '';

  // 5. 提取 foreignObject 中的判词
  let judgment = '';
  const fo = svg.querySelector('foreignObject div');
  if (fo) {
    judgment = fo.textContent ?? '';
  }

  // 6. 绘制标题（卦象符号）
  ctx.fillStyle = p.accent;
  ctx.font = `bold 48px "Noto Serif SC", serif`;
  ctx.textAlign = 'center';
  if (mainTitle) {
    ctx.fillText(mainTitle, width / 2, 85);
  }

  // 7. 绘制英文名
  ctx.fillStyle = p.text;
  ctx.font = `600 14px "Cinzel", serif`;
  if (subTitle) {
    ctx.fillText(subTitle.toUpperCase(), width / 2, 120);
  }

  // 8. 分隔线
  ctx.strokeStyle = p.border;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 60, 140);
  ctx.lineTo(width / 2 + 60, 140);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // 9. 判词（简化版，自动换行）
  if (judgment) {
    ctx.fillStyle = p.text;
    ctx.font = `12px "Cinzel", serif`;
    ctx.globalAlpha = 0.85;
    const maxWidth = width - 80;
    const words = judgment.split(/\s+/);
    let line = '';
    let y = 180;
    const lineHeight = 18;
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        ctx.fillText(line, width / 2, y);
        line = word;
        y += lineHeight;
        if (y > 320) break; // 限制行数
      } else {
        line = testLine;
      }
    }
    if (line && y <= 320) {
      ctx.fillText(line, width / 2, y);
    }
    ctx.globalAlpha = 1;
  }

  // 10. 印章
  if (sealText) {
    const sealX = width - 55;
    const sealY = height - 55;
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(sealX - 26, sealY - 26, 52, 52);
    ctx.fillStyle = p.accent;
    ctx.font = `bold 16px "Noto Serif SC", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sealText, sealX, sealY);
  }

  // 11. 底部品牌
  ctx.fillStyle = p.text;
  ctx.font = `8px "Cinzel", serif`;
  ctx.globalAlpha = 0.4;
  ctx.textAlign = 'center';
  ctx.fillText('MYSTIC DAO', width / 2, height - 18);
  ctx.globalAlpha = 1;
}

/* ─── 核心导出：多级降级 ─── */

export async function exportPosterToCanvas(
  svgElement: SVGSVGElement,
  options?: ExportOptions
): Promise<HTMLCanvasElement> {
  const opts = mergeOptions(options);
  const results: LevelResult[] = [];

  // Level 1: html2canvas
  if (!opts.ignoreFilters) {
    const r1 = await tryHtml2Canvas(svgElement, opts);
    results.push(r1);
    if (r1.canvas) return r1.canvas;
  }

  // Level 2: 原生 SVG → Image → Canvas（最常用、成功率最高）
  const r2 = await trySVGImagePipeline(svgElement, opts, false);
  results.push(r2);
  if (r2.canvas) return r2.canvas;

  // Level 3: 移除滤镜后重试
  if (!opts.ignoreFilters) {
    const r3 = await trySVGImagePipeline(svgElement, opts, true);
    results.push(r3);
    if (r3.canvas) return r3.canvas;
  }

  // Level 4: Canvas 原生保底
  const r4 = await tryNativeCanvas(svgElement, opts);
  results.push(r4);
  if (r4.canvas) return r4.canvas;

  // 全部失败，抛出聚合错误
  const errors = results
    .filter((r) => r.error)
    .map((r) => `[Level ${r.level}] ${r.error!.message}`);
  throw new Error(
    `All export levels failed.\n` + errors.join('\n')
  );
}

export async function exportPosterToImage(
  svgElement: SVGSVGElement,
  options?: ExportOptions
): Promise<ExportResult> {
  const opts = mergeOptions(options);
  const canvas = await exportPosterToCanvas(svgElement, opts);

  const mime = opts.format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const quality = opts.format === 'jpeg' ? opts.quality : undefined;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob returned null'));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve({
          blob,
          url,
          width: canvas.width,
          height: canvas.height,
        });
      },
      mime,
      quality
    );
  });
}

/* ─── 工具：触发浏览器下载 ─── */

export function downloadImage(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  // 延迟清理，确保下载请求已发出
  setTimeout(() => {
    document.body.removeChild(a);
  }, 100);
}

/* ─── 工具：格式化文件大小 ─── */

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ─── 工具：安全释放 URL ─── */

export function revokeExportUrl(url: string | undefined): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
