package com.banking.auth_service.controller;

import com.banking.auth_service.security.JwtUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = TokenValidationController.class)
@AutoConfigureMockMvc(addFilters = false)
class TokenValidationControllerTests {

    @Autowired private MockMvc mockMvc;
    @MockBean private JwtUtils jwtUtils;
    @MockBean private com.banking.auth_service.security.JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean private com.banking.auth_service.service.UserDetailsServiceImpl userDetailsService;
    @MockBean private com.banking.auth_service.security.JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @DisplayName("POST /auth/validate with valid token returns user info (200)")
    void validateToken_ok() throws Exception {
        when(jwtUtils.validateJwtToken(anyString())).thenReturn(true);
        when(jwtUtils.getUsernameFromJwtToken(anyString())).thenReturn("user1");
        when(jwtUtils.getRoleFromJwtToken(anyString())).thenReturn("ADMIN");
        when(jwtUtils.getUserIdFromJwtToken(anyString())).thenReturn(1L);

        mockMvc.perform(post("/auth/validate").header("Authorization", "Bearer abc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true))
                .andExpect(jsonPath("$.username").value("user1"))
                .andExpect(jsonPath("$.role").value("ADMIN"))
                .andExpect(jsonPath("$.userId").value(1));
    }

    @Test
    @DisplayName("POST /auth/validate without header returns 400")
    void validateToken_missingHeader() throws Exception {
        mockMvc.perform(post("/auth/validate"))
                .andExpect(status().isBadRequest());
    }
}
