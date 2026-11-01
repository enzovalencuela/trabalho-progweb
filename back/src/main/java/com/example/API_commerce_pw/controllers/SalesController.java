package com.example.API_commerce_pw.controllers;

import com.example.API_commerce_pw.repositories.PaymentRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import org.springframework.http.MediaType;

@RestController
@RequestMapping(value = "/api/sales", produces = MediaType.APPLICATION_JSON_VALUE)
public class SalesController {
    final PaymentRepository p;

    public SalesController(PaymentRepository p) {
        this.p = p;
    }

    @GetMapping("/total")
    Object total() {
        return Map.of("total", p.countByStatus("approved"));
    }

    @GetMapping("/revenue")
    Object revenue() {
        return Map.of("revenue", Optional.ofNullable(p.sumAmount("approved")).orElse(java.math.BigDecimal.ZERO));
    }

    @GetMapping("/weekly")
    Object weekly() {
        return p.weekly().stream().map(x -> Map.of("week", x[0], "total", x[1])).toList();
    }

    @GetMapping("/products")
    Object products() {
        return p.topProducts().stream().map(x -> Map.of("product", x[0] == null ? "" : x[0], "total", x[1])).toList();
    }

    @GetMapping("/categories")
    Object categories() {
        return p.categories().stream().map(x -> Map.of("category", x[0] == null ? "" : x[0], "total", x[1])).toList();
    }
}
