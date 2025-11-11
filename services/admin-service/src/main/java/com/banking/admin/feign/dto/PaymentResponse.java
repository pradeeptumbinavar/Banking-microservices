package com.banking.admin.feign.dto;

import lombok.Data;

@Data
public class PaymentResponse {
    private Long id;
    private Long fromAccountId;
    private Long toAccountId;
    private java.math.BigDecimal amount;
    private String currency;
    private String paymentType;
    private String status;
    private String description;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
}
