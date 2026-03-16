package maveit.corhuila.MaveitMap.dto;

public class AuthResponse {

    // Backward compatible field (old clients expect "token").
    // New clients should use accessToken + refreshToken.
    private String token;
    private String accessToken;
    private String refreshToken;

    public AuthResponse() {}

    public AuthResponse(String token) {
        this.token = token;
        this.accessToken = token;
    }

    public AuthResponse(String accessToken, String refreshToken) {
        this.token = accessToken;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public String getToken() {
        return accessToken != null ? accessToken : token;
    }

    public void setToken(String token) {
        this.token = token;
        this.accessToken = token;
    }

    public String getAccessToken() {
        return accessToken != null ? accessToken : token;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
        this.token = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
