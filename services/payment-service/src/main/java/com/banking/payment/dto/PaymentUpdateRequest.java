package com.banking.payment.dto;

import lombok.Data;

@Data
public class PaymentUpdateRequest {
    private String status;
    private String description;
}
