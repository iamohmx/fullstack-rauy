package com.ruaymak3.Ruay.repositories;

import com.ruaymak3.Ruay.models.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
}
