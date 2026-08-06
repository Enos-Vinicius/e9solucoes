import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoE9Component } from '../../components/logo-e9/logo-e9.component';

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [RouterLink, LogoE9Component],
  templateUrl: './design-system.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  preserveWhitespaces: true,
})
export class DesignSystemComponent {}
