package com.example.API_commerce_pw.controllers;

import com.example.API_commerce_pw.services.MercadoPagoService;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import org.springframework.http.MediaType;

@RestController
@RequestMapping(value = "/api/payments", produces = MediaType.APPLICATION_JSON_VALUE)
public class PaymentController {
    final MercadoPagoService s;

    public PaymentController(MercadoPagoService s) {
        this.s = s;
    }

    @PostMapping("/create")
    Object create(@RequestBody Map<String, Object> b) {
        return Map.of("payment", s.create(b));
    }

    @PostMapping("/webhook")
    Object webhook(@RequestBody Map<String, Object> b) {
        Object id = b.get("id");
        if (b.get("data") instanceof Map<?, ?> d && d.get("id") != null)
            id = d.get("id");
        if (id == null)
            return org.springframework.http.ResponseEntity.badRequest().body("No payment id");
        s.webhook(String.valueOf(id));
        return "OK";
    }

    @GetMapping("/status")
    Object status(@RequestParam(name = "payment_id") String id) {
        return Map.of("payment", s.status(id));
    }
}
