package com.ruaymak3.Ruay.controllers;


import com.ruaymak3.Ruay.dto.InvoiceDetailDto;
import com.ruaymak3.Ruay.dto.InvoiceDto;
import com.ruaymak3.Ruay.models.Invoice;
import com.ruaymak3.Ruay.models.InvoiceDetail;
import com.ruaymak3.Ruay.repositories.InvoiceRepository;
import com.ruaymak3.Ruay.services.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/procurement")
public class ProcurementController {
    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @PostMapping("/createInvoice")
    public ResponseEntity<?> createInvoice(@RequestBody InvoiceDto invoiceDto) {
        InvoiceDto createdInvoice = invoiceService.createInvoice(invoiceDto);
        return ResponseEntity.status(201).body(createdInvoice);
    }

    @GetMapping("/getInvoice/{id}")
    public ResponseEntity<?> getInvoice(@PathVariable Long id) {
        Invoice invoice = invoiceRepository.findByIdWithDetails(id).orElse(null);
        if (invoice == null) {
            return ResponseEntity.status(404).body("Invoice not found with ID: " + id);
        }
        return ResponseEntity.status(200).body(invoiceService.convertToDto(invoice));
    }




}
