package com.example.API_commerce_pw.services;

import com.example.API_commerce_pw.entities.*;
import com.example.API_commerce_pw.repositories.*;
import com.example.API_commerce_pw.exceptions.AppError;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestClient;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.math.BigDecimal;

@Service
public class MercadoPagoService {
    private final RestClient http = RestClient.create();
    private final UserRepository users;
    private final ProductRepository products;
    private final PaymentRepository payments;
    @Value("${mercadopago.access-token:}")
    String token;

    public MercadoPagoService(UserRepository u, ProductRepository pr, PaymentRepository p) {
        users = u;
        products = pr;
        payments = p;
    }

    private Map<String, Object> call(String method, String path, Object body) {
        if (token == null || token.isBlank())
            throw new AppError("Mercado Pago nao configurado.", 503);
        try {
            var req = http.method(org.springframework.http.HttpMethod.valueOf(method))
                    .uri("https://api.mercadopago.com" + path).header("Authorization", "Bearer " + token);
            return method.equals("GET") ? req.retrieve().body(Map.class) : req.body(body).retrieve().body(Map.class);
        } catch (Exception e) {
            throw new AppError("Falha na comunicacao com Mercado Pago.", 502);
        }
    }

    public Map<String, Object> create(Map<String, Object> in) {
        Object raw = in.get("product_ids");
        if (!(raw instanceof List<?> ids) || ids.isEmpty())
            throw new AppError("Dados ausentes ou invalidos. O email e obrigatorio.");
        Integer uid;
        try {
            uid = Integer.valueOf(String.valueOf(in.get("user_id")));
        } catch (Exception e) {
            throw new AppError("Usuario nao encontrado.", 404);
        }
        User user = users.findById(uid).orElseThrow(() -> new AppError("Usuario nao encontrado.", 404));
        List<Integer> pids = ids.stream().map(x -> Integer.valueOf(String.valueOf(x))).toList();
        List<Product> ps = products.findAllById(pids);
        if (ps.isEmpty())
            throw new AppError("Nenhum produto encontrado com os IDs fornecidos.");
        BigDecimal total = ps.stream().map(x -> x.preco).reduce(BigDecimal.ZERO, BigDecimal::add);
        if (total.compareTo(BigDecimal.ONE) <= 0)
            throw new AppError("O valor total do pagamento deve ser maior que R$ 1,00.");
        List<Map<String, Object>> items = ps.stream().map(x -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", x.id);
            m.put("title", x.titulo);
            m.put("description", x.descricao);
            m.put("category_id", x.categoria);
            m.put("quantity", 1);
            m.put("unit_price", x.preco);
            return m;
        }).toList();
        Map<String, Object> payer = new LinkedHashMap<>();
        payer.put("email", user.email);
        payer.put("first_name", user.name);
        if (user.cpf != null)
            payer.put("identification", Map.of("type", "CPF", "number", user.cpf));
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("transaction_amount", total);
        payload.put("payment_method_id", in.get("payment_method_id"));
        if (in.get("token") != null) {
            payload.put("token", in.get("token"));
            payload.put("installments", in.getOrDefault("installments", 1));
        }
        payload.put("description", "ECOMMERCEGM");
        payload.put("payer", payer);
        payload.put("metadata", Map.of("user_id", uid));
        payload.put("additional_info", Map.of("items", items, "payer", Map.of("first_name", user.name)));
        payload.put("external_reference", UUID.randomUUID().toString());
        return call("POST", "/v1/payments", payload);
    }

    @Transactional
    public void webhook(String id) {
        Map<String, Object> data = call("GET", "/v1/payments/" + id, null);
        Object meta = data.get("metadata");
        Integer uid = null;
        if (meta instanceof Map<?, ?> m && m.get("user_id") != null)
            uid = Integer.valueOf(String.valueOf(m.get("user_id")));
        PaymentRecord p = payments.findAll().stream().filter(x -> id.equals(x.providerPaymentId)).findFirst()
                .orElseGet(PaymentRecord::new);
        p.userId = uid;
        p.amount = new BigDecimal(String.valueOf(data.getOrDefault("transaction_amount", "0")));
        p.currency = String.valueOf(data.getOrDefault("currency_id", "BRL"));
        p.status = String.valueOf(data.getOrDefault("status", "pending"));
        p.provider = "mercadopago";
        p.providerPaymentId = id;
        p.installments = data.get("installments") == null ? null
                : Integer.valueOf(String.valueOf(data.get("installments")));
        p.additionalInfo = data.get("additional_info") instanceof Map<?, ?> m ? (Map<String, Object>) m : Map.of();
        payments.save(p);
    }

    public Map<String, Object> status(String id) {
        Map<String, Object> p = call("GET", "/v1/payments/" + id, null);
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", p.get("id"));
        out.put("status", p.get("status"));
        out.put("status_detail", p.get("status_detail"));
        out.put("total_amount", p.get("transaction_amount"));
        out.put("payment_type", p.get("payment_type_id"));
        out.put("payment_method", p.get("payment_method_id"));
        out.put("date_approved", p.get("date_approved"));
        out.put("installments", p.get("installments"));
        out.put("additional_info", p.get("additional_info"));
        Object type = p.get("payment_type_id");
        Object interaction = p.get("point_of_interaction");
        if ("pix".equals(type) && interaction instanceof Map<?, ?> pi) {
            Object transaction = pi.get("transaction_data");
            if (transaction instanceof Map<?, ?> td) {
                Map<String, Object> data = new LinkedHashMap<>();
                data.put("qr_code", td.get("qr_code"));
                data.put("qr_code_base64", td.get("qr_code_base64"));
                data.put("ticket_url", td.get("ticket_url"));
                out.put("point_of_interaction", Map.of("transaction_data", data));
            }
        }
        return out;
    }
}
