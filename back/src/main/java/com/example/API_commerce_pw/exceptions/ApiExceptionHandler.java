package com.example.API_commerce_pw.exceptions;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(AppError.class)
    ResponseEntity<Map<String, String>> app(AppError e) {
        return ResponseEntity.status(e.getStatusCode()).body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<Map<String, String>> other(Exception e) {
        return ResponseEntity.status(500).body(Map.of("message", "Erro interno do servidor."));
    }
}
