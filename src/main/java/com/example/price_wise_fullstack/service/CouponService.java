package com.example.price_wise_fullstack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.price_wise_fullstack.dto.CouponRequestDTO;
import com.example.price_wise_fullstack.dto.CouponResponseDTO;
import com.example.price_wise_fullstack.mapper.CouponMapper;
import com.example.price_wise_fullstack.model.Coupon;
import com.example.price_wise_fullstack.repository.CouponRepository;

@Service
public class CouponService {
    @Autowired
    private CouponRepository couponRepository;

    public CouponResponseDTO createCoupon(CouponRequestDTO dto) {
        String normalizedCode = dto.getCode().trim().toLowerCase();

        if (couponRepository.existsByCodeIgnoreCase(normalizedCode)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Código já existe");
        }

        if (dto.getValidUntil().isBefore(dto.getValidFrom())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data de validade inválida");
        }

        Coupon coupon = CouponMapper.toEntity(dto);
        Coupon saved = couponRepository.save(coupon);
        return CouponMapper.toDTO(saved);
    }

    public List<CouponResponseDTO> listAll() {
        return couponRepository.findAll()
                .stream()
                .map(CouponMapper::toDTO)
                .toList();
    }

    public CouponResponseDTO getByCode(String code) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupom não encontrado"));
        return CouponMapper.toDTO(coupon);
    }
}
