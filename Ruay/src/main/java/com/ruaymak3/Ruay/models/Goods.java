package com.ruaymak3.Ruay.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
@Entity
@Table(name = "good")
public class Goods {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "good_id") // This is the primary key
    private Long goodId;

    @NotNull(message = "Product name is required")
    @Column(name = "good_name", nullable = false)
    private String name;

    @NotNull(message = "Goods image is required")
    @Column(nullable = false)
    @ColumnDefault("'https://dummyimage.com/400x400/4a4a4a/fff.png&text=Product'")
    private String image;

    @NotNull(message = "Goods price is required")
    @Column(nullable = false)
    private double price;

    @NotNull(message = "Goods quantity is required")
    @Column(nullable = false)
    @ColumnDefault("0")
    private int quantity;

    @OneToMany(mappedBy = "goods", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceDetail> invoiceDetails = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // Ensure Category entity is correctly defined
}
