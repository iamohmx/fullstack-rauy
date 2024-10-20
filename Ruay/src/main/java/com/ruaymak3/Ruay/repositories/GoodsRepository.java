package com.ruaymak3.Ruay.repositories;

import com.ruaymak3.Ruay.models.Goods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsRepository extends JpaRepository<Goods, Long> {
    public List<Goods> findAll();
}
