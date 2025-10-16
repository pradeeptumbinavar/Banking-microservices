package com.banking.admin.service;

import com.banking.admin.dto.ApprovalRequest;
import com.banking.admin.dto.ApprovalResponse;
import com.banking.admin.feign.*;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private static final Logger log = LoggerFactory.getLogger(AdminService.class);
    
    private final CustomerServiceClient customerServiceClient;
    private final AccountServiceClient accountServiceClient;
    private final CreditServiceClient creditServiceClient;
    private final PaymentServiceClient paymentServiceClient;
    
    @CircuitBreaker(name = "admin-service", fallbackMethod = "getPendingApprovalsFallback")
    public List<ApprovalResponse> getPendingApprovals() {
        List<ApprovalResponse> allApprovals = new ArrayList<>();
        
        try {
            List<ApprovalResponse> customerApprovals = customerServiceClient.getPendingApprovals();
            customerApprovals.forEach(a -> a.setService("customer-service"));
            allApprovals.addAll(customerApprovals);
        } catch (Exception e) {
            log.error("Failed to fetch customer approvals: {}", e.getMessage());
        }
        
        try {
            List<ApprovalResponse> accountApprovals = accountServiceClient.getPendingApprovals();
            accountApprovals.forEach(a -> a.setService("account-service"));
            allApprovals.addAll(accountApprovals);
        } catch (Exception e) {
            log.error("Failed to fetch account approvals: {}", e.getMessage());
        }
        
        try {
            List<ApprovalResponse> creditApprovals = creditServiceClient.getPendingApprovals();
            creditApprovals.forEach(a -> a.setService("credit-service"));
            allApprovals.addAll(creditApprovals);
        } catch (Exception e) {
            log.error("Failed to fetch credit approvals: {}", e.getMessage());
        }
        
        try {
            List<ApprovalResponse> paymentApprovals = paymentServiceClient.getPendingApprovals();
            paymentApprovals.forEach(a -> a.setService("payment-service"));
            allApprovals.addAll(paymentApprovals);
        } catch (Exception e) {
            log.error("Failed to fetch payment approvals: {}", e.getMessage());
        }
        
        return allApprovals;
    }
    
    public Map<String, String> executeApprovals(Map<String, ApprovalRequest> approvalsByService) {
        Map<String, String> results = new HashMap<>();
        
        if (approvalsByService.containsKey("customer-service")) {
            try {
                String result = customerServiceClient.bulkApprove(approvalsByService.get("customer-service"));
                results.put("customer-service", result);
            } catch (Exception e) {
                results.put("customer-service", "Failed: " + e.getMessage());
            }
        }
        
        if (approvalsByService.containsKey("account-service")) {
            try {
                String result = accountServiceClient.bulkApprove(approvalsByService.get("account-service"));
                results.put("account-service", result);
            } catch (Exception e) {
                results.put("account-service", "Failed: " + e.getMessage());
            }
        }
        
        if (approvalsByService.containsKey("credit-service")) {
            try {
                String result = creditServiceClient.bulkApprove(approvalsByService.get("credit-service"));
                results.put("credit-service", result);
            } catch (Exception e) {
                results.put("credit-service", "Failed: " + e.getMessage());
            }
        }
        
        if (approvalsByService.containsKey("payment-service")) {
            try {
                String result = paymentServiceClient.bulkApprove(approvalsByService.get("payment-service"));
                results.put("payment-service", result);
            } catch (Exception e) {
                results.put("payment-service", "Failed: " + e.getMessage());
            }
        }
        
        return results;
    }
    
    private List<ApprovalResponse> getPendingApprovalsFallback(Exception e) {
        log.error("Circuit breaker fallback: {}", e.getMessage());
        return new ArrayList<>();
    }
}

