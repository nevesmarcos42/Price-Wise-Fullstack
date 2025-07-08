package com.example.price_wise_fullstack.service;

import com.example.price_wise_fullstack.dto.OrderRequestDTO;
import com.example.price_wise_fullstack.dto.OrderSummaryDTO;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    private Product prod1, prod2;
    private Coupon coupon;

    @BeforeEach
    void setup() {
        prod1 = new Product();
        prod1.setName("Caneta Azul");
        prod1.setPrice(new BigDecimal("10.00"));
        prod1.setStock(50);
        productRepository.save(prod1);

        prod2 = new Product();
        prod2.setName("Caderno");
        prod2.setPrice(new BigDecimal("30.00"));
        prod2.setStock(100);
        productRepository.save(prod2);

        coupon = new Coupon();
        coupon.setCode("PROMO15");
        coupon.setType("percent");
        coupon.setDiscountValue(new BigDecimal("15")); // 15%
        coupon.setValidFrom(LocalDateTime.now().minusDays(1));
        coupon.setValidUntil(LocalDateTime.now().plusDays(1));
        coupon.setOneShot(false);
        couponRepository.save(coupon);
    }

    @Test
    void deveSalvarPedidoComCupomValido() {
        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(prod1.getId(), prod2.getId()));
        dto.setCouponCode("PROMO15");

        OrderSummaryDTO summary = orderService.saveOrder(dto);

        assertNotNull(summary.getOrderId());
        assertEquals(2, summary.getProductNames().size());
        assertEquals(new BigDecimal("40.00"), summary.getTotalOriginal());
        assertEquals(new BigDecimal("6.00"), summary.getDiscountApplied());
        assertEquals(new BigDecimal("34.00"), summary.getTotalFinal());
        assertEquals("PROMO15", summary.getCouponCode());
    }

    @Test
    void naoDevePermitirCupomExpirado() {
        // Cria cupom fora da validade
        Coupon expirado = new Coupon();
        expirado.setCode("EXPIRADO25");
        expirado.setType("percent");
        expirado.setDiscountValue(new BigDecimal("25"));
        expirado.setOneShot(false);
        expirado.setValidFrom(LocalDateTime.now().minusDays(10));
        expirado.setValidUntil(LocalDateTime.now().minusDays(5)); // ❌ já expirado
        couponRepository.save(expirado);

        // Prepara pedido com cupom expirado
        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(prod1.getId()));
        dto.setCouponCode("EXPIRADO25");

        // Espera exceção ao tentar salvar
        Exception ex = assertThrows(ResponseStatusException.class, () -> {
            orderService.saveOrder(dto);
        });

        assertTrue(ex.getMessage().contains("expirado") || ex.getMessage().contains("fora do período"));
    }

    @Test
    void naoDevePermitirCupomInexistente() {
        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(prod1.getId(), prod2.getId()));
        dto.setCouponCode("CUPOM_NAO_EXISTE");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            orderService.saveOrder(dto);
        });

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(
            Optional.ofNullable(ex.getReason())
                .map(String::toLowerCase)
                .orElse("")
                .contains("cupom")
        );
    }

    @Test
    void naoDevePermitirPedidoComProdutoInexistente() {
        Long produtoInvalidoId = 9999L; // Assume ID que não existe no banco

        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(prod1.getId(), produtoInvalidoId));
        dto.setCouponCode(null); // sem cupom

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            orderService.saveOrder(dto);
        });

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertTrue(
            Optional.ofNullable(ex.getReason())
                .map(String::toLowerCase)
                .orElse("")
                .contains("produto")
        );
    }

    @Test
    void naoDevePermitirPrecoFinalMenorQueUmCentavo() {
        // Produto barato
        Product produto = new Product();
        produto.setName("Balinha");
        produto.setPrice(new BigDecimal("0.02"));
        produto.setStock(1);
        productRepository.save(produto);

        // Cupom que derruba o preço para menos de 0.01
        Coupon cupom = new Coupon();
        cupom.setCode("DESCONTO99");
        cupom.setType("percent");
        cupom.setDiscountValue(new BigDecimal("99")); // 99% de desconto
        cupom.setOneShot(false);
        cupom.setValidFrom(LocalDateTime.now().minusDays(1));
        cupom.setValidUntil(LocalDateTime.now().plusDays(1));
        couponRepository.save(cupom);

        // Cria pedido com esse cupom
        OrderRequestDTO dto = new OrderRequestDTO();
        dto.setProductIds(List.of(produto.getId()));
        dto.setCouponCode("DESCONTO99");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            orderService.saveOrder(dto);
        });

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
        assertTrue(Optional.ofNullable(ex.getReason()).orElse("").toLowerCase().contains("abaixo de"));
    }

    @Test
    void naoDevePermitirReutilizacaoDeCupomOneShot() {
        // Criar cupom oneShot
        Coupon cupomUnico = new Coupon();
        cupomUnico.setCode("UNICO10");
        cupomUnico.setType("percent");
        cupomUnico.setDiscountValue(new BigDecimal("10"));
        cupomUnico.setOneShot(true); // ✅ cupom de uso único
        cupomUnico.setValidFrom(LocalDateTime.now().minusDays(1));
        cupomUnico.setValidUntil(LocalDateTime.now().plusDays(1));
        couponRepository.save(cupomUnico);

        //  1ª aplicação - deve funcionar
        OrderRequestDTO pedido1 = new OrderRequestDTO();
        pedido1.setProductIds(List.of(prod1.getId(), prod2.getId()));
        pedido1.setCouponCode("UNICO10");

        OrderSummaryDTO resultado1 = orderService.saveOrder(pedido1);
        assertNotNull(resultado1.getOrderId());

        //  2ª aplicação - deve FALHAR com 409
        OrderRequestDTO pedido2 = new OrderRequestDTO();
        pedido2.setProductIds(List.of(prod1.getId()));
        pedido2.setCouponCode("UNICO10");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            orderService.saveOrder(pedido2);
        });

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        assertTrue(Optional.ofNullable(ex.getReason()).orElse("").toLowerCase().contains("já foi utilizado"));
    }
}
