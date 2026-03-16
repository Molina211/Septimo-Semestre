package maveit.corhuila.MaveitMap.services;

import maveit.corhuila.MaveitMap.models.AdminConfig;

public interface AdminConfigService {
    AdminConfig getOrCreate();
    AdminConfig update(AdminConfigUpdate update);
    int getDefaultInvitationExpiryMinutes();

    class AdminConfigUpdate {
        public Long accessTokenExpirationMillis;
        public Long refreshTokenExpirationMillis;
        public Integer defaultInvitationExpiryMinutes;
        public Integer verificationExpiryMinutes;
        public Integer maxVerificationAttempts;
    }
}

