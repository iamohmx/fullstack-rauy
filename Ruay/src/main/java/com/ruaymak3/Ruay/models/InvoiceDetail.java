package com.ruaymak3.Ruay.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "invoice_detail")
public class InvoiceDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "good_id")
    private Long goodId;

    private Integer quantity;
    private Double amount;

    @Enumerated(EnumType.ORDINAL)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    // Getters and setters
}