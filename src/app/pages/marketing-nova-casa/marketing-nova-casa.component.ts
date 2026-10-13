import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

/**
 * Board de entrega da Nova Casa — móveis planejados.
 *
 * Primeiro cliente da frente de Marketing. **O sistema visual aqui é o dele,
 * não o da E9**: paleta medida da logo (monocromática) + acento de madeira,
 * serif no display, superfície clara. Tudo vive no SCSS deste componente e
 * nada é registrado no `tailwind.config.js` nem no `src/styles.scss` — um
 * cliente novo entra como uma pasta nova, sem tocar no design system da casa.
 * As regras estão em `marketing/novacasa/MARCA.md`.
 *
 * As artes não são copiadas: `marketing/novacasa/` é publicado como asset em
 * `/marketing-nova-casa` (ver `angular.json`). Reexportou, atualizou.
 */

interface Arte {
  /** Nome do arquivo sem extensão, em /marketing-nova-casa/png. */
  readonly arquivo: string;
  readonly titulo: string;
  readonly nota?: string;
}

const POSTS: readonly Arte[] = [
  { arquivo: 'nc-post-01', titulo: '01 · Capa', nota: 'a marca se apresenta' },
  { arquivo: 'nc-post-02', titulo: '02 · Manifesto', nota: 'por que planejado' },
  { arquivo: 'nc-post-03', titulo: '03 · Ambientes', nota: 'o que projetamos' },
  { arquivo: 'nc-post-04', titulo: '04 · Cozinha', nota: 'a rotina primeiro' },
  { arquivo: 'nc-post-05', titulo: '05 · Dormitório e closet', nota: 'guardar sem ver' },
  { arquivo: 'nc-post-06', titulo: '06 · Home office', nota: 'trabalho que fecha a porta' },
  { arquivo: 'nc-post-07', titulo: '07 · Processo', nota: 'da trena à montagem' },
  { arquivo: 'nc-post-08', titulo: '08 · Material', nota: 'o que segura o acabamento' },
  { arquivo: 'nc-post-09', titulo: '09 · Chamada', nota: 'o convite' },
];

/** Série de intercalar: uma frase por arte, tipo grande, convite ao orçamento. */
const FRASES: readonly Arte[] = [
  { arquivo: 'nc-frase-01', titulo: 'O armário e a casa', nota: 'não o contrário' },
  { arquivo: 'nc-frase-02', titulo: 'Medida certa', nota: 'não se compra pronta' },
  { arquivo: 'nc-frase-03', titulo: 'Bagunça', nota: 'é falta de projeto' },
  { arquivo: 'nc-frase-04', titulo: 'Canto morto', nota: 'vira o melhor armário' },
  { arquivo: 'nc-frase-05', titulo: 'Projeto 3D', nota: 'antes de existir' },
  { arquivo: 'nc-frase-06', titulo: 'Loja x planejado', nota: 'a gente faz o que falta' },
  { arquivo: 'nc-frase-07', titulo: 'A medição', nota: 'por nossa conta' },
  { arquivo: 'nc-frase-08', titulo: '100% do vão', nota: 'inclusive o pé-direito' },
  { arquivo: 'nc-frase-09', titulo: 'Ponto de vista', nota: 'você resolve a casa' },
  { arquivo: 'nc-frase-10', titulo: '"Quanto custa?"', nota: 'manda a medida' },
  { arquivo: 'nc-frase-11', titulo: 'A gaveta', nota: 'detalhe que fica' },
  { arquivo: 'nc-frase-12', titulo: 'Convite final', nota: 'falta o projeto' },
];

const PERFIL: readonly Arte[] = [
  { arquivo: 'nc-perfil-linho', titulo: 'linho · recomendada' },
  { arquivo: 'nc-perfil-tinta', titulo: 'tinta' },
  { arquivo: 'nc-perfil-areia', titulo: 'areia' },
];

const DESTAQUES: readonly Arte[] = [
  { arquivo: 'nc-destaque-cozinha', titulo: 'Cozinha' },
  { arquivo: 'nc-destaque-dormitorio', titulo: 'Dormitório' },
  { arquivo: 'nc-destaque-closet', titulo: 'Closet' },
  { arquivo: 'nc-destaque-home-office', titulo: 'Home office' },
  { arquivo: 'nc-destaque-living', titulo: 'Living' },
  { arquivo: 'nc-destaque-banheiro', titulo: 'Banheiro' },
  { arquivo: 'nc-destaque-projeto-3d', titulo: 'Projeto 3D' },
  { arquivo: 'nc-destaque-orcamento', titulo: 'Orçamento' },
];

/** Fraunces + Inter: a tipografia é do cliente, então entra só nesta página. */
const FONTES =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600' +
  '&family=Inter:wght@300;400;500;600&display=swap';

@Component({
  selector: 'app-marketing-nova-casa',
  standalone: true,
  imports: [RouterLink, RevealOnScrollDirective],
  templateUrl: './marketing-nova-casa.component.html',
  styleUrl: './marketing-nova-casa.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  preserveWhitespaces: true,
})
export class MarketingNovaCasaComponent {
  private readonly doc = inject(DOCUMENT);

  readonly posts = POSTS;
  readonly frases = FRASES;
  readonly perfil = PERFIL;
  readonly destaques = DESTAQUES;
  readonly base = '/marketing-nova-casa';

  constructor() {
    // Carregada em runtime, e não no index.html, para não custar uma
    // requisição de fonte em todas as páginas do site por causa de uma só.
    if (!this.doc.querySelector('link[data-fonte="novacasa"]')) {
      const link = this.doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONTES;
      link.dataset['fonte'] = 'novacasa';
      this.doc.head.appendChild(link);
    }
  }
}
