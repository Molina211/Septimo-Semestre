package maveit.corhuila.MaveitMap.controllers;

import jakarta.validation.Valid;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;
import maveit.corhuila.MaveitMap.dto.AdminConfigResponse;
import maveit.corhuila.MaveitMap.dto.AdminConfigUpdateRequest;
import maveit.corhuila.MaveitMap.dto.AdminInvitationResponse;
import maveit.corhuila.MaveitMap.dto.AdminLogResponse;
import maveit.corhuila.MaveitMap.dto.AdminStatsResponse;
import maveit.corhuila.MaveitMap.dto.AdminUserCreateRequest;
import maveit.corhuila.MaveitMap.dto.UserAccountResponse;
import maveit.corhuila.MaveitMap.models.AdminConfig;
import maveit.corhuila.MaveitMap.models.AuditLog;
import maveit.corhuila.MaveitMap.models.Invitation;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.models.UserRole;
import maveit.corhuila.MaveitMap.repositories.InvitationRepository;
import maveit.corhuila.MaveitMap.repositories.UserAccountRepository;
import maveit.corhuila.MaveitMap.security.AuthContext;
import maveit.corhuila.MaveitMap.security.AuthDetails;
import maveit.corhuila.MaveitMap.security.PasswordEncryptionService;
import maveit.corhuila.MaveitMap.services.AdminConfigService;
import maveit.corhuila.MaveitMap.services.AuditLogService;
import maveit.corhuila.MaveitMap.services.UserAccountService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
@Validated
public class AdminController {

    private final UserAccountRepository userAccountRepository;
    private final InvitationRepository invitationRepository;
    private final AuditLogService auditLogService;
    private final AdminConfigService adminConfigService;
    private final PasswordEncryptionService passwordEncryptionService;
    private final UserAccountService userAccountService;

    public AdminController(UserAccountRepository userAccountRepository,
            InvitationRepository invitationRepository,
            AuditLogService auditLogService,
            AdminConfigService adminConfigService,
            PasswordEncryptionService passwordEncryptionService,
            UserAccountService userAccountService) {
        this.userAccountRepository = userAccountRepository;
        this.invitationRepository = invitationRepository;
        this.auditLogService = auditLogService;
        this.adminConfigService = adminConfigService;
        this.passwordEncryptionService = passwordEncryptionService;
        this.userAccountService = userAccountService;
    }

    @GetMapping("/stats")
    public AdminStatsResponse stats() {
        requireSuperAdmin();
        AdminStatsResponse out = new AdminStatsResponse();
        out.setTotalUsers(userAccountRepository.count());
        out.setSessionActiveUsers(userAccountRepository.countBySessionActiveTrue());
        out.setSessionInactiveUsers(userAccountRepository.countBySessionActiveFalse());
        out.setEnabledUsers(userAccountRepository.countByEnabledTrue());
        out.setDisabledUsers(userAccountRepository.countByEnabledFalse());
        out.setAssociations(userAccountRepository.countByOwnerIsNotNull());
        out.setActiveInvitations(invitationRepository.countByRevokedFalseAndExpiresAtAfter(OffsetDateTime.now()));
        return out;
    }

