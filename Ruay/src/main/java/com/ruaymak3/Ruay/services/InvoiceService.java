package com.ruaymak3.Ruay.services;

import com.ruaymak3.Ruay.dto.InvoiceDetailDto;
import com.ruaymak3.Ruay.dto.InvoiceDto;
import com.ruaymak3.Ruay.models.Goods;
import com.ruaymak3.Ruay.models.Invoice;
import com.ruaymak3.Ruay.models.InvoiceDetail;
import com.ruaymak3.Ruay.models.InvoiceStatus;
import com.ruaymak3.Ruay.repositories.GoodsRepository;
import com.ruaymak3.Ruay.repositories.InvoiceDetailRepository;
import com.ruaymak3.Ruay.repositories.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceDetailRepository invoiceDetailsRepository;

    @Autowired
    private GoodsRepository goodsRepository; // เพิ่ม GoodsRepository เพื่ออัปเดตจำนวนสินค้า

    public InvoiceDto createInvoice(InvoiceDto invoiceDto) {
        // สร้าง Invoice ใหม่
        Invoice invoice = new Invoice();
        invoice.setSupId(invoiceDto.getSupId());
        invoice.setDate(new Date());
        invoice.setStatus(InvoiceStatus.ORDERED);
        invoice.setTotal(invoiceDto.getTotal());

        // บันทึก Invoice ก่อน
        invoice = invoiceRepository.save(invoice);

        List<InvoiceDetail> invoiceDetailsList = new ArrayList<>();
        for (InvoiceDetailDto detailsDto : invoiceDto.getInvoiceDetails()) {
            InvoiceDetail invoiceDetail = new InvoiceDetail();
            invoiceDetail.setInvoice(invoice);  // เชื่อมโยง Invoice

            // ค้นหาสินค้า (Goods) ตาม goodId
            Goods goods = goodsRepository.findById(detailsDto.getGoodId())
                    .orElseThrow(() -> new RuntimeException("Goods not found with id: " + detailsDto.getGoodId()));

            invoiceDetail.setGoods(goods);  // ตั้งค่า Goods ใน InvoiceDetail
            invoiceDetail.setQuantity(detailsDto.getQuantity());
            invoiceDetail.setAmount(detailsDto.getAmount());
            invoiceDetail.setStatus(InvoiceStatus.ORDERED);

            invoiceDetailsList.add(invoiceDetail);
        }

        // บันทึก InvoiceDetails ทั้งหมด
        invoiceDetailsRepository.saveAll(invoiceDetailsList);

        return convertToDto(invoice);
    }



//    public InvoiceDto receiveGoods(Long invoiceId) {
//        // ค้นหาและอัปเดต Invoice ตามที่เคยเขียน...
//        Invoice invoice = invoiceRepository.findById(invoiceId)
//                .orElseThrow(() -> new RuntimeException("Invoice not found with id " + invoiceId));
//
//        // ตรวจรับสินค้า และอัปเดตสถานะของสินค้าทั้งหมดใน InvoiceDetails
//        for (InvoiceDetail details : invoice.getInvoiceDetails()) {
//            details.setStatus(InvoiceStatus.RECEIVED); // เปลี่ยนสถานะเป็นตรวจรับแล้ว
//            invoiceDetailsRepository.save(details);
//
//            // เพิ่มสินค้าเข้าสู่สต็อก
//            stockService.addStock(details.getGoodId(), details.getQuantity());
//        }
//
//        // อัปเดตสถานะของ Invoice เป็น 1 (ตรวจรับแล้ว)
//        invoice.setStatus(InvoiceStatus.RECEIVED);
//        invoiceRepository.save(invoice);
//
//        // กลับไปยัง InvoiceDto ที่อัปเดตแล้ว
//        return convertToDto(invoice);
//    }

    // เมธอด convertToDto สำหรับ Invoice
    public InvoiceDto convertToDto(Invoice invoice) {
        InvoiceDto dto = new InvoiceDto();
        dto.setId(invoice.getId());
        dto.setSupId(invoice.getSupId());
        dto.setDate(invoice.getDate().toString());
        dto.setTotal(invoice.getTotal());

        // แปลง Enum Status เป็น String
        if (invoice.getStatus() != null) {
            dto.setStatus(InvoiceStatus.valueOf(invoice.getStatus().name()));
        }

        // แปลง InvoiceDetails เป็น DTO ถ้ามีข้อมูล
        if (invoice.getInvoiceDetails() != null && !invoice.getInvoiceDetails().isEmpty()) {
            List<InvoiceDetailDto> detailsDtoList = invoice.getInvoiceDetails().stream()
                    .map(this::convertDetailsToDto)
                    .collect(Collectors.toList());
            dto.setInvoiceDetails(detailsDtoList);
        } else {
            dto.setInvoiceDetails(new ArrayList<>());  // ส่งรายการว่างถ้าไม่มีข้อมูล
        }

        return dto;
    }


    public InvoiceDetailDto convertDetailsToDto(InvoiceDetail details) {
        InvoiceDetailDto dto = new InvoiceDetailDto();

        // กำหนดค่าจาก InvoiceDetail ไปยัง InvoiceDetailDto
        dto.setId(details.getId());

        // ดึง goodId จาก Goods ผ่านความสัมพันธ์ ManyToOne
        dto.setGoodId(details.getGoods().getGoodId()); // ใช้ getGoods().getId() แทน

        dto.setQuantity(details.getQuantity());
        dto.setAmount(details.getAmount());

        // แปลง Enum status เป็น Integer หรือ String
        dto.setStatus(details.getStatus().ordinal());  // ใช้ ordinal() ถ้าต้องการ Integer
        // dto.setStatus(details.getStatus().name()); // ใช้ name() ถ้าต้องการ String

        return dto;
    }



//    private Integer calculateTotal(List<InvoiceDetail> invoiceDetailsList) {
//        // คำนวณยอดรวมจากรายการสินค้าใน InvoiceDetails
//        return invoiceDetailsList.stream()
//                .mapToInt(detail -> detail.getQuantity() * detail.getAmount().intValue())
//                .sum();
//    }

//    public InvoiceDto getInvoice(Long id) {
//        Invoice invoice = invoiceRepository.findByIdWithDetails(id)
//                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
//
//        return convertToDto(invoice);  // แปลง Invoice พร้อม InvoiceDetail เป็น DTO
//    }

    public void checkAndUpdateInvoiceStatus(Invoice invoice) {
        boolean allReceived = invoice.getInvoiceDetails().stream()
                .allMatch(detail -> detail.getStatus() == InvoiceStatus.RECEIVED);

        // ถ้าสินค้าทุกชิ้นใน Invoice ถูกตรวจรับแล้ว เปลี่ยนสถานะของ Invoice เป็น RECEIVED
        if (allReceived) {
            invoice.setStatus(InvoiceStatus.RECEIVED);
            invoiceRepository.save(invoice);
        }
    }


    public List<Object[]> getInvoiceReport(java.sql.Date date, java.sql.Date date1) {
        return invoiceRepository.getInvoice(date, date1);
    }

    public List<Object[]> getAllInvoiceReport() {
        return invoiceRepository.getAllSales();
    }
}

