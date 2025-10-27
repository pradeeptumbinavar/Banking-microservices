package com.banking.payment.controller;

import com.banking.payment.dto.*;
import com.banking.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "Payment and transfer APIs")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {
    
    private final PaymentService paymentService;
    
    @PostMapping("/transfer")
    @Operation(summary = "Create fund transfer")
    public ResponseEntity<PaymentResponse> createTransfer(@Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(paymentService.createTransfer(request));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable("id") Long id) {
        return ResponseEntity.ok(paymentService.getPayment(id));
    }
    
    @GetMapping("/approvals")
    @Operation(summary = "Get pending payment approvals")
    public ResponseEntity<List<ApprovalResponse>> getPendingApprovals() {
        return ResponseEntity.ok(paymentService.getPendingApprovals());
    }
    
    @PostMapping("/approvals/bulk")
    @Operation(summary = "Bulk approve/reject payments")
    public ResponseEntity<String> bulkApprove(@Valid @RequestBody ApprovalRequest request) {
        paymentService.bulkApprove(request);
        return ResponseEntity.ok("Approvals processed successfully");
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update payment details")
    public ResponseEntity<PaymentResponse> updatePayment(
            @PathVariable("id") Long id,
            @Valid @RequestBody PaymentUpdateRequest request) {
        return ResponseEntity.ok(paymentService.updatePayment(id, request));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel payment")
    public ResponseEntity<String> cancelPayment(@PathVariable("id") Long id) {
        paymentService.cancelPayment(id);
        return ResponseEntity.ok("Payment cancelled successfully");
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get payments by user ID")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByUserId(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUserId(userId));
    }
}

