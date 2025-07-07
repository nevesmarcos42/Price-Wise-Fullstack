package com.example.price_wise_fullstack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.price_wise_fullstack.dto.ApplyCouponRequestDTO;
import com.example.price_wise_fullstack.dto.CouponRequestDTO;
import com.example.price_wise_fullstack.dto.CouponResponseDTO;
import com.example.price_wise_fullstack.dto.DiscountedProductDTO;
import com.example.price_wise_fullstack.service.CouponService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/coupons")
public class CouponController {
    @Autowired
    private CouponService couponService;

    @PostMapping
    public ResponseEntity<CouponResponseDTO> create(@Valid @RequestBody CouponRequestDTO dto) {
        CouponResponseDTO saved = couponService.createCoupon(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/apply")
    public ResponseEntity<DiscountedProductDTO> applyCoupon(@Valid @RequestBody ApplyCouponRequestDTO dto) {
        DiscountedProductDTO result = couponService.applyCouponToProduct(dto.getProductId(), dto.getCouponCode());
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<CouponResponseDTO>> listAll() {
        return ResponseEntity.ok(couponService.listAll());
    }

    @GetMapping("/{code}")
    public ResponseEntity<CouponResponseDTO> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(couponService.getByCode(code));
    }
}
