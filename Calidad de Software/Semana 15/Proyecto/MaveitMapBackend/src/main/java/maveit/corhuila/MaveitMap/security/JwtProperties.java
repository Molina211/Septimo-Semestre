package maveit.corhuila.MaveitMap.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "security.jwt")
public class JwtProperties {

    private String secret;
    private long expirationMillis = 3600000;
    // Default: 30 days
    private long refreshExpirationMillis = 30L * 24L * 60L * 60L * 1000L;

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpirationMillis() {
        return expirationMillis;
    }

    public void setExpirationMillis(long expirationMillis) {
        this.expirationMillis = expirationMillis;
    }

    public long getRefreshExpirationMillis() {
        return refreshExpirationMillis;
    }

    public void setRefreshExpirationMillis(long refreshExpirationMillis) {
        this.refreshExpirationMillis = refreshExpirationMillis;
    }
}
