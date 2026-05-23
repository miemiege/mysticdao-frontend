/**
 * AI 生成内容水印模块
 * 符合 GB 45438-2025 标识要求：显式水印，右下角，≤5%画面
 */

export interface WatermarkOptions {
  text?: string;
  color?: string;
  fontSize?: number;
  opacity?: number;
  padding?: number;
}

const DEFAULT_OPTIONS: Required<WatermarkOptions> = {
  text: 'AI Generated · MysticDao',
  color: 'rgba(200, 164, 92, 0.5)',
  fontSize: 12,
  opacity: 0.5,
  padding: 16,
};

/**
 * 在 Canvas 上绘制水印
 * 右下角，半透明，不破坏主视觉
 */
export function drawWatermark(
  canvas: HTMLCanvasElement,
  options: WatermarkOptions = {}
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const opts = { ...DEFAULT_OPTIONS, ...options };
  const width = canvas.width;
  const height = canvas.height;

  // 字体大小自适应：不超过画面短边的 2.5%
  const minDimension = Math.min(width, height);
  const adaptiveFontSize = Math.max(10, Math.floor(minDimension * 0.025));
  const fontSize = opts.fontSize ? Math.min(opts.fontSize, adaptiveFontSize) : adaptiveFontSize;

  ctx.save();
  ctx.globalAlpha = opts.opacity;
  ctx.fillStyle = opts.color;
  ctx.font = `${fontSize}px "Noto Sans SC", "Helvetica Neue", sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  const padding = opts.padding;
  ctx.fillText(opts.text, width - padding, height - padding);

  ctx.restore();
  return canvas;
}

/**
 * 在 DOM 元素上叠加水印层（供 html2canvas 导出前使用）
 * 返回一个临时容器，包含原元素 + 水印
 */
export function wrapWithWatermark(
  element: HTMLElement,
  options: WatermarkOptions = {}
): HTMLElement {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.display = 'inline-block';
  wrapper.style.width = `${element.offsetWidth}px`;
  wrapper.style.height = `${element.offsetHeight}px`;

  // 克隆原元素
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.width = '100%';
  clone.style.height = '100%';
  wrapper.appendChild(clone);

  // 创建水印层
  const watermark = document.createElement('div');
  watermark.style.position = 'absolute';
  watermark.style.bottom = '12px';
  watermark.style.right = '12px';
  watermark.style.fontSize = '11px';
  watermark.style.color = 'rgba(200, 164, 92, 0.45)';
  watermark.style.fontFamily = '"Noto Sans SC", sans-serif';
  watermark.style.letterSpacing = '0.05em';
  watermark.style.pointerEvents = 'none';
  watermark.style.zIndex = '9999';
  watermark.textContent = opts.text;

  wrapper.appendChild(watermark);
  return wrapper;
}

/**
 * 为 html2canvas 导出添加水印
 * 在导出后的 canvas 上直接绘制
 */
export async function exportWithWatermark(
  canvas: HTMLCanvasElement,
  options?: WatermarkOptions
): Promise<HTMLCanvasElement> {
  return drawWatermark(canvas, options);
}
