package com.ruaymak3.Ruay.repositories;

import com.ruaymak3.Ruay.models.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetail, Long> {
    Optional<InvoiceDetail> findById(Long id);
}
