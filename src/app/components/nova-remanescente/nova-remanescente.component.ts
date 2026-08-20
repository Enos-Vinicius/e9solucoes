import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Remanescente de supernova procedural — a casca em choque de uma estrela que
 * explodiu, no espírito da Kepler/Cassiopeia A.
 *
 * A textura é gerada uma única vez em canvas (aqui) e o movimento é todo do
 * SCSS: cada camada é um <canvas> que o compositor gira, respira e pulsa em
 * ritmos diferentes. Ou seja, zero JavaScript por frame — a página continua
 * respondendo enquanto a nova se mexe.
 *
 * A cor sai do eixo azul da marca (mais o `sky-edge`, o desvio já autorizado
 * do design system). As camadas se somam em `mix-blend-mode: screen`, então
 * onde os filamentos se cruzam o brilho satura para o branco — é isso que dá
 * a sensação de matéria incandescente sem precisar de cor decorativa.
 */

/**
 * Lado do buffer de cada camada. O CSS estica para os ~700px de tela: a
 * nebulosa agradece o borrão, e cada 100px a mais aqui viram tarefa longa
 * na geração (448 custava ~90ms na primeira camada).
 */
const TAMANHO = 352;

interface Camada {
  /** Semente do ruído — troca o desenho inteiro da camada. */
  readonly semente: number;
  readonly cor: readonly [number, number, number];
  /** Onde fica a crista da casca, em raio normalizado (0 = centro, 1 = borda). */
  readonly raio: number;
  /** Espessura da casca: quanto maior, mais difusa. */
  readonly espessura: number;
  /** Frequência do ruído de nuvem. Alto = grão fino. */
  readonly escala: number;
  /** Peso dos filamentos (ruído em crista) sobre a nuvem. */
  readonly filamentos: number;
  readonly ganho: number;
  /** Nós compactos e brilhantes espalhados pela casca. */
  readonly nos: number;
}

const CAMADAS: readonly Camada[] = [
  // corpo difuso · e9-blue-500
  { semente: 17, cor: [0, 111, 255], raio: 0.71, espessura: 0.15, escala: 3.4, filamentos: 0.34, ganho: 0.78, nos: 0 },
  // choque externo · sky-edge (198°), o desvio autorizado
  { semente: 613, cor: [56, 189, 248], raio: 0.85, espessura: 0.07, escala: 6.2, filamentos: 1.05, ganho: 1.1, nos: 13 },
  // miolo mosqueado · e9-blue-200
  { semente: 2711, cor: [179, 210, 249], raio: 0.6, espessura: 0.22, escala: 9.2, filamentos: 0.62, ganho: 0.5, nos: 16 },
];

