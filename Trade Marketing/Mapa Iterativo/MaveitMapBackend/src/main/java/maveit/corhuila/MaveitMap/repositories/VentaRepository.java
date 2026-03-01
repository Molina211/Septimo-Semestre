package maveit.corhuila.MaveitMap.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import maveit.corhuila.MaveitMap.models.Ventas;

public interface VentaRepository extends JpaRepository<Ventas, Long> {

    // Agrupar por ubicación
    @Query("SELECT v.latitud, v.longitud, SUM(v.cantidad) " +
            "FROM Ventas v " +
            "GROUP BY v.latitud, v.longitud")
    List<Object[]> obtenerVentasAgrupadas();

    // Agrupar por rango de fecha
    @Query("SELECT v.latitud, v.longitud, SUM(v.cantidad) " +
            "FROM Ventas v " +
            "WHERE v.fecha BETWEEN :inicio AND :fin " +
            "GROUP BY v.latitud, v.longitud")
    List<Object[]> ventasPorRango(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin);

    // Ventas por hora
    @Query("SELECT v.hora, SUM(v.cantidad) " +
            "FROM Ventas v " +
            "GROUP BY v.hora " +
            "ORDER BY v.hora")
    List<Object[]> ventasPorHora();
}