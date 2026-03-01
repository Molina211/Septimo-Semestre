package maveit.corhuila.MaveitMap.services;

import java.time.LocalDateTime;
import java.util.List;

import maveit.corhuila.MaveitMap.dto.HeatmapDTO;
import maveit.corhuila.MaveitMap.dto.MapaDTO;
import maveit.corhuila.MaveitMap.models.Ventas;

public interface VentaService {

    Ventas guardar(Ventas venta);

    List<MapaDTO> obtenerMapaGeneral();

    List<MapaDTO> obtenerMapaPorRango(LocalDateTime inicio, LocalDateTime fin);

    List<HeatmapDTO> obtenerHeatmap();

    List<Object[]> obtenerVentasPorHora();

}
