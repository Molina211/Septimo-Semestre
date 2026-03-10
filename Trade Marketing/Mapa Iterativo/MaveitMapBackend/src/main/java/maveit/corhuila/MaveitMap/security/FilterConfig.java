package maveit.corhuila.MaveitMap.security;

import jakarta.servlet.Filter;
import maveit.corhuila.MaveitMap.services.TokenRevocationService;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<Filter> jwtFilter(JwtTokenService jwtTokenService,
            TokenRevocationService tokenRevocationService) {
        FilterRegistrationBean<Filter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new JwtTokenFilter(jwtTokenService, tokenRevocationService));
        registration.setOrder(1);
        return registration;
    }
}
