package maveit.corhuila.MaveitMap.repositories;

import java.time.OffsetDateTime;
import java.util.Optional;
import maveit.corhuila.MaveitMap.models.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    Optional<EmailVerification> findByEmailIgnoreCase(String email);
    void deleteByEmailIgnoreCase(String email);
    void deleteByExpiresAtBefore(OffsetDateTime now);
}

