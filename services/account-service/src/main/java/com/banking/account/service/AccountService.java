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
        
        if (request.getBalance() != null) {
            account.setBalance(request.getBalance());
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
    // New overload
    public List<AccountResponse> getAccountsByUserId(Long userId, String status) {
        if (status != null && !status.isEmpty()) {
            try {
                AccountStatus required = AccountStatus.valueOf(status.toUpperCase());
                List<Account> accounts = accountRepository.findByCustomerIdAndStatus(userId, required);
                return accounts.stream().map(this::toResponse).collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // ignore, fallback
            }
        }
        // fallback to all
        return getAccountsByUserId(userId);
    }
    
    private String generateAccountNumber() {
        Random random = new Random();
        long number = 1000000000L + (long)(random.nextDouble() * 9000000000L);
        return String.valueOf(number);
    }
    
    private AccountResponse toResponse(Account account) {
        String accountType = account.getAccountType() != null ? account.getAccountType().name() : null;
        String status = account.getStatus() != null ? account.getStatus().name() : null;
        return AccountResponse.builder()
            .id(account.getId())
            .customerId(account.getCustomerId())
            .accountNumber(account.getAccountNumber())
            .accountType(accountType)
            .balance(account.getBalance())
            .currency(account.getCurrency())
            .status(status)
            .createdAt(account.getCreatedAt())
            .updatedAt(account.getUpdatedAt())
            .build();
    }

    public List<AccountResponse> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream().map(this::toResponse).collect(Collectors.toList());
    }
}

