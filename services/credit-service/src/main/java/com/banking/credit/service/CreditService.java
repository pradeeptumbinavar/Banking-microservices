package com.banking.credit.service;

import com.banking.credit.dto.*;
import com.banking.credit.entity.CreditProduct;
import com.banking.credit.repository.CreditProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import com.banking.credit.enums.CreditProductStatus;
import com.banking.credit.enums.CreditProductType;

@Service
@RequiredArgsConstructor
public class CreditService {
    
    private final CreditProductRepository creditProductRepository;
    
    @Transactional
    public CreditProductResponse applyForLoan(LoanRequest request) {
        CreditProduct product = CreditProduct.builder()
            .customerId(request.getCustomerId())
            .productType(CreditProductType.LOAN)
            .amount(request.getAmount())
            .interestRate(request.getInterestRate())
            .termMonths(request.getTermMonths())
            .status(CreditProductStatus.PENDING)
            .build();
        
        product = creditProductRepository.save(product);
        return toResponse(product);
    }
    
    @Transactional
    public CreditProductResponse applyForCard(CardRequest request) {
        CreditProduct product = CreditProduct.builder()
            .customerId(request.getCustomerId())
            .productType(CreditProductType.CREDIT_CARD)
            .creditLimit(request.getCreditLimit())
            .interestRate(request.getInterestRate())
            .status(CreditProductStatus.PENDING)
            .build();
        
        product = creditProductRepository.save(product);
        return toResponse(product);
    }
    
    public List<ApprovalResponse> getPendingApprovals() {
        List<CreditProduct> pendingProducts = creditProductRepository.findByStatus(CreditProductStatus.PENDING);
        
        return pendingProducts.stream()
            .map(p -> new ApprovalResponse(
                p.getId(),
                p.getProductType().equals(CreditProductType.LOAN) ? "LOAN_APPLICATION" : "CARD_APPLICATION",
                p.getStatus().name(),
                p.getProductType().name() + " application for customer " + p.getCustomerId()
            ))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void bulkApprove(ApprovalRequest request) {
        List<CreditProduct> products = creditProductRepository.findAllById(request.getIds());
        
        products.forEach(p -> p.setStatus(CreditProductStatus.valueOf(request.getStatus().toUpperCase())));
        creditProductRepository.saveAll(products);
    }
    
    @Transactional
    public CreditProductResponse updateCreditProduct(Long id, CreditProductUpdateRequest request) {
        CreditProduct product = creditProductRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Credit product not found"));
        
        if (request.getAmount() != null) {
            product.setAmount(request.getAmount());
        }
        
        if (request.getCreditLimit() != null) {
            product.setCreditLimit(request.getCreditLimit());
        }
        
        if (request.getInterestRate() != null) {
            product.setInterestRate(request.getInterestRate());
        }
        
        if (request.getStatus() != null) {
            try {
                CreditProductStatus status = CreditProductStatus.valueOf(request.getStatus().toUpperCase());
                product.setStatus(status);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status: " + request.getStatus());
            }
        }
        
        product = creditProductRepository.save(product);
        return toResponse(product);
    }
    
    @Transactional
    public void closeCreditProduct(Long id) {
        CreditProduct product = creditProductRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Credit product not found"));
        
        product.setStatus(CreditProductStatus.CLOSED);
        creditProductRepository.save(product);
    }
    
    public List<CreditProductResponse> getCreditProductsByUserId(Long userId) {
        List<CreditProduct> products = creditProductRepository.findByCustomerId(userId);
        return products.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    private CreditProductResponse toResponse(CreditProduct product) {
        return CreditProductResponse.builder()
            .id(product.getId())
            .customerId(product.getCustomerId())
            .productType(product.getProductType().name())
            .amount(product.getAmount())
            .creditLimit(product.getCreditLimit())
            .interestRate(product.getInterestRate())
            .termMonths(product.getTermMonths())
            .status(product.getStatus().name())
            .createdAt(product.getCreatedAt())
            .updatedAt(product.getUpdatedAt())
            .build();
    }
}

