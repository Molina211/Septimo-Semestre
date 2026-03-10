package maveit.corhuila.MaveitMap.controllers;

import jakarta.validation.Valid;
import java.util.List;
import maveit.corhuila.MaveitMap.dto.SalesGroupRequest;
import maveit.corhuila.MaveitMap.dto.SalesGroupResponse;
import maveit.corhuila.MaveitMap.security.AuthDetails;
import maveit.corhuila.MaveitMap.security.AuthGuard;
import maveit.corhuila.MaveitMap.services.SalesGroupService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "*")
public class SalesGroupController {

    private final SalesGroupService salesGroupService;
    private final AuthGuard authGuard;

    public SalesGroupController(SalesGroupService salesGroupService,
            AuthGuard authGuard) {
        this.salesGroupService = salesGroupService;
        this.authGuard = authGuard;
    }

    @GetMapping("/catalog/groups")
    public List<SalesGroupResponse> list(@RequestParam(value = "productId", required = false) Long productId) {
        authGuard.requireAuth();
        return salesGroupService.listGroups(productId);
    }

    @GetMapping("/catalog/groups/{id}")
    public SalesGroupResponse get(@PathVariable Long id) {
        authGuard.requireAuth();
        return salesGroupService.getGroup(id);
    }

    @PostMapping("/catalog/groups")
    @ResponseStatus(HttpStatus.CREATED)
    public SalesGroupResponse create(@Valid @RequestBody SalesGroupRequest request) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotViewer(auth);
        return salesGroupService.createGroup(request);
    }

    @PutMapping("/catalog/groups/{id}")
    public SalesGroupResponse update(@PathVariable Long id, @Valid @RequestBody SalesGroupRequest request) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotViewer(auth);
        return salesGroupService.updateGroup(id, request);
    }

    @DeleteMapping("/catalog/groups/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotViewer(auth);
        salesGroupService.deleteGroup(id);
    }
}
