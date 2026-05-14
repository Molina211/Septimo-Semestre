package maveit.corhuila.MaveitMap.services;

import java.time.Instant;
import java.time.OffsetDateTime;
import maveit.corhuila.MaveitMap.dto.AuthResponse;
import maveit.corhuila.MaveitMap.dto.LoginRequest;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.repositories.UserAccountRepository;
import maveit.corhuila.MaveitMap.security.JwtTokenService;
import maveit.corhuila.MaveitMap.security.PasswordEncryptionService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncryptionService passwordEncryptionService;
    private final JwtTokenService jwtTokenService;
    private final UserSessionService sessionService;
    private final RefreshTokenService refreshTokenService;
    private final AuditLogService auditLogService;
    private final EmailVerificationService emailVerificationService;

    public AuthenticationServiceImpl(UserAccountRepository userAccountRepository,
            PasswordEncryptionService passwordEncryptionService,
            JwtTokenService jwtTokenService,
            UserSessionService sessionService,
            RefreshTokenService refreshTokenService,
            AuditLogService auditLogService,
            EmailVerificationService emailVerificationService) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncryptionService = passwordEncryptionService;
        this.jwtTokenService = jwtTokenService;
        this.sessionService = sessionService;
        this.refreshTokenService = refreshTokenService;
        this.auditLogService = auditLogService;
        this.emailVerificationService = emailVerificationService;
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        UserAccount account = userAccountRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));
        if (!passwordEncryptionService.matches(request.getPassword().toCharArray(), account.getEncryptedPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }
        if (!account.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Cuenta deshabilitada. Contacta al SuperAdministrador para habilitarla");
        }
        if (!account.isVerified()) {
            emailVerificationService.ensureActiveVerification(account);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Debes verificar tu correo");
        }
        String accessToken = jwtTokenService.createToken(account);
        Instant expiresAt = Instant.ofEpochMilli(jwtTokenService.parseToken(accessToken).getExpiresAt());
        sessionService.createSession(account, accessToken, expiresAt);
        String refreshToken = refreshTokenService.issue(account);
        account.setSessionActive(true);
        account.setUpdatedAt(OffsetDateTime.now());
        userAccountRepository.save(account);
        auditLogService.log("LOGIN", account.getId(), account.getEmail(), account.getId(), account.getEmail(), null);
        return new AuthResponse(accessToken, refreshToken);
    }

    @Override
    @Transactional
    public AuthResponse refresh(String refreshToken) {
        RefreshTokenService.RefreshRotationResult rotation = refreshTokenService.rotate(refreshToken);
        UserAccount account = rotation.getUser();
        String accessToken = jwtTokenService.createToken(account);
        Instant expiresAt = Instant.ofEpochMilli(jwtTokenService.parseToken(accessToken).getExpiresAt());
        sessionService.createSession(account, accessToken, expiresAt);
        account.setSessionActive(true);
        account.setUpdatedAt(OffsetDateTime.now());
        userAccountRepository.save(account);
        auditLogService.log("TOKEN_REFRESH", account.getId(), account.getEmail(), account.getId(), account.getEmail(), null);
        return new AuthResponse(accessToken, rotation.getNewRefreshToken());
    }
}
