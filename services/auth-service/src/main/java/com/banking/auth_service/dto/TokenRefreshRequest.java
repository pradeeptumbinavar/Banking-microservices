package com.banking.auth_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object for token refresh requests.
 */
@Schema(description = "Token Refresh Request")
public class TokenRefreshRequest {
    
    @NotBlank(message = "Refresh token is required")
    @Schema(description = "Refresh Token", 
            example = "550e8400-e29b-41d4-a716-446655440000", 
            required = true)
    private String refreshToken;
    
    public TokenRefreshRequest() {
    }
    
    public String getRefreshToken() {
        return refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
