package com.ruaymak3.Ruay.repositories;

import com.ruaymak3.Ruay.models.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findById(Long id);

    @Query("SELECT i FROM Invoice i LEFT JOIN FETCH i.invoiceDetails WHERE i.id = :id")
    Optional<Invoice> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT i.date AS date, SUM(i.total) AS total FROM Invoice i WHERE i.date BETWEEN :startDate AND :endDate GROUP BY i.date")
    List<Object[]> getInvoice(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT i.date AS date, SUM(i.total) AS total FROM Invoice i GROUP BY i.date")
    List<Object[]> getAllSales();

}
