package com.example.API_commerce_pw.entities;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;

    @Column(nullable = false)
    public String titulo;

    @Column(nullable = false, precision = 10, scale = 2)
    @JsonAlias("price")
    public BigDecimal preco;

    @JsonProperty("preco_original")
    @JsonAlias({ "precoOriginal", "original_price", "originalPrice" })
    @Column(name = "preco_original", precision = 10, scale = 2)
    public BigDecimal precoOriginal;

    @JsonProperty("max_parcelas")
    @JsonAlias({ "maxParcelas", "max_installments", "installments" })
    @Column(name = "max_parcelas", nullable = false)
    public Integer maxParcelas = 1;

    @JsonProperty("taxa_parcela")
    @JsonAlias("taxaParcela")
    @Column(name = "taxa_parcela", nullable = false, precision = 10, scale = 2)
    public BigDecimal taxaParcela = BigDecimal.ZERO;

    @Column(nullable = false, length = 500)
    public String img;

    @Column(columnDefinition = "text")
    public String descricao;

    public String categoria;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "varchar(255)[]")
    public List<String> tags;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "varchar(100)[]")
    public List<String> cores;

    @Column(nullable = false)
    public Boolean disponivel = true;

    @JsonProperty("created_at")
    @JsonAlias("createdAt")
    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @JsonProperty("updated_at")
    @JsonAlias("updatedAt")
    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    @PrePersist
    void created() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void updated() {
        updatedAt = LocalDateTime.now();
    }
}
