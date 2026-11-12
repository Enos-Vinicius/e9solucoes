# Cartões de produto · E9 Soluções 3D — especificação de impressão

Cartão que acompanha a peça impressa em 3D. **Uma face só, sem dobra.**

| | |
|---|---|
| final cortado | **105 × 148 mm** (A6) |
| com sangria | **111 × 154 mm** (3 mm em volta) |
| arquivos | `png/e9-cartao-<produto>.png`, 1309 × 1819 px |
| densidade | 300 DPI gravada no próprio PNG (chunk `pHYs`) |
| cores | RGB — a gráfica converte para CMYK |
| impressão | **só frente** |

Cabem **quatro cartões numa folha A4** (2 × 2), o que derruba o custo por peça.
Peça à gráfica para impor nesse arranjo.

## Papel

Couché fosco 250–300 g/m². O fundo é carbon (`#06080F`) em área cheia: sai bem
em gráfica digital, mancha e gasta toner em impressora de mesa.

## O QR

Aponta para `https://www.instagram.com/e9.solucoes`, impresso a 20 mm sobre
bloco branco (QR claro sobre escuro é mal lido por muitos leitores).
**Escaneie uma vez antes da tiragem** — a estrutura do código foi conferida,
mas o conteúdo não foi decodificado aqui.

## Reexportar

```bash
node marketing/cartoes/export.js
```

Reprova a exportação se algum conteúdo ficar a menos de 5 mm da linha de corte.
