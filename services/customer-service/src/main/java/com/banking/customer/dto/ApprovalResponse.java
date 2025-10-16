package com.banking.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalResponse {
    private Long id;
    private String type; // CUSTOMER_KYC
    private String status;
    private String description;
}

