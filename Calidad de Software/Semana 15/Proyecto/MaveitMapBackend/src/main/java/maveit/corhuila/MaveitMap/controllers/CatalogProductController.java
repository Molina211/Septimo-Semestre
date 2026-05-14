package maveit.corhuila.MaveitMap.controllers;

import jakarta.validation.Valid;
import java.util.List;
import maveit.corhuila.MaveitMap.dto.CatalogProductRequest;
import maveit.corhuila.MaveitMap.dto.CatalogProductResponse;
import maveit.corhuila.MaveitMap.security.AuthDetails;
import maveit.corhuila.MaveitMap.security.AuthGuard;
import maveit.corhuila.MaveitMap.services.CatalogProductService;
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
public class CatalogProductController {

    private final CatalogProductService catalogProductService;
    private final AuthGuard authGuard;

    public CatalogProductController(CatalogProductService catalogProductService,
            AuthGuard authGuard) {
        this.catalogProductService = catalogProductService;
        this.authGuard = authGuard;
    }

    @GetMapping("/catalog/products")
    public List<CatalogProductResponse> list(@RequestParam(value = "search", required = false) String search) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotSuperAdmin(auth);
        return catalogProductService.listProducts(search);
    }

    @GetMapping("/catalog/products/{id}")
    public CatalogProductResponse get(@PathVariable Long id) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotSuperAdmin(auth);
        return catalogProductService.getProduct(id);
    }

    @PostMapping("/catalog/products")
    @ResponseStatus(HttpStatus.CREATED)
    public CatalogProductResponse create(@Valid @RequestBody CatalogProductRequest request) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotSuperAdmin(auth);
        authGuard.ensureNotViewer(auth);
        return catalogProductService.createProduct(request);
    }

    @PutMapping("/catalog/products/{id}")
    public CatalogProductResponse update(@PathVariable Long id, @Valid @RequestBody CatalogProductRequest request) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotSuperAdmin(auth);
        authGuard.ensureNotViewer(auth);
        return catalogProductService.updateProduct(id, request);
    }

    @DeleteMapping("/catalog/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id,
            @RequestParam(value = "force", defaultValue = "false") boolean force) {
        AuthDetails auth = authGuard.requireAuth();
        authGuard.ensureNotSuperAdmin(auth);
        authGuard.ensureNotViewer(auth);
        catalogProductService.deleteProduct(id, force);
    }
}
