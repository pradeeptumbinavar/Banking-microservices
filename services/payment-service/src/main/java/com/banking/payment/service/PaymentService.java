package com.banking.payment.service;

import com.banking.payment.dto.*;
import com.banking.payment.entity.Payment;
import com.banking.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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
            .paymentType("TRANSFER")
            .status("PENDING")
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
        List<Payment> pendingPayments = paymentRepository.findByStatus("PENDING");
        
        return pendingPayments.stream()
            .map(p -> new ApprovalResponse(
                p.getId(),
                "LARGE_PAYMENT",
                p.getStatus(),
                "Payment of " + p.getAmount() + " " + p.getCurrency() + " from account " + p.getFromAccountId()
            ))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void bulkApprove(ApprovalRequest request) {
        List<Payment> payments = paymentRepository.findAllById(request.getIds());
        
        payments.forEach(p -> p.setStatus(request.getStatus()));
        paymentRepository.saveAll(payments);
    }
    
    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
            .id(payment.getId())
            .fromAccountId(payment.getFromAccountId())
            .toAccountId(payment.getToAccountId())
            .amount(payment.getAmount())
            .currency(payment.getCurrency())
            .paymentType(payment.getPaymentType())
            .status(payment.getStatus())
            .description(payment.getDescription())
            .createdAt(payment.getCreatedAt())
            .updatedAt(payment.getUpdatedAt())
            .build();
    }
}

