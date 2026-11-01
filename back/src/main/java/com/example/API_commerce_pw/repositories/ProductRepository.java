package com.example.API_commerce_pw.repositories;

import com.example.API_commerce_pw.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Query(value = "select * from products p where p.disponivel=true and (:q is null or p.titulo ilike concat('%',:q,'%') or p.descricao ilike concat('%',:q,'%') or p.categoria ilike concat('%',:q,'%') or cast(p.tags as text) ilike concat('%',:q,'%')) and (:categoria is null or p.categoria=:categoria) order by p.id", nativeQuery = true)
    List<Product> search(@Param("q") String q, @Param("categoria") String categoria);
}
