package com.banking.credit.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanRequest {
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    @NotNull(message = "Loan amount is required")
    private BigDecimal amount;
    
    @NotNull(message = "Interest rate is required")
    private BigDecimal interestRate;
    
    @NotNull(message = "Term in months is required")
    private Integer termMonths;
}

