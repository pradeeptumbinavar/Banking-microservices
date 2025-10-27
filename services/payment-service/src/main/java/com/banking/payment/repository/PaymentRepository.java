package com.banking.payment.repository;

import com.banking.payment.entity.Payment;
import com.banking.payment.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByFromAccountId(Long fromAccountId);
    List<Payment> findByToAccountId(Long toAccountId);
    List<Payment> findByStatus(PaymentStatus status);
    List<Payment> findByFromAccountIdOrToAccountId(Long fromAccountId, Long toAccountId);
}

