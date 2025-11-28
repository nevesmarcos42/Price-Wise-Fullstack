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
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order must have at least one item");
        }

        // Extract product IDs from items
        List<Long> productIds = dto.getItems().stream()
                .map(OrderRequestDTO.OrderItemDTO::getProductId)
                .toList();
        
        List<Product> products = productRepository.findAllById(productIds);
        if (products.size() != productIds.size()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "One or more products not found");
        }

        // Handle optional coupon
        Coupon coupon = null;
        if (dto.getCouponCode() != null && !dto.getCouponCode().trim().isEmpty()) {
            coupon = couponRepository.findByCodeIgnoreCase(dto.getCouponCode().trim().toLowerCase())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found"));

            // Validate using date only (ignoring time)
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalDate validFromDate = coupon.getValidFrom().toLocalDate();
            java.time.LocalDate validUntilDate = coupon.getValidUntil().toLocalDate();
            
            if (coupon.getDeletedAt() != null || today.isBefore(validFromDate) || today.isAfter(validUntilDate)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Coupon expired or invalid");
            }
            
            // Check if coupon is one-shot and already used
            if (coupon.getOneShot() != null && coupon.getOneShot()) {
                final Long couponId = coupon.getId();
                long usageCount = orderRepository.findAll().stream()
                        .filter(o -> o.getCoupon() != null && o.getCoupon().getId().equals(couponId))
                        .count();
                
                if (usageCount > 0) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "This coupon has already been used");
                }
            }
        }

        // Calculate total with quantities
        BigDecimal totalOriginal = BigDecimal.ZERO;
        for (OrderRequestDTO.OrderItemDTO itemDto : dto.getItems()) {
            Product product = products.stream()
                    .filter(p -> p.getId().equals(itemDto.getProductId()))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
            
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            totalOriginal = totalOriginal.add(itemTotal);
        }

        // Apply discount if coupon exists
        BigDecimal discount = BigDecimal.ZERO;
        if (coupon != null) {
            discount = coupon.getType().equals("percent")
                    ? totalOriginal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100))
                    : coupon.getDiscountValue();
        }

        BigDecimal totalFinal = totalOriginal.subtract(discount).max(BigDecimal.ZERO);

        if (totalFinal.compareTo(new BigDecimal("0.01")) < 0) {
            throw new ResponseStatusException(
                HttpStatus.UNPROCESSABLE_ENTITY,
                "Total amount below R$ 0.01 is not allowed"
            );
        }

        // Create order
        Order order = new Order();
        order.setCoupon(coupon);
        order.setTotalOriginal(totalOriginal);
        order.setDiscountApplied(discount);
        order.setTotalFinal(totalFinal);

        // Create order items with quantities
        for (OrderRequestDTO.OrderItemDTO itemDto : dto.getItems()) {
            Product product = products.stream()
                    .filter(p -> p.getId().equals(itemDto.getProductId()))
                    .findFirst()
                    .orElseThrow();
            
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setPrice(product.getPrice());
            item.setQuantity(itemDto.getQuantity());
            order.getItems().add(item);
        }

        Order saved = orderRepository.save(order);

        OrderSummaryDTO summary = new OrderSummaryDTO();
        summary.setOrderId(saved.getId());
        summary.setProductNames(products.stream().map(Product::getName).toList());
        summary.setTotalOriginal(totalOriginal);
        summary.setDiscountApplied(discount);
        summary.setTotalFinal(totalFinal);
        summary.setCouponCode(coupon != null ? coupon.getCode() : null);
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

