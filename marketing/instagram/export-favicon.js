/**
 * Gera os favicons circulares da E9 a partir de favicon.html.
 * Uso: node marketing/instagram/export-favicon.js
 *
 * A arte é renderizada uma vez a 1024px e reamostrada por etapas
 * (halving sucessivo em canvas) — reduzir direto de 1024 para 16
 * borra a marca; rasterizar a 16px direto serrilha.
 *
 * Saída em public/: favicon-e9-{512,192,48,32,16}.png + favicon-e9.ico
 * (o .svg é escrito à mão em public/favicon-e9.svg — não sai daqui.)
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const DIR = __dirname;
const OUT = path.resolve(DIR, '..', '..', 'public');
const BASE = 1024;
const SIZES = [512, 192, 48, 32, 16];
const ICO_SIZES = [48, 32, 16];

/** Empacota PNGs em um .ico (PNG embutido — ok em todo browser atual). */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);              // reservado
  header.writeUInt16LE(1, 2);              // tipo: ícone
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = header.length + dir.length;

  entries.forEach(({ size, data }, i) => {
    const at = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, at + 0);  // largura
    dir.writeUInt8(size >= 256 ? 0 : size, at + 1);  // altura
    dir.writeUInt8(0, at + 2);                       // paleta
    dir.writeUInt8(0, at + 3);                       // reservado
    dir.writeUInt16LE(1, at + 4);                    // planos
    dir.writeUInt16LE(32, at + 6);                   // bits por pixel
    dir.writeUInt32LE(data.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({
    viewport: { width: BASE, height: BASE },
    deviceScaleFactor: 1,
  });

  await page.goto('file:///' + path.join(DIR, 'favicon.html').split(path.sep).join('/'));
  await page.waitForTimeout(300);

  const master = await page.locator('#icon').screenshot({ omitBackground: true });

  const resized = await page.evaluate(
    async ({ b64, sizes }) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      await img.decode();

      const draw = (src, w) => {
        const c = document.createElement('canvas');
        c.width = c.height = w;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(src, 0, 0, w, w);
        return c;
      };

      const out = {};
      for (const size of sizes) {
        let cur = img;
        let w = img.width;
        while (w / 2 > size) { w = Math.round(w / 2); cur = draw(cur, w); }
        out[size] = draw(cur, size).toDataURL('image/png').split(',')[1];
      }
      return out;
    },
    { b64: master.toString('base64'), sizes: SIZES },
  );

  const png = {};
  for (const size of SIZES) {
    png[size] = Buffer.from(resized[size], 'base64');
    const file = path.join(OUT, `favicon-e9-${size}.png`);
    fs.writeFileSync(file, png[size]);
    console.log('ok  ' + path.basename(file) + '  ' + png[size].length + ' bytes');
  }

  const ico = path.join(OUT, 'favicon-e9.ico');
  fs.writeFileSync(ico, buildIco(ICO_SIZES.map((size) => ({ size, data: png[size] }))));
  console.log('ok  ' + path.basename(ico));

  await browser.close();
})();
