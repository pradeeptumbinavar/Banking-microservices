package com.banking.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalResponse {
    private Long id;
    private String type; // LARGE_PAYMENT
    private String status;
    private String description;
}

