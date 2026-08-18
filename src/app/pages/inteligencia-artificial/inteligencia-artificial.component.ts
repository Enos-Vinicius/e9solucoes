import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlueprintGridComponent } from '../../components/blueprint-grid/blueprint-grid.component';
import { LogoE9Component } from '../../components/logo-e9/logo-e9.component';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

/** Mesmo canal de orçamento usado no catálogo — resposta rápida no WhatsApp. */
const WHATSAPP_NUMERO = '5534992782875';
const WHATSAPP_MENSAGEM =
  'Olá! Vim pela página de Inteligência Artificial da E9 e quero mapear uma tarefa que meu time repete.';

@Component({
  selector: 'app-inteligencia-artificial',
  standalone: true,
  imports: [RouterLink, BlueprintGridComponent, LogoE9Component, RevealOnScrollDirective],
  templateUrl: './inteligencia-artificial.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  preserveWhitespaces: true,
})
export class InteligenciaArtificialComponent {
  readonly whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`;

  /** No template via interpolação: um "@" solto no HTML confunde o parser de blocos. */
  readonly contato = 'e9solucoestecnologicas@gmail.com';
}
