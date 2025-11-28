package com.example.price_wise_fullstack.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDTO {
    
    private List<OrderItemDTO> items;
    
    private String couponCode; // opcional

    @Data
    public static class OrderItemDTO {
        private Long productId;
        private Integer quantity;
    }
}

