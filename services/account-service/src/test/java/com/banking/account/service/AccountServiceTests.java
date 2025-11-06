package com.banking.account.service;

import com.banking.account.dto.*;
import com.banking.account.entity.Account;
import com.banking.account.enums.AccountStatus;
import com.banking.account.enums.AccountType;
import com.banking.account.repository.AccountRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTests {

    @Mock private AccountRepository accountRepository;
    @InjectMocks private AccountService accountService;

    @Test
    @DisplayName("createAccount sets defaults and saves")
    void createAccount_ok() {
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> {
            Account a = inv.getArgument(0);
            a.setId(100L);
            a.setCreatedAt(LocalDateTime.now());
            a.setUpdatedAt(LocalDateTime.now());
            return a;
        });

        AccountRequest req = new AccountRequest(1L, "SAVINGS", null);
        AccountResponse resp = accountService.createAccount(req);

        assertNotNull(resp.getAccountNumber());
        assertEquals("USD", resp.getCurrency());
        assertEquals("PENDING", resp.getStatus());
        assertEquals(1L, resp.getCustomerId());
    }

    @Test
    @DisplayName("getAccount throws when not found")
    void getAccount_notFound() {
        when(accountRepository.findById(9L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> accountService.getAccount(9L));
    }

    @Test
    @DisplayName("getBalance returns values")
    void getBalance_ok() {
        Account acc = Account.builder()
                .id(2L).accountNumber("A-1").balance(new BigDecimal("10.00"))
                .currency("USD").build();
        when(accountRepository.findById(2L)).thenReturn(Optional.of(acc));

        BalanceResponse br = accountService.getBalance(2L);
        assertEquals("A-1", br.getAccountNumber());
        assertEquals(new BigDecimal("10.00"), br.getBalance());
    }

    @Test
    @DisplayName("getPendingApprovals maps entities to responses")
    void getPendingApprovals_ok() {
        Account a = Account.builder().id(1L).customerId(5L)
                .accountType(AccountType.SAVINGS).status(AccountStatus.PENDING).build();
        when(accountRepository.findByStatus(AccountStatus.PENDING)).thenReturn(List.of(a));

        List<ApprovalResponse> list = accountService.getPendingApprovals();
        assertEquals(1, list.size());
        assertEquals("ACCOUNT_OPENING", list.get(0).getType());
    }

    @Test
    @DisplayName("bulkApprove updates statuses and saves")
    void bulkApprove_ok() {
        Account a = Account.builder().id(1L).status(AccountStatus.PENDING).build();
        when(accountRepository.findAllById(any())).thenReturn(List.of(a));

        accountService.bulkApprove(new ApprovalRequest(List.of(1L), "ACTIVE"));

        ArgumentCaptor<List<Account>> captor = ArgumentCaptor.forClass(List.class);
        verify(accountRepository).saveAll(captor.capture());
        assertEquals(AccountStatus.ACTIVE, captor.getValue().get(0).getStatus());
    }

    @Test
    @DisplayName("updateAccount modifies balance and saves")
    void updateAccount_ok() {
        Account a = Account.builder()
                .id(3L)
                .balance(new BigDecimal("5.00"))
                .accountType(AccountType.SAVINGS)
                .status(AccountStatus.ACTIVE)
                .currency("USD")
                .build();
        when(accountRepository.findById(3L)).thenReturn(Optional.of(a));
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));

        AccountUpdateRequest req = new AccountUpdateRequest();
        req.setBalance(new BigDecimal("9.99"));
        AccountResponse resp = accountService.updateAccount(3L, req);
        assertEquals(new BigDecimal("9.99"), resp.getBalance());
    }

    @Test
    @DisplayName("updateAccount throws when not found")
    void updateAccount_notFound() {
        when(accountRepository.findById(33L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> accountService.updateAccount(33L, new AccountUpdateRequest()));
    }

    @Test
    @DisplayName("getAccountsByUserId with valid status filters by status")
    void getAccountsByUserId_filtered() {
        when(accountRepository.findByCustomerIdAndStatus(10L, AccountStatus.ACTIVE)).thenReturn(List.of());
        accountService.getAccountsByUserId(10L, "ACTIVE");
        verify(accountRepository).findByCustomerIdAndStatus(10L, AccountStatus.ACTIVE);
    }

    @Test
    @DisplayName("getAccountsByUserId with invalid status falls back to all")
    void getAccountsByUserId_invalidStatus() {
        when(accountRepository.findByCustomerId(10L)).thenReturn(List.of());
        accountService.getAccountsByUserId(10L, "NOT_A_STATUS");
        verify(accountRepository).findByCustomerId(10L);
    }

    @Test
    @DisplayName("closeAccount sets CLOSED")
    void closeAccount_ok() {
        Account a = Account.builder().id(7L).status(AccountStatus.ACTIVE).build();
        when(accountRepository.findById(7L)).thenReturn(Optional.of(a));
        accountService.closeAccount(7L);
        assertEquals(AccountStatus.CLOSED, a.getStatus());
        verify(accountRepository).save(a);
    }
}
