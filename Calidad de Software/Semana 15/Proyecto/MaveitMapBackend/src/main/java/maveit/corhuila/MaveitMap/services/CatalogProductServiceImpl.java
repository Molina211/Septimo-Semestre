package maveit.corhuila.MaveitMap.services;

import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import maveit.corhuila.MaveitMap.repositories.SalesGroupProductRepository;
import maveit.corhuila.MaveitMap.repositories.SalesGroupRepository;
import maveit.corhuila.MaveitMap.repositories.WaypointRepository;
import maveit.corhuila.MaveitMap.dto.CatalogProductRequest;
import maveit.corhuila.MaveitMap.dto.CatalogProductResponse;
import maveit.corhuila.MaveitMap.models.CatalogProduct;
import maveit.corhuila.MaveitMap.models.SalesGroup;
import maveit.corhuila.MaveitMap.models.SalesGroupProduct;
import maveit.corhuila.MaveitMap.models.Waypoint;
import maveit.corhuila.MaveitMap.repositories.CatalogProductRepository;
import maveit.corhuila.MaveitMap.security.AuthContext;
import maveit.corhuila.MaveitMap.security.AuthDetails;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CatalogProductServiceImpl implements CatalogProductService {
    private final CatalogProductRepository repository;
    private final SalesGroupRepository salesGroupRepository;
    private final SalesGroupProductRepository salesGroupProductRepository;
    private final WaypointRepository waypointRepository;
    private final TenantService tenantService;

    public CatalogProductServiceImpl(CatalogProductRepository repository,
            SalesGroupRepository salesGroupRepository,
            SalesGroupProductRepository salesGroupProductRepository,
            WaypointRepository waypointRepository,
            TenantService tenantService) {
        this.repository = repository;
        this.salesGroupRepository = salesGroupRepository;
        this.salesGroupProductRepository = salesGroupProductRepository;
        this.waypointRepository = waypointRepository;
        this.tenantService = tenantService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CatalogProductResponse> listProducts(String search) {
        List<CatalogProduct> products = repository.findAll(Sort.by(Sort.Direction.ASC, "name"));
        if (StringUtils.hasText(search)) {
            products = repository.findByNameContainingIgnoreCase(search.trim()).stream()
                    .sorted(Comparator.comparing(CatalogProduct::getName))
                    .collect(Collectors.toList());
        }
        Optional<Long> ownerId = tenantService.getCurrentOwnerId();
        if (ownerId.isPresent()) {
            products = products.stream()
                    .filter(product -> ownerId.get().equals(product.getOwnerId()))
                    .collect(Collectors.toList());
        }
        return products.stream().map(CatalogProductServiceImpl::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CatalogProductResponse getProduct(Long id) {
        Optional<Long> ownerId = tenantService.getCurrentOwnerId();
        CatalogProduct product = ownerId
                .map(owner -> repository.findByIdAndOwnerId(id, owner))
                .orElseGet(() -> repository.findById(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        return toResponse(product);
    }

    @Override
    @Transactional
    public CatalogProductResponse createProduct(CatalogProductRequest request) {
        String normalizedName = buildNormalizedName(request.getName());
        ensureUniqueName(normalizedName, null);
        CatalogProduct product = new CatalogProduct();
        product.setName(request.getName().trim());
        product.setNormalizedName(normalizedName);
        product.setBasePrice(request.getBasePrice());
        product.setActive(true);
        Long ownerId = currentUserId();
        if (ownerId != null) {
            product.setOwnerId(ownerId);
        }
        CatalogProduct saved = repository.save(product);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public CatalogProductResponse updateProduct(Long id, CatalogProductRequest request) {
        Optional<Long> ownerId = tenantService.getCurrentOwnerId();
        CatalogProduct product = ownerId
                .map(owner -> repository.findByIdAndOwnerId(id, owner))
                .orElseGet(() -> repository.findById(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        String normalizedName = buildNormalizedName(request.getName());
        ensureUniqueName(normalizedName, id);
        product.setName(request.getName().trim());
        product.setNormalizedName(normalizedName);
        product.setBasePrice(request.getBasePrice());
        product.setActive(true);
        return toResponse(repository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Long id, boolean force) {
        Optional<Long> ownerId = tenantService.getCurrentOwnerId();
        CatalogProduct product = ownerId
                .map(owner -> repository.findByIdAndOwnerId(id, owner))
                .orElseGet(() -> repository.findById(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        Sort sort = Sort.by(Sort.Direction.DESC, "salesGroup.saleDateTime");
        List<SalesGroupProduct> associations = salesGroupProductRepository
                .findAllByProduct_IdAndActiveTrue(id, sort);
        Set<Long> removedGroups = new java.util.HashSet<>();
        for (SalesGroupProduct association : associations) {
            association.setActive(false);
            salesGroupProductRepository.save(association);
            SalesGroup linkedGroup = association.getSalesGroup();
            if (linkedGroup == null || removedGroups.contains(linkedGroup.getId())) {
                continue;
            }
            long remainingProducts = salesGroupProductRepository.countBySalesGroup_IdAndActiveTrue(linkedGroup.getId());
            if (remainingProducts == 0) {
                removedGroups.add(linkedGroup.getId());
                Waypoint waypoint = linkedGroup.getWaypoint();
                salesGroupRepository.delete(linkedGroup);
                if (waypoint != null && salesGroupRepository.countByWaypoint_Id(waypoint.getId()) == 0) {
                    waypointRepository.deleteById(waypoint.getId());
                }
            }
        }
        if (force) {
            repository.delete(product);
            return;
        }
        product.setActive(false);
        repository.save(product);
    }

    static CatalogProductResponse toResponse(CatalogProduct product) {
        CatalogProductResponse response = new CatalogProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setBasePrice(product.getBasePrice());
        response.setQuantity(product.getQuantity());
        response.setActive(product.isActive());
        response.setCreatedAt(product.getCreatedAt());
        return response;
    }

    private void ensureUniqueName(String normalizedName, Long currentId) {
        Optional<CatalogProduct> existing = repository.findByNormalizedName(normalizedName);
        if (existing.isPresent() && (currentId == null || !existing.get().getId().equals(currentId))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un producto con ese nombre");
        }
    }

    private String buildNormalizedName(String rawName) {
        if (!StringUtils.hasText(rawName)) {
            return "";
        }
        String trimmed = rawName.trim();
        String normalized = Normalizer.normalize(trimmed, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT);
    }

    private Long currentUserId() {
        AuthDetails auth = AuthContext.get();
        return auth == null ? null : auth.getUserId();
    }

}
