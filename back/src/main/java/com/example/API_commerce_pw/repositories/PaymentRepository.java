package com.example.API_commerce_pw.repositories;

import com.example.API_commerce_pw.entities.PaymentRecord;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
import java.math.BigDecimal;

public interface PaymentRepository extends JpaRepository<PaymentRecord, Integer> {
    List<PaymentRecord> findAllByUserIdOrderByCreatedAtDesc(Integer userId);

    long countByStatus(String status);

    @Query(value = "select coalesce(sum(amount),0) from payments where status=:status", nativeQuery = true)
    BigDecimal sumAmount(@Param("status") String status);

    @Modifying
    @Query("delete from PaymentRecord p where p.userId=:uid and p.id=:id")
    int deleteOwned(@Param("uid") Integer uid, @Param("id") Integer id);

    @Query(value = "select date_trunc('week',created_at) as week,count(*) as total from payments where status='approved' group by week order by week asc", nativeQuery = true)
    List<Object[]> weekly();

    @Query(value = "select item->>'title' as product,sum((item->>'quantity')::int) as total from payments,lateral jsonb_array_elements(coalesce(additional_info->'items','[]'::jsonb)) item where status='approved' group by product order by total desc limit 10", nativeQuery = true)
    List<Object[]> topProducts();

    @Query(value = "select item->>'category_id' as category,sum((item->>'quantity')::int) as total from payments,lateral jsonb_array_elements(coalesce(additional_info->'items','[]'::jsonb)) item where status='approved' group by category order by total desc", nativeQuery = true)
    List<Object[]> categories();
}
