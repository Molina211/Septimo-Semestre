package maveit.corhuila.MaveitMap.dto;

import java.time.OffsetDateTime;

public class PasswordResetSessionResponse {

    private String email;
    private OffsetDateTime expiresAt;
    private int attemptsLeft;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public OffsetDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(OffsetDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public int getAttemptsLeft() {
        return attemptsLeft;
    }

    public void setAttemptsLeft(int attemptsLeft) {
        this.attemptsLeft = attemptsLeft;
    }
}

