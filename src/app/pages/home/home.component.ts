import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  computed,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BlueprintGridComponent } from '../../components/blueprint-grid/blueprint-grid.component';
import { LogoE9Component } from '../../components/logo-e9/logo-e9.component';
import { LogoE9MarkComponent } from '../../components/logo-e9/logo-e9-mark.component';

/** Destino das mensagens do formulário de contato — trocar pelo e-mail oficial. */
const CONTACT_EMAIL = 'contato@e9solucoes.com.br';

/** Total de frentes de atuação e o ritmo da contagem 1 → 9. */
const FRENTES_TOTAL = 9;
const FRENTES_STEP_MS = 110;

/** Tempo que cada etapa do processo fica destacada no percurso 01 → 10. */
const ETAPA_STEP_MS = 1500;

interface EtapaProcesso {
  readonly n: number;
  readonly num: string;
  readonly nome: string;
  /** Frase curta exibida no centro da legenda enquanto a etapa está ativa. */
  readonly resumo: string;
  /** 09 · Fundamentação — mantém o rótulo destacado mesmo fora do foco. */
  readonly nucleo?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    BlueprintGridComponent,
    LogoE9Component,
    LogoE9MarkComponent,
  ],
  templateUrl: './home.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  preserveWhitespaces: true,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  /** Header compacto (64px + glass + marca PNG) após sair do topo. */
  readonly scrolled = signal(false);

  /** Percurso 01 → 10 do método, com destaque andando de etapa em etapa. */
  readonly etapas: readonly EtapaProcesso[] = [
    { n: 1, num: '01', nome: 'Abstração', resumo: 'o problema no estado puro' },
    { n: 2, num: '02', nome: 'Hipótese', resumo: 'caminhos possíveis' },
    { n: 3, num: '03', nome: 'Mapa', resumo: 'território e limites' },
    { n: 4, num: '04', nome: 'Modelagem', resumo: 'estrutura do sistema' },
    { n: 5, num: '05', nome: 'Restrição', resumo: 'o que não pode falhar' },
    { n: 6, num: '06', nome: 'Síntese', resumo: 'decisão consolidada' },
    { n: 7, num: '07', nome: 'Prototipagem', resumo: 'forma testável' },
    { n: 8, num: '08', nome: 'Iteração', resumo: 'ajuste sob evidência' },
    { n: 9, num: '09', nome: 'Fundamentação', resumo: 'validação total', nucleo: true },
    { n: 10, num: '10', nome: 'Entrega', resumo: 'manifestação no mercado' },
  ];
  readonly etapaAtiva = signal(1);
  readonly etapaAtual = computed(
    () => this.etapas.find((etapa) => etapa.n === this.etapaAtiva()) ?? this.etapas[0],
  );
  private readonly etapasMatrix = viewChild<ElementRef<HTMLElement>>('etapasMatrix');
  private etapaTimer = 0;
  private etapasObserver?: IntersectionObserver;

  /** Contagem 1 → 9 disparada quando o título da matriz entra na viewport. */
  readonly frentes = signal(1);
  private readonly frentesCounter = viewChild<ElementRef<HTMLElement>>('frentesCounter');
  private frentesTimer = 0;
  private frentesObserver?: IntersectionObserver;

  /** Contato: e-mail, telefone e a descrição do desafio. */
  readonly contactForm = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.pattern(/^[\d\s()+-]{10,}$/)]],
    mensagem: ['', [Validators.required, Validators.minLength(10)]],
  });

  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private rafId = 0;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.zone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.onMove, { passive: true });
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.tick();
    });
    this.onScroll();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.observarContadorFrentes();
    this.observarPercursoEtapas();
  }

  private observarContadorFrentes(): void {
    const el = this.frentesCounter()?.nativeElement;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      this.contarFrentes();
      return;
    }

    // Observer fora da zona (não vale um ciclo de CD por interseção); a contagem
    // volta para dentro dela via zone.run, senão o signal muda sem re-render.
    this.zone.runOutsideAngular(() => {
      this.frentesObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          this.frentesObserver?.disconnect();
          this.zone.run(() => this.contarFrentes());
        },
        { threshold: 0.35 },
      );
      this.frentesObserver.observe(el);
    });
  }

  /** O destaque só anda enquanto a matriz está na tela. */
  private observarPercursoEtapas(): void {
    const el = this.etapasMatrix()?.nativeElement;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      this.andarEtapas();
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.etapasObserver = new IntersectionObserver(
        (entries) => {
          const visivel = entries.some((entry) => entry.isIntersecting);
          this.zone.run(() => (visivel ? this.andarEtapas() : this.pararEtapas()));
        },
        { threshold: 0.2 },
      );
      this.etapasObserver.observe(el);
    });
  }

  private andarEtapas(): void {
    if (this.etapaTimer) return;
    this.etapaTimer = window.setInterval(() => {
      this.zone.run(() => this.etapaAtiva.update((n) => (n % this.etapas.length) + 1));
    }, ETAPA_STEP_MS);
  }

  private pararEtapas(): void {
    if (!this.etapaTimer) return;
    clearInterval(this.etapaTimer);
    this.etapaTimer = 0;
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('scroll', this.onScroll);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.frentesTimer) clearInterval(this.frentesTimer);
    this.frentesObserver?.disconnect();
    this.pararEtapas();
    this.etapasObserver?.disconnect();
  }

  private contarFrentes(): void {
    if (this.frentesTimer) return;
    this.frentes.set(1);
    this.frentesTimer = window.setInterval(() => {
      this.zone.run(() => {
        const proximo = this.frentes() + 1;
        this.frentes.set(proximo);
        if (proximo >= FRENTES_TOTAL) {
          clearInterval(this.frentesTimer);
          this.frentesTimer = 0;
        }
      });
    }, FRENTES_STEP_MS);
  }

  /** Erro só aparece depois que o usuário mexeu no campo. */
  invalid(campo: 'email' | 'telefone' | 'mensagem'): boolean {
    const control = this.contactForm.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    const { email, telefone, mensagem } = this.contactForm.getRawValue();
    const corpo = `E-mail: ${email}\nTelefone: ${telefone}\n\n${mensagem}`;
    window.location.href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent('Contato pelo site — E9 Soluções')}` +
      `&body=${encodeURIComponent(corpo)}`;
  }

  /** Fora da zona: só entra no Angular quando o estado realmente vira. */
  private readonly onScroll = (): void => {
    const compact = window.scrollY > 24;
    if (compact === this.scrolled()) return;
    this.zone.run(() => this.scrolled.set(compact));
  };

  private readonly onMove = (e: MouseEvent): void => {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    this.targetX = (e.clientX / w - 0.5) * 2;
    this.targetY = (e.clientY / h - 0.5) * 2;
  };

  private readonly tick = (): void => {
    this.rafId = requestAnimationFrame(this.tick);
    this.currentX += (this.targetX - this.currentX) * 0.05;
    this.currentY += (this.targetY - this.currentY) * 0.05;
    const el = this.host.nativeElement as HTMLElement;
    // amplitude em px — sutil, sem afetar intensidade visual
    el.style.setProperty('--mx', `${this.currentX * 90}px`);
    el.style.setProperty('--my', `${this.currentY * 60}px`);
  };
}
