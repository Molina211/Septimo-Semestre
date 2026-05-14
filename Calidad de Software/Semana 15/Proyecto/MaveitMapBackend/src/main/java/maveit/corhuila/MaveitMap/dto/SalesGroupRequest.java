package maveit.corhuila.MaveitMap.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.List;

public class SalesGroupRequest {

    @Valid
    private IdReference waypoint;

    @NotNull(message = "La fecha y hora es obligatoria")
    private OffsetDateTime saleDateTime;

    @Valid
    @NotNull(message = "La lista de productos es obligatoria")
    @Size(min = 1, message = "Debe haber al menos un producto por grupo")
    private List<SalesGroupProductRequest> products;

    public IdReference getWaypoint() {
        return waypoint;
    }

    public void setWaypoint(IdReference waypoint) {
        this.waypoint = waypoint;
    }

    public OffsetDateTime getSaleDateTime() {
        return saleDateTime;
    }

    public void setSaleDateTime(OffsetDateTime saleDateTime) {
        this.saleDateTime = saleDateTime;
    }

    public List<SalesGroupProductRequest> getProducts() {
        return products;
    }

    public void setProducts(List<SalesGroupProductRequest> products) {
        this.products = products;
    }
}
