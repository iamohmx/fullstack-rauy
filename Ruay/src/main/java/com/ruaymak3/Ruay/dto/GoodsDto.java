package com.ruaymak3.Ruay.dto;

import lombok.Data;

@Data
public class GoodsDto {
    private Long id;
    private String name;
    private String image;
    private double price;
    private int quantity;
    private CategoryDto category;
}
