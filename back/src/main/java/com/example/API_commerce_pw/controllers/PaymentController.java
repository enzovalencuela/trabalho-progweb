package com.example.API_commerce_pw.controllers;

import com.example.API_commerce_pw.config.FirebasePrincipal;
import com.example.API_commerce_pw.entities.User;
import com.example.API_commerce_pw.services.CommerceService;
import com.example.API_commerce_pw.services.PaymentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping(value = "/api/payments", produces = MediaType.APPLICATION_JSON_VALUE)
public class PaymentController {
    private final PaymentService paymentService;
    private final CommerceService commerceService;

    public PaymentController(PaymentService paymentService, CommerceService commerceService) {
        this.paymentService = paymentService;
        this.commerceService = commerceService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body,
                                    @AuthenticationPrincipal FirebasePrincipal principal) {
        if (principal != null) {
            User user = commerceService.findByFirebaseIdentity(principal.uid(), principal.email());
            if (user != null && (body.get("user_id") == null || String.valueOf(body.get("user_id")).isBlank())) {
                body.put("user_id", user.id);
            }
        }
        Map<String, Object> payment = paymentService.create(body);
        Map<String, Object> response = new LinkedHashMap<>(payment);
        response.put("payment", payment);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> webhook(@RequestBody Map<String, Object> b) {
        Object id = b.get("id");
        if (b.get("data") instanceof Map<?, ?> d && d.get("id") != null) {
            id = d.get("id");
        }
        if (id == null) {
            return ResponseEntity.badRequest().body("No payment id");
        }
        paymentService.webhook(String.valueOf(id));
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/status")
    public ResponseEntity<?> status(@RequestParam(name = "payment_id", required = false) String paymentId,
                                    @RequestParam(name = "id", required = false) String id,
                                    @AuthenticationPrincipal FirebasePrincipal principal) {
        String targetId = paymentId != null && !paymentId.isBlank() ? paymentId : id;
        Integer fallbackUserId = null;
        if (principal != null) {
            User user = commerceService.findByFirebaseIdentity(principal.uid(), principal.email());
            if (user != null) {
                fallbackUserId = user.id;
            }
        }
        Map<String, Object> statusData = paymentService.status(targetId, fallbackUserId);
        Map<String, Object> response = new LinkedHashMap<>(statusData);
        response.put("payment", statusData);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> userPayments(@PathVariable int id) {
        return ResponseEntity.ok(paymentService.userPayments(id));
    }

    @GetMapping("/user")
    public ResponseEntity<?> userPaymentsParam(@RequestParam int id) {
        return ResponseEntity.ok(paymentService.userPayments(id));
    }
}
