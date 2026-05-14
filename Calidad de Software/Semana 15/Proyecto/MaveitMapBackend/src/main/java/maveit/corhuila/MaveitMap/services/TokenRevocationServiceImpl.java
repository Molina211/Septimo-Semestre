package maveit.corhuila.MaveitMap.services;

import java.time.Instant;
import maveit.corhuila.MaveitMap.models.RevokedToken;
import maveit.corhuila.MaveitMap.models.RevocationReason;
import maveit.corhuila.MaveitMap.repositories.RevokedTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TokenRevocationServiceImpl implements TokenRevocationService {

    private final RevokedTokenRepository revokedTokenRepository;

    public TokenRevocationServiceImpl(RevokedTokenRepository revokedTokenRepository) {
        this.revokedTokenRepository = revokedTokenRepository;
    }

    @Override
    @Transactional
    public void revokeToken(String token, long expiresAtMillis, RevocationReason reason) {
        if (revokedTokenRepository.existsByToken(token)) {
            return;
        }
        RevokedToken revokedToken = new RevokedToken();
        revokedToken.setToken(token);
        revokedToken.setRevokedAt(Instant.now());
        revokedToken.setExpiresAt(Instant.ofEpochMilli(expiresAtMillis));
        revokedToken.setReason(reason);
        revokedTokenRepository.save(revokedToken);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isRevoked(String token) {
        return revokedTokenRepository.existsByToken(token);
    }
}
