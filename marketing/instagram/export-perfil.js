/**
 * Exporta as variantes de foto de perfil de perfil.html como PNG 1080x1080.
 * Uso: node marketing/instagram/export-perfil.js
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const DIR = __dirname;
const OUT = path.join(DIR, 'png');
const NOMES = { a: 'marca-carbon', b: 'platina-marca', c: 'gradiente' };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 1200 },
    deviceScaleFactor: 1,
  });

  await page.goto('file:///' + path.join(DIR, 'perfil.html').replace(/\\/g, '/'));
  await page.waitForTimeout(400);

  for (const [id, nome] of Object.entries(NOMES)) {
    const el = await page.$('#' + id);
    const file = path.join(OUT, `e9-perfil-${nome}.png`);
    await el.screenshot({ path: file });
    console.log('ok  ' + path.basename(file));
  }

  // previews leves para o board de revisão
  const PREV = path.join(DIR, 'preview');
  fs.mkdirSync(PREV, { recursive: true });
  await page.setViewportSize({ width: 1200, height: 1200 });
  const small = await browser.newContext({ deviceScaleFactor: 0.3 });
  const p2 = await small.newPage();
  await p2.goto('file:///' + path.join(DIR, 'perfil.html').replace(/\\/g, '/'));
  await p2.waitForTimeout(400);
  for (const [id, nome] of Object.entries(NOMES)) {
    const el = await p2.$('#' + id);
    await el.screenshot({
      path: path.join(PREV, `perfil-${nome}.jpg`),
      type: 'jpeg',
      quality: 88,
    });
  }
  await small.close();

  await browser.close();
})();
