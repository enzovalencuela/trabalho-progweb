package com.example.API_commerce_pw.repositories;

import com.example.API_commerce_pw.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface CartRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByUserIdAndProductId(Integer userId, Integer productId);

    List<CartItem> findAllByUserId(Integer userId);

    void deleteByUserIdAndProductId(Integer userId, Integer productId);
}
