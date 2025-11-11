package com.banking.account.enums;

public enum AccountStatus {
    PENDING,
    ACTIVE,
    SUSPENDED,
    CLOSED,
    // Backward-compat: earlier data may have APPROVED/REJECTED
    APPROVED,
    REJECTED
}
