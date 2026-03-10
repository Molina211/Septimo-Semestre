package maveit.corhuila.MaveitMap.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.models.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class JwtTokenService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private final JwtProperties properties;
    private final byte[] secretBytes;

    public JwtTokenService(JwtProperties properties) {
        this.properties = properties;
        this.secretBytes = Base64.getDecoder().decode(properties.getSecret());
    }

    public String createToken(UserAccount account) {
        long expiresAt = Instant.now().toEpochMilli() + properties.getExpirationMillis();
        String payload = buildPayload(account, expiresAt);
        byte[] signature = sign(payload);
        String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String encodedSignature = Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        return encodedPayload + "." + encodedSignature;
    }

    public AuthDetails parseToken(String token) {
        try {
            String[] split = token.split("\\.");
            if (split.length != 2) {
                throw new IllegalArgumentException("Formato inválido");
            }
            String payload = new String(Base64.getUrlDecoder().decode(split[0]), StandardCharsets.UTF_8);
            byte[] providedSignature = Base64.getUrlDecoder().decode(split[1]);
            byte[] expectedSignature = sign(payload);
            if (!java.security.MessageDigest.isEqual(providedSignature, expectedSignature)) {
                throw new IllegalArgumentException("Firma inválida");
            }
            String[] parts = payload.split(":");
            if (parts.length != 4) {
                throw new IllegalArgumentException("Payload inválido");
            }
            long userId = Long.parseLong(parts[0]);
            UserRole role = UserRole.valueOf(parts[1]);
            long expires = Long.parseLong(parts[2]);
            if (Instant.now().toEpochMilli() > expires) {
                throw new IllegalArgumentException("Token expirado");
            }
            return new AuthDetails(userId, role, expires);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido", ex);
        }
    }

    private String buildPayload(UserAccount account, long expiresAt) {
        String encodedEmail = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(account.getEmail().getBytes(StandardCharsets.UTF_8));
        return account.getId() + ":" + account.getRole().name() + ":" + expiresAt + ":" + encodedEmail;
    }

    private byte[] sign(String payload) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secretBytes, HMAC_ALGORITHM));
            return mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        } catch (Exception ex) {
            throw new IllegalStateException("No se pudo firmar el token", ex);
        }
    }
}
