package com.banking.admin.service;

import com.banking.admin.dto.ApprovalRequest;
import com.banking.admin.dto.ApprovalResponse;
import com.banking.admin.feign.AccountServiceClient;
import com.banking.admin.feign.CreditServiceClient;
import com.banking.admin.feign.CustomerServiceClient;
import com.banking.admin.feign.PaymentServiceClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {
    
    private static final Logger log = LoggerFactory.getLogger(AdminService.class);
    
    private final CustomerServiceClient customerServiceClient;
    private final AccountServiceClient accountServiceClient;
    private final CreditServiceClient creditServiceClient;
    private final PaymentServiceClient paymentServiceClient;

    public AdminService(
            CustomerServiceClient customerServiceClient,
            AccountServiceClient accountServiceClient,
            CreditServiceClient creditServiceClient,
            PaymentServiceClient paymentServiceClient) {
        this.customerServiceClient = customerServiceClient;
        this.accountServiceClient = accountServiceClient;
        this.creditServiceClient = creditServiceClient;
        this.paymentServiceClient = paymentServiceClient;
    }
    
    @CircuitBreaker(name = "admin-service", fallbackMethod = "fallbackEmptyList")
    public List<ApprovalResponse> getCustomerPendingApprovals() {
        return customerServiceClient.getPendingApprovals();
    }

    public String bulkApproveCustomers(ApprovalRequest request) {
        return customerServiceClient.bulkApprove(request);
    }

    @CircuitBreaker(name = "admin-service", fallbackMethod = "fallbackEmptyList")
    public List<ApprovalResponse> getAccountPendingApprovals() {
        return accountServiceClient.getPendingApprovals();
    }

    public String bulkApproveAccounts(ApprovalRequest request) {
        return accountServiceClient.bulkApprove(request);
    }

    @CircuitBreaker(name = "admin-service", fallbackMethod = "fallbackEmptyList")
    public List<ApprovalResponse> getCreditPendingApprovals() {
        return creditServiceClient.getPendingApprovals();
    }

    public String bulkApproveCredits(ApprovalRequest request) {
        return creditServiceClient.bulkApprove(request);
    }

    @CircuitBreaker(name = "admin-service", fallbackMethod = "fallbackEmptyList")
    public List<ApprovalResponse> getPaymentPendingApprovals() {
        return paymentServiceClient.getPendingApprovals();
    }

    public String bulkApprovePayments(ApprovalRequest request) {
        return paymentServiceClient.bulkApprove(request);
    }

    private List<ApprovalResponse> fallbackEmptyList(Exception e) {
        log.error("Circuit breaker fallback: {}", e.getMessage());
        return new ArrayList<>();
    }
}

