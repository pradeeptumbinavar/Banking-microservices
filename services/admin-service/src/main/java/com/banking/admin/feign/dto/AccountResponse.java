package com.banking.admin.feign.dto;

import lombok.Data;

@Data
public class AccountResponse {
    private Long id;
    private Long customerId;
    private String accountNumber;
}

