# E9 Soluções — site institucional

Angular 19 (standalone, sem NgModule) + Tailwind 3.4. Rotas lazy em
`src/app/app.routes.ts`: `/` (home), `/design-system`, `/catalogo`, `**` → `/`.
Tema escuro único — não há light mode, não presuma um.

Em `marketing/instagram/` moram as artes de Instagram (HTML → PNG via Playwright).
**Compartilham a paleta com o site** — ver "Sincronia" abaixo.

## Comandos

```bash
npm start                                  # ng serve (4200)
npm run build                              # produção
npx ng build --configuration production    # idem, explícito
npm test

node marketing/instagram/export.js          # posts.html    → png/e9-post-*.png
node marketing/instagram/export-perfil.js   # perfil.html   → png/e9-perfil-*.png
node marketing/instagram/export-preview.js  # preview.html  → preview/*.jpg
node marketing/instagram/build-preview.js   # gera preview.html do template
node marketing/instagram/export-favicon.js   # favicon.html   -> public/favicon-e9*.png|.ico
```

Os scripts usam `chromium.launch({ channel: 'chrome' })` — de propósito. Os
browsers empacotados do Playwright **não estão instalados** nesta máquina
(`~/AppData/Local/ms-playwright/` não existe), então `chromium.launch()` sem
`channel` falha. Use `channel: 'chrome'` ou `'msedge'` em qualquer script novo.

---

# Design System

## A paleta é um eixo único travado em 214°

Cor de marca: **`#003A85`** = `blue-800`. Toda a escada mantém o matiz constante
(medido: 213,2°–214,3°) e recua a saturação nos tons claros para não virar neon.

| degrau | hex | contraste s/ carbon | papel |
|---|---|---|---|
| 950 | `#001838` | 1,13 | fundo profundo |
| 900 | `#002657` | 1,35 | fundo profundo |
| 800 | `#003A85` | 1,85 | **marca** · estrutural: fill, base de halo, botão |
| 700 | `#0049A8` | 2,40 | estrutural |
| 600 | `#005BD1` | 3,26 | primária interativa, núcleo de halo |
| 500 | `#006FFF` | 4,50 | luz: glow, box-shadow |
| 400 | `#4795FA` | 6,62 | accent, glint, gradiente frio |
| 300 | `#81B5F8` | 9,43 | traço e texto sobre carbon |
| 200 | `#B3D2F9` | 12,87 | texto de destaque |
| 100 | `#D5E6FB` | 15,76 | texto de destaque bem claro |
| 50 | `#EDF4FD` | 18,07 | — |

**Piso de texto é o 400.** 950–600 reprovam AA em qualquer tamanho (600 passa só
em texto grande, 3,26). O 500 fica exatamente em 4,50, no limite — não use para
texto. O 800 é a cor de marca e rende 1,85:1: **nunca serve de texto**, só de
estrutura.

Neutros: `--e9-carbon #06080F` (fundo), `--e9-midnight #0A0E1A`,
`--e9-graphite #11162A`, `--e9-stone #1A2238`, `--e9-platinum #E5E9F2`.

Única exceção de matiz, deliberada: **`--e9-sky-edge #38BDF8`** (198°), para os
gradientes terem para onde viajar. Não crie outras.

## Proibido

- **Qualquer cor fora do eixo.** As famílias `indigo-*` e `cobalt` foram
  removidas do projeto inteiro — eram 234°–244°, ou seja violeta. Não as
  reintroduza, nem por hex solto.
- **As famílias nativas do Tailwind `indigo-*` e `blue-*`.** O `blue` nativo é
  217° e passa perto, mas é outra escada. Use sempre `e9-blue-*`.
- Cor decorativa. A paleta tem três camadas com função: superfície (carbon),
  texto (platina), sinalização (o eixo azul). Nada além disso.

Semânticos preservados e fora do eixo por serem semânticos: `emerald` (success),
`amber` (warning), `red` (danger), `sky` (info).

## Onde os tokens vivem — e por que em dois lugares

1. `src/styles.scss` → `--e9-blue-950 … --e9-blue-50` (CSS custom properties)
2. `tailwind.config.js` → `theme.extend.colors.e9.blue.{950…50}` (classes)

**Precisam ficar em sincronia.** Um valor mudado só no `styles.scss` não afeta
`bg-e9-blue-600`; mudado só no config, não afeta `var(--e9-blue-600)`.

Ao remover ou renomear um token, varra os `var()` que apontam para ele — um
`var(--token-inexistente)` não gera erro de build, só deixa de pintar:

