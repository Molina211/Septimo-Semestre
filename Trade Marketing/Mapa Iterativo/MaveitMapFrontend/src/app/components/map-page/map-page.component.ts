import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeroComponent } from '../hero/hero.component';
import { MapCardComponent } from '../map-card/map-card.component';
import { ControlPanelComponent } from '../control-panel/control-panel.component';
import { HeatmapDTO, MapaDTO, VentaApiService, VentaPayload } from '../../services/venta-api.service';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeroComponent, MapCardComponent, ControlPanelComponent],
  template: `
    <div class="page">
      <app-hero [heatEnabled]="heatEnabled" (toggleHeat)="toggleHeatmap()"></app-hero>

      <main class="content">
        <app-map-card
          [puntos]="puntos"
          [heatData]="heatData"
          [heatEnabled]="heatEnabled"
          [nivelOptions]="nivelOptions"
          (mapClicked)="handleMapClick($event)"
        ></app-map-card>

        <app-control-panel
          [selectedCoords]="selectedCoords"
          [ventaForm]="ventaForm"
          [inicioFiltro]="inicioFiltro"
          [finFiltro]="finFiltro"
          [ventasHora]="ventasHora"
          [loading]="loading"
          (guardar)="guardarVenta()"
          (aplicarFiltro)="aplicarFiltro()"
          (resetFiltro)="resetFiltro()"
        ></app-control-panel>
      </main>
    </div>
  `,
  styleUrls: ['./map-page.component.css']
})
export class MapPageComponent implements OnInit {
  puntos: MapaDTO[] = [];
  heatData: HeatmapDTO[] = [];
  ventasHora: [number, number][] = [];
  heatEnabled = true;
  nivelOptions: MapaDTO['nivel'][] = ['ALTO', 'MEDIO', 'BAJO', 'MINIMO'];

  selectedCoords: { lat: number; lng: number } | null = null;
  ventaForm = { nombrePunto: '', cantidad: 0 };
  inicioFiltro = '';
  finFiltro = '';
  loading = false;

  constructor(private readonly ventaApi: VentaApiService) {}

  ngOnInit(): void {
    this.fetchMapaGeneral();
    this.fetchHeatmap();
    this.refreshAnalytics();
  }

  toggleHeatmap(): void {
    this.heatEnabled = !this.heatEnabled;
    if (!this.heatEnabled) {
      this.heatData = [...this.heatData];
    }
  }

  handleMapClick(coords: { lat: number; lng: number }): void {
    this.selectedCoords = coords;
    this.ventaForm.nombrePunto = `Punto ${Date.now()}`;
  }

  guardarVenta(): void {
    if (!this.selectedCoords || this.ventaForm.cantidad <= 0) {
      return;
    }

    const payload: VentaPayload = {
      nombrePunto: this.ventaForm.nombrePunto || `Venta ${new Date().toISOString()}`,
      latitud: this.selectedCoords.lat,
      longitud: this.selectedCoords.lng,
      cantidad: this.ventaForm.cantidad
    };

    this.ventaApi.guardar(payload).subscribe(() => {
      this.selectedCoords = null;
      this.ventaForm = { nombrePunto: '', cantidad: 0 };
      this.fetchMapaGeneral();
      this.refreshAnalytics();
      this.fetchHeatmap();
    });
  }

  aplicarFiltro(): void {
    if (!this.inicioFiltro || !this.finFiltro) {
      return;
    }

    this.loading = true;
    this.ventaApi.mapaPorRango(this.inicioFiltro, this.finFiltro).subscribe({
      next: (data) => {
        this.loading = false;
        this.puntos = data;
      },
      error: () => (this.loading = false)
    });
  }

  resetFiltro(): void {
    this.inicioFiltro = '';
    this.finFiltro = '';
    this.fetchMapaGeneral();
  }

  private fetchMapaGeneral(): void {
    this.ventaApi.mapaGeneral().subscribe((data) => (this.puntos = data));
  }

  private fetchHeatmap(): void {
    this.ventaApi.heatmap().subscribe((data) => (this.heatData = data));
  }

  private refreshAnalytics(): void {
    this.ventaApi.ventasPorHora().subscribe((data) => (this.ventasHora = data));
  }
}
