package maveit.corhuila.MaveitMap.services;

import java.util.List;
import maveit.corhuila.MaveitMap.dto.WaypointRequest;
import maveit.corhuila.MaveitMap.dto.WaypointResponse;

public interface WaypointService {

    List<WaypointResponse> listWaypoints(String search);

    WaypointResponse getWaypoint(Long id);

    WaypointResponse createWaypoint(WaypointRequest request);

    WaypointResponse updateWaypoint(Long id, WaypointRequest request);

    void deleteWaypoint(Long id);
}
