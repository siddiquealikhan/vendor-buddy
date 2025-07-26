package com.vendorbuddy.service;

import com.vendorbuddy.model.Product;
import com.vendorbuddy.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public Page<Product> getAllProducts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findAll(pageable);
    }
    
    public Page<Product> searchProducts(String searchTerm, Double minPrice, Double maxPrice, 
                                      String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            if (minPrice != null && maxPrice != null) {
                return productRepository.findByTextSearchAndPriceRange(searchTerm, minPrice, maxPrice, pageable);
            } else {
                return productRepository.findByTextSearch(searchTerm, pageable);
            }
        } else if (category != null && !category.trim().isEmpty()) {
            if (minPrice != null && maxPrice != null) {
                return productRepository.findByCategoryAndPriceRange(category, minPrice, maxPrice, pageable);
            } else {
                return productRepository.findByCategory(category, pageable);
            }
        } else if (minPrice != null && maxPrice != null) {
            return productRepository.findByPriceRange(minPrice, maxPrice, pageable);
        } else {
            return productRepository.findAvailableProducts(pageable);
        }
    }
    
    public Product createProduct(Product product) {
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }
    
    public Product updateProduct(String id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (productDetails.getName() != null) {
            product.setName(productDetails.getName());
        }
        if (productDetails.getCategory() != null) {
            product.setCategory(productDetails.getCategory());
        }
        if (productDetails.getUnitPrice() != null) {
            product.setUnitPrice(productDetails.getUnitPrice());
        }
        if (productDetails.getUnitType() != null) {
            product.setUnitType(productDetails.getUnitType());
        }
        if (productDetails.getStock() != null) {
            product.setStock(productDetails.getStock());
        }
        if (productDetails.getDeliveryRange() != null) {
            product.setDeliveryRange(productDetails.getDeliveryRange());
        }
        if (productDetails.getImageUrl() != null) {
            product.setImageUrl(productDetails.getImageUrl());
        }
        if (productDetails.getDescription() != null) {
            product.setDescription(productDetails.getDescription());
        }
        
        product.setUpdatedAt(LocalDateTime.now());
        
        return productRepository.save(product);
    }
    
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }
    
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
    
    public List<Product> getProductsBySupplier(String supplierId) {
        return productRepository.findBySupplierId(supplierId);
    }
    
    public void updateStock(String productId, Integer quantity) {
        Product product = getProductById(productId);
        int newStock = product.getStock() - quantity;
        if (newStock < 0) {
            throw new RuntimeException("Insufficient stock");
        }
        product.setStock(newStock);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
    }
}