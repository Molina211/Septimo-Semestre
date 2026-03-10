package maveit.corhuila.MaveitMap.repositories;

import java.time.OffsetDateTime;
import java.util.Optional;
import maveit.corhuila.MaveitMap.models.PasswordResetVerification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetVerificationRepository extends JpaRepository<PasswordResetVerification, Long> {

    Optional<PasswordResetVerification> findByEmailIgnoreCase(String email);

    void deleteByEmailIgnoreCase(String email);

    void deleteByExpiresAtBefore(OffsetDateTime time);
}

