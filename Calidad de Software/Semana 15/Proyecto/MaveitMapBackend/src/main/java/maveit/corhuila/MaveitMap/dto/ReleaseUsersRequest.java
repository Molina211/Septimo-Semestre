package maveit.corhuila.MaveitMap.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class ReleaseUsersRequest {

    @NotEmpty
    private List<Long> userIds;

    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }
}
