package com.banking.auth_service.service;

import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.springframework.stereotype.Service;

import java.util.Base64;

/**
 * Service for Multi-Factor Authentication (MFA) operations.
 * Uses TOTP (Time-based One-Time Password) algorithm.
 */
@Service
public class MfaService {
    
    /**
     * Generate MFA secret for user.
     */
    public String generateMfaSecret() {
        SecretGenerator secretGenerator = new DefaultSecretGenerator();
        return secretGenerator.generate();
    }
    
    /**
     * Generate QR code URL for Google Authenticator.
     */
    public String generateQrCodeUrl(String username, String secret) {
        QrData data = new QrData.Builder()
            .label(username)
            .secret(secret)
            .issuer("BankingSystem")
            .algorithm(HashingAlgorithm.SHA1)
            .digits(6)
            .period(30)
            .build();
        
        QrGenerator generator = new ZxingPngQrGenerator();
        byte[] imageData;
        try {
            imageData = generator.generate(data);
        } catch (QrGenerationException e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
        
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageData);
    }
    
    /**
     * Verify MFA code against secret.
     */
    public boolean verifyCode(String secret, String code) {
        if (secret == null || code == null) {
            return false;
        }
        
        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
        
        return verifier.isValidCode(secret, code);
    }
}
