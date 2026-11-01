package com.example.API_commerce_pw.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;
    @Column(nullable = false)
    public String name;
    @Column(nullable = false, unique = true)
    public String email;
    @JsonIgnore
    @Column(name = "firebase_uid", unique = true)
    public String firebaseUid;
    @JsonIgnore
    public String password;
    @Column(nullable = false, precision = 10, scale = 2)
    public BigDecimal balance = BigDecimal.ZERO;
    @Column(nullable = false)
    public String role = "user";
    public String cpf, phone, address;
    @Column(name = "number")
    public String number;
    public String neighborhood, city, state, zip;
    @Column(name = "created_at")
    public LocalDateTime createdAt;
    @Column(name = "updated_at")
    public LocalDateTime updatedAt;
}
