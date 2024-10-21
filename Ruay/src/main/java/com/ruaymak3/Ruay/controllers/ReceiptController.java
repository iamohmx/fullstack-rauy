package com.ruaymak3.Ruay.controllers;

import com.ruaymak3.Ruay.dto.ReceiptDto;
import com.ruaymak3.Ruay.services.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
