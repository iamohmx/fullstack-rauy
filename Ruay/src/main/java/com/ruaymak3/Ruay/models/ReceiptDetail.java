package com.ruaymak3.Ruay.models;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "receipt_detail")
public class ReceiptDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "good_id")
    private Long goodId;

    private Integer quantity;
    private Double amount;

    @ManyToOne
    @JoinColumn(name = "receipt_id", nullable = false)
    private Receipt receipt;

    // Getters and setters
}
