package com.banking.customer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KycRequest {
    
    @NotBlank(message = "Document type is required")
    private String documentType; // PASSPORT, DRIVERS_LICENSE, NATIONAL_ID
    
    @NotBlank(message = "Document number is required")
    private String documentNumber;
}

