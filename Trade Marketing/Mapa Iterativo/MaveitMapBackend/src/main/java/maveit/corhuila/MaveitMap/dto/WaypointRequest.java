package maveit.corhuila.MaveitMap.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.List;

public class WaypointRequest {

    @NotBlank(message = "El nombre del punto es obligatorio")
    private String name;

    @NotBlank(message = "La etiqueta es obligatoria")
    private String label;

    @NotNull(message = "La longitud es obligatoria")
    private Double lng;

    @NotNull(message = "La latitud es obligatoria")
    private Double lat;

    @NotNull(message = "La fecha y hora de visita es obligatoria")
    private OffsetDateTime visitDateTime;

    @Valid
    private List<WaypointSalesGroupRequest> salesGroups;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public OffsetDateTime getVisitDateTime() {
        return visitDateTime;
    }

    public void setVisitDateTime(OffsetDateTime visitDateTime) {
        this.visitDateTime = visitDateTime;
    }

    public List<WaypointSalesGroupRequest> getSalesGroups() {
        return salesGroups;
    }

    public void setSalesGroups(List<WaypointSalesGroupRequest> salesGroups) {
        this.salesGroups = salesGroups;
    }
}
