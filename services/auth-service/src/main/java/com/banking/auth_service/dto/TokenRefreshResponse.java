package com.banking.auth_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for token refresh responses.
 */
@Schema(description = "Token Refresh Response")
public class TokenRefreshResponse {
    
    @Schema(description = "New JWT Access Token", 
            example = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;
    
    @Schema(description = "Refresh Token", 
            example = "550e8400-e29b-41d4-a716-446655440000")
    private String refreshToken;
    
    @Schema(description = "Token Type", example = "Bearer")
    private String tokenType;
    
    public TokenRefreshResponse() {
    }
    
    public TokenRefreshResponse(String accessToken, String refreshToken, String tokenType) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
    }
    
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public String getRefreshToken() {
        return refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}
