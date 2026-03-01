package maveit.corhuila.MaveitMap.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import maveit.corhuila.MaveitMap.dto.HeatmapDTO;
import maveit.corhuila.MaveitMap.dto.MapaDTO;
import maveit.corhuila.MaveitMap.models.Ventas;
import maveit.corhuila.MaveitMap.services.VentaService;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
@CrossOrigin("*")
public class VentaController {

    private final VentaService service;

    @PostMapping
    public Ventas guardar(@RequestBody Ventas venta) {
        return service.guardar(venta);
    }

    @GetMapping("/mapa")
    public List<MapaDTO> mapaGeneral() {
        return service.obtenerMapaGeneral();
    }

    @GetMapping("/mapa/rango")
    public List<MapaDTO> mapaPorRango(
            @RequestParam LocalDateTime inicio,
            @RequestParam LocalDateTime fin) {
        return service.obtenerMapaPorRango(inicio, fin);
    }

    @GetMapping("/heatmap")
    public List<HeatmapDTO> heatmap() {
        return service.obtenerHeatmap();
    }

    @GetMapping("/analytics/hora")
    public List<Object[]> ventasPorHora() {
        return service.obtenerVentasPorHora();
    }

}
