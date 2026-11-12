/**
 * Exporta os folders de produto em 300 DPI, prontos para a gráfica.
 * Uso: node marketing/folders/export.js
 *
 * Mesma mecânica da cartela: o CSS é escrito em mm e o
 * `deviceScaleFactor: 300/96` faz 1mm no arquivo virar 1mm no papel.
 * O clipe do Playwright é truncado para pixel CSS inteiro, então o script
 * grava o chunk `pHYs` com a densidade que faz os pixels medirem exatamente
 * 216 × 154 mm — sem isso o editor da gráfica abre a imagem a 72 DPI.
 *
 * Duas folhas por produto:
 *   -externo.png   [ contracapa | capa ]
 *   -interno.png   [ a ideia    | cuidados ]
 * Mais as versões `-guia`, com dobra e margens — conferência interna.
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const DIR = __dirname;
const OUT = path.join(DIR, 'png');

const DPI = 300;
const ESCALA = DPI / 96;
const LARGURA_MM = 216; // 210 de arte + 3mm de sangria de cada lado
const ALTURA_MM = 154;  // 148 + sangria
const MARGEM_MIN_MM = 5;

const PECAS = [
  { id: 'lapis-externo', nome: 'lapis-gigante-externo' },
  { id: 'lapis-interno', nome: 'lapis-gigante-interno' },
  { id: 'apontador-externo', nome: 'apontador-gigante-externo' },
  { id: 'apontador-interno', nome: 'apontador-gigante-interno' },
];

const url = 'file:///' + path.join(DIR, 'folders.html').split(path.sep).join('/');

/** CRC-32 do PNG, tabela montada na hora. */
function crc32(buf) {
  const tabela = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tabela[n] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = tabela[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return crc ^ 0xffffffff;
}

/** Grava a densidade física no PNG para a peça medir o que deve. */
function gravaDensidade(arquivo, larguraMM, alturaMM) {
  const png = fs.readFileSync(arquivo);
  const largura = png.readUInt32BE(16);
  const altura = png.readUInt32BE(20);

  const dados = Buffer.alloc(9);
  dados.writeUInt32BE(Math.round(largura / (larguraMM / 1000)), 0);
  dados.writeUInt32BE(Math.round(altura / (alturaMM / 1000)), 4);
  dados.writeUInt8(1, 8); // unidade: metro

  const tipo = Buffer.from('pHYs');
  const tamanho = Buffer.alloc(4);
  tamanho.writeUInt32BE(9);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([tipo, dados])) >>> 0);

  const corte = 33; // assinatura (8) + IHDR (25)
  fs.writeFileSync(
    arquivo,
    Buffer.concat([png.slice(0, corte), tamanho, tipo, dados, crc, png.slice(corte)]),
  );

  return {
    largura,
    altura,
    dpiX: (largura / (larguraMM / 25.4)).toFixed(1),
    dpiY: (altura / (alturaMM / 25.4)).toFixed(1),
  };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome' });
  const contexto = await browser.newContext({
    viewport: { width: 1000, height: 700 },
    deviceScaleFactor: ESCALA,
  });
  const pagina = await contexto.newPage();
  await pagina.goto(url);
  await pagina.waitForLoadState('networkidle'); // fontes do Google e o QR
  await pagina.waitForTimeout(600);

  /* Margem de segurança: distância de cada bloco de conteúdo até a linha de
     CORTE (a sangria não conta). É a defesa contra mandar para a gráfica uma
     peça com texto encostado na guilhotina — a face tem altura fixa e o
     `overflow:hidden` corta em silêncio. */
  const margens = await pagina.evaluate((sangria) => {
    const MM = 96 / 25.4;
    const alvos = '.logo3d,.assinatura,.titulo,.texto,.frase,.contato,.rotulo,.selos,.itens,.aviso,.qr-bloco';
    const fora = [];
    document.querySelectorAll('.folha').forEach((folha) => {
      const base = folha.getBoundingClientRect();
      folha.querySelectorAll('.face').forEach((face) => {
        let menor = 999;
        let culpado = '';
        face.querySelectorAll(alvos).forEach((el) => {
          const c = el.getBoundingClientRect();
          if (!c.width || !c.height) return;
          const d = Math.min(
            (c.left - base.left) / MM - sangria,
            (c.top - base.top) / MM - sangria,
            (base.right - c.right) / MM - sangria,
            (base.bottom - c.bottom) / MM - sangria,
          );
          if (d < menor) { menor = d; culpado = (el.className || '').split(' ')[0] || el.tagName; }
        });
        fora.push({
          peca: folha.id,
          face: face.classList.contains('esq') ? 'esquerda' : 'direita',
          margemMM: +menor.toFixed(1),
          elemento: culpado,
        });
      });
    });
    return fora;
  }, 3);

  for (const m of margens) {
    console.log('    ' + m.peca.padEnd(20) + m.face.padEnd(10) + m.margemMM + 'mm até o corte  (' + m.elemento + ')');
  }
  const apertados = margens.filter((m) => m.margemMM < MARGEM_MIN_MM);
  if (apertados.length) {
    throw new Error(
      'conteúdo a menos de ' + MARGEM_MIN_MM + 'mm da linha de corte: ' +
      apertados.map((m) => m.peca + '/' + m.face + ' (' + m.margemMM + 'mm)').join(', '),
    );
  }
  console.log('ok  margem de segurança >= ' + MARGEM_MIN_MM + 'mm em todas as faces');

  const LARGURA_PX = Math.round((LARGURA_MM * DPI) / 25.4);
  const ALTURA_PX = Math.round((ALTURA_MM * DPI) / 25.4);
  const clipe = { x: 0, y: 0, width: LARGURA_PX / ESCALA, height: ALTURA_PX / ESCALA };

  /** Deixa uma folha sozinha no canto superior esquerdo da página. */
  const isolar = (id) =>
    pagina.evaluate((alvo) => {
      document.body.style.cssText = 'margin:0;padding:0;gap:0;background:#fff';
      document.querySelectorAll('.folha').forEach((f) => {
        f.style.display = f.id === alvo ? 'block' : 'none';
      });
    }, id);

  const salvar = async (arquivo) => {
    await pagina.screenshot({ path: arquivo, clip: clipe });
    const m = gravaDensidade(arquivo, LARGURA_MM, ALTURA_MM);
    console.log(
      'ok  ' + path.basename(arquivo).padEnd(44) +
      m.largura + 'x' + m.altura + ' px · ' + LARGURA_MM + 'x' + ALTURA_MM + ' mm · ' +
      m.dpiX + '/' + m.dpiY + ' DPI',
    );
    if (+m.dpiX < 290 || +m.dpiY < 290) throw new Error('densidade abaixo de 290 DPI');
  };

  for (const { id, nome } of PECAS) {
    await isolar(id);
    await salvar(path.join(OUT, `e9-folder-${nome}.png`));
  }

  for (const { id, nome } of PECAS) {
    await isolar(id);
    await pagina.evaluate(() => document.body.classList.add('guias'));
    await pagina.waitForTimeout(150);
    await salvar(path.join(OUT, `e9-folder-${nome}-guia.png`));
    await pagina.evaluate(() => document.body.classList.remove('guias'));
  }

  await browser.close();
})();
