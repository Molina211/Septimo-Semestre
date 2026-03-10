package maveit.corhuila.MaveitMap.services;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import maveit.corhuila.MaveitMap.dto.InvitationPreviewResponse;
import maveit.corhuila.MaveitMap.dto.InvitationRequest;
import maveit.corhuila.MaveitMap.dto.InvitationResponse;
import maveit.corhuila.MaveitMap.models.Invitation;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.models.UserRole;
import maveit.corhuila.MaveitMap.models.RevocationReason;
import maveit.corhuila.MaveitMap.repositories.InvitationRepository;
import maveit.corhuila.MaveitMap.repositories.CatalogProductRepository;
import maveit.corhuila.MaveitMap.repositories.SalesIntensitySettingsRepository;
import maveit.corhuila.MaveitMap.repositories.SalesGroupProductRepository;
import maveit.corhuila.MaveitMap.repositories.SalesGroupRepository;
import maveit.corhuila.MaveitMap.repositories.UserAccountRepository;
import maveit.corhuila.MaveitMap.repositories.WaypointRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class InvitationServiceImpl implements InvitationService {

    private static final int DEFAULT_EXPIRATION_MINUTES = 10;

    private final InvitationRepository invitationRepository;
    private final UserAccountRepository userRepository;
    private final CatalogProductRepository catalogProductRepository;
    private final SalesIntensitySettingsRepository salesIntensitySettingsRepository;
    private final SalesGroupProductRepository salesGroupProductRepository;
    private final SalesGroupRepository salesGroupRepository;
    private final WaypointRepository waypointRepository;
    private final EmailService emailService;
    private final TokenRevocationService tokenRevocationService;

    public InvitationServiceImpl(InvitationRepository invitationRepository,
            UserAccountRepository userRepository,
            CatalogProductRepository catalogProductRepository,
            SalesIntensitySettingsRepository salesIntensitySettingsRepository,
            SalesGroupProductRepository salesGroupProductRepository,
            SalesGroupRepository salesGroupRepository,
            WaypointRepository waypointRepository,
            EmailService emailService,
            TokenRevocationService tokenRevocationService) {
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
        this.catalogProductRepository = catalogProductRepository;
        this.salesIntensitySettingsRepository = salesIntensitySettingsRepository;
        this.salesGroupProductRepository = salesGroupProductRepository;
        this.salesGroupRepository = salesGroupRepository;
        this.waypointRepository = waypointRepository;
        this.emailService = emailService;
        this.tokenRevocationService = tokenRevocationService;
    }

    @Override
    @Transactional
    public InvitationResponse createInvitation(InvitationRequest request, Long adminId) {
        UserAccount admin = validateInvoker(adminId);
        OffsetDateTime now = OffsetDateTime.now();
        int minutes = request.getExpiresInMinutes() == null ? DEFAULT_EXPIRATION_MINUTES
                : request.getExpiresInMinutes();
        OffsetDateTime expires = now.plusMinutes(minutes);
        Invitation invitation = new Invitation();
        invitation.setToken(UUID.randomUUID().toString());
        invitation.setInviter(admin);
        invitation.setInviteeEmail(request.getInviteeEmail().trim().toLowerCase());
        invitation.setExpiresAt(expires);
        invitation.setRevoked(false);
        invitationRepository.save(invitation);
        emailService.sendInvitation(invitation);
        return mapToResponse(invitation);
    }

    @Override
    @Transactional
    public void acceptInvitation(String token, Long viewerId) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitación no encontrada"));
        validateInvitationActive(invitation);
        UserAccount viewer = userRepository.findById(viewerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (!viewer.getEmail().equalsIgnoreCase(invitation.getInviteeEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El correo no coincide con la invitación");
        }
        if (viewer.getOwner() != null && !viewer.getOwner().getId().equals(invitation.getInviter().getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario ya pertenece a otro administrador");
        }
        if (viewer.getRole() == UserRole.ADMIN && userRepository.countByOwner(viewer) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No puedes asociarte a otro administrador mientras tienes viewers vinculados");
        }
        purgeViewerData(viewer.getId());
        viewer.setOwner(invitation.getInviter());
        viewer.setRole(UserRole.VIEWER);
        userRepository.save(viewer);
        invitationRepository.delete(invitation);
    }

    @Override
    public InvitationPreviewResponse previewInvitation(String token) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "InvitaciÃ³n no encontrada"));
        validateInvitationActive(invitation);
        return mapToPreview(invitation);
    }

    @Override
    public List<InvitationResponse> listInvitations(Long adminId) {
        UserAccount admin = validateInvoker(adminId);
        return invitationRepository.findByInviter_IdOrderByExpiresAtAsc(admin.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void revokeInvitation(String token, Long adminId) {
        UserAccount admin = validateInvoker(adminId);
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitación no encontrada"));
        if (!invitation.getInviter().getId().equals(admin.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo el creador puede revocar la invitación");
        }
        if (invitation.getAcceptedAt() != null || invitation.isRevoked()) {
            return;
        }
        invitation.setRevoked(true);
        invitationRepository.save(invitation);
        tokenRevocationService.revokeToken(token, invitation.getExpiresAt().toInstant().toEpochMilli(),
                RevocationReason.INVITATION_REVOKE);
    }

    @Override
    @Transactional
    public void deleteInvitation(String token, Long adminId) {
        UserAccount admin = validateInvoker(adminId);
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitaci\u00f3n no encontrada"));
        if (!invitation.getInviter().getId().equals(admin.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Solo el creador puede eliminar la invitaci\u00f3n");
        }
        invitationRepository.delete(invitation);
    }

    private InvitationResponse mapToResponse(Invitation invitation) {
        InvitationResponse response = new InvitationResponse();
        response.setToken(invitation.getToken());
        response.setInviteeEmail(invitation.getInviteeEmail());
        response.setExpiresAt(invitation.getExpiresAt());
        response.setRevoked(invitation.isRevoked());
        return response;
    }

    private InvitationPreviewResponse mapToPreview(Invitation invitation) {
        InvitationPreviewResponse preview = new InvitationPreviewResponse();
        preview.setInviterName(invitation.getInviter().getName());
        preview.setInviterCompany(invitation.getInviter().getCompanyName());
        preview.setInviteeEmail(invitation.getInviteeEmail());
        preview.setExpiresAt(invitation.getExpiresAt());
        return preview;
    }

    private UserAccount validateInvoker(Long adminId) {
        if (adminId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El identificador del administrador es obligatorio");
        }
        UserAccount admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Administrador no encontrado"));
        if (admin.getRole() != UserRole.ADMIN && admin.getRole() != UserRole.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo Admin o SuperAdmin puede invitar usuarios");
        }
        return admin;
    }

    private void validateInvitationActive(Invitation invitation) {
        OffsetDateTime now = OffsetDateTime.now();
        if (invitation.isRevoked()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La invitación ya no está activa");
        }
        if (invitation.getAcceptedAt() != null) {
            invitationRepository.delete(invitation);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La invitación ya no está activa");
        }
        if (invitation.getExpiresAt().isBefore(now)) {
            invitationRepository.delete(invitation);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La invitación expiró");
        }
    }

    private void purgeViewerData(Long viewerId) {
        if (viewerId == null) {
            return;
        }
        salesGroupProductRepository.deleteByOwnerId(viewerId);
        salesGroupRepository.deleteByOwnerId(viewerId);
        waypointRepository.deleteByOwnerId(viewerId);
        catalogProductRepository.deleteByOwnerId(viewerId);
        salesIntensitySettingsRepository.deleteByOwnerId(viewerId);
    }
}
