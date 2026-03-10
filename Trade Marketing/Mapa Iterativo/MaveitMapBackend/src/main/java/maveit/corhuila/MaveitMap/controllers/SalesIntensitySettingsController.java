package maveit.corhuila.MaveitMap.controllers;

import jakarta.validation.Valid;
import maveit.corhuila.MaveitMap.dto.SalesIntensitySettingsRequest;
import maveit.corhuila.MaveitMap.dto.SalesIntensitySettingsResponse;
import maveit.corhuila.MaveitMap.services.SalesIntensitySettingsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings/intensity")
public class SalesIntensitySettingsController {

    private final SalesIntensitySettingsService service;

    public SalesIntensitySettingsController(SalesIntensitySettingsService service) {
        this.service = service;
    }

    @GetMapping
    public SalesIntensitySettingsResponse getSettings() {
        return service.getCurrentSettings();
    }

    @PutMapping
    public SalesIntensitySettingsResponse updateSettings(
            @Valid @RequestBody SalesIntensitySettingsRequest request
    ) {
        return service.updateCurrentSettings(request);
    }
}
