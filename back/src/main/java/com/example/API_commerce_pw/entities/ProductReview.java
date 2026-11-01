package com.example.API_commerce_pw.entities;

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
    public Integer productId;
    @Column(name = "user_id", nullable = false)
    public Integer userId;
    @Column(name = "nota", nullable = false)
    public BigDecimal nota;
    public String titulo;
    @Column(nullable = false, columnDefinition = "text")
    public String comentario;
    @Column(name = "img_url")
    public String imgUrl;
    @Column(name = "compra_verificada")
    public Boolean compraVerificada;
    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @PrePersist
    void created() {
        createdAt = LocalDateTime.now();
    }
}
