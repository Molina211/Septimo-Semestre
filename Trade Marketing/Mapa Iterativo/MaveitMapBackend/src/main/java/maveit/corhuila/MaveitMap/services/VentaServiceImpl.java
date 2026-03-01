package maveit.corhuila.MaveitMap.services;

import lombok.RequiredArgsConstructor;
import maveit.corhuila.MaveitMap.dto.HeatmapDTO;
import maveit.corhuila.MaveitMap.dto.MapaDTO;
import maveit.corhuila.MaveitMap.models.Ventas;
import maveit.corhuila.MaveitMap.repositories.VentaRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaServiceImpl implements VentaService {

    private final VentaRepository repository;

    @Override
    public Ventas guardar(Ventas venta) {
        return repository.save(venta);
    }

    @Override
    public List<MapaDTO> obtenerMapaGeneral() {
        return procesarResultados(repository.obtenerVentasAgrupadas());
    }

    @Override
    public List<MapaDTO> obtenerMapaPorRango(LocalDateTime inicio, LocalDateTime fin) {
        return procesarResultados(repository.ventasPorRango(inicio, fin));
    }

    @Override
    public List<HeatmapDTO> obtenerHeatmap() {

        List<Object[]> datos = repository.obtenerVentasAgrupadas();

        long max = datos.stream()
                .mapToLong(r -> ((Number) r[2]).longValue())
                .max()
                .orElse(1);

        return datos.stream()
                .map(r -> new HeatmapDTO(
                        (Double) r[0],
                        (Double) r[1],
                        ((Number) r[2]).doubleValue() / max))
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> obtenerVentasPorHora() {
        return repository.ventasPorHora();
    }

    // Método interno para calcular nivel
    private List<MapaDTO> procesarResultados(List<Object[]> resultados) {
        return resultados.stream().map(r -> {
            Double lat = (Double) r[0];
            Double lng = (Double) r[1];
            Long total = ((Number) r[2]).longValue();
            String nivel = calcularNivel(total);
            return new MapaDTO(lat, lng, total, nivel);
        }).collect(Collectors.toList());
    }

    private String calcularNivel(Long total) {
        if (total > 200)
            return "ALTO";
        if (total > 100)
            return "MEDIO";
        if (total > 50)
            return "BAJO";
        return "MINIMO";
    }

}
