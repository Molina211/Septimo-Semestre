package maveit.corhuila.MaveitMap.services;

import java.time.OffsetDateTime;
import java.util.concurrent.ThreadLocalRandom;
import maveit.corhuila.MaveitMap.RegistrationProperties;
import maveit.corhuila.MaveitMap.models.EmailVerification;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.repositories.EmailVerificationRepository;
import maveit.corhuila.MaveitMap.repositories.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EmailVerificationServiceImpl implements EmailVerificationService {

    private static final String CODE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private final EmailVerificationRepository emailVerificationRepository;
    private final UserAccountRepository userAccountRepository;
    private final EmailService emailService;
    private final RegistrationProperties registrationProperties;
    private final AuditLogService auditLogService;

    public EmailVerificationServiceImpl(EmailVerificationRepository emailVerificationRepository,
            UserAccountRepository userAccountRepository,
            EmailService emailService,
            RegistrationProperties registrationProperties,
            AuditLogService auditLogService) {
        this.emailVerificationRepository = emailVerificationRepository;
        this.userAccountRepository = userAccountRepository;
        this.emailService = emailService;
        this.registrationProperties = registrationProperties;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional
    public void ensureActiveVerification(UserAccount account) {
        if (account == null || account.isVerified()) {
            return;
        }
        cleanupExpired();
        EmailVerification current = emailVerificationRepository.findByEmailIgnoreCase(account.getEmail()).orElse(null);
        OffsetDateTime now = OffsetDateTime.now();
        if (current != null) {
            // If an active code exists, do not resend automatically (avoid spamming on repeated login attempts).
            if (current.getExpiresAt() != null && current.getExpiresAt().isAfter(now)) {
                return;
            }
            emailVerificationRepository.delete(current);
        }
        EmailVerification verification = new EmailVerification();
        verification.setEmail(account.getEmail().trim().toLowerCase());
        verification.setUserId(account.getId());
        verification.setVerificationCode(generateCode(6));
        verification.setAttempts(0);
        verification.setCreatedAt(now);
        verification.setExpiresAt(now.plusMinutes(registrationProperties.getVerificationExpiryMinutes()));
        emailVerificationRepository.save(verification);
        emailService.sendVerificationCode(account.getEmail(), account.getName(), account.getCompanyName(),
                verification.getVerificationCode(), verification.getExpiresAt());
        auditLogService.log("EMAIL_VERIFY_SENT", account.getId(), account.getEmail(), account.getId(), account.getEmail(), null);
    }

    @Override
    @Transactional
    public void resend(String email) {
        String normalized = normalizeEmail(email);
        UserAccount account = userAccountRepository.findByEmailIgnoreCase(normalized)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El correo no existe"));
        if (account.isVerified()) {
            return;
        }
        EmailVerification verification = emailVerificationRepository.findByEmailIgnoreCase(normalized).orElse(null);
        OffsetDateTime now = OffsetDateTime.now();
        if (verification == null) {
            verification = new EmailVerification();
            verification.setEmail(normalized);
            verification.setUserId(account.getId());
            verification.setAttempts(0);
            verification.setCreatedAt(now);
        } else {
            if (verification.getAttempts() >= registrationProperties.getMaxVerificationAttempts()) {
                emailVerificationRepository.delete(verification);
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "Maximos intentos alcanzados. Inicia sesion nuevamente para recibir un codigo");
            }
        }
        verification.setVerificationCode(generateCode(6));
        verification.setExpiresAt(now.plusMinutes(registrationProperties.getVerificationExpiryMinutes()));
        EmailVerification saved = emailVerificationRepository.save(verification);
        emailService.sendVerificationCode(account.getEmail(), account.getName(), account.getCompanyName(),
                saved.getVerificationCode(), saved.getExpiresAt());
        auditLogService.log("EMAIL_VERIFY_RESEND", account.getId(), account.getEmail(), account.getId(), account.getEmail(), null);
    }

    @Override
    @Transactional
    public void confirm(String email, String code) {
        String normalized = normalizeEmail(email);
        UserAccount account = userAccountRepository.findByEmailIgnoreCase(normalized)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El correo no existe"));
        if (account.isVerified()) {
            return;
        }
        EmailVerification verification = emailVerificationRepository.findByEmailIgnoreCase(normalized)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay verificacion pendiente"));
        validateCodeOrThrow(verification, code);

        OffsetDateTime now = OffsetDateTime.now();
        account.setVerified(true);
        account.setVerifiedAt(now);
        account.setUpdatedAt(now);
        userAccountRepository.save(account);
        emailVerificationRepository.delete(verification);
        auditLogService.log("EMAIL_VERIFIED", account.getId(), account.getEmail(), account.getId(), account.getEmail(), null);
    }

    private void cleanupExpired() {
        emailVerificationRepository.deleteByExpiresAtBefore(OffsetDateTime.now());
    }

    private void validateCodeOrThrow(EmailVerification verification, String code) {
        OffsetDateTime now = OffsetDateTime.now();
        if (verification.getExpiresAt().isBefore(now)) {
            emailVerificationRepository.delete(verification);
            throw new ResponseStatusException(HttpStatus.GONE, "Codigo expirado");
        }
        if (verification.getAttempts() >= registrationProperties.getMaxVerificationAttempts()) {
            emailVerificationRepository.delete(verification);
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Maximos intentos alcanzados. Inicia sesion nuevamente para recibir un codigo");
        }
        if (code == null || code.isBlank() || !verification.getVerificationCode().equalsIgnoreCase(code.trim())) {
            verification.setAttempts(verification.getAttempts() + 1);
            emailVerificationRepository.save(verification);
            int attemptsLeft = registrationProperties.getMaxVerificationAttempts() - verification.getAttempts();
            if (attemptsLeft <= 0) {
                emailVerificationRepository.delete(verification);
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "Maximos intentos alcanzados. Inicia sesion nuevamente para recibir un codigo");
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Codigo invalido. Intentos restantes: " + attemptsLeft);
        }
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo es obligatorio");
        }
        return email.trim().toLowerCase();
    }

    private String generateCode(int length) {
        ThreadLocalRandom random = ThreadLocalRandom.current();
        StringBuilder builder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            builder.append(CODE_CHARSET.charAt(random.nextInt(CODE_CHARSET.length())));
        }
        return builder.toString();
    }
}

