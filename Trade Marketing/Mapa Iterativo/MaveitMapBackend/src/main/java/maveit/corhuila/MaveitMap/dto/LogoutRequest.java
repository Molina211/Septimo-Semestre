package maveit.corhuila.MaveitMap.dto;

import jakarta.annotation.Nullable;

public class LogoutRequest {

    @Nullable
    private String refreshToken;

    @Nullable
    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}

