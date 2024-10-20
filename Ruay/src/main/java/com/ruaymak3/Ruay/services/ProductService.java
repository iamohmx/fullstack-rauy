package com.ruaymak3.Ruay.services;

import com.ruaymak3.Ruay.dto.ProductDto;
import com.ruaymak3.Ruay.dto.CategoryDto;
import com.ruaymak3.Ruay.models.Goods;
import com.ruaymak3.Ruay.models.Category;
import com.ruaymak3.Ruay.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<ProductDto> getAllProducts() {
        List<Goods> products = productRepository.findAll();

        return products.stream()
                .map(product -> {
                    ProductDto productDto = new ProductDto();
                    productDto.setId(product.getGoodId());
                    productDto.setName(product.getName());
                    productDto.setImage(product.getImage());
                    productDto.setPrice(product.getPrice());
                    productDto.setQuantity(product.getQuantity());

                    // Map Category to CategoryDto
                    Category category = product.getCategory();
                    if (category != null) {
                        CategoryDto categoryDto = new CategoryDto();
                        categoryDto.setId(category.getId());
                        categoryDto.setName(category.getName());
                        productDto.setCategory(categoryDto);
                    }

                    return productDto;
                })
                .collect(Collectors.toList());
    }
}
