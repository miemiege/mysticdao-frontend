/**
 * MysticDAO Talisman Poster Batch Renderer
 *
 * 用 Playwright 批量渲染 64 张符咒海报 SVG → PNG
 *
 * 运行方式:
 *   npx tsx scripts/batch-render/render.ts
 *
 * 输出目录:
 *   public/talisman-posters/{gua_name}.png
 */

import { chromium, type Browser, type Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GUA64_DATA } from './gua-data';
import { buildTalismanHtml } from './build-html';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public/talisman-posters');

// ─── Poster dimensions ───
const POSTER_WIDTH = 400;
const POSTER_HEIGHT = 640;

async function renderPoster(page: Page, guaName: string, html: string, outputPath: string): Promise<void> {
  await page.setContent(html, { waitUntil: 'networkidle' });

  // Give SVG filters a moment to settle
  await page.waitForTimeout(300);

  await page.screenshot({
    path: outputPath,
    type: 'png',
    clip: { x: 0, y: 0, width: POSTER_WIDTH, height: POSTER_HEIGHT },
  });
}

async function main() {
  console.log('🎴 MysticDAO Talisman Batch Renderer');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('✅ Created output directory');
  }

  // Launch browser
  console.log('🚀 Launching Chromium...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage({
    viewport: { width: POSTER_WIDTH, height: POSTER_HEIGHT },
    deviceScaleFactor: 2, // Retina quality
  });

  const total = GUA64_DATA.length;
  let success = 0;
  let failed = 0;

  console.log(`🎯 Rendering ${total} talisman posters...\n`);

  const startTime = Date.now();

  for (let i = 0; i < total; i++) {
    const gua = GUA64_DATA[i];
    const safeName = gua.name.replace(/[\/\\:*?"<>|]/g, '_');
    const outputPath = path.join(OUTPUT_DIR, `${safeName}.png`);

    // Skip if already exists (allows resume)
    if (fs.existsSync(outputPath)) {
      console.log(`  ⏭️  [${i + 1}/${total}] ${gua.name} — already exists`);
      success++;
      continue;
    }

    try {
      const html = buildTalismanHtml(gua);
      await renderPoster(page, gua.name, html, outputPath);

      const stats = fs.statSync(outputPath);
      const sizeKb = (stats.size / 1024).toFixed(1);
      console.log(`  ✅ [${i + 1}/${total}] ${gua.name} — ${sizeKb} KB`);
      success++;
    } catch (err) {
      console.error(`  ❌ [${i + 1}/${total}] ${gua.name} — FAILED`);
      console.error(`     ${err instanceof Error ? err.message : String(err)}`);
      failed++;
    }
  }

  await browser.close();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 Done! ${success} succeeded, ${failed} failed (${elapsed}s)`);
  console.log(`📂 Output: ${OUTPUT_DIR}`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
