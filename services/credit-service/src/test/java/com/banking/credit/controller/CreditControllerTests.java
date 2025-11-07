package com.banking.credit.controller;

import com.banking.credit.dto.*;
import com.banking.credit.service.CreditService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = CreditController.class)
@AutoConfigureMockMvc(addFilters = false)
class CreditControllerTests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private CreditService creditService;

    @Test
    @DisplayName("POST /credits/loans returns response (200)")
    void applyForLoan_ok() throws Exception {
        LoanRequest req = new LoanRequest(1L, new BigDecimal("1000"), new BigDecimal("5.5"), 12, "PERSONAL");
        when(creditService.applyForLoan(any(LoanRequest.class)))
                .thenReturn(CreditProductResponse.builder().id(1L).status("PENDING").build());

        mockMvc.perform(post("/credits/loans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("GET /credits/approvals returns list (200)")
    void getApprovals_ok() throws Exception {
        when(creditService.getPendingApprovals()).thenReturn(List.of(
                new ApprovalResponse(1L, "LOAN_APPLICATION", "PENDING", "d")
        ));

        mockMvc.perform(get("/credits/approvals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }
}
