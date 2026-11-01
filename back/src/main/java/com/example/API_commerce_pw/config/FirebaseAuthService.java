package com.example.API_commerce_pw.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.SessionCookieOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.concurrent.ExecutionException;

@Service
public class FirebaseAuthService {
    private final FirebaseAuth auth;
    private final RuntimeException initializationFailure;
    private static final Duration SESSION_DURATION = Duration.ofDays(7);

    public FirebaseAuthService(@Value("${GOOGLE_APPLICATION_CREDENTIALS:}") String credentialsConfig) {
        FirebaseAuth initialized = null;
        RuntimeException failure = null;
        try {
            FirebaseApp app;
            if (!FirebaseApp.getApps().isEmpty()) {
                app = FirebaseApp.getInstance();
            } else {
                if (credentialsConfig == null || credentialsConfig.isBlank()) {
                    throw new IllegalStateException("GOOGLE_APPLICATION_CREDENTIALS nao configurada.");
                }
                byte[] credentials = credentialsConfig.trim().startsWith("{")
                    ? credentialsConfig.getBytes(java.nio.charset.StandardCharsets.UTF_8)
                    : Files.readAllBytes(Path.of(credentialsConfig));
                FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(new ByteArrayInputStream(credentials)))
                    .build();
                app = FirebaseApp.initializeApp(options);
            }
            initialized = FirebaseAuth.getInstance(app);
        } catch (Exception e) {
            failure = new IllegalStateException("Firebase Admin nao pode ser inicializado.", e);
        }
        this.auth = initialized;
        this.initializationFailure = failure;
    }

    public FirebaseToken verifyIdToken(String token) {
        FirebaseAuth firebaseAuth = requireAuth();
        try { return firebaseAuth.verifyIdToken(token, true); }
        catch (com.google.firebase.auth.FirebaseAuthException e) { throw new IllegalArgumentException("Token invalido ou expirado.", e); }
    }

    public FirebaseToken verifySessionCookie(String cookie, boolean checkRevoked) {
        FirebaseAuth firebaseAuth = requireAuth();
        try { return firebaseAuth.verifySessionCookie(cookie, checkRevoked); }
        catch (com.google.firebase.auth.FirebaseAuthException e) { throw new IllegalArgumentException("Sessao invalida ou expirada.", e); }
    }

    public String createSessionCookie(String idToken) {
        FirebaseAuth firebaseAuth = requireAuth();
        try { return firebaseAuth.createSessionCookie(idToken, SessionCookieOptions.builder().setExpiresIn(SESSION_DURATION.toMillis()).build()); }
        catch (com.google.firebase.auth.FirebaseAuthException e) { throw new IllegalArgumentException("Token invalido ou expirado.", e); }
    }

    private FirebaseAuth requireAuth() {
        if (auth == null) throw new IllegalStateException("Firebase Admin nao configurado.", initializationFailure);
        return auth;
    }
}

