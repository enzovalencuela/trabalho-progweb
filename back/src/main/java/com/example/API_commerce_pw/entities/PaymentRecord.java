package com.example.API_commerce_pw.entities;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "payments")
public class PaymentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;

    @Column(name = "user_id")
    @JsonProperty("user_id")
    @JsonAlias("userId")
    public Integer userId;

    @Column(nullable = false, precision = 10, scale = 2)
    @JsonProperty("amount")
    public BigDecimal amount;

    @Column(nullable = false)
    public String currency = "BRL";

    @Column(nullable = false)
    public String status;

    public String provider = "simulated_gateway";

    @Column(name = "provider_payment_id", unique = true)
    @JsonProperty("provider_payment_id")
    @JsonAlias({ "providerPaymentId", "provider_payment_id" })
    public String providerPaymentId;

    public Integer installments = 1;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "additional_info", columnDefinition = "jsonb")
    @JsonProperty("additional_info")
    @JsonAlias({ "additionalInfo", "additional_info" })
    public Map<String, Object> additionalInfo;

    @Column(name = "created_at")
    @JsonProperty("created_at")
    @JsonAlias({ "createdAt", "created_at" })
    public LocalDateTime createdAt;

    @Column(name = "updated_at")
    @JsonProperty("updated_at")
    @JsonAlias({ "updatedAt", "updated_at" })
    public LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = createdAt;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @JsonProperty("transaction_amount")
    public BigDecimal getTransactionAmount() {
        return amount;
    }

    @JsonProperty("total_amount")
    public BigDecimal getTotalAmount() {
        return amount;
    }

    @JsonProperty("providerPaymentId")
    public String getProviderPaymentIdAlias() {
        return providerPaymentId;
    }

    @JsonProperty("transaction_id")
    public String getTransactionId() {
        return providerPaymentId != null ? providerPaymentId : (id != null ? String.valueOf(id) : null);
    }

    @JsonProperty("additionalInfo")
    public Map<String, Object> getAdditionalInfoAlias() {
        return additionalInfo;
    }

    @JsonProperty("items")
    public Object getItems() {
        if (additionalInfo != null && additionalInfo.containsKey("items")) {
            return additionalInfo.get("items");
        }
        return Collections.emptyList();
    }
}
