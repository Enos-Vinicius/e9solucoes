import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'E9 Soluções',
  },
  {
    path: 'design-system',
    loadComponent: () =>
      import('./pages/design-system/design-system.component').then(
        (m) => m.DesignSystemComponent,
      ),
    title: 'E9 Soluções',
  },
  {
    path: 'inteligencia-artificial',
    loadComponent: () =>
      import('./pages/inteligencia-artificial/inteligencia-artificial.component').then(
        (m) => m.InteligenciaArtificialComponent,
      ),
    title: 'E9 Soluções · Inteligência Artificial',
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalogo/catalogo.component').then((m) => m.CatalogoComponent),
    title: 'E9 Soluções · Catálogo',
  },
  { path: '**', redirectTo: '' },
];
