package maveit.corhuila.MaveitMap.services;

import maveit.corhuila.MaveitMap.models.UserAccount;

public interface EmailVerificationService {

    /**
     * Ensures there is an active verification code for an unverified account.
     * This is used on login to trigger the first verification flow.
     */
    void ensureActiveVerification(UserAccount account);

    void confirm(String email, String code);

    void resend(String email);
}

