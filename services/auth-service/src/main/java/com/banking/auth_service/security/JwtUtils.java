package com.banking.auth_service.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

/**
 * JWT utility class for token generation and validation using RS256 algorithm.
 * Uses RSA public/private key pair for asymmetric encryption.
 */
@Component
public class JwtUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
    
    @Value("${jwt.private-key}")
    private Resource privateKeyResource;
    
    @Value("${jwt.public-key}")
    private Resource publicKeyResource;
    
    @Value("${jwt.access-token-expiration}")
    private long jwtAccessTokenExpiration;
    
    private PrivateKey privateKey;
    private PublicKey publicKey;
    
    @PostConstruct
    public void init() {
        try {
            // Check if keys exist, if not generate them
            ensureKeysExist();
            
            // Load keys
            this.privateKey = loadPrivateKey();
            this.publicKey = loadPublicKey();
            logger.info("✅ RSA keys loaded successfully for JWT operations");
        } catch (Exception e) {
            logger.error("❌ Failed to load RSA keys: {}", e.getMessage());
            throw new RuntimeException("Could not load RSA keys", e);
        }
    }
    
    /**
     * Ensure RSA keys exist, generate if missing.
     */
    private void ensureKeysExist() throws Exception {
        File keysDir = new File("src/main/resources/keys");
        File privateKeyFile = new File(keysDir, "private_key.pem");
        File publicKeyFile = new File(keysDir, "public_key.pem");
        
        if (!privateKeyFile.exists() || !publicKeyFile.exists()) {
            logger.info("🔑 RSA keys not found. Generating new key pair...");
            
            // Create directory
            if (!keysDir.exists()) {
                keysDir.mkdirs();
            }
            
            // Generate keys
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            KeyPair keyPair = keyPairGenerator.generateKeyPair();
            
            PrivateKey privateKey = keyPair.getPrivate();
            PublicKey publicKey = keyPair.getPublic();
            
            // Save private key
            try (FileOutputStream fos = new FileOutputStream(privateKeyFile)) {
                fos.write("-----BEGIN PRIVATE KEY-----\n".getBytes());
                fos.write(Base64.getMimeEncoder(64, "\n".getBytes()).encode(privateKey.getEncoded()));
                fos.write("\n-----END PRIVATE KEY-----\n".getBytes());
            }
            
            // Save public key
            try (FileOutputStream fos = new FileOutputStream(publicKeyFile)) {
                fos.write("-----BEGIN PUBLIC KEY-----\n".getBytes());
                fos.write(Base64.getMimeEncoder(64, "\n".getBytes()).encode(publicKey.getEncoded()));
                fos.write("\n-----END PUBLIC KEY-----\n".getBytes());
            }
            
            logger.info("✅ RSA keys generated successfully!");
        }
    }
    
    /**
     * Load private key from PEM file.
     */
    private PrivateKey loadPrivateKey() throws Exception {
        byte[] keyBytes = privateKeyResource.getContentAsByteArray();
        String privateKeyPEM = new String(keyBytes)
            .replace("-----BEGIN PRIVATE KEY-----", "")
            .replace("-----END PRIVATE KEY-----", "")
            .replaceAll("\\s", "");
        
        byte[] decoded = Base64.getDecoder().decode(privateKeyPEM);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(spec);
    }
    
    /**
     * Load public key from PEM file.
     */
    private PublicKey loadPublicKey() throws Exception {
        byte[] keyBytes = publicKeyResource.getContentAsByteArray();
        String publicKeyPEM = new String(keyBytes)
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replace("-----END PUBLIC KEY-----", "")
            .replaceAll("\\s", "");
        
        byte[] decoded = Base64.getDecoder().decode(publicKeyPEM);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePublic(spec);
    }
    
    // ... rest of your methods remain the same ...
    
    public String generateJwtToken(UserDetailsImpl userDetails) {
        return generateTokenFromUsername(
            userDetails.getUsername(), 
            userDetails.getRole(), 
            userDetails.getId()
        );
    }
    
    public String generateTokenFromUsername(String username, String role, Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtAccessTokenExpiration);
        
        return Jwts.builder()
            .subject(username)
            .claim("role", role)
            .claim("userId", userId)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(privateKey)
            .compact();
    }
    
    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser()
            .verifyWith((java.security.interfaces.RSAPublicKey) publicKey)
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }
    
    public String getRoleFromJwtToken(String token) {
        Claims claims = Jwts.parser()
            .verifyWith((java.security.interfaces.RSAPublicKey) publicKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
        return claims.get("role", String.class);
    }
    
    public Long getUserIdFromJwtToken(String token) {
        Claims claims = Jwts.parser()
            .verifyWith((java.security.interfaces.RSAPublicKey) publicKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
        return claims.get("userId", Long.class);
    }
    
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                .verifyWith((java.security.interfaces.RSAPublicKey) publicKey)
                .build()
                .parseSignedClaims(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
    
    public PublicKey getPublicKey() {
        return publicKey;
    }
}
