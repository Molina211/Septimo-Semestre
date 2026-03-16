package maveit.corhuila.MaveitMap.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "admin_config")
public class AdminConfig {

    @Id
    private Long id = 1L;

    @Column(nullable = false)
    private long accessTokenExpirationMillis;

    @Column(nullable = false)
    private long refreshTokenExpirationMillis;

    @Column(nullable = false)
    private int defaultInvitationExpiryMinutes;

    @Column(nullable = false)
    private int verificationExpiryMinutes;

    @Column(nullable = false)
    private int maxVerificationAttempts;

    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

