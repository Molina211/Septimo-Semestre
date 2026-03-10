package maveit.corhuila.MaveitMap.repositories;

import java.util.Optional;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.models.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSessionRepository extends JpaRepository<UserSession, Long> {

    Optional<UserSession> findByToken(String token);

    Optional<UserSession> findByUser(UserAccount user);

    boolean existsByUser(UserAccount user);

    void deleteByUser(UserAccount user);
}
