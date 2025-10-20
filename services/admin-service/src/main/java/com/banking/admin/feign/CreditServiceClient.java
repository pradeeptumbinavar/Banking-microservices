package com.banking.admin.feign;

import com.banking.admin.dto.ApprovalRequest;
import com.banking.admin.dto.ApprovalResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(
    name = "credit-service",
    path = "/credits",
    configuration = com.banking.admin.config.FeignConfig.class
)
public interface CreditServiceClient {
    
    @GetMapping("/approvals")
    List<ApprovalResponse> getPendingApprovals();
    
    @PostMapping("/approvals/bulk")
    String bulkApprove(@RequestBody ApprovalRequest request);
}

