/**
 * Exporta cada .post de posts.html como PNG 1080x1350 (4:5) pronto para o Instagram.
 * Uso: node marketing/instagram/export.js
 * Requer: npx playwright (usa o Chrome instalado, channel: 'chrome')
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const DIR = __dirname;
const OUT = path.join(DIR, 'png');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 1450 },
    deviceScaleFactor: 1,
  });

  await page.goto('file:///' + path.join(DIR, 'posts.html').replace(/\\/g, '/'));
  // aguarda Geist/Geist Mono do Google Fonts assentarem antes do disparo
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);

  const ids = await page.$$eval('.post', (els) => els.map((e) => e.id));

  for (const id of ids) {
    const el = await page.$('#' + id);
    const file = path.join(OUT, `e9-${id.replace('p', 'post-')}.png`);
    await el.screenshot({ path: file });
    console.log('ok  ' + path.basename(file));
  }

  await browser.close();
  console.log(`\n${ids.length} imagens em ${OUT}`);
})();
