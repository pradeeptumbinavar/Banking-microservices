package com.banking.payment.service;

import com.banking.payment.dto.*;
import com.banking.payment.entity.Payment;
import com.banking.payment.repository.PaymentRepository;
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
    
    @Transactional
    public PaymentResponse createTransfer(TransferRequest request) {
        Payment payment = Payment.builder()
            .fromAccountId(request.getFromAccountId())
            .toAccountId(request.getToAccountId())
            .amount(request.getAmount())
            .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
            .paymentType(PaymentType.TRANSFER)
            .status(PaymentStatus.PENDING)
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
        // Note: This would require joining with account service to get user's accounts
        // For now, we'll return payments where userId matches fromAccountId or toAccountId
        // In a real implementation, you'd need to call account service to get user's account IDs
        List<Payment> payments = paymentRepository.findByFromAccountIdOrToAccountId(userId, userId);
        return payments.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
            .id(payment.getId())
            .fromAccountId(payment.getFromAccountId())
            .toAccountId(payment.getToAccountId())
            .amount(payment.getAmount())
            .currency(payment.getCurrency())
            .paymentType(payment.getPaymentType().name())
            .status(payment.getStatus().name())
            .description(payment.getDescription())
            .createdAt(payment.getCreatedAt())
            .updatedAt(payment.getUpdatedAt())
            .build();
    }
}

