package maveit.corhuila.MaveitMap.repositories;

import java.util.List;
import java.util.Optional;
import java.time.OffsetDateTime;
import maveit.corhuila.MaveitMap.models.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    Optional<Invitation> findByToken(String token);
    List<Invitation> findByInviter_IdOrderByExpiresAtAsc(Long inviterId);
    List<Invitation> findAllByOrderByExpiresAtAsc();
    long countByRevokedFalseAndExpiresAtAfter(OffsetDateTime now);
    void deleteByExpiresAtBefore(OffsetDateTime now);
    void deleteByInviter_Id(Long inviterId);
}
