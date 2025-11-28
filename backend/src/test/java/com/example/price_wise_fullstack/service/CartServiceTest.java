package com.example.price_wise_fullstack.service;

import com.example.price_wise_fullstack.dto.CartRequestDTO;
import com.example.price_wise_fullstack.dto.CartSummaryDTO;
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
class CartServiceTest {

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    private Product produto1, produto2;
    private Coupon cupom;

    @BeforeEach
    void setup() {
        productRepository.deleteAll();
        couponRepository.deleteAll();

        produto1 = new Product();
        produto1.setName("Mouse");
        produto1.setPrice(new BigDecimal("150.00"));
        produto1.setStock(20);
        @SuppressWarnings("null")
        Product savedProduto1 = productRepository.save(produto1);
        produto1 = savedProduto1;

        produto2 = new Product();
        produto2.setName("Teclado");
        produto2.setPrice(new BigDecimal("200.00"));
        produto2.setStock(15);
        @SuppressWarnings("null")
        Product savedProduto2 = productRepository.save(produto2);
        produto2 = savedProduto2;

        cupom = new Coupon();
        cupom.setCode("DESC10");
        cupom.setType("percent");
        cupom.setDiscountValue(new BigDecimal("10"));
        cupom.setOneShot(false);
        cupom.setValidFrom(LocalDateTime.now().minusDays(1));
        cupom.setValidUntil(LocalDateTime.now().plusDays(10));
        @SuppressWarnings("null")
        Coupon savedCupom = couponRepository.save(cupom);
        cupom = savedCupom;
    }

    @Test
    void deveFazerCheckoutComSucesso() {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(produto1.getId(), produto2.getId()));
        dto.setCouponCode("DESC10");

        CartSummaryDTO result = cartService.checkout(dto);

        assertEquals(new BigDecimal("300.00"), result.getTotalOriginal());
        assertEquals(new BigDecimal("30.00"), result.getDiscountAmount());
        assertEquals(new BigDecimal("270.00"), result.getTotalWithDiscount());
        assertEquals(2, result.getProductNames().size());
    }

    @Test
    void deveFazerCheckoutComCupom() {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("DESC10");

        CartSummaryDTO result = cartService.checkout(dto);

        assertEquals(new BigDecimal("100.00"), result.getTotalOriginal());
        assertEquals(new BigDecimal("10.00"), result.getDiscountAmount());
        assertEquals(new BigDecimal("90.00"), result.getTotalWithDiscount());
    }

    @Test
    void deveCalcularTotalComMultiplosItens() {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(produto1.getId(), produto2.getId()));
        dto.setCouponCode("DESC10");

        CartSummaryDTO result = cartService.checkout(dto);

        assertEquals(new BigDecimal("300.00"), result.getTotalOriginal());
        assertEquals(new BigDecimal("30.00"), result.getDiscountAmount());
    }

    @Test
    void deveLancarExcecaoQuandoProdutoNaoExiste() {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(9999L));
        dto.setCouponCode("DESC10");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            cartService.checkout(dto);
        });

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void deveLancarExcecaoQuandoCupomNaoExiste() {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("CUPOMINVALIDO");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            cartService.checkout(dto);
        });

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void deveLancarExcecaoQuandoCupomEstaExpirado() {
        Coupon expirado = new Coupon();
        expirado.setCode("VENCIDO");
        expirado.setType("percent");
        expirado.setDiscountValue(new BigDecimal("15"));
        expirado.setOneShot(false);
        expirado.setValidFrom(LocalDateTime.now().minusDays(10));
        expirado.setValidUntil(LocalDateTime.now().minusDays(1));
        couponRepository.save(expirado);

        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("VENCIDO");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            cartService.checkout(dto);
        });

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void deveIncluirNomesDoProdutosNoResumo() {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(produto1.getId(), produto2.getId()));
        dto.setCouponCode("DESC10");

        CartSummaryDTO result = cartService.checkout(dto);

        assertEquals(2, result.getProductNames().size());
        assertTrue(result.getProductNames().contains("Mouse"));
        assertTrue(result.getProductNames().contains("Teclado"));
    }

    @Test
    void deveAplicarCupomCorretamente() {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductIds(List.of(produto1.getId()));
        dto.setCouponCode("DESC10");

        CartSummaryDTO result = cartService.checkout(dto);

        assertEquals("desc10", result.getAppliedCoupon());
        assertEquals(new BigDecimal("10.00"), result.getDiscountAmount());
    }
}
