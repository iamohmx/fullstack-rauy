package com.ruaymak3.Ruay.services;

import com.ruaymak3.Ruay.dto.CategoryDto;
import com.ruaymak3.Ruay.models.Category;
import com.ruaymak3.Ruay.repositories.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public CategoryDto addCategory(Category category, String name) {

        Category savedCategory = categoryRepository.save(category);

        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setName(savedCategory.getName());

        return categoryDto;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> updateCategory(Long id, Category category) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        if (categoryOptional.isEmpty()) {
            return categoryOptional;
        }
        if (category.getName() != null){
            categoryOptional.get().setName(category.getName());
        }
        return Optional.of(categoryRepository.save(categoryOptional.get()));
    }

    public Object deleteCategory(Long id) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        if (categoryOptional.isEmpty()) {
            return "Category not found";
        }
        categoryRepository.deleteById(id);

        return "Category deleted";
    }
}
