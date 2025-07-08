package com.example.price_wise_fullstack.dto;

import org.springframework.data.domain.Page;

import lombok.Data;

import java.util.List;

@Data
public class PaginatedResponseDTO<T> {
    private List<T> data;
    private int page;
    private int limit;
    private long totalItems;
    private int totalPages;

    public PaginatedResponseDTO(Page<T> pageData) {
        this.data = pageData.getContent();
        this.page = pageData.getNumber() + 1;
        this.limit = pageData.getSize();
        this.totalItems = pageData.getTotalElements();
        this.totalPages = pageData.getTotalPages();
    }
}

