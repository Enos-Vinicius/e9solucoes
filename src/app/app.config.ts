import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      // Toda navegação abre no topo; 'reload' faz o clique na logo funcionar
      // mesmo quando já estamos na home (navegação para a mesma URL).
      // 'anchorScrolling' é obrigatório: sem ele o router trata o clique num
      // href="#alvo" como navegação e reposiciona no topo — ou seja, engole
      // o pulo nativo do browser e nenhum link de fragmento funciona.
      // O recuo da nav fixa vive no AppComponent (ViewportScroller.setOffset).
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),
  ],
};
