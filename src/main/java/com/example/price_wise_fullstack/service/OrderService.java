package com.example.price_wise_fullstack.service;

import com.example.price_wise_fullstack.dto.OrderRequestDTO;
import com.example.price_wise_fullstack.dto.OrderSummaryDTO;
import com.example.price_wise_fullstack.model.Coupon;
import com.example.price_wise_fullstack.model.Order;
import com.example.price_wise_fullstack.model.OrderItem;
import com.example.price_wise_fullstack.model.Product;
import com.example.price_wise_fullstack.repository.CouponRepository;
import com.example.price_wise_fullstack.repository.OrderRepository;
import com.example.price_wise_fullstack.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private ProductRepository productRepository;

    public OrderSummaryDTO saveOrder(OrderRequestDTO dto) {
        List<Product> products = productRepository.findAllById(dto.getProductIds());
        if (products.size() != dto.getProductIds().size()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto(s) não encontrado(s)");
        }

        if (products.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produtos não encontrados");
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(dto.getCouponCode().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupom não encontrado"));

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getDeletedAt() != null || now.isBefore(coupon.getValidFrom()) || now.isAfter(coupon.getValidUntil())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupom expirado ou inválido");
        }

        BigDecimal totalOriginal = products.stream()
                .map(Product::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = coupon.getType().equals("percent")
                ? totalOriginal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100))
                : coupon.getDiscountValue();

        BigDecimal totalFinal = totalOriginal.subtract(discount).max(BigDecimal.ZERO);

        Order order = new Order();
        order.setCoupon(coupon);
        order.setTotalOriginal(totalOriginal);
        order.setDiscountApplied(discount);
        order.setTotalFinal(totalFinal);

        for (Product product : products) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setPrice(product.getPrice());
            order.getItems().add(item);
        }

        if (totalFinal.compareTo(new BigDecimal("0.01")) < 0) {
            throw new ResponseStatusException(
                HttpStatus.UNPROCESSABLE_ENTITY,
                "Valor final abaixo de R$ 0,01 não permitido"
            );
        }

        Order saved = orderRepository.save(order);

        OrderSummaryDTO summary = new OrderSummaryDTO();
        summary.setOrderId(saved.getId());
        summary.setProductNames(products.stream().map(Product::getName).toList());
        summary.setTotalOriginal(totalOriginal);
        summary.setDiscountApplied(discount);
        summary.setTotalFinal(totalFinal);
        summary.setCouponCode(coupon.getCode());
        summary.setCreatedAt(saved.getCreatedAt());

        return summary;
    }

    public List<OrderSummaryDTO> listAllOrders() {
        List<Order> orders = orderRepository.findAll();

        return orders.stream().map(order -> {
            OrderSummaryDTO dto = new OrderSummaryDTO();
            dto.setOrderId(order.getId());
            dto.setCouponCode(order.getCoupon() != null ? order.getCoupon().getCode() : null);
            dto.setCreatedAt(order.getCreatedAt());
            dto.setTotalOriginal(order.getTotalOriginal());
            dto.setDiscountApplied(order.getDiscountApplied());
            dto.setTotalFinal(order.getTotalFinal());
            dto.setProductNames(order.getItems().stream()
                .map(item -> item.getProduct().getName()).toList());
            return dto;
        }).toList();
    }
}

