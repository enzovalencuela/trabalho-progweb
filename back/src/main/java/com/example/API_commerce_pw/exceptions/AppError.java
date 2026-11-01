package com.example.API_commerce_pw.exceptions;

public class AppError extends RuntimeException {
    private final int statusCode;

    public AppError(String message) {
        this(message, 400);
    }

    public AppError(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
