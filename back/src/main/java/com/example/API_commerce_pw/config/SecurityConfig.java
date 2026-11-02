package com.example.API_commerce_pw.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;

@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, FirebaseAuthFilter firebaseAuthFilter) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/product/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/sales/**", "/api/reviews/summary").authenticated()
                .requestMatchers(HttpMethod.POST,
                    "/api/register", "/api/auth/register",
                    "/api/login", "/api/auth/login", "/api/google-login",
                    "/api/payments/webhook",
                    "/api/payments/*/approve", "/api/payments/*/cancel",
                    "/api/payments/status/update").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/payments/create").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/payments/status").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/payments/user/**", "/api/payments/user").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/user/payments/**", "/api/user/payments").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/session").authenticated()
                .anyRequest().authenticated())
            .exceptionHandling(errors -> errors.authenticationEntryPoint((request, response, exception) -> {
                response.setStatus(401);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.getWriter().write("{\"message\":\"Autenticacao obrigatoria.\"}");
            }))
            .addFilterBefore(firebaseAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    // The filter must run inside Spring Security only, so public matchers can bypass it.
    @Bean
    FilterRegistrationBean<FirebaseAuthFilter> firebaseFilterServletRegistration(FirebaseAuthFilter filter) {
        FilterRegistrationBean<FirebaseAuthFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    UserDetailsService noLocalUsers() {
        return username -> { throw new UsernameNotFoundException("Firebase authentication is required."); };
    }
}
