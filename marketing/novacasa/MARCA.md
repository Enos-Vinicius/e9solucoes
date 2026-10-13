# Nova Casa — móveis planejados · sistema visual

Cliente da frente de Marketing da E9. **Este sistema não é o da E9** e não
compartilha nada com ele: a paleta, a tipografia e o clima são outros. Nada
daqui deve vazar para `src/styles.scss` nem para `tailwind.config.js` — o que a
página `/marketing-nova-casa` usa vive no SCSS do próprio componente.

## De onde a paleta veio

A logo entregue (`novacasa_logo.jpg`, 150×150) é **monocromática**: 79,3% dos
pixels são branco e o traço fica em `#191819`, com saturação entre 0% e 2%. Ou
seja, a marca não trouxe cor — trouxe contraste e um desenho de casa com um
armário dentro.

O sistema abaixo mantém esse preto-e-branco como base e acrescenta **um acento
de madeira**, que é a matéria-prima do negócio. Esse acento é a única coisa aqui
que não foi medida da marca: é proposta, e trocar por uma cor oficial é mudar
três tokens.

| token | hex | hsl | contraste s/ linho | papel |
|---|---|---|---|---|
| `--nc-tinta` | `#191819` | 300° 2% 10% | 15,89 | traço da marca · texto principal |
| `--nc-grafite` | `#3B3939` | 0° 2% 23% | 10,29 | texto secundário forte |
| `--nc-cinza` | `#6F6C6B` | 15° 2% 43% | 4,67 | piso do texto corrido (AA) |
| `--nc-pedra` | `#8E8A87` | 26° 3% 54% | 3,07 | só rótulo grande e traço |
| `--nc-linha` | `#E2DCD4` | 34° 19% 86% | 1,22 | divisórias e molduras |
| `--nc-linho` | `#F6F2ED` | 33° 33% 95% | — | **superfície padrão** |
| `--nc-papel` | `#FFFFFF` | — | 1,11 | superfície de destaque |
| `--nc-nogueira` | `#7A4E32` | 23° 42% 34% | 6,36 | **acento** · eyebrow, filete, link |
| `--nc-carvalho` | `#B98A5E` | 29° 39% 55% | 2,75 | acento sobre tinta (5,78 lá) |
| `--nc-areia` | `#E9DECB` | 38° 41% 85% | 1,19 | superfície morna alternada |

**Piso de texto sobre linho é o `--nc-cinza` (4,67).** `pedra` reprova AA em
texto normal — serve para rótulo grande, número e traço. `carvalho` só vira
texto sobre `tinta`, onde rende 5,78; sobre linho ele é decoração.

## Tipografia

- Display: **Fraunces** (serif com peso ótico) — títulos, números de etapa.
  Fallback: `Georgia, 'Times New Roman', serif`.
- Texto: **Inter** — corpo, rótulos, legendas. Fallback: `system-ui, sans-serif`.
- Rótulo: Inter 500, caixa alta, `letter-spacing: .22em`.

Serif no título é a diferença mais rápida entre este sistema e o da E9 (que é
sans em tudo). Marcenaria pede peso e curva; software pede grade.

## Motivo gráfico

Uma **planta técnica**: filetes finos em `--nc-linha`, cotas em caixa alta e
cantos marcados com esquadro. É o desenho que já existe no ofício — a mesma
lógica do blueprint da E9, mas em papel, não em tela.

## A logo nas artes

Ela é preto-sobre-branco pura, então:

- superfície clara → `mix-blend-mode: multiply` (o branco some)
- superfície escura → `filter: invert(1)` + `mix-blend-mode: screen`

**Limite conhecido:** o arquivo tem 150×150. Nas peças grandes (capa e avatar)
ele aparece ampliado e fica macio. Pedir o vetor (SVG/AI/PDF) antes de publicar.
Onde a marca precisa de tamanho, as artes usam o símbolo casa+armário redesenhado
em SVG — é **reconstrução provisória**, não o arquivo oficial.

## Textos a confirmar com o cliente

Estão nas artes como marcador e **não podem ir ao ar como estão**: telefone
`(00) 00000-0000`, `@novacasa`, prazo de fabricação, prazo de garantia e o
e-mail. O resto da copy é do nicho e pode ser ajustado no tom.
