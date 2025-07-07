package com.example.price_wise_fullstack.controller;

import com.example.price_wise_fullstack.dto.OrderRequestDTO;
import com.example.price_wise_fullstack.dto.OrderSummaryDTO;
import com.example.price_wise_fullstack.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderSummaryDTO> createOrder(@Valid @RequestBody OrderRequestDTO dto) {
        OrderSummaryDTO result = orderService.saveOrder(dto);
        return ResponseEntity.ok(result);
    }
}

