package com.example.price_wise_fullstack.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import org.springframework.data.domain.*;

import com.example.price_wise_fullstack.dto.ProductRequestDTO;
import com.example.price_wise_fullstack.dto.ProductResponseDTO;
import com.example.price_wise_fullstack.mapper.ProductMapper;
import com.example.price_wise_fullstack.model.Product;
import com.example.price_wise_fullstack.repository.ProductRepository;
import com.example.price_wise_fullstack.dto.PaginatedResponseDTO;

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

    public PaginatedResponseDTO<ProductResponseDTO> listFiltered(
        String search,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        int page,
        int limit,
        String sortBy,
        String sortOrder
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);
        Pageable pageable = PageRequest.of(page - 1, limit, sort);

        Specification<Product> spec = ProductSpecification.filterBy(search, minPrice, maxPrice);
        Page<Product> resultPage = productRepository.findAll(spec, pageable);

        Page<ProductResponseDTO> dtoPage = resultPage.map(ProductMapper::toDTO);
        return new PaginatedResponseDTO<>(dtoPage);
    }

}
