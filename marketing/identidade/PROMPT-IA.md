# Prompt de identidade — E9 Soluções

Bloco para colar em IA de imagem (Midjourney, Gemini/Nano Banana, GPT Image,
Firefly) **antes** de descrever o assunto da peça. Ele não pede imagem nenhuma:
só trava o sistema visual.

Em inglês de propósito — os modelos de imagem aderem bem melhor a termos de
estilo em inglês, mesmo quando conversam em português. A versão em português
está no fim, para ferramentas que não lidam bem com inglês.

---

## Bloco principal

```
BRAND VISUAL SYSTEM — E9 Soluções. Apply to the entire image, without exception.

PALETTE — a single blue axis, hue locked at 214°. Use only these values:
#001838, #002657, #003A85 (brand color), #0049A8, #005BD1, #006FFF, #4795FA,
#81B5F8, #B3D2F9, #D5E6FB.
Neutrals: #06080F (near-black carbon, the default background), #0A0E1A, #11162A,
#1A2238, and #E5E9F2 (platinum, for light elements).
One single allowed accent, only inside gradients: #38BDF8.

MOOD — dark, technical, precise, quiet. Engineering blueprint meets high-end
product photography. Confidence without noise. Nothing playful, nothing flashy.

SURFACE — deep near-black background. A faint blueprint grid of 1px blue lines
at very low opacity, 24 to 72 px spacing. Soft radial glow in #003A85 and
#005BD1 behind the subject. Hairline rules and small square corner brackets,
like marks on a technical drawing, framing the composition.

MATERIAL — brushed platinum and chrome with cool blue reflections, matte dark
surfaces, subtle volumetric light. Metal reads silver-blue, never warm.

LIGHT — cool and directional, coming from the upper left. Soft specular
highlights, deep shadows, no color cast other than blue.

COMPOSITION — generous negative space, strict alignment, calm hierarchy.
Centered or on thirds. No ornament, no filler.

NEVER USE — gold, amber, bronze, copper, any warm tone; violet, indigo, purple,
magenta; green or teal; neon or rainbow gradients; any gradient that leaves the
blue axis; white or light backgrounds; glossy 3D clipart; lens flares;
decorative swirls; generic corporate stock-photo clichés.
```

## Prompt negativo

Para ferramentas com campo separado:

```
gold, golden, amber, bronze, copper, warm colors, purple, violet, magenta,
pink, green, teal, orange, rainbow, neon, white background, light theme,
glossy clipart, lens flare, bokeh hearts, watermark, text, letters, logo,
cluttered, ornate, busy
```

## Como usar

1. Cole o bloco principal.
2. Depois, descreva **só o assunto**: "a giant 3D-printed pencil case standing
   on a dark desk, three-quarter view".
3. Formato: `1080x1350` (post 4:5), `1080x1920` (story e capa de destaque),
   `1080x1080` (avatar).

**Não peça texto nem a logo para a IA.** Modelo de imagem erra letra e destrói
monograma — a marca sairia deformada e fora do desenho oficial. Gere só o
fundo/objeto e componha o texto e a marca por cima, nas artes que já temos
(`marketing/instagram/`, `marketing/identidade/`).

**Se a ferramenta aceitar imagem de referência**, mande junto uma das nossas
artes já exportadas — `marketing/instagram/png/e9-post-01.png` ou
`e9-perfil-platina-marca.png`. Referência visual segura o matiz muito melhor
que descrição escrita.

## Versão em português

```
SISTEMA VISUAL DA MARCA — E9 Soluções. Vale para a imagem inteira.

PALETA — um eixo azul único, matiz travado em 214°. Só estes valores:
#001838, #002657, #003A85 (cor de marca), #0049A8, #005BD1, #006FFF, #4795FA,
#81B5F8, #B3D2F9, #D5E6FB.
Neutros: #06080F (quase preto, o fundo padrão), #0A0E1A, #11162A, #1A2238 e
#E5E9F2 (platina, para os elementos claros).
Um único acento permitido, só dentro de gradiente: #38BDF8.

CLIMA — escuro, técnico, preciso e silencioso. Desenho de engenharia encontrando
fotografia de produto de alto padrão. Sem euforia, sem brilho fácil.

SUPERFÍCIE — fundo quase preto. Malha de planta baixa em linhas azuis de 1px,
opacidade muito baixa, espaçadas de 24 a 72 px. Halo radial suave em #003A85 e
#005BD1 atrás do assunto. Filetes finos e esquadros quadrados nos cantos, como
marcas de desenho técnico.

MATERIAL — platina e cromo escovado com reflexo azul frio, superfícies foscas
escuras, luz volumétrica sutil. O metal é prateado-azulado, nunca quente.

LUZ — fria e direcional, vindo de cima à esquerda. Brilho especular suave,
sombra profunda, nenhuma dominante que não seja azul.

COMPOSIÇÃO — muito espaço negativo, alinhamento rígido, hierarquia calma.
Centralizado ou nos terços. Sem ornamento.

NUNCA USAR — dourado, âmbar, bronze, cobre, qualquer tom quente; violeta,
índigo, roxo, magenta; verde ou turquesa; gradiente neon ou arco-íris; qualquer
gradiente que saia do eixo azul; fundo branco ou claro; 3D de clipart; flare de
lente; firulas decorativas; clichê de banco de imagens corporativo.
```
