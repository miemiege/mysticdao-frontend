#!/usr/bin/env tsx
/**
 * MysticDAO Material-First Poster Renderer
 *
 * 素材主导型海报：纹理为底 + 书法为主体 + 印章点缀 + 文字叠加
 * 彻底抛弃白底大框架和程序化装饰。
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public/talisman-posters-material');
const ASSET_DIR = path.join(PROJECT_ROOT, 'public/talisman-assets/自己整理z素材库');

// ─── 64卦基础数据（精简版）───
const GUA64 = [
  { n: 1, name: '乾为天', nameEn: 'The Creative', upper: '乾', lower: '乾', symbol: '☰☰', el: '金' },
  { n: 2, name: '坤为地', nameEn: 'The Receptive', upper: '坤', lower: '坤', symbol: '☷☷', el: '土' },
  { n: 3, name: '水雷屯', nameEn: 'Difficulty at the Beginning', upper: '坎', lower: '震', symbol: '☵☳', el: '水' },
  { n: 4, name: '山水蒙', nameEn: 'Youthful Folly', upper: '艮', lower: '坎', symbol: '☶☵', el: '土' },
  { n: 5, name: '水天需', nameEn: 'Waiting', upper: '坎', lower: '乾', symbol: '☵☰', el: '水' },
  { n: 6, name: '天水讼', nameEn: 'Conflict', upper: '乾', lower: '坎', symbol: '☰☵', el: '金' },
  { n: 7, name: '地水师', nameEn: 'The Army', upper: '坤', lower: '坎', symbol: '☷☵', el: '土' },
  { n: 8, name: '水地比', nameEn: 'Holding Together', upper: '坎', lower: '坤', symbol: '☵☷', el: '水' },
  { n: 9, name: '风天小畜', nameEn: 'The Taming Power of the Small', upper: '巽', lower: '乾', symbol: '☴☰', el: '木' },
  { n: 10, name: '天泽履', nameEn: 'Treading', upper: '乾', lower: '兑', symbol: '☰☱', el: '金' },
  { n: 11, name: '地天泰', nameEn: 'Peace', upper: '坤', lower: '乾', symbol: '☷☰', el: '土' },
  { n: 12, name: '天地否', nameEn: 'Standstill', upper: '乾', lower: '坤', symbol: '☰☷', el: '金' },
  { n: 13, name: '天火同人', nameEn: 'Fellowship with Men', upper: '乾', lower: '离', symbol: '☰☲', el: '金' },
  { n: 14, name: '火天大有', nameEn: 'Possession in Great Measure', upper: '离', lower: '乾', symbol: '☲☰', el: '火' },
  { n: 15, name: '地山谦', nameEn: 'Modesty', upper: '坤', lower: '艮', symbol: '☷☶', el: '土' },
  { n: 16, name: '雷地豫', nameEn: 'Enthusiasm', upper: '震', lower: '坤', symbol: '☳☷', el: '木' },
  { n: 17, name: '泽雷随', nameEn: 'Following', upper: '兑', lower: '震', symbol: '☱☳', el: '金' },
  { n: 18, name: '山风蛊', nameEn: 'Work on the Decayed', upper: '艮', lower: '巽', symbol: '☶☴', el: '土' },
  { n: 19, name: '地泽临', nameEn: 'Approach', upper: '坤', lower: '兑', symbol: '☷☱', el: '土' },
  { n: 20, name: '风地观', nameEn: 'Contemplation', upper: '巽', lower: '坤', symbol: '☴☷', el: '木' },
  { n: 21, name: '火雷噬嗑', nameEn: 'Biting Through', upper: '离', lower: '震', symbol: '☲☳', el: '火' },
  { n: 22, name: '山火贲', nameEn: 'Grace', upper: '艮', lower: '离', symbol: '☶☲', el: '土' },
  { n: 23, name: '山地剥', nameEn: 'Splitting Apart', upper: '艮', lower: '坤', symbol: '☶☷', el: '土' },
  { n: 24, name: '地雷复', nameEn: 'Return', upper: '坤', lower: '震', symbol: '☷☳', el: '土' },
  { n: 25, name: '天雷无妄', nameEn: 'Innocence', upper: '乾', lower: '震', symbol: '☰☳', el: '金' },
  { n: 26, name: '山天大畜', nameEn: 'The Taming Power of the Great', upper: '艮', lower: '乾', symbol: '☶☰', el: '土' },
  { n: 27, name: '山雷颐', nameEn: 'The Corners of the Mouth', upper: '艮', lower: '震', symbol: '☶☳', el: '土' },
  { n: 28, name: '泽风大过', nameEn: 'Preponderance of the Great', upper: '兑', lower: '巽', symbol: '☱☴', el: '金' },
  { n: 29, name: '坎为水', nameEn: 'The Abysmal', upper: '坎', lower: '坎', symbol: '☵☵', el: '水' },
  { n: 30, name: '离为火', nameEn: 'The Clinging', upper: '离', lower: '离', symbol: '☲☲', el: '火' },
  { n: 31, name: '泽山咸', nameEn: 'Influence', upper: '兑', lower: '艮', symbol: '☱☶', el: '金' },
  { n: 32, name: '雷风恒', nameEn: 'Duration', upper: '震', lower: '巽', symbol: '☳☴', el: '木' },
  { n: 33, name: '天山遁', nameEn: 'Retreat', upper: '乾', lower: '艮', symbol: '☰☶', el: '金' },
  { n: 34, name: '雷天大壮', nameEn: 'The Power of the Great', upper: '震', lower: '乾', symbol: '☳☰', el: '木' },
  { n: 35, name: '火地晋', nameEn: 'Progress', upper: '离', lower: '坤', symbol: '☲☷', el: '火' },
  { n: 36, name: '地火明夷', nameEn: 'Darkening of the Light', upper: '坤', lower: '离', symbol: '☷☲', el: '土' },
  { n: 37, name: '风火家人', nameEn: 'The Family', upper: '巽', lower: '离', symbol: '☴☲', el: '木' },
  { n: 38, name: '火泽睽', nameEn: 'Opposition', upper: '离', lower: '兑', symbol: '☲☱', el: '火' },
  { n: 39, name: '水山蹇', nameEn: 'Obstruction', upper: '坎', lower: '艮', symbol: '☵☶', el: '水' },
  { n: 40, name: '雷水解', nameEn: 'Deliverance', upper: '震', lower: '坎', symbol: '☳☵', el: '木' },
  { n: 41, name: '山泽损', nameEn: 'Decrease', upper: '艮', lower: '兑', symbol: '☶☱', el: '土' },
  { n: 42, name: '风雷益', nameEn: 'Increase', upper: '巽', lower: '震', symbol: '☴☳', el: '木' },
  { n: 43, name: '泽天夬', nameEn: 'Break-through', upper: '兑', lower: '乾', symbol: '☱☰', el: '金' },
  { n: 44, name: '天风姤', nameEn: 'Coming to Meet', upper: '乾', lower: '巽', symbol: '☰☴', el: '金' },
  { n: 45, name: '泽地萃', nameEn: 'Gathering Together', upper: '兑', lower: '坤', symbol: '☱☷', el: '金' },
  { n: 46, name: '地风升', nameEn: 'Pushing Upward', upper: '坤', lower: '巽', symbol: '☷☴', el: '土' },
  { n: 47, name: '泽水困', nameEn: 'Oppression', upper: '兑', lower: '坎', symbol: '☱☵', el: '金' },
  { n: 48, name: '水风井', nameEn: 'The Well', upper: '坎', lower: '巽', symbol: '☵☴', el: '水' },
  { n: 49, name: '泽火革', nameEn: 'Revolution', upper: '兑', lower: '离', symbol: '☱☲', el: '金' },
  { n: 50, name: '火风鼎', nameEn: 'The Cauldron', upper: '离', lower: '巽', symbol: '☲☴', el: '火' },
  { n: 51, name: '震为雷', nameEn: 'The Arousing', upper: '震', lower: '震', symbol: '☳☳', el: '木' },
  { n: 52, name: '艮为山', nameEn: 'Keeping Still', upper: '艮', lower: '艮', symbol: '☶☶', el: '土' },
  { n: 53, name: '风山渐', nameEn: 'Development', upper: '巽', lower: '艮', symbol: '☴☶', el: '木' },
  { n: 54, name: '雷泽归妹', nameEn: 'The Marrying Maiden', upper: '震', lower: '兑', symbol: '☳☱', el: '木' },
  { n: 55, name: '雷火丰', nameEn: 'Abundance', upper: '震', lower: '离', symbol: '☳☲', el: '木' },
  { n: 56, name: '火山旅', nameEn: 'The Wanderer', upper: '离', lower: '艮', symbol: '☲☶', el: '火' },
  { n: 57, name: '巽为风', nameEn: 'The Gentle', upper: '巽', lower: '巽', symbol: '☴☴', el: '木' },
  { n: 58, name: '兑为泽', nameEn: 'The Joyous', upper: '兑', lower: '兑', symbol: '☱☱', el: '金' },
  { n: 59, name: '风水涣', nameEn: 'Dispersion', upper: '巽', lower: '坎', symbol: '☴☵', el: '木' },
  { n: 60, name: '水泽节', nameEn: 'Limitation', upper: '坎', lower: '兑', symbol: '☵☱', el: '水' },
  { n: 61, name: '风泽中孚', nameEn: 'Inner Truth', upper: '巽', lower: '兑', symbol: '☴☱', el: '木' },
  { n: 62, name: '雷山小过', nameEn: 'Preponderance of the Small', upper: '震', lower: '艮', symbol: '☳☶', el: '木' },
  { n: 63, name: '水火既济', nameEn: 'After Completion', upper: '坎', lower: '离', symbol: '☵☲', el: '水' },
  { n: 64, name: '火水未济', nameEn: 'Before Completion', upper: '离', lower: '坎', symbol: '☲☵', el: '火' },
];

// ─── 素材池 ───
function getPool(dirName: string): string[] {
  const dir = path.join(ASSET_DIR, dirName);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort()
    .map(f => path.join(dir, f));
}

const TEXTURES = getPool('texture');
const CALLIGRAPHIES = getPool('calligraphy');
const SEALS = getPool('seal');
const PATTERNS = getPool('pattern');

function fileToBase64(absPath: string): string | null {
  if (!fs.existsSync(absPath)) return null;
  const buf = fs.readFileSync(absPath);
  const ext = path.extname(absPath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

// ─── 海报 HTML 构建 ───
function buildPosterHtml(gua: typeof GUA64[0]): string {
  const seed = gua.n;
  const W = 800;
  const H = 1280;

  // 确定性选材
  const tex = TEXTURES[seed % TEXTURES.length];
  const cal = CALLIGRAPHIES[seed % CALLIGRAPHIES.length];
  const seal1 = SEALS[seed % SEALS.length];
  const seal2 = SEALS[(seed + 7) % SEALS.length];
  const pat = PATTERNS[seed % PATTERNS.length];

  const texData = tex ? fileToBase64(tex) : null;
  const calData = cal ? fileToBase64(cal) : null;
  const seal1Data = seal1 ? fileToBase64(seal1) : null;
  const seal2Data = seal2 ? fileToBase64(seal2) : null;
  const patData = pat ? fileToBase64(pat) : null;

  // 布局：3种变体按 seed 轮换
  const layoutMode = seed % 3;

  let calligraphyStyle = '';
  let contentOverlay = '';

  if (layoutMode === 0) {
    // 模式A：书法居中大幅，文字在底部遮罩上
    calligraphyStyle = `
      position: absolute;
      top: 8%; left: 50%; transform: translateX(-50%);
      width: 88%; height: 62%;
      object-fit: contain;
      opacity: 0.92;
      filter: contrast(1.05) saturate(0.95);
    `;
    contentOverlay = `
      position: absolute; bottom: 0; left: 0; width: 100%;
      padding: 60px 30px 40px;
      background: linear-gradient(to top, rgba(240,232,216,0.95) 0%, rgba(240,232,216,0.7) 40%, transparent 100%);
      text-align: center;
    `;
  } else if (layoutMode === 1) {
    // 模式B：书法偏左上，文字在右下
    calligraphyStyle = `
      position: absolute;
      top: 6%; left: 5%;
      width: 75%; height: 58%;
      object-fit: contain;
      opacity: 0.9;
      filter: contrast(1.08);
    `;
    contentOverlay = `
      position: absolute; bottom: 5%; right: 5%; width: 55%;
      padding: 30px 20px;
      background: rgba(240,232,216,0.88);
      border-radius: 4px;
      text-align: right;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    `;
  } else {
    // 模式C：书法全幅背景感，文字居中悬浮
    calligraphyStyle = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      opacity: 0.35;
      filter: contrast(0.9) brightness(1.1);
    `;
    contentOverlay = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      padding: 40px 50px;
      background: rgba(249,244,237,0.82);
      border-radius: 2px;
      text-align: center;
      box-shadow: 0 8px 40px rgba(0,0,0,0.1);
      backdrop-filter: blur(2px);
    `;
  }

  // 印章位置
  const sealPositions = [
    { top: '4%', right: '6%', w: 70, h: 70 },
    { top: '4%', left: '6%', w: 60, h: 60 },
    { bottom: '22%', left: '7%', w: 65, h: 65 },
    { bottom: '8%', right: '8%', w: 55, h: 55 },
  ];

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px;
    position: relative;
    overflow: hidden;
    background: #F0E8D8;
    font-family: "Noto Serif SC", "SimSun", serif;
  }
  .texture-bg {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0.75;
    mix-blend-mode: multiply;
  }
  .pattern-overlay {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0.08;
    mix-blend-mode: overlay;
    pointer-events: none;
  }
  .calligraphy {
    ${calligraphyStyle}
  }
  .seal {
    position: absolute;
    opacity: 0.92;
    filter: contrast(1.1);
    pointer-events: none;
  }
  .content {
    ${contentOverlay}
  }
  .gua-symbol {
    font-size: 42px;
    color: #1A1A1A;
    margin-bottom: 8px;
    opacity: 0.85;
    letter-spacing: 8px;
  }
  .gua-name {
    font-size: 32px;
    font-weight: 700;
    color: #1A1A1A;
    margin-bottom: 4px;
    letter-spacing: 6px;
  }
  .gua-en {
    font-size: 15px;
    color: #5A4A3A;
    font-style: italic;
    margin-bottom: 16px;
    letter-spacing: 1px;
  }
  .yao-lines {
    font-size: 28px;
    color: #1A1A1A;
    margin-bottom: 12px;
    letter-spacing: 4px;
    opacity: 0.7;
  }
  .tagline {
    font-size: 13px;
    color: #8B1A1A;
    letter-spacing: 2px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .element-tag {
    position: absolute;
    top: 3.5%; right: ${layoutMode === 1 ? '6%' : '22%'};
    font-size: 12px;
    color: #1A1A1A;
    opacity: 0.25;
    letter-spacing: 4px;
    writing-mode: vertical-rl;
  }
</style>
</head>
<body>
  ${texData ? `<div class="texture-bg" style="background-image: url('${texData}');"></div>` : ''}
  ${patData ? `<div class="pattern-overlay" style="background-image: url('${patData}');"></div>` : ''}
  ${calData ? `<img class="calligraphy" src="${calData}">` : ''}
  ${seal1Data ? `<img class="seal" src="${seal1Data}" style="${sealPositions[seed % 4].top ? `top:${sealPositions[seed % 4].top};` : ''}${sealPositions[seed % 4].bottom ? `bottom:${sealPositions[seed % 4].bottom};` : ''}${sealPositions[seed % 4].left ? `left:${sealPositions[seed % 4].left};` : ''}${sealPositions[seed % 4].right ? `right:${sealPositions[seed % 4].right};` : ''}width:${sealPositions[seed % 4].w}px;height:${sealPositions[seed % 4].h}px;">` : ''}
  ${seal2Data ? `<img class="seal" src="${seal2Data}" style="${sealPositions[(seed + 2) % 4].top ? `top:${sealPositions[(seed + 2) % 4].top};` : ''}${sealPositions[(seed + 2) % 4].bottom ? `bottom:${sealPositions[(seed + 2) % 4].bottom};` : ''}${sealPositions[(seed + 2) % 4].left ? `left:${sealPositions[(seed + 2) % 4].left};` : ''}${sealPositions[(seed + 2) % 4].right ? `right:${sealPositions[(seed + 2) % 4].right};` : ''}width:${sealPositions[(seed + 2) % 4].w}px;height:${sealPositions[(seed + 2) % 4].h}px;">` : ''}

  <div class="element-tag">${gua.el}</div>

  <div class="content">
    <div class="gua-symbol">${gua.symbol}</div>
    <div class="gua-name">${gua.name}</div>
    <div class="gua-en">${gua.nameEn}</div>
    <div class="yao-lines">${gua.symbol}</div>
    <div class="tagline">${getTagline(gua)}</div>
  </div>
</body>
</html>`;
}

// 简易标语生成
function getTagline(gua: typeof GUA64[0]): string {
  const lines: Record<string, string[]> = {
    '金': ['剛健中正', '天行健', '自強不息', '厚德載物'],
    '木': ['生生不息', '雷動風行', '順勢而為', '潤物無聲'],
    '水': ['上善若水', '知險而行', '深不可測', '涵養萬物'],
    '火': ['明照四方', '火炎上騰', '虛心實腹', '繼明照遠'],
    '土': ['厚德載物', '地勢坤', '安貞吉', '含章可貞'],
  };
  const pool = lines[gua.el] || ['道法自然'];
  return pool[gua.n % pool.length];
}

// ─── 主流程 ───
async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('🎴 Material-First Poster Renderer');
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`🖼️  Texture: ${TEXTURES.length} | Calligraphy: ${CALLIGRAPHIES.length} | Seal: ${SEALS.length} | Pattern: ${PATTERNS.length}`);

  console.log('🚀 Launching Chromium...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage({
    viewport: { width: 800, height: 1280 },
    deviceScaleFactor: 1,
  });

  const total = GUA64.length;
  let success = 0;
  let failed = 0;
  const startTime = Date.now();

  for (let i = 0; i < total; i++) {
    const gua = GUA64[i];
    const outputPath = path.join(OUTPUT_DIR, `${gua.name}.png`);

    if (fs.existsSync(outputPath)) {
      console.log(`  ⏭️  [${i + 1}/${total}] ${gua.name}`);
      success++;
      continue;
    }

    try {
      const html = buildPosterHtml(gua);
      await page.setContent(html, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(500);

      await page.screenshot({
        path: outputPath,
        type: 'png',
        animations: 'disabled',
      });

      const stats = fs.statSync(outputPath);
      const sizeKb = (stats.size / 1024).toFixed(1);
      console.log(`  ✅ [${i + 1}/${total}] ${gua.name} — ${sizeKb} KB`);
      success++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ [${i + 1}/${total}] ${gua.name} — ${msg}`);
      failed++;
    }
  }

  await browser.close();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 Done! ${success}/${total} (${elapsed}s)`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('💥 Fatal:', err);
  process.exit(1);
});
