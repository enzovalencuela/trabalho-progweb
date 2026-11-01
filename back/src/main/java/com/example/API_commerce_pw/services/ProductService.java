package com.example.API_commerce_pw.services;

import com.example.API_commerce_pw.entities.Product;
import com.example.API_commerce_pw.exceptions.AppError;
import com.example.API_commerce_pw.repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> all() {
        return repo.findAll();
    }

    public List<Product> search(String query, String category) {
        return repo.search(query, category);
    }

    public Product get(int id) {
        return repo.findById(id).orElseThrow(() -> new AppError("Produto nao encontrado.", 404));
    }

    public Product save(Product product) {
        if (product.preco == null) {
            throw new AppError("O preco do produto e obrigatorio.");
        }
        if (product.maxParcelas == null)
            product.maxParcelas = 1;
        if (product.taxaParcela == null)
            product.taxaParcela = BigDecimal.ZERO;
        if (product.disponivel == null)
            product.disponivel = true;
        return repo.save(product);
    }

    public void delete(int id) {
        if (!repo.existsById(id))
            throw new AppError("Produto nao encontrado.", 404);
        repo.deleteById(id);
    }
}
