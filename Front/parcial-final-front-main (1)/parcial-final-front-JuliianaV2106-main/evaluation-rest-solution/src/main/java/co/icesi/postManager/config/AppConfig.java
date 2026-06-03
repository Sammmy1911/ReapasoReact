package co.icesi.postManager.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import co.icesi.postManager.utils.JwtFilter;

/**
 * AppConfig: Clase de configuración central para Spring Security y otros Beans.
 * Aquí se define cómo se protege la aplicación y quién tiene acceso a qué.
 */
@Configuration
public class AppConfig {

    @Autowired
    private JwtFilter jwtFilter; // Filtro personalizado para procesar tokens JWT en cada petición.

    /**
     * BCryptPasswordEncoder: Define el algoritmo para encriptar y verificar contraseñas.
     */
    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * securityFilterChain: Configura la cadena de filtros de seguridad.
     * Define rutas públicas, protección CSRF, políticas de sesión y filtros.
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Habilita CORS usando la configuración definida abajo.
                .cors(t -> t.configurationSource(corsConfigurationSource()))
                // Deshabilita CSRF (común en APIs stateless con JWT).
                .csrf(c -> c.disable())
                // Configura los permisos por ruta.
                .authorizeHttpRequests(requests -> requests
                        // Estas rutas son públicas (Login, Documentación, Consola H2).
                        .requestMatchers("/login", "/h2-console/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // Cualquier otra ruta requiere que el usuario esté autenticado.
                        .anyRequest().authenticated())
                // Configuración necesaria para que la consola H2 funcione en frames.
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                // Define que la API no guardará estado (stateless) usando sesiones de servidor.
                .sessionManagement(t -> t.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Agrega nuestro filtro JWT antes del filtro estándar de usuario/contraseña de Spring.
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    /**
     * corsConfigurationSource: Configura qué dominios externos pueden llamar a esta API.
     * En este caso, permitimos todo ("*") para facilitar el desarrollo local con React.
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            var config = new org.springframework.web.cors.CorsConfiguration();
            config.addAllowedOrigin("*"); // Permitir cualquier origen.
            config.addAllowedMethod("*"); // Permitir GET, POST, PUT, DELETE, etc.
            config.addAllowedHeader("*"); // Permitir cualquier encabezado.
            return config;
        };
    }
}
