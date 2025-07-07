package com.example.price_wise_fullstack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.price_wise_fullstack.dto.ProductRequestDTO;
import com.example.price_wise_fullstack.dto.ProductResponseDTO;
import com.example.price_wise_fullstack.mapper.ProductMapper;
import com.example.price_wise_fullstack.model.Product;
import com.example.price_wise_fullstack.repository.ProductRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public ProductResponseDTO createProduct(ProductRequestDTO dto) {
        String normalizedName = dto.getName().trim().toLowerCase();
        if (productRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nome de produto já existente");
        }

        Product product = ProductMapper.toEntity(dto);
        Product saved = productRepository.save(product);
        return ProductMapper.toDTO(saved);
    }

    public List<ProductResponseDTO> listAll() {
        return productRepository.findAll()
                .stream()
                .map(ProductMapper::toDTO)
                .toList();
    }
}
