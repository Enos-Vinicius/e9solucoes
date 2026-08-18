import { Component, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'e9-solucoes';

  constructor() {
    // O ViewportScroller do Angular posiciona o alvo do fragmento com
    // window.scrollTo, então ignora `scroll-margin`. Sem esse recuo o card
    // para embaixo da nav fixa (64px depois do scroll). 112 = o mesmo
    // scroll-mt-28 dos cards, que segue valendo como fallback nativo.
    inject(ViewportScroller).setOffset([0, 112]);
  }
}
