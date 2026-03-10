package maveit.corhuila.MaveitMap.repositories;

import java.util.List;
import java.util.Optional;
import maveit.corhuila.MaveitMap.models.SalesGroup;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesGroupRepository extends JpaRepository<SalesGroup, Long> {

    List<SalesGroup> findAllByWaypoint_Id(Long waypointId, Sort sort);

    long countByWaypoint_Id(Long waypointId);

    void deleteAllByWaypoint_Id(Long waypointId);

    void deleteByOwnerId(Long ownerId);

    Optional<SalesGroup> findByIdAndOwnerId(Long id, Long ownerId);
}
