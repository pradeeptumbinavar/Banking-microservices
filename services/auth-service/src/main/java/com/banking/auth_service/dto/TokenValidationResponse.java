package com.banking.auth_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for token validation responses.
 * Used by other microservices to validate JWT tokens.
 */
@Schema(description = "Token Validation Response")
public class TokenValidationResponse {
    
    @Schema(description = "Token validity status", example = "true")
    private boolean valid;
    
    @Schema(description = "Username", example = "johndoe")
    private String username;
    
    @Schema(description = "User Role", example = "CUSTOMER")
    private String role;
    
    @Schema(description = "User ID", example = "1")
    private Long userId;
    
    public TokenValidationResponse() {
    }
    
    public TokenValidationResponse(boolean valid, String username, String role, Long userId) {
        this.valid = valid;
        this.username = username;
        this.role = role;
        this.userId = userId;
    }
    
    public boolean isValid() {
        return valid;
    }
    
    public void setValid(boolean valid) {
        this.valid = valid;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