    @GetMapping("/logs")
    public List<AdminLogResponse> logs(
            @RequestParam(value = "action", required = false) String action,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "from", required = false) OffsetDateTime from,
            @RequestParam(value = "to", required = false) OffsetDateTime to,
            @RequestParam(value = "limit", required = false, defaultValue = "100") int limit) {
        AuthDetails auth = requireSuperAdmin();
        List<AuditLog> logs = auditLogService.search(action, userId, from, to, limit);
        // A SuperAdmin should not see their own records; other SuperAdmins can still see them.
        Long selfId = auth.getUserId();
        return logs.stream()
                .filter((l) -> selfId == null
                        || (l.getActorUserId() == null || !selfId.equals(l.getActorUserId()))
                        && (l.getTargetUserId() == null || !selfId.equals(l.getTargetUserId())))
                .map(this::toLogResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/config")
    public AdminConfigResponse getConfig() {
        requireSuperAdmin();
        return toConfigResponse(adminConfigService.getOrCreate());
    }

    @PutMapping("/config")
    public AdminConfigResponse updateConfig(@Valid @RequestBody AdminConfigUpdateRequest request) {
        AuthDetails auth = requireSuperAdmin();
        AdminConfigService.AdminConfigUpdate update = new AdminConfigService.AdminConfigUpdate();
        update.accessTokenExpirationMillis = request.getAccessTokenExpirationMillis();
        update.refreshTokenExpirationMillis = request.getRefreshTokenExpirationMillis();
        update.defaultInvitationExpiryMinutes = request.getDefaultInvitationExpiryMinutes();
        update.verificationExpiryMinutes = request.getVerificationExpiryMinutes();
        update.maxVerificationAttempts = request.getMaxVerificationAttempts();
        AdminConfig updated = adminConfigService.update(update);
        userAccountRepository.findById(auth.getUserId()).ifPresent((actor) -> {
            auditLogService.log("CONFIG_UPDATE", actor.getId(), actor.getEmail(), null, null, null);
        });
        return toConfigResponse(updated);
    }

    @GetMapping("/invitations")
    public List<AdminInvitationResponse> listInvitations() {
        requireSuperAdmin();
        return invitationRepository.findAllByOrderByExpiresAtAsc().stream()
                .map(this::toInvitationResponse)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/invitations/{token}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInvitationAny(@PathVariable String token) {
        AuthDetails auth = requireSuperAdmin();
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitacion no encontrada"));
        invitationRepository.delete(invitation);
        userAccountRepository.findById(auth.getUserId()).ifPresent((actor) -> {
            auditLogService.log("INVITATION_DELETE", actor.getId(), actor.getEmail(), null, null, token);
        });
    }

    @DeleteMapping("/invitations/expired")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void purgeExpiredInvitations() {
        AuthDetails auth = requireSuperAdmin();
        invitationRepository.deleteByExpiresAtBefore(OffsetDateTime.now());
        userAccountRepository.findById(auth.getUserId()).ifPresent((actor) -> {
            auditLogService.log("INVITATION_PURGE_EXPIRED", actor.getId(), actor.getEmail(), null, null, null);
        });
    }

    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    public UserAccountResponse createUser(@Valid @RequestBody AdminUserCreateRequest request) {
        AuthDetails auth = requireSuperAdmin();
        if (request.getRole() == UserRole.VIEWER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede crear VIEWER manualmente");
        }
        String email = request.getEmail().trim().toLowerCase();
        userAccountRepository.findByEmailIgnoreCase(email).ifPresent((existing) -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya esta registrado");
        });
        UserAccount account = new UserAccount();
        OffsetDateTime now = OffsetDateTime.now();
        account.setName(request.getName().trim());
        account.setCompanyName(request.getCompanyName().trim());
        account.setEmail(email);
        account.setEncryptedPassword(passwordEncryptionService.encrypt(request.getPassword().toCharArray()));
        account.setRole(request.getRole());
        account.setCreatedAt(now);
        account.setUpdatedAt(now);
        // Users created by SUPER_ADMIN must verify their email on first login.
        account.setVerified(false);
        account.setVerifiedAt(null);
        account.setEnabled(true);
        UserAccount saved = userAccountRepository.save(account);
        userAccountRepository.findById(auth.getUserId()).ifPresent((actor) -> {
            auditLogService.log("USER_CREATE", actor.getId(), actor.getEmail(), saved.getId(), saved.getEmail(), null);
        });
        // Reuse existing mapping logic
        return userAccountService.getUser(saved.getId(), auth.getRole(), auth.getUserId());
    }

    private AdminLogResponse toLogResponse(AuditLog log) {
        AdminLogResponse out = new AdminLogResponse();
        out.setId(log.getId());
        out.setCreatedAt(log.getCreatedAt());
        out.setAction(log.getAction());
        out.setActorUserId(log.getActorUserId());
        out.setActorEmail(log.getActorEmail());
        out.setTargetUserId(log.getTargetUserId());
        out.setTargetEmail(log.getTargetEmail());
        out.setMetadata(log.getMetadata());
        return out;
    }

    private AdminInvitationResponse toInvitationResponse(Invitation invitation) {
        AdminInvitationResponse out = new AdminInvitationResponse();
        out.setToken(invitation.getToken());
        out.setInviterEmail(invitation.getInviter() == null ? null : invitation.getInviter().getEmail());
        out.setInviteeEmail(invitation.getInviteeEmail());
        out.setExpiresAt(invitation.getExpiresAt());
        out.setRevoked(invitation.isRevoked());
        return out;
    }

    private AdminConfigResponse toConfigResponse(AdminConfig cfg) {
        AdminConfigResponse out = new AdminConfigResponse();
        out.setAccessTokenExpirationMillis(cfg.getAccessTokenExpirationMillis());
        out.setRefreshTokenExpirationMillis(cfg.getRefreshTokenExpirationMillis());
        out.setDefaultInvitationExpiryMinutes(cfg.getDefaultInvitationExpiryMinutes());
        out.setVerificationExpiryMinutes(cfg.getVerificationExpiryMinutes());
        out.setMaxVerificationAttempts(cfg.getMaxVerificationAttempts());
        out.setUpdatedAt(cfg.getUpdatedAt());
        return out;
    }

    private AuthDetails requireSuperAdmin() {
        AuthDetails details = AuthContext.get();
        if (details == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token requerido");
        }
        if (details.getRole() != UserRole.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo SuperAdmin");
        }
        return details;
    }
}
