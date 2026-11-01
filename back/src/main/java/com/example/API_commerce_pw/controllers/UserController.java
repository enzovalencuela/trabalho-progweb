package com.example.API_commerce_pw.controllers;

import com.example.API_commerce_pw.config.FirebaseAuthService;
import com.example.API_commerce_pw.config.FirebasePrincipal;
import com.example.API_commerce_pw.entities.User;
import com.example.API_commerce_pw.dtos.UserResponseDTO;
import org.springframework.http.MediaType;
import com.example.API_commerce_pw.services.CommerceService;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.util.*;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {
    private static final Duration SESSION_DURATION = Duration.ofDays(7);
    private final CommerceService service;
    private final FirebaseAuthService firebase;

    public UserController(CommerceService service, FirebaseAuthService firebase) {
        this.service = service;
        this.firebase = firebase;
    }

    @GetMapping("/api/users")
    Object users() {
        return service.users().stream().map(UserResponseDTO::from).toList();
    }

    @GetMapping("/api/check-user-exists")
    Object check(@RequestParam(required = false) String email) {
        if (email == null || email.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Email e obrigatorio e deve ser uma string."));
        return service.check(email);
    }

    @PostMapping("/api/register")
    ResponseEntity<?> register(@RequestBody Map<String, Object> body, HttpServletResponse response) {
        String idToken = string(body.get("firebaseToken")), name = string(body.get("name"));
        if (idToken == null || name == null)
            return ResponseEntity.badRequest().body(Map.of("message", "Token e nome sao obrigatorios."));
        try {
            FirebaseToken decoded = firebase.verifyIdToken(idToken);
            if (decoded.getEmail() == null)
                return ResponseEntity.badRequest().body(Map.of("message", "Email do token nao encontrado."));
            User user = service.upsertFirebaseUser(decoded.getEmail(), decoded.getUid(), name, false);
            String sessionCookie = firebase.createSessionCookie(idToken);
            return ResponseEntity.status(201).header(HttpHeaders.SET_COOKIE, sessionCookie(sessionCookie))
                    .body(Map.of("message", "Usuario cadastrado com sucesso.", "user", UserResponseDTO.from(user)));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(401).body(Map.of("message", "Token invalido."));
        }
    }

    @PostMapping("/api/google-login")
    ResponseEntity<?> login(@RequestBody Map<String, Object> body, HttpServletResponse response) {
        String idToken = string(body.get("firebaseToken"));
        if (idToken == null)
            return ResponseEntity.badRequest().body(Map.of("message", "Token do Firebase e obrigatorio."));
        try {
            FirebaseToken decoded = firebase.verifyIdToken(idToken);
            if (decoded.getEmail() == null || decoded.getUid() == null)
                return ResponseEntity.badRequest().body(Map.of("message", "Dados do token invalidos."));
            String proposed = string(body.get("name"));
            String name = proposed != null ? proposed : decoded.getName();
            if (name == null || name.isBlank())
                name = decoded.getEmail().split("@")[0];
            User user = service.upsertFirebaseUser(decoded.getEmail(), decoded.getUid(), name, true);
            String sessionCookie = firebase.createSessionCookie(idToken);
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, sessionCookie(sessionCookie))
                    .body(Map.of("message", "Login realizado com sucesso.", "user", UserResponseDTO.from(user)));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(401).body(Map.of("message", "Token invalido ou expirado."));
        }
    }

    @PostMapping("/api/user-data")
    ResponseEntity<?> data(@RequestBody(required = false) Map<String, Object> body, HttpServletRequest request,
            HttpServletResponse response) {
        String sessionCookie = cookie(request, "jwt_token");
        String idToken = body == null ? null : string(body.get("firebaseToken"));
        if (idToken == null && body != null)
            idToken = string(body.get("firebaseIdToken"));
        try {
            FirebaseToken decoded;
            if (sessionCookie != null)
                decoded = firebase.verifySessionCookie(sessionCookie, false);
            else if (idToken != null) {
                decoded = firebase.verifyIdToken(idToken);
                setSessionCookie(response, firebase.createSessionCookie(idToken));
            } else
                return ResponseEntity.status(401)
                        .body(Map.of("message", "Sessao nao encontrada. Faca login novamente."));
            User user = service.byEmail(decoded.getEmail());
            if (sessionCookie != null)
                setSessionCookie(response, sessionCookie);
            return ResponseEntity.ok(UserResponseDTO.from(user));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Token de sessao expirado ou invalido.", "code", "auth/session-expired"));
        }
    }

    @GetMapping("/api/session")
    ResponseEntity<?> session(@AuthenticationPrincipal FirebasePrincipal principal) {
        if (principal == null)
            return ResponseEntity.status(401).body(Map.of("message", "Sessao nao encontrada."));
        User user = service.findByFirebaseIdentity(principal.uid(), principal.email());
        if (user == null)
            return ResponseEntity.status(404).body(Map.of("message", "Usuario nao encontrado."));
        return ResponseEntity.ok(UserResponseDTO.from(user));
    }

    @PostMapping("/api/logout")
    Object logout(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, ResponseCookie.from("jwt_token", "").httpOnly(true).sameSite("Lax")
                .path("/").maxAge(Duration.ZERO).build().toString());
        return Map.of("message", "Logout realizado com sucesso.");
    }

    @DeleteMapping("/api/delete-user-data")
    ResponseEntity<?> delete(@AuthenticationPrincipal FirebasePrincipal principal) {
        if (principal == null || ((principal.uid() == null || principal.uid().isBlank())
                && (principal.email() == null || principal.email().isBlank())))
            return ResponseEntity.status(401)
                    .body(Map.of("message", "UID ou email do usuario nao disponivel no token."));
        User user = principal.email() == null ? null
                : service.findByFirebaseIdentity(principal.uid(), principal.email());
        if (user == null)
            return ResponseEntity.status(404).body(Map.of("message", "Usuario nao encontrado."));
        service.deleteUser(user.id);
        return ResponseEntity.ok(Map.of("message", "Dados do usuario e relacionados foram removidos com sucesso."));
    }

    @PutMapping("/api/user/{id}/update-checkout-info")
    Object checkout(@PathVariable int id, @RequestBody User user) {
        service.checkout(id, user);
        return Map.of("message", "Dados de checkout atualizados com sucesso.");
    }

    private static String sessionCookie(String value) {
        return ResponseCookie.from("jwt_token", value).httpOnly(true).sameSite("Lax").path("/").maxAge(SESSION_DURATION)
                .build().toString();
    }

    private static void setSessionCookie(HttpServletResponse response, String value) {
        response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie(value));
    }

    private static String cookie(HttpServletRequest request, String name) {
        if (request.getCookies() != null)
            for (var cookie : request.getCookies())
                if (name.equals(cookie.getName()))
                    return cookie.getValue();
        return null;
    }

    private static String string(Object value) {
        return value == null || String.valueOf(value).isBlank() ? null : String.valueOf(value);
    }
}
