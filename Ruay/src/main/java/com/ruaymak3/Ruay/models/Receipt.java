package com.ruaymak3.Ruay.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "receipt")
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date date;

    @Column(nullable = false)
    private String cust;

    @Column(nullable = false)
    private Integer total;

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReceiptDetail> receiptDetails = new ArrayList<>();

    // Getter and Setters
}

