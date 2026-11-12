/**
 * Exporta o estudo de lockup E9 + 3D.
 * Uso: node marketing/identidade/export.js
 *
 * Seis caminhos + um quadro de redução, para escolher um antes de aplicar
 * na cartela. Depois da escolha, as variantes descartadas saem do HTML.
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const DIR = __dirname;
const OUT = path.join(DIR, 'png');
const PECAS = ['a', 'b', 'c', 'd', 'e', 'f', 'reducao'];

const url = 'file:///' + path.join(DIR, 'e9-3d.html').split(path.sep).join('/');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const pagina = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1 });
  await pagina.goto(url);
  await pagina.waitForLoadState('networkidle');
  await pagina.waitForTimeout(500);

  for (const id of PECAS) {
    const el = await pagina.$('#' + id);
    if (!el) throw new Error('quadro sem elemento: #' + id);
    const arquivo = path.join(OUT, `e9-3d-${id}.png`);
    await el.screenshot({ path: arquivo });
    console.log('ok  ' + path.basename(arquivo));
  }
  await browser.close();
})();
