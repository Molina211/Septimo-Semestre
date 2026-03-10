package maveit.corhuila.MaveitMap.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.Objects;

@Entity
@Table(name = "sales_intensity_settings")
public class SalesIntensitySettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_id", nullable = false, unique = true)
    private Long ownerId;

    @Column(name = "very_low_max", nullable = false)
    private Long veryLowMax;

    @Column(name = "low_max", nullable = false)
    private Long lowMax;

    @Column(name = "medium_max", nullable = false)
    private Long mediumMax;

    @Column(name = "high_max", nullable = false)
    private Long highMax;

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

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public Long getVeryLowMax() {
        return veryLowMax;
    }

    public void setVeryLowMax(Long veryLowMax) {
        this.veryLowMax = veryLowMax;
    }

    public Long getLowMax() {
        return lowMax;
    }

    public void setLowMax(Long lowMax) {
        this.lowMax = lowMax;
    }

    public Long getMediumMax() {
        return mediumMax;
    }

    public void setMediumMax(Long mediumMax) {
        this.mediumMax = mediumMax;
    }

    public Long getHighMax() {
        return highMax;
    }

    public void setHighMax(Long highMax) {
        this.highMax = highMax;
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
        SalesIntensitySettings that = (SalesIntensitySettings) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
