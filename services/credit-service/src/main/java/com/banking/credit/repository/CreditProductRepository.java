package com.banking.credit.repository;

import com.banking.credit.entity.CreditProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreditProductRepository extends JpaRepository<CreditProduct, Long> {
    List<CreditProduct> findByCustomerId(Long customerId);
    List<CreditProduct> findByStatus(String status);
    List<CreditProduct> findByProductType(String productType);
}