```bash
# tokens usados que não estão definidos → deve sair vazio
comm -23 \
  <(grep -rhoE 'var\(--e9-[a-z0-9-]+' src | sed 's/var(//' | sort -u) \
  <(grep -oE '^\s*--e9-[a-z0-9-]+' src/styles.scss | tr -d ' ' | sort)
```

## Regra de alpha nos fills estruturais

`#005BD1` sobre carbon rende menos presença que o violeta que ocupava esse
lugar. Ao portar um tint para 600/800, **suba o alpha ~1,3×**:

`/8 → /10 · /10 → /13 · /12 → /16 · /14 → /18 · /18 → /24 · /35 → /45`

Bordas e texto **mantêm** o alpha original — o bump vale só para fill
(`bg-`, `from-`, `via-`, `to-`, `background:`). Glows e box-shadows ficam em
paridade.

## Classes utilitárias do projeto

Em `src/styles.scss`. As de cor levam o sufixo `-marca`, não o nome de uma cor
(foi o que sobreviveu à migração de paleta):

- `.btn-marca` (primário: repouso 600→800, hover sobe para 500→600),
  `.btn-outline`, `.btn-ghost`
- `.text-gradient` (neutro branco→`#a1a8b8`), `.text-gradient-marca`
- `.blueprint-card`, `.glass-panel`, `.glass-nav`, `.matrix-cell` (+ `.core`,
  `.ativa`), `.triad-center`, `.section-eyebrow`, `.spec-row`, `.e9-input`,
  `.glow-point`, `.tree-backdrop`
- Movimento: `.fade-in-up`, `.reveal` (via diretiva `e9RevealOnScroll`),
  `.data-render`, keyframes `core-pulse`/`shimmer`/`float`/`blink`.
  `.reveal` usa a propriedade `translate`, não `transform`, para não colidir com
  as utilidades de transform do Tailwind no mesmo elemento. Respeita
  `prefers-reduced-motion`.

Tipografia: Geist / Geist Mono via `--font-sans` e `--font-mono`.

---

# Armadilhas já encontradas

## Valores arbitrários do Tailwind não aceitam espaço

`shadow-[0_0_22px_rgba(0, 91, 209, 0.6)]` é **descartado em silêncio** — sem erro
de build, a sombra só não aparece. Dentro de `[...]`: espaço nenhum, use `_` onde
precisar de espaço.

```
✗ shadow-[0_0_22px_-4px_rgba(0, 111, 255, 0.6)]
✓ shadow-[0_0_22px_-4px_rgba(0,111,255,0.6)]
```

Em `style="..."` inline o espaço é válido — a regra vale só para classes.

## `flex flex-col` sem `items-*` estica os filhos

`align-items` default é `stretch`, então um `<a>` ou wrapper vira a largura do
filho mais largo e alinha seu conteúdo à esquerda. Foi o que descentralizou a
logo nos footers: o `<a>` esticava até a largura do texto abaixo. `items-center`
resolve — e como efeito colateral bom, encolhe a área clicável para o tamanho
real da logo.

Note que `justify-content: center` no `:host` de `app-logo-e9` **não** ajuda
nesse caso: centraliza o SVG dentro de um host que já tem a largura do SVG.

## Ao mexer em cor, meça em vez de olhar

Screenshot confirma que renderizou; não confirma **qual** cor. Vale amostrar o
computed style no browser:

```js
getComputedStyle(document.documentElement).getPropertyValue('--e9-blue-800')
getComputedStyle(document.querySelector('.btn-marca')).backgroundImage
```

E confirmar que as classes foram emitidas — se o `tailwind.config.js` não for
lido, elas saem do bundle sem erro:

```bash
grep -o 'bg-e9-blue-600[^{]*{[^}]*}' dist/e9-solucoes/browser/styles-*.css
```

---

# Sincronia com marketing/

`marketing/instagram/` (`posts.html`, `perfil.html`, `preview-template.html`)
tem a **mesma escada duplicada em CSS próprio** — não importa nada de `src/`.
Mudança de paleta precisa ir aos dois lados, ou a arte do Instagram descola do
site.

As variantes de foto de perfil são `marca-carbon`, `platina-marca` e `gradiente`
(a recomendada é `platina-marca`). Após editar os HTML, reexporte com os scripts
acima — os PNG/JPG são versionados.

E-mail de contato vigente: **e9solucoestecnologicas@gmail.com** (o antigo
`contato@e9solucoes.com.br` foi substituído; não o traga de volta).
