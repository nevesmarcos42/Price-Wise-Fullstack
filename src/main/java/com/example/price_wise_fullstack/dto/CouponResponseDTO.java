package com.example.price_wise_fullstack.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CouponResponseDTO {
    private Long id;
    private String code;
    private String type;
    private BigDecimal value;
    private Boolean oneShot;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
