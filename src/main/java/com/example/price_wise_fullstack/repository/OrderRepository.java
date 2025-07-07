package com.example.price_wise_fullstack.repository;

import com.example.price_wise_fullstack.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}

