package maveit.corhuila.MaveitMap.dto;

public class AdminStatsResponse {
    private long totalUsers;
    // Session status (login/logout)
    private long sessionActiveUsers;
    private long sessionInactiveUsers;

    // Account status (enabled/disabled by SuperAdmin). Not shown in the dashboard cards by default,
    // but useful for management.
    private long enabledUsers;
    private long disabledUsers;
    private long associations;
    private long activeInvitations;

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getSessionActiveUsers() {
        return sessionActiveUsers;
    }

    public void setSessionActiveUsers(long sessionActiveUsers) {
        this.sessionActiveUsers = sessionActiveUsers;
    }

    public long getSessionInactiveUsers() {
        return sessionInactiveUsers;
    }

    public void setSessionInactiveUsers(long sessionInactiveUsers) {
        this.sessionInactiveUsers = sessionInactiveUsers;
    }

    public long getEnabledUsers() {
        return enabledUsers;
    }

    public void setEnabledUsers(long enabledUsers) {
        this.enabledUsers = enabledUsers;
    }

    public long getDisabledUsers() {
        return disabledUsers;
    }

    public void setDisabledUsers(long disabledUsers) {
        this.disabledUsers = disabledUsers;
    }

    public long getAssociations() {
        return associations;
    }

    public void setAssociations(long associations) {
        this.associations = associations;
    }

    public long getActiveInvitations() {
        return activeInvitations;
    }

    public void setActiveInvitations(long activeInvitations) {
        this.activeInvitations = activeInvitations;
    }
}
