package com.ruaymak3.Ruay.dto;

import com.ruaymak3.Ruay.models.InvoiceStatus;
import lombok.Data;

import java.util.List;

@Data
public class InvoiceDto {
    private Long id;           // เพิ่มรหัสของ Invoice
    private Integer supId;      // รหัสผู้ขาย
    private String date;        // วันที่สั่งซื้อ
    private Integer total;      // ยอดรวม
    private InvoiceStatus status;     // สถานะของใบสั่งซื้อ (0: รอการตรวจรับ, 1: ตรวจรับแล้ว)
    private List<InvoiceDetailDto> invoiceDetails;

    // Getters and Setters
}