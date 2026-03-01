import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet.heat';
import { HeatmapDTO, MapaDTO } from '../../services/venta-api.service';

@Component({
  selector: 'app-map-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="map-card">
      <div class="card-header">
        <div>
          <h2>Mapa de ventas</h2>
          <p class="muted">Coordenadas actualizadas según tu backend.</p>
        </div>
        <div class="legend">
          <span
            *ngFor="let nivel of nivelOptions"
            class="legend-chip"
            [style.background]="colorFromNivel(nivel)"
          >
            {{ nivel }}
          </span>
        </div>
      </div>
      <div class="map-wrapper">
        <div #mapElement class="map-area"></div>
      </div>
    </section>
  `,
  styleUrls: ['./map-card.component.css']
})
export class MapCardComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() puntos: MapaDTO[] = [];
  @Input() heatData: HeatmapDTO[] = [];
  @Input() heatEnabled = true;
  @Input() nivelOptions: MapaDTO['nivel'][] = ['ALTO', 'MEDIO', 'BAJO', 'MINIMO'];
  @Output() mapClicked = new EventEmitter<{ lat: number; lng: number }>();

  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private markers: L.CircleMarker[] = [];
  private heatLayer?: L.Layer;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapElement.nativeElement, { zoomControl: true }).setView([4.711, -74.0721], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.map.on('click', (event) => {
      this.mapClicked.emit({ lat: event.latlng.lat, lng: event.latlng.lng });
    });

    this.renderMarkers();
    this.updateHeatLayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes['puntos']) {
      this.renderMarkers();
    }

    if (this.map && (changes['heatData'] || changes['heatEnabled'])) {
      this.updateHeatLayer();
    }
  }

  ngOnDestroy(): void {
    this.markers.forEach((marker) => marker.remove());
    this.heatLayer?.remove();
    this.map?.remove();
  }

  private renderMarkers(): void {
    if (!this.map) return;
    this.markers.forEach((marker) => marker.remove());
    this.markers = this.puntos.map((punto) =>
      L.circleMarker([punto.latitud, punto.longitud], {
        radius: 10,
        color: this.colorFromNivel(punto.nivel),
        fillColor: this.colorFromNivel(punto.nivel),
        fillOpacity: 0.6,
        weight: 1.5
      }).bindPopup(`
        <strong>${punto.nivel}</strong><br />
        ${punto.totalVentas} ventas<br />
        [${punto.latitud.toFixed(5)}, ${punto.longitud.toFixed(5)}]
      `)
        .addTo(this.map!)
    );
  }

  private updateHeatLayer(): void {
    if (!this.map) return;
    if (!this.heatEnabled) {
      this.heatLayer?.remove();
      this.heatLayer = undefined;
      return;
    }

    const heatPoints = this.heatData.map((item) => [item.latitud, item.longitud, item.intensidad]);
    if (this.heatLayer) {
      (this.heatLayer as any).setLatLngs(heatPoints);
    } else {
      this.heatLayer = (L as any).heatLayer(heatPoints, {
        radius: 25,
        blur: 20,
        maxZoom: 17
      }).addTo(this.map);
    }
  }

  colorFromNivel(nivel: MapaDTO['nivel']): string {
    return {
      MINIMO: '#2C7BE5',
      BAJO: '#09AB3F',
      MEDIO: '#FFA500',
      ALTO: '#FF2D55'
    }[nivel];
  }
}
