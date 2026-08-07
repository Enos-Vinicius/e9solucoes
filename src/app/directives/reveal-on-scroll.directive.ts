import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Intervalo entre os blocos de um mesmo grupo e teto para grades longas. */
const STAGGER_MS = 90;
const MAX_STAGGER_STEPS = 6;

/** Dispara um pouco antes do bloco encostar na borda inferior da viewport. */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: '0px 0px -12% 0px',
  threshold: 0,
};

/**
 * Reproduz o fade-in-up do hero nas demais seções, porém disparado quando o
 * conteúdo entra na viewport — cada bloco anima uma única vez.
 *
 * Aplique no contêiner da seção: os filhos diretos viram os blocos animados e,
 * quando um filho é um grid, seus cartões entram em sequência no lugar dele.
 * O estado inicial (invisível) é escrito só no browser, então SSR e navegação
 * sem JS continuam entregando a seção visível. Quem pede menos movimento recebe
 * só o fade — a intensidade fica no CSS (`.reveal`), não aqui.
 */
@Directive({
  selector: '[e9RevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!('IntersectionObserver' in window)) return;

    const alvos = this.coletarAlvos();
    if (!alvos.length) return;

    // Marca antes do primeiro paint: some sem piscar na tela.
    for (const { el, ordem } of alvos) {
      el.classList.add('reveal');
      el.style.setProperty(
        '--reveal-delay',
        `${Math.min(ordem, MAX_STAGGER_STEPS) * STAGGER_MS}ms`,
      );
    }

    // Observer fora da zona: interseção não muda estado do Angular, só classe.
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver((entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      }, OBSERVER_OPTIONS);

      for (const { el } of alvos) this.observer!.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  /** Blocos da seção, já com a ordem de entrada dentro do próprio grupo. */
  private coletarAlvos(): readonly { el: HTMLElement; ordem: number }[] {
    const blocos = this.filhosAnimaveis(this.host.nativeElement);

    return blocos.flatMap((bloco, i) => {
      const cartoes = bloco.classList.contains('grid')
        ? this.filhosAnimaveis(bloco)
        : [];
      return cartoes.length > 1
        ? cartoes.map((el, j) => ({ el, ordem: j }))
        : [{ el: bloco, ordem: i }];
    });
  }

  /** Ignora camadas decorativas soltas (halos, lattices) posicionadas fora do fluxo. */
  private filhosAnimaveis(el: HTMLElement): HTMLElement[] {
    return Array.from(el.children).filter((filho): filho is HTMLElement => {
      if (!(filho instanceof HTMLElement)) return false;
      const posicao = getComputedStyle(filho).position;
      return posicao !== 'absolute' && posicao !== 'fixed';
    });
  }
}
