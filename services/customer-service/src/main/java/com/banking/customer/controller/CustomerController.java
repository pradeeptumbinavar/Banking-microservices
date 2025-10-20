package com.banking.customer.controller;

import com.banking.customer.dto.*;
import com.banking.customer.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@Tag(name = "Customer", description = "Customer management APIs")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {
    
    private final CustomerService customerService;

    @PostMapping
    @Operation(summary = "Create customer profile")
    public ResponseEntity<CustomerResponse> createCustomer(
            Authentication authentication,
            @Valid @RequestBody CustomerRequest request) {

        var jwt = (org.springframework.security.oauth2.jwt.Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("userId");

        return ResponseEntity.ok(customerService.createCustomer(userId, request));
    }


    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID")
    public ResponseEntity<CustomerResponse> getCustomer(@PathVariable("id") Long id) {
        return ResponseEntity.ok(customerService.getCustomer(id));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update customer profile")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable("id") Long id,
            @Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(customerService.updateCustomer(id, request));
    }
    
    @PostMapping("/{id}/kyc")
    @Operation(summary = "Submit KYC documents")
    public ResponseEntity<CustomerResponse> submitKyc(
            @PathVariable("id") Long id,
            @Valid @RequestBody KycRequest request) {
        return ResponseEntity.ok(customerService.submitKyc(id, request));
    }
    
    @GetMapping("/approvals")
    @Operation(summary = "Get pending KYC approvals")
    public ResponseEntity<List<ApprovalResponse>> getPendingApprovals() {
        return ResponseEntity.ok(customerService.getPendingApprovals());
    }
    
    @PostMapping("/approvals/bulk")
    @Operation(summary = "Bulk approve/reject KYC")
    public ResponseEntity<String> bulkApprove(@Valid @RequestBody ApprovalRequest request) {
        customerService.bulkApprove(request);
        return ResponseEntity.ok("Approvals processed successfully");
    }
}

