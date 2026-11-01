package com.example.API_commerce_pw.controllers;

import com.example.API_commerce_pw.entities.CartItem;
import com.example.API_commerce_pw.services.CommerceService;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import org.springframework.http.MediaType;

@RestController
@RequestMapping(value = "/api/cart", produces = MediaType.APPLICATION_JSON_VALUE)
public class CartController {
    final CommerceService s;

    public CartController(CommerceService s) {
        this.s = s;
    }

    @PostMapping("/add")
    Object add(@RequestBody Map<String, Integer> b) {
        return s.add(b.get("userId"), b.get("productId"));
    }

    @PostMapping("/remove")
    Object remove(@RequestBody Map<String, Integer> b) {
        s.remove(b.get("userId"), b.get("productId"));
        return Map.of("message", "Produto removido com sucesso.");
    }

    @GetMapping("/{userId}")
    Object list(@PathVariable int userId) {
        return s.cart(userId);
    }
}
