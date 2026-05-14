package maveit.corhuila.MaveitMap.services;

import java.util.Comparator;
import java.util.stream.Collectors;
import maveit.corhuila.MaveitMap.dto.SalesGroupProductResponse;
import maveit.corhuila.MaveitMap.dto.SalesGroupResponse;
import maveit.corhuila.MaveitMap.models.SalesGroup;
import maveit.corhuila.MaveitMap.models.SalesGroupProduct;
import maveit.corhuila.MaveitMap.repositories.CatalogProductRepository;

final class SalesGroupMapper {

    private SalesGroupMapper() {
    }

    static SalesGroupResponse toResponse(SalesGroup group, CatalogProductRepository catalogProductRepository) {
        SalesGroupResponse response = new SalesGroupResponse();
        response.setId(group.getId());
        response.setSaleDateTime(group.getSaleDateTime());
        response.setCreatedAt(group.getCreatedAt());
        response.setUpdatedAt(group.getUpdatedAt());
        response.setProducts(group.getProducts().stream()
                .filter(SalesGroupProduct::isActive)
                .sorted(Comparator.comparing(SalesGroupProduct::getCreatedAt))
                .map(product -> toProductResponse(product, catalogProductRepository))
                .collect(Collectors.toList()));
        return response;
    }

    private static SalesGroupProductResponse toProductResponse(SalesGroupProduct product,
            CatalogProductRepository catalogProductRepository) {
        SalesGroupProductResponse response = new SalesGroupProductResponse();
        response.setActive(product.isActive());
        response.setQuantity(product.getQuantity());
        response.setUnitPrice(product.getUnitPrice());
        response.setProduct(CatalogProductServiceImpl.toResponse(product.getProduct()));
        return response;
    }
}
