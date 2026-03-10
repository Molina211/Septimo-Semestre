package maveit.corhuila.MaveitMap.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

import maveit.corhuila.MaveitMap.models.Invitation;
import maveit.corhuila.MaveitMap.models.UserAccount;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final DateTimeFormatter EXPIRY_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final JavaMailSender mailSender;
    private final String frontendUrl;

    public EmailServiceImpl(JavaMailSender mailSender, @Value("${app.frontend-url}") String frontendUrl) {
        this.mailSender = mailSender;
        this.frontendUrl = frontendUrl;
    }

    @Override
    public void sendWelcome(UserAccount user) {
        String subject = "Bienvenido a nuestra Web";
        String html = "<div style=\"font-family: 'Inter', 'Segoe UI', sans-serif; background:#0c0c0f; color:#f7f9fc; padding:24px; border-radius:24px; max-width:640px; margin:0 auto; box-shadow:0 0 24px rgba(0,0,0,0.45);\">"
                + "<div style=\"background:#f8f9ff; color:#0d1117; border-radius:16px; padding:24px; box-shadow:0 10px 30px rgba(0,0,0,0.25);\">"
                + "<h1 style=\"margin:0 0 12px; font-size:26px;\">Bienvenido, " + escape(user.getName()) + "</h1>"
                + "<p style=\"margin:0; font-size:16px; line-height:1.6; color:#0f1724;\">Gracias por unirte a nuestra Web "
                + "<strong>" + escape(user.getCompanyName()) + "</strong>. "
                + "Este panel te permite visualizar tu operación de Trade Marketing en tiempo real.</p>"
                + "</div>"
                + "<div style=\"margin-top:16px; padding:20px; border-radius:16px; background:linear-gradient(135deg, rgba(126,255,212,0.1), rgba(0,168,255,0.08)); color:#e8f8ff;\">"
                + "<p style=\"margin:0; font-size:15px;\">Tu correo registrado es <strong style=\"color:#00f4a3;\">" + escape(user.getEmail())
                + "</strong>. Si necesitas ayuda, responde este correo.</p>"
                + "</div>"
                + "<p style=\"margin-top:24px; font-size:13px; color:#9ca8ba;\">Equipo de Soporte</p>"
                + "</div>"
                + "<!--[if mso]><style>div { font-family: Arial, sans-serif !important; }</style><![endif]-->";
        sendEmail(user.getEmail(), subject, html);
    }

    @Override
    public void sendInvitation(Invitation invitation) {
        String subject = "Te invitaron a ver un mapa en MapWebBusiness";
        String link = frontendUrl + "/?invitation=" + invitation.getToken();
        String formattedExpiry = invitation.getExpiresAt().format(EXPIRY_FORMATTER);
        String html = "<div style=\"font-family: 'Inter', 'Segoe UI', sans-serif; background:#0d1117; color:#f7faff; padding:24px; border-radius:24px; max-width:640px; margin:0 auto; box-shadow:0 20px 40px rgba(0,0,0,0.5);\">"
                + "<h2 style=\"margin-top:0; color:#ff6b81; font-size:26px;\">Invitación recibida</h2>"
                + "<p style=\"font-size:16px; line-height:1.5;\">El administrador <strong>" + escape(invitation.getInviter().getName())
                + "</strong> de la empresa <strong>" + escape(invitation.getInviter().getCompanyName())
                + "</strong> te invita a ver su mapa.</p>"
                + "<p style=\"margin:20px 0 6px; font-size:14px; letter-spacing:0.03em; color:#a7b7c6;\">Caduca el "
                + "<strong style=\"color:#f5f5ff;\">" + formattedExpiry + "</strong></p>"
                + "<a href=\"" + link + "\" style=\"display:inline-flex; align-items:center; justify-content:center; margin:16px 0; padding:14px 28px; border-radius:14px; background:linear-gradient(135deg,#ff6b81,#ff8a5c); color:#0d1117; font-weight:700; text-decoration:none; font-size:16px;\">Aceptar invitación</a>"
                + "<p style=\"font-size:13px; color:#b3c0d1;\">Si no aceptas en ese tiempo, el enlace expirará automáticamente.</p>"
                + "</div>";
        sendEmail(invitation.getInviteeEmail(), subject, html);
    }

    @Override
    public void sendVerificationCode(String email, String name, String companyName, String code,
            OffsetDateTime expiresAt) {
        String subject = "Verifica tu correo";
        String formattedExpiry = expiresAt.format(EXPIRY_FORMATTER);
        String html = "<div style=\"font-family: 'Inter', 'Segoe UI', sans-serif; background:#0d1117; color:#f7faff; padding:24px; border-radius:24px; max-width:640px; margin:0 auto; box-shadow:0 20px 40px rgba(0,0,0,0.5);\">"
                + "<h2 style=\"margin-top:0; color:#4ade80; font-size:26px;\">Verifica tu cuenta</h2>"
                + "<p style=\"font-size:16px; line-height:1.5;\">Hola <strong>" + escape(name)
                + "</strong>, acabas de solicitar crear la cuenta de <strong>" + escape(companyName)
                + "</strong> en nuestra Web.</p>"
                + "<p style=\"margin:20px 0 6px; font-size:14px; letter-spacing:0.05em; color:#a7b7c6;\">Usa este c&oacute;digo para activar tu cuenta:</p>"
                + "<p style=\"font-size:32px; letter-spacing:0.4em; text-align:center; margin:12px 0; color:#facc15; font-weight:700;\">"
                + escape(code) + "</p>"
                + "<p style=\"margin:0; font-size:14px; color:#a7b7c6;\">Caduca el <strong>" + formattedExpiry
                + "</strong>. Si no soliciaste este correo, ignora este mensaje.</p>"
                + "</div>";
        sendEmail(email, subject, html);
    }

    @Override
    public void sendPasswordResetCode(String email, String name, String code, OffsetDateTime expiresAt) {
        String subject = "Recupera tu contraseña";
        String formattedExpiry = expiresAt.format(EXPIRY_FORMATTER);
        String html = "<div style=\"font-family: 'Inter', 'Segoe UI', sans-serif; background:#0d1117; color:#f7faff; padding:24px; border-radius:24px; max-width:640px; margin:0 auto; box-shadow:0 20px 40px rgba(0,0,0,0.5);\">"
                + "<h2 style=\"margin-top:0; color:#4ade80; font-size:26px;\">Recuperación de contraseña</h2>"
                + "<p style=\"font-size:16px; line-height:1.5;\">Hola <strong>" + escape(name)
                + "</strong>, solicitaste restablecer tu contraseña en MapWebBusiness.</p>"
                + "<p style=\"margin:20px 0 6px; font-size:14px; letter-spacing:0.05em; color:#a7b7c6;\">Usa este código para continuar:</p>"
                + "<p style=\"font-size:32px; letter-spacing:0.4em; text-align:center; margin:12px 0; color:#facc15; font-weight:700;\">"
                + escape(code) + "</p>"
                + "<p style=\"margin:0; font-size:14px; color:#a7b7c6;\">Caduca el <strong>" + formattedExpiry
                + "</strong>. Si no solicitaste este correo, ignora este mensaje.</p>"
                + "</div>";
        sendEmail(email, subject, html);
    }

    private void sendEmail(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            helper.setFrom("no-reply@mapwebbusiness.com");
            mailSender.send(message);
        } catch (MessagingException ex) {
            throw new IllegalStateException("No se pudo enviar el correo", ex);
        }
    }

    private String escape(String text) {
        return text == null ? "" : text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
