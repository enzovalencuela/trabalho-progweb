package com.example.API_commerce_pw.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "product_id" }))
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;
    @Column(name = "user_id")
    public Integer userId;
    @Column(name = "product_id")
    public Integer productId;
}
