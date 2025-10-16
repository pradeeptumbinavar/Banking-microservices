package com.banking.credit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalResponse {
    private Long id;
    private String type; // LOAN_APPLICATION, CARD_APPLICATION
    private String status;
    private String description;
}

