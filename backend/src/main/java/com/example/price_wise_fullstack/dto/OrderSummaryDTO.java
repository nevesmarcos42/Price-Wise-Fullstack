package com.example.price_wise_fullstack.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class OrderSummaryDTO {
    private Long orderId;
    private List<String> productNames;
    private BigDecimal totalOriginal;
    private BigDecimal discountApplied;
    private BigDecimal totalFinal;
    private String couponCode;
    private LocalDateTime createdAt;

}

