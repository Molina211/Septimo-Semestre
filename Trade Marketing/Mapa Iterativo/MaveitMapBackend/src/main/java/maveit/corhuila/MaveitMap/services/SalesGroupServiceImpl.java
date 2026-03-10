package maveit.corhuila.MaveitMap.services;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import maveit.corhuila.MaveitMap.dto.IdReference;
import maveit.corhuila.MaveitMap.dto.SalesGroupProductRequest;
import maveit.corhuila.MaveitMap.dto.SalesGroupRequest;
import maveit.corhuila.MaveitMap.dto.SalesGroupResponse;
import maveit.corhuila.MaveitMap.models.CatalogProduct;
import maveit.corhuila.MaveitMap.models.SalesGroup;
import maveit.corhuila.MaveitMap.models.SalesGroupProduct;
import maveit.corhuila.MaveitMap.models.Waypoint;
import maveit.corhuila.MaveitMap.repositories.CatalogProductRepository;
import maveit.corhuila.MaveitMap.repositories.SalesGroupProductRepository;
import maveit.corhuila.MaveitMap.repositories.SalesGroupRepository;
import maveit.corhuila.MaveitMap.repositories.WaypointRepository;
import maveit.corhuila.MaveitMap.security.AuthContext;
import maveit.corhuila.MaveitMap.security.AuthDetails;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SalesGroupServiceImpl implements SalesGroupService {

    private final SalesGroupRepository salesGroupRepository;
    private final SalesGroupProductRepository salesGroupProductRepository;
    private final CatalogProductRepository catalogProductRepository;
    private final WaypointRepository waypointRepository;
    private final TenantService tenantService;

    public SalesGroupServiceImpl(SalesGroupRepository salesGroupRepository,
            SalesGroupProductRepository salesGroupProductRepository,
            CatalogProductRepository catalogProductRepository,
            WaypointRepository waypointRepository,
            TenantService tenantService) {
        this.salesGroupRepository = salesGroupRepository;
        this.salesGroupProductRepository = salesGroupProductRepository;
        this.catalogProductRepository = catalogProductRepository;
        this.waypointRepository = waypointRepository;
        this.tenantService = tenantService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalesGroupResponse> listGroups(Long productId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "saleDateTime");
        List<SalesGroup> groups;
        if (productId == null) {
            groups = salesGroupRepository.findAll(sort);
        } else {
            Sort productSort = Sort.by(Sort.Direction.DESC, "salesGroup.saleDateTime");
            Map<Long, SalesGroup> coercedGroups = new LinkedHashMap<>();
            salesGroupProductRepository.findAllByProduct_IdAndActiveTrue(productId, productSort)
                    .forEach(product -> {
                        SalesGroup group = product.getSalesGroup();
                        if (group != null) {
                            coercedGroups.putIfAbsent(group.getId(), group);
                        }
                    });
            groups = coercedGroups.values().stream().collect(Collectors.toList());
        }
        return groups.stream()
                .filter(this::allowedForCurrentOwner)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SalesGroupResponse getGroup(Long id) {
        SalesGroup group = fetchGroup(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo no encontrado"));
        return toResponse(group);
    }

    @Override
    @Transactional
    public SalesGroupResponse createGroup(SalesGroupRequest request) {
        IdReference waypointRef = request.getWaypoint();
        if (waypointRef == null || waypointRef.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El identificador del punto es obligatorio");
        }
        Waypoint waypoint = fetchWaypoint(waypointRef.getId());
        SalesGroup group = new SalesGroup();
        group.setSaleDateTime(request.getSaleDateTime());
        group.setWaypoint(waypoint);
        Long ownerId = currentUserId();
        if (ownerId != null) {
            group.setOwnerId(ownerId);
        }
        syncProducts(group, request.getProducts());
        updateGroupQuantity(group);
        assignPrimaryProduct(group);
        SalesGroup saved = salesGroupRepository.save(group);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public SalesGroupResponse updateGroup(Long id, SalesGroupRequest request) {
        SalesGroup existing = fetchGroup(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo no encontrado"));
        existing.setSaleDateTime(request.getSaleDateTime());
        if (request.getWaypoint() != null && request.getWaypoint().getId() != null) {
            existing.setWaypoint(fetchWaypoint(request.getWaypoint().getId()));
        }
        syncProducts(existing, request.getProducts());
        updateGroupQuantity(existing);
        assignPrimaryProduct(existing);
        return toResponse(salesGroupRepository.save(existing));
    }

    @Override
    @Transactional
    public void deleteGroup(Long id) {
        SalesGroup group = fetchGroup(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo no encontrado"));
        Waypoint waypoint = group.getWaypoint();
        salesGroupRepository.delete(group);
        if (waypoint != null && salesGroupRepository.countByWaypoint_Id(waypoint.getId()) == 0) {
            waypointRepository.deleteById(waypoint.getId());
        }
    }

    private void syncProducts(SalesGroup group, List<SalesGroupProductRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El grupo necesita al menos un producto");
        }
        Map<Long, SalesGroupProduct> existingMap = new HashMap<>();
        for (SalesGroupProduct product : group.getProducts()) {
            if (product.getProduct() != null) {
                existingMap.put(product.getProduct().getId(), product);
            }
        }

        for (SalesGroupProductRequest payload : requests) {
            Long productId = payload.getProduct().getId();
            Boolean requestedActive = payload.getActive();
            boolean shouldBeActive = requestedActive == null || requestedActive;
            CatalogProduct catalogProduct = fetchProduct(productId);
            catalogProduct.setQuantity(payload.getQuantity());
            SalesGroupProduct entry = existingMap.get(productId);
            Integer quantity = payload.getQuantity();
            BigDecimal price = payload.getUnitPrice();
            boolean zeroQuantity = quantity == null || quantity < 1;
            boolean invalidPrice = price == null || price.compareTo(BigDecimal.valueOf(0.01)) < 0;

            if (!shouldBeActive || zeroQuantity || invalidPrice) {
                if (entry != null) {
                    entry.setActive(false);
                }
                continue;
            }
            if (entry != null) {
                entry.setQuantity(payload.getQuantity());
                entry.setUnitPrice(payload.getUnitPrice());
                entry.setActive(true);
            } else {
                SalesGroupProduct product = new SalesGroupProduct();
                product.setProduct(catalogProduct);
                product.setQuantity(payload.getQuantity());
                product.setUnitPrice(payload.getUnitPrice());
                product.setActive(true);
                group.addProduct(product);
            }
        }
    }

    private void updateGroupQuantity(SalesGroup group) {
        int total = group.getProducts().stream()
                .filter(SalesGroupProduct::isActive)
                .mapToInt(SalesGroupProduct::getQuantity)
                .sum();
        group.setQuantity(total);
    }

    private void assignPrimaryProduct(SalesGroup group) {
        for (SalesGroupProduct product : group.getProducts()) {
            if (product.isActive() && product.getProduct() != null) {
                group.setProduct(product.getProduct());
                BigDecimal basePrice = product.getProduct().getBasePrice();
                group.setUnitPrice(basePrice == null ? BigDecimal.ZERO : basePrice);
                return;
            }
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El grupo necesita al menos un producto activo");
    }

    private Waypoint fetchWaypoint(Long waypointId) {
        return waypointRepository.findById(waypointId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El punto de venta no existe"));
    }

    private SalesGroupResponse toResponse(SalesGroup group) {
        return SalesGroupMapper.toResponse(group, catalogProductRepository);
    }

    private CatalogProduct fetchProduct(Long productId) {
        return catalogProductRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto no existe"));
    }

    private boolean allowedForCurrentOwner(SalesGroup group) {
        Optional<Long> ownerId = tenantService.getCurrentOwnerId();
        return ownerId.map(id -> id.equals(group.getOwnerId())).orElse(true);
    }

    private Optional<SalesGroup> fetchGroup(Long id) {
        Optional<Long> ownerId = tenantService.getCurrentOwnerId();
        return ownerId
                .map(owner -> salesGroupRepository.findByIdAndOwnerId(id, owner))
                .orElseGet(() -> salesGroupRepository.findById(id));
    }

    private Long currentUserId() {
        AuthDetails auth = AuthContext.get();
        return auth == null ? null : auth.getUserId();
    }
}
