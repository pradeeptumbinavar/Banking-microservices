package com.banking.admin.controller;

import com.banking.admin.dto.ApprovalRequest;
import com.banking.admin.dto.ApprovalResponse;
import com.banking.admin.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@Tag(name = "Admin", description = "Admin aggregation and approval APIs")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {
    
    private final AdminService adminService;
    
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }
    
    @GetMapping("/customers/approvals")
    @Operation(summary = "Get pending customer KYC approvals")
    public ResponseEntity<List<ApprovalResponse>> getCustomerPendingApprovals() {
        return ResponseEntity.ok(adminService.getCustomerPendingApprovals());
    }

    @PostMapping("/customers/approvals/bulk")
    @Operation(summary = "Bulk approve/reject customer KYC")
    public ResponseEntity<String> bulkApproveCustomers(@RequestBody ApprovalRequest request) {
        return ResponseEntity.ok(adminService.bulkApproveCustomers(request));
    }

    @GetMapping("/accounts/approvals")
    @Operation(summary = "Get pending account approvals")
    public ResponseEntity<List<ApprovalResponse>> getAccountPendingApprovals() {
        return ResponseEntity.ok(adminService.getAccountPendingApprovals());
    }

    @PostMapping("/accounts/approvals/bulk")
    @Operation(summary = "Bulk approve/reject accounts")
    public ResponseEntity<String> bulkApproveAccounts(@RequestBody ApprovalRequest request) {
        return ResponseEntity.ok(adminService.bulkApproveAccounts(request));
    }

    @GetMapping("/credits/approvals")
    @Operation(summary = "Get pending credit approvals")
    public ResponseEntity<List<ApprovalResponse>> getCreditPendingApprovals() {
        return ResponseEntity.ok(adminService.getCreditPendingApprovals());
    }

    @PostMapping("/credits/approvals/bulk")
    @Operation(summary = "Bulk approve/reject credit products")
    public ResponseEntity<String> bulkApproveCredits(@RequestBody ApprovalRequest request) {
        return ResponseEntity.ok(adminService.bulkApproveCredits(request));
    }

    @GetMapping("/payments/approvals")
    @Operation(summary = "Get pending payment approvals")
    public ResponseEntity<List<ApprovalResponse>> getPaymentPendingApprovals() {
        return ResponseEntity.ok(adminService.getPaymentPendingApprovals());
    }

    @PostMapping("/payments/approvals/bulk")
    @Operation(summary = "Bulk approve/reject payments")
    public ResponseEntity<String> bulkApprovePayments(@RequestBody ApprovalRequest request) {
        return ResponseEntity.ok(adminService.bulkApprovePayments(request));
    }

    // Insights - fetch all entities for admin dashboards
    @GetMapping("/customers/all")
    @Operation(summary = "Get all customers (any status)")
    public ResponseEntity<java.util.List<com.banking.admin.feign.dto.CustomerResponse>> getAllCustomers() {
        return ResponseEntity.ok(adminService.getAllCustomers());
    }

    @GetMapping("/accounts/all")
    @Operation(summary = "Get all accounts (any status)")
    public ResponseEntity<java.util.List<com.banking.admin.feign.dto.AccountResponse>> getAllAccounts() {
        return ResponseEntity.ok(adminService.getAllAccounts());
    }

    @GetMapping("/payments/all")
    @Operation(summary = "Get all payments (any status)")
    public ResponseEntity<java.util.List<com.banking.admin.feign.dto.PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(adminService.getAllPayments());
    }

    @GetMapping("/credits/all")
    @Operation(summary = "Get all credit products (any status)")
    public ResponseEntity<java.util.List<com.banking.admin.feign.dto.CreditProductResponse>> getAllCredits() {
        return ResponseEntity.ok(adminService.getAllCredits());
    }
}

