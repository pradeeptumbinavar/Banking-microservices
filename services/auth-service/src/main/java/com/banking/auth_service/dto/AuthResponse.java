package com.banking.auth_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for authentication responses.
 * Contains JWT tokens and user information.
 */
@Schema(description = "Authentication Response containing tokens and user information")
public class AuthResponse {
    
    @Schema(description = "JWT Access Token", 
            example = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;
    
    @Schema(description = "Refresh Token", 
            example = "550e8400-e29b-41d4-a716-446655440000")
    private String refreshToken;
    
    @Schema(description = "Token Type", example = "Bearer")
    private String tokenType;
    
    @Schema(description = "Access Token expiration in seconds", example = "900")
    private Long expiresIn;
    
    @Schema(description = "User ID", example = "1")
    private Long id;
    
    @Schema(description = "Username", example = "johndoe")
    private String username;
    
    @Schema(description = "Email address", example = "john@example.com")
    private String email;
    
    @Schema(description = "User Role", example = "CUSTOMER", 
            allowableValues = {"CUSTOMER", "ADMIN"})
    private String role;
    
    @Schema(description = "MFA QR Code (only present during registration if MFA is enabled)")
    private String mfaQrCode;
    
    public AuthResponse() {
    }
    
    public AuthResponse(String accessToken, String refreshToken, String tokenType, 
                       Long expiresIn, Long id, String username, String email, 
                       String role, String mfaQrCode) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.mfaQrCode = mfaQrCode;
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
    
    public Long getExpiresIn() {
        return expiresIn;
    }
    
    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getMfaQrCode() {
        return mfaQrCode;
    }
    
    public void setMfaQrCode(String mfaQrCode) {
        this.mfaQrCode = mfaQrCode;
    }
}
