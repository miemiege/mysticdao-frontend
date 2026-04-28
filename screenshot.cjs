const { chromium } = require('playwright');

const SAMPLES = [
  { name: '乾为天', file: 'sample_qian.png' },
  { name: '坤为地', file: 'sample_kun.png' },
  { name: '离为火', file: 'sample_li.png' },
  { name: '水天需', file: 'sample_kan.png' },
  { name: '雷地豫', file: 'sample_zhen.png' },
];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Clear cache and force reload
  await page.goto('http://localhost:5175/samples?_=' + Date.now(), { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const posters = await page.locator('div[style*="box-shadow"]').all();
  console.log(`Found ${posters.length} poster containers`);

  for (let i = 0; i < Math.min(SAMPLES.length, posters.length); i++) {
    const sample = SAMPLES[i];
    await posters[i].screenshot({ path: `/tmp/talisman_samples/${sample.file}`, type: 'png' });
    console.log(`Screenshot saved: ${sample.file}`);
  }

  await browser.close();
  console.log('All screenshots done.');
})();
