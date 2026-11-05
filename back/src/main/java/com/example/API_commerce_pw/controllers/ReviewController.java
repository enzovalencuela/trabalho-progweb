package com.example.API_commerce_pw.controllers;

import com.example.API_commerce_pw.config.FirebasePrincipal;
import com.example.API_commerce_pw.entities.ProductReview;
import com.example.API_commerce_pw.entities.User;
import com.example.API_commerce_pw.exceptions.AppError;
import com.example.API_commerce_pw.services.CommerceService;
import com.example.API_commerce_pw.services.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping(value = "/api/reviews", produces = MediaType.APPLICATION_JSON_VALUE)
public class ReviewController {
    private final ReviewService s;
    private final CommerceService commerceService;

    public ReviewController(ReviewService s, CommerceService commerceService) {
        this.s = s;
        this.commerceService = commerceService;
    }

    @GetMapping("/summary")
    public Object summary() {
        return s.summary();
    }

    @GetMapping({"/can-review", "/eligibility"})
    public ResponseEntity<?> canReview(
            @RequestParam(name = "userId", required = false) Integer userId,
            @RequestParam(name = "productId") Integer productId,
            @AuthenticationPrincipal FirebasePrincipal principal) {
        Integer targetUserId = userId;
        if (targetUserId == null && principal != null) {
            User user = commerceService.findByFirebaseIdentity(principal.uid(), principal.email());
            if (user != null) {
                targetUserId = user.id;
            }
        }
        return ResponseEntity.ok(s.eligibility(targetUserId, productId));
    }

    @GetMapping("/product/{productId}")
    public Object list(@PathVariable int productId) {
        return s.byProduct(productId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Object create(@RequestBody ProductReview r, @AuthenticationPrincipal FirebasePrincipal principal) {
        if (principal != null) {
            User user = commerceService.findByFirebaseIdentity(principal.uid(), principal.email());
            if (user != null && (r.userId == null || r.userId <= 0)) {
                r.userId = user.id;
            }
        }
        if (r.nota == null || r.nota.doubleValue() < 1 || r.nota.doubleValue() > 5) {
            throw new AppError("A nota deve ser um valor entre 1 e 5.");
        }
        r.compraVerificada = true;
        ProductReview saved = s.create(r);
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", saved.id);
        out.put("productId", saved.productId);
        out.put("userId", saved.userId);
        out.put("rating", saved.nota);
        out.put("nota", saved.nota);
        out.put("title", saved.titulo);
        out.put("comment", saved.comentario);
        out.put("imageUrl", saved.imgUrl);
        out.put("verifiedPurchase", saved.compraVerificada);
        out.put("createdAt", saved.createdAt);
        return out;
    }
}
