package com.example.API_commerce_pw.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "payments")
public class PaymentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;
    @Column(name = "user_id")
    public Integer userId;
    @Column(nullable = false, precision = 10, scale = 2)
    public BigDecimal amount;
    @Column(nullable = false)
    public String currency = "BRL";
    @Column(nullable = false)
    public String status;
    public String provider;
    @Column(name = "provider_payment_id", unique = true)
    public String providerPaymentId;
    public Integer installments;
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "additional_info", columnDefinition = "jsonb")
    public Map<String, Object> additionalInfo;
    @Column(name = "created_at")
    public LocalDateTime createdAt;
    @Column(name = "updated_at")
    public LocalDateTime updatedAt;
}
