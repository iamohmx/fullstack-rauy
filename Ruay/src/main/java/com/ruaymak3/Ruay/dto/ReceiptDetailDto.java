package com.ruaymak3.Ruay.dto;

import lombok.Data;

@Data
public class ReceiptDetailDto {
    private Long goodId;
    private int quantity;
    private double amount;

    // getters and setters
}
