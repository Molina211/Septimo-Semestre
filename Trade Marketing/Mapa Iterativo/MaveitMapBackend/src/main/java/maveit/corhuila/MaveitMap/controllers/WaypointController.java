package maveit.corhuila.MaveitMap.controllers;

import jakarta.validation.Valid;
import java.util.List;
import maveit.corhuila.MaveitMap.dto.WaypointRequest;
import maveit.corhuila.MaveitMap.dto.WaypointResponse;
import maveit.corhuila.MaveitMap.security.AuthDetails;
import maveit.corhuila.MaveitMap.security.AuthGuard;
import maveit.corhuila.MaveitMap.services.WaypointService;
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

@RestController
@RequestMapping("/api")
@Validated
public class WaypointController {

    private final WaypointService waypointService;
    private final AuthGuard authGuard;

    public WaypointController(WaypointService waypointService,
            AuthGuard authGuard) {
        this.waypointService = waypointService;
        this.authGuard = authGuard;
    }

    @GetMapping("/waypoints")
    public List<WaypointResponse> list(@RequestParam(value = "search", required = false) String search) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotSuperAdmin(auth);
        return waypointService.listWaypoints(search);
    }

    @GetMapping("/waypoints/{id}")
    public WaypointResponse get(@PathVariable Long id) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotSuperAdmin(auth);
        return waypointService.getWaypoint(id);
    }

    @PostMapping("/waypoints")
    @ResponseStatus(HttpStatus.CREATED)
    public WaypointResponse create(@Valid @RequestBody WaypointRequest request) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotSuperAdmin(auth);
        authGuard.ensureNotViewer(auth);
        return waypointService.createWaypoint(request);
    }

    @PutMapping("/waypoints/{id}")
    public WaypointResponse update(@PathVariable Long id, @Valid @RequestBody WaypointRequest request) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotSuperAdmin(auth);
        authGuard.ensureNotViewer(auth);
        return waypointService.updateWaypoint(id, request);
    }

    @DeleteMapping("/waypoints/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotSuperAdmin(auth);
        authGuard.ensureNotViewer(auth);
        waypointService.deleteWaypoint(id);
    }
}
