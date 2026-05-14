package maveit.corhuila.MaveitMap.services;

import java.util.Optional;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.models.UserRole;
import maveit.corhuila.MaveitMap.repositories.UserAccountRepository;
import maveit.corhuila.MaveitMap.security.AuthContext;
import maveit.corhuila.MaveitMap.security.AuthDetails;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TenantService {

    private final UserAccountRepository repository;

    public TenantService(UserAccountRepository repository) {
        this.repository = repository;
    }

    public Optional<Long> getCurrentOwnerId() {
        AuthDetails auth = AuthContext.get();
        if (auth == null) {
            return Optional.empty();
        }
        if (auth.getRole() == UserRole.SUPER_ADMIN) {
            return Optional.empty();
        }
        UserAccount account = repository.findById(auth.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (account.getRole() == UserRole.VIEWER) {
            UserAccount owner = account.getOwner();
            if (owner == null) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Viewer sin dueño");
            }
            return Optional.of(owner.getId());
        }
        return Optional.of(account.getId());
    }

    public boolean isSuperAdmin() {
        AuthDetails auth = AuthContext.get();
        return auth != null && auth.getRole() == UserRole.SUPER_ADMIN;
    }

}
