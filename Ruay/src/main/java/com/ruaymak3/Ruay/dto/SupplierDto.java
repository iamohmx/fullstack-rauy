package com.ruaymak3.Ruay.dto;

import lombok.Data;

@Data
public class SupplierDto {
    private Long id;
    private String name;
    private String address;
    private String phone;
    private String email;

    // private List<SupplierGoodDto> supplierGoods;
}
