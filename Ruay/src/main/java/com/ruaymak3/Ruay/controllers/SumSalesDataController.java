package com.ruaymak3.Ruay.controllers;

import com.ruaymak3.Ruay.repositories.UserRepository;
import com.ruaymak3.Ruay.services.InvoiceService;
import com.ruaymak3.Ruay.services.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/sum")
public class SumSalesDataController {

    @Autowired
    private ReceiptService receiptService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private UserRepository userRepository;


    @GetMapping("/sales")
    public ResponseEntity<List<Object[]>> getSalesReport(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<Object[]> salesReport = receiptService.getSalesReport(Date.valueOf(startDate), Date.valueOf(endDate));
        return ResponseEntity.ok(salesReport);
    }

    @GetMapping("/sales/all")
    public ResponseEntity<List<Object[]>> getAllSalesReport() {
        List<Object[]> salesReport = receiptService.getAllSalesReport();
        return ResponseEntity.ok(salesReport);
    }


    @GetMapping("/invoice")
    public ResponseEntity<List<Object[]>> getInvoiceReport(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<Object[]> invoiceReport = invoiceService.getInvoiceReport(Date.valueOf(startDate), Date.valueOf(endDate));
        return ResponseEntity.ok(invoiceReport);
    }

    @GetMapping("/invoice/all")
    public ResponseEntity<List<Object[]>> getAllInvoiceReport() {
        List<Object[]> invoiceReport = invoiceService.getAllInvoiceReport();
        return ResponseEntity.ok(invoiceReport);
    }
}
