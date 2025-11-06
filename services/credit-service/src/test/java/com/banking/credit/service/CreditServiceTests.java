package com.banking.credit.service;

import com.banking.credit.dto.*;
import com.banking.credit.entity.CreditProduct;
import com.banking.credit.enums.CreditProductStatus;
import com.banking.credit.enums.CreditProductType;
import com.banking.credit.repository.CreditProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreditServiceTests {

    @Mock private CreditProductRepository repo;
    @InjectMocks private CreditService service;

    @Test
    @DisplayName("getPendingApprovals maps correctly")
    void getPendingApprovals_ok() {
        CreditProduct p = CreditProduct.builder()
                .id(1L).customerId(9L)
                .productType(CreditProductType.LOAN)
                .status(CreditProductStatus.PENDING)
                .build();
        when(repo.findByStatus(CreditProductStatus.PENDING)).thenReturn(List.of(p));
        List<ApprovalResponse> list = service.getPendingApprovals();
        assertEquals(1, list.size());
        assertEquals("LOAN_APPLICATION", list.get(0).getType());
    }

    @Test
    @DisplayName("updateCreditProduct invalid status throws")
    void updateCreditProduct_invalidStatus() {
        CreditProduct p = CreditProduct.builder().id(2L).status(CreditProductStatus.PENDING).build();
        when(repo.findById(2L)).thenReturn(Optional.of(p));
        CreditProductUpdateRequest req = new CreditProductUpdateRequest();
        req.setStatus("NOT_VALID");
        assertThrows(RuntimeException.class, () -> service.updateCreditProduct(2L, req));
    }

    @Test
    @DisplayName("closeCreditProduct sets CLOSED")
    void closeCreditProduct_ok() {
        CreditProduct p = CreditProduct.builder().id(3L).status(CreditProductStatus.ACTIVE).build();
        when(repo.findById(3L)).thenReturn(Optional.of(p));
        service.closeCreditProduct(3L);
        assertEquals(CreditProductStatus.CLOSED, p.getStatus());
        verify(repo).save(p);
    }
}

