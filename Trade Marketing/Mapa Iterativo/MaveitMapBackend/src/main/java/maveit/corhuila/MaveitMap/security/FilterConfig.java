package maveit.corhuila.MaveitMap.security;

import jakarta.servlet.Filter;
import maveit.corhuila.MaveitMap.services.TokenRevocationService;
import maveit.corhuila.MaveitMap.repositories.UserAccountRepository;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<Filter> jwtFilter(JwtTokenService jwtTokenService,
            TokenRevocationService tokenRevocationService,
            UserAccountRepository userAccountRepository) {
        FilterRegistrationBean<Filter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new JwtTokenFilter(jwtTokenService, tokenRevocationService, userAccountRepository));
        registration.setOrder(1);
        return registration;
    }
}
