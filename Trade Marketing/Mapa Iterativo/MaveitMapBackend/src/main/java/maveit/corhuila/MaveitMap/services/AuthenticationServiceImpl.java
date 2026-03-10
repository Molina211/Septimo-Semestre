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

    public AuthenticationServiceImpl(UserAccountRepository userAccountRepository,
            PasswordEncryptionService passwordEncryptionService,
            JwtTokenService jwtTokenService,
            UserSessionService sessionService) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncryptionService = passwordEncryptionService;
        this.jwtTokenService = jwtTokenService;
        this.sessionService = sessionService;
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        UserAccount account = userAccountRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));
        if (!passwordEncryptionService.matches(request.getPassword().toCharArray(), account.getEncryptedPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }
        if (!account.isVerified()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Debes verificar tu correo");
        }
        String token = jwtTokenService.createToken(account);
        Instant expiresAt = Instant.ofEpochMilli(jwtTokenService.parseToken(token).getExpiresAt());
        sessionService.createSession(account, token, expiresAt);
        account.setSessionActive(true);
        account.setUpdatedAt(OffsetDateTime.now());
        userAccountRepository.save(account);
        return new AuthResponse(token);
    }
}
