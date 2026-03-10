package maveit.corhuila.MaveitMap.services;

import maveit.corhuila.MaveitMap.dto.AuthResponse;
import maveit.corhuila.MaveitMap.dto.LoginRequest;

public interface AuthenticationService {
    AuthResponse login(LoginRequest request);
}
