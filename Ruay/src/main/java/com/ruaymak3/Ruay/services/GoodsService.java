package com.ruaymak3.Ruay.services;

import com.ruaymak3.Ruay.dto.GoodsDto;
import com.ruaymak3.Ruay.dto.CategoryDto;
import com.ruaymak3.Ruay.models.Goods;
import com.ruaymak3.Ruay.models.Category;
import com.ruaymak3.Ruay.repositories.CategoryRepository;
import com.ruaymak3.Ruay.repositories.GoodsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GoodsService {
    @Autowired
    private GoodsRepository goodsRepository;

    @Autowired
    CategoryRepository  categoryRepository;

    public List<GoodsDto> getAllGoods() {
        List<Goods> products = goodsRepository.findAll();

        return products.stream()
                .map(product -> {
                    GoodsDto GoodsDto = new GoodsDto();
                    GoodsDto.setId(product.getGoodId());
                    GoodsDto.setName(product.getName());
                    GoodsDto.setImage(product.getImage());
                    GoodsDto.setPrice(product.getPrice());
                    GoodsDto.setQuantity(product.getQuantity());

                    // Map Category to CategoryDto
                    Category category = product.getCategory();
                    if (category != null) {
                        CategoryDto categoryDto = new CategoryDto();
                        categoryDto.setId(category.getId());
                        categoryDto.setName(category.getName());
                        GoodsDto.setCategory(categoryDto);
                    }

                    return GoodsDto;
                })
                .collect(Collectors.toList());
    }

    public GoodsDto addGoods(Goods goods) {
        Goods savedGoods = goodsRepository.save(goods);

        GoodsDto goodsDto = new GoodsDto();
        goodsDto.setId(savedGoods.getGoodId());
        goodsDto.setName(savedGoods.getName());
        goodsDto.setImage(savedGoods.getImage());
        goodsDto.setPrice(savedGoods.getPrice());
        goodsDto.setQuantity(savedGoods.getQuantity());
//        goodsDto.setCategory(savedGoods.getCategory());

        // Map Category to CategoryDto
        Category category = savedGoods.getCategory();
        if (category != null) {
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setId(category.getId());
            categoryDto.setName(category.getName());
            goodsDto.setCategory(categoryDto);
        }

        return goodsDto;
    }

    public Optional<Goods> updateGoods(Long id, GoodsDto goodsDto) {
        Optional<Goods> goodsOptional = goodsRepository.findById(id);
        if (goodsOptional.isPresent()) {
            Goods existingGoods = goodsOptional.get();
            existingGoods.setName(goodsDto.getName());
            existingGoods.setPrice(goodsDto.getPrice());
            existingGoods.setQuantity(goodsDto.getQuantity());

            // อัปเดตหมวดหมู่หากส่งมา
            if (goodsDto.getCategory().getId() != null) {
                Category category = categoryRepository.findById(goodsDto.getCategory().getId())
                        .orElseThrow(() -> new RuntimeException("Category not found"));
                existingGoods.setCategory(category);
            }

            goodsRepository.save(existingGoods);
            return Optional.of(existingGoods);
        }
        return Optional.empty();
    }


    public Boolean deleteGoods(Long id) {
        Optional<Goods> goodsOptional = goodsRepository.findById(id);
        if (goodsOptional.isEmpty()) {
            return false;
        }
        goodsRepository.deleteById(id);

        return true;
    }

    public Optional<GoodsDto> getGoods(Long id) {
        Optional<Goods> goodsOptional = goodsRepository.findById(id);
        if (goodsOptional.isEmpty()) {
            return Optional.empty();
        }

        Goods goods = goodsOptional.get();
        GoodsDto goodsDto = new GoodsDto();
        goodsDto.setId(goods.getGoodId());
        goodsDto.setName(goods.getName());
        goodsDto.setImage(goods.getImage());
        goodsDto.setPrice(goods.getPrice());
        goodsDto.setQuantity(goods.getQuantity());

        // Map Category to CategoryDto
        Category category = goods.getCategory();
        if (category != null) {
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setId(category.getId());
            categoryDto.setName(category.getName());
            goodsDto.setCategory(categoryDto);
        }

        return Optional.of(goodsDto);
    }

    public Optional<Goods> getGoodsEntityById(Long id) {
        return goodsRepository.findById(id);
    }

    public Goods save(Goods goods) {
        return goodsRepository.save(goods);
    }

    // Method to convert Goods entity to GoodsDto
    public GoodsDto convertToDto(Goods goods) {
        GoodsDto goodsDto = new GoodsDto();
        goodsDto.setId(goods.getGoodId());
        goodsDto.setName(goods.getName());
        goodsDto.setImage(goods.getImage());
        goodsDto.setPrice(goods.getPrice());
        goodsDto.setQuantity(goods.getQuantity());

        // ตรวจสอบว่ามี category และแปลง category เป็น DTO ด้วย
        if (goods.getCategory() != null) {
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setId(goods.getCategory().getId());
            categoryDto.setName(goods.getCategory().getName());
            goodsDto.setCategory(categoryDto);
        }

        return goodsDto;
    }

    public int getTotalStock() {
        // Assuming Goods entity has a 'quantity' field
        return goodsRepository.findAll().stream()
                .mapToInt(Goods::getQuantity)
                .sum();
    }
}
