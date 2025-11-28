package com.example.price_wise_fullstack.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.price_wise_fullstack.dto.CouponRequestDTO;
import com.example.price_wise_fullstack.dto.CouponResponseDTO;
import com.example.price_wise_fullstack.dto.DiscountedProductDTO;
import com.example.price_wise_fullstack.mapper.CouponMapper;
import com.example.price_wise_fullstack.model.Coupon;
import com.example.price_wise_fullstack.model.Product;
import com.example.price_wise_fullstack.repository.CouponRepository;
import com.example.price_wise_fullstack.repository.ProductRepository;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private ProductRepository productRepository;

    public CouponResponseDTO createCoupon(CouponRequestDTO dto) {
        String normalizedCode = dto.getCode().trim().toLowerCase();

        if (couponRepository.existsByCodeIgnoreCase(normalizedCode)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Código já existe");
        }

        if (dto.getValidUntil().isBefore(dto.getValidFrom())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data de validade inválida");
        }

        Coupon coupon = CouponMapper.toEntity(dto);
        @SuppressWarnings("null")
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

    public DiscountedProductDTO applyCouponToProduct(Long productId, String couponCode) {
        @SuppressWarnings("null")
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));

        Coupon coupon = couponRepository.findByCodeIgnoreCase(couponCode.trim().toLowerCase())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupom não encontrado"));

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getDeletedAt() != null || now.isBefore(coupon.getValidFrom()) || now.isAfter(coupon.getValidUntil())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupom inválido ou expirado");
        }

        BigDecimal discount = coupon.getType().equals("percent")
            ? product.getPrice().multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100))
            : coupon.getDiscountValue();

        BigDecimal finalPrice = product.getPrice().subtract(discount).max(BigDecimal.ZERO);

        DiscountedProductDTO dto = new DiscountedProductDTO();
        dto.setName(product.getName());
        dto.setOriginalPrice(product.getPrice());
        dto.setDiscountedPrice(finalPrice);
        dto.setCouponCode(coupon.getCode());
        dto.setDiscountType(coupon.getType());
        dto.setDiscountValue(coupon.getDiscountValue());

        return dto;
    }

}
