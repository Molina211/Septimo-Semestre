package maveit.corhuila.MaveitMap.dto;

import java.time.OffsetDateTime;

public class AdminConfigResponse {
    private long accessTokenExpirationMillis;
    private long refreshTokenExpirationMillis;
    private int defaultInvitationExpiryMinutes;
    private int verificationExpiryMinutes;
    private int maxVerificationAttempts;
    private OffsetDateTime updatedAt;

    public long getAccessTokenExpirationMillis() {
        return accessTokenExpirationMillis;
    }

    public void setAccessTokenExpirationMillis(long accessTokenExpirationMillis) {
        this.accessTokenExpirationMillis = accessTokenExpirationMillis;
    }

    public long getRefreshTokenExpirationMillis() {
        return refreshTokenExpirationMillis;
    }

    public void setRefreshTokenExpirationMillis(long refreshTokenExpirationMillis) {
        this.refreshTokenExpirationMillis = refreshTokenExpirationMillis;
    }

    public int getDefaultInvitationExpiryMinutes() {
        return defaultInvitationExpiryMinutes;
    }

    public void setDefaultInvitationExpiryMinutes(int defaultInvitationExpiryMinutes) {
        this.defaultInvitationExpiryMinutes = defaultInvitationExpiryMinutes;
    }

    public int getVerificationExpiryMinutes() {
        return verificationExpiryMinutes;
    }

    public void setVerificationExpiryMinutes(int verificationExpiryMinutes) {
        this.verificationExpiryMinutes = verificationExpiryMinutes;
    }

    public int getMaxVerificationAttempts() {
        return maxVerificationAttempts;
    }

    public void setMaxVerificationAttempts(int maxVerificationAttempts) {
        this.maxVerificationAttempts = maxVerificationAttempts;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

