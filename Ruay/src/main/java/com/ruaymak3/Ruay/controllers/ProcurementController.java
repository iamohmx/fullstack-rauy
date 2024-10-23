package com.ruaymak3.Ruay.controllers;


import com.ruaymak3.Ruay.dto.InvoiceDto;
import com.ruaymak3.Ruay.models.Goods;
import com.ruaymak3.Ruay.models.Invoice;
import com.ruaymak3.Ruay.models.InvoiceDetail;
import com.ruaymak3.Ruay.models.InvoiceStatus;
import com.ruaymak3.Ruay.repositories.GoodsRepository;
import com.ruaymak3.Ruay.repositories.InvoiceDetailRepository;
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

    @Autowired
    private InvoiceDetailRepository invoiceDetailsRepository;

    @Autowired
    private GoodsRepository goodsRepository; // เพิ่มเข้ามา


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

    @GetMapping("/getAllInvoices")
    public ResponseEntity<?> getAllInvoices() {
        List<Invoice> invoices = invoiceRepository.findAll();
        List<InvoiceDto> invoiceDtos = invoices.stream()
                .map(invoiceService::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.status(200).body(invoiceDtos);
    }

    @PutMapping("/updateInvoiceStatus/{id}")
    public ResponseEntity<?> updateInvoiceStatus(@PathVariable Long id, @RequestParam Integer status) {
        Invoice invoice = invoiceRepository.findById(id).orElse(null);
        if (invoice == null) {
            return ResponseEntity.status(404).body("Invoice not found with ID: " + id);
        }

        if (status == 0) {
            invoice.setStatus(InvoiceStatus.ORDERED);  // สถานะ ORDERED
        } else if (status == 1) {
            invoice.setStatus(InvoiceStatus.RECEIVED);  // สถานะ RECEIVED

            // อัปเดตจำนวนสินค้าใน Goods
            for (InvoiceDetail detail : invoice.getInvoiceDetails()) {
                Goods goods = detail.getGoods();
                if (goods != null) {
                    int currentQuantity = goods.getQuantity();
                    int newQuantity = currentQuantity + detail.getQuantity(); // เพิ่มจำนวนสินค้าตามที่ใบแจ้งหนี้แสดง

                    goods.setQuantity(newQuantity); // อัปเดตจำนวนสินค้าใหม่
                    goodsRepository.save(goods); // บันทึกการเปลี่ยนแปลง
                } else {
                    return ResponseEntity.status(404).body("Goods not found for detail with ID: " + detail.getId());
                }
            }
        } else {
            return ResponseEntity.status(400).body("Invalid status value");
        }

        invoiceRepository.save(invoice);
        return ResponseEntity.status(200).body(invoiceService.convertToDto(invoice));
    }

    @PutMapping("/receiveGoods/{id}")
    public ResponseEntity<?> receiveGoods(@PathVariable Long id) {
        Invoice invoice = invoiceRepository.findById(id).orElse(null);
        if (invoice == null) {
            return ResponseEntity.status(404).body("Invoice not found with ID: " + id);
        }
        for (InvoiceDetail detail : invoice.getInvoiceDetails()) {
            Goods goods = detail.getGoods();
            if (goods != null) {
                int currentQuantity = goods.getQuantity();
                int newQuantity = currentQuantity + detail.getQuantity(); // เพิ่มจำนวนสินค้าตามที่ใบแจ้งหนี้แสดง

                goods.setQuantity(newQuantity); // อัปเดตจำนวนสินค้าใหม่
                goodsRepository.save(goods); // บันทึกการเปลี่ยนแปลง
            } else {
                return ResponseEntity.status(404).body("Goods not found for detail with ID: " + detail.getId());
            }
        }
//        for (InvoiceDetail details : invoice.getInvoiceDetails()) {
//            Goods goods = details.getGoods();
//
//            if (goods != null) {
//                int currentQuantity = goods.getQuantity();
//                int invoiceQuantity = details.getQuantity();
//
//                // ตรวจสอบถ้ามีจำนวนเพียงพอที่จะหักลบ
//                if (currentQuantity >= invoiceQuantity) {
//                    goods.setQuantity(currentQuantity - invoiceQuantity); // หักลบจำนวนสินค้า
//                    goodsRepository.save(goods); // บันทึกการเปลี่ยนแปลงใน Goods
//                } else {
//                    return ResponseEntity.status(400).body("Not enough stock for good: " + goods.getName());
//                }
//            } else {
//                return ResponseEntity.status(404).body("Goods not found for detail with ID: " + details.getId());
//            }
//
//            // เปลี่ยนสถานะของ InvoiceDetail เป็น RECEIVED
//            details.setStatus(InvoiceStatus.RECEIVED);
//        }

        // บันทึกสถานะใหม่ของสินค้าที่อยู่ใน InvoiceDetails
        invoiceDetailsRepository.saveAll(invoice.getInvoiceDetails());

        // เปลี่ยนสถานะของ Invoice เป็น RECEIVED
        invoice.setStatus(InvoiceStatus.RECEIVED);
        invoiceRepository.save(invoice);

        return ResponseEntity.status(200).body("Goods received successfully");
    }



    @PutMapping("/receiveGoods/{inv_id}/item/{detail_id}")
    public ResponseEntity<?> receiveGoodsItem(@PathVariable Long inv_id, @PathVariable Long detail_id) {
        // ค้นหา InvoiceDetail ตาม ID
        InvoiceDetail invoiceDetail = invoiceDetailsRepository.findById(detail_id).orElse(null);
        if (invoiceDetail == null) {
            return ResponseEntity.status(404).body("Invoice detail not found with ID: " + detail_id);
        }

        // ตรวจสอบว่า InvoiceDetail นั้นเป็นของ Invoice ที่ถูกต้อง
        if (!invoiceDetail.getInvoice().getId().equals(inv_id)) {
            return ResponseEntity.status(400).body("Invoice detail does not belong to the given invoice");
        }

        // เปลี่ยนสถานะสินค้าเป็น RECEIVED
        invoiceDetail.setStatus(InvoiceStatus.RECEIVED);

        // บันทึกการเปลี่ยนแปลง
        invoiceDetailsRepository.save(invoiceDetail);

        // ตรวจสอบสถานะของ Invoice
        invoiceService.checkAndUpdateInvoiceStatus(invoiceDetail.getInvoice());

        return ResponseEntity.status(200).body(invoiceService.convertToDto(invoiceDetail.getInvoice()));
    }




    @DeleteMapping("/deleteInvoice/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable Long id) {
        Invoice invoice = invoiceRepository.findById(id).orElse(null);
        if (invoice == null) {
            return ResponseEntity.status(404).body("Invoice not found with ID: " + id);
        }

        invoiceRepository.delete(invoice);
        return ResponseEntity.status(200).body(invoiceService.convertToDto(invoice));
    }



}
