package com.example.API_commerce_pw.services;

import org.springframework.stereotype.Service;
import java.util.Map;

/**
 * Service maintained for backwards compatibility with existing references.
 * Delegates all operations to the simulated PaymentService.
 */
@Service
public class MercadoPagoService {
    private final PaymentService paymentService;

    public MercadoPagoService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    public Map<String, Object> create(Map<String, Object> in) {
        return paymentService.create(in);
    }

    public void webhook(String id) {
        paymentService.webhook(id);
    }

    public Map<String, Object> status(String id) {
        return paymentService.status(id, null);
    }
}
