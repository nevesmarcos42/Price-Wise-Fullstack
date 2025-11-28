package com.example.price_wise_fullstack.service;

import com.example.price_wise_fullstack.dto.CouponRequestDTO;
import com.example.price_wise_fullstack.dto.CouponResponseDTO;
import com.example.price_wise_fullstack.dto.DiscountedProductDTO;
import com.example.price_wise_fullstack.model.Coupon;
import com.example.price_wise_fullstack.model.Product;
import com.example.price_wise_fullstack.repository.CouponRepository;
import com.example.price_wise_fullstack.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class CouponServiceTest {

    @Autowired
    private CouponService couponService;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private ProductRepository productRepository;

    private Product produto;
    private Coupon cupomPercent, cupomFixed;

    @BeforeEach
    void setup() {
        couponRepository.deleteAll();
        productRepository.deleteAll();

        produto = new Product();
        produto.setName("Notebook");
        produto.setPrice(new BigDecimal("100.00"));
        produto.setStock(50);
        @SuppressWarnings("null")
        Product savedProduto = productRepository.save(produto);
        produto = savedProduto;

        cupomPercent = new Coupon();
        cupomPercent.setCode("PROMO10");
        cupomPercent.setType("percent");
        cupomPercent.setDiscountValue(new BigDecimal("10"));
        cupomPercent.setOneShot(false);
        cupomPercent.setValidFrom(LocalDateTime.now().minusDays(1));
        cupomPercent.setValidUntil(LocalDateTime.now().plusDays(10));
        @SuppressWarnings("null")
        Coupon savedPercent = couponRepository.save(cupomPercent);
        cupomPercent = savedPercent;

        cupomFixed = new Coupon();
        cupomFixed.setCode("FIXED50");
        cupomFixed.setType("fixed");
        cupomFixed.setDiscountValue(new BigDecimal("50"));
        cupomFixed.setOneShot(true);
        cupomFixed.setValidFrom(LocalDateTime.now().minusDays(1));
        cupomFixed.setValidUntil(LocalDateTime.now().plusDays(10));
        @SuppressWarnings("null")
        Coupon savedFixed = couponRepository.save(cupomFixed);
        cupomFixed = savedFixed;
    }

    @Test
    void deveCriarCupomPercentualComSucesso() {
        CouponRequestDTO dto = new CouponRequestDTO();
        dto.setCode("WELCOME15");
        dto.setType("percent");
        dto.setValue(new BigDecimal("15"));
        dto.setOneShot(false);
        dto.setValidFrom(LocalDateTime.now());
        dto.setValidUntil(LocalDateTime.now().plusDays(30));

        CouponResponseDTO response = couponService.createCoupon(dto);

        assertNotNull(response.getId());
        assertEquals("welcome15", response.getCode());
        assertEquals("percent", response.getType());
        assertEquals(new BigDecimal("15"), response.getValue());
    }

    @Test
    void deveCriarCupomValorFixoComSucesso() {
        CouponRequestDTO dto = new CouponRequestDTO();
        dto.setCode("FIXED100");
        dto.setType("fixed");
        dto.setValue(new BigDecimal("100"));
        dto.setOneShot(true);
        dto.setValidFrom(LocalDateTime.now());
        dto.setValidUntil(LocalDateTime.now().plusDays(15));

        CouponResponseDTO response = couponService.createCoupon(dto);

        assertEquals("fixed100", response.getCode());
        assertEquals("fixed", response.getType());
        assertTrue(response.getOneShot());
    }

    @Test
    void deveListarTodosCupons() {
        List<CouponResponseDTO> cupons = couponService.listAll();

        assertEquals(2, cupons.size());
    }

    @Test
    void deveBuscarCupomPorCodigo() {
        CouponResponseDTO response = couponService.getByCode("PROMO10");

        assertEquals("promo10", response.getCode());
        assertEquals("percent", response.getType());
    }

    @Test
    void deveLancarExcecaoQuandoCupomNaoExiste() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            couponService.getByCode("INEXISTENTE");
        });

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void deveAplicarCupomPercentualAoProduto() {
        DiscountedProductDTO result = couponService.applyCouponToProduct(
            produto.getId(),
            "PROMO10"
        );

        assertEquals("Notebook", result.getName());
        assertEquals(new BigDecimal("1000.00"), result.getOriginalPrice());
        assertEquals(new BigDecimal("900.00"), result.getDiscountedPrice());
        assertEquals("promo10", result.getCouponCode());
    }

    @Test
    void deveAplicarCupomValorFixoAoProduto() {
        DiscountedProductDTO result = couponService.applyCouponToProduct(
            produto.getId(),
            "FIXED50"
        );

        assertEquals(new BigDecimal("1000.00"), result.getOriginalPrice());
        assertEquals(new BigDecimal("950.00"), result.getDiscountedPrice());
        assertEquals("fixed50", result.getCouponCode());
    }

    @Test
    void deveLancarExcecaoQuandoProdutoNaoExiste() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            couponService.applyCouponToProduct(9999L, "PROMO10");
        });

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertNotNull(ex.getReason());
        @SuppressWarnings("null")
        String reason = ex.getReason().toLowerCase();
        assertTrue(reason.contains("produto"));
    }

    @Test
    void deveLancarExcecaoQuandoCupomNaoExisteAoAplicar() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            couponService.applyCouponToProduct(produto.getId(), "CUPOMINVALIDO");
        });

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void deveLancarExcecaoQuandoCupomEstaExpirado() {
        Coupon expirado = new Coupon();
        expirado.setCode("EXPIRADO");
        expirado.setType("percent");
        expirado.setDiscountValue(new BigDecimal("20"));
        expirado.setOneShot(false);
        expirado.setValidFrom(LocalDateTime.now().minusDays(10));
        expirado.setValidUntil(LocalDateTime.now().minusDays(1));
        couponRepository.save(expirado);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            couponService.applyCouponToProduct(produto.getId(), "EXPIRADO");
        });

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertNotNull(ex.getReason());
        @SuppressWarnings("null")
        String reason = ex.getReason().toLowerCase();
        assertTrue(reason.contains("expirado"));
    }

    @Test
    void deveLancarExcecaoQuandoCupomAindaNaoEstaValido() {
        Coupon futuro = new Coupon();
        futuro.setCode("FUTURO");
        futuro.setType("percent");
        futuro.setDiscountValue(new BigDecimal("20"));
        futuro.setOneShot(false);
        futuro.setValidFrom(LocalDateTime.now().plusDays(5));
        futuro.setValidUntil(LocalDateTime.now().plusDays(15));
        couponRepository.save(futuro);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            couponService.applyCouponToProduct(produto.getId(), "FUTURO");
        });

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void deveConverterCodigoParaMinusculoAoCriar() {
        CouponRequestDTO dto = new CouponRequestDTO();
        dto.setCode("MAIUSCULO");
        dto.setType("percent");
        dto.setValue(new BigDecimal("5"));
        dto.setOneShot(false);
        dto.setValidFrom(LocalDateTime.now());
        dto.setValidUntil(LocalDateTime.now().plusDays(5));

        CouponResponseDTO response = couponService.createCoupon(dto);

        assertEquals("maiusculo", response.getCode());
    }

    @Test
    void deveConverterCodigoParaMinusculoAoBuscar() {
        CouponResponseDTO response = couponService.getByCode("PROMO10");

        assertEquals("promo10", response.getCode());
    }
}
