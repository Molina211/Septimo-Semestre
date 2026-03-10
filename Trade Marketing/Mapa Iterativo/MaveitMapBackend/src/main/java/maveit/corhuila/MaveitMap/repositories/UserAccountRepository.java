package maveit.corhuila.MaveitMap.repositories;

import java.util.List;
import java.util.Optional;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.models.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByEmailIgnoreCase(String email);
    List<UserAccount> findByOwner_Id(Long ownerId);
    List<UserAccount> findByRole(UserRole role);
    long countByOwner(UserAccount owner);
}
