package com.ruaymak3.Ruay.dto;

import com.ruaymak3.Ruay.models.Category;
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
