package com.ruaymak3.Ruay.repositories;

import com.ruaymak3.Ruay.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    public List<Category> findAll();
    public Optional<Category> findById(Long id);
//    public Category findByName(String name);

}
