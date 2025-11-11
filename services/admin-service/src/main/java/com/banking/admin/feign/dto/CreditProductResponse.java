package com.banking.admin.feign.dto;

import lombok.Data;

@Data
public class CreditProductResponse {
    private Long id;
    private Long customerId;
    private String productType;
    private String loanType;
    private String cardType;
    private java.math.BigDecimal amount;
    private java.math.BigDecimal creditLimit;
    private java.math.BigDecimal interestRate;
    private Integer termMonths;
    private String status;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
}
