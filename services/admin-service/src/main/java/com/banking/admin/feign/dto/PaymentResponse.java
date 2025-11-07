package com.banking.admin.feign.dto;

import lombok.Data;

@Data
public class PaymentResponse {
    private Long id;
    private Long fromAccountId;
    private Long toAccountId;
    private String status;
    private String currency;
    private java.math.BigDecimal amount;
}

