/**
 * SVG Image Inliner
 *
 * 将 SVG 中引用的外部图片（<image href="...">）内联为 base64 data URI，
 * 确保 SVG 序列化/导出时图片不丢失。
 *
 * 用途：TalismanPoster 使用了素材库图片作为 SVG <image>，
 * 导出为 PNG 前必须先内联，否则外部 URL 在离屏渲染时失效。
 */

/**
 * 将单个图片 URL 转为 base64 data URI
 */
async function urlToBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * 内联 SVG 中所有 <image> 标签的外部 href
 *
 * @param svgEl 原始 SVG 元素（会被克隆，不会修改原元素）
 * @returns 内联后的 SVG 字符串
 */
export async function inlineSvgImages(svgEl: SVGSVGElement): Promise<string> {
  // 深克隆，避免修改原 DOM
  const clone = svgEl.cloneNode(true) as SVGSVGElement;

  const images = clone.querySelectorAll('image');
  const tasks: Promise<void>[] = [];

  images.forEach((img) => {
    const href =
      img.getAttribute('href') ||
      img.getAttributeNS('http://www.w3.org/1999/xlink', 'href');

    if (!href || href.startsWith('data:')) return;

    tasks.push(
      (async () => {
        const dataUri = await urlToBase64(href);
        if (dataUri) {
          img.setAttribute('href', dataUri);
          img.removeAttributeNS('http://www.w3.org/1999/xlink', 'href');
        }
      })()
    );
  });

  await Promise.all(tasks);
  return new XMLSerializer().serializeToString(clone);
}
