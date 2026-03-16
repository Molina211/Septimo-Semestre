package maveit.corhuila.MaveitMap.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.repositories.UserAccountRepository;
import maveit.corhuila.MaveitMap.services.TokenRevocationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

public class JwtTokenFilter extends OncePerRequestFilter {

    private static final Set<String> PUBLIC_PATHS = Set.of("/api/auth/register", "/api/auth/login",
            "/api/auth/register/confirm", "/api/auth/resend-code",
            "/api/auth/email/confirm", "/api/auth/email/resend",
            "/api/auth/password/forgot", "/api/auth/password/verify", "/api/auth/password/reset",
            "/api/auth/refresh");

    private final JwtTokenService jwtTokenService;
    private final TokenRevocationService tokenRevocationService;
    private final UserAccountRepository userAccountRepository;

    public JwtTokenFilter(JwtTokenService jwtTokenService,
            TokenRevocationService tokenRevocationService,
            UserAccountRepository userAccountRepository) {
        this.jwtTokenService = jwtTokenService;
        this.tokenRevocationService = tokenRevocationService;
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        if (PUBLIC_PATHS.contains(path)) {
            return true;
        }
        // Public preview endpoint for invitations (token is in path)
        if ("GET".equalsIgnoreCase(request.getMethod()) && path.startsWith("/api/auth/invitations/")) {
            return true;
        }
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        try {
            if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                filterChain.doFilter(request, response);
                return;
            }
            String header = request.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token requerido");
            }
            String token = header.substring(7);
            if (tokenRevocationService.isRevoked(token)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token revocado");
            }
            AuthDetails details = jwtTokenService.parseToken(token);
            UserAccount account = userAccountRepository.findById(details.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
            if (!account.isEnabled()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Cuenta deshabilitada. Contacta al SuperAdministrador para habilitarla");
            }
            if (account.getTokensRevokedAt() != null
                    && details.getIssuedAt() < account.getTokensRevokedAt().toInstant().toEpochMilli()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token revocado");
            }
            AuthContext.set(details);
            filterChain.doFilter(request, response);
        } finally {
            AuthContext.clear();
        }
    }
}
