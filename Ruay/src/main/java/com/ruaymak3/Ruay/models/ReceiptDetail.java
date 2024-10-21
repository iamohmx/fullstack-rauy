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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rec_id", nullable = false)
    private Receipt receipt;

    @Column(name = "good_id", nullable = false)
    private Integer goodId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double amount;

    // Getter and Setters
}
