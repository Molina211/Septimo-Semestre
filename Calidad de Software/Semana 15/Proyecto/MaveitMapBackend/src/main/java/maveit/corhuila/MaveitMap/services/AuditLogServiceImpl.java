package maveit.corhuila.MaveitMap.services;

import java.time.OffsetDateTime;
import java.util.List;
import maveit.corhuila.MaveitMap.models.AuditLog;
import maveit.corhuila.MaveitMap.repositories.AuditLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository repository;

    public AuditLogServiceImpl(AuditLogRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public void log(String action, Long actorUserId, String actorEmail, Long targetUserId, String targetEmail,
            String metadata) {
        AuditLog log = new AuditLog();
        log.setCreatedAt(OffsetDateTime.now());
        log.setAction(action);
        log.setActorUserId(actorUserId);
        log.setActorEmail(actorEmail);
        log.setTargetUserId(targetUserId);
        log.setTargetEmail(targetEmail);
        log.setMetadata(metadata);
        repository.save(log);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> search(String action, Long userId, OffsetDateTime from, OffsetDateTime to, int limit) {
        int safeLimit = Math.max(1, Math.min(500, limit));
        return repository.search(action, userId, from, to, PageRequest.of(0, safeLimit));
    }
}

