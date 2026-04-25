/**
 * MysticDAO Analytics – 轻量埋点层
 * 优先使用 Google Analytics (gtag)，否则降级到 console
 */

export interface TrackEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  extra?: Record<string, unknown>;
}

/** 判断是否在浏览器环境 */
const isBrowser = typeof window !== 'undefined';

/** 获取全局 gtag 函数（如果存在） */
function getGtag(): any | undefined {
  if (!isBrowser) return undefined;
  return (window as any).gtag;
}

/** 发送埋点事件 */
export function trackEvent(event: TrackEvent): void {
  const { action, category, label, value, extra } = event;

  // 1. Google Analytics 4 (gtag)
  const gtag = getGtag();
  if (typeof gtag === 'function') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
      ...extra,
    });
    return;
  }

  // 2. 数据层 (GTM)
  if (isBrowser && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: action,
      eventCategory: category,
      eventLabel: label,
      eventValue: value,
      ...extra,
    });
    return;
  }

  // 3. 降级：开发环境打印到 console
  if (isBrowser && (import.meta as any).env?.DEV) {
    // eslint-disable-next-line no-console
    console.log('[Analytics]', action, { category, label, value, extra });
  }
}

/** 导出结果埋点 */
export function trackExport(
  style: string,
  strategy: 'html2canvas' | 'svg-image' | 'native-canvas' | 'simplified' | 'unknown',
  success: boolean,
  durationMs?: number,
  errorMessage?: string
): void {
  trackEvent({
    action: success ? 'poster_export_success' : 'poster_export_fail',
    category: 'Poster',
    label: style,
    value: durationMs,
    extra: {
      strategy,
      style,
      durationMs,
      errorMessage,
    },
  });
}

/** 风格切换埋点 */
export function trackStyleSwitch(
  fromStyle: string,
  toStyle: string,
  context: 'manual' | 'auto-recommendation'
): void {
  trackEvent({
    action: 'style_switch',
    category: 'Poster',
    label: `${fromStyle} → ${toStyle}`,
    extra: { fromStyle, toStyle, context },
  });
}

/** 分享行为埋点 */
export function trackShare(
  platform: string,
  style: string,
  guaName: string
): void {
  trackEvent({
    action: 'share',
    category: 'Social',
    label: platform,
    extra: { style, guaName },
  });
}

/** 卦象抽取埋点 */
export function trackHexagramDraw(
  hexagramName: string,
  score: number,
  source: 'daily' | 'manual' = 'daily'
): void {
  trackEvent({
    action: 'hexagram_draw',
    category: 'Hexagram',
    label: hexagramName,
    value: score,
    extra: { hexagramName, score, source },
  });
}

/** 每日运势页面浏览埋点 */
export function trackPageViewDaily(
  alreadyDrawn: boolean = false
): void {
  trackEvent({
    action: 'page_view_daily',
    category: 'PageView',
    label: alreadyDrawn ? 'returning' : 'fresh',
    extra: { alreadyDrawn, page: 'daily' },
  });
}
