package maveit.corhuila.MaveitMap.services;

import maveit.corhuila.MaveitMap.models.RevocationReason;

public interface TokenRevocationService {

    void revokeToken(String token, long expiresAtMillis, RevocationReason reason);

    boolean isRevoked(String token);
}
