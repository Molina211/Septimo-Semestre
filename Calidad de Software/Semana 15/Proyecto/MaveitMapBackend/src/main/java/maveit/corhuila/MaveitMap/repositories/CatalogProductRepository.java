package maveit.corhuila.MaveitMap.repositories;

import maveit.corhuila.MaveitMap.models.CatalogProduct;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogProductRepository extends JpaRepository<CatalogProduct, Long> {

    List<CatalogProduct> findByNameContainingIgnoreCase(String text);

    Optional<CatalogProduct> findByNormalizedName(String normalizedName);

    List<CatalogProduct> findAllByActiveTrue(Sort sort);

    Optional<CatalogProduct> findByIdAndActiveTrue(Long id);

    Optional<CatalogProduct> findByIdAndOwnerId(Long id, Long ownerId);

    List<CatalogProduct> findAllByOwnerId(Long ownerId);

    void deleteByOwnerId(Long ownerId);
}
