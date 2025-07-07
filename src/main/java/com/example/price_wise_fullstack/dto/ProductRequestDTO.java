package com.example.price_wise_fullstack.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProductRequestDTO {
    @NotBlank
    @Size(min = 3, max = 100)
    private String name;

    @Size(max = 300)
    private String description;

    @NotNull @DecimalMin("0.01")
    private BigDecimal price;

    @NotNull @Min(0)
    private Integer stock;

}
