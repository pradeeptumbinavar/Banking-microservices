package com.banking.customer.controller;

import com.banking.customer.dto.*;
import com.banking.customer.service.CustomerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = CustomerController.class)
@AutoConfigureMockMvc(addFilters = false)
class CustomerControllerTests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private CustomerService customerService;

    @Test
    @DisplayName("GET /customers/{id} returns customer (200)")
    void getCustomer_ok() throws Exception {
        CustomerResponse resp = CustomerResponse.builder().id(1L).firstName("John").lastName("Doe").build();
        when(customerService.getCustomer(1L)).thenReturn(resp);
        mockMvc.perform(get("/customers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("GET /customers/approvals returns list (200)")
    void getApprovals_ok() throws Exception {
        when(customerService.getPendingApprovals()).thenReturn(List.of(
                new ApprovalResponse(1L, "CUSTOMER_KYC", "PENDING", "d")
        ));
        mockMvc.perform(get("/customers/approvals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    @DisplayName("PATCH /customers/{id}/status updates status (200)")
    void updateStatus_ok() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("status", "APPROVED");
        when(customerService.updateCustomerStatus(5L, "APPROVED"))
                .thenReturn(CustomerResponse.builder().id(5L).kycStatus("APPROVED").build());

        mockMvc.perform(patch("/customers/5/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.kycStatus").value("APPROVED"));
    }
}

