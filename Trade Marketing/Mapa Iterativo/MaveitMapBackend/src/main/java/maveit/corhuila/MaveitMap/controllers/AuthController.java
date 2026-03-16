package maveit.corhuila.MaveitMap.controllers;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import java.util.List;
import maveit.corhuila.MaveitMap.dto.AuthResponse;
import maveit.corhuila.MaveitMap.dto.InvitationPreviewResponse;
import maveit.corhuila.MaveitMap.dto.InvitationRequest;
import maveit.corhuila.MaveitMap.dto.InvitationResponse;
import maveit.corhuila.MaveitMap.dto.LoginRequest;
import maveit.corhuila.MaveitMap.dto.LogoutRequest;
import maveit.corhuila.MaveitMap.dto.PasswordResetRequest;
import maveit.corhuila.MaveitMap.dto.PasswordResetSessionResponse;
import maveit.corhuila.MaveitMap.dto.PasswordResetUpdateRequest;
import maveit.corhuila.MaveitMap.dto.PasswordResetVerifyRequest;
import maveit.corhuila.MaveitMap.dto.RefreshTokenRequest;
import maveit.corhuila.MaveitMap.dto.RegisterUserRequest;
import maveit.corhuila.MaveitMap.dto.EmailWelcomeRequest;
import maveit.corhuila.MaveitMap.dto.EmailVerificationConfirmRequest;
import maveit.corhuila.MaveitMap.dto.EmailVerificationResendRequest;
import maveit.corhuila.MaveitMap.dto.UpdateUserRequest;
import maveit.corhuila.MaveitMap.dto.UserAccountResponse;
import maveit.corhuila.MaveitMap.dto.UserStatusRequest;
import maveit.corhuila.MaveitMap.dto.ReleaseUsersRequest;
import maveit.corhuila.MaveitMap.dto.RegistrationConfirmationRequest;
import maveit.corhuila.MaveitMap.dto.RegistrationResendRequest;
import maveit.corhuila.MaveitMap.dto.RegistrationSessionResponse;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.models.UserRole;
import maveit.corhuila.MaveitMap.security.AuthContext;
import maveit.corhuila.MaveitMap.security.AuthDetails;
import maveit.corhuila.MaveitMap.security.JwtTokenService;
import maveit.corhuila.MaveitMap.repositories.UserAccountRepository;
import maveit.corhuila.MaveitMap.services.AuthenticationService;
import maveit.corhuila.MaveitMap.services.InvitationService;
import maveit.corhuila.MaveitMap.models.RevocationReason;
import maveit.corhuila.MaveitMap.services.TokenRevocationService;
import maveit.corhuila.MaveitMap.services.AuditLogService;
import maveit.corhuila.MaveitMap.services.EmailVerificationService;
import maveit.corhuila.MaveitMap.services.UserAccountService;
import maveit.corhuila.MaveitMap.services.UserSessionService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.net.URI;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.CookieValue;
import maveit.corhuila.MaveitMap.security.JwtProperties;
import maveit.corhuila.MaveitMap.AppProperties;
import maveit.corhuila.MaveitMap.security.AuthCookieProperties;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private static final String REFRESH_COOKIE_NAME = "refresh_token";

    private final UserAccountService userAccountService;
    private final InvitationService invitationService;
    private final AuthenticationService authenticationService;
    private final TokenRevocationService tokenRevocationService;
    private final JwtTokenService jwtTokenService;
    private final UserSessionService userSessionService;
    private final JwtProperties jwtProperties;
    private final AppProperties appProperties;
    private final AuthCookieProperties authCookieProperties;
    private final AuditLogService auditLogService;
    private final UserAccountRepository userAccountRepository;
    private final EmailVerificationService emailVerificationService;

    public AuthController(UserAccountService userAccountService,
            InvitationService invitationService,
            AuthenticationService authenticationService,
            TokenRevocationService tokenRevocationService,
            JwtTokenService jwtTokenService,
            UserSessionService userSessionService,
            JwtProperties jwtProperties,
            AppProperties appProperties,
            AuthCookieProperties authCookieProperties,
            AuditLogService auditLogService,
            UserAccountRepository userAccountRepository,
            EmailVerificationService emailVerificationService) {
        this.userAccountService = userAccountService;
        this.invitationService = invitationService;
        this.authenticationService = authenticationService;
        this.tokenRevocationService = tokenRevocationService;
        this.jwtTokenService = jwtTokenService;
        this.userSessionService = userSessionService;
        this.jwtProperties = jwtProperties;
        this.appProperties = appProperties;
        this.authCookieProperties = authCookieProperties;
        this.auditLogService = auditLogService;
        this.userAccountRepository = userAccountRepository;
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrationSessionResponse register(@Valid @RequestBody RegisterUserRequest request,
            @RequestHeader(value = "X-Initial-Super-Admin", required = false) String initialSuperAdminSecret) {
        AuthDetails auth = currentAuth();
        return userAccountService.register(request,
                auth == null ? null : auth.getRole(),
                auth == null ? null : auth.getUserId(),
                initialSuperAdminSecret);
    }

    @PostMapping("/register/confirm")
    public UserAccount confirmRegistration(@Valid @RequestBody RegistrationConfirmationRequest request) {
        return userAccountService.confirmRegistration(request);
    }

    @PostMapping("/resend-code")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resendVerificationCode(@Valid @RequestBody RegistrationResendRequest request) {
        userAccountService.resendVerificationCode(request);
    }

    @PostMapping("/email/confirm")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void confirmEmailVerification(@Valid @RequestBody EmailVerificationConfirmRequest request) {
        emailVerificationService.confirm(request.getEmail(), request.getCode());
    }

    @PostMapping("/email/resend")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resendEmailVerification(@Valid @RequestBody EmailVerificationResendRequest request) {
        emailVerificationService.resend(request.getEmail());
    }

    @PostMapping("/password/forgot")
    public PasswordResetSessionResponse requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        return userAccountService.requestPasswordReset(request);
    }

    @PostMapping("/password/verify")
    public PasswordResetSessionResponse verifyPasswordReset(@Valid @RequestBody PasswordResetVerifyRequest request) {
        return userAccountService.verifyPasswordReset(request);
    }

    @PutMapping("/password/reset")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(@Valid @RequestBody PasswordResetUpdateRequest request) {
        userAccountService.resetPassword(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response) {
        AuthResponse tokens = authenticationService.login(request);
        if (tokens.getRefreshToken() != null && !tokens.getRefreshToken().isBlank()) {
            setRefreshCookie(httpRequest, response, tokens.getRefreshToken());
        }
        // Do not expose refresh token to the client body when using HttpOnly cookies.
        tokens.setRefreshToken(null);
        return tokens;
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(
            @Nullable @RequestBody(required = false) RefreshTokenRequest request,
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String cookieToken,
            HttpServletRequest httpRequest,
            HttpServletResponse response) {
        String refreshToken = cookieToken;
        if ((refreshToken == null || refreshToken.isBlank()) && request != null) {
            refreshToken = request.getRefreshToken();
        }
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token requerido");
        }
        AuthResponse tokens = authenticationService.refresh(refreshToken);
        if (tokens.getRefreshToken() != null && !tokens.getRefreshToken().isBlank()) {
            setRefreshCookie(httpRequest, response, tokens.getRefreshToken());
        }
        tokens.setRefreshToken(null);
        return tokens;
    }

    @PostMapping("/users/welcome")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void sendWelcomeEmail(@Valid @RequestBody EmailWelcomeRequest request) {
        AuthDetails auth = requireAuth();
        userAccountService.resendWelcomeEmail(request.getEmail(), auth.getRole(), auth.getUserId());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader("Authorization") String authorizationHeader,
            @Nullable @RequestBody(required = false) LogoutRequest request,
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String cookieToken,
            HttpServletRequest httpRequest,
            HttpServletResponse response) {
        AuthDetails auth = requireAuth();
        String token = extractBearerToken(authorizationHeader);
        long expiresAt = jwtTokenService.parseToken(token).getExpiresAt();
        tokenRevocationService.revokeToken(token, expiresAt, RevocationReason.LOGOUT);
        String refreshToken = cookieToken;
        if ((refreshToken == null || refreshToken.isBlank()) && request != null) {
            refreshToken = request.getRefreshToken();
        }
        if (refreshToken != null && !refreshToken.isBlank()) {
            userAccountService.revokeRefreshToken(refreshToken);
        }
        userSessionService.closeSession(token).ifPresent((account) -> {
            boolean hasActive = userSessionService.countActiveSessions(account) > 0;
            userAccountService.markSessionActive(account.getId(), hasActive);
        });
        userAccountRepository.findById(auth.getUserId()).ifPresent((actor) -> {
            auditLogService.log("LOGOUT", actor.getId(), actor.getEmail(), actor.getId(), actor.getEmail(), null);
        });
        clearRefreshCookie(httpRequest, response);
    }

    private void setRefreshCookie(HttpServletRequest request, HttpServletResponse response, String refreshToken) {
        CookiePolicy policy = resolveCookiePolicy(request);
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(REFRESH_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(policy.secure)
                .sameSite(policy.sameSite)
                .path("/")
                .maxAge(Duration.ofMillis(jwtProperties.getRefreshExpirationMillis()));
        if (authCookieProperties.getDomain() != null && !authCookieProperties.getDomain().isBlank()) {
            builder.domain(authCookieProperties.getDomain().trim());
        }
        ResponseCookie cookie = builder.build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshCookie(HttpServletRequest request, HttpServletResponse response) {
        CookiePolicy policy = resolveCookiePolicy(request);
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(REFRESH_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(policy.secure)
                .sameSite(policy.sameSite)
                .path("/")
                .maxAge(Duration.ZERO);
        if (authCookieProperties.getDomain() != null && !authCookieProperties.getDomain().isBlank()) {
            builder.domain(authCookieProperties.getDomain().trim());
        }
        ResponseCookie cookie = builder.build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private CookiePolicy resolveCookiePolicy(HttpServletRequest request) {
        boolean secure = isSecureRequest(request) || isHttps(appProperties.getFrontendUrl());
        String frontendHost = hostFromUrl(appProperties.getFrontendUrl());
        String backendHost = request.getServerName();

        // Apply explicit overrides if configured.
        String configuredSecure = authCookieProperties.getSecure();
        if ("true".equalsIgnoreCase(configuredSecure)) {
            secure = true;
        } else if ("false".equalsIgnoreCase(configuredSecure)) {
            secure = false;
        }

        String sameSite = resolveSameSite(secure, frontendHost, backendHost);
        return new CookiePolicy(secure, sameSite);
    }

    private String resolveSameSite(boolean secure, String frontendHost, String backendHost) {
        String configured = authCookieProperties.getSameSite();
        if (configured != null && !"auto".equalsIgnoreCase(configured) && !configured.isBlank()) {
            return configured.trim();
        }
        // SameSite=None requires Secure=true in modern browsers. For local HTTP dev keep Lax.
        if (secure && frontendHost != null && backendHost != null && !isLikelySameSite(frontendHost, backendHost)) {
            return "None";
        }
        return "Lax";
    }

    private static boolean isSecureRequest(HttpServletRequest request) {
        if (request.isSecure()) {
            return true;
        }
        String forwardedProto = request.getHeader("X-Forwarded-Proto");
        return forwardedProto != null && forwardedProto.equalsIgnoreCase("https");
    }

    private static boolean isHttps(String url) {
        try {
            URI uri = URI.create(url);
            return "https".equalsIgnoreCase(uri.getScheme());
        } catch (Exception ex) {
            return false;
        }
    }

    private static String hostFromUrl(String url) {
        try {
            URI uri = URI.create(url);
            return uri.getHost();
        } catch (Exception ex) {
            return null;
        }
    }

    private static boolean isLikelySameSite(String a, String b) {
        String hostA = a.toLowerCase();
        String hostB = b.toLowerCase();
        if (hostA.equals(hostB)) {
            return true;
        }
        // localhost / IP cases
        if ("localhost".equals(hostA) || "localhost".equals(hostB)) {
            return false;
        }
        if (hostA.endsWith("." + hostB) || hostB.endsWith("." + hostA)) {
            return true;
        }
        String regA = registrableDomain(hostA);
        String regB = registrableDomain(hostB);
        return regA != null && regA.equals(regB);
    }

    private static String registrableDomain(String host) {
        String[] parts = host.split("\\.");
        if (parts.length < 2) {
            return null;
        }
        // naive eTLD+1 heuristic: last two labels (works for .com/.net/.org, and common deployments).
        return parts[parts.length - 2] + "." + parts[parts.length - 1];
    }

    private static class CookiePolicy {
        final boolean secure;
        final String sameSite;

        CookiePolicy(boolean secure, String sameSite) {
            this.secure = secure;
            this.sameSite = sameSite;
        }
    }

    @PostMapping("/users/release")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void releaseUsers(@Valid @RequestBody ReleaseUsersRequest request) {
        AuthDetails auth = requireAuth();
        userAccountService.releaseAccounts(request.getUserIds(), auth.getRole(), auth.getUserId());
    }

    @PostMapping("/users/self/release")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void releaseSelf() {
        AuthDetails auth = requireAuth();
        userAccountService.releaseSelf(auth.getUserId());
    }

    @PostMapping("/invitations")
    @ResponseStatus(HttpStatus.CREATED)
    public InvitationResponse createInvitation(@Valid @RequestBody InvitationRequest request) {
        AuthDetails auth = requireAuth();
        if (auth.getRole() != UserRole.ADMIN && auth.getRole() != UserRole.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo Admin/SuperAdmin puede invitar");
        }
        return invitationService.createInvitation(request, auth.getUserId());
    }

    @PostMapping("/invitations/{token}/accept")
    public void acceptInvitation(@PathVariable String token) {
        AuthDetails auth = requireAuth();
        invitationService.acceptInvitation(token, auth.getUserId());
    }

    @GetMapping("/invitations/{token}")
    public InvitationPreviewResponse previewInvitation(@PathVariable String token) {
        return invitationService.previewInvitation(token);
    }

    @GetMapping("/invitations")
    public List<InvitationResponse> listInvitations() {
        AuthDetails auth = requireAuth();
        if (auth.getRole() != UserRole.ADMIN && auth.getRole() != UserRole.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo Admin/SuperAdmin puede ver invitaciones");
        }
        return invitationService.listInvitations(auth.getUserId());
    }

    @DeleteMapping("/invitations/{token}/logical")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revokeInvitation(@PathVariable String token) {
        AuthDetails auth = requireAuth();
        if (auth.getRole() != UserRole.ADMIN && auth.getRole() != UserRole.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo Admin/SuperAdmin puede revocar invitaciones");
        }
        invitationService.revokeInvitation(token, auth.getUserId());
    }

    @DeleteMapping("/invitations/{token}/physical")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInvitation(@PathVariable String token) {
        AuthDetails auth = requireAuth();
        if (auth.getRole() != UserRole.ADMIN && auth.getRole() != UserRole.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Solo Admin/SuperAdmin puede eliminar invitaciones");
        }
        invitationService.deleteInvitation(token, auth.getUserId());
    }

    @GetMapping("/users")
    public List<UserAccountResponse> listUsers() {
        AuthDetails auth = requireAuth();
        return userAccountService.listUsers(auth.getRole(), auth.getUserId());
    }

    @GetMapping("/users/{id}")
    public UserAccountResponse getUser(@PathVariable Long id) {
        AuthDetails auth = requireAuth();
        return userAccountService.getUser(id, auth.getRole(), auth.getUserId());
    }

    @PutMapping("/users/{id}")
    public UserAccountResponse updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        AuthDetails auth = requireAuth();
        UserAccountResponse updated = userAccountService.updateUser(id, request, auth.getRole(), auth.getUserId());
        userAccountRepository.findById(auth.getUserId()).ifPresent((actor) -> {
            auditLogService.log("USER_UPDATE", actor.getId(), actor.getEmail(), updated.getId(), updated.getEmail(), null);
        });
        return updated;
    }

    @PutMapping("/users/{id}/status")
    public UserAccountResponse updateUserStatus(@PathVariable Long id,
            @Valid @RequestBody UserStatusRequest request) {
        AuthDetails auth = requireAuth();
        UserAccountResponse updated = userAccountService.updateUserStatus(id, request.getEnabled(), auth.getRole(),
                auth.getUserId());
        userAccountRepository.findById(auth.getUserId()).ifPresent((actor) -> {
            auditLogService.log(request.getEnabled() ? "USER_ENABLE" : "USER_DISABLE",
                    actor.getId(), actor.getEmail(), updated.getId(), updated.getEmail(), null);
        });
        return updated;
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        AuthDetails auth = requireAuth();
        if (auth.getRole() == UserRole.SUPER_ADMIN && id != null && id.equals(auth.getUserId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No puedes eliminar tu propia cuenta");
        }
        userAccountRepository.findById(id).ifPresent((target) -> {
            userAccountRepository.findById(auth.getUserId()).ifPresent((actor) -> {
                auditLogService.log("USER_DELETE", actor.getId(), actor.getEmail(), target.getId(), target.getEmail(), null);
            });
        });
        userAccountService.deleteUser(id, auth.getRole());
    }

    private String extractBearerToken(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header invalid");
        }
        return header.substring(7);
    }

    @Nullable
    private AuthDetails currentAuth() {
        return AuthContext.get();
    }

    private AuthDetails requireAuth() {
        AuthDetails details = currentAuth();
        if (details == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Debes iniciar sesion");
        }
        return details;
    }
}
