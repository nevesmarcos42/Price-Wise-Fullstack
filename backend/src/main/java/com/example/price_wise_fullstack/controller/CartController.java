package com.example.price_wise_fullstack.controller;

import com.example.price_wise_fullstack.dto.CartRequestDTO;
import com.example.price_wise_fullstack.dto.CartSummaryDTO;
import com.example.price_wise_fullstack.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/checkout")
    public ResponseEntity<CartSummaryDTO> checkout(@Valid @RequestBody CartRequestDTO dto) {
        CartSummaryDTO result = cartService.checkout(dto);
        return ResponseEntity.ok(result);
    }
}

