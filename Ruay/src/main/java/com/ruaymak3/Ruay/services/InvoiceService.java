package com.ruaymak3.Ruay.services;

import com.ruaymak3.Ruay.dto.InvoiceDetailDto;
import com.ruaymak3.Ruay.dto.InvoiceDto;
import com.ruaymak3.Ruay.models.Invoice;
import com.ruaymak3.Ruay.models.InvoiceDetail;
import com.ruaymak3.Ruay.models.InvoiceStatus;
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

//    @Autowired
//    private StockService stockService;

    public InvoiceDto createInvoice(InvoiceDto invoiceDto) {
        // สร้าง Invoice ใหม่
        Invoice invoice = new Invoice();
        invoice.setSupId(invoiceDto.getSupId());
        invoice.setDate(new Date());
        invoice.setStatus(InvoiceStatus.ORDERED);

        // รับค่า total จาก JSON และตั้งค่าให้กับ Invoice
        invoice.setTotal(invoiceDto.getTotal());  // รับค่า total จาก DTO โดยตรง

        // บันทึก Invoice ก่อน (รวม total ด้วย)
        invoice = invoiceRepository.save(invoice);

        // เพิ่มรายละเอียดสินค้าลงใน InvoiceDetails
        List<InvoiceDetail> invoiceDetailsList = new ArrayList<>();
        for (InvoiceDetailDto detailsDto : invoiceDto.getInvoiceDetails()) {
            InvoiceDetail invoiceDetail = new InvoiceDetail();
            invoiceDetail.setInvoice(invoice);  // เชื่อมโยง Invoice ที่ถูกบันทึกแล้วกับ InvoiceDetail
            invoiceDetail.setGoodId(detailsDto.getGoodId());
            invoiceDetail.setQuantity(detailsDto.getQuantity());
            invoiceDetail.setAmount(detailsDto.getAmount());
            invoiceDetail.setStatus(InvoiceStatus.ORDERED);  // สถานะว่ายังไม่ได้ตรวจรับ
            invoiceDetailsList.add(invoiceDetail);
        }

        // บันทึก InvoiceDetails หลังจากที่บันทึก Invoice แล้ว
        invoiceDetailsRepository.saveAll(invoiceDetailsList);

        // แปลง Invoice ที่บันทึกแล้วเป็น DTO และส่งคืนผลลัพธ์
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
        dto.setGoodId(details.getGoodId());
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

    public InvoiceDto getInvoice(Long id) {
        Invoice invoice = invoiceRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));

        return convertToDto(invoice);  // แปลง Invoice พร้อม InvoiceDetail เป็น DTO
    }





}

