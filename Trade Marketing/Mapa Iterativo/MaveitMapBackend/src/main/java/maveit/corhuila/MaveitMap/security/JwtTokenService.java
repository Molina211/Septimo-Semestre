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
        long issuedAt = Instant.now().toEpochMilli();
        long expiresAt = issuedAt + properties.getExpirationMillis();
        String payload = buildPayload(account, issuedAt, expiresAt);
        byte[] signature = sign(payload);
        String encodedPayload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String encodedSignature = Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        return encodedPayload + "." + encodedSignature;
    }

    public AuthDetails parseToken(String token) {
        try {
            String[] split = token.split("\\.");
            if (split.length != 2) {
                throw new IllegalArgumentException("Formato invalido");
            }
            String payload = new String(Base64.getUrlDecoder().decode(split[0]), StandardCharsets.UTF_8);
            byte[] providedSignature = Base64.getUrlDecoder().decode(split[1]);
            byte[] expectedSignature = sign(payload);
            if (!java.security.MessageDigest.isEqual(providedSignature, expectedSignature)) {
                throw new IllegalArgumentException("Firma invalida");
            }
            String[] parts = payload.split(":");
            if (parts.length != 5) {
                throw new IllegalArgumentException("Payload invalido");
            }
            long userId = Long.parseLong(parts[0]);
            UserRole role = UserRole.valueOf(parts[1]);
            long issuedAt = Long.parseLong(parts[2]);
            long expires = Long.parseLong(parts[3]);
            if (Instant.now().toEpochMilli() > expires) {
                throw new IllegalArgumentException("Token expirado");
            }
            return new AuthDetails(userId, role, issuedAt, expires);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token invalido", ex);
        }
    }

    private String buildPayload(UserAccount account, long issuedAt, long expiresAt) {
        String encodedEmail = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(account.getEmail().getBytes(StandardCharsets.UTF_8));
        return account.getId() + ":" + account.getRole().name() + ":" + issuedAt + ":" + expiresAt + ":" + encodedEmail;
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

