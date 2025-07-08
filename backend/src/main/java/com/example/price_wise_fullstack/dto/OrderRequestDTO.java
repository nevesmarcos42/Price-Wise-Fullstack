package com.example.price_wise_fullstack.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Data
public class OrderRequestDTO {
    @NotEmpty
    private List<Long> productIds;

    @NotBlank
    private String couponCode;

}

