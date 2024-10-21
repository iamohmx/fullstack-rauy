package com.ruaymak3.Ruay.dto;

import lombok.Data;

import java.util.List;

@Data
public class ReceiptDto {
    private Long id;
    private String date;
    private String cust;
    private double total;
    private List<ReceiptDetailDto> receiptDetails;

    // getters and setters
}
