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
            m.put("title", x.titulo);
            m.put("comment", x.comentario);
            m.put("imageUrl", x.imgUrl);
            m.put("verifiedPurchase", x.compraVerificada);
            m.put("createdAt", x.createdAt);
            return m;
        }).toList();
    }

    public Map<String, Object> eligibility(int u, int p) {
        boolean paid = r.hasApprovedProductPayment(u, p), reviewed = r.existsByUserIdAndProductId(u, p);
        return Map.of("eligible", paid && !reviewed, "hasApprovedPayment", paid, "alreadyReviewed", reviewed);
    }

    public ProductReview create(ProductReview x) {
        if (!r.hasApprovedProductPayment(x.userId, x.productId))
            throw new AppError("Voce precisa ter uma compra aprovada deste produto para avalia-lo.", 403);
        if (r.existsByUserIdAndProductId(x.userId, x.productId))
            throw new AppError("Voce ja avaliou este produto.", 409);
        return r.save(x);
    }

    public Map<String, Object> summary() {
        return Map.of("averageRating", Math.round(r.average() * 10.0) / 10.0, "totalReviews", r.total());
    }
}
