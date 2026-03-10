package maveit.corhuila.MaveitMap.services;

import java.util.List;
import maveit.corhuila.MaveitMap.dto.SalesGroupRequest;
import maveit.corhuila.MaveitMap.dto.SalesGroupResponse;

public interface SalesGroupService {

    List<SalesGroupResponse> listGroups(Long productId);

    SalesGroupResponse getGroup(Long id);

    SalesGroupResponse createGroup(SalesGroupRequest request);

    SalesGroupResponse updateGroup(Long id, SalesGroupRequest request);

    void deleteGroup(Long id);
}
