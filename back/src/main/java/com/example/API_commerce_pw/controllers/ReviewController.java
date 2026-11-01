package com.example.API_commerce_pw.controllers;

import com.example.API_commerce_pw.entities.ProductReview;
import com.example.API_commerce_pw.services.ReviewService;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import org.springframework.http.MediaType;

@RestController
@RequestMapping(value = "/api/reviews", produces = MediaType.APPLICATION_JSON_VALUE)
public class ReviewController {
    private final ReviewService s;

    public ReviewController(ReviewService s) {
        this.s = s;
    }

    @GetMapping("/summary")
    Object summary() {
        return s.summary();
    }

    @GetMapping("/eligibility")
    Object eligibility(@RequestParam int userId, @RequestParam int productId) {
        return s.eligibility(userId, productId);
    }

    @GetMapping("/product/{productId}")
    Object list(@PathVariable int productId) {
        return s.byProduct(productId);
    }

    @PostMapping
    @ResponseStatus(org.springframework.http.HttpStatus.CREATED)
    Object create(@RequestBody ProductReview r) {
        if (r.nota == null || r.nota.doubleValue() < 1 || r.nota.doubleValue() > 5)
            throw new com.example.API_commerce_pw.exceptions.AppError("A nota deve ser um valor entre 1 e 5.");
        r.compraVerificada = r.compraVerificada == null ? true : r.compraVerificada;
        ProductReview saved = s.create(r);
        java.util.Map<String, Object> out = new java.util.LinkedHashMap<>();
        out.put("id", saved.id);
        out.put("productId", saved.productId);
        out.put("userId", saved.userId);
        out.put("rating", saved.nota);
        out.put("title", saved.titulo);
        out.put("comment", saved.comentario);
        out.put("imageUrl", saved.imgUrl);
        out.put("verifiedPurchase", saved.compraVerificada);
        out.put("createdAt", saved.createdAt);
        return out;
    }
}
