package maveit.corhuila.MaveitMap.services;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import maveit.corhuila.MaveitMap.dto.SalesGroupProductRequest;
import maveit.corhuila.MaveitMap.dto.SalesGroupResponse;
import maveit.corhuila.MaveitMap.dto.WaypointRequest;
import maveit.corhuila.MaveitMap.dto.WaypointResponse;
import maveit.corhuila.MaveitMap.dto.WaypointSalesGroupRequest;
import maveit.corhuila.MaveitMap.models.CatalogProduct;
import maveit.corhuila.MaveitMap.models.SalesGroup;
import maveit.corhuila.MaveitMap.models.SalesGroupProduct;
import maveit.corhuila.MaveitMap.models.Waypoint;
import maveit.corhuila.MaveitMap.repositories.WaypointRepository;
import maveit.corhuila.MaveitMap.repositories.CatalogProductRepository;
import maveit.corhuila.MaveitMap.security.AuthContext;
import maveit.corhuila.MaveitMap.security.AuthDetails;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class WaypointServiceImpl implements WaypointService {

    private final WaypointRepository waypointRepository;
    private final CatalogProductRepository catalogProductRepository;
    private final TenantService tenantService;

    public WaypointServiceImpl(WaypointRepository waypointRepository,
            CatalogProductRepository catalogProductRepository,
            TenantService tenantService) {
        this.waypointRepository = waypointRepository;
        this.catalogProductRepository = catalogProductRepository;
        this.tenantService = tenantService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<WaypointResponse> listWaypoints(String search) {
        Sort sort = Sort.by(Sort.Direction.DESC, "visitDateTime");
        Optional<Long> ownerId = tenantService.getCurrentOwnerId();
        List<Waypoint> waypoints;
        if (ownerId.isPresent()) {
            waypoints = (search == null || search.isBlank())
                    ? waypointRepository.findAllByOwnerId(ownerId.get(), sort)
                    : waypointRepository.searchByNameOrLabelAndOwnerId(search, ownerId.get());
        } else {
            waypoints = (search == null || search.isBlank())
                    ? waypointRepository.findAll(sort)
                    : waypointRepository.searchByNameOrLabel(search);
        }
        return waypoints.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WaypointResponse getWaypoint(Long id) {
        return toResponse(fetchWaypoint(id));
    }

    @Override
    @Transactional
    public WaypointResponse createWaypoint(WaypointRequest request) {
        Waypoint waypoint = new Waypoint();
        waypoint.setName(request.getName().trim());
        waypoint.setLabel(request.getLabel().trim());
        waypoint.setLng(request.getLng());
        waypoint.setLat(request.getLat());
        waypoint.setVisitDateTime(request.getVisitDateTime());
        Long ownerId = currentUserId();
        if (ownerId != null) {
            waypoint.setOwnerId(ownerId);
        }
        if (request.getSalesGroups() != null) {
            request.getSalesGroups().forEach(payload -> {
                SalesGroup group = buildSalesGroup(payload);
                if (ownerId != null) {
                    group.setOwnerId(ownerId);
                }
                waypoint.addSalesGroup(group);
            });
        }
        return toResponse(waypointRepository.save(waypoint));
    }

    @Override
    @Transactional
    public WaypointResponse updateWaypoint(Long id, WaypointRequest request) {
        Waypoint waypoint = fetchWaypoint(id);
        waypoint.setName(request.getName().trim());
        waypoint.setLabel(request.getLabel().trim());
        waypoint.setLng(request.getLng());
        waypoint.setLat(request.getLat());
        waypoint.setVisitDateTime(request.getVisitDateTime());
        return toResponse(waypointRepository.save(waypoint));
    }

    @Override
    @Transactional
    public void deleteWaypoint(Long id) {
        Waypoint waypoint = fetchWaypoint(id);
        waypointRepository.delete(waypoint);
    }

    private SalesGroup buildSalesGroup(WaypointSalesGroupRequest payload) {
        SalesGroup group = new SalesGroup();
        group.setSaleDateTime(payload.getSaleDateTime());
        payload.getProducts().forEach(product -> group.addProduct(buildSalesGroupProduct(product)));
        ensurePrimaryProductSet(group);
        updateGroupQuantity(group);
        return group;
    }

    private SalesGroupProduct buildSalesGroupProduct(SalesGroupProductRequest payload) {
        CatalogProduct catalogProduct = fetchProduct(payload.getProduct().getId());
        catalogProduct.setQuantity(payload.getQuantity());
        SalesGroupProduct product = new SalesGroupProduct();
        product.setProduct(catalogProduct);
        product.setQuantity(payload.getQuantity());
        product.setUnitPrice(payload.getUnitPrice());
        product.setActive(true);
        return product;
    }

    private Long currentUserId() {
        AuthDetails auth = AuthContext.get();
        return auth == null ? null : auth.getUserId();
    }

    private void updateGroupQuantity(SalesGroup group) {
        int total = group.getProducts().stream()
                .filter(SalesGroupProduct::isActive)
                .mapToInt(SalesGroupProduct::getQuantity)
                .sum();
        group.setQuantity(total);
    }

    private CatalogProduct fetchProduct(Long productId) {
        return catalogProductRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto no existe"));
    }

    private WaypointResponse toResponse(Waypoint waypoint) {
        WaypointResponse response = new WaypointResponse();
        response.setId(waypoint.getId());
        response.setName(waypoint.getName());
        response.setLabel(waypoint.getLabel());
        response.setLng(waypoint.getLng());
        response.setLat(waypoint.getLat());
        response.setVisitDateTime(waypoint.getVisitDateTime());
        response.setCreatedAt(waypoint.getCreatedAt());
        response.setUpdatedAt(waypoint.getUpdatedAt());
        List<SalesGroupResponse> groups = waypoint.getSalesGroups().stream()
                .sorted(Comparator.comparing(SalesGroup::getSaleDateTime))
                .map(this::mapSalesGroup)
                .collect(Collectors.toList());
        response.setSalesGroups(groups);
        return response;
    }

    private Waypoint fetchWaypoint(Long id) {
        Optional<Long> ownerId = tenantService.getCurrentOwnerId();
        return ownerId
                .map((owner) -> waypointRepository.findByIdAndOwnerId(id, owner))
                .orElseGet(() -> waypointRepository.findById(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Punto de venta no encontrado"));
    }

    private SalesGroupResponse mapSalesGroup(SalesGroup group) {
        ensurePrimaryProductSet(group);
        return SalesGroupMapper.toResponse(group, catalogProductRepository);
    }

    private void ensurePrimaryProductSet(SalesGroup group) {
        if (group.getProduct() == null && !group.getProducts().isEmpty()) {
            for (SalesGroupProduct product : group.getProducts()) {
                if (product.isActive() && product.getProduct() != null) {
                    group.setProduct(product.getProduct());
                    BigDecimal basePrice = product.getProduct().getBasePrice();
                    group.setUnitPrice(basePrice == null ? BigDecimal.ZERO : basePrice);
                    break;
                }
            }
        }
        if (group.getProduct() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El grupo necesita al menos un producto activo");
        }
    }
}
