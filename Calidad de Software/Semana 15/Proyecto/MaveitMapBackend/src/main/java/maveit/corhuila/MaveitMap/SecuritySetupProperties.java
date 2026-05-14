package maveit.corhuila.MaveitMap;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "security.setup")
public class SecuritySetupProperties {

    private String initialSuperAdminSecret;

    public String getInitialSuperAdminSecret() {
        return initialSuperAdminSecret;
    }

    public void setInitialSuperAdminSecret(String initialSuperAdminSecret) {
        this.initialSuperAdminSecret = initialSuperAdminSecret;
    }
}
