package com.banking.account.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalRequest {
    private List<Long> ids;
    private String status; // ACTIVE, REJECTED
}

