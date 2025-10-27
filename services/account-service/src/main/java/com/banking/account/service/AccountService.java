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
import com.banking.account.enums.AccountStatus;
import com.banking.account.enums.AccountType;

@Service
@RequiredArgsConstructor
public class AccountService {
    
    private final AccountRepository accountRepository;
    
    @Transactional
    public AccountResponse createAccount(AccountRequest request) {
        Account account = Account.builder()
            .customerId(request.getCustomerId())
            .accountNumber(generateAccountNumber())
            .accountType(AccountType.valueOf(request.getAccountType().toUpperCase()))
            .balance(BigDecimal.ZERO)
            .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
            .status(AccountStatus.PENDING)
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
        List<Account> pendingAccounts = accountRepository.findByStatus(AccountStatus.PENDING);
        
        return pendingAccounts.stream()
            .map(a -> new ApprovalResponse(
                a.getId(),
                "ACCOUNT_OPENING",
                a.getStatus().name(),
                "Account opening for customer " + a.getCustomerId() + " - " + a.getAccountType().name()
            ))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void bulkApprove(ApprovalRequest request) {
        List<Account> accounts = accountRepository.findAllById(request.getIds());
        
        accounts.forEach(a -> a.setStatus(AccountStatus.valueOf(request.getStatus().toUpperCase())));
        accountRepository.saveAll(accounts);
    }
    
    @Transactional
    public AccountResponse updateAccount(Long id, AccountUpdateRequest request) {
        Account account = accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (request.getAccountType() != null) {
            try {
                AccountType accountType = AccountType.valueOf(request.getAccountType().toUpperCase());
                account.setAccountType(accountType);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid account type: " + request.getAccountType());
            }
        }
        
        if (request.getStatus() != null) {
            try {
                AccountStatus status = AccountStatus.valueOf(request.getStatus().toUpperCase());
                account.setStatus(status);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status: " + request.getStatus());
            }
        }
        
        account = accountRepository.save(account);
        return toResponse(account);
    }
    
    @Transactional
    public void closeAccount(Long id) {
        Account account = accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.setStatus(AccountStatus.CLOSED);
        accountRepository.save(account);
    }
    
    public List<AccountResponse> getAccountsByUserId(Long userId) {
        List<Account> accounts = accountRepository.findByCustomerId(userId);
        return accounts.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
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
            .accountType(account.getAccountType().name())
            .balance(account.getBalance())
            .currency(account.getCurrency())
            .status(account.getStatus().name())
            .createdAt(account.getCreatedAt())
            .updatedAt(account.getUpdatedAt())
            .build();
    }
}

