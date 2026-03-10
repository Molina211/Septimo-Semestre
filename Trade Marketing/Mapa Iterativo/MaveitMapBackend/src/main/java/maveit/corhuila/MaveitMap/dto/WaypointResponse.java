package maveit.corhuila.MaveitMap.dto;

import java.time.OffsetDateTime;
import java.util.List;

public class WaypointResponse {

    private Long id;
    private String name;
    private String label;
    private Double lng;
    private Double lat;
    private OffsetDateTime visitDateTime;
    private List<SalesGroupResponse> salesGroups;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public List<SalesGroupResponse> getSalesGroups() {
        return salesGroups;
    }

    public void setSalesGroups(List<SalesGroupResponse> salesGroups) {
        this.salesGroups = salesGroups;
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
}
