package maveit.corhuila.MaveitMap.dto;

public class AdminConfigUpdateRequest {
    private Long accessTokenExpirationMillis;
    private Long refreshTokenExpirationMillis;
    private Integer defaultInvitationExpiryMinutes;
    private Integer verificationExpiryMinutes;
    private Integer maxVerificationAttempts;

    public Long getAccessTokenExpirationMillis() {
        return accessTokenExpirationMillis;
    }

    public void setAccessTokenExpirationMillis(Long accessTokenExpirationMillis) {
        this.accessTokenExpirationMillis = accessTokenExpirationMillis;
    }

    public Long getRefreshTokenExpirationMillis() {
        return refreshTokenExpirationMillis;
    }

    public void setRefreshTokenExpirationMillis(Long refreshTokenExpirationMillis) {
        this.refreshTokenExpirationMillis = refreshTokenExpirationMillis;
    }

    public Integer getDefaultInvitationExpiryMinutes() {
        return defaultInvitationExpiryMinutes;
    }

    public void setDefaultInvitationExpiryMinutes(Integer defaultInvitationExpiryMinutes) {
        this.defaultInvitationExpiryMinutes = defaultInvitationExpiryMinutes;
    }

    public Integer getVerificationExpiryMinutes() {
        return verificationExpiryMinutes;
    }

    public void setVerificationExpiryMinutes(Integer verificationExpiryMinutes) {
        this.verificationExpiryMinutes = verificationExpiryMinutes;
    }

    public Integer getMaxVerificationAttempts() {
        return maxVerificationAttempts;
    }

    public void setMaxVerificationAttempts(Integer maxVerificationAttempts) {
        this.maxVerificationAttempts = maxVerificationAttempts;
    }
}

