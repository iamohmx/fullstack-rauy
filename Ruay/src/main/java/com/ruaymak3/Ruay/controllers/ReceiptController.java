package com.ruaymak3.Ruay.controllers;

import com.ruaymak3.Ruay.dto.ReceiptDto;
import com.ruaymak3.Ruay.services.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sales")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @PostMapping("/create")
    public ResponseEntity<ReceiptDto> createReceipt(@RequestBody ReceiptDto receiptDto) {
        ReceiptDto savedReceipt = receiptService.createReceipt(receiptDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReceipt);
    }

    @GetMapping("/getReceipt/{id}")
    public ResponseEntity<ReceiptDto> getReceipt(@PathVariable Long id) {
        ReceiptDto receiptDto = receiptService.getReceipt(id);
        return ResponseEntity.ok(receiptDto);
    }

    @GetMapping("/getAllReceipts")
    public ResponseEntity<?> getAllReceipts() {
        return ResponseEntity.ok(receiptService.getAllReceipts());
    }
}
