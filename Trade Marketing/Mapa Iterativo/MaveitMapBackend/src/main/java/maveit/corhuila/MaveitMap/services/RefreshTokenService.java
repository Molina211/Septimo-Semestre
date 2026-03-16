package maveit.corhuila.MaveitMap.services;

import maveit.corhuila.MaveitMap.models.UserAccount;

public interface RefreshTokenService {

    /**
     * Creates and persists a new refresh token for the given user.
     *
     * @return the raw refresh token (only returned once)
     */
    String issue(UserAccount user);

    /**
     * Validates the provided refresh token and rotates it (one-time use).
     *
     * @return a new raw refresh token
     */
    RefreshRotationResult rotate(String rawRefreshToken);

    void revoke(String rawRefreshToken);

    void revokeAllForUser(Long userId);

    class RefreshRotationResult {
        private final UserAccount user;
        private final String newRefreshToken;

        public RefreshRotationResult(UserAccount user, String newRefreshToken) {
            this.user = user;
            this.newRefreshToken = newRefreshToken;
        }

        public UserAccount getUser() {
            return user;
        }

        public String getNewRefreshToken() {
            return newRefreshToken;
        }
    }
}

