package maveit.corhuila.MaveitMap.services;

import java.time.OffsetDateTime;
import maveit.corhuila.MaveitMap.RegistrationProperties;
import maveit.corhuila.MaveitMap.models.AdminConfig;
import maveit.corhuila.MaveitMap.repositories.AdminConfigRepository;
import maveit.corhuila.MaveitMap.security.JwtProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminConfigServiceImpl implements AdminConfigService {

    private final AdminConfigRepository repository;
    private final JwtProperties jwtProperties;
    private final RegistrationProperties registrationProperties;

    public AdminConfigServiceImpl(AdminConfigRepository repository,
            JwtProperties jwtProperties,
            RegistrationProperties registrationProperties) {
        this.repository = repository;
        this.jwtProperties = jwtProperties;
        this.registrationProperties = registrationProperties;
    }

    @Override
    @Transactional
    public AdminConfig getOrCreate() {
        return repository.findById(1L).orElseGet(() -> {
            AdminConfig cfg = new AdminConfig();
            cfg.setId(1L);
            cfg.setAccessTokenExpirationMillis(jwtProperties.getExpirationMillis());
            cfg.setRefreshTokenExpirationMillis(jwtProperties.getRefreshExpirationMillis());
            cfg.setDefaultInvitationExpiryMinutes(10);
            cfg.setVerificationExpiryMinutes(registrationProperties.getVerificationExpiryMinutes());
            cfg.setMaxVerificationAttempts(registrationProperties.getMaxVerificationAttempts());
            cfg.setUpdatedAt(OffsetDateTime.now());
            return repository.save(cfg);
        });
    }

    @Override
    @Transactional
    public AdminConfig update(AdminConfigUpdate update) {
        AdminConfig cfg = getOrCreate();
        if (update.accessTokenExpirationMillis != null) {
            long v = update.accessTokenExpirationMillis;
            if (v < 60_000) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El access token debe durar al menos 1 minuto");
            }
            cfg.setAccessTokenExpirationMillis(v);
            jwtProperties.setExpirationMillis(v);
        }
        if (update.refreshTokenExpirationMillis != null) {
            long v = update.refreshTokenExpirationMillis;
            if (v < 60_000) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El refresh token debe durar al menos 1 minuto");
            }
            cfg.setRefreshTokenExpirationMillis(v);
            jwtProperties.setRefreshExpirationMillis(v);
        }
        if (update.defaultInvitationExpiryMinutes != null) {
            int v = update.defaultInvitationExpiryMinutes;
            if (v < 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expiracion de invitacion invalida");
            }
            cfg.setDefaultInvitationExpiryMinutes(v);
        }
        if (update.verificationExpiryMinutes != null) {
            int v = update.verificationExpiryMinutes;
            if (v < 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expiracion de verificacion invalida");
            }
            cfg.setVerificationExpiryMinutes(v);
            registrationProperties.setVerificationExpiryMinutes(v);
        }
        if (update.maxVerificationAttempts != null) {
            int v = update.maxVerificationAttempts;
            if (v < 1 || v > 20) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max intentos invalido");
            }
            cfg.setMaxVerificationAttempts(v);
            registrationProperties.setMaxVerificationAttempts(v);
        }
        cfg.setUpdatedAt(OffsetDateTime.now());
        return repository.save(cfg);
    }

    @Override
    @Transactional(readOnly = true)
    public int getDefaultInvitationExpiryMinutes() {
        return getOrCreate().getDefaultInvitationExpiryMinutes();
    }
}

