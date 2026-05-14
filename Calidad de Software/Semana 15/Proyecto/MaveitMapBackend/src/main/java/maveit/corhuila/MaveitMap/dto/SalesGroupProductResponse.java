package maveit.corhuila.MaveitMap.dto;

import java.math.BigDecimal;

public class SalesGroupProductResponse {

    private CatalogProductResponse product;
    private Integer quantity;
    private BigDecimal unitPrice;
    private boolean active;

    public CatalogProductResponse getProduct() {
        return product;
    }

    public void setProduct(CatalogProductResponse product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
