package com.example.API_commerce_pw.services;

import com.example.API_commerce_pw.entities.ProductReview;
import com.example.API_commerce_pw.repositories.ReviewRepository;
import com.example.API_commerce_pw.exceptions.AppError;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ReviewService {
    private final ReviewRepository r;

    public ReviewService(ReviewRepository r) {
        this.r = r;
    }

    public List<Map<String, Object>> byProduct(int id) {
        return r.findAllByProductIdOrderByCreatedAtDesc(id).stream().map(x -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", x.id);
            m.put("productId", x.productId);
            m.put("userId", x.userId);
            m.put("userName", "Cliente");
            m.put("rating", x.nota);
            m.put("nota", x.nota);
            m.put("title", x.titulo);
            m.put("comment", x.comentario);
            m.put("imageUrl", x.imgUrl);
            m.put("verifiedPurchase", x.compraVerificada);
            m.put("createdAt", x.createdAt);
            return m;
        }).toList();
    }

    public Map<String, Object> eligibility(Integer u, Integer p) {
        if (u == null || p == null) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("canReview", false);
            map.put("eligible", false);
            map.put("hasApprovedPayment", false);
            map.put("hasPurchased", false);
            map.put("alreadyReviewed", false);
            map.put("hasAlreadyReviewed", false);
            return map;
        }

        boolean paid = r.hasApprovedProductPayment(u, p);
        boolean reviewed = r.existsByUserIdAndProductId(u, p);

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("canReview", paid && !reviewed);
        map.put("eligible", paid && !reviewed);
        map.put("hasApprovedPayment", paid);
        map.put("hasPurchased", paid);
        map.put("alreadyReviewed", reviewed);
        map.put("hasAlreadyReviewed", reviewed);
        return map;
    }

    public ProductReview create(ProductReview x) {
        if (x.userId == null || x.productId == null) {
            throw new AppError("Dados inválidos para avaliação.", 400);
        }
        if (!r.hasApprovedProductPayment(x.userId, x.productId)) {
            throw new AppError("Você precisa ter comprado este produto para poder avaliá-lo.", 403);
        }
        if (r.existsByUserIdAndProductId(x.userId, x.productId)) {
            throw new AppError("Você já avaliou este produto.", 409);
        }
        return r.save(x);
    }

    public Map<String, Object> summary() {
        return Map.of("averageRating", Math.round(r.average() * 10.0) / 10.0, "totalReviews", r.total());
    }
}
