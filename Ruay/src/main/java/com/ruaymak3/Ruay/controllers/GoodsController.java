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
@CrossOrigin(origins = "http://localhost:5173") // อนุญาตให้ CORS จาก origin นี้เท่านั้น
public class GoodsController {

    @Autowired
    private GoodsService goodsService;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/getAllGoods")
    public ResponseEntity<?> getAllGoods() {
        return ResponseEntity.ok(goodsService.getAllGoods());
    }

    @GetMapping("/getGoods/{id}")
    public ResponseEntity<?> getGoods(@PathVariable Long id) {
        Optional<GoodsDto> goodsOptional = goodsService.getGoods(id);
        if (goodsOptional.isPresent()) {
            return ResponseEntity.status(200).body(goodsOptional.get());
        }
            return ResponseEntity.status(404).body("Goods not found");
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
    public ResponseEntity<?> updateGoods(@PathVariable Long id, @Valid @RequestBody GoodsDto goodsDto) {
        Optional<Goods> goodsOptional = goodsService.getGoodsEntityById(id);
        if (goodsOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Goods not found");
        }

        Goods existingGoods = goodsOptional.get();
        existingGoods.setName(goodsDto.getName());
        existingGoods.setImage(goodsDto.getImage());
        existingGoods.setPrice(goodsDto.getPrice());
        existingGoods.setQuantity(goodsDto.getQuantity());

        // ตรวจสอบว่า categoryId ถูกส่งมาและไม่เป็น null
        if (goodsDto.getCategory() != null && goodsDto.getCategory().getId() != null) {
            Category category = categoryRepository.findById(goodsDto.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existingGoods.setCategory(category);
        }

        goodsService.save(existingGoods);

        return ResponseEntity.ok(goodsService.convertToDto(existingGoods));
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
