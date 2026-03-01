import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="hero">
      <div>
        <p class="eyebrow">Live Trade Intelligence</p>
        <h1>{{ title }}</h1>
        <p class="lead">
          Haz clic en el mapa para identificar puntos activos, guarda datos y observa cómo se colorea el escenario
          en tiempo real.
        </p>
      </div>
      <div class="status-chip">
        <span>Heatmap</span>
        <button type="button" (click)="toggleHeat.emit()">
          {{ heatEnabled ? 'Desactivar' : 'Activar' }}
        </button>
      </div>
    </header>
  `,
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  @Input() title = 'Mapa interactivo de ventas';
  @Input() heatEnabled = true;
  @Output() toggleHeat = new EventEmitter<void>();
}
