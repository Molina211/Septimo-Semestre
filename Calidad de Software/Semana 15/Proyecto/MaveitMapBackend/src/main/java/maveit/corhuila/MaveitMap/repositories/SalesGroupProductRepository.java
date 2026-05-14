package maveit.corhuila.MaveitMap.repositories;

import java.util.List;
import maveit.corhuila.MaveitMap.models.SalesGroupProduct;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SalesGroupProductRepository extends JpaRepository<SalesGroupProduct, Long> {

    List<SalesGroupProduct> findAllByProduct_IdAndActiveTrue(Long productId, Sort sort);

    List<SalesGroupProduct> findAllBySalesGroup_IdAndActiveTrue(Long salesGroupId);

    long countBySalesGroup_IdAndActiveTrue(Long salesGroupId);

    List<SalesGroupProduct> findAllByProduct_Id(Long productId);

    List<SalesGroupProduct> findAllBySalesGroup_Id(Long salesGroupId);

    void deleteAllBySalesGroup_Id(Long salesGroupId);

    @Modifying
    @Query("DELETE FROM SalesGroupProduct sgp WHERE sgp.salesGroup.ownerId = :ownerId")
    void deleteByOwnerId(@Param("ownerId") Long ownerId);
}
