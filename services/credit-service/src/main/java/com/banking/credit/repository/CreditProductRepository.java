package com.banking.credit.repository;

import com.banking.credit.entity.CreditProduct;
import com.banking.credit.enums.CreditProductStatus;
import com.banking.credit.enums.CreditProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreditProductRepository extends JpaRepository<CreditProduct, Long> {
    List<CreditProduct> findByCustomerId(Long customerId);
    List<CreditProduct> findByStatus(CreditProductStatus status);
    List<CreditProduct> findByProductType(CreditProductType productType);
}

