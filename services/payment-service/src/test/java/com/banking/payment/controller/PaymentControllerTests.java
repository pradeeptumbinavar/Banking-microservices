package com.banking.payment.controller;

import com.banking.payment.dto.*;
import com.banking.payment.service.PaymentService;
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

@WebMvcTest(controllers = PaymentController.class)
@AutoConfigureMockMvc(addFilters = false)
class PaymentControllerTests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private PaymentService paymentService;

    @Test
    @DisplayName("POST /payments/transfer returns response (200)")
    void createTransfer_ok() throws Exception {
        TransferRequest req = new TransferRequest(1L, 2L, new BigDecimal("100.00"), "USD", "d");
        when(paymentService.createTransfer(any(TransferRequest.class)))
                .thenReturn(PaymentResponse.builder().id(1L).status("COMPLETED").build());

        mockMvc.perform(post("/payments/transfer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("GET /payments/approvals returns list (200)")
    void getApprovals_ok() throws Exception {
        when(paymentService.getPendingApprovals()).thenReturn(List.of(
                new ApprovalResponse(1L, "LARGE_PAYMENT", "PENDING", "d")
        ));
        mockMvc.perform(get("/payments/approvals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }
}

