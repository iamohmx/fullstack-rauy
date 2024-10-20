package com.ruaymak3.Ruay.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "supplier_good")
public class SupplierGood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "good_id")
    private Long goodId;

    private Double price;

    @ManyToOne
    @JoinColumn(name = "sup_id", nullable = false)
    private Supplier supplier;

    // Getters and setters
}
