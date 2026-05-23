#!/usr/bin/env tsx
/**
 * MysticDAO Talisman Poster Batch Renderer — v2 (Real Component)
 *
 * 用 Playwright 直接渲染 TalismanPoster 组件，批量截取 64 卦海报为 PNG。
 *
 * 运行方式:
 *   npx tsx scripts/batch-render/render.ts
 *
 * 输出目录:
 *   public/talisman-posters-v2/{gua_name}.png
 */

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GUA64_LIST } from '../../src/data/gua64';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public/talisman-posters-v2');

const PORT = 3456;
const BASE_URL = `http://localhost:${PORT}`;
const RENDER_URL = (name: string) =>
  `${BASE_URL}/render/${encodeURIComponent(name)}?w=400&h=640`;

const POSTER_W = 400;
const POSTER_H = 640;

/** 等待服务器就绪 */
async function waitForServer(url: string, timeout = 60000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // 继续等待
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not start within ${timeout}ms`);
}

/** 启动 vite dev server */
function startDevServer(): Promise<{ kill: () => void }> {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['vite', '--port', String(PORT)], {
      cwd: PROJECT_ROOT,
      stdio: 'pipe',
    });

    proc.on('error', reject);

    const onData = (data: Buffer) => {
      const text = data.toString();
      if (text.includes('Local:') || text.includes('ready') || text.includes('http://')) {
        proc.stdout.off('data', onData);
        proc.stderr.off('data', onData);
        resolve({ kill: () => { try { proc.kill('SIGTERM'); } catch {} } });
      }
    };
    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);

    // 兜底超时
    setTimeout(() => {
      resolve({ kill: () => { try { proc.kill('SIGTERM'); } catch {} } });
    }, 15000);
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('🚀 启动 vite dev server...');
  const server = await startDevServer();

  try {
    console.log('⏳ 等待服务器就绪...');
    await waitForServer(BASE_URL);

    console.log('🎭 启动 Chromium...');
    const browser = await chromium.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage({
      viewport: { width: POSTER_W, height: POSTER_H },
      deviceScaleFactor: 2, // Retina 清晰度
    });

    const total = GUA64_LIST.length;
    let success = 0;
    let failed = 0;
    const startTime = Date.now();

    for (let i = 0; i < total; i++) {
      const gua = GUA64_LIST[i];
      const outputPath = path.join(OUTPUT_DIR, `${gua.name}.png`);

      // 断点续传
      if (fs.existsSync(outputPath)) {
        console.log(`  ⏭️  [${i + 1}/${total}] ${gua.name} — already exists`);
        success++;
        continue;
      }

      try {
        await page.goto(RENDER_URL(gua.name), {
          waitUntil: 'networkidle',
          timeout: 30000,
        });

        // 确保素材图片加载完成
        await page.waitForTimeout(800);

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
    console.log(`\n🎉 Done! ${success} succeeded, ${failed} failed (${elapsed}s)`);
    console.log(`📂 Output: ${OUTPUT_DIR}`);

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    console.log('🛑 关闭 dev server...');
    server.kill();
  }
}

main().catch((err) => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
