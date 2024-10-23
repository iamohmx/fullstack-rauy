package com.ruaymak3.Ruay.repositories;

import com.ruaymak3.Ruay.models.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    @Query("SELECT r.date AS date, SUM(r.total) AS total FROM Receipt r WHERE r.date BETWEEN :startDate AND :endDate GROUP BY r.date")
    List<Object[]> getSales(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT r.date AS date, SUM(r.total) AS total FROM Receipt r GROUP BY r.date")
    List<Object[]> getAllSales();

}
