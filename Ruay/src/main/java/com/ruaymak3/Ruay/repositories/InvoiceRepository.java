package com.ruaymak3.Ruay.repositories;

import com.ruaymak3.Ruay.models.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findById(Long id);

    @Query("SELECT i FROM Invoice i LEFT JOIN FETCH i.invoiceDetails WHERE i.id = :id")
    Optional<Invoice> findByIdWithDetails(@Param("id") Long id);


}
