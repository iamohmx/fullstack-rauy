package com.ruaymak3.Ruay.controllers;

import com.ruaymak3.Ruay.dto.CategoryDto;
import com.ruaymak3.Ruay.models.Category;
import com.ruaymak3.Ruay.services.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping("/add")
    public ResponseEntity<?> addCategory(Authentication authentication, @Valid @RequestBody Category category) {
        CategoryDto categoryDto = categoryService.addCategory(category, authentication.getName());
        return ResponseEntity.status(201).body(categoryDto);
    }

    @GetMapping("/getAllCategories")
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

//    @GetMapping("/getCategory/{id}")

    @PutMapping("/updateCategory/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @Valid @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    @DeleteMapping("/deleteCategory/{id}")
    public ResponseEntity<?> deleteCategory( @PathVariable Long id) {
        return ResponseEntity.ok(categoryService.deleteCategory(id));
    }
}
