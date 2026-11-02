package com.example.API_commerce_pw.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.example.API_commerce_pw.config.FirebasePrincipal;
import com.example.API_commerce_pw.entities.User;
import com.example.API_commerce_pw.services.CommerceService;
import com.example.API_commerce_pw.services.PaymentService;
import com.example.API_commerce_pw.repositories.PaymentRepository;
import com.example.API_commerce_pw.exceptions.AppError;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/user/payments", produces = MediaType.APPLICATION_JSON_VALUE)
public class PaymentHistoryController {
    private final CommerceService service;
    private final PaymentRepository payments;
    private final PaymentService paymentService;

    public PaymentHistoryController(CommerceService service, PaymentRepository payments, PaymentService paymentService) {
        this.service = service;
        this.payments = payments;
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam int id) {
        return ResponseEntity.ok(paymentService.userPayments(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> listByPath(@PathVariable int id) {
        return ResponseEntity.ok(paymentService.userPayments(id));
    }

    @DeleteMapping("/{id}")
    public Object delete(@PathVariable int id, @AuthenticationPrincipal FirebasePrincipal principal) {
        User user = principal == null ? null : service.findByFirebaseIdentity(principal.uid(), principal.email());
        if (user == null || payments.deleteOwned(user.id, id) == 0) {
            throw new AppError("Compra nao encontrada.", 404);
        }
        return Map.of("message", "Compra cancelada com sucesso.");
    }
}
