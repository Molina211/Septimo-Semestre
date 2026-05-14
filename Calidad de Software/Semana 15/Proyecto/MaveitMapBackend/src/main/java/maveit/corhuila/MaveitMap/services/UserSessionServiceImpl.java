package maveit.corhuila.MaveitMap.services;

import java.time.Instant;
import java.util.Optional;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.models.UserSession;
import maveit.corhuila.MaveitMap.repositories.UserSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserSessionServiceImpl implements UserSessionService {

    private final UserSessionRepository repository;

    public UserSessionServiceImpl(UserSessionRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public void createSession(UserAccount account, String token, Instant expiresAt) {
        repository.findByUser(account).ifPresent(repository::delete);
        UserSession session = new UserSession();
        session.setUser(account);
        session.setToken(token);
        session.setCreatedAt(Instant.now());
        session.setExpiresAt(expiresAt);
        session.setEmail(account.getEmail());
        repository.save(session);
    }

    @Override
    @Transactional
    public Optional<UserAccount> closeSession(String token) {
        Optional<UserSession> existing = repository.findByToken(token);
        if (existing.isEmpty()) {
            return Optional.empty();
        }
        UserSession session = existing.get();
        UserAccount account = session.getUser();
        repository.delete(session);
        return Optional.of(account);
    }

    @Override
    public long countActiveSessions(UserAccount account) {
        return repository.existsByUser(account) ? 1 : 0;
    }

    @Override
    public void deleteSessionFor(UserAccount account) {
        repository.findByUser(account).ifPresent(repository::delete);
    }
}
