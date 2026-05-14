package maveit.corhuila.MaveitMap.dto;

import java.time.OffsetDateTime;
import java.util.List;

public class SalesGroupResponse {

    private Long id;
    private OffsetDateTime saleDateTime;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private List<SalesGroupProductResponse> products;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OffsetDateTime getSaleDateTime() {
        return saleDateTime;
    }

    public void setSaleDateTime(OffsetDateTime saleDateTime) {
        this.saleDateTime = saleDateTime;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<SalesGroupProductResponse> getProducts() {
        return products;
    }

    public void setProducts(List<SalesGroupProductResponse> products) {
        this.products = products;
    }
}
