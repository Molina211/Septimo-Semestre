package maveit.corhuila.MaveitMap.services;

import java.util.List;
import maveit.corhuila.MaveitMap.dto.CatalogProductRequest;
import maveit.corhuila.MaveitMap.dto.CatalogProductResponse;

public interface CatalogProductService {

    List<CatalogProductResponse> listProducts(String search);

    CatalogProductResponse getProduct(Long id);

    CatalogProductResponse createProduct(CatalogProductRequest request);

    CatalogProductResponse updateProduct(Long id, CatalogProductRequest request);

    void deleteProduct(Long id, boolean force);
}
