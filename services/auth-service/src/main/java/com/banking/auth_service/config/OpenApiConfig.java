package com.banking.auth_service.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Banking System - Authentication Service API",
        version = "1.0.0",
        description = """
            Authentication and Authorization Service for Banking System.
            
            Features:
            - User registration with role-based access (CUSTOMER, ADMIN)
            - JWT token generation with RS256 asymmetric encryption
            - Refresh token mechanism for session management
            - Multi-factor authentication (MFA) support
            - Account lockout after failed login attempts
            - Token validation endpoint for microservices
            
            Security: All endpoints use JWT Bearer token authentication except public endpoints.
            """,
        contact = @Contact(
            name = "Banking System Team",
            email = "support@bankingsystem.com",
            url = "https://bankingsystem.com"
        ),
        license = @License(
            name = "MIT License",
            url = "https://opensource.org/licenses/MIT"
        )
    ),
    servers = {
        @Server(
            url = "http://localhost:8081",
            description = "Local Development Server"
        )
    },
    security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
    name = "bearerAuth",
    description = "JWT Bearer Token Authentication. Use the token received from /api/auth/signin endpoint.",
    scheme = "bearer",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
    // Configuration is done via annotations
}
