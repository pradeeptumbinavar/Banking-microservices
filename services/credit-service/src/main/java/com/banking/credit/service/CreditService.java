package com.banking.credit.service;

import com.banking.credit.dto.*;
import com.banking.credit.entity.CreditProduct;
import com.banking.credit.repository.CreditProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CreditService {
    
    private final CreditProductRepository creditProductRepository;
    
    @Transactional
    public CreditProductResponse applyForLoan(LoanRequest request) {
        CreditProduct product = CreditProduct.builder()
            .customerId(request.getCustomerId())
            .productType("LOAN")
            .amount(request.getAmount())
            .interestRate(request.getInterestRate())
            .termMonths(request.getTermMonths())
            .status("PENDING")
            .build();
        
        product = creditProductRepository.save(product);
        return toResponse(product);
    }
    
    @Transactional
    public CreditProductResponse applyForCard(CardRequest request) {
        CreditProduct product = CreditProduct.builder()
            .customerId(request.getCustomerId())
            .productType("CREDIT_CARD")
            .creditLimit(request.getCreditLimit())
            .interestRate(request.getInterestRate())
            .status("PENDING")
            .build();
        
        product = creditProductRepository.save(product);
        return toResponse(product);
    }
    
    public List<ApprovalResponse> getPendingApprovals() {
        List<CreditProduct> pendingProducts = creditProductRepository.findByStatus("PENDING");
        
        return pendingProducts.stream()
            .map(p -> new ApprovalResponse(
                p.getId(),
                p.getProductType().equals("LOAN") ? "LOAN_APPLICATION" : "CARD_APPLICATION",
                p.getStatus(),
                p.getProductType() + " application for customer " + p.getCustomerId()
            ))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void bulkApprove(ApprovalRequest request) {
        List<CreditProduct> products = creditProductRepository.findAllById(request.getIds());
        
        products.forEach(p -> p.setStatus(request.getStatus()));
        creditProductRepository.saveAll(products);
    }
    
    private CreditProductResponse toResponse(CreditProduct product) {
        return CreditProductResponse.builder()
            .id(product.getId())
            .customerId(product.getCustomerId())
            .productType(product.getProductType())
            .amount(product.getAmount())
            .creditLimit(product.getCreditLimit())
            .interestRate(product.getInterestRate())
            .termMonths(product.getTermMonths())
            .status(product.getStatus())
            .createdAt(product.getCreatedAt())
            .updatedAt(product.getUpdatedAt())
            .build();
    }
}

