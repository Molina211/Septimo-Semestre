package maveit.corhuila.MaveitMap.dto;

import jakarta.validation.constraints.NotNull;

public class IdReference {

    @NotNull(message = "El identificador es obligatorio")
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
