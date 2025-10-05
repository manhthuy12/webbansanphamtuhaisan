package com.example.HomeAppliancesStore.security;

import com.example.HomeAppliancesStore.security.jwt.JwtAuthEntryPoint;
import com.example.HomeAppliancesStore.security.jwt.JwtAuthTokenFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthEntryPoint unauthorizedHandler;

    public SecurityConfig(JwtAuthEntryPoint unauthorizedHandler) {
        this.unauthorizedHandler = unauthorizedHandler;
    }

    @Bean
    public JwtAuthTokenFilter authenticationJwtTokenFilter() {
        return new JwtAuthTokenFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Cấu hình CORS cho phép localhost:3000
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("*")); 
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); 
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type")); 
        config.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); 
        return new CorsFilter(source);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOriginPatterns(Arrays.asList("*")); 
                    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
                    config.setAllowCredentials(true); 
                    return config;
                }))
                .csrf(csrf -> csrf.disable()) 
                .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(
                        sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.POST, "/api/categories/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.POST, "/api/accessories/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.PUT, "/api/accessories/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.DELETE, "/api/accessories/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.GET, "/api/profiles").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.POST, "/api/profiles/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.DELETE, "/api/profiles/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.GET, "/api/vouchers").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.POST, "/api/vouchers/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.PUT, "/api/vouchers/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.DELETE, "/api/vouchers/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.POST, "/api/news/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.PUT, "/api/news/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.DELETE, "/api/news/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.GET, "/api/orders/**").hasAnyAuthority("ADMIN", "STAFF", "USER")
                        .requestMatchers(HttpMethod.PUT, "/api/orders/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.POST, "/api/orders/**").hasAnyAuthority("ADMIN", "STAFF", "USER")
                        .requestMatchers(HttpMethod.POST, "/api/orders/sendOrderConfirmation/**").hasAnyAuthority("ADMIN", "STAFF", "USER")
                        .requestMatchers("/api/statistics/**").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.GET, "/api/users").hasAnyAuthority("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.GET, "/api/users/{id}").hasAnyAuthority("ADMIN", "STAFF", "USER")
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAnyAuthority("ADMIN", "STAFF", "USER")
                        .requestMatchers(HttpMethod.POST, "/api/users/**").hasAnyAuthority("ADMIN", "STAFF", "USER")
                        .requestMatchers("/api/chatrooms/**").hasAnyAuthority("ADMIN", "STAFF", "USER")
                        .requestMatchers("/api/addressbook/**").hasAnyAuthority("ADMIN", "STAFF", "USER")
                        .requestMatchers("/api/messages/**").hasAnyAuthority("ADMIN", "STAFF", "USER")
                        .requestMatchers("/api/reviews/**").hasAnyAuthority("ADMIN", "STAFF", "USER")
                        .requestMatchers(HttpMethod.GET, "/api/auth/**").hasAnyAuthority("ADMIN", "STAFF", "USER")
                        .requestMatchers(HttpMethod.POST, "/api/auth/change-password/**").hasAnyAuthority("ADMIN", "STAFF", "USER")
                        .anyRequest().permitAll());

        return http.build();
    }

}
