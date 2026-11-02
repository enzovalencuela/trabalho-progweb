package com.example.API_commerce_pw.config;

import com.google.firebase.auth.FirebaseToken;
import com.example.API_commerce_pw.entities.User;
import com.example.API_commerce_pw.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {
    private final FirebaseAuthService firebase;
    private final UserRepository users;
    public FirebaseAuthFilter(FirebaseAuthService firebase, UserRepository users) {
        this.firebase = firebase;
        this.users = users;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) return true;
        if ("GET".equalsIgnoreCase(method) && "/health".equals(path)) return true;
        if ("GET".equalsIgnoreCase(method)
            && ("/api/products".equals(path) || path.startsWith("/api/products/"))) return true;
        if ("GET".equalsIgnoreCase(method) && path.startsWith("/api/reviews/product/")) return true;
        if ("GET".equalsIgnoreCase(method) && path.startsWith("/api/payments/status")) return true;
        if ("POST".equalsIgnoreCase(method) && (
            "/api/register".equals(path) || "/api/auth/register".equals(path)
                || "/api/login".equals(path) || "/api/auth/login".equals(path)
                || "/api/google-login".equals(path) || "/api/payments/webhook".equals(path)
                || path.endsWith("/approve") || path.endsWith("/cancel")
                || path.endsWith("/status/update"))) return true;
        return false;
    }

    @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        String bearer = request.getHeader("Authorization");
        String token = bearer != null && bearer.regionMatches(true, 0, "Bearer ", 0, 7) ? bearer.substring(7).trim() : null;
        boolean session = false;
        if (token == null || token.isBlank()) {
            token = cookie(request, "jwt_token");
            session = token != null;
        }
        if (token == null || token.isBlank()) {
            SecurityContextHolder.clearContext();
            error(response, HttpServletResponse.SC_UNAUTHORIZED, "Acesso negado: sessao expirada ou nao encontrada.");
            return;
        }
        try {
            FirebaseToken decoded = session
                ? firebase.verifySessionCookie(token, true)
                : firebase.verifyIdToken(token);
            FirebasePrincipal principal = new FirebasePrincipal(decoded.getUid(), decoded.getEmail(), decoded.getName());
            User user = users.findByFirebaseUid(decoded.getUid())
                .or(() -> decoded.getEmail() == null ? java.util.Optional.empty() : users.findByEmail(decoded.getEmail()))
                .orElse(null);
            Object claimRole = decoded.getClaims().get("role");
            String role = user != null && user.role != null ? user.role : claimRole == null ? null : claimRole.toString();
            List<SimpleGrantedAuthority> authorities = "admin".equalsIgnoreCase(role)
                ? List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                : List.of();
            var authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            chain.doFilter(request, response);
        } catch (IllegalArgumentException e) {
            SecurityContextHolder.clearContext();
            response.addHeader("Set-Cookie", "jwt_token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None");
            error(response, HttpServletResponse.SC_UNAUTHORIZED, "Sessao invalida ou expirada.");
        } catch (IllegalStateException e) {
            SecurityContextHolder.clearContext();
            error(response, HttpServletResponse.SC_SERVICE_UNAVAILABLE, "Servico de autenticacao indisponivel.");
        }
    }

    private static String cookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (name.equals(cookie.getName())) return decodeCookie(cookie.getValue());
            }
        }
        String header = request.getHeader("Cookie");
        if (header != null) {
            for (String part : header.split(";")) {
                String[] pair = part.trim().split("=", 2);
                if (pair.length == 2 && name.equals(pair[0].trim())) return decodeCookie(pair[1]);
            }
        }
        return null;
    }

    private static String decodeCookie(String value) {
        if (value == null) return null;
        try {
            return URLDecoder.decode(value, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return value;
        }
    }

    private static void error(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }
}
