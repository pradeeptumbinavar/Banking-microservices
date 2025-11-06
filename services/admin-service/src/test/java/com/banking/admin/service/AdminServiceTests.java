package com.banking.admin.service;

import com.banking.admin.dto.ApprovalRequest;
import com.banking.admin.dto.ApprovalResponse;
import com.banking.admin.feign.AccountServiceClient;
import com.banking.admin.feign.CreditServiceClient;
import com.banking.admin.feign.CustomerServiceClient;
import com.banking.admin.feign.PaymentServiceClient;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminServiceTests {

    @Mock private CustomerServiceClient customerClient;
    @Mock private AccountServiceClient accountClient;
    @Mock private CreditServiceClient creditClient;
    @Mock private PaymentServiceClient paymentClient;

    @InjectMocks
    private AdminService adminService;

    @Test
    @DisplayName("getCustomerPendingApprovals returns list")
    void getCustomerPendingApprovals_ok() {
        List<ApprovalResponse> expected = Arrays.asList(
                new ApprovalResponse(1L, "CUSTOMER_KYC", "PENDING", "desc", "customer-service"));
        when(customerClient.getPendingApprovals()).thenReturn(expected);

        List<ApprovalResponse> result = adminService.getCustomerPendingApprovals();
        assertEquals(1, result.size());
        assertEquals(expected, result);
    }

    @Test
    @DisplayName("getCustomerPendingApprovals throws when client fails (no CB in unit test)")
    void getCustomerPendingApprovals_error() {
        when(customerClient.getPendingApprovals()).thenThrow(new RuntimeException("fail"));
        assertThrows(RuntimeException.class, () -> adminService.getCustomerPendingApprovals());
    }

    @Test
    @DisplayName("bulkApproveCustomers delegates to client and returns message")
    void bulkApproveCustomers_ok() {
        when(customerClient.bulkApprove(any(ApprovalRequest.class))).thenReturn("OK");
        String msg = adminService.bulkApproveCustomers(new ApprovalRequest(Arrays.asList(1L), "APPROVED"));
        assertEquals("OK", msg);
        verify(customerClient).bulkApprove(any(ApprovalRequest.class));
    }

    @Test
    @DisplayName("account approvals flow works")
    void accountApprovals_ok() {
        when(accountClient.getPendingApprovals()).thenReturn(Arrays.asList(
                new ApprovalResponse(10L, "ACCOUNT_OPENING", "PENDING", "desc", "account-service")));
        when(accountClient.bulkApprove(any(ApprovalRequest.class))).thenReturn("done");

        assertEquals(1, adminService.getAccountPendingApprovals().size());
        assertEquals("done", adminService.bulkApproveAccounts(new ApprovalRequest(Arrays.asList(10L), "APPROVED")));
    }
}

