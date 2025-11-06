package com.banking.auth_service.service;

import com.banking.auth_service.dto.UserUpdateRequest;
import com.banking.auth_service.entity.User;
import com.banking.auth_service.enums.UserRole;
import com.banking.auth_service.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTests {

    @Mock private UserRepository userRepository;
    @InjectMocks private AuthService authService;

    @Test
    @DisplayName("updateUser rejects duplicate email")
    void updateUser_duplicateEmail() {
        User existing = new User();
        existing.setId(1L);
        existing.setEmail("old@ex.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.existsByEmail("new@ex.com")).thenReturn(true);

        UserUpdateRequest req = new UserUpdateRequest();
        req.setEmail("new@ex.com");
        assertThrows(RuntimeException.class, () -> authService.updateUser(1L, req));
    }

    @Test
    @DisplayName("updateUser invalid role throws")
    void updateUser_invalidRole() {
        User existing = new User(); existing.setId(2L);
        when(userRepository.findById(2L)).thenReturn(Optional.of(existing));
        UserUpdateRequest req = new UserUpdateRequest();
        req.setRole("SOMETHING");
        assertThrows(RuntimeException.class, () -> authService.updateUser(2L, req));
    }

    @Test
    @DisplayName("updateUser updates fields and saves")
    void updateUser_ok() {
        User existing = new User();
        existing.setId(3L);
        existing.setEmail("old@ex.com");
        existing.setRole(UserRole.CUSTOMER);
        when(userRepository.findById(3L)).thenReturn(Optional.of(existing));
        when(userRepository.existsByEmail("new@ex.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UserUpdateRequest req = new UserUpdateRequest();
        req.setEmail("new@ex.com");
        req.setRole("ADMIN");
        req.setEnabled(true);

        User saved = authService.updateUser(3L, req);
        assertEquals("new@ex.com", saved.getEmail());
        assertEquals(UserRole.ADMIN, saved.getRole());
        assertTrue(saved.isEnabled());
    }
}
