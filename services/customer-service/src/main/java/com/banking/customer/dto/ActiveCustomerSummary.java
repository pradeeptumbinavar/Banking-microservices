package com.banking.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActiveCustomerSummary {
    private Long id;
    private String firstName;
    private String lastName;
}
