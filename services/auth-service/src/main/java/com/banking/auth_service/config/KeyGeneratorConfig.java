package com.banking.auth_service.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;

/**
 * Generates RSA key pair if not already present.
 * Keys are generated ONCE and reused on subsequent startups.
 */
@Component
public class KeyGeneratorConfig implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(KeyGeneratorConfig.class);
    
    @Override
    public void run(String... args) throws Exception {
        File keysDir = new File("src/main/resources/keys");
        File privateKeyFile = new File(keysDir, "private_key.pem");
        File publicKeyFile = new File(keysDir, "public_key.pem");
        
        // Create keys directory if not exists
        if (!keysDir.exists()) {
            keysDir.mkdirs();
            logger.info("Created keys directory: {}", keysDir.getAbsolutePath());
        }
        
        // Generate keys only if they don't exist
        if (!privateKeyFile.exists() || !publicKeyFile.exists()) {
            logger.info("RSA keys not found. Generating new 2048-bit key pair...");
            generateKeyPair(privateKeyFile, publicKeyFile);
            logger.info("✅ RSA key pair generated successfully!");
            logger.info("📁 Private key: {}", privateKeyFile.getAbsolutePath());
            logger.info("📁 Public key: {}", publicKeyFile.getAbsolutePath());
            logger.info("⚠️  Keys will be REUSED on future startups (not regenerated)");
            logger.info("⚠️  NEVER commit private_key.pem to git!");
        } else {
            logger.info("✅ RSA keys found. Using existing keys.");
            logger.info("📁 Private key: {}", privateKeyFile.getAbsolutePath());
            logger.info("📁 Public key: {}", publicKeyFile.getAbsolutePath());
        }
    }
    
    private void generateKeyPair(File privateKeyFile, File publicKeyFile) throws Exception {
        // Generate RSA key pair (2048 bits)
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(2048);
        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        
        PrivateKey privateKey = keyPair.getPrivate();
        PublicKey publicKey = keyPair.getPublic();
        
        // Save private key in PEM format
        try (FileOutputStream fos = new FileOutputStream(privateKeyFile)) {
            fos.write("-----BEGIN PRIVATE KEY-----\n".getBytes());
            fos.write(Base64.getMimeEncoder(64, "\n".getBytes()).encode(privateKey.getEncoded()));
            fos.write("\n-----END PRIVATE KEY-----\n".getBytes());
        }
        
        // Save public key in PEM format
        try (FileOutputStream fos = new FileOutputStream(publicKeyFile)) {
            fos.write("-----BEGIN PUBLIC KEY-----\n".getBytes());
            fos.write(Base64.getMimeEncoder(64, "\n".getBytes()).encode(publicKey.getEncoded()));
            fos.write("\n-----END PUBLIC KEY-----\n".getBytes());
        }
    }
}
