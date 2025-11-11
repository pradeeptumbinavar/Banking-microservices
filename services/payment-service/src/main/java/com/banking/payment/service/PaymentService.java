package com.banking.payment.service;

import com.banking.payment.dto.*;
import com.banking.payment.entity.Payment;
import com.banking.payment.repository.PaymentRepository;
import com.banking.payment.feign.AccountServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import com.banking.payment.enums.PaymentStatus;
import com.banking.payment.enums.PaymentType;

@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final AccountServiceClient accountServiceClient;
    
    @Transactional
    public PaymentResponse createTransfer(TransferRequest request) {
        // Approval threshold: amounts greater than 50,000 require approval (PENDING)
        // Otherwise, auto-complete the payment (COMPLETED)
        var amount = request.getAmount();
        var threshold = new java.math.BigDecimal("50000");
        var status = (amount != null && amount.compareTo(threshold) > 0)
            ? PaymentStatus.PENDING
            : PaymentStatus.COMPLETED;

        Payment payment = Payment.builder()
            .fromAccountId(request.getFromAccountId())
            .toAccountId(request.getToAccountId())
            .amount(request.getAmount())
            .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
            .paymentType(PaymentType.TRANSFER)
            .status(status)
            .description(request.getDescription())
            .build();
        
        payment = paymentRepository.save(payment);
        return toResponse(payment);
    }
    
    public PaymentResponse getPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        return toResponse(payment);
    }
    
    public List<ApprovalResponse> getPendingApprovals() {
        List<Payment> pendingPayments = paymentRepository.findByStatus(PaymentStatus.PENDING);
        
        return pendingPayments.stream()
            .map(p -> new ApprovalResponse(
                p.getId(),
                "LARGE_PAYMENT",
                p.getStatus().name(),
                "Payment of " + p.getAmount() + " " + p.getCurrency() + " from account " + p.getFromAccountId()
            ))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void bulkApprove(ApprovalRequest request) {
        List<Payment> payments = paymentRepository.findAllById(request.getIds());
        
        payments.forEach(p -> p.setStatus(PaymentStatus.valueOf(request.getStatus().toUpperCase())));
        paymentRepository.saveAll(payments);
    }
    
    @Transactional
    public PaymentResponse updatePayment(Long id, PaymentUpdateRequest request) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        if (request.getStatus() != null) {
            try {
                PaymentStatus status = PaymentStatus.valueOf(request.getStatus().toUpperCase());
                payment.setStatus(status);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status: " + request.getStatus());
            }
        }
        
        if (request.getDescription() != null) {
            payment.setDescription(request.getDescription());
        }
        
        payment = paymentRepository.save(payment);
        return toResponse(payment);
    }
    
    @Transactional
    public void cancelPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        payment.setStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);
    }
    
    public List<PaymentResponse> getPaymentsByUserId(Long userId) {
        // Resolve user's account IDs from account-service (treat userId as customerId)
        List<AccountServiceClient.AccountSummary> accounts = accountServiceClient.getAccountsByUserId(userId, null);
        List<Long> ids = accounts != null ? accounts.stream().map(a -> a.id).collect(Collectors.toList()) : List.of();
        List<Payment> payments;
        if (ids.isEmpty()) {
            // Fallback to legacy behavior to avoid empty screens if lookup fails
            payments = paymentRepository.findByFromAccountIdOrToAccountId(userId, userId);
        } else {
            payments = paymentRepository.findByFromAccountIdInOrToAccountIdIn(ids, ids);
        }
        return payments.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    private PaymentResponse toResponse(Payment payment) {
        String paymentType = payment.getPaymentType() != null ? payment.getPaymentType().name() : null;
        String status = payment.getStatus() != null ? payment.getStatus().name() : null;
        return PaymentResponse.builder()
            .id(payment.getId())
            .fromAccountId(payment.getFromAccountId())
            .toAccountId(payment.getToAccountId())
            .amount(payment.getAmount())
            .currency(payment.getCurrency())
            .paymentType(paymentType)
            .status(status)
            .description(payment.getDescription())
            .createdAt(payment.getCreatedAt())
            .updatedAt(payment.getUpdatedAt())
            .build();
    }

    public List<PaymentResponse> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return payments.stream().map(this::toResponse).collect(Collectors.toList());
    }
}

