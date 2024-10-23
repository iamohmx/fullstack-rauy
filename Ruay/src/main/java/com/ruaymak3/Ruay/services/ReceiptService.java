package com.ruaymak3.Ruay.services;


import com.ruaymak3.Ruay.dto.ReceiptDetailDto;
import com.ruaymak3.Ruay.dto.ReceiptDto;
import com.ruaymak3.Ruay.models.Receipt;
import com.ruaymak3.Ruay.models.Goods;

import com.ruaymak3.Ruay.models.ReceiptDetail;
import com.ruaymak3.Ruay.repositories.GoodsRepository;
import com.ruaymak3.Ruay.repositories.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private GoodsRepository goodsRepository; // เพิ่ม GoodsRepository เพื่ออัปเดตจำนวนสินค้า

    public ReceiptDto createReceipt(ReceiptDto receiptDto) {
        // สร้างใบเสร็จใหม่
        Receipt receipt = new Receipt();
        receipt.setDate(new Date());
        receipt.setCust(receiptDto.getCust());
        receipt.setTotal((int) receiptDto.getTotal());

        // บันทึกรายการสินค้าในใบเสร็จ
        for (ReceiptDetailDto detailDto : receiptDto.getReceiptDetails()) {
            ReceiptDetail detail = new ReceiptDetail();
            detail.setReceipt(receipt);

            // ค้นหาสินค้าตาม goodId และเชื่อมโยงกับ ReceiptDetail
            Goods goods = goodsRepository.findById(detailDto.getGoodId())
                    .orElseThrow(() -> new RuntimeException("Goods not found with id: " + detailDto.getGoodId()));

            detail.setGoods(goods);  // เชื่อมโยง Goods กับ ReceiptDetail
            detail.setQuantity(detailDto.getQuantity());
            detail.setAmount(detailDto.getAmount());

            receipt.getReceiptDetails().add(detail); // เพิ่มรายการสินค้าเข้าไปในใบเสร็จ

            // ตรวจสอบจำนวนสินค้าคงเหลือก่อนทำการตัด
            if (goods.getQuantity() < detail.getQuantity()) {
                throw new RuntimeException("Not enough goods in stock for GoodId: " + detailDto.getGoodId());
            }

            // ตัดจำนวนสินค้า
            goods.setQuantity(goods.getQuantity() - detail.getQuantity());
            goodsRepository.save(goods); // บันทึกการเปลี่ยนแปลง
        }

        // บันทึกใบเสร็จพร้อมรายละเอียดสินค้า
        receiptRepository.save(receipt);

        // แปลง Receipt ที่บันทึกแล้วเป็น DTO เพื่อส่งกลับ
        return convertToDto(receipt);
    }


    private ReceiptDto convertToDto(Receipt receipt) {
        // การแปลง Receipt เป็น DTO
        ReceiptDto dto = new ReceiptDto();
        dto.setId(receipt.getId());
        dto.setDate(receipt.getDate().toString());
        dto.setCust(receipt.getCust());
        dto.setTotal(receipt.getTotal());

        // แปลงรายละเอียดสินค้าทั้งหมดในใบเสร็จ
        List<ReceiptDetailDto> detailDtos = receipt.getReceiptDetails().stream()
                .map(detail -> {
                    ReceiptDetailDto detailDto = new ReceiptDetailDto();
                    detailDto.setGoodId(Long.valueOf(detail.getGoodId()));
                    detailDto.setQuantity(detail.getQuantity());
                    detailDto.setAmount(detail.getAmount());
                    return detailDto;
                })
                .collect(Collectors.toList());

        dto.setReceiptDetails(detailDtos);
        return dto;
    }

    public List<Object[]> getSalesReport(Date startDate, Date endDate) {
        return receiptRepository.getSales(startDate, endDate);
    }

    public List<Object[]> getAllSalesReport() {
        return receiptRepository.getAllSales();
    }
}

