/**
 * 批量图片压缩脚本
 * 将 dist/ 中的大体积 PNG/JPG 转换为 WebP
 * 保留原文件，生成 .webp 版本
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIST_DIR = path.resolve(__dirname, '../dist');
const MAX_SIZE_MB = 0.5; // 只转换 > 500KB 的图片
const QUALITY = 80; // WebP 质量

async function convertImages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let converted = 0;
  let savedBytes = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // 跳过 talisman-assets（源码素材，不部署）
      if (entry.name === 'talisman-assets') continue;
      const sub = await convertImages(fullPath);
      converted += sub.converted;
      savedBytes += sub.savedBytes;
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

    const stats = fs.statSync(fullPath);
    const sizeMB = stats.size / (1024 * 1024);

    if (sizeMB < MAX_SIZE_MB) continue;

    const webpPath = fullPath.replace(ext, '.webp');

    // 如果已经有 webp 且比原文件小，跳过
    if (fs.existsSync(webpPath)) {
      const webpStats = fs.statSync(webpPath);
      if (webpStats.size < stats.size * 0.8) {
        console.log(`  ⏭️  Skip (webp exists): ${path.relative(DIST_DIR, fullPath)}`);
        continue;
      }
    }

    try {
      await sharp(fullPath)
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(webpPath);

      const webpStats = fs.statSync(webpPath);
      const saved = stats.size - webpStats.size;
      const ratio = ((saved / stats.size) * 100).toFixed(1);

      console.log(`  ✅ ${path.relative(DIST_DIR, fullPath)}`);
      console.log(`     ${(stats.size / 1024).toFixed(0)}KB → ${(webpStats.size / 1024).toFixed(0)}KB (${ratio}% smaller)`);

      converted++;
      savedBytes += saved;
    } catch (err) {
      console.error(`  ❌ Failed: ${fullPath}`, err.message);
    }
  }

  return { converted, savedBytes };
}

(async () => {
  console.log('🖼️  Image Compression — PNG/JPG → WebP\n');
  const result = await convertImages(DIST_DIR);
  console.log(`\n📊 Done: ${result.converted} files converted`);
  console.log(`💾 Total saved: ${(result.savedBytes / 1024 / 1024).toFixed(2)} MB`);
})();
