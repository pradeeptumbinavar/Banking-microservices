package com.banking.account.dto;

import lombok.Data;

@Data
public class AccountUpdateRequest {
    private String accountType;
    private String status;
}
