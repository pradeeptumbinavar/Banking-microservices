package com.banking.auth_service.service;

import com.banking.auth_service.entity.RefreshToken;
import com.banking.auth_service.entity.User;
import com.banking.auth_service.exception.TokenRefreshException;
import com.banking.auth_service.repository.RefreshTokenRepository;
import com.banking.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing refresh tokens.
 * Handles token creation, validation, and expiration.
 */
@Service
public class RefreshTokenService {
    
    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenDurationMs;
    
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Find refresh token by token string.
     */
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }
    
    /**
     * Create or rotate refresh token for a user.
     * Ensures a single refresh token row per user (One-to-One mapping).
     */
    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Prefer updating existing row to reduce churn; fall back to insert if none
        return refreshTokenRepository.findByUserId(userId)
            .map(existing -> {
                existing.setToken(UUID.randomUUID().toString());
                existing.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
                return refreshTokenRepository.save(existing);
            })
            .orElseGet(() -> {
                RefreshToken refreshToken = new RefreshToken();
                refreshToken.setUser(user);
                refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
                refreshToken.setToken(UUID.randomUUID().toString());
                return refreshTokenRepository.save(refreshToken);
            });
    }
    
    /**
     * Verify refresh token expiration.
     * Deletes token if expired.
     */
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(),
                "Refresh token was expired. Please make a new signin request");
        }
        
        return token;
    }
    
    /**
     * Delete refresh token by user ID.
     */
    @Transactional
    public int deleteByUserId(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return refreshTokenRepository.deleteByUser(user);
    }
}
