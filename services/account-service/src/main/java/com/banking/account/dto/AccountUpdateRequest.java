package com.banking.account.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class AccountUpdateRequest {
    private BigDecimal balance;
}
