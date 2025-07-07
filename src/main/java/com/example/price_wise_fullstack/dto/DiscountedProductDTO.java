package com.example.price_wise_fullstack.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class DiscountedProductDTO {
    
    private String name;
    private BigDecimal originalPrice;
    private BigDecimal discountedPrice;
    private String couponCode;
    private String discountType;
    private BigDecimal discountValue;

}
