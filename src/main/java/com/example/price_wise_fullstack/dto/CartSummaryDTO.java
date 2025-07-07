package com.example.price_wise_fullstack.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class CartSummaryDTO {
    private List<String> productNames;
    private BigDecimal totalOriginal;
    private BigDecimal discountAmount;
    private BigDecimal totalWithDiscount;
    private String appliedCoupon;

}

