package com.banking.payment.service;

import com.banking.payment.dto.*;
import com.banking.payment.entity.Payment;
import com.banking.payment.enums.PaymentStatus;
import com.banking.payment.enums.PaymentType;
import com.banking.payment.repository.PaymentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTests {

    @Mock private PaymentRepository repo;
    @InjectMocks private PaymentService service;

    @Test
    @DisplayName("createTransfer sets COMPLETED for small amount")
    void createTransfer_smallAmount() {
        when(repo.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));
        TransferRequest req = new TransferRequest(1L, 2L, new BigDecimal("100.00"), null, null);
        PaymentResponse resp = service.createTransfer(req);
        assertEquals("COMPLETED", resp.getStatus());
    }

    @Test
    @DisplayName("createTransfer sets PENDING for large amount")
    void createTransfer_largeAmount() {
        when(repo.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));
        TransferRequest req = new TransferRequest(1L, 2L, new BigDecimal("50001"), "USD", "d");
        PaymentResponse resp = service.createTransfer(req);
        assertEquals("PENDING", resp.getStatus());
    }

    @Test
    @DisplayName("updatePayment invalid status throws")
    void updatePayment_invalidStatus() {
        Payment p = Payment.builder().id(2L).status(PaymentStatus.PENDING).build();
        when(repo.findById(2L)).thenReturn(Optional.of(p));
        PaymentUpdateRequest req = new PaymentUpdateRequest();
        req.setStatus("NOT_VALID");
        assertThrows(RuntimeException.class, () -> service.updatePayment(2L, req));
    }

    @Test
    @DisplayName("cancelPayment sets FAILED")
    void cancelPayment_ok() {
        Payment p = Payment.builder().id(3L).status(PaymentStatus.PENDING).build();
        when(repo.findById(3L)).thenReturn(Optional.of(p));
        service.cancelPayment(3L);
        assertEquals(PaymentStatus.FAILED, p.getStatus());
        verify(repo).save(p);
    }
}

