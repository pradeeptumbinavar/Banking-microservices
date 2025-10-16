package com.banking.customer.service;

import com.banking.customer.dto.*;
import com.banking.customer.entity.Customer;
import com.banking.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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
            .kycStatus("PENDING")
            .build();
        
        customer = customerRepository.save(customer);
        return toResponse(customer);
    }
    
    public CustomerResponse getCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
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
        customer.setKycStatus("PENDING");
        
        customer = customerRepository.save(customer);
        return toResponse(customer);
    }
    
    public List<ApprovalResponse> getPendingApprovals() {
        List<Customer> pendingCustomers = customerRepository.findByKycStatus("PENDING");
        
        return pendingCustomers.stream()
            .map(c -> new ApprovalResponse(
                c.getId(),
                "CUSTOMER_KYC",
                c.getKycStatus(),
                "KYC approval for " + c.getFirstName() + " " + c.getLastName()
            ))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void bulkApprove(ApprovalRequest request) {
        List<Customer> customers = customerRepository.findAllById(request.getIds());
        
        customers.forEach(c -> c.setKycStatus(request.getStatus()));
        customerRepository.saveAll(customers);
    }
    
    private CustomerResponse toResponse(Customer customer) {
        return CustomerResponse.builder()
            .id(customer.getId())
            .userId(customer.getUserId())
            .firstName(customer.getFirstName())
            .lastName(customer.getLastName())
            .email(customer.getEmail())
            .phone(customer.getPhone())
            .address(customer.getAddress())
            .kycStatus(customer.getKycStatus())
            .createdAt(customer.getCreatedAt())
            .updatedAt(customer.getUpdatedAt())
            .build();
    }
}

