package com.ruaymak3.Ruay.controllers;

import com.ruaymak3.Ruay.dto.GoodsDto;
import com.ruaymak3.Ruay.models.Category;
import com.ruaymak3.Ruay.models.Goods;
import com.ruaymak3.Ruay.repositories.CategoryRepository;
import com.ruaymak3.Ruay.services.GoodsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/goods")
public class GoodsController {

    @Autowired
    private GoodsService goodsService;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/getAllGoods")
    public ResponseEntity<?> getAllGoods() {
        return ResponseEntity.ok(goodsService.getAllGoods());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addGoods(@Valid @RequestBody Goods goods) {
        // ตรวจสอบ Category ที่มาจาก Request
        if (goods.getCategory() == null || goods.getCategory().getId() == null) {
            return ResponseEntity.badRequest().body("Category is required");
        }

        // ค้นหา Category ที่มีอยู่ในระบบ
        Category category = categoryRepository.findById(goods.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // ตั้งค่า Category ให้กับ Goods
        goods.setCategory(category);

        // เพิ่มสินค้าใหม่
        GoodsDto goodsDto = goodsService.addGoods(goods);

        return ResponseEntity.status(201).body(goodsDto);
    }

    @PutMapping("/updateGoods/{id}")
    public ResponseEntity<?> updateGoods(@PathVariable Long id, @Valid @RequestBody Goods goods) {
        Optional<Goods> goodsOptional = goodsService.updateGoods(id, goods);
        if (goodsOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Goods not found");
        }
        return ResponseEntity.ok(goodsService.updateGoods(id, goods));
    }

    @DeleteMapping("/deleteGoods/{id}")
    public ResponseEntity<?> deleteGoods(@PathVariable Long id) {
        Boolean isDeleted = goodsService.deleteGoods(id);
        if (!isDeleted) {
            return ResponseEntity.status(404).body("Goods not found");
        }
        return ResponseEntity.status(204).body("Goods deleted");

    }

}
