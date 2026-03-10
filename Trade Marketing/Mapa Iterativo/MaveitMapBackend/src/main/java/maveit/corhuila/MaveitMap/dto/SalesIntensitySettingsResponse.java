package maveit.corhuila.MaveitMap.dto;

public class SalesIntensitySettingsResponse {

    private Long veryLowMax;
    private Long lowMax;
    private Long mediumMax;
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
