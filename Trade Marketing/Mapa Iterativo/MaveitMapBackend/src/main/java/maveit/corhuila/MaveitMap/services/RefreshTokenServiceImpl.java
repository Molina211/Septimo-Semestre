package maveit.corhuila.MaveitMap.services;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import maveit.corhuila.MaveitMap.models.RefreshToken;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.repositories.RefreshTokenRepository;
import maveit.corhuila.MaveitMap.repositories.UserAccountRepository;
import maveit.corhuila.MaveitMap.security.JwtProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserAccountRepository userAccountRepository;
    private final JwtProperties jwtProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository,
            UserAccountRepository userAccountRepository,
            JwtProperties jwtProperties) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userAccountRepository = userAccountRepository;
        this.jwtProperties = jwtProperties;
    }

    @Override
    @Transactional
    public String issue(UserAccount user) {
        String raw = generateRawToken();
        RefreshToken entity = new RefreshToken();
        entity.setUser(user);
        entity.setTokenHash(hash(raw));
        OffsetDateTime now = OffsetDateTime.now();
        entity.setCreatedAt(now);
        entity.setExpiresAt(now.plusSeconds(jwtProperties.getRefreshExpirationMillis() / 1000));
        refreshTokenRepository.save(entity);
        return raw;
    }

    @Override
    @Transactional(noRollbackFor = ResponseStatusException.class)
    public RefreshRotationResult rotate(String rawRefreshToken) {
        String tokenHash = hash(rawRefreshToken);
        RefreshToken existing = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token invalido"));

        OffsetDateTime now = OffsetDateTime.now();
        if (existing.getExpiresAt().isBefore(now)) {
            refreshTokenRepository.delete(existing);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expirado");
        }
        if (existing.isRevoked()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token revocado");
        }

        UserAccount user = userAccountRepository.findById(existing.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
        if (!user.isVerified()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Debes verificar tu correo");
        }
        if (!user.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Cuenta deshabilitada. Contacta al SuperAdministrador para habilitarla");
        }
        if (user.getTokensRevokedAt() != null && existing.getCreatedAt().isBefore(user.getTokensRevokedAt())) {
            existing.setRevokedAt(now);
            refreshTokenRepository.save(existing);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token revocado");
        }

        // Rotate: revoke the old token and issue a new one.
        String newRaw = generateRawToken();
        RefreshToken replacement = new RefreshToken();
        replacement.setUser(user);
        replacement.setTokenHash(hash(newRaw));
        replacement.setCreatedAt(now);
        replacement.setExpiresAt(now.plusSeconds(jwtProperties.getRefreshExpirationMillis() / 1000));
        refreshTokenRepository.save(replacement);

        existing.setRevokedAt(now);
        existing.setReplacedBy(replacement);
        refreshTokenRepository.save(existing);

        return new RefreshRotationResult(user, newRaw);
    }

    @Override
    @Transactional
    public void revoke(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return;
        }
        String tokenHash = hash(rawRefreshToken.trim());
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent((entity) -> {
            if (!entity.isRevoked()) {
                entity.setRevokedAt(OffsetDateTime.now());
                refreshTokenRepository.save(entity);
            }
        });
    }

    @Override
    @Transactional
    public void revokeAllForUser(Long userId) {
        if (userId == null) {
            return;
        }
        refreshTokenRepository.revokeAllForUser(userId, OffsetDateTime.now());
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String hash(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(hashed.length * 2);
            for (byte b : hashed) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception ex) {
            throw new IllegalStateException("No se pudo hashear el refresh token", ex);
        }
    }
}

