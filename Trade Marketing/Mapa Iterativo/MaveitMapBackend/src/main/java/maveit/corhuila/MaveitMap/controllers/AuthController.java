package maveit.corhuila.MaveitMap.controllers;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import java.util.List;
import maveit.corhuila.MaveitMap.dto.AuthResponse;
import maveit.corhuila.MaveitMap.dto.InvitationPreviewResponse;
import maveit.corhuila.MaveitMap.dto.InvitationRequest;
import maveit.corhuila.MaveitMap.dto.InvitationResponse;
import maveit.corhuila.MaveitMap.dto.LoginRequest;
import maveit.corhuila.MaveitMap.dto.PasswordResetRequest;
import maveit.corhuila.MaveitMap.dto.PasswordResetSessionResponse;
import maveit.corhuila.MaveitMap.dto.PasswordResetUpdateRequest;
import maveit.corhuila.MaveitMap.dto.PasswordResetVerifyRequest;
import maveit.corhuila.MaveitMap.dto.RegisterUserRequest;
import maveit.corhuila.MaveitMap.dto.EmailWelcomeRequest;
import maveit.corhuila.MaveitMap.dto.UpdateUserRequest;
import maveit.corhuila.MaveitMap.dto.UserAccountResponse;
import maveit.corhuila.MaveitMap.dto.ReleaseUsersRequest;
import maveit.corhuila.MaveitMap.dto.RegistrationConfirmationRequest;
import maveit.corhuila.MaveitMap.dto.RegistrationResendRequest;
import maveit.corhuila.MaveitMap.dto.RegistrationSessionResponse;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.models.UserRole;
import maveit.corhuila.MaveitMap.security.AuthContext;
import maveit.corhuila.MaveitMap.security.AuthDetails;
import maveit.corhuila.MaveitMap.security.JwtTokenService;
import maveit.corhuila.MaveitMap.services.AuthenticationService;
import maveit.corhuila.MaveitMap.services.InvitationService;
import maveit.corhuila.MaveitMap.models.RevocationReason;
import maveit.corhuila.MaveitMap.services.TokenRevocationService;
import maveit.corhuila.MaveitMap.services.UserAccountService;
import maveit.corhuila.MaveitMap.services.UserSessionService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
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

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final UserAccountService userAccountService;
    private final InvitationService invitationService;
    private final AuthenticationService authenticationService;
    private final TokenRevocationService tokenRevocationService;
    private final JwtTokenService jwtTokenService;
    private final UserSessionService userSessionService;

    public AuthController(UserAccountService userAccountService,
            InvitationService invitationService,
            AuthenticationService authenticationService,
            TokenRevocationService tokenRevocationService,
            JwtTokenService jwtTokenService,
            UserSessionService userSessionService) {
        this.userAccountService = userAccountService;
        this.invitationService = invitationService;
        this.authenticationService = authenticationService;
        this.tokenRevocationService = tokenRevocationService;
        this.jwtTokenService = jwtTokenService;
        this.userSessionService = userSessionService;
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
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authenticationService.login(request);
    }

    @PostMapping("/users/welcome")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void sendWelcomeEmail(@Valid @RequestBody EmailWelcomeRequest request) {
        AuthDetails auth = requireAuth();
        userAccountService.resendWelcomeEmail(request.getEmail(), auth.getRole(), auth.getUserId());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader("Authorization") String authorizationHeader) {
        requireAuth();
        String token = extractBearerToken(authorizationHeader);
        long expiresAt = jwtTokenService.parseToken(token).getExpiresAt();
        tokenRevocationService.revokeToken(token, expiresAt, RevocationReason.LOGOUT);
        userSessionService.closeSession(token).ifPresent((account) -> {
            boolean hasActive = userSessionService.countActiveSessions(account) > 0;
            userAccountService.markSessionActive(account.getId(), hasActive);
        });
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
        return userAccountService.updateUser(id, request, auth.getRole(), auth.getUserId());
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        AuthDetails auth = requireAuth();
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
