package com.example.price_wise_fullstack.mapper;

import com.example.price_wise_fullstack.dto.ProductRequestDTO;
import com.example.price_wise_fullstack.dto.ProductResponseDTO;
import com.example.price_wise_fullstack.model.Product;

public class ProductMapper {
    public static Product toEntity(ProductRequestDTO dto) {
        Product p = new Product();
        p.setName(dto.getName().trim());
        p.setDescription(dto.getDescription());
        p.setPrice(dto.getPrice());
        p.setStock(dto.getStock());
        return p;
    }

    public static ProductResponseDTO toDTO(Product p) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setStock(p.getStock());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());
        return dto;
    }
}
