package com.banking.account.service;

import com.banking.account.dto.*;
import com.banking.account.entity.Account;
import com.banking.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {
    
    private final AccountRepository accountRepository;
    
    @Transactional
    public AccountResponse createAccount(AccountRequest request) {
        Account account = Account.builder()
            .customerId(request.getCustomerId())
            .accountNumber(generateAccountNumber())
            .accountType(request.getAccountType())
            .balance(BigDecimal.ZERO)
            .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
            .status("PENDING")
            .build();
        
        account = accountRepository.save(account);
        return toResponse(account);
    }
    
    public AccountResponse getAccount(Long id) {
        Account account = accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        return toResponse(account);
    }
    
    public BalanceResponse getBalance(Long id) {
        Account account = accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        
        return new BalanceResponse(
            account.getId(),
            account.getAccountNumber(),
            account.getBalance(),
            account.getCurrency()
        );
    }
    
    public List<ApprovalResponse> getPendingApprovals() {
        List<Account> pendingAccounts = accountRepository.findByStatus("PENDING");
        
        return pendingAccounts.stream()
            .map(a -> new ApprovalResponse(
                a.getId(),
                "ACCOUNT_OPENING",
                a.getStatus(),
                "Account opening for customer " + a.getCustomerId() + " - " + a.getAccountType()
            ))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void bulkApprove(ApprovalRequest request) {
        List<Account> accounts = accountRepository.findAllById(request.getIds());
        
        accounts.forEach(a -> a.setStatus(request.getStatus()));
        accountRepository.saveAll(accounts);
    }
    
    private String generateAccountNumber() {
        Random random = new Random();
        long number = 1000000000L + (long)(random.nextDouble() * 9000000000L);
        return String.valueOf(number);
    }
    
    private AccountResponse toResponse(Account account) {
        return AccountResponse.builder()
            .id(account.getId())
            .customerId(account.getCustomerId())
            .accountNumber(account.getAccountNumber())
            .accountType(account.getAccountType())
            .balance(account.getBalance())
            .currency(account.getCurrency())
            .status(account.getStatus())
            .createdAt(account.getCreatedAt())
            .updatedAt(account.getUpdatedAt())
            .build();
    }
}

