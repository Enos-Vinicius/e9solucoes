/**
 * Gera previews leves (540x675 JPEG) para revisão/compartilhamento.
 * Os PNG 1080x1350 em png/ seguem sendo os arquivos de publicação.
 * Uso: node marketing/instagram/export-preview.js
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const DIR = __dirname;
const OUT = path.join(DIR, 'preview');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 1450 },
    deviceScaleFactor: 0.5,
  });

  await page.goto('file:///' + path.join(DIR, 'posts.html').replace(/\\/g, '/'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);

  const ids = await page.$$eval('.post', (els) => els.map((e) => e.id));

  for (const id of ids) {
    const el = await page.$('#' + id);
    const file = path.join(OUT, `${id}.jpg`);
    await el.screenshot({ path: file, type: 'jpeg', quality: 82 });
    console.log('ok  ' + path.basename(file));
  }

  await browser.close();
})();
