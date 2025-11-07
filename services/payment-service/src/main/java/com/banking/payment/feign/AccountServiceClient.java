package com.banking.payment.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
        name = "account-service",
        path = "/accounts",
        configuration = com.banking.payment.config.FeignConfig.class
)
public interface AccountServiceClient {

    @GetMapping("/user/{userId}")
    List<AccountSummary> getAccountsByUserId(@PathVariable("userId") Long userId,
                                             @RequestParam(name = "status", required = false) String status);

    class AccountSummary {
        public Long id;
        public Long customerId;
        public String accountNumber;
    }
}

