package com.example.API_commerce_pw.controllers;

import com.example.API_commerce_pw.entities.Product;
import com.example.API_commerce_pw.services.ProductService;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import org.springframework.http.MediaType;

@RestController
@RequestMapping(value = "/api/products", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProductController {
    private final ProductService s;

    public ProductController(ProductService s) {
        this.s = s;
    }

    @PostMapping("/add")
    @ResponseStatus(org.springframework.http.HttpStatus.CREATED)
    Product add(@RequestBody Product p) {
        return s.save(p);
    }

    @GetMapping
    List<Product> all() {
        return s.all();
    }

    @GetMapping("/search")
    List<Product> search(@RequestParam(required = false) String q,
            @RequestParam(required = false, name = "categoria") String c) {
        return s.search(q, c);
    }

    @GetMapping("/{id}")
    Product get(@PathVariable int id) {
        return s.get(id);
    }

    @PutMapping("/{id}")
    Product update(@PathVariable int id, @RequestBody Product p) {
        p.id = id;
        return s.save(p);
    }

    @DeleteMapping("/{id}")
    Map<String, String> delete(@PathVariable int id) {
        s.delete(id);
        return Map.of("message", "Produto removido com sucesso.");
    }
}
