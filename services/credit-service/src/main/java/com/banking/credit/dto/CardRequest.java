package com.banking.credit.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardRequest {
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    @NotNull(message = "Credit limit is required")
    private BigDecimal creditLimit;
    
    @NotNull(message = "Interest rate is required")
    private BigDecimal interestRate;
}

