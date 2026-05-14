package maveit.corhuila.MaveitMap;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.registration")
public class RegistrationProperties {

    private int verificationExpiryMinutes = 10;
    private int maxVerificationAttempts = 5;

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
}
