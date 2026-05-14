package maveit.corhuila.MaveitMap.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.auth.cookie")
public class AuthCookieProperties {

    /**
     * auto | true | false
     */
    private String secure = "auto";

    /**
     * auto | Lax | None | Strict
     */
    private String sameSite = "auto";

    /**
     * Optional cookie domain. Leave empty to use host-only cookies.
     */
    private String domain;

    public String getSecure() {
        return secure;
    }

    public void setSecure(String secure) {
        this.secure = secure;
    }

    public String getSameSite() {
        return sameSite;
    }

    public void setSameSite(String sameSite) {
        this.sameSite = sameSite;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }
}

