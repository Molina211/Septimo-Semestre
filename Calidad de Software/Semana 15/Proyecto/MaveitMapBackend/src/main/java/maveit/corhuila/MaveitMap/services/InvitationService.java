package maveit.corhuila.MaveitMap.services;

import maveit.corhuila.MaveitMap.dto.InvitationPreviewResponse;
import maveit.corhuila.MaveitMap.dto.InvitationRequest;
import maveit.corhuila.MaveitMap.dto.InvitationResponse;

import java.util.List;

public interface InvitationService {
    InvitationResponse createInvitation(InvitationRequest request, Long adminId);
    void acceptInvitation(String token, Long viewerId);
    List<InvitationResponse> listInvitations(Long adminId);
    void revokeInvitation(String token, Long adminId);
    InvitationPreviewResponse previewInvitation(String token);
    void deleteInvitation(String token, Long adminId);
}
