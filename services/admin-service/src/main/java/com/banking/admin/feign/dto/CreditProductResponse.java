package com.banking.admin.feign.dto;

import lombok.Data;

@Data
public class CreditProductResponse {
    private Long id;
    private Long customerId;
    private String productType;
    private String loanType;
    private String cardType;
}
