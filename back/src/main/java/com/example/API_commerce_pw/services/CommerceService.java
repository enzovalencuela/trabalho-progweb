package com.example.API_commerce_pw.services;

import com.example.API_commerce_pw.entities.*;
import com.example.API_commerce_pw.repositories.*;
import com.example.API_commerce_pw.exceptions.AppError;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class CommerceService {
    final UserRepository users;
    final CartRepository carts;
    final PaymentRepository payments;

    public CommerceService(UserRepository u, CartRepository c, PaymentRepository p) {
        users = u;
        carts = c;
        payments = p;
    }

    public Map<String, Object> check(String e) {
        boolean yes = users.findByEmail(e).isPresent();
        return Map.of("exists", yes, "message", yes ? "Usuario ja existe" : "Usuario nao encontrado");
    }

    public User createUser(User u) {
        return users.save(u);
    }

    @Transactional
    public User upsertFirebaseUser(String email, String uid, String displayName, boolean preserveExistingName) {
        User u = users.findByEmail(email).orElseGet(User::new);
        boolean fresh = u.id == null;
        u.email = email;
        u.firebaseUid = uid;
        if (fresh || !preserveExistingName || u.name == null)
            u.name = displayName;
        return users.save(u);
    }

    public User byEmail(String e) {
        return users.findByEmail(e).orElseThrow(() -> new AppError("Usuario nao encontrado.", 404));
    }

    public User findByFirebaseIdentity(String uid, String email) {
        return uid != null && !uid.isBlank() ? users.findByFirebaseUid(uid).orElse(null)
                : users.findByEmail(email).orElse(null);
    }

    public List<User> users() {
        return users.findAll();
    }

    public void checkout(int id, User x) {
        User u = users.findById(id).orElseThrow(() -> new AppError("Usuario nao encontrado.", 404));
        u.cpf = x.cpf;
        u.phone = x.phone;
        u.address = x.address;
        u.number = x.number;
        u.neighborhood = x.neighborhood;
        u.city = x.city;
        u.state = x.state;
        u.zip = x.zip;
        users.save(u);
    }

    public CartItem add(int u, int p) {
        if (users.findById(u).isEmpty())
            throw new AppError("Usuario nao encontrado.", 404);
        return carts.findByUserIdAndProductId(u, p).orElseGet(() -> {
            CartItem c = new CartItem();
            c.userId = u;
            c.productId = p;
            return carts.save(c);
        });
    }

    public List<Integer> cart(int u) {
        return carts.findAllByUserId(u).stream().map(x -> x.productId).toList();
    }

    public void remove(int u, int p) {
        if (carts.findByUserIdAndProductId(u, p).isEmpty())
            throw new AppError("Item nao encontrado no carrinho.", 404);
        carts.deleteByUserIdAndProductId(u, p);
    }

    public List<PaymentRecord> paymentHistory(int id) {
        return payments.findAllByUserIdOrderByCreatedAtDesc(id);
    }

    @Transactional
    public void deleteUser(int id) {
        carts.deleteAll(carts.findAllByUserId(id));
        payments.deleteAll(payments.findAllByUserIdOrderByCreatedAtDesc(id));
        users.deleteById(id);
    }
}
