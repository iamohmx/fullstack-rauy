package com.ruaymak3.Ruay.models;

import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;
    private String phone;

    @Column(name = "e_mail")
    private String email;

    // Getters and setters
}