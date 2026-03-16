package maveit.corhuila.MaveitMap.repositories;

import java.time.OffsetDateTime;
import java.util.List;
import maveit.corhuila.MaveitMap.models.AuditLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("""
            select l from AuditLog l
            where (:action is null or lower(l.action) = lower(:action))
              and (:userId is null or l.actorUserId = :userId or l.targetUserId = :userId)
              and (:fromTs is null or l.createdAt >= :fromTs)
              and (:toTs is null or l.createdAt <= :toTs)
            order by l.createdAt desc
            """)
    List<AuditLog> search(@Param("action") String action,
            @Param("userId") Long userId,
            @Param("fromTs") OffsetDateTime fromTs,
            @Param("toTs") OffsetDateTime toTs,
            Pageable pageable);
}

