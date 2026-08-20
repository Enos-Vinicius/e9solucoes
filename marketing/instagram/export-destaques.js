/**
 * Exporta as capas de destaque (highlights) de destaques.html como PNG 1080x1920.
 * Uso: node marketing/instagram/export-destaques.js
 *
 * Uma capa por categoria, na ordem das 9 frentes + 3 institucionais.
 * O Instagram recorta em círculo no centro, e a arte é simétrica em
 * torno dele — não precisa reposicionar nada no app.
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const DIR = __dirname;
const OUT = path.join(DIR, 'png');
const PREV = path.join(DIR, 'preview');

/** id no HTML → sufixo do arquivo. A ordem é a das frentes no site. */
const CAPAS = [
  'software',
  'impressao-3d',
  'ia',
  'suporte',
  'marketing',
  'branding',
  'consultoria',
  'info-produto',
  'automacao',
  'a-e9',
  'orcamento',
  'catalogo',
];

const url = 'file:///' + path.join(DIR, 'destaques.html').split(path.sep).join('/');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(PREV, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 2000 },
    deviceScaleFactor: 1,
  });
  await page.goto(url);
  await page.waitForTimeout(400);

  for (const id of CAPAS) {
    const el = await page.$('#' + id);
    if (!el) throw new Error('capa sem elemento no HTML: #' + id);
    const file = path.join(OUT, `e9-destaque-${id}.png`);
    await el.screenshot({ path: file });
    console.log('ok  ' + path.basename(file));
  }

  // previews leves para o board de revisão
  const small = await browser.newContext({ deviceScaleFactor: 0.2 });
  const p2 = await small.newPage();
  await p2.goto(url);
  await p2.waitForTimeout(400);
  for (const id of CAPAS) {
    const el = await p2.$('#' + id);
    await el.screenshot({
      path: path.join(PREV, `destaque-${id}.jpg`),
      type: 'jpeg',
      quality: 88,
    });
  }
  await small.close();

  await browser.close();
})();
