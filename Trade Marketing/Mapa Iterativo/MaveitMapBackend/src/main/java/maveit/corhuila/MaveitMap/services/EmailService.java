package maveit.corhuila.MaveitMap.services;

import maveit.corhuila.MaveitMap.models.Invitation;
import maveit.corhuila.MaveitMap.models.UserAccount;

public interface EmailService {
    void sendWelcome(UserAccount user);
    void sendInvitation(Invitation invitation);
    void sendVerificationCode(String email, String name, String companyName, String code,
            java.time.OffsetDateTime expiresAt);
    void sendPasswordResetCode(String email, String name, String code, java.time.OffsetDateTime expiresAt);
}
