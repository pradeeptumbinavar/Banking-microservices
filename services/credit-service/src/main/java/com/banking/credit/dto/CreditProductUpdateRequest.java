package com.banking.credit.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreditProductUpdateRequest {
    private BigDecimal amount;
    private BigDecimal creditLimit;
    private BigDecimal interestRate;
    private String status;
}
