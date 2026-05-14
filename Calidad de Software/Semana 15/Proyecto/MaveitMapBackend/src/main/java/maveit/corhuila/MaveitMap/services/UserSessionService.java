package maveit.corhuila.MaveitMap.services;

import java.time.Instant;
import java.util.Optional;
import maveit.corhuila.MaveitMap.models.UserAccount;

public interface UserSessionService {
    void createSession(UserAccount account, String token, Instant expiresAt);
    Optional<UserAccount> closeSession(String token);
    long countActiveSessions(UserAccount account);
    void deleteSessionFor(UserAccount account);
}
