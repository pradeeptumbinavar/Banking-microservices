package com.banking.account.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalResponse {
    private Long id;
    private String type; // ACCOUNT_OPENING
    private String status;
    private String description;
}

