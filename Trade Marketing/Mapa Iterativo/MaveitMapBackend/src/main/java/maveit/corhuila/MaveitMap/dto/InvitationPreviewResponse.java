package maveit.corhuila.MaveitMap.dto;

import java.time.OffsetDateTime;

public class InvitationPreviewResponse {

    private String inviterName;
    private String inviterCompany;
    private String inviteeEmail;
    private OffsetDateTime expiresAt;

    public String getInviterName() {
        return inviterName;
    }

    public void setInviterName(String inviterName) {
        this.inviterName = inviterName;
    }

    public String getInviterCompany() {
        return inviterCompany;
    }

    public void setInviterCompany(String inviterCompany) {
        this.inviterCompany = inviterCompany;
    }

    public String getInviteeEmail() {
        return inviteeEmail;
    }

    public void setInviteeEmail(String inviteeEmail) {
        this.inviteeEmail = inviteeEmail;
    }

    public OffsetDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(OffsetDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}
