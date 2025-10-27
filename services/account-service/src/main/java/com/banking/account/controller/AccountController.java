package com.banking.account.controller;

import com.banking.account.dto.*;
import com.banking.account.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
@Tag(name = "Account", description = "Account management APIs")
@SecurityRequirement(name = "bearerAuth")
public class AccountController {
    
    private final AccountService accountService;
    
    @PostMapping
    @Operation(summary = "Create new account")
    public ResponseEntity<AccountResponse> createAccount(@Valid @RequestBody AccountRequest request) {
        return ResponseEntity.ok(accountService.createAccount(request));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get account by ID")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable("id") Long id) {
        return ResponseEntity.ok(accountService.getAccount(id));
    }
    
    @GetMapping("/{id}/balance")
    @Operation(summary = "Get account balance")
    public ResponseEntity<BalanceResponse> getBalance(@PathVariable("id") Long id) {
        return ResponseEntity.ok(accountService.getBalance(id));
    }
    
    @GetMapping("/approvals")
    @Operation(summary = "Get pending account approvals")
    public ResponseEntity<List<ApprovalResponse>> getPendingApprovals() {
        return ResponseEntity.ok(accountService.getPendingApprovals());
    }
    
    @PostMapping("/approvals/bulk")
    @Operation(summary = "Bulk approve/reject accounts")
    public ResponseEntity<String> bulkApprove(@Valid @RequestBody ApprovalRequest request) {
        accountService.bulkApprove(request);
        return ResponseEntity.ok("Approvals processed successfully");
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update account details")
    public ResponseEntity<AccountResponse> updateAccount(
            @PathVariable("id") Long id,
            @Valid @RequestBody AccountUpdateRequest request) {
        return ResponseEntity.ok(accountService.updateAccount(id, request));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Close account")
    public ResponseEntity<String> closeAccount(@PathVariable("id") Long id) {
        accountService.closeAccount(id);
        return ResponseEntity.ok("Account closed successfully");
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get accounts by user ID")
    public ResponseEntity<List<AccountResponse>> getAccountsByUserId(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(accountService.getAccountsByUserId(userId));
    }
}

