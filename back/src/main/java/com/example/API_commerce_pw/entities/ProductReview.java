package com.example.API_commerce_pw.entities;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_reviews")
public class ProductReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;

    @Column(name = "product_id", nullable = false)
    @JsonProperty("productId")
    @JsonAlias({ "productId", "product_id" })
    public Integer productId;

    @Column(name = "user_id", nullable = false)
    @JsonProperty("userId")
    @JsonAlias({ "userId", "user_id" })
    public Integer userId;

    @Column(name = "nota", nullable = false, precision = 3, scale = 1)
    @JsonProperty("nota")
    @JsonAlias({ "rating", "nota", "score" })
    public BigDecimal nota;

    @JsonProperty("titulo")
    @JsonAlias({ "title", "titulo" })
    public String titulo;

    @Column(nullable = false, columnDefinition = "text")
    @JsonProperty("comentario")
    @JsonAlias({ "comment", "comentario", "description" })
    public String comentario;

    @Column(name = "img_url", columnDefinition = "TEXT")
    @JsonProperty("imgUrl")
    @JsonAlias({ "imageUrl", "imgUrl", "img", "image" })
    public String imgUrl;

    @Column(name = "compra_verificada")
    @JsonProperty("compraVerificada")
    @JsonAlias({ "verifiedPurchase", "compraVerificada" })
    public Boolean compraVerificada;

    @Column(name = "created_at")
    @JsonProperty("createdAt")
    @JsonAlias({ "createdAt", "created_at" })
    public LocalDateTime createdAt;

    @PrePersist
    void created() {
        createdAt = LocalDateTime.now();
    }
}
