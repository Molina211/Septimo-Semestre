package maveit.corhuila.MaveitMap.services;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import maveit.corhuila.MaveitMap.RegistrationProperties;
import maveit.corhuila.MaveitMap.dto.AccountReference;
import maveit.corhuila.MaveitMap.dto.PasswordResetRequest;
import maveit.corhuila.MaveitMap.dto.PasswordResetSessionResponse;
import maveit.corhuila.MaveitMap.dto.PasswordResetUpdateRequest;
import maveit.corhuila.MaveitMap.dto.PasswordResetVerifyRequest;
import maveit.corhuila.MaveitMap.dto.RegisterUserRequest;
import maveit.corhuila.MaveitMap.dto.RegistrationConfirmationRequest;
import maveit.corhuila.MaveitMap.dto.RegistrationResendRequest;
import maveit.corhuila.MaveitMap.dto.RegistrationSessionResponse;
import maveit.corhuila.MaveitMap.dto.UpdateUserRequest;
import maveit.corhuila.MaveitMap.dto.UserAccountResponse;
import maveit.corhuila.MaveitMap.dto.UserRoleDto;
import maveit.corhuila.MaveitMap.models.RegistrationVerification;
import maveit.corhuila.MaveitMap.models.PasswordResetVerification;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.models.UserRole;
import maveit.corhuila.MaveitMap.repositories.CatalogProductRepository;
import maveit.corhuila.MaveitMap.repositories.InvitationRepository;
import maveit.corhuila.MaveitMap.repositories.RegistrationVerificationRepository;
import maveit.corhuila.MaveitMap.repositories.PasswordResetVerificationRepository;
import maveit.corhuila.MaveitMap.repositories.SalesIntensitySettingsRepository;
import maveit.corhuila.MaveitMap.repositories.SalesGroupRepository;
import maveit.corhuila.MaveitMap.repositories.UserAccountRepository;
import maveit.corhuila.MaveitMap.repositories.WaypointRepository;
import maveit.corhuila.MaveitMap.security.PasswordEncryptionService;
import maveit.corhuila.MaveitMap.SecuritySetupProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserAccountServiceImpl implements UserAccountService {

    private final UserAccountRepository repository;
    private final PasswordEncryptionService encryptionService;
    private final EmailService emailService;
    private final SecuritySetupProperties setupProperties;
    private final InvitationRepository invitationRepository;
    private final UserSessionService userSessionService;
    private final RefreshTokenService refreshTokenService;
    private final WaypointRepository waypointRepository;
    private final SalesGroupRepository salesGroupRepository;
    private final CatalogProductRepository catalogProductRepository;
    private final SalesIntensitySettingsRepository salesIntensitySettingsRepository;
    private final RegistrationVerificationRepository registrationRepository;
    private final PasswordResetVerificationRepository passwordResetRepository;
    private final RegistrationProperties registrationProperties;
    private static final String CODE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public UserAccountServiceImpl(UserAccountRepository repository,
            PasswordEncryptionService encryptionService,
            EmailService emailService,
            SecuritySetupProperties setupProperties,
            InvitationRepository invitationRepository,
            UserSessionService userSessionService,
            RefreshTokenService refreshTokenService,
            WaypointRepository waypointRepository,
            SalesGroupRepository salesGroupRepository,
            CatalogProductRepository catalogProductRepository,
            SalesIntensitySettingsRepository salesIntensitySettingsRepository,
            RegistrationVerificationRepository registrationRepository,
            PasswordResetVerificationRepository passwordResetRepository,
            RegistrationProperties registrationProperties) {
        this.setupProperties = setupProperties;
        this.repository = repository;
        this.encryptionService = encryptionService;
        this.emailService = emailService;
        this.invitationRepository = invitationRepository;
        this.userSessionService = userSessionService;
        this.refreshTokenService = refreshTokenService;
        this.waypointRepository = waypointRepository;
        this.salesGroupRepository = salesGroupRepository;
        this.catalogProductRepository = catalogProductRepository;
        this.salesIntensitySettingsRepository = salesIntensitySettingsRepository;
        this.registrationRepository = registrationRepository;
        this.passwordResetRepository = passwordResetRepository;
        this.registrationProperties = registrationProperties;
    }

    @Override
    @Transactional
    public RegistrationSessionResponse register(RegisterUserRequest request, UserRole actingRole, Long actingUserId,
            String initialSuperAdminSecret) {
        cleanupExpiredVerifications();
        String email = normalizeEmail(request.getEmail());
        ensureEmailAvailable(email);
        UserRole role = resolveRole(request, actingRole, initialSuperAdminSecret);
        UserAccount owner = resolveOwner(actingRole, actingUserId);
        String encrypted = encryptionService.encrypt(request.getPassword().toCharArray());
        registrationRepository.deleteByEmailIgnoreCase(email);
        RegistrationVerification verification = new RegistrationVerification();
        verification.setEmail(email);
        verification.setName(request.getName().trim());
        verification.setCompanyName(request.getCompanyName().trim());
        verification.setEncryptedPassword(encrypted);
        verification.setRole(role);
        verification.setOwnerId(owner == null ? null : owner.getId());
        verification.setVerificationCode(generateVerificationCode());
        OffsetDateTime now = OffsetDateTime.now();
        verification.setCreatedAt(now);
        verification.setExpiresAt(now.plusMinutes(registrationProperties.getVerificationExpiryMinutes()));
        verification.setAttempts(0);
        registrationRepository.save(verification);
        emailService.sendVerificationCode(verification.getEmail(), verification.getName(), verification.getCompanyName(),
                verification.getVerificationCode(), verification.getExpiresAt());
        RegistrationSessionResponse response = new RegistrationSessionResponse();
        response.setEmail(email);
        response.setExpiresAt(verification.getExpiresAt());
        response.setAttemptsLeft(registrationProperties.getMaxVerificationAttempts());
        return response;
    }

    @Override
    @Transactional(noRollbackFor = ResponseStatusException.class)
    public UserAccount confirmRegistration(RegistrationConfirmationRequest request) {
        cleanupExpiredVerifications();
        String email = normalizeEmail(request.getEmail());
        RegistrationVerification verification = registrationRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro no encontrado"));
        OffsetDateTime now = OffsetDateTime.now();
        if (verification.getExpiresAt().isBefore(now)) {
            registrationRepository.delete(verification);
            throw new ResponseStatusException(HttpStatus.GONE, "Código expirado");
        }
        if (verification.getAttempts() >= registrationProperties.getMaxVerificationAttempts()) {
            registrationRepository.delete(verification);
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Máximos intentos alcanzados. Regístrate de nuevo");
        }
        if (!verification.getVerificationCode().equalsIgnoreCase(request.getCode().trim())) {
            verification.setAttempts(verification.getAttempts() + 1);
            registrationRepository.save(verification);
            int attemptsLeft = registrationProperties.getMaxVerificationAttempts() - verification.getAttempts();
            if (attemptsLeft <= 0) {
                registrationRepository.delete(verification);
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "Máximos intentos alcanzados. Regístrate de nuevo");
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Código inválido. Intentos restantes: " + attemptsLeft);
        }
        UserAccount account = toAccountFromVerification(verification);
        registrationRepository.delete(verification);
        emailService.sendWelcome(account);
        return account;
    }

    @Override
    @Transactional
    public void resendVerificationCode(RegistrationResendRequest request) {
        cleanupExpiredVerifications();
        String email = normalizeEmail(request.getEmail());
        repository.findByEmailIgnoreCase(email).ifPresent((acct) -> {
            if (acct.isVerified()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo ya fue verificado");
            }
        });
        RegistrationVerification verification = registrationRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro no encontrado"));
        OffsetDateTime now = OffsetDateTime.now();
        if (verification.getExpiresAt().isBefore(now)) {
            registrationRepository.delete(verification);
            throw new ResponseStatusException(HttpStatus.GONE, "Código expirado, regístrate nuevamente");
        }
        verification.setVerificationCode(generateVerificationCode());
        verification.setExpiresAt(now.plusMinutes(registrationProperties.getVerificationExpiryMinutes()));
        verification.setCreatedAt(now);
        registrationRepository.save(verification);
        emailService.sendVerificationCode(verification.getEmail(), verification.getName(), verification.getCompanyName(),
                verification.getVerificationCode(), verification.getExpiresAt());
    }

    @Override
    @Transactional
    public PasswordResetSessionResponse requestPasswordReset(PasswordResetRequest request) {
        cleanupExpiredPasswordResets();
        String email = normalizeEmail(request.getEmail());
        UserAccount account = repository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        passwordResetRepository.deleteByEmailIgnoreCase(email);
        PasswordResetVerification reset = new PasswordResetVerification();
        reset.setEmail(email);
        reset.setVerificationCode(generateVerificationCode(8));
        OffsetDateTime now = OffsetDateTime.now();
        reset.setCreatedAt(now);
        reset.setExpiresAt(now.plusMinutes(registrationProperties.getVerificationExpiryMinutes()));
        reset.setAttempts(0);
        passwordResetRepository.save(reset);
        emailService.sendPasswordResetCode(email, account.getName(), reset.getVerificationCode(), reset.getExpiresAt());
        PasswordResetSessionResponse response = new PasswordResetSessionResponse();
        response.setEmail(email);
        response.setExpiresAt(reset.getExpiresAt());
        response.setAttemptsLeft(registrationProperties.getMaxVerificationAttempts());
        return response;
    }

    @Override
    @Transactional(noRollbackFor = ResponseStatusException.class)
    public PasswordResetSessionResponse verifyPasswordReset(PasswordResetVerifyRequest request) {
        cleanupExpiredPasswordResets();
        String email = normalizeEmail(request.getEmail());
        PasswordResetVerification reset = passwordResetRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada"));
        validateResetCode(reset, request.getCode());
        PasswordResetSessionResponse response = new PasswordResetSessionResponse();
        response.setEmail(email);
        response.setExpiresAt(reset.getExpiresAt());
        response.setAttemptsLeft(registrationProperties.getMaxVerificationAttempts() - reset.getAttempts());
        return response;
    }

    @Override
    @Transactional(noRollbackFor = ResponseStatusException.class)
    public void resetPassword(PasswordResetUpdateRequest request) {
        cleanupExpiredPasswordResets();
        String email = normalizeEmail(request.getEmail());
        PasswordResetVerification reset = passwordResetRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada"));
        validateResetCode(reset, request.getCode());
        UserAccount account = repository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        account.setEncryptedPassword(encryptionService.encrypt(request.getPassword().toCharArray()));
        account.setTokensRevokedAt(OffsetDateTime.now());
        account.setUpdatedAt(OffsetDateTime.now());
        repository.save(account);
        userSessionService.deleteSessionFor(account);
        refreshTokenService.revokeAllForUser(account.getId());
        passwordResetRepository.delete(reset);
    }

    @Override
    public List<UserAccountResponse> listUsers(UserRole requestingRole, Long requestingUserId) {
        if (requestingRole == UserRole.SUPER_ADMIN) {
            return repository.findAll().stream()
                    .filter((acct) -> requestingUserId == null || acct.getId() == null
                            || !acct.getId().equals(requestingUserId))
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        }
        ensureAdmin(requestingRole);
        if (requestingUserId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El identificador del administrador es obligatorio");
        }
        return repository.findByOwner_Id(requestingUserId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public UserAccountResponse getUser(Long id, UserRole requestingRole, Long requestingUserId) {
        UserAccount account = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (requestingRole == UserRole.SUPER_ADMIN) {
            return toResponse(account);
        }
        if (requestingUserId != null && id.equals(requestingUserId)) {
            return toResponse(account);
        }
        if (requestingRole == UserRole.ADMIN && account.getOwner() != null
                && account.getOwner().getId().equals(requestingUserId)) {
            return toResponse(account);
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No autorizado");
    }

    @Override
    @Transactional
    public UserAccountResponse updateUser(Long id, UpdateUserRequest request,
            UserRole requestingRole, Long requestingUserId) {
        UserAccount account = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (requestingRole == UserRole.ADMIN && (account.getOwner() == null
                || !account.getOwner().getId().equals(requestingUserId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No autorizado");
        }
        account.setName(request.getName().trim());
        account.setCompanyName(request.getCompanyName().trim());
        account.setEmail(request.getEmail().trim().toLowerCase());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            account.setEncryptedPassword(encryptionService.encrypt(request.getPassword().toCharArray()));
        }
        if (request.getRole() != null) {
            if (requestingRole != UserRole.SUPER_ADMIN) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo SuperAdmin puede cambiar el rol");
            }
            account.setRole(resolveRole(request.getRole()));
        }
        account.setUpdatedAt(OffsetDateTime.now());
        return toResponse(repository.save(account));
    }

    @Override
    @Transactional
    public UserAccountResponse updateUserStatus(Long id, boolean enabled,
            UserRole requestingRole, Long requestingUserId) {
        if (requestingRole != UserRole.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo SuperAdmin puede actualizar el estado");
        }
        if (requestingUserId != null && id != null && id.equals(requestingUserId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No puedes cambiar el estado de tu propia cuenta");
        }
        UserAccount account = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        account.setEnabled(enabled);
        if (!enabled) {
            account.setTokensRevokedAt(OffsetDateTime.now());
            account.setSessionActive(false);
            userSessionService.deleteSessionFor(account);
            refreshTokenService.revokeAllForUser(account.getId());
        }
        account.setUpdatedAt(OffsetDateTime.now());
        return toResponse(repository.save(account));
    }

    @Override
    @Transactional
    public void revokeRefreshToken(String refreshToken) {
        refreshTokenService.revoke(refreshToken);
    }

    @Override
    @Transactional
    public void deleteUser(Long id, UserRole requestingRole) {
        if (requestingRole != UserRole.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo SuperAdmin puede eliminar usuarios");
        }
        UserAccount target = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        releaseDependents(target);
        repository.delete(target);
    }

    @Override
    public void resendWelcomeEmail(String email, UserRole requestingRole, Long requestingUserId) {
        if (requestingRole == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Debes iniciar sesion");
        }
        if (requestingRole != UserRole.SUPER_ADMIN && requestingRole != UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo ADMIN/SUPER_ADMIN puede enviar correos");
        }
        UserAccount target = repository.findByEmailIgnoreCase(email.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (requestingRole != UserRole.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo SuperAdmin puede enviar correos");
        }
        emailService.sendWelcome(target);
    }

    @Override
    public void markSessionActive(Long id, boolean active) {
        repository.findById(id)
                .map((acct) -> {
                    acct.setSessionActive(active);
                    return repository.save(acct);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    @Override
    @Transactional
    public void releaseAccounts(List<Long> userIds, UserRole requestingRole, Long requestingUserId) {
        ensureAdmin(requestingRole);
        if (userIds == null || userIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debes indicar al menos una cuenta");
        }
        for (Long id : userIds) {
            releaseSingleAccount(id, requestingRole, requestingUserId);
        }
    }

    @Override
    @Transactional
    public void releaseSelf(Long userId) {
        UserAccount account = repository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (account.getRole() != UserRole.VIEWER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los viewers pueden desasociarse");
        }
        account.setOwner(null);
        account.setRole(UserRole.ADMIN);
        account.setSessionActive(true);
        account.setUpdatedAt(OffsetDateTime.now());
        repository.save(account);
        salesIntensitySettingsRepository.deleteByOwnerId(account.getId());
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo es obligatorio");
        }
        return email.trim().toLowerCase();
    }

    private void cleanupExpiredVerifications() {
        registrationRepository.deleteByExpiresAtBefore(OffsetDateTime.now());
    }

    private void cleanupExpiredPasswordResets() {
        passwordResetRepository.deleteByExpiresAtBefore(OffsetDateTime.now());
    }

    private void ensureEmailAvailable(String email) {
        repository.findByEmailIgnoreCase(email).ifPresent((existing) -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado");
        });
    }

    private String generateVerificationCode() {
        return generateVerificationCode(6);
    }

    private String generateVerificationCode(int length) {
        ThreadLocalRandom random = ThreadLocalRandom.current();
        StringBuilder builder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            builder.append(CODE_CHARSET.charAt(random.nextInt(CODE_CHARSET.length())));
        }
        return builder.toString();
    }

    private void validateResetCode(PasswordResetVerification reset, String code) {
        OffsetDateTime now = OffsetDateTime.now();
        if (reset.getExpiresAt().isBefore(now)) {
            passwordResetRepository.delete(reset);
            throw new ResponseStatusException(HttpStatus.GONE, "CÃ³digo expirado");
        }
        if (reset.getAttempts() >= registrationProperties.getMaxVerificationAttempts()) {
            passwordResetRepository.delete(reset);
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "MÃ¡ximos intentos alcanzados. Solicita el cÃ³digo nuevamente");
        }
        if (!reset.getVerificationCode().equalsIgnoreCase(code.trim())) {
            reset.setAttempts(reset.getAttempts() + 1);
            passwordResetRepository.save(reset);
            int attemptsLeft = registrationProperties.getMaxVerificationAttempts() - reset.getAttempts();
            if (attemptsLeft <= 0) {
                passwordResetRepository.delete(reset);
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "MÃ¡ximos intentos alcanzados. Solicita el cÃ³digo nuevamente");
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "CÃ³digo invÃ¡lido. Intentos restantes: " + attemptsLeft);
        }
    }

    private UserAccount toAccountFromVerification(RegistrationVerification verification) {
        UserAccount account = new UserAccount();
        account.setName(verification.getName());
        account.setCompanyName(verification.getCompanyName());
        account.setEmail(verification.getEmail());
        account.setEncryptedPassword(verification.getEncryptedPassword());
        account.setRole(verification.getRole());
        if (verification.getOwnerId() != null) {
            UserAccount owner = repository.findById(verification.getOwnerId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Administrador no encontrado"));
            account.setOwner(owner);
        }
        OffsetDateTime now = OffsetDateTime.now();
        account.setCreatedAt(now);
        account.setUpdatedAt(now);
        account.setVerified(true);
        account.setVerifiedAt(now);
        account.setEnabled(true);
        return repository.save(account);
    }

    private void releaseSingleAccount(Long id, UserRole requestingRole, Long requestingUserId) {
        UserAccount account = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (requestingRole == UserRole.ADMIN && (account.getOwner() == null
                || !account.getOwner().getId().equals(requestingUserId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No autorizado");
        }
        account.setOwner(null);
        account.setRole(UserRole.ADMIN);
        account.setUpdatedAt(OffsetDateTime.now());
        repository.save(account);
        salesIntensitySettingsRepository.deleteByOwnerId(account.getId());
    }

    private void releaseDependents(UserAccount target) {
        Long targetId = target.getId();
        if (targetId != null) {
            List<Long> viewerIds = repository.findByOwner_Id(targetId).stream()
                    .map(UserAccount::getId)
                    .collect(Collectors.toList());
            if (!viewerIds.isEmpty()) {
                releaseAccounts(viewerIds, UserRole.SUPER_ADMIN, null);
            }
        }
        if (target.getRole() == UserRole.VIEWER && target.getOwner() != null) {
            releaseSelf(target.getId());
        }
        userSessionService.deleteSessionFor(target);
        refreshTokenService.revokeAllForUser(target.getId());
        if (targetId != null) {
            salesGroupRepository.deleteByOwnerId(targetId);
            waypointRepository.deleteByOwnerId(targetId);
            catalogProductRepository.deleteByOwnerId(targetId);
            salesIntensitySettingsRepository.deleteByOwnerId(targetId);
            invitationRepository.deleteByInviter_Id(targetId);
        }
    }

    private UserAccountResponse toResponse(UserAccount account) {
        UserAccountResponse response = new UserAccountResponse();
        response.setId(account.getId());
        response.setName(account.getName());
        response.setCompanyName(account.getCompanyName());
        response.setEmail(account.getEmail());
        response.setRole(account.getRole());
        response.setViewers(getViewersFor(account));
        response.setOwner(toReference(account.getOwner()));
        response.setSessionActive(account.isSessionActive());
        response.setEnabled(account.isEnabled());
        response.setCreatedAt(account.getCreatedAt());
        return response;
    }

    private AccountReference toReference(UserAccount account) {
        if (account == null) {
            return null;
        }
        AccountReference reference = new AccountReference();
        reference.setId(account.getId());
        reference.setName(account.getName());
        reference.setEmail(account.getEmail());
        reference.setCompanyName(account.getCompanyName());
        return reference;
    }

    private List<AccountReference> getViewersFor(UserAccount account) {
        if (account == null || account.getId() == null) {
            return List.of();
        }
        return repository.findByOwner_Id(account.getId()).stream()
                .map(this::toReference)
                .collect(Collectors.toList());
    }

    private void ensureAdmin(UserRole role) {
        if (role == null || role == UserRole.VIEWER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No autorizado");
        }
    }

    private UserRole resolveRole(RegisterUserRequest request, UserRole actingRole, String initialSuperAdminSecret) {
        UserRoleDto dto = request.getRole();
        if (dto == UserRoleDto.SUPER_ADMIN) {
            return resolveSuperAdminRole(actingRole, initialSuperAdminSecret);
        }
        if (dto == UserRoleDto.VIEWER) {
            return UserRole.VIEWER;
        }
        return UserRole.ADMIN;
    }

    private UserRole resolveSuperAdminRole(UserRole actingRole, String initialSuperAdminSecret) {
        if (actingRole == UserRole.SUPER_ADMIN) {
            return UserRole.SUPER_ADMIN;
        }
        String expected = setupProperties.getInitialSuperAdminSecret();
        if (actingRole == null && expected != null && expected.equals(initialSuperAdminSecret)) {
            return UserRole.SUPER_ADMIN;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo SuperAdmin puede crear otro SuperAdmin");
    }

    private UserRole resolveRole(UserRoleDto dto) {
        if (dto == null) {
            return UserRole.ADMIN;
        }
        if (dto == UserRoleDto.SUPER_ADMIN) {
            return UserRole.SUPER_ADMIN;
        }
        if (dto == UserRoleDto.VIEWER) {
            return UserRole.VIEWER;
        }
        return UserRole.ADMIN;
    }

    private UserAccount resolveOwner(UserRole actingRole, Long actingUserId) {
        if (actingRole == UserRole.ADMIN) {
            if (actingUserId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El identificador del administrador es obligatorio");
            }
            return repository.findById(actingUserId)
                    .orElseThrow(
                            () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Administrador no encontrado"));
        }
        return null;
    }
}
