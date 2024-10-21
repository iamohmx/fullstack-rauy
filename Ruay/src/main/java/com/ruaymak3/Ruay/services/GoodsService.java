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

    public Optional<Goods> updateGoods(Long id, Goods goods) {
        Optional<Goods> goodsOptional = goodsRepository.findById(id);
        if (goodsOptional.isEmpty()) {
            return goodsOptional;
        }
        if (goods.getName() != null){
            goodsOptional.get().setName(goods.getName());
        }
        if (goods.getImage() != null){
            goodsOptional.get().setImage(goods.getImage());
        }
        if (goods.getPrice() != 0){
            goodsOptional.get().setPrice(goods.getPrice());
        }
        if (goods.getQuantity() != 0){
            goodsOptional.get().setQuantity(goods.getQuantity());
        }
        if (goods.getCategory() != null){
            goodsOptional.get().setCategory(goods.getCategory());
        }

        return Optional.of(goodsRepository.save(goodsOptional.get()));
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
}
