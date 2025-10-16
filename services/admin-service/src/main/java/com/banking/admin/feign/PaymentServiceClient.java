package com.banking.admin.feign;

import com.banking.admin.dto.ApprovalRequest;
import com.banking.admin.dto.ApprovalResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "payment-service")
public interface PaymentServiceClient {
    
    @GetMapping("/payments/approvals")
    List<ApprovalResponse> getPendingApprovals();
    
    @PostMapping("/payments/approvals/bulk")
    String bulkApprove(@RequestBody ApprovalRequest request);
}

