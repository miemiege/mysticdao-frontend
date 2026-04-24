/**
 * exportCompatibility.ts — 浏览器兼容性检测模块
 *
 * 检测维度：
 *   - SVG 基础支持
 *   - SVG Filter 支持（feTurbulence, feSpecularLighting, feDiffuseLighting）
 *   - Canvas API 支持
 *   - Canvas toBlob / toDataURL 支持
 *   - 字体加载 API 支持
 *   - CORS / 跨域图片支持
 *   - Retina / devicePixelRatio
 *   - 推荐最佳导出策略
 */

/* ─── 类型 ─── */

export interface SVGSupportReport {
  supported: boolean;
  version: string;
  foreignObject: boolean;
  filters: FilterSupportReport;
}

export interface FilterSupportReport {
  feGaussianBlur: boolean;
  feTurbulence: boolean;
  feSpecularLighting: boolean;
  feDiffuseLighting: boolean;
  feDisplacementMap: boolean;
  feDropShadow: boolean;
  feColorMatrix: boolean;
  overall: 'full' | 'partial' | 'none';
}

export interface CanvasSupportReport {
  supported: boolean;
  toBlob: boolean;
  toDataURL: boolean;
  getContext2D: boolean;
  maxTextureSize: number; // 保守估计
}

export interface FontSupportReport {
  documentFonts: boolean; // document.fonts.ready
  webFontLoading: boolean; // @font-face loading
}

export interface CompatibilityReport {
  userAgent: string;
  devicePixelRatio: number;
  svg: SVGSupportReport;
  canvas: CanvasSupportReport;
  fonts: FontSupportReport;
  recommendedFormat: 'png' | 'jpeg';
  recommendedStrategy: ExportStrategy;
  warnings: string[];
}

export type ExportStrategy =
  | 'svg-native'      // 优先 SVG → Image → Canvas
  | 'html2canvas'     // 优先 html2canvas
  | 'canvas-fallback' // 只能使用原生 Canvas 保底
  | 'not-supported';  // 完全不支持

/* ─── 内部辅助 ─── */

function createTestSVG(): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '10');
  svg.setAttribute('height', '10');
  return svg;
}

function createFilter(filterInnerXML: string): boolean {
  try {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = createTestSVG();
    const defs = document.createElementNS(ns, 'defs');
    const filter = document.createElementNS(ns, 'filter');
    filter.setAttribute('id', 'test-filter');
    filter.innerHTML = filterInnerXML;
    defs.appendChild(filter);
    svg.appendChild(defs);

    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('width', '10');
    rect.setAttribute('height', '10');
    rect.setAttribute('filter', 'url(#test-filter)');
    svg.appendChild(rect);

    document.body.appendChild(svg);
    const bbox = svg.getBBox();
    const supported = bbox.width > 0 && bbox.height > 0;
    document.body.removeChild(svg);
    return supported;
  } catch {
    return false;
  }
}

/* ─── 公开 API ─── */

/** 检测浏览器 SVG 基础支持 */
export function detectSVGSupport(): SVGSupportReport {
  const supported =
    typeof SVGSVGElement !== 'undefined' &&
    document.createElementNS('http://www.w3.org/2000/svg', 'svg') instanceof SVGSVGElement;

  // 通过 feature detection 估算 SVG 版本
  let version = '1.1';
  if (supported) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    if ('style' in svg && 'getBBox' in svg) version = '1.1+';
    // SVG2 特性检测
    if ('getIntersectionList' in svg) version = '2.0';
  }

  // foreignObject 支持
  let foreignObject = false;
  if (supported) {
    try {
      const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      foreignObject = !!fo;
    } catch {
      foreignObject = false;
    }
  }

  return {
    supported,
    version,
    foreignObject,
    filters: detectFilterSupport(),
  };
}

/** 检测 SVG Filter 支持 */
export function detectFilterSupport(): FilterSupportReport {
  const tests: Record<keyof Omit<FilterSupportReport, 'overall'>, string> = {
    feGaussianBlur: '<feGaussianBlur stdDeviation="2"/>',
    feTurbulence: '<feTurbulence type="fractalNoise" baseFrequency="0.5"/>',
    feSpecularLighting:
      '<feSpecularLighting surfaceScale="2" specularConstant="0.5" specularExponent="10" lighting-color="white"><fePointLight x="5" y="5" z="10"/></feSpecularLighting>',
    feDiffuseLighting:
      '<feDiffuseLighting lighting-color="white" surfaceScale="1"><feDistantLight azimuth="45" elevation="60"/></feDiffuseLighting>',
    feDisplacementMap:
      '<feTurbulence type="fractalNoise" baseFrequency="0.5" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>',
    feDropShadow: '<feDropShadow dx="1" dy="1" stdDeviation="1"/>',
    feColorMatrix:
      '<feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"/>',
  };

  const results = {} as Record<keyof Omit<FilterSupportReport, 'overall'>, boolean>;
  let passCount = 0;
  for (const [name, xml] of Object.entries(tests)) {
    const ok = createFilter(xml);
    (results as Record<string, boolean>)[name] = ok;
    if (ok) passCount++;
  }

  const overall: FilterSupportReport['overall'] =
    passCount === Object.keys(tests).length ? 'full' : passCount > 0 ? 'partial' : 'none';

  return { ...results, overall };
}

