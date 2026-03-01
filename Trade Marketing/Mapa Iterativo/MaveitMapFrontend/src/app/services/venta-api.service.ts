import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MapaDTO {
  latitud: number;
  longitud: number;
  totalVentas: number;
  nivel: 'MINIMO' | 'BAJO' | 'MEDIO' | 'ALTO';
}

export interface HeatmapDTO {
  latitud: number;
  longitud: number;
  intensidad: number;
}

export interface VentaPayload {
  nombrePunto: string;
  latitud: number;
  longitud: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class VentaApiService {
  private readonly baseUrl = '/api/ventas';

  constructor(private readonly http: HttpClient) {}

  guardar(venta: VentaPayload): Observable<VentaPayload> {
    return this.http.post<VentaPayload>(this.baseUrl, venta);
  }

  mapaGeneral(): Observable<MapaDTO[]> {
    return this.http.get<MapaDTO[]>(`${this.baseUrl}/mapa`);
  }

  mapaPorRango(inicio: string, fin: string): Observable<MapaDTO[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<MapaDTO[]>(`${this.baseUrl}/mapa/rango`, { params });
  }

  heatmap(): Observable<HeatmapDTO[]> {
    return this.http.get<HeatmapDTO[]>(`${this.baseUrl}/heatmap`);
  }

  ventasPorHora(): Observable<[number, number][]> {
    return this.http.get<[number, number][]>(`${this.baseUrl}/analytics/hora`);
  }
}
