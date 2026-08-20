import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoE9Component } from '../../components/logo-e9/logo-e9.component';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

/**
 * Board interno das artes de Instagram.
 *
 * Os arquivos NÃO são copiados para cá: `marketing/instagram/` é publicado
 * como asset em `/marketing` (ver `angular.json`), então o que esta página
 * mostra é exatamente o que os scripts de export geram. Reexportou, atualizou.
 *
 * As listas abaixo espelham as dos scripts (`export.js`, `export-perfil.js`,
 * `export-destaques.js`) — arte nova pede uma linha nova aqui.
 *
 * A seção 04 entrega um link só: `/marketing/preview.html`, o board que vai
 * para o cliente. As outras páginas-fonte (`posts.html`, `perfil.html`,
 * `destaques.html`, `favicon.html`) continuam servidas, só não são listadas.
 */

interface Arte {
  /** Nome do arquivo sem extensão, dentro de /marketing/png. */
  readonly arquivo: string;
  readonly titulo: string;
  /** Preview leve em /marketing/preview — o PNG cheio fica no link. */
  readonly preview: string;
}

const POSTS: readonly Arte[] = [
  { arquivo: 'e9-post-01', titulo: '01 · Capa — a marca', preview: 'p01' },
  { arquivo: 'e9-post-02', titulo: '02 · Manifesto — quem somos', preview: 'p02' },
  { arquivo: 'e9-post-03', titulo: '03 · As 9 frentes', preview: 'p03' },
  { arquivo: 'e9-post-04', titulo: '04 · Software House', preview: 'p04' },
  { arquivo: 'e9-post-05', titulo: '05 · Impressão 3D', preview: 'p05' },
  { arquivo: 'e9-post-06', titulo: '06 · Inteligência Artificial', preview: 'p06' },
  { arquivo: 'e9-post-07', titulo: '07 · Design Inteligente', preview: 'p07' },
  { arquivo: 'e9-post-08', titulo: '08 · Transparência', preview: 'p08' },
  { arquivo: 'e9-post-09', titulo: '09 · Chamada final', preview: 'p09' },
];

const PERFIL: readonly Arte[] = [
  { arquivo: 'e9-perfil-platina-marca', titulo: 'platina-marca · recomendada', preview: 'perfil-platina-marca' },
  { arquivo: 'e9-perfil-marca-carbon', titulo: 'marca-carbon', preview: 'perfil-marca-carbon' },
  { arquivo: 'e9-perfil-gradiente', titulo: 'gradiente', preview: 'perfil-gradiente' },
];

const DESTAQUES: readonly Arte[] = [
  { arquivo: 'e9-destaque-software', titulo: 'Software House', preview: 'destaque-software' },
  { arquivo: 'e9-destaque-impressao-3d', titulo: 'Impressão 3D', preview: 'destaque-impressao-3d' },
  { arquivo: 'e9-destaque-ia', titulo: 'Inteligência Artificial', preview: 'destaque-ia' },
  { arquivo: 'e9-destaque-suporte', titulo: 'Suporte & Treinamento', preview: 'destaque-suporte' },
  { arquivo: 'e9-destaque-marketing', titulo: 'Marketing', preview: 'destaque-marketing' },
  { arquivo: 'e9-destaque-branding', titulo: 'Branding', preview: 'destaque-branding' },
  { arquivo: 'e9-destaque-consultoria', titulo: 'Consultoria', preview: 'destaque-consultoria' },
  { arquivo: 'e9-destaque-info-produto', titulo: 'Info Produto', preview: 'destaque-info-produto' },
  { arquivo: 'e9-destaque-automacao', titulo: 'Automação Residencial', preview: 'destaque-automacao' },
  { arquivo: 'e9-destaque-a-e9', titulo: 'A E9', preview: 'destaque-a-e9' },
  { arquivo: 'e9-destaque-orcamento', titulo: 'Orçamento', preview: 'destaque-orcamento' },
  { arquivo: 'e9-destaque-catalogo', titulo: 'Catálogo', preview: 'destaque-catalogo' },
];

@Component({
  selector: 'app-marketing',
  standalone: true,
  imports: [RouterLink, LogoE9Component, RevealOnScrollDirective],
  templateUrl: './marketing.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  preserveWhitespaces: true,
})
export class MarketingComponent {
  readonly posts = POSTS;
  readonly perfil = PERFIL;
  readonly destaques = DESTAQUES;

  /** Raiz dos assets publicados a partir de marketing/instagram. */
  readonly base = '/marketing';
}
