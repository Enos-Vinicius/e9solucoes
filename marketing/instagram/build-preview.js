/**
 * Monta o board de revisão (preview.html) com as artes embutidas em data URI —
 * página autocontida, sem dependência de rede.
 * Uso: node marketing/instagram/build-preview.js
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const tpl = fs.readFileSync(path.join(DIR, 'preview-template.html'), 'utf8');

const img = (id) =>
  'data:image/jpeg;base64,' +
  fs.readFileSync(path.join(DIR, 'preview', id + '.jpg')).toString('base64');

const POSTS = [
  {
    id: 'p01',
    n: '01',
    titulo: 'Capa — a marca',
    papel: 'Logo em escala máxima sobre o glow índigo. Nenhuma promessa, nenhum serviço: só a marca e o posicionamento. É o post que o visitante novo vê primeiro.',
    tag: 'arquitetura invisível',
    legenda: `E9 Soluções. Arquitetura invisível.

O que você vê num produto bem feito é a menor parte dele. A maior parte é a decisão que ninguém percebe: a estrutura, a ordem, o que foi deixado de fora.

É isso que a gente constrói — antes do código e antes da matéria.

Somos uma casa de tecnologia que projeta ecossistemas digitais e físicos sob um só padrão: software, impressão 3D e inteligência artificial.

Seja bem-vindo. Nos próximos posts a gente abre tudo.

🔗 e9solucoes.com.br

#E9Solucoes #ArquiteturaInvisivel #DesignInteligente #SoftwareHouse #Impressao3D #InteligenciaArtificial #Tecnologia`,
  },
  {
    id: 'p02',
    n: '02',
    titulo: 'Manifesto — quem somos',
    papel: 'A headline do site, palavra por palavra. Explica o que a E9 faz em uma frase e por que ela começa antes do código.',
    tag: 'quem somos',
    legenda: `Transformando ideias abstratas em soluções de alta performance.

Toda empresa chega com a mesma coisa: uma ideia que ainda não tem forma. "Precisamos organizar isso", "queria vender online", "esse processo não escala".

Nosso trabalho começa aí — antes da tela, antes do código. Primeiro a gente entende a lógica do seu negócio. Depois constrói em cima dela.

Sem ornamento. Sem etapa que existe só para engordar proposta. Rigor matemático, do primeiro rascunho à entrega.

🔗 e9solucoes.com.br

#E9Solucoes #DesignInteligente #TransformacaoDigital #Tecnologia #DesenvolvimentoDeSoftware #Inovacao`,
  },
  {
    id: 'p03',
    n: '03',
    titulo: 'As 9 frentes',
    papel: 'O numeral como argumento: nove frentes numa casa só. Os três pilares aparecem destacados; os dois que ainda não abriram vêm marcados como “em breve”, sem prometer o que não existe.',
    tag: 'matriz de soluções',
    legenda: `9 frentes de entrega. Uma só casa.

O nome não é enfeite: a E9 opera em nove frentes, e a nona posição é a fundação de tudo.

01 · Software House — sites, sistemas e apps
02 · Impressão 3D — do arquivo ao objeto na mão
03 · Inteligência Artificial — agentes e automação
04 · Suporte & Treinamento
05 · Info Produto
06 · Branding & Identidade
07 · Consultoria & Transformação Digital
08 · Automação Residencial (em breve)
09 · Marketing & Performance (em breve)

A vantagem de ter tudo sob o mesmo teto: seu site, seu sistema, seu brinde e sua marca falam a mesma língua. Sem três fornecedores se contradizendo.

Qual dessas frentes resolveria o seu problema hoje? Comenta aí. 👇

#E9Solucoes #SoftwareHouse #Impressao3D #InteligenciaArtificial #Branding #Consultoria #TransformacaoDigital`,
  },
  {
    id: 'p04',
    n: '04',
    titulo: 'Software House',
    papel: 'Primeiro pilar. Linguagem de cliente, não de engenharia: app, sistema, loja, landing — e o que mais dói na contratação, que é prazo e acompanhamento.',
    tag: 'web · mobile · sob medida',
    legenda: `Seu app, sistema e site prontos para vender.

A gente cria o software que o seu negócio precisa de verdade — aplicativo, sistema de gestão, loja online ou landing page.

✅ Sob medida — feito para o seu jeito de trabalhar, não para um molde pronto
✅ Que converte — rápido, impecável no celular, desenhado para virar venda
✅ Com suporte depois — primeira versão no ar em semanas, e a gente continua

E o mais importante: você acompanha cada etapa e valida antes de publicar. Nada de sumir por três meses e voltar com surpresa no prazo ou no orçamento.

Manda "ORÇAMENTO" no direct. 📩

#SoftwareHouse #DesenvolvimentoDeSoftware #Aplicativo #SistemaWeb #LandingPage #E9Solucoes #DesenvolvimentoWeb`,
  },
  {
    id: 'p05',
    n: '05',
    titulo: 'Impressão 3D',
    papel: 'Segundo pilar, com as duas frentes lado a lado — catálogo próprio e peça sob demanda. É o post que explica o “bit e átomo” de forma concreta.',
    tag: 'do código ao objeto',
    legenda: `Produtos para a loja. Peças para a sua marca.

Nossa impressão 3D roda em duas frentes:

🛍️ Catálogo próprio — coleções sazonais e edições limitadas, modeladas, impressas e vendidas pela casa.

🏷️ Sob demanda para marcas — chaveiros, brindes corporativos, logo da sua empresa em 3D, displays de PDV e material de divulgação.

Modelagem precisa, acabamento limpo e prazo que a gente cumpre. É a identidade da sua marca saindo da tela e chegando na mão do cliente.

Vem ver o catálogo: e9solucoes.com.br/catalogo

#Impressao3D #3DPrinting #BrindesPersonalizados #BrindesCorporativos #ManufaturaDigital #E9Solucoes #Chaveiros`,
  },
  {
    id: 'p06',
    n: '06',
    titulo: 'Inteligência Artificial',
    papel: 'Terceiro pilar. Posiciona IA como engenharia, não como recurso mágico, e encerra com a pergunta que costuma puxar comentário.',
    tag: 'cognição aplicada',
    legenda: `IA que automatiza o que realmente importa.

IA não é botão que você liga. É engenharia.

A gente trabalha nas três camadas que fazem a diferença:
01 · Engenharia de prompt — instrução precisa, resultado consistente
02 · Agentes autônomos — tarefas que se resolvem sem alguém empurrando
03 · Integração de modelos — IA conectada aos seus dados e sistemas

O objetivo nunca é substituir o seu time. É devolver para ele as horas que hoje vão para trabalho repetitivo.

Qual tarefa da sua rotina você automatizaria primeiro? 🤖

#InteligenciaArtificial #IA #Automacao #AgentesDeIA #PromptEngineering #E9Solucoes #Produtividade`,
  },
  {
    id: 'p07',
    n: '07',
    titulo: 'Design Inteligente™',
    papel: 'O método proprietário e os cinco pilares. Diferencia a E9 de quem entrega template e justifica por que o próprio site é a prova.',
    tag: 'método proprietário',
    legenda: `Design Inteligente™ — o design system que torna sua marca moderna por dentro.

A gente não vende template. Construímos a linguagem visual viva da sua marca sobre cinco pilares:

01 Frequência — paleta única, nenhuma cor decorativa
02 Geometria — grid, proporção e ritmo matemático
03 Movimento — nada pisca; tudo interpola
04 Voz — copy sem ornamento, hierarquia previsível
05 Modularidade — escala sem reescrita

O resultado é coerência absoluta entre site, produto, comunicação e operação. Um negócio que parece ter sido pensado num único traço — porque foi.

Nosso próprio site é a vitrine viva do método. Dá uma olhada: e9solucoes.com.br

#DesignSystem #DesignInteligente #Branding #IdentidadeVisual #UIDesign #E9Solucoes #DesignDeProduto`,
  },
  {
    id: 'p08',
    n: '08',
    titulo: 'Transparência',
    papel: 'Quebra a objeção que ninguém verbaliza: o medo de ficar preso ao fornecedor. Três números, um argumento.',
    tag: 'transparência radical',
    legenda: `O que você contrata é seu. Sem caixa-preta.

A parte mais cara de contratar tecnologia raramente aparece no orçamento: é descobrir depois que você não pode sair.

Na E9 o combinado é o contrário:

100% do código sob seu domínio — versionado, auditável e seu
0 amarras — você é dono do código, dos arquivos 3D e dos tokens da marca
2 mundos na mesma casa — digital e físico, sob um só padrão

Se um dia você quiser levar tudo para outro time, leva. A gente prefere que você fique porque quer, não porque está preso.

#Transparencia #TecnologiaSemAmarras #SoftwareHouse #E9Solucoes #GestaoDeTI`,
  },
  {
    id: 'p09',
    n: '09',
    titulo: 'Chamada final',
    papel: 'Fecha a série e a grade. Único post com contato em destaque — depois de oito posts de contexto, o pedido é natural.',
    tag: 'manifestação',
    legenda: `Pronto para codificar o futuro da sua operação?

Chegamos ao fim da apresentação. Agora é com você.

Se tem um processo que trava, uma ideia que não sai do papel ou um sistema que já não dá conta — fala com a gente. Direto com quem projeta, sem intermediário e sem termo vago.

📩 contato@e9solucoes.com.br
🔗 e9solucoes.com.br
⏱️ resposta em até 24h úteis

#E9Solucoes #ArquiteturaInvisivel #SoftwareHouse #Impressao3D #InteligenciaArtificial #TransformacaoDigital #Tecnologia`,
  },
];

const AVATARS = [
  {
    slug: 'indigo-carbon',
    nome: 'Índigo sobre Carbon',
    nota: 'A mais fiel ao site: mesmo fundo, mesmo índigo, mesmo halo. Some no feed claro de quem usa tema claro, mas é a que diz “E9” sem esforço.',
    rec: false,
  },
  {
    slug: 'platina-indigo',
    nome: 'Platina sobre Índigo',
    nota: 'Maior contraste dos três — é a que continua legível a 32 px e num feed de qualquer cor. Para foto de perfil, contraste ganha de fidelidade.',
    rec: true,
  },
  {
    slug: 'gradiente',
    nome: 'Gradiente da marca',
    nota: 'A marca preenchida com o gradiente índigo → platina → cobalto. A mais elegante no grande; perde definição nos tamanhos pequenos.',
    rec: false,
  },
];

const avatarImg = (slug) =>
  'data:image/jpeg;base64,' +
  fs.readFileSync(path.join(DIR, 'preview', 'perfil-' + slug + '.jpg')).toString('base64');

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const grid = POSTS.map(
  (p) => `<img src="${img(p.id)}" alt="Post ${p.n} — ${esc(p.titulo)}">`
).join('\n    ');

const posts = POSTS.map(
  (p) => `<article>
      <figure>
        <img class="shot" src="${img(p.id)}" alt="Arte do post ${p.n}: ${esc(p.titulo)}">
        <figcaption><span>e9-post-${p.n}.png</span><span>1080 × 1350</span></figcaption>
      </figure>
      <div class="meta">
        <p class="idx">${p.n} / 09 · ${esc(p.tag)}</p>
        <h3>${esc(p.titulo)}</h3>
        <p class="role">${esc(p.papel)}</p>
        <div class="cap">
          <div class="cap-bar">
            <span>legenda</span>
            <button class="copy" data-target="cap-${p.id}" type="button">copiar</button>
          </div>
          <pre id="cap-${p.id}">${esc(p.legenda)}</pre>
        </div>
      </div>
    </article>`
).join('\n    ');

const avatars = AVATARS.map((a) => {
  const src = avatarImg(a.slug);
  const alt = `Foto de perfil — ${esc(a.nome)}`;
  return `<div class="av">
      <div class="sizes">
        <img class="s150" src="${src}" alt="${alt}">
        <img class="s56" src="${src}" alt="">
        <img class="s32" src="${src}" alt="">
      </div>
      ${a.rec ? '<span class="rec">sugerida</span>' : ''}
      <h3>${esc(a.nome)}</h3>
      <p>${esc(a.nota)}</p>
      <p class="file">e9-perfil-${a.slug}.png</p>
    </div>`;
}).join('\n    ');

const out = tpl
  .replace('__GRID__', grid)
  .replace('__AVATARS__', avatars)
  .replace('__POSTS__', posts);
fs.writeFileSync(path.join(DIR, 'preview.html'), out, 'utf8');
console.log('preview.html · ' + (Buffer.byteLength(out) / 1024 / 1024).toFixed(2) + ' MB');