/** 检测 Canvas API 支持 */
export function detectCanvasSupport(): CanvasSupportReport {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const supported = !!ctx;

  let maxTextureSize = 4096;
  try {
    // 现代浏览器 canvas 尺寸上限通常 > 8192
    const testSize = 16384;
    const testCanvas = document.createElement('canvas');
    testCanvas.width = testSize;
    testCanvas.height = testSize;
    const testCtx = testCanvas.getContext('2d');
    if (testCtx) {
      testCtx.fillStyle = '#000';
      testCtx.fillRect(testSize - 1, testSize - 1, 1, 1);
      const imgData = testCtx.getImageData(testSize - 1, testSize - 1, 1, 1);
      if (imgData.data[3] > 0) {
        maxTextureSize = 16384;
      }
    }
  } catch {
    // 保守值
  }

  return {
    supported,
    toBlob: typeof canvas.toBlob === 'function',
    toDataURL: typeof canvas.toDataURL === 'function',
    getContext2D: supported,
    maxTextureSize,
  };
}

/** 检测字体加载支持 */
export function detectFontSupport(): FontSupportReport {
  return {
    documentFonts: 'fonts' in document && typeof (document as any).fonts?.ready !== 'undefined',
    webFontLoading: 'FontFace' in window,
  };
}

/** 综合检测：生成完整兼容性报告 */
export async function getCompatibilityReport(): Promise<CompatibilityReport> {
  const svg = detectSVGSupport();
  const canvas = detectCanvasSupport();
  const fonts = detectFontSupport();
  const warnings: string[] = [];

  // 生成警告
  if (!svg.supported) warnings.push('Browser does not support SVG rendering.');
  if (!svg.foreignObject) warnings.push('SVG foreignObject not supported; HTML text fallback may fail.');
  if (svg.filters.overall === 'none') warnings.push('No SVG filter support; visual effects will be skipped.');
  if (svg.filters.overall === 'partial') warnings.push('Partial SVG filter support; some effects may be missing.');
  if (!canvas.supported) warnings.push('Canvas 2D API not available.');
  if (!canvas.toBlob) warnings.push('Canvas toBlob not supported; file export may fail.');
  if (!fonts.documentFonts) warnings.push('Font loading API not available; fonts may render incorrectly.');

  // 推荐策略
  let recommendedStrategy: ExportStrategy;
  if (!svg.supported || !canvas.supported) {
    recommendedStrategy = 'not-supported';
  } else if (svg.filters.overall === 'none' || !svg.foreignObject) {
    recommendedStrategy = 'canvas-fallback';
  } else if (svg.filters.overall === 'partial') {
    recommendedStrategy = 'svg-native';
  } else {
    // 滤镜完整时，html2canvas 也能处理大部分情况
    recommendedStrategy = 'svg-native';
  }

  // 推荐格式：PNG 兼容性最好，无背景透明需求时 PNG；需要纯白背景时 JPEG
  const recommendedFormat: 'png' | 'jpeg' =
    svg.filters.overall === 'full' && canvas.supported ? 'png' : 'jpeg';

  return {
    userAgent: navigator.userAgent,
    devicePixelRatio: window.devicePixelRatio || 1,
    svg,
    canvas,
    fonts,
    recommendedFormat,
    recommendedStrategy,
    warnings,
  };
}

/** 根据环境推荐最佳导出策略（同步快捷版） */
export function getRecommendedFormat(): {
  format: 'png' | 'jpeg';
  strategy: ExportStrategy;
  scale: number;
  useFilters: boolean;
} {
  const svg = detectSVGSupport();
  const canvas = detectCanvasSupport();
  const dpr = window.devicePixelRatio || 1;

  if (!svg.supported || !canvas.supported) {
    return { format: 'png', strategy: 'not-supported', scale: 1, useFilters: false };
  }

  if (svg.filters.overall === 'none') {
    return { format: 'jpeg', strategy: 'canvas-fallback', scale: dpr >= 2 ? 2 : 1, useFilters: false };
  }

  if (svg.filters.overall === 'partial') {
    return { format: 'png', strategy: 'svg-native', scale: dpr >= 2 ? 2 : 1, useFilters: false };
  }

  // 完整支持：优先高质量 PNG
  return {
    format: 'png',
    strategy: 'svg-native',
    scale: dpr >= 2 ? 2 : 1,
    useFilters: true,
  };
}

/** 检测当前环境是否满足最低导出要求 */
export function isExportSupported(): boolean {
  const svg = detectSVGSupport();
  const canvas = detectCanvasSupport();
  return svg.supported && canvas.supported && canvas.toBlob;
}
