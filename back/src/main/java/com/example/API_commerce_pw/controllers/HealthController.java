package com.example.API_commerce_pw.controllers;

import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {
    private final JdbcTemplate db;
    public HealthController(JdbcTemplate db) { this.db = db; }

    @GetMapping(value = "/health", produces = MediaType.APPLICATION_JSON_VALUE)
    Object health() {
        try {
            db.queryForObject("select 1", Integer.class);
            return Map.of("ok", true);
        } catch (Exception exception) {
            return org.springframework.http.ResponseEntity.internalServerError().body(Map.of("ok", false));
        }
    }
}
