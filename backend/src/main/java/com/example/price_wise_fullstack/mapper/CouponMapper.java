package com.example.price_wise_fullstack.mapper;

import com.example.price_wise_fullstack.dto.CouponRequestDTO;
import com.example.price_wise_fullstack.dto.CouponResponseDTO;
import com.example.price_wise_fullstack.model.Coupon;

public class CouponMapper {
    public static Coupon toEntity(CouponRequestDTO dto) {
        Coupon c = new Coupon();
        c.setCode(dto.getCode().trim().toLowerCase());
        c.setType(dto.getType());
        c.setDiscountValue(dto.getValue());
        c.setOneShot(dto.getOneShot());
        c.setValidFrom(dto.getValidFrom());
        c.setValidUntil(dto.getValidUntil());
        return c;
    }

    public static CouponResponseDTO toDTO(Coupon c) {
        CouponResponseDTO dto = new CouponResponseDTO();
        dto.setId(c.getId());
        dto.setCode(c.getCode());
        dto.setType(c.getType());
        dto.setValue(c.getDiscountValue());
        dto.setOneShot(c.getOneShot());
        dto.setValidFrom(c.getValidFrom());
        dto.setValidUntil(c.getValidUntil());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }
}
