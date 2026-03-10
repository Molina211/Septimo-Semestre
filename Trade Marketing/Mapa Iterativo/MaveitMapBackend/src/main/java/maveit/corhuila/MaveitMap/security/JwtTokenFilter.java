package maveit.corhuila.MaveitMap.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import maveit.corhuila.MaveitMap.services.TokenRevocationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

public class JwtTokenFilter extends OncePerRequestFilter {

    private static final Set<String> PUBLIC_PATHS = Set.of("/api/auth/register", "/api/auth/login",
            "/api/auth/register/confirm", "/api/auth/resend-code",
            "/api/auth/password/forgot", "/api/auth/password/verify", "/api/auth/password/reset");

    private final JwtTokenService jwtTokenService;
    private final TokenRevocationService tokenRevocationService;

    public JwtTokenFilter(JwtTokenService jwtTokenService, TokenRevocationService tokenRevocationService) {
        this.jwtTokenService = jwtTokenService;
        this.tokenRevocationService = tokenRevocationService;
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
            AuthContext.set(jwtTokenService.parseToken(token));
            filterChain.doFilter(request, response);
        } finally {
            AuthContext.clear();
        }
    }
}
