package maveit.corhuila.MaveitMap.security;

import maveit.corhuila.MaveitMap.models.UserRole;

public class AuthDetails {

    private final Long userId;
    private final UserRole role;
    private final long expiresAt;

    public AuthDetails(Long userId, UserRole role, long expiresAt) {
        this.userId = userId;
        this.role = role;
        this.expiresAt = expiresAt;
    }

    public Long getUserId() {
        return userId;
    }

    public UserRole getRole() {
        return role;
    }

    public long getExpiresAt() {
        return expiresAt;
    }
}
