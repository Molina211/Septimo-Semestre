package maveit.corhuila.MaveitMap.repositories;

import java.time.OffsetDateTime;
import java.util.Optional;
import maveit.corhuila.MaveitMap.models.RegistrationVerification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationVerificationRepository extends JpaRepository<RegistrationVerification, Long> {

    Optional<RegistrationVerification> findByEmailIgnoreCase(String email);

    void deleteByEmailIgnoreCase(String email);

    void deleteByExpiresAtBefore(OffsetDateTime time);
}
