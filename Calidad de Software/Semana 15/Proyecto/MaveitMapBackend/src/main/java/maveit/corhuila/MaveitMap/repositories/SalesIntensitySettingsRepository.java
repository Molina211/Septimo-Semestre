package maveit.corhuila.MaveitMap.repositories;

import java.util.Optional;
import maveit.corhuila.MaveitMap.models.SalesIntensitySettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesIntensitySettingsRepository extends JpaRepository<SalesIntensitySettings, Long> {
    Optional<SalesIntensitySettings> findByOwnerId(Long ownerId);
    void deleteByOwnerId(Long ownerId);
}
