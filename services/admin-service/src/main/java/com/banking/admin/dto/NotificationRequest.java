package com.banking.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private Long userId;
    private String type; // EMAIL, SMS, PUSH
    private String recipient;
    private String subject;
    private String message;
}

