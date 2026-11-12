# Folders de produto · E9 Soluções 3D — especificação de impressão

Folder que acompanha a peça impressa em 3D.

## O arquivo

| | |
|---|---|
| final cortado | **210 × 148 mm** (A5 deitado) |
| fechado | **105 × 148 mm** (A6 de pé), uma dobra vertical no meio |
| com sangria | **216 × 154 mm** (3 mm em volta) |
| arquivos | `png/e9-folder-<produto>-externo.png` e `-interno.png`, 2550 × 1819 px |
| densidade | 300 DPI gravada no próprio PNG (chunk `pHYs`) |
| cores | RGB — a gráfica converte para CMYK |
| impressão | **frente e verso** |

## Como as faces se distribuem

```
EXTERNO   [ contracapa | capa     ]
INTERNO   [ a ideia    | cuidados ]
```

Dobra vertical não inverte nada: as duas faces de cada folha leem na mesma
orientação. Dobrando a metade direita para trás, a capa fica por cima.

Há um tique de dobra no topo e no pé, dentro da sangria, na marca de 105 mm.

## Papel

Couché fosco 170–250 g/m². Abaixo de 150 g o folder fica mole e a dobra marca
mal. O fundo é carbon (`#06080F`) em área cheia nas quatro faces — isso sai bem
em gráfica digital, mas em impressora de mesa mancha e gasta muito toner.

## O QR

Aponta para `https://www.instagram.com/e9.solucoes`. É um QR versão 3 (29 × 29
módulos), ECC M, impresso a 24 mm — bem acima do mínimo de leitura.

Ele está em `marketing/identidade/png/qr-instagram.png`, gerado uma vez e
versionado. **Escaneie uma vez antes de rodar a tiragem**: a estrutura do código
foi conferida (os três olhos e a contagem de módulos), mas o conteúdo não foi
decodificado aqui — o Chrome desta máquina não expõe `BarcodeDetector`.

## Antes de mandar imprimir

- [ ] Escanear o QR com o celular e confirmar que abre o perfil certo.
- [ ] Conferir o telefone: `(34) 99278-2875`.
- [ ] Decidir o papel e pedir prova impressa antes da tiragem cheia.

## Reexportar

```bash
node marketing/folders/export.js
```

O script reprova a exportação se algum conteúdo ficar a menos de **5 mm** da
linha de corte.
