package maveit.corhuila.MaveitMap.security;

import maveit.corhuila.MaveitMap.models.UserRole;

public class AuthDetails {

    private final Long userId;
    private final UserRole role;
    private final long issuedAt;
    private final long expiresAt;

    public AuthDetails(Long userId, UserRole role, long issuedAt, long expiresAt) {
        this.userId = userId;
        this.role = role;
        this.issuedAt = issuedAt;
        this.expiresAt = expiresAt;
    }

    public Long getUserId() {
        return userId;
    }

    public UserRole getRole() {
        return role;
    }

    public long getIssuedAt() {
        return issuedAt;
    }

    public long getExpiresAt() {
        return expiresAt;
    }
}