/** Hash inteiro determinístico — sem Math.random, o desenho é sempre o mesmo. */
function embaralha(x: number, y: number, semente: number): number {
  let h = (x | 0) * 374761393 + (y | 0) * 668265263 + semente * 1274126177;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

/** Ruído de valor com interpolação suave. */
function ruido(x: number, y: number, semente: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = embaralha(xi, yi, semente);
  const b = embaralha(xi + 1, yi, semente);
  const c = embaralha(xi, yi + 1, semente);
  const d = embaralha(xi + 1, yi + 1, semente);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

/** Soma de oitavas: o que transforma ruído em nuvem. */
function nuvem(x: number, y: number, semente: number, oitavas: number): number {
  let soma = 0;
  let amplitude = 0.5;
  let frequencia = 1;
  let norma = 0;
  for (let o = 0; o < oitavas; o++) {
    soma += amplitude * ruido(x * frequencia, y * frequencia, semente + o * 101);
    norma += amplitude;
    amplitude *= 0.5;
    frequencia *= 2;
  }
  return soma / norma;
}

@Component({
  selector: 'app-nova-remanescente',
  standalone: true,
  template: `
    <span class="nucleo" aria-hidden="true"></span>
    @for (camada of camadas; track $index) {
      <canvas
        class="camada"
        [class]="'camada-' + ($index + 1)"
        [width]="tamanho"
        [height]="tamanho"
        aria-hidden="true"
      ></canvas>
    }
  `,
  styleUrl: './nova-remanescente.component.scss',
})
export class NovaRemanescenteComponent implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  readonly camadas = CAMADAS;
  readonly tamanho = TAMANHO;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const telas = Array.from(
      (this.host.nativeElement as HTMLElement).querySelectorAll('canvas'),
    ) as HTMLCanvasElement[];

    // Uma camada por frame: gerar as três de uma vez travaria o primeiro paint.
    this.zone.runOutsideAngular(() => {
      const proxima = (i: number) => {
        if (i >= telas.length) return;
        this.desenhar(telas[i], CAMADAS[i]);
        telas[i].classList.add('pronta');
        requestAnimationFrame(() => proxima(i + 1));
      };
      requestAnimationFrame(() => proxima(0));
    });
  }

  private desenhar(tela: HTMLCanvasElement, camada: Camada): void {
    const ctx = tela.getContext('2d');
    if (!ctx) return;

    const imagem = ctx.createImageData(TAMANHO, TAMANHO);
    const px = imagem.data;
    const { semente, cor, raio, espessura, escala, filamentos, ganho } = camada;
    // fora desta faixa a casca não acende — pular aqui poupa metade do trabalho
    const faixa = espessura * 3 + 0.3;

    for (let y = 0; y < TAMANHO; y++) {
      const ny = (y / TAMANHO - 0.5) * 2;
      for (let x = 0; x < TAMANHO; x++) {
        const nx = (x / TAMANHO - 0.5) * 2;

        // 0,94 no eixo Y: remanescente nenhum é um círculo perfeito
        const bruto = Math.hypot(nx, ny / 0.94);
        if (bruto > 1.04 || Math.abs(bruto - raio) > faixa) continue;

        // deforma o raio com ruído de baixa frequência: a casca fica irregular
        const r = bruto + (nuvem(nx * 1.5, ny * 1.5, semente + 7, 2) - 0.5) * 0.24;
        const d = (r - raio) / espessura;
        const casca = Math.exp(-0.5 * d * d);
        if (casca < 0.004) continue;

        const difuso = nuvem(nx * escala, ny * escala, semente, 4);
        // ruído em crista: 1 nas dobras do ruído — é o que vira filamento
        const cordao = 1 - Math.abs(nuvem(nx * escala * 1.9, ny * escala * 1.9, semente + 31, 3) * 2 - 1);

        // assimetria: no céu real um lado da casca é mais brilhante que o
        // outro (a explosão encontra matéria desigual). Ruído bem lento.
        const assimetria = 0.42 + 1.15 * nuvem(nx * 0.75 + 3, ny * 0.75 + 3, semente + 91, 2);
        const brilho =
          casca * (0.1 + 0.95 * difuso * difuso + filamentos * Math.pow(cordao, 3.4)) * ganho * assimetria;
        // apaga o que passar da borda do disco, para não cortar em quadrado
        const corte = bruto > 0.94 ? Math.max(0, 1 - (bruto - 0.94) / 0.1) : 1;
        const alfa = Math.min(1, brilho) * corte;
        if (alfa <= 0.002) continue;

        const i = (y * TAMANHO + x) * 4;
        px[i] = cor[0];
        px[i + 1] = cor[1];
        px[i + 2] = cor[2];
        px[i + 3] = (alfa * 255) | 0;
      }
    }

    ctx.putImageData(imagem, 0, 0);
    if (camada.nos > 0) this.acenderNos(ctx, camada);
  }

  /** Nós: os pontos compactos que a explosão deixa presos na casca. */
  private acenderNos(ctx: CanvasRenderingContext2D, camada: Camada): void {
    const meio = TAMANHO / 2;
    ctx.globalCompositeOperation = 'lighter';

    for (let n = 0; n < camada.nos; n++) {
      const angulo = embaralha(n, 91, camada.semente) * Math.PI * 2;
      const raio = (camada.raio + (embaralha(n, 17, camada.semente) - 0.5) * camada.espessura * 1.6) * meio;
      const cx = meio + Math.cos(angulo) * raio;
      const cy = meio + Math.sin(angulo) * raio * 0.94;
      const tamanho = (3 + embaralha(n, 53, camada.semente) * 7) * (TAMANHO / 448);

      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, tamanho);
      halo.addColorStop(0, 'rgba(237,244,253,0.9)');
      halo.addColorStop(0.35, 'rgba(179,210,249,0.4)');
      halo.addColorStop(1, 'rgba(0,111,255,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, tamanho, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
  }
}
