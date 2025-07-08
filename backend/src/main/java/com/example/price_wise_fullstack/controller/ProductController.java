package com.example.price_wise_fullstack.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.price_wise_fullstack.dto.PaginatedResponseDTO;
import com.example.price_wise_fullstack.dto.ProductRequestDTO;
import com.example.price_wise_fullstack.dto.ProductResponseDTO;
import com.example.price_wise_fullstack.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponseDTO> create(@Valid @RequestBody ProductRequestDTO dto) {
        ProductResponseDTO saved = productService.createProduct(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<PaginatedResponseDTO<ProductResponseDTO>> getFiltered(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        @RequestParam(defaultValue = "name") String sortBy,
        @RequestParam(defaultValue = "asc") String sortOrder
    ) {
        PaginatedResponseDTO<ProductResponseDTO> response = productService.listFiltered(
            search, minPrice, maxPrice, page, limit, sortBy, sortOrder
        );
        return ResponseEntity.ok(response);
    }
}
