package com.banking.admin.feign.dto;

import lombok.Data;

@Data
public class AccountResponse {
    private Long id;
    private Long customerId;
    private String accountNumber;
    private String accountType;
    private java.math.BigDecimal balance;
    private String currency;
    private String status;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
}
