package com.banking.credit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditProductResponse {
    private Long id;
    private Long customerId;
    private String productType;
    private String cardType;
    private String loanType;
    private BigDecimal amount;
    private BigDecimal creditLimit;
    private BigDecimal interestRate;
    private Integer termMonths;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

