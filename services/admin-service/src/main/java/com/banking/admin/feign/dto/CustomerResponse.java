package com.banking.admin.feign.dto;

import lombok.Data;

@Data
public class CustomerResponse {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
}

