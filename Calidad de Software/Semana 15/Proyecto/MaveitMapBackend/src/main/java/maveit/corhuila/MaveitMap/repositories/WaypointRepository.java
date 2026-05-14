package maveit.corhuila.MaveitMap.repositories;

import java.util.List;
import java.util.Optional;
import maveit.corhuila.MaveitMap.models.Waypoint;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WaypointRepository extends JpaRepository<Waypoint, Long> {

    @Query("SELECT w FROM Waypoint w WHERE (LOWER(w.name) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(w.label) LIKE LOWER(CONCAT('%', :term, '%'))) ORDER BY w.visitDateTime DESC")
    List<Waypoint> searchByNameOrLabel(String term);

    @Query("SELECT w FROM Waypoint w WHERE (LOWER(w.name) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(w.label) LIKE LOWER(CONCAT('%', :term, '%'))) AND w.ownerId = :ownerId ORDER BY w.visitDateTime DESC")
    List<Waypoint> searchByNameOrLabelAndOwnerId(String term, Long ownerId);

    long countByNameAndLabel(String name, String label);

    List<Waypoint> findAllByOwnerId(Long ownerId, Sort sort);

    Optional<Waypoint> findByIdAndOwnerId(Long id, Long ownerId);

    void deleteByOwnerId(Long ownerId);
}
