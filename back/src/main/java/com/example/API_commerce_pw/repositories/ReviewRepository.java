package com.example.API_commerce_pw.repositories;

import com.example.API_commerce_pw.entities.ProductReview;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface ReviewRepository extends JpaRepository<ProductReview, Integer> {
    List<ProductReview> findAllByProductIdOrderByCreatedAtDesc(Integer productId);

    boolean existsByUserIdAndProductId(Integer userId, Integer productId);

    @Query(value = "select exists(select 1 from payments p cross join lateral jsonb_array_elements(coalesce(p.additional_info->'items','[]'::jsonb)) item where p.user_id=:uid and p.status='approved' and item->>'id'=cast(:pid as text))", nativeQuery = true)
    boolean hasApprovedProductPayment(@Param("uid") Integer userId, @Param("pid") Integer productId);

    @Query(value = "select coalesce(avg(nota),0) from product_reviews", nativeQuery = true)
    Double average();

    @Query(value = "select count(*) from product_reviews", nativeQuery = true)
    long total();
}
