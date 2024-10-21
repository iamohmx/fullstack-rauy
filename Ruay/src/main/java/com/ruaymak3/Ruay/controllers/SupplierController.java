package com.ruaymak3.Ruay.controllers;

import com.ruaymak3.Ruay.dto.SupplierDto;
import com.ruaymak3.Ruay.models.Supplier;
import com.ruaymak3.Ruay.services.SupplierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @PostMapping("/add")
    public ResponseEntity<?> addSupplier(@Valid @RequestBody Supplier supplier) {
        SupplierDto supplierDto = supplierService.addSupplier(supplier);
        return ResponseEntity.status(201).body(supplierDto);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllSuppliers() {
        return ResponseEntity.status(200).body(supplierService.getAllSuppliers());
    }

    @GetMapping("/getSupplier/{id}")
    public ResponseEntity<?> getSupplier(@PathVariable Long id) {
        Optional<SupplierDto> supplierOpt = supplierService.getSupplier(id);

        if (supplierOpt.isPresent()) {
            return ResponseEntity.status(200).body(supplierOpt.get());
        } else {
            return ResponseEntity.status(404).body("Supplier not found with ID: " + id);
        }
    }

    @PutMapping("/updateSupplier/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @Valid @RequestBody Supplier supplier) {
        Optional<SupplierDto> supplierOptional = supplierService.updateSupplier(id, supplier);
        if (supplierOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Supplier not found");
        }
        return ResponseEntity.ok(supplierService.updateSupplier(id, supplier));
    }

    @DeleteMapping("/deleteSupplier/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.status(204).body("Supplier deleted successfully");
    }
}
