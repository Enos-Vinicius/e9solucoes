/**
 * Exporta todas as artes da Nova Casa.
 * Uso: node marketing/novacasa/export.js [posts|perfil|destaques]
 *
 * Um script só para as três fontes — a série do cliente é pequena e mantê-las
 * juntas evita três arquivos quase idênticos. Sem argumento, exporta tudo.
 *
 * `channel: 'chrome'` é obrigatório aqui: os browsers empacotados do Playwright
 * não estão instalados nesta máquina.
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const DIR = __dirname;
const OUT = path.join(DIR, 'png');
const PREV = path.join(DIR, 'preview');

/** fonte → peças, na ordem de publicação. O id casa com o do HTML. */
const FONTES = {
  posts: {
    arquivo: 'posts.html',
    viewport: { width: 1200, height: 1400 },
    pecas: ['p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08', 'p09'],
    nome: (id) => `nc-post-${id.slice(1)}`,
    /** o board mostra o post inteiro; 0.28 dá ~300px de largura */
    escala: 0.28,
  },
  frases: {
    arquivo: 'frases.html',
    viewport: { width: 1200, height: 1400 },
    pecas: ['f01', 'f02', 'f03', 'f04', 'f05', 'f06', 'f07', 'f08', 'f09', 'f10', 'f11', 'f12'],
    nome: (id) => `nc-frase-${id.slice(1)}`,
    escala: 0.28,
  },
  perfil: {
    arquivo: 'perfil.html',
    viewport: { width: 1200, height: 1200 },
    pecas: ['a', 'b', 'c'],
    nome: (id) => `nc-perfil-${{ a: 'linho', b: 'tinta', c: 'areia' }[id]}`,
    escala: 0.3,
  },
  destaques: {
    arquivo: 'destaques.html',
    viewport: { width: 1200, height: 2000 },
    pecas: ['cozinha', 'dormitorio', 'closet', 'home-office', 'living', 'banheiro', 'projeto-3d', 'orcamento'],
    nome: (id) => `nc-destaque-${id}`,
    escala: 0.2,
  },
};

const url = (arquivo) => 'file:///' + path.join(DIR, arquivo).split(path.sep).join('/');

async function exportar(browser, chave) {
  const fonte = FONTES[chave];
  const pagina = await browser.newPage({ viewport: fonte.viewport, deviceScaleFactor: 1 });
  await pagina.goto(url(fonte.arquivo));
  await pagina.waitForLoadState('networkidle'); // as fontes do Google entram aqui
  await pagina.waitForTimeout(500);

  for (const id of fonte.pecas) {
    const el = await pagina.$('#' + id);
    if (!el) throw new Error(`[${chave}] sem elemento no HTML: #${id}`);
    const arquivo = path.join(OUT, `${fonte.nome(id)}.png`);
    await el.screenshot({ path: arquivo });
    console.log('ok  ' + path.basename(arquivo));
  }
  await pagina.close();

  // preview leve para o board de entrega
  const leve = await browser.newContext({ deviceScaleFactor: fonte.escala });
  const p2 = await leve.newPage({ viewport: fonte.viewport });
  await p2.goto(url(fonte.arquivo));
  await p2.waitForLoadState('networkidle');
  await p2.waitForTimeout(500);
  for (const id of fonte.pecas) {
    const el = await p2.$('#' + id);
    await el.screenshot({
      path: path.join(PREV, `${fonte.nome(id)}.jpg`),
      type: 'jpeg',
      quality: 88,
    });
  }
  await leve.close();
}

(async () => {
  const alvo = process.argv[2];
  const chaves = alvo ? [alvo] : Object.keys(FONTES);
  for (const c of chaves) {
    if (!FONTES[c]) throw new Error(`fonte desconhecida: ${c} (use ${Object.keys(FONTES).join(', ')})`);
  }

  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(PREV, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome' });
  for (const c of chaves) await exportar(browser, c);
  await browser.close();
})();
