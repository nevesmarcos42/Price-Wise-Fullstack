package com.example.price_wise_fullstack.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CouponRequestDTO {

    @NotBlank
    @Size(min = 4, max = 20)
    @Pattern(regexp = "^[a-zA-Z0-9]+$")
    private String code;

    @NotBlank
    @Pattern(regexp = "^(fixed|percent)$")
    private String type;

    @NotNull @DecimalMin("0.01")
    private BigDecimal value;

    @NotNull
    private Boolean oneShot;

    @NotNull
    private LocalDateTime validFrom;

    @NotNull
    private LocalDateTime validUntil;

}