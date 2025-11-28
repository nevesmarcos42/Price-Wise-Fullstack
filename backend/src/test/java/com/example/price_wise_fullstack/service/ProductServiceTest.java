package com.example.price_wise_fullstack.service;

import com.example.price_wise_fullstack.dto.PaginatedResponseDTO;
import com.example.price_wise_fullstack.dto.ProductRequestDTO;
import com.example.price_wise_fullstack.dto.ProductResponseDTO;
import com.example.price_wise_fullstack.model.Product;
import com.example.price_wise_fullstack.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    private Product produto1, produto2, produto3;

    @BeforeEach
    void setup() {
        productRepository.deleteAll();

        produto1 = new Product();
        produto1.setName("Notebook Dell");
        produto1.setDescription("Intel i7");
        produto1.setPrice(new BigDecimal("4500.00"));
        produto1.setStock(10);
        productRepository.save(produto1);

        produto2 = new Product();
        produto2.setName("Mouse Logitech");
        produto2.setDescription("Wireless");
        produto2.setPrice(new BigDecimal("150.00"));
        produto2.setStock(25);
        productRepository.save(produto2);

        produto3 = new Product();
        produto3.setName("Teclado Mecânico");
        produto3.setDescription("RGB");
        produto3.setPrice(new BigDecimal("350.00"));
        produto3.setStock(0);
        productRepository.save(produto3);
    }

    @Test
    void deveCriarProdutoComSucesso() {
        ProductRequestDTO dto = new ProductRequestDTO();
        dto.setName("Monitor LG");
        dto.setDescription("27 polegadas 4K");
        dto.setPrice(new BigDecimal("1800.00"));
        dto.setStock(5);

        ProductResponseDTO response = productService.createProduct(dto);

        assertNotNull(response.getId());
        assertEquals("Monitor LG", response.getName());
        assertEquals(new BigDecimal("1800.00"), response.getPrice());
        assertEquals(5, response.getStock());
    }

    @Test
    void deveListarTodosProdutos() {
        PaginatedResponseDTO<ProductResponseDTO> result = productService.listFiltered(
            null, null, null, 1, 10, "name", "asc"
        );

        assertEquals(3, result.getTotalItems());
        assertEquals(1, result.getTotalPages());
        assertEquals(3, result.getData().size());
    }

    @Test
    void deveFiltrarProdutosPorNome() {
        PaginatedResponseDTO<ProductResponseDTO> result = productService.listFiltered(
            "Dell", null, null, 1, 10, "name", "asc"
        );

        assertEquals(1, result.getTotalItems());
        assertEquals("Notebook Dell", result.getData().get(0).getName());
    }

    @Test
    void deveFiltrarProdutosPorPrecoMinimo() {
        PaginatedResponseDTO<ProductResponseDTO> result = productService.listFiltered(
            null, new BigDecimal("200.00"), null, 1, 10, "name", "asc"
        );

        assertEquals(2, result.getTotalItems());
        assertTrue(result.getData().stream()
            .allMatch(p -> p.getPrice().compareTo(new BigDecimal("200.00")) >= 0));
    }

    @Test
    void deveFiltrarProdutosPorPrecoMaximo() {
        PaginatedResponseDTO<ProductResponseDTO> result = productService.listFiltered(
            null, null, new BigDecimal("500.00"), 1, 10, "name", "asc"
        );

        assertEquals(2, result.getTotalItems());
        assertTrue(result.getData().stream()
            .allMatch(p -> p.getPrice().compareTo(new BigDecimal("500.00")) <= 0));
    }

    @Test
    void deveFiltrarProdutosPorFaixaDePreco() {
        PaginatedResponseDTO<ProductResponseDTO> result = productService.listFiltered(
            null, new BigDecimal("100.00"), new BigDecimal("400.00"), 1, 10, "name", "asc"
        );

        assertEquals(2, result.getTotalItems());
    }

    @Test
    void deveOrdenarProdutosPorPrecoAscendente() {
        PaginatedResponseDTO<ProductResponseDTO> result = productService.listFiltered(
            null, null, null, 1, 10, "price", "asc"
        );

        assertEquals(new BigDecimal("150.00"), result.getData().get(0).getPrice());
        assertEquals(new BigDecimal("4500.00"), result.getData().get(2).getPrice());
    }

    @Test
    void deveOrdenarProdutosPorPrecoDescendente() {
        PaginatedResponseDTO<ProductResponseDTO> result = productService.listFiltered(
            null, null, null, 1, 10, "price", "desc"
        );

        assertEquals(new BigDecimal("4500.00"), result.getData().get(0).getPrice());
        assertEquals(new BigDecimal("150.00"), result.getData().get(2).getPrice());
    }

    @Test
    void deveOrdenarProdutosPorNomeAscendente() {
        PaginatedResponseDTO<ProductResponseDTO> result = productService.listFiltered(
            null, null, null, 1, 10, "name", "asc"
        );

        assertEquals("Mouse Logitech", result.getData().get(0).getName());
    }

    @Test
    void devePaginarResultadosCorretamente() {
        PaginatedResponseDTO<ProductResponseDTO> result = productService.listFiltered(
            null, null, null, 1, 2, "name", "asc"
        );

        assertEquals(3, result.getTotalItems());
        assertEquals(2, result.getTotalPages());
        assertEquals(2, result.getData().size());
        assertEquals(1, result.getPage());
    }

    @Test
    void deveRetornarPaginaVaziaQuandoNaoHouverResultados() {
        PaginatedResponseDTO<ProductResponseDTO> result = productService.listFiltered(
            "ProdutoInexistente", null, null, 1, 10, "name", "asc"
        );

        assertEquals(0, result.getTotalItems());
        assertEquals(0, result.getTotalPages());
        assertTrue(result.getData().isEmpty());
    }

    @Test
    void deveUsarOrdenacaoPadrao() {
        PaginatedResponseDTO<ProductResponseDTO> result = productService.listFiltered(
            null, null, null, 1, 10, null, null
        );

        assertEquals(3, result.getTotalItems());
        assertNotNull(result.getData());
    }

    @Test
    void deveTratarSortOrderInvalido() {
        assertThrows(IllegalArgumentException.class, () -> {
            productService.listFiltered(
                null, null, null, 1, 10, "name", "invalido"
            );
        });
    }
}
