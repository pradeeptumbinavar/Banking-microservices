package com.banking.customer.service;

import com.banking.customer.dto.*;
import com.banking.customer.entity.Customer;
import com.banking.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import com.banking.customer.enums.KYCStatus;
import com.banking.customer.dto.ActiveCustomerSummary;

@Service
@RequiredArgsConstructor
public class CustomerService {
    
    private final CustomerRepository customerRepository;
    
    @Transactional
    public CustomerResponse createCustomer(Long userId, CustomerRequest request) {
        Customer customer = Customer.builder()
            .userId(userId)
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .address(request.getAddress())
            .kycStatus(KYCStatus.PENDING)
            .build();
        
        customer = customerRepository.save(customer);
        return toResponse(customer);
    }
    
    public CustomerResponse getCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        return toResponse(customer);
    }
    
    public CustomerResponse getCustomerByUserId(Long userId) {
        Customer customer = customerRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Customer not found for user ID: " + userId));
        return toResponse(customer);
    }
    
    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        
        customer = customerRepository.save(customer);
        return toResponse(customer);
    }
    
    @Transactional
    public CustomerResponse submitKyc(Long id, KycRequest request) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        customer.setKycDocumentType(request.getDocumentType());
        customer.setKycDocumentNumber(request.getDocumentNumber());
        customer.setKycStatus(KYCStatus.PENDING);
        
        customer = customerRepository.save(customer);
        return toResponse(customer);
    }
    
    public List<ApprovalResponse> getPendingApprovals() {
        List<Customer> pendingCustomers = customerRepository.findByKycStatus(KYCStatus.PENDING);
        
        return pendingCustomers.stream()
            .map(c -> new ApprovalResponse(
                c.getId(),
                "CUSTOMER_KYC",
                c.getKycStatus().name(),
                "KYC approval for " + c.getFirstName() + " " + c.getLastName()
            ))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void bulkApprove(ApprovalRequest request) {
        List<Customer> customers = customerRepository.findAllById(request.getIds());
        
        customers.forEach(c -> c.setKycStatus(KYCStatus.valueOf(request.getStatus().toUpperCase())));
        customerRepository.saveAll(customers);
    }
    
    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        customerRepository.delete(customer);
    }
    
    @Transactional
    public CustomerResponse updateCustomerStatus(Long id, String status) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        // Validate status
        try {
            KYCStatus kycStatus = KYCStatus.valueOf(status.toUpperCase());
            customer.setKycStatus(kycStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
        
        customer = customerRepository.save(customer);
        return toResponse(customer);
    }
    
    public List<CustomerResponse> searchCustomers(String name, String email, String phone) {
        List<Customer> customers;
        
        if (name != null && !name.isEmpty()) {
            customers = customerRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
        } else if (email != null && !email.isEmpty()) {
            customers = customerRepository.findByEmailContainingIgnoreCase(email);
        } else if (phone != null && !phone.isEmpty()) {
            customers = customerRepository.findByPhoneContaining(phone);
        } else {
            customers = customerRepository.findAll();
        }
        
        return customers.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public List<ActiveCustomerSummary> getActiveKycCustomers() {
        List<Customer> actives = customerRepository.findByKycStatus(KYCStatus.APPROVED);
        return actives.stream()
            .map(c -> new ActiveCustomerSummary(c.getId(), c.getFirstName(), c.getLastName()))
            .collect(Collectors.toList());
    }

    public List<CustomerResponse> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream().map(this::toResponse).collect(Collectors.toList());
    }
    
    private CustomerResponse toResponse(Customer customer) {
        String kycStatus = customer.getKycStatus() != null ? customer.getKycStatus().name() : null;
        return CustomerResponse.builder()
            .id(customer.getId())
            .userId(customer.getUserId())
            .firstName(customer.getFirstName())
            .lastName(customer.getLastName())
            .email(customer.getEmail())
            .phone(customer.getPhone())
            .address(customer.getAddress())
            .kycStatus(kycStatus)
            .createdAt(customer.getCreatedAt())
            .updatedAt(customer.getUpdatedAt())
            .build();
    }
}

