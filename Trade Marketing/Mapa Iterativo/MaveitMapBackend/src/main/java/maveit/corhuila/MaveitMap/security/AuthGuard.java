package maveit.corhuila.MaveitMap.security;

import maveit.corhuila.MaveitMap.models.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AuthGuard {

    public AuthDetails requireAuth() {
        AuthDetails auth = AuthContext.get();
        if (auth == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Debes iniciar sesión");
        }
        return auth;
    }

    public void ensureNotViewer(AuthDetails auth) {
        if (auth.getRole() == UserRole.VIEWER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No autorizado");
        }
    }
}
