package com.banking.payment.enums;

public enum PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REJECTED,
    // Backward-compat: legacy rows may contain APPROVED
    APPROVED
}
