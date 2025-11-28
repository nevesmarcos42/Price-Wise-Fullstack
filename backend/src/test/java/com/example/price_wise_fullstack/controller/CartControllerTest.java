package com.example.price_wise_fullstack.controller;

import com.example.price_wise_fullstack.dto.CartRequestDTO;
import com.example.price_wise_fullstack.model.Coupon;
import com.example.price_wise_fullstack.model.Product;
import com.example.price_wise_fullstack.repository.CouponRepository;
import com.example.price_wise_fullstack.repository.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@SuppressWarnings("null")
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Product produto1, produto2;
    private Coupon cupom;

    @BeforeEach
    void setup() {
        couponRepository.deleteAll();
        productRepository.deleteAll();

        produto1 = new Product();
        produto1.setName("Mouse");
        produto1.setDescription("Wireless");
        produto1.setPrice(new BigDecimal("150.00"));
        produto1.setStock(20);
        productRepository.save(produto1);

        produto2 = new Product();
        produto2.setName("Teclado");
        produto2.setDescription("Mecânico");
        produto2.setPrice(new BigDecimal("300.00"));
        produto2.setStock(15);
        productRepository.save(produto2);

        cupom = new Coupon();
        cupom.setCode("DESC20");
        cupom.setType("percent");
        cupom.setDiscountValue(new BigDecimal("20"));
        cupom.setOneShot(false);
        cupom.setValidFrom(LocalDateTime.now().minusDays(1));
        cupom.setValidUntil(LocalDateTime.now().plusDays(10));
        couponRepository.save(cupom);
    }

    @Test
    void deveFazerCheckoutComSucesso() throws Exception {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(produto1.getId(), produto2.getId()));
        dto.setCouponCode("DESC20");

        mockMvc.perform(post("/api/v1/cart/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalOriginal", is(450.00)))
            .andExpect(jsonPath("$.discountAmount", is(90.00)))
            .andExpect(jsonPath("$.totalWithDiscount", is(360.00)))
            .andExpect(jsonPath("$.productNames", hasSize(2)));
    }

    @Test
    void deveFazerCheckoutComCupom() throws Exception {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("DESC20");

        mockMvc.perform(post("/api/v1/cart/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalOriginal", is(150.00)))
            .andExpect(jsonPath("$.discountAmount", is(30.00)))
            .andExpect(jsonPath("$.totalWithDiscount", is(120.00)))
            .andExpect(jsonPath("$.appliedCoupon", is("desc20")));
    }

    @Test
    void deveIncluirNomesDeProdutosNoCheckout() throws Exception {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(produto1.getId(), produto2.getId()));
        dto.setCouponCode("DESC20");

        mockMvc.perform(post("/api/v1/cart/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.productNames", hasSize(2)));
    }

    @Test
    void deveRetornarNotFoundQuandoProdutoNaoExiste() throws Exception {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(9999L));
        dto.setCouponCode("DESC20");

        mockMvc.perform(post("/api/v1/cart/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarNotFoundQuandoCupomNaoExiste() throws Exception {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("CUPOMINVALIDO");

        mockMvc.perform(post("/api/v1/cart/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarBadRequestQuandoCupomExpirado() throws Exception {
        Coupon expirado = new Coupon();
        expirado.setCode("VENCIDO");
        expirado.setType("percent");
        expirado.setDiscountValue(new BigDecimal("25"));
        expirado.setOneShot(false);
        expirado.setValidFrom(LocalDateTime.now().minusDays(20));
        expirado.setValidUntil(LocalDateTime.now().minusDays(1));
        couponRepository.save(expirado);

        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("VENCIDO");

        mockMvc.perform(post("/api/v1/cart/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isBadRequest());
    }
}
