package com.banking.auth_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for generic message responses.
 */
@Schema(description = "Generic Message Response")
public class MessageResponse {
    
    @Schema(description = "Response message", example = "User registered successfully!")
    private String message;
    
    public MessageResponse() {
    }
    
    public MessageResponse(String message) {
        this.message = message;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}
