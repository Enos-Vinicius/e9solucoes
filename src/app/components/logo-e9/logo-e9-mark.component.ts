import { Component } from '@angular/core';

/**
 * Marca E9 (monograma) — renderiza `assets/img/logo.png` como máscara CSS e
 * pinta o recorte com `currentColor`, então o PNG (originalmente carbono)
 * assume a cor da marca herdada do contexto, igual ao lockup em SVG.
 * Dimensione no host via altura (ex.: `h-12`); o desenho é quadrado.
 */
@Component({
  selector: 'app-logo-e9-mark',
  standalone: true,
  template: `<span class="mark" role="img" aria-label="E9 Soluções"></span>`,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
        color: var(--e9-blue-300);
      }

      .mark {
        display: block;
        height: 100%;
        aspect-ratio: 1 / 1;
        background-color: currentColor;
        -webkit-mask-image: url('/assets/img/logo.png');
        mask-image: url('/assets/img/logo.png');
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-position: center;
        mask-position: center;
        -webkit-mask-size: contain;
        mask-size: contain;
      }
    `,
  ],
})
export class LogoE9MarkComponent {}
