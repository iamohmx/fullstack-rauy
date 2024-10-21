package com.ruaymak3.Ruay.services;

import com.ruaymak3.Ruay.dto.SupplierDto;
import com.ruaymak3.Ruay.models.Supplier;
import com.ruaymak3.Ruay.repositories.SupplierRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {
    @Autowired
    private SupplierRepository supplierRepository;

    public SupplierDto addSupplier(Supplier supplier) {
        Supplier savedSupplier = supplierRepository.save(supplier);

        SupplierDto supplierDto = new SupplierDto();
        supplierDto.setId(savedSupplier.getId());
        supplierDto.setName(savedSupplier.getName());
        supplierDto.setAddress(savedSupplier.getAddress());
        supplierDto.setPhone(savedSupplier.getPhone());
        supplierDto.setEmail(savedSupplier.getEmail());

        // ไม่จำเป็นต้องโหลด supplierGoods ในกรณีนี้
        // supplierDto.setSupplierGoods(savedSupplier.getSupplierGoods());

        return supplierDto;
    }

    public List<SupplierDto> getAllSuppliers() {
        List<Supplier> suppliers = supplierRepository.findAll();

        return suppliers.stream()
                .map(supplier -> {
                    SupplierDto supplierDto = new SupplierDto();
                    supplierDto.setId(supplier.getId());
                    supplierDto.setName(supplier.getName());
                    supplierDto.setAddress(supplier.getAddress());
                    supplierDto.setPhone(supplier.getPhone());
                    supplierDto.setEmail(supplier.getEmail());

                    // ไม่จำเป็นต้องโหลด supplierGoods ที่นี่เพื่อป้องกันข้อมูลซ้ำซ้อน
                    // supplierDto.setSupplierGoods(supplier.getSupplierGoods());

                    return supplierDto;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    public Optional<SupplierDto> getSupplier(Long id) {
        Optional<Supplier> supplierOpt = supplierRepository.findById(id);

        return supplierOpt.map(supplier -> {
            SupplierDto supplierDto = new SupplierDto();
            supplierDto.setId(supplier.getId());
            supplierDto.setName(supplier.getName());
            supplierDto.setAddress(supplier.getAddress());
            supplierDto.setPhone(supplier.getPhone());
            supplierDto.setEmail(supplier.getEmail());

            // ไม่ต้องใส่ supplierGoods ลงใน DTO เพื่อป้องกันการแสดงข้อมูลซ้ำซ้อน
            // supplierDto.setSupplierGoods(supplier.getSupplierGoods());

            return supplierDto;
        });
    }

    public Optional<SupplierDto> updateSupplier(Long id, @Valid Supplier supplier) {
        Optional<Supplier> supplierOptional = supplierRepository.findById(id);

        if (supplierOptional.isEmpty()) {
            return Optional.empty();
        }

        Supplier updatedSupplier = supplierOptional.get();
        updatedSupplier.setName(supplier.getName());
        updatedSupplier.setAddress(supplier.getAddress());
        updatedSupplier.setPhone(supplier.getPhone());
        updatedSupplier.setEmail(supplier.getEmail());

        Supplier savedSupplier = supplierRepository.save(updatedSupplier);

        SupplierDto supplierDto = new SupplierDto();
        supplierDto.setId(savedSupplier.getId());
        supplierDto.setName(savedSupplier.getName());
        supplierDto.setAddress(savedSupplier.getAddress());
        supplierDto.setPhone(savedSupplier.getPhone());
        supplierDto.setEmail(savedSupplier.getEmail());

        // ไม่ต้องใส่ supplierGoods ลงใน DTO เพื่อป้องกันการแสดงข้อมูลซ้ำซ้อน
        // supplierDto.setSupplierGoods(savedSupplier.getSupplierGoods());

        return Optional.of(supplierDto);
    }

    public Boolean deleteSupplier(Long id) {
        Optional<Supplier> supplierOptional = supplierRepository.findById(id);

        if (supplierOptional.isEmpty()) {
            return false;
        }

        supplierRepository.deleteById(id);
        return true;
    }
}
