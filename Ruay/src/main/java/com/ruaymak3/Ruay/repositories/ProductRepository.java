package com.ruaymak3.Ruay.repositories;

import com.ruaymak3.Ruay.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
