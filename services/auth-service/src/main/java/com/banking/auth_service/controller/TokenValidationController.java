package com.banking.auth_service.controller;

import com.banking.auth_service.dto.TokenValidationResponse;
import com.banking.auth_service.security.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for token validation.
 * Used by other microservices to validate JWT tokens.
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Token Validation", 
     description = "Token validation and public key APIs for other microservices")
public class TokenValidationController {
    
    private final JwtUtils jwtUtils;
    
    public TokenValidationController(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }
    
    @PostMapping("/validate")
    @Operation(summary = "Validate JWT token", 
               description = "Validate JWT token and return user information (used by other microservices)",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token is valid",
            content = @Content(schema = @Schema(implementation = TokenValidationResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token is invalid or expired",
            content = @Content(schema = @Schema(implementation = TokenValidationResponse.class)))
    })
    public ResponseEntity<TokenValidationResponse> validateToken(
            @Parameter(description = "Bearer token in Authorization header", required = true)
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse(false, null, null, null));
            }
            
            String token = authHeader.substring(7);
            
            if (jwtUtils.validateJwtToken(token)) {
                String username = jwtUtils.getUsernameFromJwtToken(token);
                String role = jwtUtils.getRoleFromJwtToken(token);
                Long userId = jwtUtils.getUserIdFromJwtToken(token);
                
                return ResponseEntity.ok(new TokenValidationResponse(
                    true, username, role, userId
                ));
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new TokenValidationResponse(false, null, null, null));
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new TokenValidationResponse(false, null, null, null));
        }
    }
    
}
