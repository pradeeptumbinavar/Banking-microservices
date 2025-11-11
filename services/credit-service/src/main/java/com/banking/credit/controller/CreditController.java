package com.banking.credit.controller;

import com.banking.credit.dto.*;
import com.banking.credit.service.CreditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/credits")
@RequiredArgsConstructor
@Tag(name = "Credit", description = "Credit product management APIs")
@SecurityRequirement(name = "bearerAuth")
public class CreditController {
    
    private final CreditService creditService;
    
    @PostMapping("/loans")
    @Operation(summary = "Apply for loan")
    public ResponseEntity<CreditProductResponse> applyForLoan(@Valid @RequestBody LoanRequest request) {
        return ResponseEntity.ok(creditService.applyForLoan(request));
    }
    
    @PostMapping("/cards")
    @Operation(summary = "Apply for credit card")
    public ResponseEntity<CreditProductResponse> applyForCard(@Valid @RequestBody CardRequest request) {
        return ResponseEntity.ok(creditService.applyForCard(request));
    }
    
    @GetMapping("/approvals")
    @Operation(summary = "Get pending credit approvals")
    public ResponseEntity<List<ApprovalResponse>> getPendingApprovals() {
        return ResponseEntity.ok(creditService.getPendingApprovals());
    }
    
    @PostMapping("/approvals/bulk")
    @Operation(summary = "Bulk approve/reject credit applications")
    public ResponseEntity<String> bulkApprove(@Valid @RequestBody ApprovalRequest request) {
        creditService.bulkApprove(request);
        return ResponseEntity.ok("Approvals processed successfully");
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update credit product details")
    public ResponseEntity<CreditProductResponse> updateCreditProduct(
            @PathVariable("id") Long id,
            @Valid @RequestBody CreditProductUpdateRequest request) {
        return ResponseEntity.ok(creditService.updateCreditProduct(id, request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get credit product by ID")
    public ResponseEntity<CreditProductResponse> getCreditProductById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(creditService.getCreditProduct(id));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Close or cancel credit product")
    public ResponseEntity<String> closeCreditProduct(@PathVariable("id") Long id) {
        creditService.closeCreditProduct(id);
        return ResponseEntity.ok("Credit product closed successfully");
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get credit products by user ID")
    public ResponseEntity<List<CreditProductResponse>> getCreditProductsByUserId(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(creditService.getCreditProductsByUserId(userId));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all credit products (any status)")
    public ResponseEntity<List<CreditProductResponse>> getAllCreditProducts() {
        return ResponseEntity.ok(creditService.getAllCreditProducts());
    }
}

