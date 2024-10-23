package com.ruaymak3.Ruay.dto;

import lombok.Data;

@Data
public class InvoiceDetailDto {
    private Long id;            // รหัสรายละเอียดสินค้า
    private Long goodId;      // รหัสสินค้า
    private Integer quantity;    // จำนวนสินค้า
    private Double amount;       // ราคาสินค้าต่อชิ้น
    private Integer status;
    // Getters and Setters
}
