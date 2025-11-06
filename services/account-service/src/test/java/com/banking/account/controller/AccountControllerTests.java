package com.banking.account.controller;

import com.banking.account.dto.*;
import com.banking.account.service.AccountService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AccountController.class)
@AutoConfigureMockMvc(addFilters = false)
@org.springframework.context.annotation.Import(TestExceptionHandler.class)
class AccountControllerTests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private AccountService accountService;

    @Test
    @DisplayName("GET /accounts/{id} returns account (200)")
    void getAccount_ok() throws Exception {
        AccountResponse resp = AccountResponse.builder().id(1L).accountNumber("123").status("PENDING").build();
        when(accountService.getAccount(1L)).thenReturn(resp);

        mockMvc.perform(get("/accounts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("GET /accounts/{id} when service throws -> 500")
    void getAccount_error() throws Exception {
        when(accountService.getAccount(99L)).thenThrow(new RuntimeException("not found"));

        mockMvc.perform(get("/accounts/99"))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @DisplayName("POST /accounts creates account (200)")
    void createAccount_ok() throws Exception {
        AccountRequest req = new AccountRequest(1L, "SAVINGS", null);
        AccountResponse resp = AccountResponse.builder().id(10L).customerId(1L).status("PENDING").build();
        when(accountService.createAccount(any(AccountRequest.class))).thenReturn(resp);

        mockMvc.perform(post("/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    @DisplayName("GET /accounts/approvals returns list (200)")
    void getApprovals_ok() throws Exception {
        when(accountService.getPendingApprovals()).thenReturn(List.of(
                new com.banking.account.dto.ApprovalResponse(1L, "ACCOUNT_OPENING", "PENDING", "d")
        ));

        mockMvc.perform(get("/accounts/approvals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    @DisplayName("GET /accounts/user/{userId}?status=ACTIVE calls filtered service")
    void getAccountsByUserId_withStatus() throws Exception {
        when(accountService.getAccountsByUserId(eq(5L), eq("ACTIVE"))).thenReturn(List.of());

        mockMvc.perform(get("/accounts/user/5").param("status", "ACTIVE"))
                .andExpect(status().isOk());

        verify(accountService).getAccountsByUserId(5L, "ACTIVE");
        verify(accountService, never()).getAccountsByUserId(5L);
    }
}
