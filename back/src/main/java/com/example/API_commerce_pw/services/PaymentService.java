package com.example.API_commerce_pw.services;

import com.example.API_commerce_pw.entities.*;
import com.example.API_commerce_pw.repositories.*;
import com.example.API_commerce_pw.exceptions.AppError;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PaymentService {
    private final UserRepository users;
    private final ProductRepository products;
    private final PaymentRepository payments;
    private final CartRepository carts;

    public PaymentService(UserRepository u, ProductRepository pr, PaymentRepository p, CartRepository c) {
        this.users = u;
        this.products = pr;
        this.payments = p;
        this.carts = c;
    }

    @Transactional
    public Map<String, Object> create(Map<String, Object> in) {
        Object raw = in.get("product_ids");
        if (!(raw instanceof List<?> ids) || ids.isEmpty()) {
            throw new AppError("Dados ausentes ou invalidos. Os produtos sao obrigatorios.");
        }

        Integer uid;
        try {
            uid = Integer.valueOf(String.valueOf(in.get("user_id")));
        } catch (Exception e) {
            throw new AppError("Usuario nao encontrado.", 404);
        }

        User user = users.findById(uid).orElseThrow(() -> new AppError("Usuario nao encontrado.", 404));
        List<Integer> pids = ids.stream().map(x -> Integer.valueOf(String.valueOf(x))).toList();
        List<Product> fetchedProducts = products.findAllById(pids);

        if (fetchedProducts.isEmpty()) {
            throw new AppError("Nenhum produto encontrado com os IDs fornecidos.");
        }

        Map<Integer, Product> productMap = fetchedProducts.stream()
                .collect(Collectors.toMap(p -> p.id, p -> p, (a, b) -> a));

        List<Product> ps = pids.stream()
                .map(productMap::get)
                .filter(Objects::nonNull)
                .toList();

        BigDecimal total = ps.stream()
                .map(x -> x.preco)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (total.compareTo(BigDecimal.ONE) <= 0) {
            throw new AppError("O valor total do pagamento deve ser maior que R$ 1,00.");
        }

        String paymentMethodId = in.get("payment_method_id") != null
                ? String.valueOf(in.get("payment_method_id"))
                : "credit_card";
        boolean isPix = "pix".equalsIgnoreCase(paymentMethodId);

        String paymentId = String.valueOf(System.currentTimeMillis()) + (new Random().nextInt(900) + 100);

        // Transaction is created with PENDING status so the user can test confirming or cancelling in the simulated gateway
        String status = "PENDING";

        PaymentRecord record = new PaymentRecord();
        record.userId = uid;
        record.amount = total;
        record.currency = "BRL";
        record.status = status;
        record.provider = "simulated_gateway";
        record.providerPaymentId = paymentId;
        record.installments = in.get("installments") != null
                ? Integer.valueOf(String.valueOf(in.get("installments")))
                : 1;
        record.createdAt = LocalDateTime.now();
        record.updatedAt = LocalDateTime.now();

        List<Map<String, Object>> items = ps.stream().map(x -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", x.id);
            m.put("title", x.titulo);
            m.put("titulo", x.titulo);
            m.put("quantity", 1);
            m.put("unit_price", x.preco);
            m.put("price", x.preco);
            m.put("preco", x.preco);
            m.put("category_id", x.categoria);
            m.put("img", x.img);
            return m;
        }).toList();

        record.additionalInfo = Map.of("items", items);
        payments.save(record);

        // Remove purchased items from user's cart in PostgreSQL
        for (Integer pid : pids) {
            try {
                carts.deleteByUserIdAndProductId(uid, pid);
            } catch (Exception ignored) {
            }
        }

        Map<String, Object> paymentResponse = new LinkedHashMap<>();
        paymentResponse.put("id", paymentId);
        paymentResponse.put("provider_payment_id", paymentId);
        paymentResponse.put("transaction_id", paymentId);
        paymentResponse.put("status", status);
        paymentResponse.put("status_detail", "pending_confirmation");
        paymentResponse.put("transaction_amount", total);
        paymentResponse.put("total_amount", total);
        paymentResponse.put("payment_method_id", paymentMethodId);
        paymentResponse.put("payment_method", paymentMethodId);
        paymentResponse.put("currency", "BRL");
        paymentResponse.put("items", items);
        paymentResponse.put("additional_info", Map.of("items", items));
        paymentResponse.put("date_approved", null);
        paymentResponse.put("created_at", record.createdAt.toString());

        if (isPix) {
            Map<String, Object> txData = new LinkedHashMap<>();
            txData.put("qr_code",
                    "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-42661417400052040000530398654041.995802BR5925E-Commerce Gamer6009Campo Grande62070503***6304E2CA");
            txData.put("qr_code_base64", "");
            txData.put("ticket_url", "#");
            paymentResponse.put("point_of_interaction", Map.of("transaction_data", txData));
        }

        return paymentResponse;
    }

    @Transactional
    public void webhook(String id) {
        if (id == null || id.isBlank()) return;
        PaymentRecord p = findRecordByIdOrProviderId(id);
        if (p != null) {
            p.status = "APPROVED";
            p.updatedAt = LocalDateTime.now();
            payments.save(p);
        }
    }

    @Transactional
    public Map<String, Object> approve(String id) {
        PaymentRecord p = findRecordByIdOrProviderId(id);
        if (p == null) {
            throw new AppError("Pagamento nao encontrado.", 404);
        }

        String currentStatus = p.status != null ? p.status.toUpperCase() : "";
        if (!"CANCELLED".equals(currentStatus) && !"APPROVED".equals(currentStatus)) {
            p.status = "APPROVED";
            p.updatedAt = LocalDateTime.now();
            payments.save(p);
        }

        return formatRecord(p);
    }

    @Transactional
    public Map<String, Object> cancel(String id) {
        PaymentRecord p = findRecordByIdOrProviderId(id);
        if (p == null) {
            throw new AppError("Pagamento nao encontrado.", 404);
        }

        p.status = "CANCELLED";
        p.updatedAt = LocalDateTime.now();
        payments.save(p);

        return formatRecord(p);
    }

    @Transactional
    public Map<String, Object> updateStatus(String id, String newStatus) {
        PaymentRecord p = findRecordByIdOrProviderId(id);
        if (p == null) {
            throw new AppError("Pagamento nao encontrado.", 404);
        }

        p.status = (newStatus != null && !newStatus.isBlank()) ? newStatus.toUpperCase() : "PENDING";
        p.updatedAt = LocalDateTime.now();
        payments.save(p);

        return formatRecord(p);
    }

    public PaymentRecord findRecordByIdOrProviderId(String id) {
        if (id == null || id.isBlank() || "undefined".equalsIgnoreCase(id) || "null".equalsIgnoreCase(id)) {
            return null;
        }

        return payments.findByProviderPaymentId(id)
                .or(() -> {
                    try {
                        return payments.findById(Integer.valueOf(id));
                    } catch (NumberFormatException ignored) {
                        return Optional.empty();
                    }
                })
                .orElse(null);
    }

    public Map<String, Object> status(String id, Integer fallbackUserId) {
        PaymentRecord p = findRecordByIdOrProviderId(id);

        if (p == null && fallbackUserId != null) {
            List<PaymentRecord> userPayments = payments.findAllByUserIdOrderByCreatedAtDesc(fallbackUserId);
            if (!userPayments.isEmpty()) {
                p = userPayments.get(0);
            }
        }

        if (p == null) {
            throw new AppError("Pagamento nao encontrado.", 404);
        }

        return formatRecord(p);
    }

    public List<Map<String, Object>> userPayments(Integer userId) {
        if (userId == null) {
            return Collections.emptyList();
        }
        List<PaymentRecord> list = payments.findAllByUserIdOrderByCreatedAtDesc(userId);
        return list.stream().map(this::formatRecord).toList();
    }

    public Map<String, Object> formatRecord(PaymentRecord p) {
        Map<String, Object> out = new LinkedHashMap<>();
        String tid = p.providerPaymentId != null ? p.providerPaymentId : String.valueOf(p.id);
        out.put("id", tid);
        out.put("provider_payment_id", tid);
        out.put("providerPaymentId", tid);
        out.put("transaction_id", tid);
        out.put("record_id", p.id);
        out.put("user_id", p.userId);
        out.put("status", p.status != null ? p.status : "PENDING");
        out.put("status_detail", "accredited");
        out.put("amount", p.amount);
        out.put("total_amount", p.amount);
        out.put("transaction_amount", p.amount);
        out.put("currency", p.currency != null ? p.currency : "BRL");
        out.put("provider", p.provider != null ? p.provider : "simulated_gateway");
        out.put("payment_method", "credit_card");
        out.put("installments", p.installments != null ? p.installments : 1);
        out.put("additional_info", p.additionalInfo);
        out.put("additionalInfo", p.additionalInfo);

        List<?> items = Collections.emptyList();
        if (p.additionalInfo != null && p.additionalInfo.get("items") instanceof List<?> l) {
            items = l;
        }
        out.put("items", items);
        out.put("created_at", p.createdAt != null ? p.createdAt.toString() : null);
        out.put("date_approved", "APPROVED".equalsIgnoreCase(p.status) 
                ? (p.updatedAt != null ? p.updatedAt.toString() : LocalDateTime.now().toString()) 
                : null);

        return out;
    }
}
