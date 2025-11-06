package com.banking.admin.controller;

import com.banking.admin.dto.ApprovalRequest;
import com.banking.admin.dto.ApprovalResponse;
import com.banking.admin.service.AdminService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
@org.springframework.context.annotation.Import(TestExceptionHandler.class)
class AdminControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AdminService adminService;

    @Test
    @DisplayName("GET /admin/customers/approvals returns list (200)")
    void getCustomerPendingApprovals_ok() throws Exception {
        List<ApprovalResponse> list = Arrays.asList(
                new ApprovalResponse(1L, "CUSTOMER_KYC", "PENDING", "desc", "customer-service"),
                new ApprovalResponse(2L, "CUSTOMER_KYC", "PENDING", "desc2", "customer-service")
        );
        when(adminService.getCustomerPendingApprovals()).thenReturn(list);

        mockMvc.perform(get("/admin/customers/approvals"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @DisplayName("POST /admin/customers/approvals/bulk returns message (200)")
    void bulkApproveCustomers_ok() throws Exception {
        when(adminService.bulkApproveCustomers(any(ApprovalRequest.class))).thenReturn("Approvals processed successfully");

        ApprovalRequest req = new ApprovalRequest(Arrays.asList(1L, 2L), "APPROVED");

        mockMvc.perform(post("/admin/customers/approvals/bulk")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("Approvals processed successfully"));
    }

    @Test
    @DisplayName("GET /admin/customers/approvals propagates error (500)")
    void getCustomerPendingApprovals_error() throws Exception {
        when(adminService.getCustomerPendingApprovals()).thenThrow(new RuntimeException("downstream error"));

        mockMvc.perform(get("/admin/customers/approvals"))
                .andExpect(status().is5xxServerError());
    }
}
