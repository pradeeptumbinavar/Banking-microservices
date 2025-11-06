package com.banking.customer.service;

import com.banking.customer.dto.*;
import com.banking.customer.entity.Customer;
import com.banking.customer.enums.KYCStatus;
import com.banking.customer.repository.CustomerRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTests {

    @Mock private CustomerRepository repo;
    @InjectMocks private CustomerService service;

    @Test
    @DisplayName("getCustomer throws when not found")
    void getCustomer_notFound() {
        when(repo.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getCustomer(1L));
    }

    @Test
    @DisplayName("updateCustomerStatus invalid status throws")
    void updateCustomerStatus_invalid() {
        Customer c = Customer.builder().id(2L).kycStatus(KYCStatus.PENDING).build();
        when(repo.findById(2L)).thenReturn(Optional.of(c));
        assertThrows(RuntimeException.class, () -> service.updateCustomerStatus(2L, "NOT_VALID"));
    }

    @Test
    @DisplayName("searchCustomers by name delegates to repository")
    void searchCustomers_byName() {
        when(repo.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase("jo", "jo"))
                .thenReturn(List.of());
        service.searchCustomers("jo", null, null);
        verify(repo).findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase("jo", "jo");
    }

    @Test
    @DisplayName("getActiveKycCustomers maps results")
    void getActiveKycCustomers_ok() {
        Customer c = Customer.builder().id(3L).firstName("A").lastName("B").kycStatus(KYCStatus.APPROVED).build();
        when(repo.findByKycStatus(KYCStatus.APPROVED)).thenReturn(List.of(c));
        List<ActiveCustomerSummary> list = service.getActiveKycCustomers();
        assertEquals(1, list.size());
        assertEquals(3L, list.get(0).getId());
    }
}

