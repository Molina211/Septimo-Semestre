import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapaDTO } from '../../services/venta-api.service';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="control-card">
      <form (ngSubmit)="guardar.emit()" class="form">
        <h3>Nuevo punto registrado</h3>
        <p class="muted">
          Haz clic en el mapa para fijar ubicación, añade nombre y cantidad de ventas y guarda el evento con un solo
          click.
        </p>

        <label>
          Nombre del punto
          <input
            name="nombrePunto"
            [(ngModel)]="ventaForm.nombrePunto"
            placeholder="Ej. Tienda Norte"
            required
          />
        </label>

        <label>
          Ventas registradas
          <input
            type="number"
            name="cantidad"
            [(ngModel)]="ventaForm.cantidad"
            min="1"
            required
          />
        </label>

        <div class="coords" *ngIf="selectedCoords">
          Coordenadas seleccionadas:
          <span>{{ selectedCoords.lat.toFixed(5) }}, {{ selectedCoords.lng.toFixed(5) }}</span>
        </div>

        <div class="buttons">
          <button type="submit" [disabled]="!selectedCoords || ventaForm.cantidad <= 0">
            Guardar punto
          </button>
        </div>
      </form>

      <div class="filters">
        <h3>Filtrar por rango</h3>
        <p class="muted">Define una apertura temporal y el mapa solo mostrará esos eventos.</p>

        <label>
          Desde
          <input name="inicio" [(ngModel)]="inicioFiltro" type="datetime-local" />
        </label>
        <label>
          Hasta
          <input name="fin" [(ngModel)]="finFiltro" type="datetime-local" />
        </label>

        <div class="buttons">
          <button type="button" (click)="aplicarFiltro.emit()" [disabled]="loading">
            {{ loading ? 'Aplicando...' : 'Aplicar filtro' }}
          </button>
          <button type="button" class="ghost" (click)="resetFiltro.emit()">Ver mapa completo</button>
        </div>
      </div>

      <div class="analytics">
        <header>
          <h3>Ventas por hora</h3>
          <p class="muted">Temporaliza tu operación y detecta horas pico.</p>
        </header>
        <ul>
          <li *ngFor="let item of ventasHora">
            <span>{{ item[0] }}:00</span>
            <strong>{{ item[1] }} ventas</strong>
          </li>
        </ul>
      </div>
    </section>
  `,
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent {
  @Input() selectedCoords: { lat: number; lng: number } | null = null;
  @Input() ventaForm: { nombrePunto: string; cantidad: number } = { nombrePunto: '', cantidad: 0 };
  @Input() inicioFiltro = '';
  @Input() finFiltro = '';
  @Input() ventasHora: [number, number][] = [];
  @Input() loading = false;

  @Output() guardar = new EventEmitter<void>();
  @Output() aplicarFiltro = new EventEmitter<void>();
  @Output() resetFiltro = new EventEmitter<void>();
}
