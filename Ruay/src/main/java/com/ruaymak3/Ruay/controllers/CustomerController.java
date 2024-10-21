package com.ruaymak3.Ruay.controllers;

import com.ruaymak3.Ruay.dto.CustomerDto;
import com.ruaymak3.Ruay.models.Customer;
import com.ruaymak3.Ruay.services.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @PostMapping("/add")
    public ResponseEntity<?> addCustomer(@Valid @RequestBody Customer customer) {
        CustomerDto customerDto = customerService.addCustomer(customer);

        return ResponseEntity.status(201).body(customerDto);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllCustomers() {
        return ResponseEntity.status(200).body(customerService.getAllCustomers());
    }

    @GetMapping("/getCustomer/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable Long id) {
        return customerService.getCustomer(id)
                .map(customerDto -> ResponseEntity.status(200).body(customerDto))
                .orElseGet(() -> ResponseEntity.status(404).body("Customer not found with ID: " + id));
    }

    @PutMapping("/updateCustomer/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @Valid @RequestBody Customer customer) {
        return customerService.updateCustomer(id, customer)
                .map(customerDto -> ResponseEntity.ok(customerDto))
                .orElseGet(() -> ResponseEntity.status(404).body("Customer not found"));
    }

    @DeleteMapping("/deleteCustomer/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.status(204).body("Customer deleted successfully");
    }
}
