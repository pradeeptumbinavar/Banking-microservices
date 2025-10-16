package com.banking.auth_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for user registration requests.
 */
@Schema(description = "User Registration Request")
public class SignupRequest {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    @Schema(description = "Username for the account", example = "johndoe", required = true)
    private String username;
    
    @NotBlank(message = "Email is required")
    @Size(max = 50, message = "Email must not exceed 50 characters")
    @Email(message = "Email must be valid")
    @Schema(description = "Email address", example = "john@example.com", required = true)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
    @Schema(description = "Password (minimum 6 characters)", example = "password123", required = true)
    private String password;
    
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "CUSTOMER|ADMIN", message = "Role must be either CUSTOMER or ADMIN")
    @Schema(description = "User role", example = "CUSTOMER", 
            allowableValues = {"CUSTOMER", "ADMIN"}, required = true)
    private String role;
    
    @Schema(description = "Enable Multi-Factor Authentication", example = "false", defaultValue = "false")
    private boolean mfaEnabled = false;
    
    public SignupRequest() {
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
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public boolean isMfaEnabled() {
        return mfaEnabled;
    }
    
    public void setMfaEnabled(boolean mfaEnabled) {
        this.mfaEnabled = mfaEnabled;
    }
}
