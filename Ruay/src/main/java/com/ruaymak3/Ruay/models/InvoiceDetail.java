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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inv_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(optional = false) // สร้างความสัมพันธ์กับ Goods
    @JoinColumn(name = "good_id", referencedColumnName = "good_id", nullable = false)
    private Goods goods; // ใช้ Goods แทนการเก็บ goodId

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status;
}
