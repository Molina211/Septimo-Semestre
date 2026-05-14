package maveit.corhuila.MaveitMap.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "waypoints")
public class Waypoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private Double lng;

    @Column(nullable = false)
    private Double lat;

    @Column(name = "visit_date_time", nullable = false)
    private OffsetDateTime visitDateTime;

    @Column(name = "owner_id")
    private Long ownerId;

    @OneToMany(mappedBy = "waypoint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SalesGroup> salesGroups = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
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

    public List<SalesGroup> getSalesGroups() {
        return salesGroups;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public void setSalesGroups(List<SalesGroup> salesGroups) {
        this.salesGroups = salesGroups;
    }

    public void addSalesGroup(SalesGroup group) {
        salesGroups.add(group);
        group.setWaypoint(this);
    }

    public void removeSalesGroup(SalesGroup group) {
        salesGroups.remove(group);
        group.setWaypoint(null);
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

    @PrePersist
    public void prePersist() {
        OffsetDateTime now = OffsetDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Waypoint waypoint = (Waypoint) o;
        return Objects.equals(id, waypoint.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
