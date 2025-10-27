package com.banking.customer.repository;

import com.banking.customer.entity.Customer;
import com.banking.customer.enums.KYCStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUserId(Long userId);
    Optional<Customer> findByEmail(String email);
    List<Customer> findByKycStatus(KYCStatus kycStatus);
    List<Customer> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    List<Customer> findByEmailContainingIgnoreCase(String email);
    List<Customer> findByPhoneContaining(String phone);
}

