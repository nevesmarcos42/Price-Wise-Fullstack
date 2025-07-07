package com.example.price_wise_fullstack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplyCouponRequestDTO {
    @NotNull
    private Long productId;

    @NotBlank
    private String couponCode;

}
