package com.example.API_commerce_pw.controllers;
import org.springframework.http.MediaType;

import com.example.API_commerce_pw.config.FirebasePrincipal;
import com.example.API_commerce_pw.entities.User;
import com.example.API_commerce_pw.services.CommerceService;
import com.example.API_commerce_pw.repositories.PaymentRepository;
import com.example.API_commerce_pw.exceptions.AppError;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping(value="/api/user/payments", produces=MediaType.APPLICATION_JSON_VALUE)
public class PaymentHistoryController {
    private final CommerceService service;
    private final PaymentRepository payments;
    public PaymentHistoryController(CommerceService service,PaymentRepository payments){this.service=service;this.payments=payments;}
    @GetMapping Object list(@RequestParam int id){return service.paymentHistory(id);}
    @DeleteMapping("/{id}") Object delete(@PathVariable int id,@AuthenticationPrincipal FirebasePrincipal principal){
        User user=principal==null?null:service.findByFirebaseIdentity(principal.uid(),principal.email());
        if(user==null||payments.deleteOwned(user.id,id)==0)throw new AppError("Compra nao encontrada.",404);
        return Map.of("message","Compra cancelada com sucesso.");
    }
}
