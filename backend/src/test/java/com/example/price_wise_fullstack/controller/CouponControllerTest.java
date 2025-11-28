package com.example.price_wise_fullstack.controller;

import com.example.price_wise_fullstack.dto.ApplyCouponRequestDTO;
import com.example.price_wise_fullstack.dto.CouponRequestDTO;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@SuppressWarnings("null")
class CouponControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Coupon cupom;
    private Product produto;

    @BeforeEach
    void setup() {
        couponRepository.deleteAll();
        productRepository.deleteAll();

        cupom = new Coupon();
        cupom.setCode("PROMO10");
        cupom.setType("percent");
        cupom.setDiscountValue(new BigDecimal("10"));
        cupom.setOneShot(false);
        cupom.setValidFrom(LocalDateTime.now().minusDays(1));
        cupom.setValidUntil(LocalDateTime.now().plusDays(10));
        couponRepository.save(cupom);

        produto = new Product();
        produto.setName("Notebook");
        produto.setPrice(new BigDecimal("1000.00"));
        produto.setStock(10);
        productRepository.save(produto);
    }

    @Test
    void deveListarTodosCupons() throws Exception {
        mockMvc.perform(get("/api/v1/coupons"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].code", is("promo10")))
            .andExpect(jsonPath("$[0].type", is("percent")))
            .andExpect(jsonPath("$[0].value", is(10)));
    }

    @Test
    void deveCriarCupomComSucesso() throws Exception {
        CouponRequestDTO dto = new CouponRequestDTO();
        dto.setCode("WELCOME20");
        dto.setType("percent");
        dto.setValue(new BigDecimal("20"));
        dto.setOneShot(true);
        dto.setValidFrom(LocalDateTime.now());
        dto.setValidUntil(LocalDateTime.now().plusDays(30));

        mockMvc.perform(post("/api/v1/coupons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.code", is("welcome20")))
            .andExpect(jsonPath("$.type", is("percent")))
            .andExpect(jsonPath("$.value", is(20)))
            .andExpect(jsonPath("$.oneShot", is(true)));
    }

    @Test
    void deveBuscarCupomPorCodigo() throws Exception {
        mockMvc.perform(get("/api/v1/coupons/promo10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code", is("promo10")))
            .andExpect(jsonPath("$.type", is("percent")))
            .andExpect(jsonPath("$.value", is(10)));
    }

    @Test
    void deveRetornarNotFoundQuandoCupomNaoExiste() throws Exception {
        mockMvc.perform(get("/api/v1/coupons/inexistente"))
            .andExpect(status().isNotFound());
    }

    @Test
    void deveAplicarCupomAoProduto() throws Exception {
        ApplyCouponRequestDTO dto = new ApplyCouponRequestDTO();
        dto.setProductId(produto.getId());
        dto.setCouponCode("promo10");

        mockMvc.perform(post("/api/v1/coupons/apply")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name", is("Notebook")))
            .andExpect(jsonPath("$.originalPrice", is(1000.00)))
            .andExpect(jsonPath("$.discountedPrice", is(900.00)))
            .andExpect(jsonPath("$.couponCode", is("promo10")));
    }

    @Test
    void deveRetornarNotFoundAoAplicarCupomEmProdutoInexistente() throws Exception {
        ApplyCouponRequestDTO dto = new ApplyCouponRequestDTO();
        dto.setProductId(9999L);
        dto.setCouponCode("promo10");

        mockMvc.perform(post("/api/v1/coupons/apply")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarBadRequestAoCriarCupomInvalido() throws Exception {
        CouponRequestDTO dto = new CouponRequestDTO();
        dto.setCode("");
        dto.setType("invalido");
        dto.setValue(new BigDecimal("-10"));

        mockMvc.perform(post("/api/v1/coupons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void deveCriarCupomValorFixo() throws Exception {
        CouponRequestDTO dto = new CouponRequestDTO();
        dto.setCode("FIXED50");
        dto.setType("fixed");
        dto.setValue(new BigDecimal("50"));
        dto.setOneShot(false);
        dto.setValidFrom(LocalDateTime.now());
        dto.setValidUntil(LocalDateTime.now().plusDays(15));

        mockMvc.perform(post("/api/v1/coupons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.code", is("fixed50")))
            .andExpect(jsonPath("$.type", is("fixed")));
    }

    @Test
    void deveBuscarCupomComCodigoMaiusculo() throws Exception {
        mockMvc.perform(get("/api/v1/coupons/PROMO10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code", is("promo10")));
    }
}
