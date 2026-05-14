package maveit.corhuila.MaveitMap.services;

import java.time.OffsetDateTime;
import java.util.List;
import maveit.corhuila.MaveitMap.models.AuditLog;

public interface AuditLogService {

    void log(String action, Long actorUserId, String actorEmail, Long targetUserId, String targetEmail, String metadata);

    List<AuditLog> search(String action, Long userId, OffsetDateTime from, OffsetDateTime to, int limit);
}

