package com.ruaymak3.Ruay.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Category name is required")
    @Column(nullable = false, unique = true)
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Goods> products = new ArrayList<>();

    // Helper method to add product
    public void addProduct(Goods product) {
        products.add(product);
        product.setCategory(this);
    }

    // Helper method to remove product
    public void removeProduct(Goods product) {
        products.remove(product);
        product.setCategory(null);
    }
}