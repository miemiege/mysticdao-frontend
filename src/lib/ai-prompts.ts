export function getPollinationsUrl(
  hexagramName: string,
  blessingTheme: string,
  element: string,
  category: string,
  score: number,
  width: number = 360,
  height: number = 540
): string {
  const prompt = encodeURIComponent(
    `Taoist talisman, ${hexagramName}, ${blessingTheme}, ${element} element, ${category}, ` +
    `traditional Chinese calligraphy style, ink wash painting, golden seal stamp, ` +
    `mystical glow, dark background, fortune score ${score}, ethereal aesthetic, ` +
    `high detail, sacred geometry, no text, no watermark`
  );
  const seed = hexagramName.charCodeAt(0) + score;
  return `https://image.pollinations.ai/prompt/${prompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
}

export function getAICacheKey(hexagramName: string, score: number): string {
  return `mysticdao_ai_${hexagramName}_${score}`;
}
