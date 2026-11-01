package com.example.API_commerce_pw.dtos;

public record CheckoutInfoDto(String cpf, String phone, String address, String number, String neighborhood, String city,
        String state, String zip) {
}
