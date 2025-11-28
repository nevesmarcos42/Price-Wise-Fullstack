package com.example.price_wise_fullstack.controller;

import com.example.price_wise_fullstack.dto.ProductRequestDTO;
import com.example.price_wise_fullstack.model.Product;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@SuppressWarnings("null")
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Product produto1, produto2;

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
    }

    @Test
    void deveListarTodosProdutos() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("page", "1")
                .param("limit", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data", hasSize(2)))
            .andExpect(jsonPath("$.totalItems", is(2)))
            .andExpect(jsonPath("$.totalPages", is(1)))
            .andExpect(jsonPath("$.page", is(1)));
    }

    @Test
    void deveFiltrarProdutosPorNome() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("search", "Dell")
                .param("page", "1")
                .param("limit", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data", hasSize(1)))
            .andExpect(jsonPath("$.data[0].name", is("Notebook Dell")));
    }

    @Test
    void deveFiltrarProdutosPorPreco() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("minPrice", "100")
                .param("maxPrice", "200")
                .param("page", "1")
                .param("limit", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data", hasSize(1)))
            .andExpect(jsonPath("$.data[0].name", is("Mouse Logitech")));
    }

    @Test
    void deveOrdenarProdutos() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("sortBy", "price")
                .param("sortOrder", "desc")
                .param("page", "1")
                .param("limit", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data[0].name", is("Notebook Dell")))
            .andExpect(jsonPath("$.data[1].name", is("Mouse Logitech")));
    }

    @Test
    void deveCriarProdutoComSucesso() throws Exception {
        ProductRequestDTO dto = new ProductRequestDTO();
        dto.setName("Teclado Mecânico");
        dto.setDescription("RGB");
        dto.setPrice(new BigDecimal("350.00"));
        dto.setStock(15);

        mockMvc.perform(post("/api/v1/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name", is("Teclado Mecânico")))
            .andExpect(jsonPath("$.price", is(350.00)))
            .andExpect(jsonPath("$.stock", is(15)))
            .andExpect(jsonPath("$.id", notNullValue()));
    }

    @Test
    void deveRetornarBadRequestAoCriarProdutoInvalido() throws Exception {
        ProductRequestDTO dto = new ProductRequestDTO();
        dto.setName("");
        dto.setPrice(new BigDecimal("-10.00"));
        dto.setStock(-5);

        mockMvc.perform(post("/api/v1/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void deveTratarParametrosInvalidos() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("page", "0")
                .param("limit", "10"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void deveRetornarPaginaVaziaQuandoNaoHouverResultados() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("search", "ProdutoInexistente")
                .param("page", "1")
                .param("limit", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data", hasSize(0)))
            .andExpect(jsonPath("$.totalItems", is(0)));
    }

    @Test
    void deveUsarValoresPadraoQuandoParametrosOmitidos() throws Exception {
        mockMvc.perform(get("/api/v1/products"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data", hasSize(2)))
            .andExpect(jsonPath("$.page", is(1)));
    }
}
