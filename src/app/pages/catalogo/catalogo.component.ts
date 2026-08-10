import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlueprintGridComponent } from '../../components/blueprint-grid/blueprint-grid.component';
import { LogoE9Component } from '../../components/logo-e9/logo-e9.component';

/** Contato de orçamento da impressão 3D enquanto o catálogo está fora do ar. */
const WHATSAPP_NUMERO = '5534992782875';
const WHATSAPP_MENSAGEM =
  'Olá! Vim pelo site da E9 e gostaria de solicitar um orçamento de impressão 3D.';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink, BlueprintGridComponent, LogoE9Component],
  templateUrl: './catalogo.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [
    `
      .logo-stage {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 44px;
      }

      /* aura pulsante atrás da marca */
      .aura {
        position: absolute;
        inset: -18%;
        border-radius: 50%;
        pointer-events: none;
        background: radial-gradient(
          circle,
          rgba(0, 91, 209, 0.38),
          rgba(0, 111, 255, 0.14) 45%,
          transparent 70%
        );
        filter: blur(8px);
        animation: auraPulse 3.6s ease-in-out infinite;
      }

      /* a marca herda a cor via currentColor: a piscada troca cor + brilho */
      .logo {
        position: relative;
        color: var(--e9-blue-300);
        animation: logoBlink 2.8s ease-in-out infinite;
      }

      .sparkle {
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 0 12px 3px rgba(147, 197, 253, 0.9);
        opacity: 0;
        pointer-events: none;
        animation: twinkle 4.2s ease-in-out infinite;
      }
      .s1 { top: 6%; left: 10%; animation-delay: 0.2s; }
      .s2 { top: 20%; right: 6%; animation-delay: 1.5s; }
      .s3 { bottom: 12%; left: 18%; animation-delay: 2.7s; }
      .s4 { bottom: 4%; right: 16%; animation-delay: 3.6s; }

      @keyframes auraPulse {
        0%, 100% { opacity: 0.55; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.08); }
      }

      /* lâmpada acendendo: duas piscadas rápidas e uma respirada — no máximo
         2 estouros por ciclo, bem abaixo do limite de 3 flashes/s */
      @keyframes logoBlink {
        0%, 100% {
          opacity: 0.75;
          color: var(--e9-blue-300);
          filter: drop-shadow(0 0 16px rgba(0, 91, 209, 0.5));
        }
        8% {
          opacity: 1;
          color: #ffffff;
          filter: drop-shadow(0 0 48px rgba(147, 197, 253, 0.95));
        }
        15% {
          opacity: 0.6;
          color: var(--e9-blue-300);
          filter: drop-shadow(0 0 14px rgba(0, 91, 209, 0.45));
        }
        24% {
          opacity: 1;
          color: #ffffff;
          filter: drop-shadow(0 0 60px rgba(191, 219, 254, 1));
        }
        40% {
          opacity: 0.95;
          color: var(--e9-blue-300);
          filter: drop-shadow(0 0 34px rgba(71, 149, 250, 0.8));
        }
        70% {
          opacity: 0.82;
          color: var(--e9-blue-300);
          filter: drop-shadow(0 0 22px rgba(0, 91, 209, 0.6));
        }
      }

      @keyframes twinkle {
        0%, 100% { opacity: 0; transform: scale(0.4); }
        12% { opacity: 1; transform: scale(1); }
        30% { opacity: 0; transform: scale(0.5); }
      }

      @media (prefers-reduced-motion: reduce) {
        .aura, .logo, .sparkle { animation: none; }
        .logo {
          opacity: 1;
          filter: drop-shadow(0 0 26px rgba(0, 91, 209, 0.65));
        }
      }
    `,
  ],
})
export class CatalogoComponent {
  readonly whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`;
}
