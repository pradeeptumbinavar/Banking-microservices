package com.banking.auth_service.controller;

import com.banking.auth_service.dto.*;
import com.banking.auth_service.entity.RefreshToken;
import com.banking.auth_service.entity.User;
import com.banking.auth_service.enums.UserRole;
import com.banking.auth_service.exception.TokenRefreshException;
import com.banking.auth_service.repository.UserRepository;
import com.banking.auth_service.security.JwtUtils;
import com.banking.auth_service.security.UserDetailsImpl;
import com.banking.auth_service.service.AuthService;
import com.banking.auth_service.service.MfaService;
import com.banking.auth_service.service.RefreshTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for authentication endpoints.
 * Handles user registration, login, token refresh, and logout.
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication and Authorization APIs")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final MfaService mfaService;
    private final AuthService authService;
    
    public AuthController(AuthenticationManager authenticationManager,
                         UserRepository userRepository,
                         PasswordEncoder passwordEncoder,
                         JwtUtils jwtUtils,
                         RefreshTokenService refreshTokenService,
                         MfaService mfaService,
                         AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
        this.mfaService = mfaService;
        this.authService = authService;
    }
    
    @PostMapping("/signup")
    @Operation(summary = "Register a new user", 
               description = "Create a new user account with role CUSTOMER or ADMIN")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User registered successfully",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "400", description = "Username or email already exists",
            content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    })
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        
        // Validate username
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
        }
        
        // Validate email
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Email is already in use!"));
        }
        
        // Validate role (only CUSTOMER or ADMIN)
        if (!signUpRequest.getRole().equals("CUSTOMER") && 
            !signUpRequest.getRole().equals("ADMIN")) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Role must be either CUSTOMER or ADMIN"));
        }
        
        // Create new user account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(UserRole.valueOf(signUpRequest.getRole().toUpperCase()));
        user.setEnabled(true);
        user.setAccountNonLocked(true);
        user.setFailedLoginAttempts(0);
        
        // Handle MFA
        String mfaQrCode = null;
        if (signUpRequest.isMfaEnabled()) {
            String secret = mfaService.generateMfaSecret();
            user.setMfaSecret(secret);
            user.setMfaEnabled(true);
            mfaQrCode = mfaService.generateQrCodeUrl(user.getUsername(), secret);
        }
        
        user = userRepository.save(user);
        
        // Generate JWT token for the new user (auto-login after registration)
        String accessToken = jwtUtils.generateTokenFromUsername(user.getUsername(), user.getRole().name(), user.getId());
        String refreshToken = refreshTokenService.createRefreshToken(user.getId()).getToken();
        
        if (mfaQrCode != null) {
            return ResponseEntity.ok(new AuthResponse(
                accessToken, refreshToken, "Bearer", 3600L,
                user.getId(), user.getUsername(), user.getEmail(), user.getRole().name(),
                mfaQrCode
            ));
        }
        
        return ResponseEntity.ok(new AuthResponse(
            accessToken, refreshToken, "Bearer", 3600L,
            user.getId(), user.getUsername(), user.getEmail(), user.getRole().name(),
            null
        ));
    }
    
    @PostMapping("/signin")
    @Operation(summary = "User login", 
               description = "Authenticate user and return JWT tokens")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful",
            content = @Content(schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid credentials or MFA code",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "403", description = "Account is locked",
            content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    })
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()));
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            // Check if account is locked
            if (!userDetails.isAccountNonLocked()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Account is locked. Contact administrator."));
            }
            
            // Verify MFA if enabled
            if (userDetails.isMfaEnabled()) {
                if (loginRequest.getMfaCode() == null || loginRequest.getMfaCode().isEmpty()) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("MFA code required"));
                }
                
                if (!mfaService.verifyCode(userDetails.getMfaSecret(), 
                                          loginRequest.getMfaCode())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("Invalid MFA code"));
                }
            }
            
            // Generate JWT token
            String jwt = jwtUtils.generateJwtToken(userDetails);
            
            // Generate refresh token
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(
                userDetails.getId());
            
            // Update user last login and reset failed attempts
            User user = userRepository.findById(userDetails.getId()).orElseThrow();
            user.setLastLogin(LocalDateTime.now());
            user.setFailedLoginAttempts(0);
            userRepository.save(user);
            
            return ResponseEntity.ok(new AuthResponse(
                jwt,
                refreshToken.getToken(),
                "Bearer",
                900L, // 15 minutes in seconds
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getRole(),
                null
            ));
            
        } catch (BadCredentialsException e) {
            // Handle failed login attempts
            User user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
            if (user != null) {
                user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
                
                // Lock account after 5 failed attempts
                if (user.getFailedLoginAttempts() >= 5) {
                    user.setAccountNonLocked(false);
                    userRepository.save(user);
                    
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse(
                            "Account locked due to too many failed login attempts"));
                }
                
                userRepository.save(user);
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Invalid username or password"));
        }
    }
    
    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", 
               description = "Generate a new access token using refresh token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token refreshed successfully",
            content = @Content(schema = @Schema(implementation = TokenRefreshResponse.class))),
        @ApiResponse(responseCode = "403", description = "Refresh token expired or invalid",
            content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    })
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        
        try {
            return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtils.generateTokenFromUsername(
                        user.getUsername(),
                        user.getRole().name(),
                        user.getId()
                    );
                    
                    return ResponseEntity.ok(new TokenRefreshResponse(
                        token,
                        requestRefreshToken,
                        "Bearer"
                    ));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                    "Refresh token is not in database!"));
        } catch (TokenRefreshException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    @Operation(summary = "User logout", 
               description = "Invalidate refresh token and logout user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Logout successful",
            content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    })
    public ResponseEntity<?> logoutUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        refreshTokenService.deleteByUserId(userDetails.getId());
        
        return ResponseEntity.ok(new MessageResponse("Log out successful!"));
    }
    
    @GetMapping("/public-key")
    @Operation(summary = "Get public key", 
               description = "Retrieve RSA public key for JWT validation")
    public ResponseEntity<?> getPublicKey() {
        String publicKeyPem = Base64.getEncoder().encodeToString(jwtUtils.getPublicKey().getEncoded());
        return ResponseEntity.ok(new MessageResponse(publicKeyPem));
    }
    
    @GetMapping("/me")
    @Operation(summary = "Get current user", 
               description = "Get authenticated user information")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return ResponseEntity.ok(new AuthResponse(
            null, null, null, null,
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail(),
            userDetails.getRole(),
            null
        ));
    }
    @Operation(summary = "Get all users", 
               description = "Retrieve a list of all users (Admin only)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Users retrieved successfully",
            content = @Content(schema = @Schema(implementation = List.class))),
        @ApiResponse(responseCode = "403", description = "Access denied - Admin role required",
            content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    })
    public ResponseEntity<?> getAllUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Check if user is admin
        if (!userDetails.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new MessageResponse("Access denied. Admin role required."));
        }
        
        List<User> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/{id}")
    @Operation(summary = "Get user by ID", 
               description = "Retrieve a specific user by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User retrieved successfully",
            content = @Content(schema = @Schema(implementation = User.class))),
        @ApiResponse(responseCode = "404", description = "User not found",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "403", description = "Access denied",
            content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    })
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Users can only access their own data unless they are admin
        if (!userDetails.getId().equals(id) && !userDetails.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new MessageResponse("Access denied. You can only access your own data."));
        }
        
        Optional<User> user = authService.getUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("User not found"));
        }
    }
    
    @PutMapping("/users/{id}")
    @Operation(summary = "Update user", 
               description = "Update user information such as email or role")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User updated successfully",
            content = @Content(schema = @Schema(implementation = User.class))),
        @ApiResponse(responseCode = "404", description = "User not found",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "403", description = "Access denied",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid data",
            content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    })
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest updateRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Users can only update their own data unless they are admin
        if (!userDetails.getId().equals(id) && !userDetails.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new MessageResponse("Access denied. You can only update your own data."));
        }
        
        Optional<User> userOpt = authService.getUserById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("User not found"));
        }
        
        User user = userOpt.get();
        
        // Update email if provided
        if (updateRequest.getEmail() != null && !updateRequest.getEmail().isEmpty()) {
            if (authService.existsByEmail(updateRequest.getEmail()) && 
                !user.getEmail().equals(updateRequest.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
            }
            user.setEmail(updateRequest.getEmail());
        }
        
        // Update role if provided (only admin can change roles)
        if (updateRequest.getRole() != null && !updateRequest.getRole().isEmpty()) {
            if (!userDetails.getRole().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Access denied. Only admin can change roles."));
            }
            if (!updateRequest.getRole().equals("CUSTOMER") && 
                !updateRequest.getRole().equals("ADMIN")) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Role must be either CUSTOMER or ADMIN"));
            }
            user.setRole(UserRole.valueOf(updateRequest.getRole().toUpperCase()));
        }
        
        // Update enabled status if provided (only admin can change)
        if (updateRequest.getEnabled() != null) {
            if (!userDetails.getRole().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Access denied. Only admin can change enabled status."));
            }
            user.setEnabled(updateRequest.getEnabled());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);
        
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user", 
               description = "Delete a user account (Admin only)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User deleted successfully",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "404", description = "User not found",
            content = @Content(schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "403", description = "Access denied - Admin role required",
            content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    })
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Only admin can delete users
        if (!userDetails.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new MessageResponse("Access denied. Admin role required."));
        }
        
        // Prevent admin from deleting themselves
        if (userDetails.getId().equals(id)) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Cannot delete your own account."));
        }
        
        Optional<User> userOpt = authService.getUserById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("User not found"));
        }
        
        // Delete refresh tokens first
        refreshTokenService.deleteByUserId(id);
        
        // Delete user
        authService.deleteUser(id);
        
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }
}
