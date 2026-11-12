/**
 * Exporta as cartelas de embalagem em 300 DPI, prontas para a gráfica.
 * Uso: node marketing/cartelas/export.js
 *
 * O CSS é escrito em mm. O browser renderiza 1mm = 96/25,4 px CSS, então
 * `deviceScaleFactor: 300/96` faz 1mm virar exatamente 1mm a 300 DPI —
 * 126 x 246 mm (arte + 3mm de sangria) saem como 1488 x 2906 px.
 *
 * Sai duas versões de cada peça:
 *   e9-cartela-<produto>.png       arte final, com marcas de corte e dobra
 *   e9-cartela-<produto>-guia.png  a mesma com dobra, área útil, margem de
 *                                  segurança e faixa do grampo — conferência
 *                                  interna, não mandar para impressão.
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const DIR = __dirname;
const OUT = path.join(DIR, 'png');

/** 300 DPI: o CSS já está em mm, só falta a escala do dispositivo. */
const DPI = 300;
const ESCALA = DPI / 96;

const PECAS = [
  { id: 'lapis', nome: 'lapis-gigante' },
  { id: 'apontador', nome: 'apontador-gigante' },
];

const url = 'file:///' + path.join(DIR, 'cartelas.html').split(path.sep).join('/');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome' });
  const contexto = await browser.newContext({
    viewport: { width: 1100, height: 1400 },
    deviceScaleFactor: ESCALA,
  });
  const pagina = await contexto.newPage();
  await pagina.goto(url);
  await pagina.waitForLoadState('networkidle'); // as fontes do Google entram aqui
  await pagina.waitForTimeout(500);

  /* Captura por clipe em (0,0) com largura e altura exatas em pixel.
     O screenshot por elemento arredonda a caixa para fora e as duas peças
     saíam com 3px de diferença entre si — meio milímetro de papel. */
  const LARGURA_MM = 126;
  const ALTURA_MM = 246;
  const LARGURA_PX = Math.round((LARGURA_MM * DPI) / 25.4);
  const ALTURA_PX = Math.round((ALTURA_MM * DPI) / 25.4);
  const clipe = { x: 0, y: 0, width: LARGURA_PX / ESCALA, height: ALTURA_PX / ESCALA };

  /** Deixa uma peça sozinha no canto superior esquerdo da página. */
  const isolar = (id) =>
    pagina.evaluate((alvo) => {
      document.body.style.cssText = 'margin:0;padding:0;gap:0;background:#fff';
      document.querySelectorAll('.cartela').forEach((c) => {
        c.style.display = c.id === alvo ? 'block' : 'none';
      });
    }, id);

  /**
   * Grava o chunk pHYs no PNG — a densidade física do arquivo.
   *
   * O clipe do Playwright é truncado para pixel CSS inteiro, então milímetro
   * nunca cai redondo: a peça sai com 1488x2903 px em vez dos 1488x2906
   * teóricos. Em vez de forçar o pixel, declaramos a densidade que faz esses
   * pixels medirem exatamente 126 x 246 mm. Sem isso o InDesign/Illustrator
   * abre a imagem a 72 DPI e alguém reescala no olho.
   */
  function gravaDensidade(arquivo, larguraMM, alturaMM) {
    const png = fs.readFileSync(arquivo);
    const largura = png.readUInt32BE(16);
    const altura = png.readUInt32BE(20);

    const dados = Buffer.alloc(9);
    dados.writeUInt32BE(Math.round(largura / (larguraMM / 1000)), 0); // pixels por metro, x
    dados.writeUInt32BE(Math.round(altura / (alturaMM / 1000)), 4);   // pixels por metro, y
    dados.writeUInt8(1, 8);                                           // unidade: metro

    const tipo = Buffer.from('pHYs');
    const tamanho = Buffer.alloc(4);
    tamanho.writeUInt32BE(9);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([tipo, dados])) >>> 0);
    const chunk = Buffer.concat([tamanho, tipo, dados, crc]);

    // entra logo depois do IHDR (8 de assinatura + 25 do IHDR)
    const corte = 33;
    fs.writeFileSync(arquivo, Buffer.concat([png.slice(0, corte), chunk, png.slice(corte)]));

    return {
      largura,
      altura,
      dpiX: (largura / (larguraMM / 25.4)).toFixed(1),
      dpiY: (altura / (alturaMM / 25.4)).toFixed(1),
    };
  }

  /** CRC-32 do PNG, tabela montada na hora. */
  function crc32(buf) {
    let c;
    const tabela = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      tabela[n] = c;
    }
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) crc = tabela[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    return crc ^ 0xffffffff;
  }

  const salvar = async (arquivo) => {
    await pagina.screenshot({ path: arquivo, clip: clipe });
    const m = gravaDensidade(arquivo, LARGURA_MM, ALTURA_MM);
    console.log(
      'ok  ' + path.basename(arquivo).padEnd(38) +
      m.largura + 'x' + m.altura + ' px · ' + LARGURA_MM + 'x' + ALTURA_MM + ' mm · ' +
      m.dpiX + '/' + m.dpiY + ' DPI',
    );
    if (+m.dpiX < 290 || +m.dpiY < 290) {
      throw new Error('densidade abaixo de 290 DPI: ' + m.dpiX + '/' + m.dpiY);
    }
  };

  /* Margem de segurança: distância de todo elemento de conteúdo até a linha
     de CORTE (a sangria não conta). Medir isso é o que pega os dois erros que
     o olho deixa passar — conteúdo cortado pelo `overflow:hidden` e conteúdo
     que comeu o próprio respiro e encosta na guilhotina.

     Um guard anterior comparava scrollHeight com clientHeight e não servia:
     os dois incluem o padding, então texto invadindo a margem passava batido. */
  const MARGEM_MIN_MM = 5;
  const margens = await pagina.evaluate((sangria) => {
    const MM = 96 / 25.4;
    const alvos = '.marca,.assinatura,.tresd,.tipo,.nome,.descricao,.contato,.rotulo,.specs,.cuidado';
    const fora = [];
    document.querySelectorAll('.cartela').forEach((cartela) => {
      const base = cartela.getBoundingClientRect();
      cartela.querySelectorAll('.painel').forEach((painel) => {
        let menor = 999;
        let culpado = '';
        painel.querySelectorAll(alvos).forEach((el) => {
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
          peca: cartela.id,
          painel: painel.classList.contains('frente') ? 'frente' : 'verso',
          margemMM: +menor.toFixed(1),
          elemento: culpado,
        });
      });
    });
    return fora;
  }, 3);

  for (const m of margens) {
    console.log('    ' + m.peca.padEnd(11) + m.painel.padEnd(8) + m.margemMM + 'mm até o corte  (' + m.elemento + ')');
  }
  const apertados = margens.filter((m) => m.margemMM < MARGEM_MIN_MM);
  if (apertados.length) {
    throw new Error(
      'conteúdo a menos de ' + MARGEM_MIN_MM + 'mm da linha de corte: ' +
      apertados.map((m) => m.peca + '/' + m.painel + ' (' + m.margemMM + 'mm)').join(', '),
    );
  }
  console.log('ok  margem de segurança >= ' + MARGEM_MIN_MM + 'mm em todos os painéis');


  for (const { id, nome } of PECAS) {
    await isolar(id);
    await salvar(path.join(OUT, `e9-cartela-${nome}.png`));
  }

  // mesma arte com as guias de conferência por cima
  for (const { id, nome } of PECAS) {
    await isolar(id);
    await pagina.evaluate(() => document.body.classList.add('guias'));
    await pagina.waitForTimeout(150);
    await salvar(path.join(OUT, `e9-cartela-${nome}-guia.png`));
    await pagina.evaluate(() => document.body.classList.remove('guias'));
  }

  await browser.close();
})();
