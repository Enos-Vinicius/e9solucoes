# Cartelas de embalagem · E9 Soluções 3D — especificação de impressão

Peça que vai grampeada no topo do saco plástico do produto.

## O arquivo

| | |
|---|---|
| final cortado | **120 × 240 mm** |
| com sangria | **126 × 246 mm** (3 mm em volta) |
| arquivo | `png/e9-cartela-<produto>.png`, 1488 × 2903 px |
| densidade | 300 DPI gravada no próprio PNG (chunk `pHYs`) |
| cores | RGB — a gráfica converte para CMYK |
| impressão | **só frente** |

O PNG carrega a densidade física, então ao abrir no Illustrator/InDesign ele já
entra medindo 126 × 246 mm. Se o programa mostrar outro tamanho, é porque ignorou
o `pHYs` — nesse caso force 300 DPI, não reescale no olho.

## Dobra e montagem

A folha dobra **ao meio, para trás**, na altura de 120 mm (há um tique de dobra
nas duas laterais, dentro da sangria).

```
┌──────────────┐  0 mm
│    VERSO     │   ← impresso girado 180°, de propósito
├ ─ ─ dobra ─ ─┤  120 mm (tique nas laterais)
│    FRENTE    │
└──────────────┘  240 mm
```

Depois de dobrada a cartela fica 120 × 120 mm, com a dobra no topo. O saco
plástico entra dentro da dobra e os grampos atravessam os dois painéis — a faixa
de 15 mm abaixo da dobra foi deixada limpa dos dois lados para receber o grampo
sem furar texto.

**Por que o verso está de cabeça para baixo no arquivo:** ao dobrar a metade de
cima para trás, ela vira. Impressa girada, ela fica na leitura correta no produto
montado. Não "conserte" isso.

## Papel

Sugestão: **couché fosco ou supremo 250–300 g/m²**. Abaixo de 200 g a cartela
enruga no grampo e dobra torto.

**Atenção à cobertura de tinta:** o fundo é carbon (`#06080F`) em área cheia nos
dois painéis. Em gráfica digital isso sai bem; em impressora de mesa costuma
sair manchado e gasta muito toner. Se a tiragem for caseira, peça a versão de
fundo claro antes de rodar — ela não existe ainda, mas é uma variação do mesmo
arquivo.

## Marcas no arquivo

- **cantos**: marcas de corte nos quatro cantos, na sangria
- **laterais, a 120 mm**: tiques de dobra
- `*-guia.png`: a mesma arte com linha de dobra, área útil, margem de segurança
  e faixa do grampo destacadas. **É conferência interna — não mandar para a
  gráfica.**

## Antes de mandar imprimir

- [ ] **Confirmar o @ do Instagram.** As artes trazem `@e9solucoes`, que foi
      deduzido do domínio — não há registro dele em lugar nenhum do projeto.
- [ ] Conferir o telefone: `(34) 99278-2875` (o mesmo do site e do catálogo).
- [ ] Decidir se entra um furo de gancho (não existe no arquivo atual).

## Reexportar

```bash
node marketing/cartelas/export.js
```

O script reprova a exportação se algum conteúdo ficar a menos de **5 mm** da
linha de corte — a altura do painel é fixa e o `overflow:hidden` corta em
silêncio, então essa medição é a única defesa contra mandar para a gráfica uma
peça com o contato cortado.
