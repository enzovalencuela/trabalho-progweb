package com.example.API_commerce_pw.dtos;

import com.example.API_commerce_pw.entities.User;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * API-safe user representation: never exposes credentials or Firebase
 * identifiers.
 */
public record UserResponseDTO(
        Integer id,
        String name,
        String email,
        BigDecimal balance,
        String role,
        String cpf,
        String phone,
        String address,
        String number,
        String neighborhood,
        String city,
        String state,
        String zip,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public static UserResponseDTO from(User user) {
        return new UserResponseDTO(user.id, user.name, user.email, user.balance, user.role,
                user.cpf, user.phone, user.address, user.number, user.neighborhood, user.city,
                user.state, user.zip, user.createdAt, user.updatedAt);
    }
}
