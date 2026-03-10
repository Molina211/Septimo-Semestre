package maveit.corhuila.MaveitMap.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SalesIntensitySettingsRequest {

    @NotNull
    @Min(1)
    private Long veryLowMax;

    @NotNull
    @Min(1)
    private Long lowMax;

    @NotNull
    @Min(1)
    private Long mediumMax;

    @NotNull
    @Min(1)
    private Long highMax;

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
}
