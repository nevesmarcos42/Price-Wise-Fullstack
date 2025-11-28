package com.example.price_wise_fullstack.controller;

import com.example.price_wise_fullstack.dto.OrderRequestDTO;
import com.example.price_wise_fullstack.model.Coupon;
import com.example.price_wise_fullstack.model.Product;
import com.example.price_wise_fullstack.repository.CouponRepository;
import com.example.price_wise_fullstack.repository.OrderRepository;
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
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Product produto1, produto2;
    private Coupon cupom;

    @BeforeEach
    void setup() {
        orderRepository.deleteAll();
        couponRepository.deleteAll();
        productRepository.deleteAll();

        produto1 = new Product();
        produto1.setName("Mouse");
        produto1.setPrice(new BigDecimal("100.00"));
        produto1.setStock(20);
        productRepository.save(produto1);

        produto2 = new Product();
        produto2.setName("Teclado");
        produto2.setPrice(new BigDecimal("200.00"));
        produto2.setStock(15);
        productRepository.save(produto2);

        cupom = new Coupon();
        cupom.setCode("DESC15");
        cupom.setType("percent");
        cupom.setDiscountValue(new BigDecimal("15"));
        cupom.setOneShot(false);
        cupom.setValidFrom(LocalDateTime.now().minusDays(1));
        cupom.setValidUntil(LocalDateTime.now().plusDays(10));
        couponRepository.save(cupom);
    }

    @Test
    void deveCriarPedidoComSucesso() throws Exception {
        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("DESC15");

        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.orderId", notNullValue()))
            .andExpect(jsonPath("$.totalOriginal", is(100.00)))
            .andExpect(jsonPath("$.discountApplied", is(15.00)))
            .andExpect(jsonPath("$.totalFinal", is(85.00)));
    }

    @Test
    void deveCriarPedidoComCupom() throws Exception {
        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("DESC15");

        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.totalOriginal", is(100.00)))
            .andExpect(jsonPath("$.discountApplied", is(15.00)))
            .andExpect(jsonPath("$.totalFinal", is(85.00)))
            .andExpect(jsonPath("$.couponCode", is("desc15")));
    }

    @Test
    void deveCriarPedidoComMultiplosItens() throws Exception {
        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(produto1.getId(), produto2.getId()));
        dto.setCouponCode("DESC15");

        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.totalOriginal", is(300.00)))
            .andExpect(jsonPath("$.productNames", hasSize(2)));
    }

    @Test
    void deveListarTodosPedidos() throws Exception {
        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("DESC15");

        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated());

        mockMvc.perform(get("/api/v1/orders"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].totalOriginal", is(100.00)));
    }

    @Test
    void deveRetornarNotFoundQuandoProdutoNaoExiste() throws Exception {
        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(9999L));
        dto.setCouponCode("DESC15");

        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarNotFoundQuandoCupomNaoExiste() throws Exception {
        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("INEXISTENTE");

        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarBadRequestQuandoCupomExpirado() throws Exception {
        Coupon expirado = new Coupon();
        expirado.setCode("VENCIDO");
        expirado.setType("percent");
        expirado.setDiscountValue(new BigDecimal("20"));
        expirado.setOneShot(false);
        expirado.setValidFrom(LocalDateTime.now().minusDays(10));
        expirado.setValidUntil(LocalDateTime.now().minusDays(1));
        couponRepository.save(expirado);

        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("VENCIDO");

        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void deveIncluirDatasNoPedido() throws Exception {
        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("DESC15");

        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.createdAt", notNullValue()));
    }
}
