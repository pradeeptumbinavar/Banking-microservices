package com.banking.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalResponse {
    private Long id;
    private String type;
    private String status;
    private String description;
    private String service; // Lombok @Data generates setService()
    
    public ApprovalResponse(Long id, String type, String status, String description) {
        this.id = id;
        this.type = type;
        this.status = status;
        this.description = description;
    }
}

