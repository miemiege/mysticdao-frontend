#!/usr/bin/env tsx
/**
 * MysticDAO Talisman Poster Renderer — v3 (符咒图主体)
 *
 * 以 reference/ 符咒图为全屏主体，叠加卦象信息。
 * 彻底抛弃白底框架和程序化装饰。
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public/talisman-posters-v3');
const ASSET_DIR = path.join(PROJECT_ROOT, 'public/talisman-assets/自己整理z素材库');

const W = 800;
const H = 1280;

// ─── 64卦数据 ───
const GUA64 = [
  { n: 1, name: '乾为天', nameEn: 'The Creative', el: '金', sym: '☰☰' },
  { n: 2, name: '坤为地', nameEn: 'The Receptive', el: '土', sym: '☷☷' },
  { n: 3, name: '水雷屯', nameEn: 'Difficulty at the Beginning', el: '水', sym: '☵☳' },
  { n: 4, name: '山水蒙', nameEn: 'Youthful Folly', el: '土', sym: '☶☵' },
  { n: 5, name: '水天需', nameEn: 'Waiting', el: '水', sym: '☵☰' },
  { n: 6, name: '天水讼', nameEn: 'Conflict', el: '金', sym: '☰☵' },
  { n: 7, name: '地水师', nameEn: 'The Army', el: '土', sym: '☷☵' },
  { n: 8, name: '水地比', nameEn: 'Holding Together', el: '水', sym: '☵☷' },
  { n: 9, name: '风天小畜', nameEn: 'The Taming Power of the Small', el: '木', sym: '☴☰' },
  { n: 10, name: '天泽履', nameEn: 'Treading', el: '金', sym: '☰☱' },
  { n: 11, name: '地天泰', nameEn: 'Peace', el: '土', sym: '☷☰' },
  { n: 12, name: '天地否', nameEn: 'Standstill', el: '金', sym: '☰☷' },
  { n: 13, name: '天火同人', nameEn: 'Fellowship with Men', el: '金', sym: '☰☲' },
  { n: 14, name: '火天大有', nameEn: 'Possession in Great Measure', el: '火', sym: '☲☰' },
  { n: 15, name: '地山谦', nameEn: 'Modesty', el: '土', sym: '☷☶' },
  { n: 16, name: '雷地豫', nameEn: 'Enthusiasm', el: '木', sym: '☳☷' },
  { n: 17, name: '泽雷随', nameEn: 'Following', el: '金', sym: '☱☳' },
  { n: 18, name: '山风蛊', nameEn: 'Work on the Decayed', el: '土', sym: '☶☴' },
  { n: 19, name: '地泽临', nameEn: 'Approach', el: '土', sym: '☷☱' },
  { n: 20, name: '风地观', nameEn: 'Contemplation', el: '木', sym: '☴☷' },
  { n: 21, name: '火雷噬嗑', nameEn: 'Biting Through', el: '火', sym: '☲☳' },
  { n: 22, name: '山火贲', nameEn: 'Grace', el: '土', sym: '☶☲' },
  { n: 23, name: '山地剥', nameEn: 'Splitting Apart', el: '土', sym: '☶☷' },
  { n: 24, name: '地雷复', nameEn: 'Return', el: '土', sym: '☷☳' },
  { n: 25, name: '天雷无妄', nameEn: 'Innocence', el: '金', sym: '☰☳' },
  { n: 26, name: '山天大畜', nameEn: 'The Taming Power of the Great', el: '土', sym: '☶☰' },
  { n: 27, name: '山雷颐', nameEn: 'The Corners of the Mouth', el: '土', sym: '☶☳' },
  { n: 28, name: '泽风大过', nameEn: 'Preponderance of the Great', el: '金', sym: '☱☴' },
  { n: 29, name: '坎为水', nameEn: 'The Abysmal', el: '水', sym: '☵☵' },
  { n: 30, name: '离为火', nameEn: 'The Clinging', el: '火', sym: '☲☲' },
  { n: 31, name: '泽山咸', nameEn: 'Influence', el: '金', sym: '☱☶' },
  { n: 32, name: '雷风恒', nameEn: 'Duration', el: '木', sym: '☳☴' },
  { n: 33, name: '天山遁', nameEn: 'Retreat', el: '金', sym: '☰☶' },
  { n: 34, name: '雷天大壮', nameEn: 'The Power of the Great', el: '木', sym: '☳☰' },
  { n: 35, name: '火地晋', nameEn: 'Progress', el: '火', sym: '☲☷' },
  { n: 36, name: '地火明夷', nameEn: 'Darkening of the Light', el: '土', sym: '☷☲' },
  { n: 37, name: '风火家人', nameEn: 'The Family', el: '木', sym: '☴☲' },
  { n: 38, name: '火泽睽', nameEn: 'Opposition', el: '火', sym: '☲☱' },
  { n: 39, name: '水山蹇', nameEn: 'Obstruction', el: '水', sym: '☵☶' },
  { n: 40, name: '雷水解', nameEn: 'Deliverance', el: '木', sym: '☳☵' },
  { n: 41, name: '山泽损', nameEn: 'Decrease', el: '土', sym: '☶☱' },
  { n: 42, name: '风雷益', nameEn: 'Increase', el: '木', sym: '☴☳' },
  { n: 43, name: '泽天夬', nameEn: 'Break-through', el: '金', sym: '☱☰' },
  { n: 44, name: '天风姤', nameEn: 'Coming to Meet', el: '金', sym: '☰☴' },
  { n: 45, name: '泽地萃', nameEn: 'Gathering Together', el: '金', sym: '☱☷' },
  { n: 46, name: '地风升', nameEn: 'Pushing Upward', el: '土', sym: '☷☴' },
  { n: 47, name: '泽水困', nameEn: 'Oppression', el: '金', sym: '☱☵' },
  { n: 48, name: '水风井', nameEn: 'The Well', el: '水', sym: '☵☴' },
  { n: 49, name: '泽火革', nameEn: 'Revolution', el: '金', sym: '☱☲' },
  { n: 50, name: '火风鼎', nameEn: 'The Cauldron', el: '火', sym: '☲☴' },
  { n: 51, name: '震为雷', nameEn: 'The Arousing', el: '木', sym: '☳☳' },
  { n: 52, name: '艮为山', nameEn: 'Keeping Still', el: '土', sym: '☶☶' },
  { n: 53, name: '风山渐', nameEn: 'Development', el: '木', sym: '☴☶' },
  { n: 54, name: '雷泽归妹', nameEn: 'The Marrying Maiden', el: '木', sym: '☳☱' },
  { n: 55, name: '雷火丰', nameEn: 'Abundance', el: '木', sym: '☳☲' },
  { n: 56, name: '火山旅', nameEn: 'The Wanderer', el: '火', sym: '☲☶' },
  { n: 57, name: '巽为风', nameEn: 'The Gentle', el: '木', sym: '☴☴' },
  { n: 58, name: '兑为泽', nameEn: 'The Joyous', el: '金', sym: '☱☱' },
  { n: 59, name: '风水涣', nameEn: 'Dispersion', el: '木', sym: '☴☵' },
  { n: 60, name: '水泽节', nameEn: 'Limitation', el: '水', sym: '☵☱' },
  { n: 61, name: '风泽中孚', nameEn: 'Inner Truth', el: '木', sym: '☴☱' },
  { n: 62, name: '雷山小过', nameEn: 'Preponderance of the Small', el: '木', sym: '☳☶' },
  { n: 63, name: '水火既济', nameEn: 'After Completion', el: '水', sym: '☵☲' },
  { n: 64, name: '火水未济', nameEn: 'Before Completion', el: '火', sym: '☲☵' },
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

const REFERENCES = getPool('reference');
const SEALS = getPool('seal');
const PATTERNS = getPool('pattern');

function fileToBase64(absPath: string): string | null {
  if (!fs.existsSync(absPath)) return null;
  const buf = fs.readFileSync(absPath);
  const ext = path.extname(absPath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

// ─── 标语 ───
function getTagline(gua: typeof GUA64[0]): string {
  const lines: Record<string, string[]> = {
    '金': ['剛健中正', '天行健', '自強不息'],
    '木': ['生生不息', '雷動風行', '順勢而為'],
    '水': ['上善若水', '知險而行', '深不可測'],
    '火': ['明照四方', '火炎上騰', '虛心實腹'],
    '土': ['厚德載物', '地勢坤', '安貞吉'],
  };
  const pool = lines[gua.el] || ['道法自然'];
  return pool[gua.n % pool.length];
}

// ─── HTML 构建 ───
function buildHtml(gua: typeof GUA64[0]): string {
  const seed = gua.n;

  // 选材
  const ref = REFERENCES[seed % REFERENCES.length];
  const seal1 = SEALS[seed % SEALS.length];
  const seal2 = SEALS[(seed + 11) % SEALS.length];
  const pat = PATTERNS[seed % PATTERNS.length];

  const refData = ref ? fileToBase64(ref) : null;
  const seal1Data = seal1 ? fileToBase64(seal1) : null;
  const seal2Data = seal2 ? fileToBase64(seal2) : null;
  const patData = pat ? fileToBase64(pat) : null;

  // 布局变体
  const layout = seed % 3; // 0=全幅符咒+底部文字, 1=符咒居中+环绕文字, 2=符咒背景+居中悬浮

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
    background: #1a0f0a;
    font-family: "Noto Serif SC", "SimSun", "STSong", serif;
  }
  .talisman-bg {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.95;
  }
  .pattern-overlay {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    background-size: 300px;
    background-repeat: repeat;
    opacity: 0.06;
    mix-blend-mode: overlay;
    pointer-events: none;
  }
  .seal {
    position: absolute;
    opacity: 0.88;
    filter: contrast(1.15) saturate(1.2);
    pointer-events: none;
  }
  .content-${layout} {
    position: absolute;
    text-align: center;
    color: #1a0a05;
  }
  .content-0 {
    bottom: 0; left: 0; width: 100%;
    padding: 50px 30px 35px;
    background: linear-gradient(to top, rgba(240,220,190,0.92) 0%, rgba(240,220,190,0.6) 50%, transparent 100%);
  }
  .content-1 {
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    padding: 35px 45px;
    background: rgba(240,220,190,0.85);
    border-radius: 3px;
    box-shadow: 0 6px 30px rgba(0,0,0,0.15);
    backdrop-filter: blur(3px);
  }
  .content-2 {
    bottom: 6%; right: 5%;
    padding: 25px 30px;
    background: rgba(240,220,190,0.88);
    border-radius: 2px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    text-align: right;
  }
  .gua-name {
    font-size: ${layout === 1 ? 38 : 30}px;
    font-weight: 800;
    letter-spacing: ${layout === 1 ? 10 : 8}px;
    margin-bottom: 6px;
    text-shadow: 0 1px 3px rgba(240,220,190,0.8);
  }
  .gua-en {
    font-size: ${layout === 1 ? 14 : 12}px;
    font-style: italic;
    opacity: 0.7;
    margin-bottom: 10px;
    letter-spacing: 1px;
  }
  .yao-lines {
    font-size: ${layout === 1 ? 32 : 26}px;
    letter-spacing: 6px;
    margin-bottom: 8px;
    opacity: 0.75;
    font-weight: 600;
  }
  .tagline {
    font-size: ${layout === 1 ? 15 : 13}px;
    color: #8b1a1a;
    font-weight: 700;
    letter-spacing: 3px;
  }
  .element-mark {
    position: absolute;
    top: 3%; right: 4%;
    writing-mode: vertical-rl;
    font-size: 14px;
    color: #1a0a05;
    opacity: 0.35;
    letter-spacing: 6px;
    font-weight: 600;
  }
</style>
</head>
<body>
  ${refData ? `<img class="talisman-bg" src="${refData}">` : ''}
  ${patData ? `<div class="pattern-overlay" style="background-image: url('${patData}');"></div>` : ''}

  ${seal1Data ? `<img class="seal" src="${seal1Data}" style="top: 4%; left: 4%; width: 65px; height: 65px;">` : ''}
  ${seal2Data ? `<img class="seal" src="${seal2Data}" style="bottom: 18%; right: 5%; width: 55px; height: 55px;">` : ''}

  <div class="element-mark">${gua.el}行</div>

  <div class="content-${layout}">
    <div class="yao-lines">${gua.sym}</div>
    <div class="gua-name">${gua.name}</div>
    <div class="gua-en">${gua.nameEn}</div>
    <div class="tagline">${getTagline(gua)}</div>
  </div>
</body>
</html>`;
}

// ─── 主流程 ───
async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('🎴 Talisman Poster Renderer v3 (符咒图主体)');
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`🖼️  Reference: ${REFERENCES.length} | Seal: ${SEALS.length} | Pattern: ${PATTERNS.length}`);

  console.log('🚀 Launching Chromium...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage({
    viewport: { width: W, height: H },
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
      const html = buildHtml(gua);
      await page.setContent(html, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(600);

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
