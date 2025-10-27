package com.banking.auth_service.service;

import com.banking.auth_service.dto.UserUpdateRequest;
import com.banking.auth_service.entity.User;
import com.banking.auth_service.enums.UserRole;
import com.banking.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    @Transactional
    public User updateUser(Long id, UserUpdateRequest updateRequest) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update email if provided
        if (updateRequest.getEmail() != null && !updateRequest.getEmail().isEmpty()) {
            if (userRepository.existsByEmail(updateRequest.getEmail()) && 
                !user.getEmail().equals(updateRequest.getEmail())) {
                throw new RuntimeException("Error: Email is already in use!");
            }
            user.setEmail(updateRequest.getEmail());
        }
        
        // Update role if provided
        if (updateRequest.getRole() != null && !updateRequest.getRole().isEmpty()) {
            try {
                UserRole role = UserRole.valueOf(updateRequest.getRole().toUpperCase());
                user.setRole(role);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Error: Role must be either CUSTOMER or ADMIN");
            }
        }
        
        // Update enabled status if provided
        if (updateRequest.getEnabled() != null) {
            user.setEnabled(updateRequest.getEnabled());
        }
        
        // Update timestamp
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
