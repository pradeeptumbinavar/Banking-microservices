package com.banking.auth_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object for user login requests.
 */
@Schema(description = "User Login Request")
public class LoginRequest {
    
    @NotBlank(message = "Username is required")
    @Schema(description = "Username", example = "johndoe", required = true)
    private String username;
    
    @NotBlank(message = "Password is required")
    @Schema(description = "Password", example = "password123", required = true)
    private String password;
    
    @Schema(description = "MFA Code (required if MFA is enabled)", example = "123456")
    private String mfaCode;
    
    public LoginRequest() {
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getMfaCode() {
        return mfaCode;
    }
    
    public void setMfaCode(String mfaCode) {
        this.mfaCode = mfaCode;
    }
}
