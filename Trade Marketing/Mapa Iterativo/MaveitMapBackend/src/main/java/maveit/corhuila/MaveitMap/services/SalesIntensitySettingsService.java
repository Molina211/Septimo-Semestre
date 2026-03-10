package maveit.corhuila.MaveitMap.services;

import java.util.Optional;
import maveit.corhuila.MaveitMap.dto.SalesIntensitySettingsRequest;
import maveit.corhuila.MaveitMap.dto.SalesIntensitySettingsResponse;
import maveit.corhuila.MaveitMap.models.SalesIntensitySettings;
import maveit.corhuila.MaveitMap.repositories.SalesIntensitySettingsRepository;
import maveit.corhuila.MaveitMap.security.AuthContext;
import maveit.corhuila.MaveitMap.security.AuthDetails;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SalesIntensitySettingsService {

    private static final long DEFAULT_VERY_LOW_MAX = 1000L;
    private static final long DEFAULT_LOW_MAX = 5000L;
    private static final long DEFAULT_MEDIUM_MAX = 15000L;
    private static final long DEFAULT_HIGH_MAX = 30000L;

    private final SalesIntensitySettingsRepository repository;
    private final TenantService tenantService;

    public SalesIntensitySettingsService(
            SalesIntensitySettingsRepository repository,
            TenantService tenantService
    ) {
        this.repository = repository;
        this.tenantService = tenantService;
    }

    public SalesIntensitySettingsResponse getCurrentSettings() {
        Long ownerId = resolveOwnerId();
        SalesIntensitySettings settings = repository.findByOwnerId(ownerId)
                .orElseGet(() -> createDefault(ownerId));
        return toResponse(settings);
    }

    public SalesIntensitySettingsResponse updateCurrentSettings(SalesIntensitySettingsRequest request) {
        validateThresholds(request);
        Long ownerId = resolveOwnerId();
        SalesIntensitySettings settings = repository.findByOwnerId(ownerId)
                .orElseGet(() -> {
                    SalesIntensitySettings fresh = new SalesIntensitySettings();
                    fresh.setOwnerId(ownerId);
                    return fresh;
                });
        settings.setVeryLowMax(request.getVeryLowMax());
        settings.setLowMax(request.getLowMax());
        settings.setMediumMax(request.getMediumMax());
        settings.setHighMax(request.getHighMax());
        SalesIntensitySettings saved = repository.save(settings);
        return toResponse(saved);
    }

    private SalesIntensitySettings createDefault(Long ownerId) {
        SalesIntensitySettings settings = new SalesIntensitySettings();
        settings.setOwnerId(ownerId);
        settings.setVeryLowMax(DEFAULT_VERY_LOW_MAX);
        settings.setLowMax(DEFAULT_LOW_MAX);
        settings.setMediumMax(DEFAULT_MEDIUM_MAX);
        settings.setHighMax(DEFAULT_HIGH_MAX);
        return repository.save(settings);
    }

    private Long resolveOwnerId() {
        Optional<Long> ownerId = tenantService.getCurrentOwnerId();
        if (ownerId.isPresent()) {
            return ownerId.get();
        }
        AuthDetails auth = AuthContext.get();
        if (auth == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token requerido");
        }
        return auth.getUserId();
    }

    private void validateThresholds(SalesIntensitySettingsRequest request) {
        long veryLowMax = requireValue(request.getVeryLowMax(), "veryLowMax");
        long lowMax = requireValue(request.getLowMax(), "lowMax");
        long mediumMax = requireValue(request.getMediumMax(), "mediumMax");
        long highMax = requireValue(request.getHighMax(), "highMax");
        if (!(veryLowMax < lowMax && lowMax < mediumMax && mediumMax < highMax)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Los rangos deben estar en orden ascendente");
        }
    }

    private long requireValue(Long value, String field) {
        if (value == null || value <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valor inválido para " + field);
        }
        return value;
    }

    private SalesIntensitySettingsResponse toResponse(SalesIntensitySettings settings) {
        SalesIntensitySettingsResponse response = new SalesIntensitySettingsResponse();
        response.setVeryLowMax(settings.getVeryLowMax());
        response.setLowMax(settings.getLowMax());
        response.setMediumMax(settings.getMediumMax());
        response.setHighMax(settings.getHighMax());
        return response;
    }
}
