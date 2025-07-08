package com.example.price_wise_fullstack.service;

import com.example.price_wise_fullstack.dto.CartRequestDTO;
import com.example.price_wise_fullstack.dto.CartSummaryDTO;
import com.example.price_wise_fullstack.model.Coupon;
import com.example.price_wise_fullstack.model.Product;
import com.example.price_wise_fullstack.repository.CouponRepository;
import com.example.price_wise_fullstack.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    public CartSummaryDTO checkout(CartRequestDTO dto) {
        List<Product> products = productRepository.findAllById(dto.getProductIds());

        if (products.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhum produto encontrado");
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(dto.getCouponCode().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupom não encontrado"));

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getDeletedAt() != null || now.isBefore(coupon.getValidFrom()) || now.isAfter(coupon.getValidUntil())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupom inválido ou expirado");
        }

        BigDecimal totalOriginal = products.stream()
                .map(Product::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = coupon.getType().equals("percent")
                ? totalOriginal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100))
                : coupon.getDiscountValue();

        BigDecimal totalWithDiscount = totalOriginal.subtract(discount).max(BigDecimal.ZERO);

        CartSummaryDTO summary = new CartSummaryDTO();
        summary.setProductNames(products.stream().map(Product::getName).toList());
        summary.setTotalOriginal(totalOriginal);
        summary.setDiscountAmount(discount);
        summary.setTotalWithDiscount(totalWithDiscount);
        summary.setAppliedCoupon(coupon.getCode());

        return summary;
    }
}

