package com.banking.admin.feign.dto;

import lombok.Data;

@Data
public class CustomerResponse {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String kycStatus;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
}
