package maveit.corhuila.MaveitMap.dto;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import maveit.corhuila.MaveitMap.models.UserRole;

public class UserAccountResponse {

    private Long id;
    private String name;
    private String companyName;
    private String email;
    private UserRole role;
    private List<AccountReference> viewers = new ArrayList<>();
    private AccountReference owner;
    private boolean sessionActive;
    private OffsetDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public List<AccountReference> getViewers() {
        return viewers;
    }

    public void setViewers(List<AccountReference> viewers) {
        this.viewers = viewers;
    }

    public AccountReference getOwner() {
        return owner;
    }

    public void setOwner(AccountReference owner) {
        this.owner = owner;
    }

    public boolean isSessionActive() {
        return sessionActive;
    }

    public void setSessionActive(boolean sessionActive) {
        this.sessionActive = sessionActive;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
