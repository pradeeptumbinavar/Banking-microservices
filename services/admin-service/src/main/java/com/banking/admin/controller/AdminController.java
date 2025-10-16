package com.banking.admin.controller;

import com.banking.admin.dto.ApprovalRequest;
import com.banking.admin.dto.ApprovalResponse;
import com.banking.admin.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin aggregation and approval APIs")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {
    
    private final AdminService adminService;
    
    @GetMapping("/approvals/pending")
    @Operation(summary = "Get all pending approvals from all services")
    public ResponseEntity<List<ApprovalResponse>> getPendingApprovals() {
        return ResponseEntity.ok(adminService.getPendingApprovals());
    }
    
    @PostMapping("/approvals/execute")
    @Operation(summary = "Execute bulk approvals across services")
    public ResponseEntity<Map<String, String>> executeApprovals(
            @RequestBody Map<String, ApprovalRequest> approvalsByService) {
        return ResponseEntity.ok(adminService.executeApprovals(approvalsByService));
    }
}

