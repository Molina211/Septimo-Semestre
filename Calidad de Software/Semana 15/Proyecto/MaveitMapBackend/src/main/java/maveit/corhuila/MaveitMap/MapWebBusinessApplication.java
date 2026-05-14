package maveit.corhuila.MaveitMap;

import maveit.corhuila.MaveitMap.security.SecurityCryptoProperties;
import maveit.corhuila.MaveitMap.security.JwtProperties;
import maveit.corhuila.MaveitMap.security.AuthCookieProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({ SecurityCryptoProperties.class, JwtProperties.class, AppProperties.class,
		SecuritySetupProperties.class, RegistrationProperties.class, AuthCookieProperties.class })
public class MapWebBusinessApplication {

	public static void main(String[] args) {
		SpringApplication.run(MapWebBusinessApplication.class, args);
	}

}
