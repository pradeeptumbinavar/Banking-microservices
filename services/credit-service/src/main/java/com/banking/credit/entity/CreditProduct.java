package com.banking.credit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditProduct {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long customerId;
    
    @Column(nullable = false)
    private String productType; // LOAN, CREDIT_CARD
    
    @Column(precision = 19, scale = 2)
    private BigDecimal amount; // For loans
    
    @Column(precision = 19, scale = 2)
    private BigDecimal creditLimit; // For credit cards
    
    @Column(precision = 5, scale = 2)
    private BigDecimal interestRate;
    
    private Integer termMonths; // For loans
    
    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED, ACTIVE, CLOSED
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

